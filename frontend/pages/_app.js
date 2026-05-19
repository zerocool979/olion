import '../styles/globals.css'
import { AuthProvider, AuthContext } from '../context/AuthContext'
import Nav from '../components/Nav'
import { useContext } from 'react'
import { useRouter } from 'next/router'

function Guard({ children }) {
  const { token } = useContext(AuthContext)
  const router = useRouter()

  if (!token && router.pathname.startsWith('/user/dashboard')) {
    if (typeof window !== 'undefined') router.push('/guest/login')
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
