/**
 * pages/user/index.jsx  — Beranda
 * Feed utama + compose + sidebar Top10 + Ikuti + Aktivitas
 */
import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  DiscussionCard, TrendingRow, SkeletonCard,
  AchievementPanel, ActivityItem, colors,
} from '../../components/dashboard'
import UserLayout from './_layout'

const REPUTATION_TIERS = [
  { id: 'pemula',    icon: '🌱', label: 'Pemula',    threshold: 0 },
  { id: 'aktif',     icon: '✍️', label: 'Aktif',     threshold: 100 },
  { id: 'tepercaya', icon: '🔥', label: 'Tepercaya', threshold: 500 },
  { id: 'ahli',      icon: '🎓', label: 'Ahli',      threshold: 2000 },
]

function timeAgo(d) {
  if (!d) return ''
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60) return 'baru saja'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}j`
  return `${Math.floor(s / 86400)}h`
}

export default function Beranda() {
  const { user } = useContext(AuthContext)

  const [activeTab,   setActiveTab]   = useState('untukmu')
  const [composeText, setComposeText] = useState('')

  const [feed,             setFeed]             = useState([])
  const [feedLoading,      setFeedLoading]      = useState(true)
  const [newCount,         setNewCount]         = useState(0)
  const [top10,            setTop10]            = useState([])
  const [top10Loading,     setTop10Loading]     = useState(true)
  const [suggested,        setSuggested]        = useState([])
  const [suggestedLoading, setSuggestedLoading] = useState(true)
  const [followingMap,     setFollowingMap]     = useState({})
  const [activity,         setActivity]         = useState([])
  const [activityLoading,  setActivityLoading]  = useState(true)

  const username   = user?.profile?.username   ?? user?.username   ?? 'Kamu'
  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0
  const postCount  = user?.profile?.postCount  ?? user?._count?.discussions ?? 0
  const voteCount  = user?.profile?.totalVotes ?? user?._count?.votes ?? 0

  const achievements = REPUTATION_TIERS.map(t => ({
    ...t, unlocked: reputation >= t.threshold, hint: `${t.threshold.toLocaleString()} rep`,
  }))

  useEffect(() => {
    if (!user) return

    api.get('/discussions?limit=10&sort=recent')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setFeed(Array.isArray(d) ? d : []) })
      .catch(() => setFeed([]))
      .finally(() => setFeedLoading(false))

    api.get('/leaderboard?limit=10')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setTop10(Array.isArray(d) ? d : []) })
      .catch(() => setTop10([]))
      .finally(() => setTop10Loading(false))

    api.get('/notifications?limit=6')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setActivity(Array.isArray(d) ? d : []) })
      .catch(() => setActivity([]))
      .finally(() => setActivityLoading(false))

    Promise.allSettled([
      api.get('/users?role=expert&limit=5'),
      api.get('/users?limit=5&sort=reputation'),
    ]).then(([eR, uR]) => {
      const experts = (eR.status === 'fulfilled' ? eR.value.data?.data ?? eR.value.data ?? [] : []).map(u => ({ ...u, isExpert: true }))
      const users   = uR.status === 'fulfilled' ? uR.value.data?.data ?? uR.value.data ?? [] : []
      const seen    = new Set(experts.map(e => e.id))
      setSuggested([...experts, ...users.filter(u => !seen.has(u.id) && u.id !== user.id)].slice(0, 8))
    }).finally(() => setSuggestedLoading(false))

    const poll = setInterval(() => {
      api.get('/discussions?limit=1&sort=recent').then(r => {
        const d = r.data?.data ?? r.data ?? []
        if (d[0] && (!feed[0] || d[0].id !== feed[0].id)) setNewCount(c => c + 1)
      }).catch(() => {})
    }, 30_000)
    return () => clearInterval(poll)
  }, [user])

  const handleShowNew = useCallback(() => {
    setFeedLoading(true); setNewCount(0)
    api.get('/discussions?limit=10&sort=recent')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setFeed(Array.isArray(d) ? d : []) })
      .catch(() => {}).finally(() => setFeedLoading(false))
  }, [])

  const handleVote = useCallback(async (post, liked) => {
    try { await api.post('/votes', { discussionId: post.id, value: liked ? 1 : 0 }) }
    catch (err) { console.error('Vote error:', err) }
  }, [])

  const handleFollow = useCallback((targetId) => {
    const next = !followingMap[targetId]
    setFollowingMap(p => ({ ...p, [targetId]: next }))
    ;(async () => {
      try {
        if (next) await api.post(`/users/${targetId}/follow`)
        else      await api.delete(`/users/${targetId}/follow`)
      } catch { setFollowingMap(p => ({ ...p, [targetId]: !next })) }
    })()
  }, [followingMap])

  /* ── Sidebar ── */
  const sidebar = (
    <>
      {/* Top 10 */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>🏆 Top 10 Tier</span>
          <Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Lihat semua →</Link>
        </div>
        {top10Loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
          : top10.length === 0
          ? <p style={{ fontSize: 13, color: colors.textSecondary }}>Belum ada data.</p>
          : top10.slice(0, 10).map((u, i) => {
              const uname = u.profile?.username ?? u.username ?? 'Anonim'
              const rep   = u.profile?.reputation ?? u.reputation ?? 0
              return (
                <TrendingRow key={u.id ?? i} rank={i + 1}
                  avatar={<Avatar username={uname} size={28} verified={u.isExpert ?? false} />}
                  title={uname} subtitle={`${rep.toLocaleString()} rep`}
                  trailing={i === 0 ? <StatPill variant="tag" tone="gold" label="#1" /> : null}
                />
              )
            })
        }
      </div>

      {/* Reputasi */}
      <AchievementPanel title="Reputasi" icon="🏆" achievements={achievements}
        footer={<Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Lihat papan peringkat →</Link>}
      />

      {/* Aktivitas */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>🔔 Aktivitas</span>
          <Link href="/user/notifications" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Semua →</Link>
        </div>
        {activityLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
          : activity.length === 0
          ? <p style={{ fontSize: 13, color: colors.textSecondary }}>Belum ada aktivitas.</p>
          : activity.map((item, i) => {
              const actor = item.actor?.profile ?? item.actor ?? {}
              return (
                <ActivityItem key={item.id ?? i}
                  avatar={<Avatar username={actor.username ?? 'Anon'} size={32} />}
                  primary={actor.username ?? 'Seseorang'}
                  secondary={item.message ?? item.text ?? item.type ?? ''}
                  timestamp={timeAgo(item.createdAt)}
                  unread={!item.read}
                />
              )
            })
        }
      </div>

      {/* Siapa untuk diikuti */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>👥 Siapa untuk diikuti</span>
          <Link href="/user/experts" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Lihat →</Link>
        </div>
        {suggestedLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="row" action />)
          : suggested.length === 0
          ? <p style={{ fontSize: 13, color: colors.textSecondary }}>Tidak ada saran.</p>
          : suggested.map(person => {
              const uname = person.profile?.username ?? person.username ?? 'Anonim'
              const rep   = person.profile?.reputation ?? person.reputation ?? 0
              return (
                <ActivityItem key={person.id}
                  avatar={<Avatar username={uname} size={34} />}
                  primary={<>{uname}{person.isExpert && <span style={{ marginLeft: 6 }}><StatPill variant="tag" tone="accent" label="Pakar" /></span>}</>}
                  secondary={`${rep.toLocaleString()} rep`}
                  action={{ label: followingMap[person.id] ? 'Mengikuti' : 'Ikuti', active: !!followingMap[person.id], onClick: () => handleFollow(person.id) }}
                />
              )
            })
        }
      </div>
    </>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        {[['untukmu', 'Untukmu'], ['mengikuti', 'Mengikuti']].map(([val, label]) => (
          <button key={val} onClick={() => setActiveTab(val)} style={{
            flex: 1, padding: '14px 0', background: 'none', border: 'none',
            borderBottom: activeTab === val ? `2px solid ${colors.accent}` : '2px solid transparent',
            fontWeight: activeTab === val ? 700 : 400,
            color: activeTab === val ? colors.textPrimary : colors.textSecondary,
            fontSize: 14, cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Compose */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 12 }}>
        <Avatar username={username} size={38} />
        <div style={{ flex: 1 }}>
          <textarea value={composeText} onChange={e => setComposeText(e.target.value)}
            placeholder="Apa yang sedang kamu pikirkan?" rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, resize: 'none', color: colors.textPrimary, background: 'transparent', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
            <div style={{ flex: 1 }} />
            <Link href="/user/create" style={{ background: composeText ? colors.accent : colors.accentHover, opacity: composeText ? 1 : 0.5, color: '#fff', textDecoration: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>Post</Link>
          </div>
        </div>
      </div>

      {/* New banner */}
      {newCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', borderBottom: `1px solid ${colors.border}` }}>
          <StatPill icon="↑" label={`Tampilkan ${newCount} diskusi baru`} tone="accent" active onClick={handleShowNew} />
        </div>
      )}

      {/* Feed */}
      {feedLoading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
        : feed.length === 0
        ? <EmptyState icon="◎" title="Belum ada diskusi" description="Jadilah yang pertama membagikan pertanyaan atau wawasan di OLION." actionLabel="Buat Diskusi" actionHref="/user/create" Link={Link} />
        : feed.map(post => (
            <Link
              key={post.id}
              href={`/user/discussions/${post.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{ cursor: 'pointer' }}>
                <DiscussionCard key={post.id} post={post} onLike={handleVote} />)
              </div>
            </Link>
           ))
      }
    </UserLayout>
  )
}



