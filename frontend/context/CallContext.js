import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext'
import api from '../lib/api'

export const CallContext = createContext(null)

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')

export function CallProvider({ children }) {
  const { token, user } = useContext(AuthContext)

  // 'idle' | 'outgoing' | 'incoming' | 'active'
  const [callState, setCallState]     = useState('idle')
  const [callType, setCallType]       = useState('audio') // 'audio' | 'video'
  const [remoteUser, setRemoteUser]   = useState(null)     // { id, username }
  const [conversationId, setConversationId] = useState(null)
  const [localStream, setLocalStream]   = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [muted, setMuted]         = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [callError, setCallError] = useState('')

  const socketRef = useRef(null)
  const pcRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const iceServersRef = useRef([{ urls: 'stun:stun.l.google.com:19302' }])
  const remoteUserRef = useRef(null) // ref bayangan state, dibaca dari dalam socket handler (hindari closure basi)
  const callStateRef = useRef('idle')

  useEffect(() => { callStateRef.current = callState }, [callState])

  useEffect(() => { remoteUserRef.current = remoteUser }, [remoteUser])

  // ── Koneksi Socket.IO — hidup selama user login, dipakai buat sinyal WebRTC ──
  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    const socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('call:incoming', ({ fromUserId, fromUsername, conversationId: cid, callType: type }) => {
      // FIX: `callState` di sini adalah closure dari render SAAT EFFECT INI
      // pertama kali jalan (deps cuma [token]) — tidak pernah ter-update lagi
      // walau state aslinya sudah berubah, jadi cek "lagi sibuk atau tidak"
      // selalu salah (selalu menganggap 'idle'). Pakai ref yang di-sync tiap
      // render supaya selalu baca nilai TERBARU.
      if (callStateRef.current !== 'idle') {
        socket.emit('call:reject', { toUserId: fromUserId })
        return
      }
      setRemoteUser({ id: fromUserId, username: fromUsername })
      setConversationId(cid)
      setCallType(type)
      setCallState('incoming')
    })

    socket.on('call:accepted', async ({ fromUserId }) => {
      // Kita adalah CALLER, lawan bicara baru saja menerima → mulai negosiasi WebRTC
      try {
        await setupPeerConnection(fromUserId, true)
        setCallState('active')
      } catch (err) {
        setCallError('Gagal mengakses kamera/mikrofon: ' + err.message)
        hangUp(fromUserId)
      }
    })

    socket.on('call:rejected', () => {
      setCallError('Panggilan ditolak.')
      cleanupCall()
    })

    socket.on('call:cancelled', () => {
      setCallError('Panggilan dibatalkan.')
      cleanupCall()
    })

    socket.on('call:busy', () => {
      setCallError('Lawan bicara sedang dalam panggilan lain.')
      cleanupCall()
    })

    socket.on('call:offline', () => {
      setCallError('Pengguna sedang tidak online.')
      cleanupCall()
    })

    socket.on('call:ended', () => {
      cleanupCall()
    })

    socket.on('call:signal', async ({ fromUserId, signal }) => {
      try {
        if (signal.type === 'offer') {
          // Kita adalah CALLEE — siapkan peer connection kalau belum ada, lalu jawab
          if (!pcRef.current) await setupPeerConnection(fromUserId, false)
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp))
          const answer = await pcRef.current.createAnswer()
          await pcRef.current.setLocalDescription(answer)
          socket.emit('call:signal', { toUserId: fromUserId, signal: { type: 'answer', sdp: answer } })
        } else if (signal.type === 'answer') {
          await pcRef.current?.setRemoteDescription(new RTCSessionDescription(signal.sdp))
        } else if (signal.type === 'ice-candidate' && signal.candidate) {
          try { await pcRef.current?.addIceCandidate(new RTCIceCandidate(signal.candidate)) } catch { /* kandidat basi, aman diabaikan */ }
        }
      } catch (err) {
        console.error('[call] gagal proses sinyal:', err)
      }
    })

    return () => socket.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const fetchIceServers = useCallback(async () => {
    try {
      const res = await api.get('/chat/ice-servers')
      if (res.data?.iceServers?.length) iceServersRef.current = res.data.iceServers
    } catch { /* fallback ke STUN default kalau gagal ambil config */ }
  }, [])

  async function setupPeerConnection(otherUserId, isCaller) {
    await fetchIceServers()
    const pc = new RTCPeerConnection({ iceServers: iceServersRef.current })
    pcRef.current = pc

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'video',
    })
    localStreamRef.current = stream
    setLocalStream(stream)
    stream.getTracks().forEach(track => pc.addTrack(track, stream))

    pc.ontrack = (e) => {
      // FIX: sebelumnya bikin `new MediaStream()` baru setiap event `ontrack`
      // lalu nambah 1 track ke situ — tapi audio & video biasanya datang
      // lewat 2 event ontrack TERPISAH. Membuat MediaStream baru tiap kali
      // artinya track dari event sebelumnya (mis. audio) ketiban/hilang saat
      // video datang, karena React men-timpa state dengan objek yang cuma
      // punya 1 track. Sekarang satu MediaStream persisten di ref, semua
      // track diakumulasi ke situ, baru di-set ke state.
      if (!remoteStreamRef.current) remoteStreamRef.current = new MediaStream()
      remoteStreamRef.current.addTrack(e.track)
      setRemoteStream(remoteStreamRef.current)
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit('call:signal', {
          toUserId: otherUserId,
          signal: { type: 'ice-candidate', candidate: e.candidate },
        })
      }
    }

    pc.onconnectionstatechange = () => {
      // Sama seperti bug di atas — cek pakai ref, bukan closure `callState`
      // yang beku dari saat peer connection ini dibuat (waktu itu statusnya
      // masih 'outgoing'/'incoming', bukan 'active').
      if (pc.connectionState === 'failed' && callStateRef.current === 'active') {
        setCallError('Koneksi panggilan terputus.')
        cleanupCall()
      }
    }

    if (isCaller) {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socketRef.current?.emit('call:signal', { toUserId: otherUserId, signal: { type: 'offer', sdp: offer } })
    }

    return pc
  }

  const startCall = useCallback(async (toUserId, toUsername, cid, type) => {
    setCallError('')
    setCallType(type)
    setRemoteUser({ id: toUserId, username: toUsername })
    setConversationId(cid)
    setCallState('outgoing')
    socketRef.current?.emit('call:invite', { toUserId, conversationId: cid, callType: type })
  }, [])

  const acceptCall = useCallback(async () => {
    const target = remoteUserRef.current
    if (!target) return
    try {
      await setupPeerConnection(target.id, false)
      socketRef.current?.emit('call:accept', { toUserId: target.id })
      setCallState('active')
    } catch (err) {
      setCallError('Gagal mengakses kamera/mikrofon: ' + err.message)
      rejectCall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rejectCall = useCallback(() => {
    const target = remoteUserRef.current
    if (target) socketRef.current?.emit('call:reject', { toUserId: target.id })
    cleanupCall()
  }, [])

  const hangUp = useCallback((targetId) => {
    const id = targetId ?? remoteUserRef.current?.id
    if (id) {
      socketRef.current?.emit(callState === 'outgoing' ? 'call:cancel' : 'call:end', { toUserId: id })
    }
    cleanupCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState])

  function cleanupCall() {
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null
    remoteStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setRemoteUser(null)
    setConversationId(null)
    setCallState('idle')
    setMuted(false)
    setCameraOff(false)
  }

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = muted })
    setMuted(m => !m)
  }, [muted])

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = cameraOff })
    setCameraOff(c => !c)
  }, [cameraOff])

  return (
    <CallContext.Provider value={{
      callState, callType, remoteUser, conversationId,
      localStream, remoteStream, muted, cameraOff, callError,
      startCall, acceptCall, rejectCall, hangUp: () => hangUp(), toggleMute, toggleCamera,
      clearError: () => setCallError(''),
    }}>
      {children}
    </CallContext.Provider>
  )
}
