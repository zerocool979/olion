/**
 * pages/user/following.jsx  — Ikuti (Following & Followers)
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  ActivityItem, SkeletonCard, DiscussionCard, colors,
} from '../../components/dashboard'
import UserLayout from './_layout'

export default function Following() {
  const { user } = useContext(AuthContext)
  const myUsername = user?.profile?.username ?? user?.username ?? ''

  const [tab,            setTab]            = useState('mengikuti')   // mengikuti | pengikut | disarankan
  const [following,      setFollowing]      = useState([])
  const [followers,      setFollowers]      = useState([])
  const [suggested,      setSuggested]      = useState([])
  const [followingFeed,  setFollowingFeed]  = useState([])
  const [loading,        setLoading]        = useState(true)
  const [feedLoading,    setFeedLoading]    = useState(true)
  const [followingMap,   setFollowingMap]   = useState({})

  useEffect(() => {
    if (!user || !myUsername) return

    // Feed dari orang yang diikuti
    api.get('/discussions?feed=following&limit=10')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setFollowingFeed(Array.isArray(d) ? d : []) })
      .catch(() => setFollowingFeed([]))
      .finally(() => setFeedLoading(false))

    // Following list — endpoint publik berbasis username, dipakai untuk diri sendiri
    api.get(`/users/${encodeURIComponent(myUsername)}/following`)
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        const arr = Array.isArray(d) ? d : []
        setFollowing(arr)
        const map = {}; arr.forEach(u => { map[u.id] = true }); setFollowingMap(map)
      })
      .catch(() => setFollowing([]))

    // Followers list
    api.get(`/users/${encodeURIComponent(myUsername)}/followers`)
      .then(r => { const d = r.data?.data ?? r.data ?? []; setFollowers(Array.isArray(d) ? d : []) })
      .catch(() => setFollowers([]))

    // Suggested
    Promise.allSettled([
      api.get('/users?role=expert&limit=5'),
      api.get('/users?limit=8&sort=reputation'),
    ]).then(([eR, uR]) => {
      const experts = (eR.status === 'fulfilled' ? eR.value.data?.data ?? eR.value.data ?? [] : []).map(u => ({ ...u, isExpert: true }))
      const users   = uR.status === 'fulfilled' ? uR.value.data?.data ?? uR.value.data ?? [] : []
      const seen    = new Set(experts.map(e => e.id))
      setSuggested([...experts, ...users.filter(u => !seen.has(u.id) && u.id !== user.id)].slice(0, 10))
    }).finally(() => setLoading(false))
  }, [user, myUsername])

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

  const renderPeople = (list) => {
    if (loading) return Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" action />)
    if (list.length === 0) return <EmptyState icon="👥" title="Belum ada" description="Mulai ikuti orang untuk melihat daftar di sini." Link={Link} />
    return list.map(person => {
      const uname = person.profile?.username ?? person.username ?? 'Anonim'
      const rep   = person.profile?.reputation ?? person.reputation ?? 0
      const bio   = person.profile?.bio ?? ''
      return (
        <div key={person.id} style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', gap: 12 }}>
          <Avatar username={uname} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Link href={`/user/profile/${encodeURIComponent(uname)}`} style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, textDecoration: 'none' }}>{uname}</Link>
                  {person.isExpert && <StatPill variant="tag" tone="accent" label="Pakar" />}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{rep.toLocaleString()} rep</div>
                {bio && <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{bio.slice(0, 80)}{bio.length > 80 ? '…' : ''}</p>}
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
  }

  const sidebar = (
    <>
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>Statistik</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatPill icon="👥" value={following.length} label="Mengikuti" />
          <StatPill icon="❤️" value={followers.length} label="Pengikut" />
        </div>
      </div>
    </>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10, borderBottom: `1px solid ${colors.border}` }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>Jaringan</h1>
        <div style={{ display: 'flex' }}>
          {[['mengikuti', 'Mengikuti'], ['pengikut', 'Pengikut'], ['disarankan', 'Disarankan'], ['feed', 'Feed Mereka']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              flex: 1, padding: '10px 4px', background: 'none', border: 'none',
              borderBottom: tab === val ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontWeight: tab === val ? 700 : 400,
              color: tab === val ? colors.textPrimary : colors.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {tab === 'mengikuti'  && renderPeople(following)}
      {tab === 'pengikut'   && renderPeople(followers)}
      {tab === 'disarankan' && renderPeople(suggested)}
      {tab === 'feed' && (
        feedLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
          : followingFeed.length === 0
          ? <EmptyState icon="◎" title="Feed kosong" description="Ikuti orang untuk melihat diskusi mereka di sini." Link={Link} />
          : followingFeed.map(d => <DiscussionCard key={d.id} post={d} onLike={handleVote} />)
      )}
    </UserLayout>
  )
}



