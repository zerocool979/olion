import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'
import GoogleAuthButton from '../../components/auth/GoogleAuthButton'

export default function Register() {
  const { login } = useContext(AuthContext)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmFocused, setConfirmFocused] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Semua field harus diisi')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', { email, password })
      login(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleCredential = async (idToken) => {
    setError('')
    setGoogleLoading(true)
    try {
      const res = await api.post('/auth/google', { idToken })
      login(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Daftar dengan Google gagal. Silakan coba lagi.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleError = (message) => setError(message)

  const inputStyle = (focused) => ({
    width: '100%',
    padding: '0.7rem 0.875rem',
    background: focused ? colors.bgHover : colors.bg,
    border: `1px solid ${focused ? colors.accent : colors.border}`,
    borderRadius: '10px',
    color: colors.textPrimary,
    fontSize: '0.875rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    outline: 'none',
    boxShadow: focused ? `0 0 0 3px ${colors.accentSoft}` : 'none',
    transition: 'all 180ms ease',
    opacity: loading ? 0.4 : 1,
    cursor: loading ? 'not-allowed' : 'text',
  })

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: '0.5rem',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${colors.accentSoft} 0%, transparent 70%), ${colors.bg}`,
        padding: '1.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />

      <div
        className="animate-fade-up"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}
      >
        {/* Back to home */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: colors.textSecondary,
            textDecoration: 'none',
            marginBottom: '1.5rem',
            transition: 'color 160ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = colors.textPrimary)}
          onMouseLeave={e => (e.currentTarget.style.color = colors.textSecondary)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali ke beranda
        </Link>

        {/* Card */}
        <div
          style={{
            position: 'relative',
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: '18px',
            padding: '2.5rem 2rem',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)',
          }}
        >
          {/* Top glow line */}
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${colors.accentSoft}, transparent)`,
            }}
          />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: colors.accentSoft,
                border: `1px solid ${colors.border}`,
                marginBottom: '1.25rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.accent} strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                marginBottom: '0.4rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: colors.accent,
                  boxShadow: `0 0 8px ${colors.accentSoft}`,
                }}
              />
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  color: colors.textSecondary,
                  textTransform: 'uppercase',
                }}
              >
                OLION
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.03em',
                color: colors.textPrimary,
                marginBottom: '0.4rem',
              }}
            >
              Buat akun baru
            </h1>
            <p style={{ fontSize: '0.85rem', color: colors.textSecondary }}>
              Username unik akan dibuat otomatis untukmu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: colors.likeSoft,
                  border: `1px solid ${colors.like}33`,
                  borderRadius: '10px',
                  padding: '0.75rem 0.875rem',
                  color: colors.like,
                  fontSize: '0.825rem',
                  lineHeight: 1.5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0, opacity: 0.8 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                disabled={loading}
                autoComplete="email"
                style={inputStyle(emailFocused)}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                disabled={loading}
                autoComplete="new-password"
                style={inputStyle(passwordFocused)}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Konfirmasi Password</label>
              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                disabled={loading}
                autoComplete="new-password"
                style={inputStyle(confirmFocused)}
              />
            </div>

            {/* Pseudonym hint */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                background: colors.bgHover,
                border: `1px solid ${colors.borderLight}`,
                borderRadius: '10px',
                padding: '0.75rem 0.875rem',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="1.8" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p style={{ fontSize: '0.78rem', color: colors.textSecondary, lineHeight: 1.55 }}>
                Identitasmu dilindungi. Username acak seperti{' '}
                <span style={{ color: colors.textPrimary, fontWeight: 500 }}>SwiftFalcon4821</span>{' '}
                akan dibuat untukmu.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                marginTop: '0.25rem',
                borderRadius: '10px',
                background: loading ? colors.accentSoft : colors.accent,
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '-0.01em',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 180ms ease',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = colors.accentHover; e.currentTarget.style.boxShadow = `0 0 20px ${colors.accentSoft}` }}}
              onMouseLeave={e => { e.currentTarget.style.background = loading ? colors.accentSoft : colors.accent; e.currentTarget.style.boxShadow = 'none' }}
            >
              {loading ? (
                <>
                  <svg
                    style={{ animation: 'spin 0.8s linear infinite', width: '16px', height: '16px' }}
                    viewBox="0 0 24 24" fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path fill="rgba(255,255,255,0.9)" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                'Buat Akun'
              )}
            </button>
          </form>

          {/* ── DAFTAR DENGAN GOOGLE ──────────────────────────────── */}
          <div style={{ marginTop: '1rem' }}>
            <GoogleAuthButton
              onCredential={handleGoogleCredential}
              onError={handleGoogleError}
              disabled={loading || googleLoading}
              label={googleLoading ? 'Memproses...' : 'Daftar dengan akun Google'}
            />
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '1.5rem 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.textSecondary,
              }}
            >
              atau
            </span>
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
          </div>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: '0.825rem', color: colors.textSecondary }}>
            Sudah punya akun?{' '}
            <Link
              href="/guest/login"
              style={{
                color: colors.accent,
                textDecoration: 'underline',
                textDecorationColor: colors.accentSoft,
                textUnderlineOffset: '3px',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = colors.accentHover }}
              onMouseLeave={e => { e.currentTarget.style.color = colors.accent }}
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.7rem',
            color: colors.textSecondary,
            letterSpacing: '0.02em',
          }}
        >
          © 2026 OLION · Platform diskusi terstruktur
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
