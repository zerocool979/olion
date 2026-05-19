import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/AuthContext'
import SonarRedirect from '../components/SonarRedirect'

export default function CreateRedirect() {
  const router = useRouter()
  const { token, loading: authLoading } = useContext(AuthContext)

  useEffect(() => {
    if (authLoading) return
    const target = token ? '/user/create' : '/guest/login'
    const timer = setTimeout(() => router.replace(target), 2000)
    return () => clearTimeout(timer)
  }, [token, authLoading, router])

  return (
    <div className="page-shell">
      <SonarRedirect message="Kamu belum login :)" />
    </div>
  )
}
