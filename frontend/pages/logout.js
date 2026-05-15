import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/AuthContext'

export default function Logout() {
  const router = useRouter()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    logout()
    router.replace('/login')
  }, [router, logout])

  return (
    <div className="p-8 text-center">
      <p className="text-gray-600">Logging out...</p>
    </div>
  )
}
