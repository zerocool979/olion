/**
 * pages/user/profile/[username].jsx  — Profil publik berdasarkan username
 *
 * URL: /user/profile/{username}
 * - Semua link navigasi antar profil menggunakan nama, bukan ID
 * - Avatar, header, badge semua di-derive dari username di URL
 * - Jika username = profil sendiri → tampilkan tombol "Edit Profil"
 * - Jika orang lain → tampilkan tombol Ikuti/Mengikuti
 * - "Pengikut" & "Mengikuti" adalah link ke /user/profile/{username}/following
 *   dan /user/profile/{username}/followers
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  DiscussionCard, AchievementPanel, SkeletonCard, TrendingRow, colors,
} from '../../../components/dashboard'
import UserLayout from '../_layout'

/* ─── constants ─── */
const REPUTATION_TIERS = [
  { id: 'pemula',    icon: '🌱', label: 'Pemula',    threshold: 0 },
  { id: 'aktif',     icon: '✍️', label: 'Aktif',     threshold: 100 },
  { id: 'tepercaya', icon: '🔥', label: 'Tepercaya', threshold: 500 },
  { id: 'ahli',      icon: '🎓', label: 'Ahli',      threshold: 2000 },
]

const TABS = [
  { val: 'diskusi',  label: 'Diskusi' },
  { val: 'disukai',  label: 'Disukai' },
  { val: 'komentar', label: 'Komentar' },
]

/* ─── helpers ─── */
function tierFor(rep) {
  return [...REPUTATION_TIERS].reverse().find(t => rep >= t.threshold) ?? REPUTATION_TIERS[0]
}

/* Beberapa link lama/komponen kadang mengirim ID user, bukan username.
   Deteksi pola UUID supaya kita masih bisa resolve profil dengan benar
   alih-alih menampilkan "Pengguna tidak ditemukan". */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/* ─── NotFound ─── */
function NotFound({ username }) {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
        Pengguna tidak ditemukan
      </h2>
      <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
        Tidak ada profil dengan nama <strong style={{ color: colors.textPrimary }}>@{username}</strong>
      </p>
      <Link href="/user" style={{
        display: 'inline-block', background: colors.accent, color: '#fff',
        textDecoration: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 600,
      }}>← Kembali ke Beranda</Link>
    </div>
  )
}

/* ─── ProfileCard sebagai komponen reusable ─── */
export function ProfileCard({ username: uname, size = 'md' }) {
  /* Mini card untuk dipakai di komentar, activity, dll */
  const sz   = size === 'sm' ? 28 : 40
  const href = `/user/profile/${encodeURIComponent(uname)}`
  return (
    <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
      <Avatar username={uname} size={sz} />
      <span style={{ fontWeight: 600, fontSize: size === 'sm' ? 12 : 14, color: colors.textPrimary }}>
        {uname}
      </span>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN — /user/profile/[username]
═══════════════════════════════════════════════════════ */
export default function PublicProfile() {
  const { user: me } = useContext(AuthContext)
  const router       = useRouter()
  const { username: rawUsername } = router.query          // slug dari URL
  const username = rawUsername ? decodeURIComponent(rawUsername) : ''

  const [profile,      setProfile]      = useState(null)
  const [notFound,     setNotFound]     = useState(false)
  const [loading,      setLoading]      = useState(true)

  const [tab,          setTab]          = useState('diskusi')
  const [posts,        setPosts]        = useState([])
  const [likedPosts,   setLikedPosts]   = useState([])
  const [comments,     setComments]     = useState([])
  const [contentLoading, setContentLoading] = useState(false)

  const [isFollowing,  setIsFollowing]  = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  /* bisa diri sendiri jika buka /user/profile/{myUsername} */
  const myUsername = me?.profile?.username ?? me?.username ?? ''
  const isSelf     = !!username && username.toLowerCase() === myUsername.toLowerCase()

  /* ── fetch profil by username ── */
  useEffect(() => {
    if (!username) return
    setLoading(true)
    setNotFound(false)
    setProfile(null)

    const byUsername = () =>
      api.get(`/users/by-username/${encodeURIComponent(username)}`)
        .catch(() => api.get(`/users?username=${encodeURIComponent(username)}&limit=1`)
          .then(r => {
            const d = r.data?.data ?? r.data ?? []
            const arr = Array.isArray(d) ? d : [d]
            const found = arr[0]
            if (!found) return Promise.reject(new Error('not found'))
            return { data: { data: found } }
          })
        )

    /* Slug terlihat seperti UUID (kemungkinan link lama yang mengirim ID) —
       coba resolve langsung by-ID, lalu redirect ke URL kanonik berbasis username. */
    const lookup = UUID_RE.test(username)
      ? api.get(`/users/${encodeURIComponent(username)}`).catch(byUsername)
      : byUsername()

    lookup
      .then(r => {
        const d = r.data?.user ?? r.data?.data ?? r.data
        if (!d) { setNotFound(true); return }
        setProfile(d)
        setIsFollowing(d.isFollowed ?? false)

        const canonical = d?.profile?.username ?? d?.username
        if (canonical && canonical !== username) {
          router.replace(`/user/profile/${encodeURIComponent(canonical)}`, undefined, { shallow: true })
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  /* ── fetch konten per tab ── */
  useEffect(() => {
    if (!profile) return
    const uid = profile.id
    setContentLoading(true)

    if (tab === 'diskusi') {
      api.get(`/discussions?userId=${uid}&limit=20&sort=recent`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setPosts(Array.isArray(d) ? d : []) })
        .catch(() => setPosts([]))
        .finally(() => setContentLoading(false))

    } else if (tab === 'disukai') {
      api.get(`/votes?userId=${uid}&limit=20`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setLikedPosts(Array.isArray(d) ? d : []) })
        .catch(() => setLikedPosts([]))
        .finally(() => setContentLoading(false))

    } else if (tab === 'komentar') {
      api.get(`/comments?userId=${uid}&limit=20`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setComments(Array.isArray(d) ? d : []) })
        .catch(() => setComments([]))
        .finally(() => setContentLoading(false))
    }
  }, [profile, tab])

  /* ── follow / unfollow ── */
  const handleFollow = useCallback(async () => {
    if (followLoading || !profile) return
    const next = !isFollowing
    setIsFollowing(next)
    setFollowLoading(true)
    try {
      if (next) await api.post(`/users/${profile.id}/follow`)
      else      await api.delete(`/users/${profile.id}/follow`)
    } catch {
      setIsFollowing(!next)  // rollback
    } finally { setFollowLoading(false) }
  }, [followLoading, isFollowing, profile])

  const handleVote = useCallback(async (post, liked) => {
    try { await api.post('/votes', { discussionId: post.id, value: liked ? 1 : 0 }) } catch {}
  }, [])

  /* ── derived ── */
  const displayUsername = profile?.profile?.username ?? profile?.username ?? username
  const bio             = profile?.profile?.bio      ?? ''
  const avatarUrl        = profile?.profile?.avatarUrl    ?? profile?.avatarUrl    ?? null
  const avatarBorder     = profile?.profile?.avatarBorder ?? profile?.avatarBorder ?? null
  const reputation      = profile?.profile?.reputation ?? profile?.reputation ?? 0
  const postCount       = profile?._count?.discussions ?? profile?.postCount  ?? 0
  const voteCount       = profile?.profile?.totalVotes ?? profile?._count?.votes ?? 0
  const joinDate        = profile?.createdAt
  const isExpert        = profile?.isVerifiedExpert || profile?.role === 'EXPERT'
  const followers       = profile?._count?.followers  ?? profile?.followerCount  ?? 0
  const following       = profile?._count?.following  ?? profile?.followingCount ?? 0
  const tier            = tierFor(reputation)

  const achievements = REPUTATION_TIERS.map(t => ({
    ...t, unlocked: reputation >= t.threshold, hint: `${t.threshold.toLocaleString()} rep`,
  }))

  const pageTitle = profile ? `${displayUsername} — OLION` : `@${username} — OLION`
  const pageDesc  = bio || `Lihat profil dan diskusi dari ${displayUsername} di OLION.`

  /* ── sidebar ── */
  const sidebar = profile ? (
    <>
      {/* Statistik */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>📊 Statistik</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatPill icon="⭐" value={reputation.toLocaleString()} label="Reputasi"        accent="#f59e0b" />
          <StatPill icon="📝" value={postCount}                   label="Diskusi"         accent="#60a5fa" />
          <StatPill icon="👍" value={voteCount}                   label="Upvote Diterima" accent="#4ade80" />
          <StatPill icon="👥" value={followers}                   label="Pengikut" />
          <StatPill icon="➕" value={following}                   label="Mengikuti" />
        </div>
      </div>

      {/* Badge */}
      <AchievementPanel title="Badge" icon="🏆" achievements={achievements}
        footer={<Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Papan peringkat →</Link>}
      />

      {/* Aksi profil */}
      {!isSelf && (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 10 }}>⚡ Aksi</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Kirim pesan — link ke chat */}
            <Link href={`/user/chat?userId=${profile.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: colors.bgElevated, border: `1px solid ${colors.border}`,
              borderRadius: 10, padding: '8px 14px',
              fontSize: 13, color: colors.textPrimary, textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
            onMouseLeave={e => (e.currentTarget.style.background = colors.bgElevated)}
            >
              💬 Kirim Pesan
            </Link>
            <Link href={`/user/report?targetId=${profile.id}&type=user`} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '8px 14px',
              fontSize: 13, color: '#dc2626', textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
            >
              🚩 Laporkan
            </Link>
          </div>
        </div>
      )}
    </>
  ) : null

  /* ══ RENDER ══ */
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description"        content={pageDesc} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type"        content="profile" />
      </Head>

      <UserLayout sidebar={sidebar}>

        {/* ── sticky back-bar ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={() => router.back()} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: colors.textPrimary, fontSize: 20, padding: 4,
            borderRadius: 8, display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >←</button>

          {/* Nama + jumlah post di sticky bar */}
          {profile && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, lineHeight: 1.2 }}>
                {displayUsername}
              </div>
              <div style={{ fontSize: 11, color: colors.textSecondary }}>
                {postCount} diskusi
              </div>
            </div>
          )}
          {loading && (
            <span style={{ fontSize: 14, color: colors.textSecondary }}>@{username}</span>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <>
            <div style={{ height: 130, background: colors.bgElevated }} />
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: colors.bgElevated, marginTop: -36, marginBottom: 12 }} />
              <SkeletonCard variant="row" /><SkeletonCard variant="row" />
            </div>
          </>
        )}

        {/* ── Not found ── */}
        {!loading && notFound && <NotFound username={username} />}

        {/* ── Profil ── */}
        {!loading && profile && (
          <>
            {/* Banner */}
            <div style={{
              height: 130,
              background: `linear-gradient(135deg, ${colors.accent}55 0%, ${colors.bgElevated} 100%)`,
              position: 'relative', flexShrink: 0,
            }}>
              {isExpert && (
                <span style={{
                  position: 'absolute', top: 12, right: 16,
                  background: colors.accent, color: '#fff',
                  fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '4px 12px',
                }}>🎓 PAKAR TERVERIFIKASI</span>
              )}
            </div>

            <div style={{ padding: '0 16px', borderBottom: `1px solid ${colors.border}` }}>

              {/* Avatar row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36, marginBottom: 10 }}>
                <div style={{ position: 'relative' }}>
                  <Avatar username={displayUsername} src={avatarUrl} border={avatarBorder} size={72} />
                  {isExpert && (
                    <span style={{
                      position: 'absolute', bottom: 0, right: -2,
                      width: 20, height: 20, borderRadius: '50%',
                      background: colors.accent, border: `2px solid ${colors.bg}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10,
                    }}>✓</span>
                  )}
                </div>

                {/* CTA button */}
                <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
                  {isSelf
                    ? (
                      <Link href="/user/profile" style={{
                        border: `1px solid ${colors.border}`, background: 'none',
                        borderRadius: 20, padding: '6px 16px',
                        fontSize: 13, fontWeight: 700, color: colors.textPrimary,
                        textDecoration: 'none', display: 'inline-block',
                      }}>Edit Profil</Link>
                    )
                    : (
                      <button onClick={handleFollow} disabled={followLoading} style={{
                        border: isFollowing ? `1px solid ${colors.border}` : `1px solid ${colors.accent}`,
                        background: isFollowing ? 'none' : colors.accent,
                        color: isFollowing ? colors.textPrimary : '#fff',
                        borderRadius: 20, padding: '6px 18px',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        opacity: followLoading ? 0.6 : 1,
                      }}>
                        {followLoading ? '…' : isFollowing ? 'Mengikuti' : 'Ikuti'}
                      </button>
                    )
                  }
                </div>
              </div>

              {/* Nama + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                {/* Nama = teks biasa — URL sudah mencerminkan nama */}
                <span style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>
                  {displayUsername}
                </span>
                {isExpert && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: colors.accent + '22', color: colors.accent, border: `1px solid ${colors.accent}44`,
                  }}>🎓 Pakar</span>
                )}
                <span style={{
                  fontSize: 12, padding: '2px 8px', borderRadius: 99,
                  background: colors.bgElevated, color: colors.textSecondary, border: `1px solid ${colors.border}`,
                }}>
                  {tier.icon} {tier.label}
                </span>
              </div>

              {/* Handle URL — tampilkan slug sebagai identitas publik */}
              <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: bio ? 6 : 0 }}>
                olion.app/user/profile/<span style={{ color: colors.accent }}>@{displayUsername}</span>
              </div>

              {bio && (
                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.55, marginBottom: 8 }}>
                  {bio}
                </p>
              )}

              {/* Meta baris — Pengikut & Mengikuti sebagai link ke halaman list */}
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: colors.textSecondary, paddingBottom: 12, flexWrap: 'wrap' }}>
                {joinDate && (
                  <span>📅 Bergabung {new Date(joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                )}

                {/* Link ke halaman pengikut menggunakan username */}
                <Link
                  href={`/user/profile/${encodeURIComponent(displayUsername)}/followers`}
                  style={{ textDecoration: 'none', color: colors.textSecondary }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  <b style={{ color: colors.textPrimary }}>{followers}</b> Pengikut
                </Link>

                {/* Link ke halaman mengikuti menggunakan username */}
                <Link
                  href={`/user/profile/${encodeURIComponent(displayUsername)}/following`}
                  style={{ textDecoration: 'none', color: colors.textSecondary }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  <b style={{ color: colors.textPrimary }}>{following}</b> Mengikuti
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', borderBottom: `1px solid ${colors.border}`,
              position: 'sticky', top: 57, background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(8px)', zIndex: 9,
            }}>
              {TABS.map(t => (
                <button key={t.val} onClick={() => setTab(t.val)} style={{
                  flex: 1, padding: '12px 0', background: 'none', border: 'none',
                  borderBottom: tab === t.val ? `2px solid ${colors.accent}` : '2px solid transparent',
                  fontWeight: tab === t.val ? 700 : 400,
                  color: tab === t.val ? colors.textPrimary : colors.textSecondary,
                  fontSize: 14, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>

            {/* Konten tab */}
            {contentLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
              : null
            }

            {!contentLoading && tab === 'diskusi' && (
              posts.length === 0
                ? <EmptyState icon="📝" title="Belum ada diskusi" description={`${displayUsername} belum membuat diskusi.`} Link={Link} />
                : posts.map(d => <DiscussionCard key={d.id} post={d} onLike={handleVote} />)
            )}

            {!contentLoading && tab === 'disukai' && (
              likedPosts.length === 0
                ? <EmptyState icon="👍" title="Belum ada diskusi yang disukai" Link={Link} />
                : likedPosts.map(d => <DiscussionCard key={d.id} post={d.discussion ?? d} onLike={handleVote} />)
            )}

            {!contentLoading && tab === 'komentar' && (
              comments.length === 0
                ? <EmptyState icon="💬" title="Belum ada komentar" description={`${displayUsername} belum berkomentar.`} Link={Link} />
                : comments.map((c, i) => (
                    <div key={c.id ?? i} style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
                      <Link href={`/user/discussions/${c.discussionId}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                          ↩ di <span style={{ color: colors.accent }}>{c.discussion?.title ?? 'diskusi'}</span>
                        </p>
                        <p style={{ fontSize: 14, color: colors.textPrimary, lineHeight: 1.5 }}>{c.content}</p>
                      </Link>
                    </div>
                  ))
            )}
          </>
        )}

      </UserLayout>
    </>
  )
}



