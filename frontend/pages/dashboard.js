/**
 * frontend/pages/dashboard.js
 * ════════════════════════════
 * Centralized redirect hub — sends authenticated users to their
 * role-specific dashboard. Unauthenticated users go to /login.
 *
 * Role → Route (defined in lib/routes.js):
 *   ADMIN      → /admin/dashboard
 *   MODERATOR  → /moderator/dashboard
 *   EXPERT     → /expert/dashboard
 *   USER       → /user/dashboard
 */

import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/AuthContext'
import { roleHome, ROUTES } from '../lib/routes'
import DashboardRedirect from '../components/DashboardRedirect'

export default function DashboardRouter() {
  const router = useRouter()
  const { user, loading } = useContext(AuthContext)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace(ROUTES.guest.login)
      return
    }
    router.replace(roleHome(user?.role))
  }, [user, loading, router])

  return (
    <div className="page-shell">
      <DashboardRedirect />
    </div>
  )
}
