import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getUser } from '../lib/auth'

export default function Nav() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
  }, [])

  // ⛔ Cegah SSR / hydration mismatch
  if (!mounted) return null

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link href="/">Home</Link>

      {user ? (
        <>
          {' | '}
          <Link href="/dashboard">Dashboard</Link>
          {' | '}
          <Link href="/logout">Logout</Link>
        </>
      ) : (
        <>
          {' | '}
          <Link href="/login">Login</Link>
          {' | '}
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
