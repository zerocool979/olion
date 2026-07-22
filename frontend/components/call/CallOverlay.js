import { useContext, useEffect, useRef } from 'react'
import { CallContext } from '../../context/CallContext'
import { Avatar, colors } from '../dashboard'

function CircleBtn({ onClick, active, danger, children, label }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} style={{
      width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: danger ? '#ef4444' : active ? '#fff' : 'rgba(255,255,255,0.15)',
      color: danger ? '#fff' : active ? '#000' : '#fff',
      transition: 'background 0.15s',
    }}>
      {children}
    </button>
  )
}

export default function CallOverlay() {
  const call = useContext(CallContext)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const ringToneRef = useRef(null)

  const { callState, callType, remoteUser, localStream, remoteStream, muted, cameraOff, callError } = call

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream
  }, [localStream])

  useEffect(() => {
    if (callType === 'video' && remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream
    if (callType === 'audio' && remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream
  }, [remoteStream, callType])

  // Nada dering sederhana pakai Web Audio API — tidak butuh file audio eksternal
  useEffect(() => {
    if (callState !== 'incoming') {
      ringToneRef.current?.stop?.()
      ringToneRef.current = null
      return
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    let stopped = false
    const beep = () => {
      if (stopped) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    }
    beep()
    const interval = setInterval(beep, 1200)
    ringToneRef.current = { stop: () => { stopped = true; clearInterval(interval); ctx.close() } }
    return () => { stopped = true; clearInterval(interval); ctx.close() }
  }, [callState])

  useEffect(() => {
    if (!callError) return
    const t = setTimeout(() => call.clearError(), 4000)
    return () => clearTimeout(t)
  }, [callError, call])

  if (callState === 'idle') {
    return callError ? (
      <div style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        background: '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: 20,
        fontSize: 13.5, fontWeight: 600, zIndex: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        {callError}
      </div>
    ) : null
  }

  const username = remoteUser?.username ?? 'Pengguna'

  // ── Panggilan masuk ──────────────────────────────────────────────────────
  if (callState === 'incoming') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Avatar username={username} size={100} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{username}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
            {callType === 'video' ? '📹 Panggilan video masuk…' : '📞 Panggilan suara masuk…'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, marginTop: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <CircleBtn onClick={call.rejectCall} danger label="Tolak">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.46l-5.27-.61a2 2 0 00-1.72.57l-2.06 2.06a15.14 15.14 0 01-6.44-6.44l2.06-2.06a2 2 0 00.57-1.72L7.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97l-.03-5.51z" transform="rotate(135 12 12)"/></svg>
            </CircleBtn>
            <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>Tolak</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <CircleBtn onClick={call.acceptCall} active label="Terima">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.46l-5.27-.61a2 2 0 00-1.72.57l-2.06 2.06a15.14 15.14 0 01-6.44-6.44l2.06-2.06a2 2 0 00.57-1.72L7.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97l-.03-5.51z"/></svg>
            </CircleBtn>
            <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>Terima</div>
          </div>
        </div>
      </div>
    )
  }

  // ── Menghubungi (belum diangkat) ─────────────────────────────────────────
  if (callState === 'outgoing') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <Avatar username={username} size={100} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{username}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>Menghubungi…</div>
        </div>
        <CircleBtn onClick={call.hangUp} danger label="Batalkan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.46l-5.27-.61a2 2 0 00-1.72.57l-2.06 2.06a15.14 15.14 0 01-6.44-6.44l2.06-2.06a2 2 0 00.57-1.72L7.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97l-.03-5.51z" transform="rotate(135 12 12)"/></svg>
        </CircleBtn>
      </div>
    )
  }

  // ── Panggilan aktif ───────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 500, display: 'flex', flexDirection: 'column' }}>
      <audio ref={remoteAudioRef} autoPlay />

      {callType === 'video' ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#111' }} />
          <video ref={localVideoRef} autoPlay playsInline muted style={{
            position: 'absolute', top: 16, right: 16, width: 100, height: 140,
            objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)',
          }} />
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: 20, color: '#fff', fontSize: 13, fontWeight: 600 }}>
            {username}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Avatar username={username} size={120} />
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{username}</div>
          <div style={{ fontSize: 13, color: colors.textSecondary }}>📞 Panggilan suara berlangsung</div>
        </div>
      )}

      <div style={{ padding: '20px 0 32px', display: 'flex', justifyContent: 'center', gap: 18, background: 'rgba(0,0,0,0.4)' }}>
        <CircleBtn onClick={call.toggleMute} active={muted} label={muted ? 'Nyalakan mic' : 'Matikan mic'}>
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          )}
        </CircleBtn>

        {callType === 'video' && (
          <CircleBtn onClick={call.toggleCamera} active={cameraOff} label={cameraOff ? 'Nyalakan kamera' : 'Matikan kamera'}>
            {cameraOff ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            )}
          </CircleBtn>
        )}

        <CircleBtn onClick={call.hangUp} danger label="Akhiri panggilan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.46l-5.27-.61a2 2 0 00-1.72.57l-2.06 2.06a15.14 15.14 0 01-6.44-6.44l2.06-2.06a2 2 0 00.57-1.72L7.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97l-.03-5.51z" transform="rotate(135 12 12)"/></svg>
        </CircleBtn>
      </div>
    </div>
  )
}
