/**
 * frontend/pages/admin/dashboard.js
 * ──────────────────────────────────
 * Admin dashboard stub — extend with admin-specific sections:
 *   - User management table
 *   - Report queue
 *   - Site-wide analytics
 *   - Role promotion controls
 */

import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">
        <div className="page-header animate-fade-up">
          <div className="page-eyebrow">
          </div>
          <h1 className="page-title">
            Panel Admin
            {user?.profile?.username && (
              <span style={{ color: 'var(--text-muted)' }}>, {user.profile.username}</span>
            )}
          </h1>
          <p className="page-subtitle">
            Kelola pengguna, laporan, dan konten platform OLION.
          </p>
        </div>

        {/* Placeholder content — replace with real admin sections */}
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Admin dashboard sedang dalam pengembangan.
          </p>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ← Kembali ke redirect
          </Link>
        </div>
      </div>
    </div>
  )
}
