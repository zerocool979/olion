/**
 * pages/user/experts.jsx  — Pakar
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  TrendingRow, SkeletonCard, DiscussionCard, colors,
} from '../../components/dashboard'
import UserLayout from './_layout'

export default function Experts() {
  const { user } = useContext(AuthContext)

  const [tab,          setTab]          = useState('pakar')
  const [experts,      setExperts]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [followingMap, setFollowingMap] = useState({})
  const [expertPosts,  setExpertPosts]  = useState([])
  const [postLoading,  setPostLoading]  = useState(true)
  const [categories,   setCategories]   = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    if (!user) return

    api.get('/users?role=expert&limit=20')
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        const arr = Array.isArray(d) ? d.map(u => ({ ...u, isExpert: true })) : []
        setExperts(arr)
        const map = {}; arr.forEach(u => { if (u.isFollowed) map[u.id] = true }); setFollowingMap(map)
      })
      .catch(() => setExperts([]))
      .finally(() => setLoading(false))

    api.get('/discussions?role=expert&sort=votes&limit=15')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setExpertPosts(Array.isArray(d) ? d : []) })
      .catch(() => setExpertPosts([]))
      .finally(() => setPostLoading(false))

    api.get('/categories')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setCategories(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [user])

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

  const handleVote = useCallback(async (post, liked) => {
    try { await api.post('/votes', { discussionId: post.id, value: liked ? 1 : 0 }) } catch {}
  }, [])

  const filtered = experts.filter(e => {
    const uname = e.profile?.username ?? e.username ?? ''
    const bio   = e.profile?.bio ?? ''
    const matchSearch = !search || uname.toLowerCase().includes(search.toLowerCase()) || bio.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !activeCategory || e.profile?.categoryId === activeCategory || e.categories?.some(c => c.id === activeCategory)
    return matchSearch && matchCat
  })

  const sidebar = (
    <>
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>📊 Statistik Pakar</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatPill icon="🎓" value={experts.length} label="Total Pakar" />
          <StatPill icon="✅" value={Object.values(followingMap).filter(Boolean).length} label="Kamu Ikuti" />
        </div>
      </div>

      {categories.length > 0 && (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 10 }}>🗂 Filter Bidang</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => setActiveCategory(null)} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: `1px solid ${!activeCategory ? colors.accent : colors.border}`, background: !activeCategory ? colors.accent : 'transparent', color: !activeCategory ? '#fff' : colors.textSecondary }}>Semua</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: `1px solid ${activeCategory === c.id ? colors.accent : colors.border}`, background: activeCategory === c.id ? colors.accent : 'transparent', color: activeCategory === c.id ? '#fff' : colors.textSecondary }}>{c.name}</button>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10, borderBottom: `1px solid ${colors.border}` }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>🎓 Pakar OLION</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pakar…"
          style={{ width: '100%', padding: '8px 14px', borderRadius: 24, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex' }}>
          {[['pakar', 'Daftar Pakar'], ['diskusi', 'Diskusi Pakar']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              flex: 1, padding: '10px 0', background: 'none', border: 'none',
              borderBottom: tab === val ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontWeight: tab === val ? 700 : 400,
              color: tab === val ? colors.textPrimary : colors.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {tab === 'pakar' && (
        loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" action />)
          : filtered.length === 0
          ? <EmptyState icon="🎓" title="Tidak ada pakar ditemukan" description="Coba ubah kata kunci atau filter." Link={Link} />
          : filtered.map(person => {
              const uname = person.profile?.username ?? person.username ?? 'Anonim'
              const rep   = person.profile?.reputation ?? person.reputation ?? 0
              const bio   = person.profile?.bio ?? ''
              const postC = person._count?.discussions ?? person.postCount ?? 0
              return (
                <div key={person.id} style={{ padding: '16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 14 }}>
                  <Avatar username={uname} size={52} verified />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Link href={`/user/profile/${person.id}`} style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, textDecoration: 'none' }}>{uname}</Link>
                          <StatPill variant="tag" tone="accent" label="Pakar" />
                        </div>
                        {bio && <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{bio.slice(0, 100)}{bio.length > 100 ? '…' : ''}</p>}
                        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                          <span style={{ fontSize: 12, color: colors.textSecondary }}>⭐ {rep.toLocaleString()} rep</span>
                          <span style={{ fontSize: 12, color: colors.textSecondary }}>📝 {postC} diskusi</span>
                        </div>
                      </div>
                      <button onClick={() => handleFollow(person.id)} style={{
                        border: followingMap[person.id] ? `1px solid ${colors.border}` : `1px solid ${colors.accent}`,
                        background: followingMap[person.id] ? colors.bgElevated : colors.accent,
                        color: followingMap[person.id] ? colors.textPrimary : '#fff',
                        borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                      }}>
                        {followingMap[person.id] ? 'Mengikuti' : 'Ikuti'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
      )}

      {tab === 'diskusi' && (
        postLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
          : expertPosts.length === 0
          ? <EmptyState icon="📝" title="Belum ada diskusi dari pakar" Link={Link} />
          : expertPosts.map(d => <DiscussionCard key={d.id} post={d} onLike={handleVote} />)
      )}
    </UserLayout>
  )
}



