import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { ROUTES } from '../../lib/routes'
import api from '../../lib/api'
import { NotifItem, NotifSkeleton } from '../../components/notifications'

const TYPE_META = {
  VOTE: { tab: 'VOTE' },
  DOWNVOTE: { tab: 'VOTE' },
  ANSWER: { tab: 'ANSWER' },
  MENTION: { tab: 'ANSWER' },
  REPORT: { tab: 'OTHER' },
  SYSTEM: { tab: 'OTHER' },
}

const TABS = [
  { key: 'ALL',    label: 'Semua' },
  { key: 'UNREAD', label: 'Belum Dibaca' },
  { key: 'VOTE',   label: 'Upvote' },
  { key: 'ANSWER', label: 'Komentar' },
  { key: 'OTHER',  label: 'Lainnya' },
]

export default function UserNotifications() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('ALL')
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace(ROUTES.guest.login)
  }, [user, authLoading, router])

  const fetchNotifs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await api.get('/notifications')
      const raw = res.data?.data ?? res.data ?? []
      setNotifs(Array.isArray(raw) ? raw : [])
    } catch {
      setNotifs([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchNotifs() }, [fetchNotifs])

  const markRead = async (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    try { await api.patch(`/notifications/${id}/read`) } catch { /* optimistic */ }
  }

  const markAllRead = async () => {
    setMarking(true)
    try {
      await api.patch('/notifications/read-all')
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch { /* ignore */ } finally {
      setMarking(false)
    }
  }

  const unreadCount = notifs.filter(n => !n.isRead).length

  const filtered = notifs.filter(n => {
    if (tab === 'ALL')    return true
    if (tab === 'UNREAD') return !n.isRead
    const meta = TYPE_META[n.type] ?? TYPE_META.SYSTEM
    return meta.tab === tab
  })

  if (authLoading) return null

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content animate-fade-up" style={{ maxWidth: '720px' }}>
        <div className="page-header stagger-1" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">
              Notifikasi
              {unreadCount > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '0.6rem',
                  minWidth: '22px',
                  height: '22px',
                  borderRadius: '99px',
                  background: '#4ade80',
                  color: '#080a0c',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  padding: '0 0.4rem',
                  verticalAlign: 'middle',
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </h1>
            <p className="page-subtitle">Aktivitas terbaru yang melibatkan akunmu.</p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={marking}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', alignSelf: 'flex-start', marginTop: '2.5rem' }}
            >
              {marking ? 'Menandai...' : 'Tandai semua dibaca'}
            </button>
          )}
        </div>

        <div className="animate-fade-up stagger-2" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {TABS.map(t => {
            const count = t.key === 'UNREAD'
              ? unreadCount
              : t.key === 'ALL'
              ? notifs.length
              : notifs.filter(n => (TYPE_META[n.type] ?? TYPE_META.SYSTEM).tab === t.key).length
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '0.35rem 0.875rem',
                  borderRadius: '99px',
                  fontSize: '0.78rem',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  border: `1px solid ${tab === t.key ? 'var(--border-strong)' : 'var(--border-default)'}`,
                  background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {t.label}
                {count > 0 && (
                  <span style={{
                    background: tab === t.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    borderRadius: '99px',
                    padding: '0.05rem 0.4rem',
                    fontSize: '0.65rem',
                    color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="animate-fade-up stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <NotifSkeleton key={i} />)
            : filtered.length === 0
              ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#596570" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 01-3.46 0"/>
                    </svg>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {tab === 'UNREAD' ? 'Semua notifikasi sudah dibaca.' : 'Belum ada notifikasi.'}
                  </p>
                </div>
              )
              : filtered.map(n => (
                  <NotifItem key={n.id} item={n} onRead={markRead} />
                ))
          }
        </div>

        {!loading && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={fetchNotifs}
              className="btn-ghost"
              style={{ fontSize: '0.78rem' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              Perbarui
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
