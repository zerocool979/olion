'use client'
import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../lib/api'
import { Avatar, colors } from '../../components/dashboard'

// ── Komponen pembantu ──────────────────────────────────────────────────────────
function StatCard({ icon, value, label, accent = colors.accent }) {
  return (
    <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: accent }}>{value ?? '—'}</div>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>{label}</div>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ color: colors.textPrimary, fontSize: 17, fontWeight: 700, margin: '28px 0 12px', borderBottom: `1px solid ${colors.border}`, paddingBottom: 8 }}>{children}</h2>
}

const ROLE_LABELS = { ADMIN: '🛡️ Admin', MODERATOR: '🔍 Mod', EXPERT: '✅ Pakar', USER: '👤 User' }
const ROLE_COLORS = { ADMIN: '#f59e0b', MODERATOR: '#3b82f6', EXPERT: '#10b981', USER: colors.textSecondary }
const STATUS_COLORS = { PENDING: '#f59e0b', RESOLVED: '#10b981', REJECTED: '#ef4444' }

// ── Page utama ─────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [stats,   setStats]   = useState(null)
  const [users,   setUsers]   = useState([])
  const [reports, setReports] = useState([])
  const [uFilter, setUFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState(null)
  const [tab,     setTab]     = useState('users') // users | reports

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // Guard: hanya ADMIN. Tunggu AuthContext selesai hydrate (authLoading) supaya
  // tidak salah redirect saat token masih divalidasi. Jika sudah selesai loading
  // dan ternyata tidak ada user (belum login) atau role-nya bukan ADMIN, tendang keluar.
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/guest/login'); return }
    if (user.role !== 'ADMIN') router.replace('/user')
  }, [user, authLoading, router])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, uRes, rRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users?take=100'),
        api.get('/reports?take=50'),
      ])
      setStats(sRes.data.data)
      setUsers(uRes.data.data ?? [])
      setReports(rRes.data.data ?? [])
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Aksi moderasi ────────────────────────────────────────────────────────────
  const setRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role })
      showToast(`Role berhasil diubah ke ${role}`)
      fetchAll()
    } catch { showToast('Gagal mengubah role', false) }
  }

  const toggleBan = async (id, isBanned) => {
    try {
      if (isBanned) await api.delete(`/admin/users/${id}/ban`)
      else          await api.post(`/admin/users/${id}/ban`)
      showToast(isBanned ? 'Akun diaktifkan kembali' : 'Akun dinonaktifkan')
      fetchAll()
    } catch { showToast('Gagal mengubah status ban', false) }
  }

  const reviewReport = async (id, status, action = 'none') => {
    try {
      await api.put(`/reports/${id}`, { status, action })
      showToast(`Laporan ditandai ${status.toLowerCase()}`)
      fetchAll()
    } catch { showToast('Gagal memperbarui laporan', false) }
  }

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const uname = u.profile?.username ?? ''
    const matchName = uname.toLowerCase().includes(uFilter.toLowerCase()) || u.email.toLowerCase().includes(uFilter.toLowerCase())
    const matchRole = roleFilter ? u.role === roleFilter : true
    return matchName && matchRole
  })

  const filteredReports = reports.filter(r => r.status === 'PENDING' || tab === 'reports')

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Head><title>Panel Admin — OLION</title></Head>
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui,sans-serif' }}>
        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: toast.ok ? '#10b981' : '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            {toast.msg}
          </div>
        )}

        {/* Topbar */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>OLION</span>
            <span style={{ fontSize: 12, background: '#f59e0b22', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>ADMIN</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/user" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>← Dashboard User</Link>
            {user && <Avatar username={user.profile?.username} size={32} />}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
          {/* Judul */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Panel Admin</h1>
            <p style={{ color: colors.textSecondary, marginTop: 4, fontSize: 14 }}>Kelola pengguna, laporan, dan konfigurasi platform OLION.</p>
          </div>

          {/* Stats grid */}
          {loading ? (
            <div style={{ color: colors.textSecondary, textAlign: 'center', padding: 40 }}>Memuat data...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 8 }}>
              <StatCard icon="👤" value={stats?.users} label="Total Pengguna" />
              <StatCard icon="💬" value={stats?.discussions} label="Diskusi" accent="#10b981" />
              <StatCard icon="✅" value={stats?.experts} label="Pakar Terverifikasi" accent="#10b981" />
              <StatCard icon="🔍" value={stats?.moderators} label="Moderator" accent="#3b82f6" />
              <StatCard icon="🚨" value={stats?.pendingReports} label="Laporan Pending" accent="#ef4444" />
              <StatCard icon="🚫" value={stats?.bannedUsers} label="Akun Dibanned" accent="#ef4444" />
            </div>
          )}

          {/* Tab navigasi */}
          <div style={{ display: 'flex', gap: 4, margin: '24px 0 0', borderBottom: `1px solid ${colors.border}` }}>
            {[['users','👥 Pengguna'], ['reports','🚨 Laporan']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', fontSize: 14, fontWeight: tab === key ? 700 : 400, color: tab === key ? colors.accent : colors.textSecondary, borderBottom: tab === key ? `2px solid ${colors.accent}` : '2px solid transparent', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab: Pengguna ── */}
          {tab === 'users' && (
            <>
              <SectionTitle>Manajemen Pengguna</SectionTitle>
              {/* Filter */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <input value={uFilter} onChange={e => setUFilter(e.target.value)} placeholder="Cari nama / email..." style={{ flex: 1, minWidth: 200, background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px', color: colors.textPrimary, fontSize: 14, outline: 'none' }} />
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px', color: colors.textPrimary, fontSize: 14, cursor: 'pointer' }}>
                  <option value="">Semua Role</option>
                  {['ADMIN','MODERATOR','EXPERT','USER'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Tabel */}
              <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${colors.border}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: colors.bgElevated, color: colors.textSecondary }}>
                      {['Pengguna', 'Email', 'Role', 'Status', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = colors.bgElevated}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar username={u.profile?.username} size={30} />
                            <span style={{ fontWeight: 600 }}>{u.profile?.username ?? 'Tanpa username'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', color: colors.textSecondary }}>{u.email}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: ROLE_COLORS[u.role] + '22', color: ROLE_COLORS[u.role], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                            {ROLE_LABELS[u.role] ?? u.role}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ color: u.isBanned ? '#ef4444' : '#10b981', fontSize: 12, fontWeight: 600 }}>
                            {u.isBanned ? '🚫 Banned' : '✅ Aktif'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <select defaultValue="" onChange={e => { if(e.target.value) setRole(u.id, e.target.value); e.target.value='' }}
                              style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 6, padding: '4px 8px', color: colors.textSecondary, fontSize: 12, cursor: 'pointer' }}>
                              <option value="" disabled>Ganti role</option>
                              {['USER','EXPERT','MODERATOR','ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {u.role !== 'ADMIN' && (
                              <button onClick={() => toggleBan(u.id, u.isBanned)} style={{ background: u.isBanned ? '#10b98122' : '#ef444422', color: u.isBanned ? '#10b981' : '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                {u.isBanned ? 'Aktifkan' : 'Ban'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 40 }}>Tidak ada pengguna yang cocok</div>
                )}
              </div>
              <div style={{ marginTop: 8, color: colors.textSecondary, fontSize: 12 }}>
                {filteredUsers.length} dari {users.length} pengguna
              </div>
            </>
          )}

          {/* ── Tab: Laporan ── */}
          {tab === 'reports' && (
            <>
              <SectionTitle>Antrian Laporan</SectionTitle>
              {reports.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                  <div>Tidak ada laporan saat ini</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reports.map(r => (
                    <div key={r.id} style={{ background: colors.bgElevated, border: `1px solid ${r.status === 'PENDING' ? '#f59e0b55' : colors.border}`, borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ color: STATUS_COLORS[r.status], fontSize: 11, fontWeight: 700, background: STATUS_COLORS[r.status] + '22', padding: '2px 8px', borderRadius: 12 }}>
                              {r.status}
                            </span>
                            <span style={{ fontSize: 11, color: colors.textSecondary }}>
                              {r.discussion ? `📄 Diskusi: ${r.discussion.title?.slice(0,60)}...` : r.comment ? `💬 Komentar` : `👤 Pengguna`}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: colors.textPrimary, marginBottom: 4 }}>
                            <strong>Alasan:</strong> {r.reason}
                          </div>
                          <div style={{ fontSize: 11, color: colors.textSecondary }}>
                            Pelapor: <strong>{r.reporter?.profile?.username ?? 'Anonim'}</strong>
                          </div>
                        </div>
                        {r.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {r.discussionId && (
                              <button onClick={() => reviewReport(r.id, 'RESOLVED', 'hide_discussion')}
                                style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                🙈 Sembunyikan Diskusi
                              </button>
                            )}
                            {r.commentId && (
                              <button onClick={() => reviewReport(r.id, 'RESOLVED', 'hide_comment')}
                                style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                🙈 Sembunyikan Komentar
                              </button>
                            )}
                            <button onClick={() => reviewReport(r.id, 'RESOLVED', 'none')}
                              style={{ background: '#10b98122', color: '#10b981', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                              ✅ Selesaikan
                            </button>
                            <button onClick={() => reviewReport(r.id, 'REJECTED')}
                              style={{ background: colors.bgHover, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}


