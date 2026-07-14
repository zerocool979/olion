/**
 * pages/user/index.jsx  — Beranda
 * Feed utama + compose + sidebar Top10 + Ikuti + Aktivitas
 */
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()

  const FEED_PAGE_SIZE = 10

  const [activeTab,   setActiveTab]   = useState('untukmu')
  const [composeTitle, setComposeTitle] = useState('')

  const [feed,             setFeed]             = useState([])
  const [feedLoading,      setFeedLoading]      = useState(true)   // initial load per tab
  const [feedLoadingMore,  setFeedLoadingMore]  = useState(false)  // infinite-scroll load
  const [feedHasMore,      setFeedHasMore]      = useState(true)
  const [feedError,        setFeedError]        = useState('')
  const [newCount,         setNewCount]         = useState(0)
  const [top10,            setTop10]            = useState([])
  const [top10Loading,     setTop10Loading]     = useState(true)
  const [suggested,        setSuggested]        = useState([])
  const [suggestedLoading, setSuggestedLoading] = useState(true)
  const [followingMap,     setFollowingMap]     = useState({})
  const [activity,         setActivity]         = useState([])
  const [activityLoading,  setActivityLoading]  = useState(true)
  const [quickCategories,  setQuickCategories]  = useState([])

  const username   = user?.profile?.username   ?? user?.username   ?? 'Kamu'
  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0
  const postCount  = user?.profile?.postCount  ?? user?._count?.discussions ?? 0
  const voteCount  = user?.profile?.totalVotes ?? user?._count?.votes ?? 0

  const achievements = REPUTATION_TIERS.map(t => ({
    ...t, unlocked: reputation >= t.threshold, hint: `${t.threshold.toLocaleString()} rep`,
  }))

  // ── Refs untuk hindari closure basi di dalam IntersectionObserver / polling ──
  const latestFeedIdRef   = useRef(null)
  const activeTabRef      = useRef(activeTab)
  const feedSkipRef       = useRef(0)
  const feedHasMoreRef    = useRef(true)
  const feedLoadingRef    = useRef(false)   // true selama initial ATAU loading-more, dipakai observer

  useEffect(() => { latestFeedIdRef.current = feed[0]?.id ?? null }, [feed])
  useEffect(() => { activeTabRef.current = activeTab }, [activeTab])
  useEffect(() => { feedHasMoreRef.current = feedHasMore }, [feedHasMore])

  // ── Loader feed tunggal dipakai untuk: initial load, ganti tab, infinite scroll ──
  const loadFeed = useCallback((tab, { reset = false } = {}) => {
    if (feedLoadingRef.current) return
    feedLoadingRef.current = true

    const skip = reset ? 0 : feedSkipRef.current
    if (reset) { setFeedLoading(true); setFeedError('') } else { setFeedLoadingMore(true) }

    const params = tab === 'mengikuti'
      ? `feed=following&skip=${skip}&limit=${FEED_PAGE_SIZE}`
      : `sort=recent&skip=${skip}&limit=${FEED_PAGE_SIZE}`

    api.get(`/discussions?${params}`)
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        const arr = Array.isArray(d) ? d : []
        setFeed(prev => (reset ? arr : [...prev, ...arr]))
        feedSkipRef.current = skip + arr.length
        setFeedHasMore(arr.length === FEED_PAGE_SIZE)
      })
      .catch(() => {
        if (reset) { setFeed([]); setFeedError('Gagal memuat diskusi. Coba lagi.') }
      })
      .finally(() => {
        feedLoadingRef.current = false
        setFeedLoading(false)
        setFeedLoadingMore(false)
      })
  }, [])

  // Muat ulang dari awal setiap kali tab berganti (mengikuti butuh login,
  // ditangani otomatis oleh backend: guest/no-follow → array kosong, bukan error)
  useEffect(() => {
    if (!user) return
    feedSkipRef.current = 0
    setFeedHasMore(true)
    loadFeed(activeTab, { reset: true })
  }, [user, activeTab, loadFeed])

  // Infinite scroll: sentinel di bawah daftar feed
  const sentinelRef = useRef(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && feedHasMoreRef.current && !feedLoadingRef.current) {
        loadFeed(activeTabRef.current, { reset: false })
      }
    }, { rootMargin: '600px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadFeed])

  useEffect(() => {
    if (!user) return

    api.get('/leaderboard?limit=10')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setTop10(Array.isArray(d) ? d : []) })
      .catch(() => setTop10([]))
      .finally(() => setTop10Loading(false))

    api.get('/notifications?limit=6')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setActivity(Array.isArray(d) ? d : []) })
      .catch(() => setActivity([]))
      .finally(() => setActivityLoading(false))

    api.get('/categories')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setQuickCategories(Array.isArray(d) ? d.slice(0, 6) : []) })
      .catch(() => setQuickCategories([]))

    Promise.allSettled([
      api.get('/users?role=expert&limit=5'),
      api.get('/users?limit=5&sort=reputation'),
    ]).then(([eR, uR]) => {
      const experts = (eR.status === 'fulfilled' ? eR.value.data?.data ?? eR.value.data ?? [] : []).map(u => ({ ...u, isExpert: true }))
      const users   = uR.status === 'fulfilled' ? uR.value.data?.data ?? uR.value.data ?? [] : []
      const seen    = new Set(experts.map(e => e.id))
      setSuggested([...experts, ...users.filter(u => !seen.has(u.id) && u.id !== user.id)].slice(0, 8))
    }).finally(() => setSuggestedLoading(false))

    // Polling "diskusi baru" — hanya relevan untuk tab Untukmu (sort=recent global)
    const poll = setInterval(() => {
      if (activeTabRef.current !== 'untukmu') return
      api.get('/discussions?limit=1&sort=recent').then(r => {
        const d = r.data?.data ?? r.data ?? []
        if (d[0] && d[0].id !== latestFeedIdRef.current) setNewCount(c => c + 1)
      }).catch(() => {})
    }, 30_000)
    return () => clearInterval(poll)
  }, [user])

  const handleShowNew = useCallback(() => {
    setNewCount(0)
    feedSkipRef.current = 0
    setFeedHasMore(true)
    loadFeed('untukmu', { reset: true })
  }, [loadFeed])

  // Navigasi ke /user/create sambil membawa apa pun yang sudah diketik/dipilih
  // di kartu "Mulai Diskusi" — supaya tidak ada input yang hilang percuma.
  const goCreate = useCallback((categorySlug) => {
    const params = new URLSearchParams()
    if (composeTitle.trim()) params.set('title', composeTitle.trim())
    if (categorySlug) params.set('category', categorySlug)
    const qs = params.toString()
    router.push(qs ? `/user/create?${qs}` : '/user/create')
  }, [composeTitle, router])

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
              const uavatar = u.profile?.avatarUrl ?? u.avatarUrl ?? null
              const uborder = u.profile?.avatarBorder ?? u.avatarBorder ?? null
              const rep   = u.profile?.reputation ?? u.reputation ?? 0
              return (
                <TrendingRow key={u.id ?? i} rank={i + 1}
                  avatar={<Avatar username={uname} src={uavatar} border={uborder} size={28} verified={u.isVerifiedExpert ?? false} />}
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
                  avatar={<Avatar username={actor.username ?? 'Anon'} src={actor.avatarUrl ?? null} border={actor.avatarBorder ?? null} size={32} />}
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
              const uavatar = person.profile?.avatarUrl ?? person.avatarUrl ?? null
              const uborder = person.profile?.avatarBorder ?? person.avatarBorder ?? null
              const rep   = person.profile?.reputation ?? person.reputation ?? 0
              return (
                <ActivityItem key={person.id}
                  avatar={<Avatar username={uname} src={uavatar} border={uborder} size={34} />}
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

      {/* Mulai Diskusi — dulu textarea "Apa yang sedang kamu pikirkan?" yang
          selalu membuang isian ke /user/create tanpa membawa apa pun. Sekarang
          apa yang diketik & kategori yang dipilih beneran dibawa ke form buat
          diskusi (lewat query param), jadi tidak ada yang sia-sia. */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar username={username} src={user?.profile?.avatarUrl} border={user?.profile?.avatarBorder} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => goCreate()}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && goCreate()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: `1px solid ${colors.border}`, borderRadius: 20,
                padding: '10px 16px', cursor: 'text',
              }}
            >
              <input
                value={composeTitle}
                onClick={e => e.stopPropagation()}
                onChange={e => setComposeTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), goCreate())}
                placeholder="Ada pertanyaan atau wawasan baru? Tulis judulnya di sini…"
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 14.5,
                  color: colors.textPrimary, background: 'transparent', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={e => { e.stopPropagation(); goCreate() }}
                style={{
                  background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 16, padding: '6px 16px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                Buat
              </button>
            </div>

            {/* Pintasan kategori populer — langsung lompat ke form dengan kategori terisi */}
            {quickCategories.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {quickCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => goCreate(cat.slug)}
                    style={{
                      background: colors.bgElevated, border: `1px solid ${colors.border}`,
                      color: colors.textSecondary, borderRadius: 14, padding: '4px 12px',
                      fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = colors.textPrimary)}
                    onMouseLeave={e => (e.currentTarget.style.color = colors.textSecondary)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
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
        : feedError
        ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 12 }}>{feedError}</p>
            <button onClick={() => loadFeed(activeTab, { reset: true })} style={{
              background: colors.accent, color: '#fff', border: 'none', borderRadius: 20,
              padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>Coba lagi</button>
          </div>
        )
        : feed.length === 0
        ? (activeTab === 'mengikuti'
          ? <EmptyState icon="👥" title="Belum ada diskusi dari yang kamu ikuti"
              description="Ikuti pengguna lain supaya diskusi mereka muncul di sini, atau jelajahi Untukmu untuk menemukan orang baru."
              actionLabel="Cari Pengguna" actionHref="/user/experts" Link={Link} />
          : <EmptyState icon="◎" title="Belum ada diskusi" description="Jadilah yang pertama membagikan pertanyaan atau wawasan di OLION." actionLabel="Buat Diskusi" actionHref="/user/create" Link={Link} />
        )
        : (
          <>
            {feed.map(post => (
              <Link
                key={post.id}
                href={`/user/discussions/${post.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div style={{ cursor: 'pointer' }}>
                  <DiscussionCard key={post.id} post={post} onLike={handleVote} />
                </div>
              </Link>
            ))}

            {/* Sentinel infinite-scroll — begitu elemen ini kelihatan, halaman
                berikutnya otomatis dimuat, jadi beranda tidak pernah "mentok". */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {feedLoadingMore && (
              <div style={{ padding: '1rem' }}>
                <SkeletonCard variant="post" />
              </div>
            )}

            {!feedHasMore && !feedLoadingMore && (
              <p style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 13, padding: '1.5rem 0' }}>
                Kamu sudah sampai di ujung feed 🎉
              </p>
            )}
          </>
        )
      }
    </UserLayout>
  )
}



