import '../styles/globals.css'
import { AuthProvider, AuthContext } from '../context/AuthContext'
import { CallProvider } from '../context/CallContext'
import Nav from '../components/Nav'
import LiaWidget from '../components/lia/LiaWidget'
import CallOverlay from '../components/call/CallOverlay'
import { useContext } from 'react'
import { useRouter } from 'next/router'

// Prefix-prefiks halaman yang wajib login. Sebelumnya guard ini hanya mencocokkan
// '/user/dashboard', jadi seluruh halaman /user/* lain (mis. /user, /user/discussions,
// /user/notifications, /user/chat, /user/experts, /user/profile, dst.) — juga
// /expert/*, /moderator/*, dan /admin/* — bisa diakses tanpa login sama sekali.
const PROTECTED_PREFIXES = ['/user', '/expert', '/moderator', '/admin']
// /user/logout harus tetap bisa dijalankan walau token sudah/belum ada, karena
// halaman itu sendiri yang membersihkan sesi lalu mengarahkan ke /guest/login.
const PUBLIC_EXCEPTIONS = ['/user/logout']

function Guard({ children }) {
  const { token, loading } = useContext(AuthContext)
  const router = useRouter()

  const isProtected =
    PROTECTED_PREFIXES.some(p => router.pathname === p || router.pathname.startsWith(`${p}/`)) &&
    !PUBLIC_EXCEPTIONS.includes(router.pathname)

  // Tunggu AuthContext selesai memvalidasi token dari localStorage sebelum
  // memutuskan untuk redirect, supaya pengguna yang sudah login tidak sempat
  // "terlempar" ke /guest/login hanya karena hydrasi token belum selesai.
  if (isProtected && !loading && !token) {
    if (typeof window !== 'undefined') router.push('/guest/login')
    return null
  }

  return children
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CallProvider>
        <Guard>
          <Component {...pageProps} />
        </Guard>
        {/* LIA — chatbot knowledge base, tersedia di semua halaman (guest & user) */}
        <LiaWidget />
        {/* Panggilan audio/video — global supaya panggilan masuk tetap
            berdering walau user sedang di halaman lain, bukan cuma di /user/chat */}
        <CallOverlay />
      </CallProvider>
    </AuthProvider>
  )
}



