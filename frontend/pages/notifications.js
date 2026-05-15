import Nav from '../components/Nav'
import Link from 'next/link'
import { useState } from 'react'

const NOTIFS = [
  { id: 1, type: 'reply', message: 'Seseorang membalas diskusi kamu', detail: 'Bagaimana cara kerja enkripsi end-to-end...', time: '5 menit lalu', read: false, link: '/discussion/1' },
  { id: 2, type: 'vote', message: 'Diskusi kamu mendapat 10 upvote baru', detail: 'Tips mengelola keuangan saat gaji UMR...', time: '1 jam lalu', read: false, link: '/discussion/3' },
  { id: 3, type: 'badge', message: 'Kamu mendapat badge Expert!', detail: 'Selamat! Reputasi kamu telah mencapai 1000 poin.', time: '2 jam lalu', read: false, link: '/u/me' },
  { id: 4, type: 'report', message: 'Laporan kamu telah diproses', detail: 'Konten yang dilaporkan telah ditinjau moderator.', time: '5 jam lalu', read: true, link: '/report' },
  { id: 5, type: 'reply', message: 'Seseorang membalas komentar kamu', detail: 'Apakah mungkin belajar programming otodidak...', time: '1 hari lalu', read: true, link: '/discussion/4' },
  { id: 6, type: 'vote', message: 'Diskusi kamu mendapat 5 upvote baru', detail: 'Gejala burnout dan cara mengatasinya...', time: '2 hari lalu', read: true, link: '/discussion/5' },
  { id: 7, type: 'mention', message: 'Kamu disebut dalam diskusi', detail: 'Diskusi: Budaya overtime di perusahaan Indonesia', time: '3 hari lalu', read: true, link: '/discussion/8' },
]

const typeConfig = {
  reply: { icon: '💬', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  vote: { icon: '⬆️', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  badge: { icon: '🏅', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  report: { icon: '🛡️', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
  mention: { icon: '@', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
}

export default function Notifications() {
  const [filter, setFilter] = useState('Semua')
  const [notifications, setNotifications] = useState(NOTIFS)

  const unreadCount = notifications.filter(n => !n.read).length
  const filtered = filter === 'Belum Dibaca' ? notifications.filter(n => !n.read) : notifications

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Nav />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
              Notifikasi
            </h1>
            {unreadCount > 0 && (
              <span style={{ background: '#3b82f6', color: '#fff', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.55rem', fontFamily: "'Syne', sans-serif" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Semua', 'Belum Dibaca'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.875rem', borderRadius: '99px', border: '1px solid', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all 160ms ease', background: filter === f ? 'var(--text-primary)' : 'transparent', color: filter === f ? 'var(--bg-base)' : 'var(--text-muted)', borderColor: filter === f ? 'var(--text-primary)' : 'var(--border-default)', fontFamily: "'DM Sans', sans-serif" }}>
                {f}
              </button>
            ))}
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
                Tandai Semua Dibaca
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔔</p>
              <p>Tidak ada notifikasi</p>
            </div>
          ) : filtered.map(n => {
            const cfg = typeConfig[n.type] || typeConfig.report
            return (
              <Link key={n.id} href={n.link} style={{ textDecoration: 'none' }} onClick={() => markRead(n.id)}>
                <div
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    cursor: 'pointer',
                    background: n.read ? 'var(--bg-surface)' : 'rgba(59,130,246,0.04)',
                    borderColor: n.read ? 'var(--border-subtle)' : 'rgba(59,130,246,0.15)',
                    padding: '0.875rem 1.25rem',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                    {cfg.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: n.read ? 400 : 600, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {n.message}
                      </p>
                      {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '3px' }} />}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="line-clamp-2">{n.detail}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{n.time}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
