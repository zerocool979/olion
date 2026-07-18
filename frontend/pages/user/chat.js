/**
 * pages/user/chat.jsx  — Obrolan
 */
import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'
import { Avatar, SkeletonCard, colors } from '../../components/dashboard'
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
  const bottomRef = useRef(null)

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
    if (!draft.trim() || !activeRoom || sending) return
    setSending(true)
    const text = draft.trim()
    setDraft('')
    try {
      await api.post(`/chat/conversations/${activeRoom.id}/messages`, { content: text })
      await loadMessages(activeRoom.id)
      loadRooms(true) // refresh preview pesan terakhir di sidebar (silent, tanpa skeleton)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengirim pesan.')
      setDraft(text)
    } finally { setSending(false) }
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
                              maxWidth: '72%', padding: '8px 14px', borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                              background: mine ? colors.accent : colors.bgElevated,
                              color: mine ? '#fff' : colors.textPrimary,
                              fontSize: 14, lineHeight: 1.5,
                            }}>
                              {msg.content}
                              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, textAlign: 'right' }}>{timeAgo(msg.createdAt)}</div>
                            </div>
                          </div>
                        )
                      })
                  }
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 8 }}>
                  <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Tulis pesan…"
                    disabled={sending}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 14, outline: 'none' }}
                  />
                  <button onClick={sendMessage} disabled={!draft.trim() || sending} style={{
                    background: draft.trim() ? colors.accent : colors.bgElevated,
                    color: draft.trim() ? '#fff' : colors.textSecondary,
                    border: 'none', borderRadius: 24, padding: '0 20px',
                    fontSize: 14, fontWeight: 600, cursor: draft.trim() ? 'pointer' : 'default', transition: 'background 0.15s',
                  }}>
                    {sending ? '…' : '↑'}
                  </button>
                </div>
              </>
            )
          }
        </div>
      </div>
    </UserLayout>
  )
}
