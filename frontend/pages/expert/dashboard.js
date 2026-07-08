'use client'
import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../lib/api'
import { Avatar, colors } from '../../components/dashboard'
import { timeAgo } from '../../lib/timeAgo'

function StatCard({ icon, value, label, accent = colors.accent }) {
  return (
    <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>{value ?? '—'}</div>
        <div style={{ fontSize: 12, color: colors.textSecondary }}>{label}</div>
      </div>
    </div>
  )
}

export default function ExpertDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router   = useRouter()

  const [discussions, setDiscussions] = useState([])
  const [myComments,  setMyComments]  = useState([])
  const [reputation,  setReputation]  = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState('questions')
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // Guard: hanya EXPERT/ADMIN/verified expert. Tunggu authLoading selesai, lalu
  // tendang keluar jika belum login ATAU role tidak sesuai (sebelumnya `user &&`
  // membuat pengguna yang belum login lolos guard ini).
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/guest/login'); return }
    if (!['EXPERT','ADMIN'].includes(user.role) && !user.isVerifiedExpert) router.replace('/user')
  }, [user, authLoading, router])

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [dRes, cRes, uRes] = await Promise.all([
        // Pertanyaan terbaru yang perlu dijawab
        api.get('/discussions?take=50'),
        // Komentar/jawaban yang sudah saya buat
        api.get(`/comments?userId=${user.id}&limit=30`),
        // Profil + reputasi saya
        api.get(`/users/${user.id}`),
      ])
      setDiscussions(dRes.data.data ?? [])
      setMyComments(cRes.data.data ?? [])
      setReputation(uRes.data?.user?.reputation ?? uRes.data?.reputation ?? 0)
    } catch { /* noop */ }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Diskusi yang belum saya komentari (butuh jawaban pakar)
  const unansweredForMe = discussions.filter(d =>
    !myComments.some(c => c.discussion?.id === d.id)
  ).slice(0, 20)

  return (
    <>
      <Head><title>Panel Pakar — OLION</title></Head>
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui,sans-serif' }}>
        {toast && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: toast.ok ? '#10b981' : '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            {toast.msg}
          </div>
        )}

        {/* Topbar */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>OLION</span>
            <span style={{ fontSize: 12, background: '#10b98122', color: '#10b981', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>✅ PAKAR TERVERIFIKASI</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/user" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>← Dashboard</Link>
            {user && <Avatar username={user.profile?.username} size={32} />}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            {user && <Avatar username={user.profile?.username} size={56} />}
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.profile?.username}</div>
              <div style={{ color: '#10b981', fontSize: 13, fontWeight: 600, marginTop: 2 }}>✅ Pakar Terverifikasi</div>
              <div style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                {user?.profile?.bio ?? 'Belum ada bio'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 8 }}>
            <StatCard icon="⭐" value={reputation?.toLocaleString()} label="Total Reputasi" accent="#f59e0b" />
            <StatCard icon="💬" value={myComments.length} label="Jawaban Diberikan" accent="#10b981" />
            <StatCard icon="❓" value={unansweredForMe.length} label="Belum Dijawab" accent={colors.accent} />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, margin: '22px 0 0', borderBottom: `1px solid ${colors.border}` }}>
            {[['questions',`❓ Pertanyaan (${unansweredForMe.length})`], ['my-answers','💬 Jawaban Saya']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 18px', fontSize: 13, fontWeight: tab === key ? 700 : 400, color: tab === key ? colors.accent : colors.textSecondary, borderBottom: tab === key ? `2px solid ${colors.accent}` : '2px solid transparent', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Pertanyaan belum dijawab ── */}
          {tab === 'questions' && (
            <div style={{ marginTop: 16 }}>
              {loading ? (
                <div style={{ color: colors.textSecondary, textAlign: 'center', padding: 40 }}>Memuat diskusi...</div>
              ) : unansweredForMe.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                  <div>Semua diskusi sudah mendapat jawaban dari kamu!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {unansweredForMe.map(d => (
                    <Link key={d.id} href={`/user/discussions/${d.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = colors.accent}
                        onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {d.title}
                            </div>
                            <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {d.content}
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: colors.textSecondary, flexWrap: 'wrap' }}>
                              <span>📂 {d.category?.name ?? '—'}</span>
                              <span>💬 {d._count?.comments ?? 0} komentar</span>
                              <span>👍 {d._count?.votes ?? 0} vote</span>
                              <span>🕐 {timeAgo(d.createdAt)}</span>
                            </div>
                          </div>
                          <span style={{ background: colors.accent + '22', color: colors.accent, fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                            Jawab →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Jawaban saya ── */}
          {tab === 'my-answers' && (
            <div style={{ marginTop: 16 }}>
              {loading ? (
                <div style={{ color: colors.textSecondary, textAlign: 'center', padding: 40 }}>Memuat jawaban...</div>
              ) : myComments.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>💡</div>
                  <div>Kamu belum memberikan jawaban apapun</div>
                  <button onClick={() => setTab('questions')} style={{ marginTop: 14, background: colors.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                    Lihat Pertanyaan
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {myComments.map(c => (
                    <Link key={c.id} href={`/user/discussions/${c.discussion?.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}>
                        <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 4 }}>
                          📄 {c.discussion?.title ?? 'Diskusi dihapus'}
                        </div>
                        <div style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {c.content}
                        </div>
                        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>
                          🕐 {timeAgo(c.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


