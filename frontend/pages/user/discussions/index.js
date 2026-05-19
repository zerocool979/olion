import api from '../../../lib/api'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DiscussionCard from '../../../components/DiscussionCard'
import SkeletonCard from '../../../components/SkeletonCard'
import EmptyState from '../../../components/EmptyState'

const SORT_OPTIONS = [
  { value: 'latest',   label: 'Terbaru' },
  { value: 'votes',    label: 'Votes Terbanyak' },
  { value: 'comments', label: 'Komentar Terbanyak' },
]

export default function UserDiscussions() {
  const router = useRouter()

  const [results, setResults] = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [sortBy, setSortBy]   = useState('latest')
  const [mode, setMode]       = useState('')        // '' = all, 'ANONYMOUS', 'IDENTIFIED'

  const fetchDiscussions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { sort: sortBy }
      if (mode) params.mode = mode
      const res = await api.get('/discussions', { params })
      const data = res.data?.data ?? res.data ?? []
      setResults(Array.isArray(data) ? data : [])
      setTotal(res.data?.meta?.total ?? (Array.isArray(data) ? data.length : 0))
    } catch (err) {
      console.error('[user/discussions]', err)
      setError('Gagal memuat diskusi.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [sortBy, mode])

  useEffect(() => {
    fetchDiscussions()
  }, [fetchDiscussions])

  // Sync query params dengan URL (shallow)
  useEffect(() => {
    const query = {}
    if (sortBy !== 'latest') query.sort = sortBy
    if (mode) query.mode = mode
    router.replace({ pathname: '/user/discussions', query }, undefined, { shallow: true })
  }, [sortBy, mode])

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content">
        <header className="page-header animate-fade-up">
          <h1 className="page-title">Semua Diskusi</h1>
          <p className="page-subtitle">Jelajahi seluruh diskusi di komunitas OLION</p>
        </header>

        {/* Filter controls */}
        <div className="filter-row animate-fade-up stagger-2">
          {/* Mode filter pills */}
          <button
            className={`filter-pill${!mode ? ' active' : ''}`}
            onClick={() => setMode('')}
          >
            Semua Mode
          </button>
          <button
            className={`filter-pill${mode === 'ANONYMOUS' ? ' active' : ''}`}
            onClick={() => setMode(mode === 'ANONYMOUS' ? '' : 'ANONYMOUS')}
          >
            Anonim
          </button>
          <button
            className={`filter-pill${mode === 'IDENTIFIED' ? ' active' : ''}`}
            onClick={() => setMode(mode === 'IDENTIFIED' ? '' : 'IDENTIFIED')}
          >
            Publik
          </button>

          {/* Sort select */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {error && <div className="error-banner animate-fade-in">{error}</div>}

        {/* Result meta */}
        {!loading && !error && (
          <div className="result-meta animate-fade-in">
            <span>
              <strong>{total}</strong> diskusi ditemukan
            </span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="discussion-list">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 && !error ? (
          <EmptyState
            message="Belum ada diskusi untuk ditampilkan."
            actionLabel="Buat Diskusi"
            actionHref="/user/create"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h12" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        ) : (
          <div className="discussion-list">
            {results.map(d => (
              <Link key={d.id} href={`/user/discussions/${d.id}`} style={{ textDecoration: 'none' }}>
                <DiscussionCard discussion={d} index={0} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
