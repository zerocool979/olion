import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar,
  StatPill,
  EmptyState,
  DiscussionCard,
  TrendingRow,
  SkeletonCard,
  AchievementPanel,
  ActivityItem,
} from '../../components/dashboard'

export default function UserDashboard() {
  const { user } = useContext(AuthContext)

  const [feed, setFeed]               = useState([])
  const [trending, setTrending]       = useState([])
  const [activity, setActivity]       = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]         = useState({ feed: true, trending: true, activity: true })

  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0
  const username   = user?.profile?.username   ?? user?.username   ?? 'Pengguna'
  const postCount  = user?.profile?.postCount  ?? user?._count?.discussions ?? 0
  const voteCount  = user?.profile?.totalVotes ?? user?._count?.votes ?? 0

  const vote = useCallback(async (id, value) => {
    try { await api.post('/votes', { discussionId: id, value }) }
    catch (err) { console.error('Vote error:', err) }
  }, [])

  useEffect(() => {
    if (!user) return

    api.get('/discussions?limit=6')
      .then(r => {
        const data = r.data?.data ?? r.data ?? []
        setFeed(Array.isArray(data) ? data : [])
      })
      .catch(() => setFeed([]))
      .finally(() => setLoading(p => ({ ...p, feed: false })))

    api.get('/discussions?sort=votes&limit=5')
      .then(r => {
        const data = r.data?.data ?? r.data ?? []
        setTrending(Array.isArray(data) ? data : [])
      })
      .catch(() => setTrending([]))
      .finally(() => setLoading(p => ({ ...p, trending: false })))

    api.get('/notifications?limit=8')
      .then(r => {
        const data = r.data?.data ?? r.data ?? []
        setActivity(Array.isArray(data) ? data : [])
      })
      .catch(() => setActivity([]))
      .finally(() => setLoading(p => ({ ...p, activity: false })))

    api.get('/leaderboard?limit=3')
      .then(r => {
        const data = r.data?.data ?? r.data ?? []
        setLeaderboard(Array.isArray(data) ? data : [])
      })
      .catch(() => setLeaderboard([]))
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="ud-layout">

        <main className="ud-main">

          <section className="ud-welcome animate-fade-up">
            <div className="ud-welcome__left">
              <h1 className="ud-welcome__title">
                {greeting},&nbsp;
                <span className="ud-welcome__name">{username}</span>
              </h1>
              <p className="page-subtitle">
                Jelajahi diskusi, bagikan pengetahuan, dan bangun reputasimu di OLION.
              </p>
            </div>
            <div className="ud-welcome__actions">
              <Link href="/user/create" className="btn-primary">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Buat Diskusi
              </Link>
              <Link href="/user/discussions" className="btn-ghost">
                Jelajahi
              </Link>
            </div>
          </section>

          <section className="ud-stats-row animate-fade-up stagger-1">
            <StatPill
              icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.6 6.4H14.4L10.4 9.2L12 13.6L8 10.8L4 13.6L5.6 9.2L1.6 6.4H6.4L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>}
              value={reputation.toLocaleString()}
              label="Reputasi"
              accent="#f59e0b"
            />
            <StatPill
              icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v9H3V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 11l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              value={postCount}
              label="Diskusi"
              accent="#60a5fa"
            />
            <StatPill
              icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              value={voteCount}
              label="Upvote Diterima"
              accent="#4ade80"
            />
            <StatPill
              icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              value={activity.length}
              label="Aktivitas"
              accent="#a78bfa"
            />
          </section>

          <section className="ud-quick-actions animate-fade-up stagger-2">
            {[
              { href: '/user/create',         icon: '＋', label: 'Buat Diskusi',   desc: 'Mulai topik baru'         },
              { href: '/user/discussions',    icon: '◎', label: 'Jelajahi',       desc: 'Lihat semua diskusi'      },
              { href: '/user/search',         icon: '⌕', label: 'Cari',           desc: 'Temukan topik spesifik'   },
              { href: '/user/profile',        icon: '◈', label: 'Profil',         desc: 'Edit profilmu'            },
              { href: '/user/notifications',  icon: '◉', label: 'Notifikasi',     desc: 'Aktivitas & balasan'      },
              { href: '/user/leaderboard',    icon: '★', label: 'Leaderboard',    desc: 'Ranking komunitas'        },
            ].map(({ href, icon, label, desc }) => (
              <Link key={href} href={href} className="ud-qa-card">
                <span className="ud-qa-card__icon">{icon}</span>
                <span className="ud-qa-card__label">{label}</span>
                <span className="ud-qa-card__desc">{desc}</span>
              </Link>
            ))}
          </section>

          <section className="animate-fade-up stagger-3">
            <div className="section-header">
              <h2 className="section-title">Feed Untukmu</h2>
              <Link href="/user/discussions/" className="ud-see-all">Lihat semua →</Link>
            </div>

            {loading.feed ? (
              <div className="ud-card-stack">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : feed.length === 0 ? (
              <EmptyState
                icon="◎"
                title="Belum ada diskusi"
                description="Jadilah yang pertama memulai topik menarik di komunitas OLION."
                cta="Buat Diskusi"
                href="/user/create"
              />
            ) : (
              <div className="ud-card-stack">
                {feed.map((d, i) => (
                  <DiscussionCard key={d.id} discussion={d} onVote={vote} index={i} variant="feed" />
                ))}
              </div>
            )}
          </section>

        </main>

        <aside className="ud-sidebar">

          <div className="ud-sidebar-card animate-fade-up stagger-1">
            <div className="section-header">
              <h2 className="section-title">Trending</h2>
              <Link href="/user/discussions?sort=votes" className="ud-see-all">Semua →</Link>
            </div>

            {loading.trending ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: '13px', width: '90%', marginBottom: '0.35rem' }} />
                      <div className="skeleton" style={{ height: '11px', width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : trending.length === 0 ? (
              <p className="ud-sidebar-empty">Belum ada trending.</p>
            ) : (
              <div className="ud-trending-list">
                {trending.map((d, i) => (
                  <TrendingRow key={d.id} discussion={d} rank={i + 1} />
                ))}
              </div>
            )}
          </div>

          <div className="ud-sidebar-card animate-fade-up stagger-2">
            <div className="section-header">
              <h2 className="section-title">Reputasi</h2>
              <Link href="/user/leaderboard" className="ud-see-all">Board →</Link>
            </div>
            <AchievementPanel user={user} reputation={reputation} />
          </div>

          <div className="ud-sidebar-card animate-fade-up stagger-3">
            <div className="section-header">
              <h2 className="section-title">Aktivitas</h2>
              <Link href="/notifications" className="ud-see-all">Semua →</Link>
            </div>

            {loading.activity ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: '12px', width: '85%', marginBottom: '0.3rem' }} />
                      <div className="skeleton" style={{ height: '10px', width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="ud-sidebar-empty">Belum ada aktivitas terbaru.</p>
            ) : (
              <div className="ud-activity-list">
                {activity.slice(0, 6).map((item, i) => (
                  <ActivityItem key={item.id ?? i} item={item} />
                ))}
              </div>
            )}
          </div>

          {leaderboard.length > 0 && (
            <div className="ud-sidebar-card animate-fade-up stagger-4">
              <div className="section-header">
                <h2 className="section-title">Top 3</h2>
                <Link href="/user/leaderboard" className="ud-see-all">Lihat →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {leaderboard.slice(0, 3).map((u, i) => (
                  <div key={u.id ?? i} className="ud-leader-row">
                    <span className={`ud-leader-row__rank ${i === 0 ? 'ud-leader-row__rank--gold' : ''}`}>
                      {i + 1}
                    </span>
                    <Avatar username={u.profile?.username ?? u.username} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ud-leader-row__name">
                        {u.profile?.username ?? u.username ?? 'Anonim'}
                      </div>
                      <div className="ud-leader-row__rep">
                        {(u.profile?.reputation ?? u.reputation ?? 0).toLocaleString()} rep
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </div>
  )
}
