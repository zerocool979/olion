'use client'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../lib/api'
import { Avatar, colors } from '../../components/dashboard'

const STATUS_CFG = {
  PENDING:  { color: '#f59e0b', bg: '#f59e0b22', icon: '⏳', label: 'Sedang Diproses' },
  APPROVED: { color: '#10b981', bg: '#10b98122', icon: '✅', label: 'Disetujui' },
  REJECTED: { color: '#ef4444', bg: '#ef444422', icon: '❌', label: 'Ditolak' },
}

export default function ExpertApplyPage() {
  const { user } = useContext(AuthContext)
  const router   = useRouter()

  const [existing, setExisting] = useState(undefined)  // undefined=loading
  const [field,       setField]     = useState('')
  const [credentials, setCredentials] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  // Guard: hanya untuk user yang login
  useEffect(() => {
    if (user === null) router.replace('/auth/login')
    if (user?.isVerifiedExpert) router.replace('/expert/dashboard')
  }, [user, router])

  // Cek apakah user sudah pernah apply
  useEffect(() => {
    if (!user) return
    api.get('/expert/my-application')
      .then(r => setExisting(r.data.data ?? null))
      .catch(() => setExisting(null))
  }, [user])

  const handleSubmit = async () => {
    if (!field.trim())       return showToast('Bidang keahlian harus diisi', false)
    if (!credentials.trim()) return showToast('Bukti kredensial harus diisi', false)
    if (credentials.trim().length < 50)
      return showToast('Deskripsi kredensial minimal 50 karakter agar mudah ditinjau', false)

    setSubmitting(true)
    try {
      await api.post('/expert/apply', { field: field.trim(), credentials: credentials.trim() })
      showToast('Permohonan berhasil dikirim! Kami akan meninjau dalam 3–5 hari kerja.')
      // Refresh status
      const r = await api.get('/expert/my-application')
      setExisting(r.data.data)
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Gagal mengirim permohonan', false)
    }
    setSubmitting(false)
  }

  const inputStyle = {
    width: '100%', background: colors.bgElevated, border: `1px solid ${colors.border}`,
    borderRadius: 8, padding: '10px 14px', color: colors.textPrimary, fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  }

  return (
    <>
      <Head><title>Ajukan Verifikasi Pakar — OLION</title></Head>
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui,sans-serif' }}>
        {toast && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: toast.ok ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 20px', borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: 360 }}>
            {toast.msg}
          </div>
        )}

        {/* Topbar */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
          <Link href="/user/dashboard" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: 20 }}>←</Link>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Ajukan Verifikasi Pakar</span>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 20px' }}>
          {/* Info box */}
          <div style={{ background: colors.accent + '11', border: `1px solid ${colors.accent}44`, borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>✅ Manfaat Pakar Terverifikasi</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: colors.textSecondary, fontSize: 13, lineHeight: 1.8 }}>
              <li>Badge "Pakar Terverifikasi" di profil & komentar kamu</li>
              <li>Poin reputasi bonus +50 saat disetujui</li>
              <li>Akses ke dashboard pakar dengan daftar pertanyaan tematik</li>
              <li>Jawaban kamu ditampilkan lebih menonjol di diskusi</li>
            </ul>
          </div>

          {/* Status permohonan yang sudah ada */}
          {existing === undefined && (
            <div style={{ color: colors.textSecondary, textAlign: 'center', padding: 40 }}>Memuat status permohonan...</div>
          )}

          {existing !== null && existing !== undefined && (
            <div style={{ background: colors.bgElevated, border: `1px solid ${STATUS_CFG[existing.status]?.color ?? colors.border}44`, borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{STATUS_CFG[existing.status]?.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Status Permohonan</div>
                  <span style={{ fontSize: 12, background: STATUS_CFG[existing.status]?.bg, color: STATUS_CFG[existing.status]?.color, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
                    {STATUS_CFG[existing.status]?.label}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
                <strong style={{ color: colors.textPrimary }}>Bidang:</strong> {existing.field}
              </div>
              {existing.reviewNote && (
                <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8, background: colors.bg, borderRadius: 8, padding: '10px 14px' }}>
                  <strong style={{ color: colors.textPrimary }}>Catatan reviewer:</strong> {existing.reviewNote}
                </div>
              )}
              {existing.status === 'REJECTED' && (
                <button onClick={() => setExisting(null)} style={{ marginTop: 14, background: colors.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Ajukan Kembali
                </button>
              )}
            </div>
          )}

          {/* Form — hanya tampil kalau belum ada permohonan pending/approved */}
          {(existing === null || existing?.status === 'REJECTED') && (
            <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '24px' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
                {existing?.status === 'REJECTED' ? 'Ajukan Kembali' : 'Formulir Permohonan'}
              </h2>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>
                  Bidang Keahlian *
                </label>
                <input
                  value={field} onChange={e => setField(e.target.value)}
                  placeholder="Contoh: Kecerdasan Buatan & Machine Learning"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>
                  Bukti Kredensial *
                  <span style={{ color: colors.textSecondary, fontWeight: 400, marginLeft: 6 }}>(min. 50 karakter)</span>
                </label>
                <textarea
                  value={credentials} onChange={e => setCredentials(e.target.value)} rows={6}
                  placeholder={`Jelaskan latar belakang kamu. Contoh:\n• Gelar: S2 Ilmu Komputer Universitas Indonesia (2019)\n• Pengalaman: 5 tahun ML Engineer di perusahaan X\n• Publikasi: "..." (link jurnal)\n• Sertifikasi: Google Professional ML Engineer`}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
                <div style={{ fontSize: 11, color: credentials.length >= 50 ? '#10b981' : colors.textSecondary, marginTop: 4, textAlign: 'right' }}>
                  {credentials.length} karakter {credentials.length >= 50 ? '✓' : `(min. 50)`}
                </div>
              </div>

              <button
                onClick={handleSubmit} disabled={submitting}
                style={{ width: '100%', background: submitting ? colors.border : colors.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
                {submitting ? 'Mengirim...' : 'Kirim Permohonan'}
              </button>

              <p style={{ fontSize: 11, color: colors.textSecondary, marginTop: 12, textAlign: 'center', lineHeight: 1.6 }}>
                Permohonan akan ditinjau oleh tim OLION dalam 3–5 hari kerja. Kamu akan mendapat notifikasi saat ada keputusan.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


