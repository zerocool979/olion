/**
 * pages/user/profile.jsx  — Profil diri sendiri
 *
 * URL: /user/profile
 * - Hanya untuk user yang sedang login
 * - Edit profil inline (username, bio, avatar warna)
 * - Setelah simpan username, URL profil publik berubah → /user/profile/{newUsername}
 * - Navigasi ke profil orang lain lewat /user/profile/{username}
 */
import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  DiscussionCard, AchievementPanel, SkeletonCard, colors,
  AVATAR_BORDER_PRESETS,
} from '../../components/dashboard'
import UserLayout from './_layout'

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

/* ─── ProfileBanner ─── */
function ProfileBanner({ isExpert }) {
  return (
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
        }}>
          🎓 PAKAR TERVERIFIKASI
        </span>
      )}
    </div>
  )
}

/* ─── EditForm ─── */
function EditForm({ form, onChange, onSave, onCancel, saving, saveError }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {/* Preview + pemilih bingkai */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <Avatar username={form.username || '?'} src={form.avatarUrl || undefined} border={form.avatarBorder} size={64} />
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>
            URL Foto Profil
          </label>
          <input
            value={form.avatarUrl}
            onChange={e => onChange({ ...form, avatarUrl: e.target.value })}
            placeholder="https://…"
            style={{
              display: 'block', width: '100%', padding: '7px 10px',
              borderRadius: 8, border: `1px solid ${colors.border}`,
              background: colors.bgElevated, color: colors.textPrimary,
              fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 6 }}>
        Bingkai Avatar
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {AVATAR_BORDER_PRESETS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange({ ...form, avatarBorder: p.value })}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              borderRadius: 8,
              outline: form.avatarBorder === p.value ? `2px solid ${colors.accent}` : '2px solid transparent',
            }}
          >
            <Avatar username={form.username || '?'} src={form.avatarUrl || undefined} border={p.value === 'none' ? undefined : p.value} size={34} />
            <span style={{ fontSize: 10, color: colors.textSecondary }}>{p.label}</span>
          </button>
        ))}
      </div>

      <input
        value={form.username}
        onChange={e => onChange({ ...form, username: e.target.value })}
        placeholder="Username" maxLength={32}
        style={{
          display: 'block', width: '100%', padding: '9px 12px',
          borderRadius: 8, border: `1px solid ${colors.accent}`,
          background: colors.bgElevated, color: colors.textPrimary,
          fontSize: 16, fontWeight: 700, marginBottom: 8,
          outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      />
      <textarea
        value={form.bio}
        onChange={e => onChange({ ...form, bio: e.target.value })}
        placeholder="Bio singkat tentang kamu… (maks 160 karakter)"
        maxLength={160} rows={3}
        style={{
          display: 'block', width: '100%', padding: '8px 12px',
          borderRadius: 8, border: `1px solid ${colors.border}`,
          background: colors.bgElevated, color: colors.textPrimary,
          fontSize: 14, resize: 'none', outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5,
        }}
      />
      {saveError && (
        <div style={{ padding: '8px 12px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginTop: 10 }}>
          ⚠️ {saveError}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
        <button onClick={onCancel} style={{
          border: `1px solid ${colors.border}`, background: 'none',
          borderRadius: 20, padding: '6px 16px',
          fontSize: 13, color: colors.textSecondary, cursor: 'pointer',
        }}>Batal</button>
        <button onClick={onSave} disabled={saving || !form.username.trim()} style={{
          background: form.username.trim() ? colors.accent : colors.bgElevated,
          color: form.username.trim() ? '#fff' : colors.textSecondary,
          border: 'none', borderRadius: 20, padding: '6px 18px',
          fontSize: 13, fontWeight: 700, cursor: form.username.trim() ? 'pointer' : 'default',
        }}>
          {saving ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN — halaman profil diri sendiri
═══════════════════════════════════════════ */
export default function MyProfile() {
  const { user: me, updateUser } = useContext(AuthContext)
  const router = useRouter()

  const [profile,      setProfile]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [loadError,    setLoadError]    = useState(false)
  const [tab,          setTab]          = useState('diskusi')
  const [posts,        setPosts]        = useState([])
  const [likedPosts,   setLikedPosts]   = useState([])
  const [comments,     setComments]     = useState([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [editing,      setEditing]      = useState(false)
  const [editForm,     setEditForm]     = useState({ username: '', bio: '', avatarUrl: '', avatarBorder: 'none' })
  const [saving,       setSaving]       = useState(false)
  const [saveError,    setSaveError]    = useState('')

  /* ── fetch own profile ── */
  useEffect(() => {
    // FIX AKAR MASALAH: /auth/me membalas { user: {...} }, tapi kode lama
    // mengambil `r.data?.data ?? r.data` — karena tidak ada `.data.data`,
    // ini jatuh ke `r.data` MENTAH (masih terbungkus { user: {...} }), bukan
    // objek user itu sendiri. Akibatnya SEMUA turunan di bawah (username,
    // bio, reputasi, jumlah diskusi/follower) diam-diam selalu jatuh ke nilai
    // default/kosong — inilah sebab halaman ini terasa "tidak sinkron" dengan
    // /user/profile/[username] yang fetch dari endpoint berbeda dengan bentuk
    // yang benar.
    api.get('/auth/me')
      .then(r => {
        const d = r.data?.user ?? r.data?.data ?? r.data
        if (!d) { setLoadError(true); return }
        setProfile(d)
        setEditForm({
          username: d?.profile?.username ?? d?.username ?? '',
          bio: d?.profile?.bio ?? d?.bio ?? '',
          avatarUrl: d?.profile?.avatarUrl ?? d?.avatarUrl ?? '',
          avatarBorder: d?.profile?.avatarBorder ?? d?.avatarBorder ?? 'none',
        })
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [])

  /* ── fetch content per tab ── */
  useEffect(() => {
    if (!profile) return
    const uid = profile.id
    setPostsLoading(true)

    if (tab === 'diskusi') {
      api.get(`/discussions?userId=${uid}&limit=20&sort=recent`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setPosts(Array.isArray(d) ? d : []) })
        .catch(() => setPosts([]))
        .finally(() => setPostsLoading(false))

    } else if (tab === 'disukai') {
      api.get(`/votes?userId=${uid}&limit=20`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setLikedPosts(Array.isArray(d) ? d : []) })
        .catch(() => setLikedPosts([]))
        .finally(() => setPostsLoading(false))

    } else if (tab === 'komentar') {
      api.get(`/comments?userId=${uid}&limit=20`)
        .then(r => { const d = r.data?.data ?? r.data ?? []; setComments(Array.isArray(d) ? d : []) })
        .catch(() => setComments([]))
        .finally(() => setPostsLoading(false))
    }
  }, [profile, tab])

  /* ── save profile — redirect ke /user/profile/{newUsername} ── */
  const handleSave = async () => {
    if (!editForm.username.trim()) return
    setSaving(true); setSaveError('')
    try {
      const res = await api.patch('/users/me/profile', {
        username: editForm.username,
        bio: editForm.bio,
        avatarUrl: editForm.avatarUrl,
        avatarBorder: editForm.avatarBorder,
      })
      // FIX: pakai data resmi dari server (sudah di-trim/divalidasi backend),
      // bukan input mentah — supaya tidak ada selisih antara apa yang
      // ditampilkan lokal vs apa yang sebenarnya tersimpan di database.
      const savedProfile = res.data?.profile ?? {
        username: editForm.username.trim(), bio: editForm.bio,
        avatarUrl: editForm.avatarUrl || null, avatarBorder: editForm.avatarBorder === 'none' ? null : editForm.avatarBorder,
      }

      setProfile(prev => ({ ...prev, profile: { ...prev?.profile, ...savedProfile } }))

      // FIX: sebelumnya memanggil `setUser?.()` yang tidak pernah ada di
      // AuthContext (no-op) — akibatnya kartu profil di sidebar tidak update,
      // dan halaman publik salah mengira kita "orang lain" (nampilin tombol
      // Ikuti di profil sendiri) karena username lama masih nyangkut di context.
      updateUser(prev => ({ ...prev, profile: { ...prev?.profile, ...savedProfile } }))

      setEditing(false)
      // URL publik profil menggunakan username baru (hasil resmi dari server)
      router.replace(`/user/profile/${encodeURIComponent(savedProfile.username)}`)
    } catch (err) {
      setSaveError(err?.response?.data?.message ?? 'Gagal menyimpan profil.')
    } finally { setSaving(false) }
  }

  const handleVote = useCallback(async (post, liked) => {
    try { await api.post('/votes', { discussionId: post.id, value: liked ? 1 : 0 }) } catch {}
  }, [])

  /* ── derived ── */
  const username   = profile?.profile?.username   ?? profile?.username   ?? 'Anonim'
  const bio        = profile?.profile?.bio        ?? ''
  const avatarUrl    = profile?.profile?.avatarUrl    ?? profile?.avatarUrl    ?? null
  const avatarBorder = profile?.profile?.avatarBorder ?? profile?.avatarBorder ?? null
  const reputation = profile?.profile?.reputation ?? profile?.reputation ?? 0
  const postCount  = profile?._count?.discussions ?? profile?.postCount  ?? 0
  const voteCount  = profile?.profile?.totalVotes ?? profile?._count?.votes ?? 0
  const joinDate   = profile?.createdAt
  const isExpert   = profile?.isVerifiedExpert || profile?.role === 'EXPERT'
  const followers  = profile?._count?.followers   ?? profile?.followerCount  ?? 0
  const following  = profile?._count?.following   ?? profile?.followingCount ?? 0
  const tier       = tierFor(reputation)

  const achievements = REPUTATION_TIERS.map(t => ({
    ...t, unlocked: reputation >= t.threshold, hint: `${t.threshold.toLocaleString()} rep`,
  }))

  /* ── sidebar ── */
  const sidebar = (
    <>
      {/* Statistik */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>📊 Statistik</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <StatPill icon="⭐" value={reputation.toLocaleString()} label="Reputasi"       accent="#f59e0b" />
          <StatPill icon="📝" value={postCount}                   label="Diskusi"        accent="#60a5fa" />
          <StatPill icon="👍" value={voteCount}                   label="Upvote Diterima" accent="#4ade80" />
          <StatPill icon="👥" value={followers}                   label="Pengikut" />
          <StatPill icon="➕" value={following}                   label="Mengikuti" />
        </div>
        <Link href="/user/chat" style={{
          marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '8px 0', boxSizing: 'border-box',
          background: colors.accent, color: '#fff', textDecoration: 'none',
          borderRadius: 20, fontSize: 13, fontWeight: 700,
        }}>
          💬 Buka Pesan
        </Link>
      </div>

      {/* Badge */}
      <AchievementPanel title="Badge" icon="🏆" achievements={achievements}
        footer={<Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Papan peringkat →</Link>}
      />

      {/* Link profil publik */}
      {profile && (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 10 }}>🔗 Profil Publik</span>
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            background: colors.bgElevated, border: `1px solid ${colors.border}`,
            fontSize: 13, color: colors.accent, wordBreak: 'break-all',
          }}>
            /user/profile/<strong>{username}</strong>
          </div>
          <button
            onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/user/profile/${encodeURIComponent(username)}`) }}
            style={{
              marginTop: 8, width: '100%', padding: '7px 0',
              background: 'none', border: `1px solid ${colors.border}`,
              borderRadius: 20, fontSize: 12, color: colors.textSecondary,
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            📋 Salin link profil
          </button>
        </div>
      )}
    </>
  )

  return (
    <UserLayout sidebar={sidebar}>

      {/* ── Loading skeleton ── */}
      {loading && (
        <>
          <div style={{ height: 130, background: colors.bgElevated }} />
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: colors.bgElevated, marginTop: -36, marginBottom: 12 }} />
            <SkeletonCard variant="row" />
            <SkeletonCard variant="row" />
          </div>
        </>
      )}

      {/* ── Gagal memuat profil ── */}
      {!loading && loadError && (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
            Gagal memuat profil
          </h2>
          <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
            Terjadi kesalahan saat memuat profilmu. Coba muat ulang halaman ini.
          </p>
          <button onClick={() => window.location.reload()} style={{
            background: colors.accent, color: '#fff', border: 'none',
            borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Muat Ulang</button>
        </div>
      )}

      {/* ── Profil ── */}
      {!loading && profile && (
        <>
          <ProfileBanner isExpert={isExpert} />

          <div style={{ padding: '0 16px', borderBottom: `1px solid ${colors.border}` }}>

            {/* Avatar + tombol Edit */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <Avatar username={username} src={avatarUrl} border={avatarBorder} size={72} />
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
              <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
                {!editing
                  ? (
                    <button onClick={() => setEditing(true)} style={{
                      border: `1px solid ${colors.border}`, background: 'none',
                      borderRadius: 20, padding: '6px 16px',
                      fontSize: 13, fontWeight: 700, color: colors.textPrimary, cursor: 'pointer',
                    }}>Edit Profil</button>
                  )
                  : null
                }
              </div>
            </div>

            {/* Edit form atau tampilan nama */}
            {editing
              ? (
                <EditForm form={editForm} onChange={setEditForm} onSave={handleSave} onCancel={() => { setEditing(false); setSaveError('') }} saving={saving} saveError={saveError} />
              )
              : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>{username}</span>
                    {isExpert && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: colors.accent + '22', color: colors.accent, border: `1px solid ${colors.accent}44` }}>
                        🎓 Pakar
                      </span>
                    )}
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 99, background: colors.bgElevated, color: colors.textSecondary, border: `1px solid ${colors.border}` }}>
                      {tier.icon} {tier.label}
                    </span>
                  </div>
                  {bio && <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.55, marginBottom: 8 }}>{bio}</p>}
                </>
              )
            }

            {/* Meta baris */}
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: colors.textSecondary, paddingBottom: 12, flexWrap: 'wrap' }}>
              {joinDate && (
                <span>📅 Bergabung {new Date(joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
              )}
              <Link href="/user/following?tab=pengikut" style={{ textDecoration: 'none', color: colors.textSecondary }}>
                <b style={{ color: colors.textPrimary }}>{followers}</b> Pengikut
              </Link>
              <Link href="/user/following?tab=mengikuti" style={{ textDecoration: 'none', color: colors.textSecondary }}>
                <b style={{ color: colors.textPrimary }}>{following}</b> Mengikuti
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: `1px solid ${colors.border}`,
            position: 'sticky', top: 0, background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)', zIndex: 10,
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
          {postsLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
            : tab === 'diskusi' && (
                posts.length === 0
                  ? <EmptyState icon="📝" title="Belum ada diskusi" description="Bagikan pertanyaan atau wawasanmu." actionLabel="Buat Diskusi" actionHref="/user/create" Link={Link} />
                  : posts.map(d => (
                      <Link key={d.id} href={`/user/discussions/${d.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{ cursor: 'pointer' }}>
                          <DiscussionCard post={d} onLike={handleVote} />
                        </div>
                      </Link>
                    ))
              )
          }
          {!postsLoading && tab === 'disukai' && (
            likedPosts.length === 0
              ? <EmptyState icon="👍" title="Belum ada diskusi yang disukai" Link={Link} />
              : likedPosts.map(d => {
                  const discussion = d.discussion ?? d
                  return (
                    <Link key={discussion.id} href={`/user/discussions/${discussion.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ cursor: 'pointer' }}>
                        <DiscussionCard post={discussion} onLike={handleVote} />
                      </div>
                    </Link>
                  )
                })
          )}
          {!postsLoading && tab === 'komentar' && (
            comments.length === 0
              ? <EmptyState icon="💬" title="Belum ada komentar" Link={Link} />
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
  )
}



