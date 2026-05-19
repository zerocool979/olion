import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Masukkan alamat email terdaftar')
      return
    }

    setLoading(true)
    // Simulasi pengiriman – ganti dengan panggilan API sebenarnya jika sudah tersedia
    try {
      // await api.post('/auth/forgot-password', { email })
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,41,59,0.35) 0%, transparent 70%), #080a0c',
        padding: '1.5rem',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />

      <div
        className="animate-fade-up"
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}
      >
        <Link
          href="/guest/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: '#596570',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            transition: 'color 160ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#596570')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali ke login
        </Link>

        <div
          style={{
            position: 'relative',
            background: 'rgba(14, 17, 20, 0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '2.5rem 2rem',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-1px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                marginBottom: '1.25rem',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.03em',
                color: '#f1f3f5',
                marginBottom: '0.4rem',
              }}
            >
              Lupa Password
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#596570' }}>
              Masukkan email terdaftar untuk menerima link reset password.
            </p>
          </div>

          {success ? (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '10px',
                padding: '0.75rem 0.875rem',
                color: '#86efac',
                fontSize: '0.825rem',
                lineHeight: 1.5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Jika email terdaftar, link reset password telah dikirim. Silakan periksa kotak masuk Anda.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {error && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '10px',
                    padding: '0.75rem 0.875rem',
                    color: '#fca5a5',
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

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: '#596570',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={loading}
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.875rem',
                    background: emailFocused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${emailFocused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    color: '#f1f3f5',
                    fontSize: '0.875rem',
                    fontFamily: "'DM Sans', sans-serif",
                    outline: 'none',
                    boxShadow: emailFocused ? '0 0 0 3px rgba(255,255,255,0.04)' : 'none',
                    transition: 'all 180ms ease',
                    opacity: loading ? 0.4 : 1,
                    cursor: loading ? 'not-allowed' : 'text',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '44px',
                  borderRadius: '10px',
                  background: loading ? 'rgba(241,243,245,0.4)' : '#f1f3f5',
                  color: '#080a0c',
                  fontFamily: "'Syne', sans-serif",
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
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 20px rgba(241,243,245,0.15)' }}}
                onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(241,243,245,0.4)' : '#f1f3f5'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {loading ? (
                  <>
                    <svg
                      style={{ animation: 'spin 0.8s linear infinite', width: '16px', height: '16px' }}
                      viewBox="0 0 24 24" fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="rgba(8,10,12,0.25)" strokeWidth="3"/>
                      <path fill="rgba(8,10,12,0.8)" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
