/**
 * pages/user/profile/[username]/followers.jsx
 * URL: /user/profile/{username}/followers
 * Semua link navigasi pakai username, bukan ID.
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../../../lib/api'
import { Avatar, StatPill, SkeletonCard, EmptyState, colors } from '../../../../components/dashboard'
import UserLayout from '../../_layout'

function PersonRow({ person, meId, onFollow, followMap }) {
  const uname    = person.profile?.username ?? person.username ?? 'Anonim'
  const rep      = person.profile?.reputation ?? person.reputation ?? 0
  const bio      = person.profile?.bio ?? ''
  const isExpert = person.isExpert ?? person.role === 'expert'
  const isFollowing = !!followMap[person.id]
  const isSelf   = person.id === meId
  const href     = `/user/profile/${encodeURIComponent(uname)}`

  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, transition: 'background 0.12s' }}
      onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Link href={href} style={{ flexShrink: 0 }}><Avatar username={uname} size={46} /></Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Link href={href} style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >{uname}</Link>
              {isSelf && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: colors.bgElevated, color: colors.textSecondary, border: `1px solid ${colors.border}` }}>Kamu</span>}
              {isExpert && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: colors.accent + '22', color: colors.accent, border: `1px solid ${colors.accent}44` }}>🎓 Pakar</span>}
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>⭐ {rep.toLocaleString()} rep</div>
            {bio && <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{bio.length > 90 ? bio.slice(0, 90) + '…' : bio}</p>}
          </div>
          {!isSelf && (
            <button onClick={() => onFollow(person.id)} style={{
              border: isFollowing ? `1px solid ${colors.border}` : `1px solid ${colors.accent}`,
              background: isFollowing ? 'none' : colors.accent,
              color: isFollowing ? colors.textPrimary : '#fff',
              borderRadius: 20, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
            }}>{isFollowing ? 'Mengikuti' : 'Ikuti'}</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FollowersPage() {
  const { user: me } = useContext(AuthContext)
  const router = useRouter()
  const { username: rawSlug } = router.query
  const slug = rawSlug ? decodeURIComponent(rawSlug) : ''

  const [owner,     setOwner]     = useState(null)
  const [followers, setFollowers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [followMap, setFollowMap] = useState({})

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    const fetchOwner = api.get(`/users/by-username/${encodeURIComponent(slug)}`)
      .catch(() => api.get(`/users?username=${encodeURIComponent(slug)}&limit=1`).then(r => {
        const d = r.data?.data ?? r.data ?? []
        const item = Array.isArray(d) ? d[0] : d
        if (!item) return Promise.reject(new Error('not found'))
        return { data: { data: item } }
      }))

    fetchOwner.then(r => {
      const o = r.data?.data ?? r.data
      setOwner(o)
      return api.get(`/users/${o.id}/followers?limit=50`)
    }).then(r => {
      const arr = Array.isArray(r.data?.data ?? r.data) ? (r.data?.data ?? r.data) : []
      setFollowers(arr)
      const map = {}; arr.forEach(u => { if (u.isFollowed) map[u.id] = true }); setFollowMap(map)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  const handleFollow = useCallback((targetId) => {
    const next = !followMap[targetId]
    setFollowMap(p => ({ ...p, [targetId]: next }))
    ;(async () => {
      try { if (next) await api.post(`/users/${targetId}/follow`); else await api.delete(`/users/${targetId}/follow`) }
      catch { setFollowMap(p => ({ ...p, [targetId]: !next })) }
    })()
  }, [followMap])

  const ownerName    = owner?.profile?.username ?? owner?.username ?? slug ?? ''
  const ownerRep     = owner?.profile?.reputation ?? owner?.reputation ?? 0
  const followerCnt  = owner?._count?.followers ?? followers.length
  const followingCnt = owner?._count?.following ?? 0

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <Link href={`/user/profile/${encodeURIComponent(ownerName)}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
        <Avatar username={ownerName} size={42} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{ownerName}</div>
          <div style={{ fontSize: 12, color: colors.accent }}>Lihat profil →</div>
        </div>
      </Link>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <StatPill icon="⭐" value={ownerRep.toLocaleString()} label="Reputasi" accent="#f59e0b" />
        <StatPill icon="👥" value={followerCnt}  label="Pengikut" accent={colors.accent} />
        <StatPill icon="➕" value={followingCnt} label="Mengikuti" />
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Pengikut {ownerName} — OLION</title></Head>
      <UserLayout sidebar={sidebar}>
        {/* back bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${colors.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textPrimary, fontSize: 20, padding: 4, borderRadius: 8 }}
            onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >←</button>
          <div style={{ flex: 1 }}>
            <Link href={`/user/profile/${encodeURIComponent(ownerName)}`} style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, textDecoration: 'none', display: 'block' }}>{ownerName}</Link>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>@{ownerName}</div>
          </div>
        </div>
        {/* tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 57, zIndex: 9, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}>
          <span style={{ flex: 1, display: 'block', textAlign: 'center', padding: '12px 0', fontWeight: 700, fontSize: 14, color: colors.textPrimary, borderBottom: `2px solid ${colors.accent}`, cursor: 'default' }}>
            Pengikut <span style={{ fontSize: 12, color: colors.textSecondary }}>({followerCnt})</span>
          </span>
          <Link href={ownerName ? `/user/profile/${encodeURIComponent(ownerName)}/following` : '#'} style={{ flex: 1, display: 'block', textAlign: 'center', padding: '12px 0', fontSize: 14, fontWeight: 400, color: colors.textSecondary, textDecoration: 'none', borderBottom: '2px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.color = colors.textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = colors.textSecondary)}
          >
            Mengikuti <span style={{ fontSize: 12, color: colors.textSecondary }}>({followingCnt})</span>
          </Link>
        </div>
        {/* list */}
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: colors.bgElevated, flexShrink: 0 }} />
                <div style={{ flex: 1 }}><SkeletonCard variant="row" /></div>
              </div>
            ))
          : followers.length === 0
          ? <EmptyState icon="👥" title={`${ownerName} belum punya pengikut`} description="Jadilah yang pertama mengikuti!" Link={Link} />
          : followers.map(p => <PersonRow key={p.id} person={p} meId={me?.id} onFollow={handleFollow} followMap={followMap} />)
        }
      </UserLayout>
    </>
  )
}



