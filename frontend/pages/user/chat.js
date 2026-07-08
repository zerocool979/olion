/**
 * pages/user/chat.jsx  — Obrolan
 */
import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'
import { Avatar, SkeletonCard, EmptyState, colors } from '../../components/dashboard'
import UserLayout from './_layout'
import Link from 'next/link'

function timeAgo(d) {
  if (!d) return ''
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}j`
  return `${Math.floor(s / 86400)}h`
}

export default function Chat() {
  const { user } = useContext(AuthContext)

  const [rooms,        setRooms]        = useState([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  const [activeRoom,   setActiveRoom]   = useState(null)
  const [messages,     setMessages]     = useState([])
  const [msgLoading,   setMsgLoading]   = useState(false)
  const [draft,        setDraft]        = useState('')
  const [sending,      setSending]      = useState(false)
  const bottomRef = useRef(null)

  const myId = user?.id

  // Load rooms
  useEffect(() => {
    if (!user) return
    api.get('/chat/rooms')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setRooms(Array.isArray(d) ? d : []) })
      .catch(() => setRooms([]))
      .finally(() => setRoomsLoading(false))
  }, [user])

  // Load messages for active room
  const loadMessages = useCallback((roomId) => {
    setMsgLoading(true)
    api.get(`/chat/rooms/${roomId}/messages?limit=50`)
      .then(r => { const d = r.data?.data ?? r.data ?? []; setMessages(Array.isArray(d) ? d : []) })
      .catch(() => setMessages([]))
      .finally(() => setMsgLoading(false))
  }, [])

  useEffect(() => {
    if (activeRoom) loadMessages(activeRoom.id)
  }, [activeRoom])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Poll messages every 5s
  useEffect(() => {
    if (!activeRoom) return
    const t = setInterval(() => loadMessages(activeRoom.id), 5000)
    return () => clearInterval(t)
  }, [activeRoom])

  const sendMessage = async () => {
    if (!draft.trim() || !activeRoom || sending) return
    setSending(true)
    const text = draft.trim()
    setDraft('')
    try {
      await api.post(`/chat/rooms/${activeRoom.id}/messages`, { content: text })
      loadMessages(activeRoom.id)
    } catch (err) {
      console.error(err)
      setDraft(text)
    } finally { setSending(false) }
  }

  const otherUser = (room) => {
    const members = room.members ?? room.participants ?? []
    return members.find(m => m.id !== myId) ?? members[0] ?? {}
  }

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 8 }}>Info Chat</span>
      <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
        Semua percakapan bersifat privat. Hanya kamu dan lawan bicara yang dapat melihat pesan ini.
      </p>
    </div>
  )

  return (
    <UserLayout sidebar={sidebar}>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

        {/* Room list */}
        <div style={{ width: 280, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, background: colors.bg }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>💬 Obrolan</h1>
          </div>

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
                const lastMsg = room.lastMessage ?? room.messages?.[room.messages.length - 1]
                const active  = activeRoom?.id === room.id
                return (
                  <div key={room.id} onClick={() => setActiveRoom(room)}
                    style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 10, cursor: 'pointer', background: active ? colors.bgElevated : 'transparent', transition: 'background 0.12s' }}
                    onMouseEnter={e => !active && (e.currentTarget.style.background = colors.bgElevated)}
                    onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                  >
                    <Avatar username={uname} size={40} />
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                  <Avatar username={otherUser(activeRoom).profile?.username ?? otherUser(activeRoom).username ?? '?'} size={36} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>
                      {otherUser(activeRoom).profile?.username ?? otherUser(activeRoom).username ?? 'Pengguna'}
                    </div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>
                      {(otherUser(activeRoom).profile?.reputation ?? otherUser(activeRoom).reputation ?? 0).toLocaleString()} rep
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {msgLoading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
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



