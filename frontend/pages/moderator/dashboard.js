/**
 * frontend/pages/moderator/dashboard.js
 * ────────────────────────────────────────
 * Moderator dashboard stub — extend with:
 *   - Report queue & moderation actions
 *   - Flagged discussions list
 *   - User warning controls
 */

import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'

export default function ModeratorDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">
        <div className="page-header animate-fade-up">
          <div className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Moderator Dashboard
          </div>
          <h1 className="page-title">
            Panel Moderator
            {user?.profile?.username && (
              <span style={{ color: 'var(--text-muted)' }}>, {user.profile.username}</span>
            )}
          </h1>
          <p className="page-subtitle">
            Tinjau laporan dan moderasi konten komunitas OLION.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Moderator dashboard sedang dalam pengembangan.
          </p>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ← Kembali ke redirect
          </Link>
        </div>
      </div>
    </div>
  )
}
