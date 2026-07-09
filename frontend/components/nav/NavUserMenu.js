import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications'

export function NavUserMenu() {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const unreadCount = useUnreadNotifications()

  // FIX: dropdown sebelumnya tidak pernah tertutup saat mengklik di luar area
  // menu (tidak ada listener sama sekali — hanya stopPropagation di dalam
  // menu). Tambahkan listener klik global supaya perilaku dropdown standar.
  useEffect(() => {
    if (!showMenu) return
    const closeOnOutsideClick = () => setShowMenu(false)
    document.addEventListener('click', closeOnOutsideClick)
    return () => document.removeEventListener('click', closeOnOutsideClick)
  }, [showMenu])

  const avatarInitial = user?.profile?.username?.[0]?.toUpperCase()
    ?? (user?.role || 'U')[0].toUpperCase()
  const usernameLabel = user?.profile?.username ?? user?.role ?? 'User'

  const dashboardHref = (() => {
    // FIX: '/guest/index' bukan route yang ada (404) — dulu dipakai selagi
    // `user` belum ter-hydrate walau `token` sudah ada. Fallback ke beranda publik.
    if (!user) return '/'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    if (user.role === 'MODERATOR') return '/moderator/dashboard'
    if (user.role === 'EXPERT') return '/expert/dashboard'
    return '/user'
  })()

  const profileHref       = '/user/profile'
  const bookmarksHref     = '/user/bookmarks'
  const notificationsHref = '/user/notifications'

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    router.push('/')
  }

  return (
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
          {avatarInitial}
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
            minWidth: '180px',
            background: 'rgba(14, 17, 20, 0.97)',
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
              padding: '0.625rem 0.875rem 0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              marginBottom: '0.25rem',
            }}
          >
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#e2e8f0',
              letterSpacing: '-0.01em',
              marginBottom: '0.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {usernameLabel}
            </p>
            <p style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#596570',
            }}>
              {user?.role || 'User'}
            </p>
          </div>

          {[
            {
              label: 'Profil Saya',
              href: profileHref,
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
            },
            {
              label: 'Dashboard',
              href: dashboardHref,
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
            },
            {
              label: 'Bookmarks',
              href: bookmarksHref,
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
            },
            {
              label: 'Notifikasi',
              href: notificationsHref,
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
            },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setShowMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.75rem',
                color: '#a8b2bc',
                fontSize: '0.85rem',
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: '6px',
                transition: 'all 140ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = '#f1f3f5'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#a8b2bc'
              }}
            >
              <span style={{ opacity: 0.55, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.label === 'Notifikasi' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#ef4444', color: '#fff',
                  borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700,
                  minWidth: '16px', height: '16px', lineHeight: '16px',
                  textAlign: 'center', padding: '0 4px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.25rem 0' }} />

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
              gap: '0.6rem',
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
  )
}



