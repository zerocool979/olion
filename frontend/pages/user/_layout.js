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
 */
import { useContext, useState, useRef, useCallback } from 'react'
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

export default function UserLayout({ children, sidebar }) {
  const { user, logout } = useContext(AuthContext)
  const router = useRouter()
  const [moreOpen,     setMoreOpen]     = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const globalDebounce = useRef(null)

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

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 300px',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: colors.bg,
      color: colors.textPrimary,
    }}>

      {/* ══ KOLOM KIRI — NAVIGASI ══ */}
      <nav style={{
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
        {/* Logo */}
        <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src={olionLogo} alt="OLION" width={32} height={32}
            style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: colors.textPrimary }}>OLION</span>
        </div>

        {/* Nav Items */}
        {NAV.map(item => {
          const active = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 20px', textDecoration: 'none',
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
              <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {item.dot && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.accent, position: 'absolute', top: 10, left: 34 }} />
              )}
            </Link>
          )
        })}

        {/* More */}
        <div style={{ position: 'relative', margin: '0 8px' }}>
          <button onClick={() => setMoreOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 12px', width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: colors.textSecondary, fontSize: 15,
            borderRadius: 8, transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>···</span>
            Lainnya
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
        <div style={{ padding: '12px 16px', marginTop: 8 }}>
          <Link href="/user/create" style={{
            display: 'block', textAlign: 'center',
            background: colors.textPrimary, color: colors.bg,
            textDecoration: 'none', borderRadius: 24,
            padding: '10px 0', fontSize: 15, fontWeight: 700,
          }}>
            + Buat Diskusi
          </Link>
        </div>

        {/* User footer */}
        <div style={{
          marginTop: 'auto', borderTop: `1px solid ${colors.border}`,
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar username={username} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {username}
            </div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{reputation.toLocaleString()} rep</div>
          </div>
          <span style={{ color: colors.textSecondary, fontSize: 16, cursor: 'pointer' }}>···</span>
        </div>
      </nav>

      {/* ══ KOLOM TENGAH — konten halaman ══ */}
      <main style={{
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



