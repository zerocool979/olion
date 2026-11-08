import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'

const MIN_PASSWORD_LENGTH = 12
const MAX_PASSWORD_BYTES = 72

export default function ResetPassword() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (router.isReady && typeof router.query.token === 'string') {
      setToken(router.query.token)
    }
  }, [router.isReady, router.query.token])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!token) {
      setMessage('Token reset tidak ditemukan. Minta link reset baru.')
      return
    }
    if (Array.from(password).length < MIN_PASSWORD_LENGTH || new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
      setMessage('Password minimal 12 karakter dan maksimal 72 byte UTF-8.')
      return
    }
    if (password !== confirmPassword) {
      setMessage('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/password/reset', { token, newPassword: password })
      setSuccess(true)
      setMessage(res.data?.message || 'Password berhasil diatur ulang.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Link reset tidak valid atau telah kedaluwarsa.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ width: '100%', maxWidth: 420, padding: '32px', border: '1px solid ' + colors.border, borderRadius: 18, background: colors.bgElevated }}>
        <h1 style={{ fontSize: 24, fontWeight: 750, margin: '0 0 8px' }}>Atur Ulang Password</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          Gunakan password baru minimal 12 karakter. Link hanya bisa dipakai sekali dan berlaku selama satu jam.
        </p>

        {message ? (
          <p role="status" style={{ color: success ? '#16a34a' : colors.like, fontSize: 14, lineHeight: 1.6 }}>{message}</p>
        ) : null}

        {!success ? (
          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            <label htmlFor="password" style={{ fontSize: 13, color: colors.textSecondary }}>Password baru</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} style={{ width: '100%', padding: 12, borderRadius: 9, border: '1px solid ' + colors.border, background: colors.bg, color: colors.textPrimary }} />
            <label htmlFor="confirmPassword" style={{ fontSize: 13, color: colors.textSecondary }}>Konfirmasi password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required style={{ width: '100%', padding: 12, borderRadius: 9, border: '1px solid ' + colors.border, background: colors.bg, color: colors.textPrimary }} />
            <button type="submit" disabled={loading || !token} style={{ padding: 12, border: 0, borderRadius: 9, background: colors.accent, color: '#fff', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: !token ? 0.55 : 1 }}>
              {loading ? 'Menyimpan...' : 'Simpan password baru'}
            </button>
          </form>
        ) : null}

        <p style={{ marginTop: 24, fontSize: 13 }}>
          {success ? <Link href="/guest/login" style={{ color: colors.accent, textDecoration: 'none' }}>Masuk kembali</Link> : <Link href="/guest/forgot-password" style={{ color: colors.accent, textDecoration: 'none' }}>Minta link reset baru</Link>}
        </p>
      </section>
    </main>
  )
}
