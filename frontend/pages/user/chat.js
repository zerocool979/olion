/**
 * pages/user/chat.jsx  — Obrolan
 */
import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../context/AuthContext'
import { CallContext } from '../../context/CallContext'
import api from '../../lib/api'
import { Avatar, SkeletonCard, colors } from '../../components/dashboard'
import EmojiPicker from '../../components/chat/EmojiPicker'
import UserLayout from './_layout'

function timeAgo(d) {
  if (!d) return ''
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}j`
  return `${Math.floor(s / 86400)}h`
}

// Backend mengembalikan participants sebagai [{ user: { id, profile } }],
// bukan array flat user — normalisasi supaya konsisten dipakai di UI.
function normaliseMembers(room) {
  const raw = room.participants ?? room.members ?? []
  return raw.map(p => p.user ?? p)
}

export default function Chat() {
  const { user } = useContext(AuthContext)
  const callCtx = useContext(CallContext)
  const router = useRouter()

  const [rooms,        setRooms]        = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [activeRoom,   setActiveRoom]   = useState(null)
  const [messages,     setMessages]     = useState([])
  const [msgLoading,   setMsgLoading]   = useState(false)
  const [draft,        setDraft]        = useState('')
  const [sending,      setSending]      = useState(false)
  const [starting,     setStarting]     = useState(false)
  const [error,        setError]        = useState('')
  const [showEmoji,    setShowEmoji]    = useState(false)
  const [pendingFile,  setPendingFile]  = useState(null)   // { file, previewUrl, type }
  const [uploading,    setUploading]    = useState(false)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)

  const myId = user?.id

  const loadRooms = useCallback((silent = false) => {
    if (!silent) setRoomsLoading(true)
    return api.get('/chat/conversations')
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        const arr = Array.isArray(d) ? d : []
        setRooms(arr)
        return arr
      })
      .catch(() => { if (!silent) setRooms([]); return [] })
      .finally(() => { if (!silent) setRoomsLoading(false) })
  }, [])

  // Load daftar percakapan
  useEffect(() => {
    if (!user) return
    loadRooms()
  }, [user, loadRooms])

  // Deep-link dari halaman lain, mis. tombol "Kirim Pesan" di profil:
  // /user/chat?userId=xxx → otomatis buka/mulai percakapan dengan orang itu.
  useEffect(() => {
    if (!user || !router.isReady) return
    const targetUserId = router.query.userId
    if (!targetUserId || typeof targetUserId !== 'string') return
    if (targetUserId === myId) return

    setStarting(true)
    setError('')
    api.post('/chat/conversations', { userId: targetUserId })
      .then(async (r) => {
        const conv = r.data?.conversation ?? r.data?.data ?? r.data
        await loadRooms()
        setActiveRoom(conv)
        // Bersihkan query param supaya tidak retrigger saat navigasi lain
        router.replace('/user/chat', undefined, { shallow: true })
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? 'Gagal memulai percakapan.')
      })
      .finally(() => setStarting(false))
  }, [user, router.isReady, router.query.userId, myId])

  // Load messages for active room. `silent=true` dipakai untuk polling
  // background — supaya tidak memicu tampilan skeleton yang membuat seluruh
  // panel chat terasa "reload" setiap beberapa detik.
  const loadMessages = useCallback((roomId, silent = false) => {
    if (!silent) setMsgLoading(true)
    return api.get(`/chat/conversations/${roomId}/messages`)
      .then(r => { const d = r.data?.data ?? r.data ?? []; setMessages(Array.isArray(d) ? d : []) })
      .catch(() => { if (!silent) setMessages([]) })
      .finally(() => { if (!silent) setMsgLoading(false) })
  }, [])

  useEffect(() => {
    if (activeRoom) loadMessages(activeRoom.id)
    // Ganti percakapan → batalkan file yang sempat dipilih tapi belum terkirim,
    // dan lepas object URL preview-nya (cegah memory leak)
    setPendingFile(prev => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl)
      return null
    })
    setShowEmoji(false)
  }, [activeRoom, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll pesan tiap 5 detik selagi room aktif dibuka (silent — tanpa skeleton)
  useEffect(() => {
    if (!activeRoom) return
    const t = setInterval(() => loadMessages(activeRoom.id, true), 5000)
    return () => clearInterval(t)
  }, [activeRoom, loadMessages])

  const sendMessage = async () => {
    if ((!draft.trim() && !pendingFile) || !activeRoom || sending) return
    setSending(true)
    const text = draft.trim()
    setDraft('')
    setShowEmoji(false)

    try {
      let attachmentUrl = null, attachmentType = null, attachmentName = null

      if (pendingFile) {
        setUploading(true)
        const fd = new FormData()
        fd.append('file', pendingFile.file)
        const up = await api.post('/chat/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        attachmentUrl = up.data.url
        attachmentType = up.data.type
        attachmentName = up.data.name
        setUploading(false)
      }

      await api.post(`/chat/conversations/${activeRoom.id}/messages`, {
        content: text || undefined,
        attachmentUrl: attachmentUrl || undefined,
        attachmentType: attachmentType || undefined,
        attachmentName: attachmentName || undefined,
      })
      clearPendingFile()
      await loadMessages(activeRoom.id)
      loadRooms(true) // refresh preview pesan terakhir di sidebar (silent, tanpa skeleton)
    } catch (err) {
      setUploading(false)
      setError(err.response?.data?.message ?? 'Gagal mengirim pesan.')
      setDraft(text) // kembalikan draft supaya tidak hilang kalau gagal
    } finally { setSending(false) }
  }

  const handlePickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // supaya bisa pilih file yang sama lagi kalau dibatalkan
    if (!file) return
    if (file.size > 15 * 1024 * 1024) {
      setError('Ukuran file maksimal 15MB')
      return
    }
    const isImage = file.type.startsWith('image/')
    setPendingFile({
      file,
      type: isImage ? 'image' : 'file',
      previewUrl: isImage ? URL.createObjectURL(file) : null,
    })
  }

  const clearPendingFile = () => {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl)
    setPendingFile(null)
  }

  const handleEmojiSelect = (emoji) => {
    setDraft(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const otherUser = (room) => {
    const members = normaliseMembers(room)
    return members.find(m => m.id !== myId) ?? members[0] ?? {}
  }

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 8 }}>Info Chat</span>
      <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
        Semua percakapan bersifat privat. Hanya kamu dan lawan bicara yang dapat melihat pesan ini. Kunjungi profil seseorang dan klik &quot;Kirim Pesan&quot; untuk memulai percakapan baru.
      </p>
    </div>
  )

  return (
    <UserLayout sidebar={sidebar}>
      <div className={`ol-chat-shell${activeRoom ? ' ol-chat-shell--room-open' : ''}`} style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* Room list */}
        <div className="ol-chat-list" style={{ width: 280, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, background: colors.bg }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>💬 Obrolan</h1>
          </div>

          {error && (
            <p role="alert" style={{ padding: '10px 16px', fontSize: 12, color: '#f87171' }}>{error}</p>
          )}

          {starting && (
            <p style={{ padding: '10px 16px', fontSize: 12, color: colors.textSecondary }}>Memulai percakapan…</p>
          )}

          {roomsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.bgElevated }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 13, background: colors.bgElevated, borderRadius: 6, width: '60%', marginBottom: 6 }} />
                    <div style={{ height: 11, background: colors.bgElevated, borderRadius: 6, width: '80%' }} />
                  </div>
                </div>
              ))
            : rooms.length === 0
            ? (
              <div style={{ padding: 24, textAlign: 'center', color: colors.textSecondary }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 13 }}>Belum ada percakapan.</p>
              </div>
            )
            : rooms.map(room => {
                const other   = otherUser(room)
                const uname   = other.profile?.username ?? other.username ?? 'Pengguna'
                const uavatar = other.profile?.avatarUrl ?? null
                const uborder = other.profile?.avatarBorder ?? null
                const lastMsg = room.messages?.[0] ?? room.lastMessage
                const active  = activeRoom?.id === room.id
                return (
                  <div key={room.id} onClick={() => setActiveRoom(room)}
                    style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 10, cursor: 'pointer', background: active ? colors.bgElevated : 'transparent', transition: 'background 0.12s' }}
                    onMouseEnter={e => !active && (e.currentTarget.style.background = colors.bgElevated)}
                    onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                  >
                    <Avatar username={uname} src={uavatar} border={uborder} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary }}>{uname}</span>
                        <span style={{ fontSize: 11, color: colors.textSecondary }}>{timeAgo(lastMsg?.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                        {lastMsg?.content ?? 'Mulai percakapan…'}
                      </p>
                    </div>
                  </div>
                )
              })
          }
        </div>

        {/* Message area */}
        <div className="ol-chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!activeRoom
            ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                  <p style={{ fontSize: 15 }}>Pilih percakapan untuk memulai</p>
                </div>
              </div>
            )
            : (
              <>
                {/* Header */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 10, background: colors.bg, position: 'sticky', top: 0 }}>
                  <button
                    className="ol-chat-back-btn"
                    onClick={() => setActiveRoom(null)}
                    aria-label="Kembali ke daftar percakapan"
                    style={{ background: 'none', border: 'none', color: colors.textPrimary, cursor: 'pointer', padding: 4, alignItems: 'center', flexShrink: 0 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <Avatar
                    username={otherUser(activeRoom).profile?.username ?? otherUser(activeRoom).username ?? '?'}
                    src={otherUser(activeRoom).profile?.avatarUrl ?? null}
                    border={otherUser(activeRoom).profile?.avatarBorder ?? null}
                    size={36}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>
                      {otherUser(activeRoom).profile?.username ?? otherUser(activeRoom).username ?? 'Pengguna'}
                    </div>
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        const other = otherUser(activeRoom)
                        callCtx.startCall(other.id, other.profile?.username ?? other.username ?? 'Pengguna', activeRoom.id, 'audio')
                      }}
                      disabled={callCtx.callState !== 'idle'}
                      aria-label="Panggilan suara"
                      title="Panggilan suara"
                      style={{ background: 'none', border: 'none', color: colors.textPrimary, cursor: callCtx.callState === 'idle' ? 'pointer' : 'default', padding: 8, opacity: callCtx.callState === 'idle' ? 1 : 0.4 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const other = otherUser(activeRoom)
                        callCtx.startCall(other.id, other.profile?.username ?? other.username ?? 'Pengguna', activeRoom.id, 'video')
                      }}
                      disabled={callCtx.callState !== 'idle'}
                      aria-label="Panggilan video"
                      title="Panggilan video"
                      style={{ background: 'none', border: 'none', color: colors.textPrimary, cursor: callCtx.callState === 'idle' ? 'pointer' : 'default', padding: 8, opacity: callCtx.callState === 'idle' ? 1 : 0.4 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {msgLoading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
                    : messages.length === 0
                    ? (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, fontSize: 13 }}>
                        Belum ada pesan. Sapa duluan!
                      </div>
                    )
                    : messages.map((msg, i) => {
                        const mine = msg.senderId === myId || msg.sender?.id === myId
                        return (
                          <div key={msg.id ?? i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                              maxWidth: '72%', padding: msg.attachmentType === 'image' ? 4 : '8px 14px',
                              borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                              background: mine ? colors.accent : colors.bgElevated,
                              color: mine ? '#fff' : colors.textPrimary,
                              fontSize: 14, lineHeight: 1.5,
                            }}>
                              {msg.attachmentType === 'image' && (
                                <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                  <img src={msg.attachmentUrl} alt="Lampiran gambar" style={{
                                    display: 'block', maxWidth: '100%', maxHeight: 260, borderRadius: 14,
                                  }} />
                                </a>
                              )}
                              {msg.attachmentType === 'file' && (
                                <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{
                                  display: 'flex', alignItems: 'center', gap: 8, color: 'inherit', textDecoration: 'none',
                                  padding: msg.content ? '0 0 6px' : 0,
                                }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                  </svg>
                                  <span style={{ fontSize: 13, textDecoration: 'underline', wordBreak: 'break-all' }}>{msg.attachmentName ?? 'File'}</span>
                                </a>
                              )}
                              {msg.content && (
                                <div style={msg.attachmentType === 'image' ? { padding: '6px 8px 2px' } : undefined}>{msg.content}</div>
                              )}
                              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, textAlign: 'right', padding: msg.attachmentType === 'image' ? '0 8px' : 0 }}>{timeAgo(msg.createdAt)}</div>
                            </div>
                          </div>
                        )
                      })
                  }
                  <div ref={bottomRef} />
                </div>

                <div style={{ borderTop: `1px solid ${colors.border}` }}>
                {/* Preview file yang mau dikirim */}
                {pendingFile && (
                  <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 8 }}>
                      {pendingFile.type === 'image' ? (
                        <img src={pendingFile.previewUrl} alt="Preview" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <div style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                      )}
                      <span style={{ fontSize: 12, color: colors.textSecondary, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pendingFile.file.name}
                      </span>
                      <button onClick={clearPendingFile} aria-label="Batal kirim file" style={{
                        background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '50%',
                        width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: colors.textPrimary, flexShrink: 0, marginLeft: 4,
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    {uploading && <span style={{ fontSize: 12, color: colors.textSecondary }}>Mengupload…</span>}
                  </div>
                )}

                {error && (
                  <p role="alert" style={{ padding: '6px 16px 0', fontSize: 12, color: '#f87171' }}>{error}</p>
                )}

                {/* Input */}
                <div style={{ padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
                  <input ref={fileInputRef} type="file" onChange={handlePickFile} style={{ display: 'none' }} />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending}
                    aria-label="Lampirkan foto atau file"
                    title="Lampirkan foto/file"
                    style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 6, flexShrink: 0, display: 'flex' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>

                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowEmoji(o => !o)}
                      aria-label="Pilih emoji"
                      title="Emoji"
                      style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 6, display: 'flex' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </button>
                    {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />}
                  </div>

                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Tulis pesan…"
                    disabled={sending}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 14, outline: 'none', minWidth: 0 }}
                  />
                  <button onClick={sendMessage} disabled={(!draft.trim() && !pendingFile) || sending} style={{
                    background: (draft.trim() || pendingFile) ? colors.accent : colors.bgElevated,
                    color: (draft.trim() || pendingFile) ? '#fff' : colors.textSecondary,
                    border: 'none', borderRadius: 24, padding: '0 20px', height: 38, flexShrink: 0,
                    fontSize: 14, fontWeight: 600, cursor: (draft.trim() || pendingFile) ? 'pointer' : 'default', transition: 'background 0.15s',
                  }}>
                    {sending ? '…' : '↑'}
                  </button>
                </div>
                </div>
              </>
            )
          }
        </div>
      </div>
    </UserLayout>
  )
}
