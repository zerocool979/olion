/**
 * frontend/pages/expert/dashboard.js
 * ─────────────────────────────────────
 * Expert dashboard stub — extend with:
 *   - Expert answer queue
 *   - Endorsed answers & citation counts
 *   - Expert-exclusive categories
 *   - Verification badge management
 */

import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'

export default function ExpertDashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">
        <div className="page-header animate-fade-up">
          <div className="page-eyebrow">
            <span className="page-eyebrow-dot" />
            Expert Dashboard
          </div>
          <h1 className="page-title">
            Panel Expert
            {user?.profile?.username && (
              <span style={{ color: 'var(--text-muted)' }}>, {user.profile.username}</span>
            )}
          </h1>
          <p className="page-subtitle">
            Berikan jawaban ahli, bangun otoritasmu di komunitas OLION.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Expert dashboard sedang dalam pengembangan.
          </p>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ← Kembali ke redirect
          </Link>
        </div>
      </div>
    </div>
  )
}
