import { useState, useEffect } from 'react'

/**
 * Komponen animasi redirect untuk dashboard.
 * Menampilkan logo OLION berdenyut, spinner, teks "Mengarahkan" dengan titik animasi, dan progress bar.
 *
 * @param {string} [message='Mengarahkan'] - Teks utama yang ditampilkan.
 */
export default function DashboardRedirect({ message = 'Mengarahkan' }) {
  const [dots, setDots] = useState('')

  // Animasi titik bergerak
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard-redirect">
      <div className="page-grid-bg" />

      <div className="dashboard-redirect__inner animate-fade-up">
        {/* Logo OLION dengan animasi pulse */}
        <div className="dashboard-redirect__logo">
          <span className="dashboard-redirect__logo-dot" />
          <span className="dashboard-redirect__logo-text">OLION</span>
        </div>

        {/* Spinner lingkaran */}
        <div className="dashboard-redirect__spinner">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="dashboard-redirect__spinner-svg"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <path
              d="M24 4C24 4 24 24 24 24"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Teks */}
        <p className="dashboard-redirect__text">
          {message}{dots}
        </p>

        {/* Progress bar dekoratif */}
        <div className="dashboard-redirect__progress">
          <div className="dashboard-redirect__progress-bar" />
        </div>
      </div>
    </div>
  )
}



