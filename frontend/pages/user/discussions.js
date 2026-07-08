/**
 * pages/user/discussions.jsx  — Jelajahi & Cari Diskusi
 *
 * Referensi fitur dari search.js:
 *  - Debounced search (350 ms)
 *  - URL query-string sync (shallow replace) → ?q=&category=&subcategory=&sort=
 *  - Kategori root + subkategori dinamis (fetch /categories/:slug/subcategories)
 *  - Sort: latest | votes | comments
 *  - Result count label
 *  - Clear/reset filter
 *  - Infinite scroll "Muat lebih banyak"
 *  - Sidebar: Trending + Kategori (click = filter feed)
 */
import { useState, useEffect, useCallback, useContext, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../../lib/api'
import {
  Avatar, StatPill, EmptyState,
  DiscussionCard, TrendingRow, SkeletonCard, colors,
} from '../../components/dashboard'
import UserLayout from './_layout'

/* ─── constants ─── */
const SORT_OPTIONS = [
  { value: 'latest',   label: 'Terbaru' },
  { value: 'votes',    label: 'Votes Terbanyak' },
  { value: 'comments', label: 'Komentar Terbanyak' },
]
const PAGE_SIZE = 15

/* ─── pill button helper ─── */
function Pill({ label, active, onClick, sub = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: sub ? '3px 10px' : '5px 13px',
        borderRadius: 99,
        fontSize: sub ? 11 : 12,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        border: `1px solid ${active ? colors.accent : colors.border}`,
        background: active ? colors.accent : colors.bgElevated,
        color: active ? '#fff' : colors.textSecondary,
        transition: 'all 0.12s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function Discussions() {
  const { user }  = useContext(AuthContext)
  const router    = useRouter()
  const debounceRef = useRef(null)

  /* ── search state (mirrors search.js) ── */
  const [inputVal,       setInputVal]       = useState('')        // raw input
  const [query,          setQuery]          = useState('')        // debounced / committed
  const [activeCategory, setActiveCategory] = useState('')       // root slug
  const [activeSub,      setActiveSub]      = useState('')       // sub slug
  const [sortBy,         setSortBy]         = useState('latest')

  /* ── data ── */
  const [rootCategories, setRootCategories] = useState([])
  const [subcategories,  setSubcategories]  = useState([])
  const [discussions,    setDiscussions]    = useState([])
  const [total,          setTotal]          = useState(0)
  const [page,           setPage]           = useState(1)
  const [hasMore,        setHasMore]        = useState(false)

  /* ── loading / error ── */
  const [catsLoading,  setCatsLoading]  = useState(true)
  const [loading,      setLoading]      = useState(false)
  const [loadingMore,  setLoadingMore]  = useState(false)
  const [error,        setError]        = useState('')

  /* ── sidebar extras ── */
  const [trending, setTrending] = useState([])

  /* ══ 1. Sync from URL on first ready (same as search.js) ══ */
  useEffect(() => {
    if (!router.isReady) return
    setInputVal(router.query.q          ?? '')
    setQuery(router.query.q             ?? '')
    setActiveCategory(router.query.category    ?? '')
    setActiveSub(router.query.subcategory      ?? '')
    setSortBy(router.query.sort         ?? 'latest')
  }, [router.isReady])

  /* ══ 2. Load root categories + trending once ══ */
  useEffect(() => {
    api.get('/categories')
      .then(r => setRootCategories(r.data?.data ?? r.data ?? []))
      .catch(() => {})
      .finally(() => setCatsLoading(false))

    api.get('/discussions?sort=votes&limit=5')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setTrending(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [])

  /* ══ 3. Load subcategories when root category changes ══ */
  useEffect(() => {
    if (!activeCategory) {
      setSubcategories([])
      setActiveSub('')
      return
    }
    api.get(`/categories/${activeCategory}/subcategories`)
      .then(r => setSubcategories(r.data?.data ?? r.data ?? []))
      .catch(() => setSubcategories([]))
  }, [activeCategory])

  /* ══ 4. Core search runner (same signature as search.js) ══ */
  const runSearch = useCallback(async ({ q, category, subcategory, sort, pageNum = 1, append = false }) => {
    if (append) setLoadingMore(true)
    else        setLoading(true)
    setError('')

    try {
      const res = await api.get('/search', {
        params: {
          ...(q          && { q }),
          ...(category   && { category }),
          ...(subcategory && { subcategory }),
          sort,
          page:  pageNum,
          limit: PAGE_SIZE,
        },
      })
      const data  = res.data?.data  ?? []
      const meta  = res.data?.meta  ?? {}
      const arr   = Array.isArray(data) ? data : []

      setDiscussions(prev => append ? [...prev, ...arr] : arr)
      setTotal(meta.total ?? arr.length)
      setHasMore(arr.length === PAGE_SIZE)
      setPage(pageNum)
    } catch (err) {
      console.error('[discussions] search failed', err)
      setError('Gagal memuat hasil pencarian.')
      if (!append) setDiscussions([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  /* ══ 5. Debounce + URL sync — same 350 ms logic as search.js ══ */
  useEffect(() => {
    if (!router.isReady) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runSearch({ q: query, category: activeCategory, subcategory: activeSub, sort: sortBy, pageNum: 1 })

      // shallow URL update
      const urlQuery = {}
      if (query)          urlQuery.q           = query
      if (activeCategory) urlQuery.category    = activeCategory
      if (activeSub)      urlQuery.subcategory = activeSub
      if (sortBy !== 'latest') urlQuery.sort   = sortBy
      router.replace({ pathname: router.pathname, query: urlQuery }, undefined, { shallow: true })
    }, query ? 350 : 0)

    return () => clearTimeout(debounceRef.current)
  }, [query, activeCategory, activeSub, sortBy, router.isReady])

  /* ══ 6. Handlers ══ */

  // input → debounce → query
  const handleInputChange = (e) => {
    setInputVal(e.target.value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(e.target.value), 350)
  }

  const handleCategoryClick = (slug) => {
    if (slug === activeCategory) {
      setActiveCategory('')
      setActiveSub('')
    } else {
      setActiveCategory(slug)
      setActiveSub('')
    }
  }

  const handleSubClick = (slug) => setActiveSub(slug === activeSub ? '' : slug)

  const handleReset = () => {
    setInputVal(''); setQuery('')
    setActiveCategory(''); setActiveSub('')
    setSortBy('latest')
  }

  const handleLoadMore = () => {
    runSearch({ q: query, category: activeCategory, subcategory: activeSub, sort: sortBy, pageNum: page + 1, append: true })
  }

  const handleVote = useCallback(async (post, liked) => {
    try { await api.post('/votes', { discussionId: post.id, value: liked ? 1 : 0 }) }
    catch (err) { console.error(err) }
  }, [])

  /* ── derived labels for result count (mirrors search.js JSX) ── */
  const rootLabel = rootCategories.find(c => c.slug === activeCategory)?.name ?? activeCategory
  const subLabel  = subcategories.find(s => s.slug === activeSub)?.name       ?? activeSub

  const hasFilters = !!(query || activeCategory || activeSub || sortBy !== 'latest')

  /* ══ SIDEBAR ══ */
  const sidebar = (
    <>
      {/* Trending */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>
          🔥 Trending
        </span>
        {trending.length === 0
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
          : trending.map((d, i) => (
              <TrendingRow key={d.id} rank={i + 1}
                title={d.title ?? ''}
                subtitle={`${d._count?.votes ?? 0} upvote`}
                href={`/user/discussions/${d.id}`}
              />
            ))
        }
      </div>

      {/* Kategori — klik = set filter ke feed */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 10 }}>
          🗂 Kategori
        </span>

        {catsLoading
          ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 28, width: 64, borderRadius: 99, background: colors.bgElevated }} />
              ))}
            </div>
          )
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Pill label="Semua" active={!activeCategory} onClick={() => handleCategoryClick('')} />
              {rootCategories.map(cat => (
                <Pill
                  key={cat.id}
                  label={cat.name}
                  active={activeCategory === cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                />
              ))}
            </div>
          )
        }

        {/* Subkategori — muncul dinamis */}
        {activeCategory && subcategories.length > 0 && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: 11, color: colors.textSecondary, display: 'block', marginBottom: 6 }}>Sub-kategori</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {subcategories.map(sub => (
                <Pill
                  key={sub.id}
                  label={sub.name}
                  active={activeSub === sub.slug}
                  onClick={() => handleSubClick(sub.slug)}
                  sub
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )

  /* ══ RENDER ══ */
  return (
    <UserLayout sidebar={sidebar}>

      {/* ── Sticky header: search + sort tabs ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.border}`,
        padding: '14px 16px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Jelajahi Diskusi</h1>
          <Link href="/user/create" style={{
            background: colors.accent, color: '#fff', textDecoration: 'none',
            borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600,
          }}>+ Buat</Link>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: colors.bgElevated,
          border: `1px solid ${inputVal ? colors.accent : colors.border}`,
          borderRadius: 24, padding: '8px 14px', marginBottom: 12,
          transition: 'border-color 0.15s',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={inputVal ? colors.accent : colors.textSecondary} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Cari judul atau konten diskusi…"
            autoComplete="off"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 14,
              background: 'transparent', color: colors.textPrimary, fontFamily: 'inherit',
            }}
          />
          {inputVal && (
            <button
              onClick={() => { setInputVal(''); setQuery('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary, fontSize: 16, lineHeight: 1, padding: 0 }}
            >✕</button>
          )}
        </div>

        {/* Sort tabs */}
        <div style={{ display: 'flex' }}>
          {SORT_OPTIONS.map(s => (
            <button key={s.value} onClick={() => setSortBy(s.value)} style={{
              flex: 1, padding: '9px 0', background: 'none', border: 'none',
              borderBottom: sortBy === s.value ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontWeight: sortBy === s.value ? 700 : 400,
              color: sortBy === s.value ? colors.textPrimary : colors.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* ── Active filter bar (category + sub badges + clear) ── */}
      {(activeCategory || activeSub) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          padding: '10px 16px', borderBottom: `1px solid ${colors.border}`,
          background: colors.bgElevated,
        }}>
          <span style={{ fontSize: 12, color: colors.textSecondary }}>Filter:</span>
          {activeCategory && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: colors.accent + '22', border: `1px solid ${colors.accent}55`,
              fontSize: 12, color: colors.accent, fontWeight: 600,
            }}>
              {rootLabel}
              <button onClick={() => { setActiveCategory(''); setActiveSub('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.accent, fontSize: 13, padding: 0, lineHeight: 1 }}>✕</button>
            </span>
          )}
          {activeSub && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 99,
              background: colors.bgElevated, border: `1px solid ${colors.border}`,
              fontSize: 11, color: colors.textSecondary,
            }}>
              {subLabel}
              <button onClick={() => setActiveSub('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textSecondary, fontSize: 13, padding: 0, lineHeight: 1 }}>✕</button>
            </span>
          )}
          <button onClick={handleReset}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.textSecondary, textDecoration: 'underline' }}>
            Reset semua
          </button>
        </div>
      )}

      {/* ── Result count (mirrors search.js) ── */}
      {!loading && !error && (
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${colors.border}`, fontSize: 13, color: colors.textSecondary }}>
          <strong style={{ color: colors.textPrimary }}>{total}</strong> hasil
          {query && <> untuk &quot;<strong style={{ color: colors.textPrimary }}>{query}</strong>&quot;</>}
          {activeCategory && (
            <>
              {' '}di{' '}
              <strong style={{ color: colors.textPrimary }}>
                {rootLabel}{activeSub && ` › ${subLabel}`}
              </strong>
            </>
          )}
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          margin: '12px 16px', padding: '10px 14px', borderRadius: 10,
          background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Subcategory pills inside main (mobile-friendly, mirrors search.js subcategory-row) ── */}
      {activeCategory && subcategories.length > 0 && (
        <div style={{
          display: 'flex', gap: 6, padding: '10px 16px', overflowX: 'auto',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <span style={{ fontSize: 12, color: colors.textSecondary, alignSelf: 'center', flexShrink: 0 }}>Sub:</span>
          {subcategories.map(sub => (
            <Pill key={sub.id} label={sub.name} active={activeSub === sub.slug}
              onClick={() => handleSubClick(sub.slug)} sub />
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
        : discussions.length === 0 && !error
        ? (
          <EmptyState
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title={hasFilters ? 'Tidak ada diskusi yang cocok.' : 'Belum ada diskusi.'}
            description={hasFilters ? 'Coba ubah kata kunci atau hapus filter.' : 'Jadilah yang pertama membuat diskusi!'}
            actionLabel={hasFilters ? 'Reset filter' : 'Buat Diskusi'}
            actionHref={hasFilters ? undefined : '/user/create'}
            onAction={hasFilters ? handleReset : undefined}
            Link={Link}
          />
        )
        : discussions.map(d => (
            <Link
              key={d.id}
              href={`/user/discussions/${d.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <DiscussionCard key={d.id} post={d} onLike={handleVote} />
            </Link>
          ))
      }

      {/* ── Load more ── */}
      {hasMore && !loading && discussions.length > 0 && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            style={{
              background: 'none', border: `1px solid ${colors.border}`,
              borderRadius: 20, padding: '9px 28px',
              color: loadingMore ? colors.textSecondary : colors.accent,
              fontSize: 14, cursor: loadingMore ? 'default' : 'pointer',
            }}
          >
            {loadingMore ? 'Memuat…' : 'Muat lebih banyak'}
          </button>
        </div>
      )}

      {loadingMore && (
        <div style={{ padding: '0 16px 16px' }}>
          <SkeletonCard variant="post" />
        </div>
      )}

    </UserLayout>
  )
}



