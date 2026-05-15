import api from '../lib/api'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const SORT_OPTIONS = [
  { value: 'latest',   label: 'Terbaru' },
  { value: 'votes',    label: 'Votes Terbanyak' },
  { value: 'comments', label: 'Komentar Terbanyak' },
]

function DiscussionCard({ d }) {
  const isAnon = d.mode !== 'IDENTIFIED'
  const modeClass = isAnon ? 'badge badge-mode' : 'badge badge-mode-public'
  const modeLabel = isAnon ? 'Anonim' : 'Publik'
  const username = d.user?.profile?.username ?? 'Anonim'
  const initial = username[0]?.toUpperCase() ?? '?'
  const catLabel = d.category?.parent
    ? `${d.category.parent.name} › ${d.category.name}`
    : d.category?.name ?? ''

  return (
    <Link href={`/discussion/${d.id}`} className="discussion-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
        <h3 className="discussion-card__title">{d.title}</h3>
        <span className={modeClass}>{modeLabel}</span>
      </div>

      <p className="discussion-card__excerpt">{d.content}</p>

      <div className="discussion-card__meta">
        {/* Author */}
        <div className="discussion-card__author">
          <span className="discussion-card__avatar">{initial}</span>
          <span className="discussion-card__username">{username}</span>
          {d.user?.isVerifiedExpert && (
            <span className="badge badge-expert">✦ Expert</span>
          )}
        </div>

        {/* Stats + category */}
        <div className="discussion-card__stats">
          <span className="discussion-card__stat">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <strong>{d._count?.votes ?? 0}</strong> vote
          </span>
          <span className="discussion-card__stat">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 7C1 3.68 3.68 1 7 1s6 2.68 6 6c0 1.2-.36 2.32-.96 3.26L13 13l-2.74-.96A5.95 5.95 0 017 13c-3.32 0-6-2.68-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <strong>{d._count?.comments ?? 0}</strong> komentar
          </span>
          {catLabel && (
            <span className="badge" style={{ fontSize: '0.65rem' }}>{catLabel}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="discussion-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ height: '17px', width: '60%', marginBottom: '0.6rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.35rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '0.875rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '12px', width: '28%' }} />
        <div className="skeleton" style={{ height: '12px', width: '22%' }} />
      </div>
    </div>
  )
}

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

        {/* Header */}
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

          {/* Sort select — pushed to right via CSS margin-left:auto on filter-select */}
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

        {/* Subcategory pills — only shown when a root category is selected */}
        {activeCategory && subcategories.length > 0 && (
          <div className="subcategory-row animate-fade-in">
            <span className="subcategory-label">Sub:</span>
            {subcategories.map(sub => (
              <button
                key={sub.id}
                className={`filter-pill${activeSub === sub.slug ? ' active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                onClick={() => handleSubClick(sub.slug)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="error-banner animate-fade-in">{error}</div>}

        {/* Result count */}
        {!loading && !error && (
          <div className="result-meta animate-fade-in">
            <span>
              <strong style={{ color: 'var(--text-secondary)' }}>{total}</strong> hasil
              {query && <> untuk &quot;<span style={{ color: 'var(--text-secondary)' }}>{query}</span>&quot;</>}
              {activeCategory && (
                <>
                  {' '}di{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {rootCategories.find(c => c.slug === activeCategory)?.name ?? activeCategory}
                    {activeSub && ` › ${subcategories.find(s => s.slug === activeSub)?.name ?? activeSub}`}
                  </span>
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
          <div className="empty-state animate-fade-up">
            <div className="empty-state__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#596570" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="empty-state__text">
              {query || activeCategory
                ? 'Tidak ada diskusi yang cocok dengan pencarianmu.'
                : 'Belum ada diskusi. Jadilah yang pertama!'}
            </p>
          </div>
        ) : (
          <div className="discussion-list">
            {results.map(d => (
              <DiscussionCard key={d.id} d={d} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
