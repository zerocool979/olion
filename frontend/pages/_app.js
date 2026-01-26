import '../styles/globals.css'
import { AuthProvider, AuthContext } from '../context/AuthContext'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'

function Guard({ children }) {
  const { token } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!token && router.pathname.startsWith('/dashboard')) {
      router.push('/login')
    }
  }, [token, router])

  if (!token && router.pathname.startsWith('/dashboard')) {
    return null
  }

  return children
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Nav />
      <Guard>
        <Component {...pageProps} />
      </Guard>
    </AuthProvider>
  )
}
