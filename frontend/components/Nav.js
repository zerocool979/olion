import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Nav() {
  const { token, logout } = useContext(AuthContext)

  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/">Home</Link>

      {token ? (
        <>
          <Link href="/create">Buat Diskusi</Link>
          <Link href="/dashboard">Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  )
}
