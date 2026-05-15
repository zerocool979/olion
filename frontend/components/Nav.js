import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Nav() {
  const { token, user, logout, loading } = useContext(AuthContext)
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (showMenu) setShowMenu(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [showMenu])

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    router.push('/')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background 240ms ease, border-color 240ms ease, box-shadow 240ms ease',
        background: mounted && scrolled ? 'rgba(8, 10, 12, 0.85)' : 'transparent',
        backdropFilter: mounted && scrolled ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: mounted && scrolled ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: mounted && scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        boxShadow: mounted && scrolled ? '0 1px 40px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.04em',
              color: '#f1f3f5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
                boxShadow: '0 0 10px rgba(148,163,184,0.5)',
                flexShrink: 0,
              }}
            />
            OLION
          </span>
        </Link>

        {/* Right side */}
        {loading ? (
          <div
            className="skeleton"
            style={{ width: '80px', height: '32px', borderRadius: '8px' }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {token ? (
              <>
                <Link href="/create" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Buat Diskusi
                </Link>
                <Link href="/dashboard" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Dashboard
                </Link>

                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="badge badge-admin"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    Admin
                  </Link>
                )}
                {user?.role === 'MODERATOR' && (
                  <Link
                    href="/moderator"
                    className="badge badge-moderator"
                    style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    Moderator
                  </Link>
                )}

                {/* User menu */}
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      color: '#a8b2bc',
                      fontSize: '0.85rem',
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 180ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                      e.currentTarget.style.color = '#f1f3f5'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.color = '#a8b2bc'
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#475569,#94a3b8)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        flexShrink: 0,
                      }}
                    >
                      {(user?.role || 'U')[0]}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {showMenu && (
                    <div
                      className="animate-fade-in"
                      onClick={e => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        minWidth: '160px',
                        background: 'rgba(14, 17, 20, 0.95)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                        padding: '0.25rem',
                      }}
                    >
                      <div
                        style={{
                          padding: '0.5rem 0.75rem 0.4rem',
                          borderBottom: '1px solid rgba(255,255,255,0.07)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#596570' }}>
                          {user?.role || 'User'}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.75rem',
                          color: '#f87171',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background 140ms ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/search" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Search
                </Link>
                <Link href="/trending" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Trending
                </Link>
                <Link href="/categories" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Categories
                </Link>
                <Link href="/leaderboard" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Leaderboard
                </Link>
                <Link href="/login" className="btn-outline" style={{ fontSize: '0.875rem' }}>
                  Login
                </Link>
                <Link href="/register" className="btn-outline" style={{ fontSize: '0.875rem' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
