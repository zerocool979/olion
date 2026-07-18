/**
 * _layout.jsx
 * Shared 3-column X-style shell for every /user/* page.
 *
 * Usage:
 *   import UserLayout from './_layout'
 *   export default function MyPage() {
 *     return (
 *       <UserLayout sidebar={<MySidebar />}>
 *         <MyMainContent />
 *       </UserLayout>
 *     )
 *   }
 *
 * FIX: sebelumnya ini grid 3 kolom statis (220px 1fr 300px) tanpa penanganan
 * responsif sama sekali — di layar HP kolom-kolomnya saling berebut ruang.
 * Sekarang:
 *  - Desktop: nav kiri bisa di-collapse ke mode ikon-saja lewat tombol panah
 *    (dipersist ke localStorage supaya kepilih lagi tiap buka halaman baru).
 *  - Mobile (<900px): nav kiri jadi drawer off-canvas (tersembunyi secara
 *    default), dibuka lewat tombol hamburger di topbar mobile, ditutup lewat
 *    tombol ✕ atau tap di luar (overlay), dan otomatis tertutup tiap
 *    berpindah halaman. Kolom kanan turun ke bawah konten utama (grid jadi
 *    1 kolom), bukan hilang — semua widget tetap bisa diakses.
 */
import { useContext, useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { AuthContext } from '../../context/AuthContext'
import { Avatar, colors } from '../../components/dashboard'
import olionLogo from '../../components/images/olion.png'

const NAV = [
  { icon: '🏠', label: 'Beranda',    href: '/user' },
  { icon: '🔍', label: 'Jelajahi',   href: '/user/discussions' },
  { icon: '🔔', label: 'Notifikasi', href: '/user/notifications', dot: true },
  { icon: '👥', label: 'Ikuti',      href: '/user/following' },
  { icon: '💬', label: 'Obrolan',    href: '/user/chat' },
  { icon: '🎓', label: 'Pakar',      href: '/user/experts' },
  { icon: '👤', label: 'Profil',     href: '/user/profile' },
]

const SIDEBAR_COLLAPSE_KEY = 'olion:navCollapsed'

export default function UserLayout({ children, sidebar }) {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()
  const [moreOpen,     setMoreOpen]     = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [collapsed,    setCollapsed]    = useState(false)  // desktop icon-only mode
  const [navOpen,      setNavOpen]      = useState(false)  // mobile drawer open/closed
  const globalDebounce = useRef(null)

  // Ingat preferensi collapse desktop antar kunjungan
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSE_KEY)
      if (saved === '1') setCollapsed(true)
    } catch { /* localStorage tidak tersedia (SSR/private mode) — abaikan */ }
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? '1' : '0') } catch {}
      return next
    })
  }, [])

  // Drawer mobile otomatis tertutup tiap pindah halaman
  useEffect(() => {
    const close = () => setNavOpen(false)
    router.events?.on('routeChangeStart', close)
    return () => router.events?.off('routeChangeStart', close)
  }, [router.events])

  const handleGlobalSearch = useCallback((val) => {
    setGlobalSearch(val)
    clearTimeout(globalDebounce.current)
    if (!val.trim()) return
    globalDebounce.current = setTimeout(() => {
      router.push({ pathname: '/user/discussions', query: { q: val.trim() } })
    }, 350)
  }, [router])

  const handleGlobalSearchKey = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      clearTimeout(globalDebounce.current)
      router.push({ pathname: '/user/discussions', query: { q: globalSearch.trim() } })
    }
  }

  const username   = user?.profile?.username   ?? user?.username   ?? 'Kamu'
  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0
  const avatarUrl    = user?.profile?.avatarUrl    ?? user?.avatarUrl    ?? null
  const avatarBorder = user?.profile?.avatarBorder ?? user?.avatarBorder ?? null

  return (
    <div className={`ol-shell${collapsed ? ' ol-shell--collapsed' : ''}`} style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: colors.bg,
      color: colors.textPrimary,
    }}>

      {/* ══ TOPBAR MOBILE (hanya tampil <900px) ══ */}
      <div className="ol-mobile-topbar">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Buka menu navigasi"
          className="ol-nav-toggle-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Image src={olionLogo} alt="OLION" width={26} height={26} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        <span style={{ fontWeight: 700, fontSize: 15 }}>OLION</span>
        <Link href="/user/notifications" style={{ marginLeft: 'auto', color: colors.textPrimary, display: 'flex' }} aria-label="Notifikasi">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </Link>
      </div>

      {/* Overlay gelap di belakang drawer mobile — tap untuk menutup */}
      <div
        className={`ol-nav-overlay${navOpen ? ' ol-nav-overlay--visible' : ''}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      {/* ══ KOLOM KIRI — NAVIGASI ══ */}
      <nav className={`ol-nav${navOpen ? ' ol-nav--open' : ''}`} style={{
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0',
        background: colors.bg,
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo + toggle collapse (desktop) / toggle tutup (mobile) */}
        <div style={{ padding: '12px 16px 16px', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <Image src={olionLogo} alt="OLION" width={32} height={32}
              style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            {!collapsed && <span style={{ fontWeight: 700, fontSize: 16, color: colors.textPrimary, whiteSpace: 'nowrap' }}>OLION</span>}
          </div>
          {/* Tombol collapse — desktop saja */}
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
            title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
            className="ol-nav-toggle-btn ol-nav-toggle-desktop"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          {/* Tombol tutup drawer — mobile saja (dikendalikan lewat media query, sembunyikan tombol collapse desktop di atas) */}
          <button
            onClick={() => setNavOpen(false)}
            aria-label="Tutup menu"
            className="ol-nav-toggle-btn"
            style={{ display: navOpen ? 'flex' : 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        {NAV.map(item => {
          const active = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: collapsed ? '10px 0' : '10px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              fontWeight: active ? 700 : 400,
              color: active ? colors.textPrimary : colors.textSecondary,
              fontSize: 15, position: 'relative', transition: 'background 0.12s',
              background: active ? colors.bgElevated : 'transparent',
              borderRadius: 8,
              margin: '0 8px',
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.background = colors.bgElevated)}
            onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 18, width: 22, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
              {item.dot && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.accent, position: 'absolute', top: 10, left: collapsed ? '50%' : 34 }} />
              )}
            </Link>
          )
        })}

        {/* More */}
        <div style={{ position: 'relative', margin: '0 8px' }}>
          <button onClick={() => setMoreOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 12px', width: collapsed ? 'auto' : '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: colors.textSecondary, fontSize: 15,
            borderRadius: 8, transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>···</span>
            {!collapsed && 'Lainnya'}
          </button>
          {moreOpen && (
            <div style={{
              position: 'absolute', bottom: '110%', left: 0, zIndex: 50,
              background: colors.bgElevated, border: `1px solid ${colors.border}`,
              borderRadius: 12, padding: '8px 0', minWidth: 180, boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}>
              <button onClick={() => { logout?.(); setMoreOpen(false) }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 16px', background: 'none', border: 'none',
                cursor: 'pointer', color: colors.textPrimary, fontSize: 14,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                🚪 Keluar
              </button>
              <Link href="/user/settings" onClick={() => setMoreOpen(false)} style={{
                display: 'block', padding: '10px 16px',
                color: colors.textPrimary, textDecoration: 'none', fontSize: 14,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                ⚙️ Pengaturan
              </Link>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', marginTop: 8 }}>
          <Link href="/user/create" title={collapsed ? 'Buat Diskusi' : undefined} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            background: colors.textPrimary, color: colors.bg,
            textDecoration: 'none', borderRadius: 24,
            padding: '10px 0', fontSize: 15, fontWeight: 700,
          }}>
            {collapsed ? '+' : '+ Buat Diskusi'}
          </Link>
        </div>

        {/* User footer */}
        <div style={{
          marginTop: 'auto', borderTop: `1px solid ${colors.border}`,
          padding: collapsed ? '12px 8px' : '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <Avatar username={username} src={avatarUrl} border={avatarBorder} size={34} />
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {username}
                </div>
                <div style={{ fontSize: 11, color: colors.textSecondary }}>{reputation.toLocaleString()} rep</div>
              </div>
              <span style={{ color: colors.textSecondary, fontSize: 16, cursor: 'pointer' }}>···</span>
            </>
          )}
        </div>
      </nav>

      {/* ══ KOLOM TENGAH — konten halaman ══ */}
      <main className="ol-main" style={{
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        minHeight: '100vh',
      }}>
        {children}
      </main>

      {/* ══ KOLOM KANAN — sidebar dari masing-masing page ══ */}
      <aside style={{
        background: colors.bg,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Global search — debounce 350ms lalu push ke /user/discussions?q= */}
        <div style={{
          background: colors.bgElevated,
          border: `1px solid ${globalSearch ? colors.accent : colors.border}`,
          borderRadius: 24, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'border-color 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={globalSearch ? colors.accent : colors.textSecondary} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={globalSearch}
            onChange={e => handleGlobalSearch(e.target.value)}
            onKeyDown={handleGlobalSearchKey}
            placeholder="Cari di OLION…"
            style={{
              border: 'none', outline: 'none', fontSize: 14,
              background: 'transparent', color: colors.textPrimary, width: '100%',
              fontFamily: 'inherit',
            }}
          />
          {globalSearch && (
            <button onClick={() => setGlobalSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary, fontSize: 14, padding: 0, lineHeight: 1 }}>
              ✕
            </button>
          )}
        </div>

        {/* Sidebar content dari page */}
        {sidebar}

        {/* Footer */}
        <p style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.9, marginTop: 'auto' }}>
          Syarat Layanan · Kebijakan Privasi · Cookie · Tentang<br />© 2026 OLION Corp.
        </p>
      </aside>

    </div>
  )
}
