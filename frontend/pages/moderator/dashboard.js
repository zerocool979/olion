'use client'
import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../lib/api'
import { Avatar, colors } from '../../components/dashboard'

function SectionTitle({ children }) {
  return <h2 style={{ color: colors.textPrimary, fontSize: 17, fontWeight: 700, margin: '28px 0 12px', borderBottom: `1px solid ${colors.border}`, paddingBottom: 8 }}>{children}</h2>
}

const STATUS_COLORS = { PENDING: '#f59e0b', RESOLVED: '#10b981', REJECTED: '#ef4444' }

export default function ModeratorDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router   = useRouter()

  const [reports, setReports]   = useState([])
  const [hidden,  setHidden]    = useState([])
  const [stats,   setStats]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [tab,     setTab]       = useState('queue')
  const [toast,   setToast]     = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // Guard: hanya MODERATOR/ADMIN. Sama seperti admin/dashboard.js — tunggu
  // authLoading selesai, lalu tendang keluar jika belum login ATAU role salah
  // (sebelumnya `user &&` membuat pengguna yang belum login lolos guard ini).
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/guest/login'); return }
    if (!['MODERATOR','ADMIN'].includes(user.role)) router.replace('/user')
  }, [user, authLoading, router])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, hDiscRes, hComRes] = await Promise.all([
        api.get('/reports?take=80'),
        api.get('/discussions?take=50'),
        api.get('/comments?userId=all&take=50').catch(() => ({ data: { data: [] } })),
      ])
      const allReports = rRes.data.data ?? []
      setReports(allReports)

      // Diskusi/komentar yang tersembunyi
      const hiddenDiscs = (hDiscRes.data.data ?? []).filter(d => d.isHidden)
      setHidden(hiddenDiscs)

      // Statistik sederhana
      const pending  = allReports.filter(r => r.status === 'PENDING').length
      const resolved = allReports.filter(r => r.status === 'RESOLVED').length
      const rejected = allReports.filter(r => r.status === 'REJECTED').length
      setStats({ pending, resolved, rejected, hiddenContent: hiddenDiscs.length })
    } catch { /* noop */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const reviewReport = async (id, status, action = 'none') => {
    try {
      await api.put(`/reports/${id}`, { status, action })
      showToast(`Laporan berhasil ${status === 'RESOLVED' ? 'diselesaikan' : 'ditolak'}`)
      fetchAll()
    } catch { showToast('Gagal memperbarui laporan', false) }
  }

  const unhideDiscussion = async (id) => {
    try {
      await api.patch(`/discussions/${id}`, { isHidden: false }).catch(() =>
        // fallback jika endpoint patch tidak support isHidden field langsung
        api.delete(`/discussions/${id}/hide`)
      )
      showToast('Diskusi berhasil ditampilkan kembali')
      fetchAll()
    } catch { showToast('Gagal menampilkan diskusi', false) }
  }

  const pendingReports = reports.filter(r => r.status === 'PENDING')
  const resolvedReports = reports.filter(r => r.status !== 'PENDING')

  return (
    <>
      <Head><title>Panel Moderator — OLION</title></Head>
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
            <span style={{ fontSize: 12, background: '#3b82f622', color: '#3b82f6', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>MODERATOR</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/user" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none' }}>← Dashboard User</Link>
            {user && <Avatar username={user.profile?.username} size={32} />}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Panel Moderator</h1>
            <p style={{ color: colors.textSecondary, marginTop: 4, fontSize: 13 }}>Tinjau laporan dan jaga kualitas konten platform.</p>
          </div>

          {/* Stats ringkas */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 8 }}>
              {[
                { label: 'Laporan Pending', value: stats.pending, color: '#f59e0b' },
                { label: 'Diselesaikan', value: stats.resolved, color: '#10b981' },
                { label: 'Ditolak', value: stats.rejected, color: '#ef4444' },
                { label: 'Konten Disembunyikan', value: stats.hiddenContent, color: '#6366f1' },
              ].map(s => (
                <div key={s.label} style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab */}
          <div style={{ display: 'flex', gap: 4, margin: '22px 0 0', borderBottom: `1px solid ${colors.border}` }}>
            {[['queue',`🚨 Antrian (${pendingReports.length})`], ['history','📋 Riwayat'], ['hidden','🙈 Disembunyikan']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 18px', fontSize: 13, fontWeight: tab === key ? 700 : 400, color: tab === key ? colors.accent : colors.textSecondary, borderBottom: tab === key ? `2px solid ${colors.accent}` : '2px solid transparent', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Antrian laporan ── */}
          {tab === 'queue' && (
            <>
              <SectionTitle>Laporan Menunggu Tindakan</SectionTitle>
              {loading ? <div style={{ color: colors.textSecondary, padding: 40, textAlign: 'center' }}>Memuat...</div>
              : pendingReports.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                  <div>Tidak ada laporan yang menunggu</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pendingReports.map(r => (
                    <ReportCard key={r.id} report={r} onReview={reviewReport} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Riwayat ── */}
          {tab === 'history' && (
            <>
              <SectionTitle>Riwayat Moderasi</SectionTitle>
              {resolvedReports.length === 0 ? (
                <div style={{ color: colors.textSecondary, padding: 40, textAlign: 'center' }}>Belum ada riwayat moderasi</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {resolvedReports.map(r => (
                    <div key={r.id} style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <span style={{ fontSize: 11, background: STATUS_COLORS[r.status] + '22', color: STATUS_COLORS[r.status], padding: '2px 8px', borderRadius: 12, fontWeight: 700, marginRight: 8 }}>{r.status}</span>
                        <span style={{ fontSize: 13, color: colors.textPrimary }}>{r.reason?.slice(0, 80)}</span>
                      </div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>
                        {r.discussion ? '📄 Diskusi' : r.comment ? '💬 Komentar' : '👤 User'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Konten tersembunyi ── */}
          {tab === 'hidden' && (
            <>
              <SectionTitle>Konten yang Disembunyikan</SectionTitle>
              {hidden.length === 0 ? (
                <div style={{ color: colors.textSecondary, padding: 40, textAlign: 'center' }}>Tidak ada konten yang disembunyikan</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {hidden.map(d => (
                    <div key={d.id} style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                        <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 3 }}>oleh {d.user?.profile?.username ?? 'Anonim'}</div>
                      </div>
                      <button onClick={() => unhideDiscussion(d.id)} style={{ background: '#10b98122', color: '#10b981', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
                        Tampilkan Kembali
                      </button>
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

function ReportCard({ report: r, onReview }) {
  return (
    <div style={{ background: colors.bgElevated, border: `1px solid #f59e0b55`, borderRadius: 10, padding: '16px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: '#f59e0b22', color: '#f59e0b', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>PENDING</span>
            <span style={{ fontSize: 11, color: colors.textSecondary }}>
              {r.discussion ? `📄 "${r.discussion.title?.slice(0,50)}"` : r.comment ? `💬 Komentar` : `👤 Pengguna`}
            </span>
          </div>
          <div style={{ fontSize: 13, color: colors.textPrimary }}><strong>Alasan:</strong> {r.reason}</div>
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>Pelapor: {r.reporter?.profile?.username ?? '—'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {r.discussionId && (
            <button onClick={() => onReview(r.id, 'RESOLVED', 'hide_discussion')} style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              🙈 Sembunyikan
            </button>
          )}
          {r.commentId && (
            <button onClick={() => onReview(r.id, 'RESOLVED', 'hide_comment')} style={{ background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              🙈 Sembunyikan Komentar
            </button>
          )}
          <button onClick={() => onReview(r.id, 'RESOLVED', 'none')} style={{ background: '#10b98122', color: '#10b981', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            ✅ Selesai (tanpa tindakan)
          </button>
          <button onClick={() => onReview(r.id, 'REJECTED')} style={{ background: colors.bgHover, color: colors.textSecondary, border: `1px solid ${colors.border}`, borderRadius: 7, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
            ✖ Tolak Laporan
          </button>
        </div>
      </div>
    </div>
  )
}


