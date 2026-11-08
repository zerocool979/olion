import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'

export default function VerifyEmail() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (typeof router.query.email === 'string') setEmail(router.query.email)
    if (typeof router.query.token === 'string') setToken(router.query.token)
  }, [router.isReady, router.query.email, router.query.token])

  // Do not consume a verification token merely because a mail-security scanner
  // opened the link. The user must explicitly confirm on this page.
  const confirmEmail = async () => {
    if (!token || loading) return
    setMessage('')
    setLoading(true)
    setStatus('loading')
    try {
      const res = await api.post('/auth/verify-email/confirm', { token })
      setStatus('success')
      setMessage(res.data?.message || 'Email berhasil diverifikasi.')
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Link tidak valid atau sudah kedaluwarsa.')
    } finally {
      setLoading(false)
    }
  }

  const requestLink = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-email/request', { email })
      setStatus('sent')
      setMessage(res.data?.message || 'Jika akun perlu diverifikasi, link akan dikirim.')
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Permintaan tidak dapat diproses. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ width: '100%', maxWidth: 420, padding: '32px', border: '1px solid ' + colors.border, borderRadius: 18, background: colors.bgElevated }}>
        <h1 style={{ fontSize: 24, fontWeight: 750, margin: '0 0 8px' }}>Verifikasi Email OLION</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Verifikasi alamat email untuk membantu melindungi akses akun Anda.
        </p>

        {message ? (
          <p role="status" style={{ color: status === 'success' ? '#16a34a' : status === 'error' ? colors.like : colors.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
        ) : null}

        {status === 'success' ? null : token && status === 'idle' ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ color: colors.textSecondary, fontSize: 14 }}>Tekan tombol di bawah untuk menyelesaikan verifikasi alamat email.</p>
            <button type="button" onClick={confirmEmail} disabled={loading} style={{ padding: 12, border: 0, borderRadius: 9, background: colors.accent, color: '#fff', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Memverifikasi...' : 'Verifikasi email'}
            </button>
          </div>
        ) : (
          <form onSubmit={requestLink} style={{ display: 'grid', gap: 12 }}>
            <label htmlFor="email" style={{ fontSize: 13, color: colors.textSecondary }}>Kirim ulang link verifikasi</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
              required
              style={{ width: '100%', padding: '12px', borderRadius: 9, border: '1px solid ' + colors.border, background: colors.bg, color: colors.textPrimary }}
            />
            <button type="submit" disabled={loading} style={{ padding: 12, border: 0, borderRadius: 9, background: colors.accent, color: '#fff', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Mengirim...' : 'Kirim ulang link'}
            </button>
          </form>
        )}

        <p style={{ marginTop: 24, fontSize: 13 }}>
          <Link href="/guest/login" style={{ color: colors.accent, textDecoration: 'none' }}>Kembali ke login</Link>
        </p>
      </section>
    </main>
  )
}
