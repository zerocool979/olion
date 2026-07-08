import { useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'

export function NavLinks() {
  const { token, user } = useContext(AuthContext)

  if (!token) {
    return (
      <>
        <Link href="/search" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Search</Link>
        <Link href="/trending" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Trending</Link>
        <Link href="/categories" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Categories</Link>
        <Link href="/leaderboard" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Leaderboard</Link>
        <Link href="/guest/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Login</Link>
        <Link href="/guest/register" className="btn-outline" style={{ fontSize: '0.875rem' }}>Register</Link>
      </>
    )
  }

  const createHref = '/user/create'
  const dashboardHref = (() => {
    // FIX: '/guest/index' bukan route yang ada (404) — dulu dipakai selagi
    // `user` belum ter-hydrate walau `token` sudah ada. Fallback ke beranda publik.
    if (!user) return '/'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    if (user.role === 'MODERATOR') return '/moderator/dashboard'
    if (user.role === 'EXPERT') return '/expert/dashboard'
    return '/user'
  })()

  const notificationsHref = '/user/notifications'

  return (
    <>
      <Link href="/search" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Cari</Link>
      <Link href="/trending" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Trending</Link>
      <Link href={createHref} className="btn-ghost" style={{ fontSize: '0.875rem' }}>Buat Diskusi</Link>
      <Link href={dashboardHref} className="btn-ghost" style={{ fontSize: '0.875rem' }}>Dashboard</Link>

      <Link
        href={notificationsHref}
        className="btn-ghost"
        title="Notifikasi"
        style={{ fontSize: '0.875rem', padding: '0.4rem 0.5rem' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
      </Link>

      {user?.role === 'ADMIN' && (
        <Link href="/admin/dashboard" className="badge badge-admin" style={{ cursor: 'pointer', fontSize: '0.7rem', marginLeft: '0.25rem' }}>
          Admin
        </Link>
      )}
      {user?.role === 'MODERATOR' && (
        <Link href="/moderator/dashboard" className="badge badge-moderator" style={{ cursor: 'pointer', fontSize: '0.7rem', marginLeft: '0.25rem' }}>
          Moderator
        </Link>
      )}
      {user?.role === 'EXPERT' && (
        <span className="badge badge-expert" style={{ fontSize: '0.7rem', marginLeft: '0.25rem' }}>
          ✦ Expert
        </span>
      )}
    </>
  )
}



