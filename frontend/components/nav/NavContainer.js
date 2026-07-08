import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NavLogo } from './NavLogo'
import { NavLinks } from './NavLinks'
import { NavUserMenu } from './NavUserMenu'

export function NavContainer() {
  const { token, loading } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <NavLogo />

        {loading ? (
          <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '8px' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <NavLinks />
            {token && <NavUserMenu />}
          </div>
        )}
      </div>
    </nav>
  )
}



