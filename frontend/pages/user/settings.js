/**
 * pages/user/settings.jsx  — Pengaturan Akun
 *
 * URL: /user/settings
 * - Info akun (email, tanggal bergabung, peran)
 * - Ubah password (atau "Set Password" pertama kali kalau akun cuma login via Google)
 * - Status akun Google (terhubung / belum)
 * - Edit username & bio → diarahkan ke /user/profile (biar tidak duplikat logic)
 * - Keluar
 */
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'
import UserLayout from './_layout'

function fullDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const ROLE_LABEL = {
  USER: 'Pengguna',
  EXPERT: 'Pakar',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
}

function Card({ title, icon, children }) {
  return (
    <div style={{
      background: colors.bg, border: `1px solid ${colors.border}`,
      borderRadius: 16, padding: '18px 20px', marginBottom: 16,
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 14 }}>
        {icon} {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${colors.borderLight}` }}>
      <span style={{ fontSize: 13, color: colors.textSecondary }}>{label}</span>
      <span style={{ fontSize: 13, color: colors.textPrimary, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1px solid ${colors.border}`, background: colors.bgElevated,
  color: colors.textPrimary, fontSize: 14, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 10,
}

export default function Settings() {
  const { user: me, logout, refreshUser } = useContext(AuthContext)
  const router = useRouter()

  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setAccount(r.data?.user ?? r.data))
      .catch(() => setAccount(me))
      .finally(() => setLoading(false))
  }, [me])

  const hasPassword = account?.hasPassword ?? true
  const hasGoogle = account?.hasGoogle ?? false

  const submitPassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (hasPassword && !oldPassword) {
      setPwError('Password lama harus diisi')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPwError('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Konfirmasi password tidak cocok')
      return
    }

    setPwSaving(true)
    try {
      await api.patch('/auth/password', { oldPassword: oldPassword || undefined, newPassword })
      setPwSuccess(hasPassword ? 'Password berhasil diubah.' : 'Password berhasil dibuat. Sekarang kamu juga bisa login pakai email & password.')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      // refresh supaya hasPassword ter-update kalau tadinya Google-only
      const fresh = await api.get('/auth/me')
      setAccount(fresh.data?.user ?? fresh.data)
      refreshUser?.()
    } catch (err) {
      setPwError(err.response?.data?.message ?? 'Gagal menyimpan password.')
    } finally {
      setPwSaving(false)
    }
  }

  const handleLogout = () => {
    setLoggingOut(true)
    logout()
    router.replace('/guest/login')
  }

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 8 }}>⚙️ Pengaturan</span>
      <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
        Kelola keamanan akun kamu di sini. Untuk mengubah username, bio, atau foto profil, buka{' '}
        <Link href="/user/profile" style={{ color: colors.accent, textDecoration: 'none' }}>halaman profil</Link>.
      </p>
    </div>
  )

  return (
    <UserLayout sidebar={sidebar}>
      <div style={{ padding: '20px 20px 60px', maxWidth: 560 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary, marginBottom: 20 }}>
          Pengaturan Akun
        </h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 120, background: colors.bgElevated, borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <>
            {/* ── Info Akun ── */}
            <Card title="Info Akun" icon="👤">
              <Field label="Email" value={account?.email ?? '—'} />
              <Field label="Peran" value={ROLE_LABEL[account?.role] ?? account?.role ?? '—'} />
              <Field label="Bergabung sejak" value={fullDate(account?.createdAt)} />
              <Field
                label="Akun Google"
                value={hasGoogle
                  ? <span style={{ color: '#34a853' }}>✓ Terhubung</span>
                  : <span style={{ color: colors.textSecondary }}>Belum terhubung</span>}
              />
            </Card>

            {/* ── Password ── */}
            <Card title={hasPassword ? 'Ubah Password' : 'Buat Password'} icon="🔒">
              {!hasPassword && (
                <p style={{ fontSize: 12.5, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>
                  Akun kamu login pakai Google dan belum punya password. Buat password di sini supaya kamu
                  juga bisa login pakai email & password kapan pun.
                </p>
              )}

              <form onSubmit={submitPassword} noValidate>
                {hasPassword && (
                  <input
                    type="password"
                    placeholder="Password lama"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    disabled={pwSaving}
                    autoComplete="current-password"
                    style={inputStyle}
                  />
                )}
                <input
                  type="password"
                  placeholder="Password baru (minimal 6 karakter)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={pwSaving}
                  autoComplete="new-password"
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Konfirmasi password baru"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={pwSaving}
                  autoComplete="new-password"
                  style={{ ...inputStyle, marginBottom: 12 }}
                />

                {pwError && (
                  <p role="alert" style={{ fontSize: 12.5, color: '#f87171', marginBottom: 10 }}>{pwError}</p>
                )}
                {pwSuccess && (
                  <p role="status" style={{ fontSize: 12.5, color: '#34a853', marginBottom: 10 }}>{pwSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={pwSaving || !newPassword || !confirmPassword}
                  style={{
                    background: colors.accent, color: '#fff', border: 'none',
                    borderRadius: 20, padding: '9px 20px', fontSize: 13.5, fontWeight: 700,
                    cursor: pwSaving ? 'default' : 'pointer',
                    opacity: (pwSaving || !newPassword || !confirmPassword) ? 0.6 : 1,
                  }}
                >
                  {pwSaving ? 'Menyimpan…' : hasPassword ? 'Simpan Password Baru' : 'Buat Password'}
                </button>
              </form>
            </Card>

            {/* ── Sesi ── */}
            <Card title="Sesi" icon="🚪">
              <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 14 }}>
                Keluar dari akun kamu di perangkat ini.
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  background: 'none', color: '#f87171', border: '1px solid #f8717155',
                  borderRadius: 20, padding: '9px 20px', fontSize: 13.5, fontWeight: 700,
                  cursor: loggingOut ? 'default' : 'pointer',
                }}
              >
                {loggingOut ? 'Keluar…' : 'Keluar dari Akun'}
              </button>
            </Card>
          </>
        )}
      </div>
    </UserLayout>
  )
}
