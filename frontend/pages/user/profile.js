import { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { ROUTES } from '../../lib/routes'
import Link from 'next/link'
import api from '../../lib/api'
import Avatar from '../../components/Avatar'
import { StatBox, SectionHeader, DiscussionRow, DiscussionSkeleton } from '../../components/profile'

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}h lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function joinedDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function UserProfile() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [stats, setStats] = useState(null)
  const [discussions, setDisc] = useState([])
  const [discLoading, setDiscLoad] = useState(true)
  const [bio, setBio] = useState('')
  const [editingBio, setEditingBio] = useState(false)
  const [bioSaving, setBioSaving] = useState(false)
  const [bioError, setBioError] = useState('')
  const [bioSuccess, setBioSuccess] = useState(false)
  const [tab, setTab] = useState('discussions')

  useEffect(() => {
    if (!authLoading && !user) router.replace(ROUTES.guest.login)
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.profile?.bio) setBio(user.profile.bio)
  }, [user])

  const fetchData = useCallback(async () => {
    if (!user) return
    setDiscLoad(true)
    try {
      const [discRes, statsRes] = await Promise.allSettled([
        api.get('/discussions', { params: { userId: user.id, limit: 8 } }),
        api.get('/users/me/stats').catch(() => null),
      ])

      if (discRes.status === 'fulfilled') {
        const raw = discRes.value.data?.data ?? discRes.value.data ?? []
        const mine = Array.isArray(raw)
          ? raw.filter(d => d.userId === user.id || d.user?.id === user.id)
          : []
        setDisc(mine.slice(0, 8))
      }

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value.data?.data ?? statsRes.value.data ?? null)
      }
    } catch (err) {
      console.error('[profile] fetch error', err)
    } finally {
      setDiscLoad(false)
    }
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const saveBio = async () => {
    setBioSaving(true)
    setBioError('')
    setBioSuccess(false)
    try {
      await api.patch('/users/me/bio', { bio })
      setBioSuccess(true)
      setEditingBio(false)
      setTimeout(() => setBioSuccess(false), 3000)
    } catch (err) {
      setBioError(err.response?.data?.message ?? 'Gagal menyimpan bio.')
    } finally {
      setBioSaving(false)
    }
  }

  if (authLoading || !user) return null

  const username = user?.profile?.username ?? user?.email ?? 'Pengguna'
  const reputation = user?.profile?.reputation ?? 0
  const role = user?.role ?? 'USER'
  const email = user?.email ?? '—'
  const joinedAt = user?.createdAt

  const roleColor = {
    ADMIN:     { bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
    MODERATOR: { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', color: '#fb923c' },
    EXPERT:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)',  color: '#4ade80' },
    USER:      { bg: 'rgba(148,163,184,0.08)',border: 'rgba(148,163,184,0.15)',color: '#94a3b8' },
  }[role] ?? { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)', color: '#94a3b8' }

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content animate-fade-up" style={{ maxWidth: '720px' }}>
        <div className="stagger-1" style={{
          position: 'relative',
          background: 'rgba(14,17,20,0.9)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '1rem',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Avatar username={username} size={64} />

            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.35rem',
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  {username}
                </h1>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '5px',
                  background: roleColor.bg,
                  border: `1px solid ${roleColor.border}`,
                  color: roleColor.color,
                }}>
                  {role === 'EXPERT' ? '✦ Expert' : role}
                </span>
              </div>

              {editingBio ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={280}
                    rows={3}
                    placeholder="Ceritakan sedikit tentang dirimu..."
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontFamily: "'DM Sans', sans-serif",
                      resize: 'vertical',
                      outline: 'none',
                      boxShadow: '0 0 0 3px rgba(255,255,255,0.04)',
                      lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={saveBio}
                      disabled={bioSaving}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem', height: 'auto' }}
                    >
                      {bioSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={() => { setEditingBio(false); setBioError('') }}
                      className="btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      Batal
                    </button>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {bio.length}/280
                    </span>
                  </div>
                  {bioError && (
                    <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem' }}>{bioError}</p>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <p style={{
                    fontSize: '0.85rem',
                    color: bio ? 'var(--text-secondary)' : 'var(--text-muted)',
                    lineHeight: 1.6,
                    fontStyle: bio ? 'normal' : 'italic',
                    flex: 1,
                  }}>
                    {bio || 'Belum ada bio. Tambahkan sedikit tentang dirimu.'}
                  </p>
                  <button
                    onClick={() => setEditingBio(true)}
                    title="Edit bio"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '0.25rem',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      flexShrink: 0,
                      borderRadius: '4px',
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              )}

              {bioSuccess && (
                <p className="animate-fade-in" style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.35rem' }}>
                  ✓ Bio berhasil disimpan
                </p>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: '1.5rem',
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
              }}>
                {reputation.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>reputasi</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Bergabung {joinedDate(joinedAt)}
            </span>
            {reputation >= 750 && role !== 'EXPERT' && (
              <button
                className="btn-outline"
                style={{ marginLeft: 'auto' }}
                onClick={() => alert('Fitur pengajuan Expert akan segera hadir.')}
              >
                Ajukan sebagai Expert
              </button>
            )}
          </div>
        </div>

        <div className="animate-fade-up stagger-2" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <StatBox value={stats?.discussionCount ?? discussions.length} label="Diskusi" />
          <StatBox value={stats?.commentCount ?? '—'} label="Komentar" />
          <StatBox value={stats?.upvotesReceived ?? '—'} label="Upvote Diterima" />
        </div>

        <div className="animate-fade-up stagger-3" style={{
          display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.25rem', marginBottom: '1.5rem',
        }}>
          {[
            { key: 'discussions', label: 'Diskusi Saya' },
            { key: 'account', label: 'Info Akun' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
                fontSize: '0.825rem', fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: '-0.01em',
                background: tab === t.key ? 'rgba(255,255,255,0.09)' : 'transparent',
                color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'all 160ms ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'discussions' && (
          <div className="animate-fade-in">
            <SectionHeader title="Diskusi Terbaru" count={discussions.length} />
            {discLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Array.from({ length: 4 }).map((_, i) => <DiscussionSkeleton key={i} />)}
              </div>
            ) : discussions.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '3rem 1rem',
                background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '12px',
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Kamu belum membuat diskusi.
                </p>
                <Link href={ROUTES.user.create} className="btn-outline" style={{ fontSize: '0.825rem' }}>
                  Buat Diskusi Pertama
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {discussions.map(d => <DiscussionRow key={d.id} d={d} />)}
                {discussions.length >= 8 && (
                  <Link
                    href="/user/discussions"
                    style={{
                      textAlign: 'center', padding: '0.625rem', fontSize: '0.8rem',
                      color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 160ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    Lihat semua diskusi →
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'account' && (
          <div className="animate-fade-in">
            <SectionHeader title="Informasi Akun" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Email',       value: email,             icon: '✉' },
                { label: 'Username',    value: username,          icon: '👤' },
                { label: 'Role',        value: role,              icon: '🔖' },
                { label: 'Bergabung',   value: joinedDate(joinedAt), icon: '📅' },
                { label: 'Reputasi',    value: `${reputation.toLocaleString()} poin`, icon: '⭐' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                  background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '10px',
                }}>
                  <span style={{ fontSize: '0.9rem', flexShrink: 0, width: '20px', textAlign: 'center' }}>{row.icon}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '90px', flexShrink: 0 }}>{row.label}</span>
                  <span style={{
                    fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500,
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <SectionHeader title="Zona Berbahaya" />
            <div style={{
              padding: '1.25rem', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '1rem',
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#fca5a5', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Ubah Password
                </p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(239,68,68,0.5)' }}>
                  Kirim email reset password ke {email}
                </p>
              </div>
              <button
                className="btn-danger"
                style={{ fontSize: '0.825rem', padding: '0.45rem 1rem' }}
                onClick={() => alert('Fitur ini akan segera tersedia.')}
              >
                Reset Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
