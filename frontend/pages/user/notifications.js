/**
 * pages/user/notifications.jsx  — Notifikasi
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  ActivityItem, SkeletonCard, colors,
} from '../../components/dashboard'
import UserLayout from './_layout'

const FILTERS = [
  { val: 'all',      label: 'Semua' },
  { val: 'unread',   label: 'Belum Dibaca' },
  { val: 'mention',  label: 'Sebutan' },
  { val: 'vote',     label: 'Vote' },
  { val: 'comment',  label: 'Komentar' },
]

function timeAgo(d) {
  if (!d) return ''
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}j`
  return `${Math.floor(s / 86400)}h`
}

const TYPE_ICON = {
  vote:    '👍',
  comment: '💬',
  mention: '@',
  follow:  '👥',
  reply:   '↩️',
  default: '🔔',
}

export default function Notifications() {
  const { user } = useContext(AuthContext)

  const [filter,       setFilter]       = useState('all')
  const [notifs,       setNotifs]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [unreadCount,  setUnreadCount]  = useState(0)

  const fetch = useCallback(() => {
    setLoading(true)
    const params = filter === 'all' ? '/notifications?limit=30' : `/notifications?limit=30&type=${filter === 'unread' ? '' : filter}&unread=${filter === 'unread' ? 'true' : ''}`
    api.get(params)
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        setNotifs(Array.isArray(d) ? d : [])
        setUnreadCount(Array.isArray(d) ? d.filter(n => !n.read).length : 0)
      })
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { if (user) fetch() }, [user, filter])

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) { console.error(err) }
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(c => Math.max(0, c - 1))
    } catch (err) { console.error(err) }
  }

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>Ringkasan</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatPill icon="🔔" value={notifs.length} label="Total Notifikasi" />
        <StatPill icon="📌" value={unreadCount}   label="Belum Dibaca" accent={unreadCount > 0 ? '#ef4444' : undefined} />
      </div>
      {unreadCount > 0 && (
        <button onClick={markAllRead} style={{
          marginTop: 12, width: '100%', padding: '8px 0',
          background: colors.accent, color: '#fff', border: 'none',
          borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Tandai semua dibaca</button>
      )}
    </div>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Notifikasi</h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: colors.accent, cursor: 'pointer' }}>
              Tandai semua dibaca
            </button>
          )}
        </div>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {FILTERS.map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)} style={{
              padding: '10px 14px', background: 'none', border: 'none', whiteSpace: 'nowrap',
              borderBottom: filter === f.val ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontWeight: filter === f.val ? 700 : 400,
              color: filter === f.val ? colors.textPrimary : colors.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
        : notifs.length === 0
        ? <EmptyState icon="🔔" title="Tidak ada notifikasi" description="Kamu sudah up to date!" Link={Link} />
        : notifs.map((n, i) => {
            const actor   = n.actor?.profile ?? n.actor ?? {}
            const typeIcon = TYPE_ICON[n.type] ?? TYPE_ICON.default
            return (
              <div key={n.id ?? i}
                onClick={() => !n.read && markRead(n.id)}
                style={{
                  background: n.read ? 'transparent' : colors.bgElevated,
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : colors.bgElevated)}
              >
                <ActivityItem
                  avatar={<Avatar username={actor.username ?? typeIcon} size={36} />}
                  primary={<span style={{ color: colors.textPrimary }}>{actor.username ?? 'Sistem'}</span>}
                  secondary={n.message ?? n.text ?? n.type ?? ''}
                  timestamp={timeAgo(n.createdAt)}
                  unread={!n.read}
                />
              </div>
            )
          })
      }
    </UserLayout>
  )
}



