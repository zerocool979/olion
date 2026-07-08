import api from '../lib/api'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import DiscussionCard from '../components/DiscussionCard'
import DiscussionLink from '../components/DiscussionLink'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

const SORT_OPTIONS = [
  { value: 'latest',   label: 'Terbaru' },
  { value: 'votes',    label: 'Votes Terbanyak' },
  { value: 'comments', label: 'Komentar Terbanyak' },
]

export default function Search() {
  const router = useRouter()

  const [rootCategories, setRootCategories]     = useState([])
  const [subcategories, setSubcategories]       = useState([])
  const [results, setResults]                   = useState([])
  const [total, setTotal]                       = useState(0)
  const [loading, setLoading]                   = useState(false)
  const [catsLoading, setCatsLoading]           = useState(true)
  const [error, setError]                       = useState('')

  const [query,          setQuery]          = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeSub,      setActiveSub]      = useState('')
  const [sortBy,         setSortBy]         = useState('latest')

  useEffect(() => {
    if (!router.isReady) return
    setQuery(router.query.q ?? '')
    setActiveCategory(router.query.category ?? '')
    setActiveSub(router.query.subcategory ?? '')
    setSortBy(router.query.sort ?? 'latest')
  }, [router.isReady])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/categories')
        setRootCategories(res.data.data ?? [])
      } catch (err) {
        console.error('[search] categories fetch failed', err)
      } finally {
        setCatsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeCategory) {
      setSubcategories([])
      setActiveSub('')
      return
    }
    const load = async () => {
      try {
        const res = await api.get(`/categories/${activeCategory}/subcategories`)
        setSubcategories(res.data.data ?? [])
      } catch (err) {
        console.error('[search] subcategories fetch failed', err)
        setSubcategories([])
      }
    }
    load()
  }, [activeCategory])

  const runSearch = useCallback(async ({ q, category, subcategory, sort }) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/search', {
        params: {
          ...(q && { q }),
          ...(category && { category }),
          ...(subcategory && { subcategory }),
          sort,
        },
      })
      setResults(res.data.data ?? [])
      setTotal(res.data.meta?.total ?? res.data.data?.length ?? 0)
    } catch (err) {
      console.error('[search] search failed', err)
      setError('Gagal memuat hasil pencarian.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    const timer = setTimeout(() => {
      runSearch({ q: query, category: activeCategory, subcategory: activeSub, sort: sortBy })

      const urlQuery = {}
      if (query)          urlQuery.q           = query
      if (activeCategory) urlQuery.category    = activeCategory
      if (activeSub)      urlQuery.subcategory = activeSub
      if (sortBy !== 'latest') urlQuery.sort   = sortBy
      router.replace({ pathname: '/search', query: urlQuery }, undefined, { shallow: true })
    }, query ? 350 : 0)
    return () => clearTimeout(timer)
  }, [query, activeCategory, activeSub, sortBy, router.isReady])

  const handleCategoryClick = (slug) => {
    if (slug === activeCategory) {
      setActiveCategory('')
      setActiveSub('')
    } else {
      setActiveCategory(slug)
      setActiveSub('')
    }
  }

  const handleSubClick = (slug) => {
    setActiveSub(slug === activeSub ? '' : slug)
  }

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content">
        <header className="page-header animate-fade-up">
          <h1 className="page-title">Cari Diskusi</h1>
          <p className="page-subtitle">Temukan diskusi yang relevan dengan kebutuhanmu</p>
        </header>

        {/* Search bar */}
        <div className="search-bar-wrapper animate-fade-up stagger-1">
          <svg
            className={`search-bar-icon${query ? ' focused' : ''}`}
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-bar-input"
            placeholder="Cari judul atau konten diskusi..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Root category filter pills */}
        <div className="filter-row animate-fade-up stagger-2">
          {catsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '30px', width: '72px', borderRadius: '99px' }} />
              ))
            : (
              <>
                <button
                  className={`filter-pill${!activeCategory ? ' active' : ''}`}
                  onClick={() => handleCategoryClick('')}
                >
                  Semua
                </button>
                {rootCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-pill${activeCategory === cat.slug ? ' active' : ''}`}
                    onClick={() => handleCategoryClick(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </>
            )
          }

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

        {/* Subcategory pills */}
        {activeCategory && subcategories.length > 0 && (
          <div className="subcategory-row animate-fade-in">
            <span className="subcategory-label">Sub:</span>
            {subcategories.map(sub => (
              <button
                key={sub.id}
                className={`filter-pill filter-pill--sub${activeSub === sub.slug ? ' active' : ''}`}
                onClick={() => handleSubClick(sub.slug)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {error && <div className="error-banner animate-fade-in">{error}</div>}

        {/* Result count */}
        {!loading && !error && (
          <div className="result-meta animate-fade-in">
            <span>
              <strong>{total}</strong> hasil
              {query && <> untuk &quot;<strong>{query}</strong>&quot;</>}
              {activeCategory && (
                <>
                  {' '}di{' '}
                  <strong>
                    {rootCategories.find(c => c.slug === activeCategory)?.name ?? activeCategory}
                    {activeSub && ` › ${subcategories.find(s => s.slug === activeSub)?.name ?? activeSub}`}
                  </strong>
                </>
              )}
            </span>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="discussion-list">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : results.length === 0 && !error ? (
          <EmptyState
            message={query || activeCategory ? 'Tidak ada diskusi yang cocok dengan pencarianmu.' : 'Belum ada diskusi. Jadilah yang pertama!'}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#596570" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        ) : (
          <div className="discussion-list">
            {results.map(d => (
              <DiscussionLink key={d.id} id={d.id} style={{ textDecoration: 'none' }}>
                <DiscussionCard discussion={d} index={0} />
              </DiscussionLink>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



