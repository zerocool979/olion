import { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { ROUTES } from '../../lib/routes'
import Link from 'next/link'
import api from '../../lib/api'
import { BookmarkCard } from '../../components/bookmarks/BookmarkCard'
import { BookmarkSkeleton } from '../../components/bookmarks/BookmarkSkeleton'

const SORT_OPTIONS = [
  { value: 'savedAt',  label: 'Terbaru Disimpan' },
  { value: 'popular',  label: 'Paling Populer' },
  { value: 'oldest',   label: 'Terlama' },
]

export default function UserBookmarks() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [bookmarks, setBookmarks] = useState([])
  const [hidden, setHidden] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('savedAt')
  const [searchFocus, setSearchFocus] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace(ROUTES.guest.login)
  }, [user, authLoading, router])

  const fetchBookmarks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await api.get('/bookmarks')
      const raw = res.data?.data ?? res.data ?? []
      setBookmarks(Array.isArray(raw) ? raw : [])
    } catch {
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchBookmarks() }, [fetchBookmarks])

  const handleRemove = useCallback(async (id, action) => {
    if (action === 'hide') {
      setHidden(prev => new Set([...prev, id]))
    } else if (action === 'undo') {
      setHidden(prev => { const n = new Set(prev); n.delete(id); return n })
    } else if (action === 'confirm') {
      try { await api.delete(`/bookmarks/${id}`) } catch { /* ignore */ }
      setBookmarks(prev => prev.filter(b => (b.id ?? b.discussion?.id) !== id))
      setHidden(prev => { const n = new Set(prev); n.delete(id); return n })
    }
  }, [])

  const visible = bookmarks
    .filter(b => !hidden.has(b.id ?? b.discussion?.id))
    .filter(b => {
      if (!searchQuery) return true
      const d = b.discussion ?? b
      const q = searchQuery.toLowerCase()
      return (
        d.title?.toLowerCase().includes(q) ||
        d.content?.toLowerCase().includes(q) ||
        d.category?.name?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const da = a.discussion ?? a
      const db = b.discussion ?? b
      if (sortBy === 'popular') return (db._count?.votes ?? 0) - (da._count?.votes ?? 0)
      if (sortBy === 'oldest')  return new Date(a.savedAt ?? a.createdAt) - new Date(b.savedAt ?? b.createdAt)
      return new Date(b.savedAt ?? b.createdAt) - new Date(a.savedAt ?? a.createdAt)
    })

  if (authLoading) return null

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content animate-fade-up" style={{ maxWidth: '800px' }}>
        <div className="page-header stagger-1" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Bookmark</h1>
            <p className="page-subtitle">
              {loading ? '...' : `${bookmarks.length - hidden.size} diskusi tersimpan`}
            </p>
          </div>

          {!loading && bookmarks.length > 0 && (
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
        </div>

        {!loading && bookmarks.length > 0 && (
          <div className="animate-fade-up stagger-2" style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <svg
              style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)',
                color: searchFocus ? 'var(--text-secondary)' : 'var(--text-muted)',
                pointerEvents: 'none',
                transition: 'color 160ms ease',
              }}
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Cari dalam bookmark..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.625rem',
                background: searchFocus ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${searchFocus ? 'var(--border-strong)' : 'var(--border-default)'}`,
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                boxShadow: searchFocus ? '0 0 0 3px rgba(255,255,255,0.04)' : 'none',
                transition: 'all 180ms ease',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="animate-fade-up stagger-2" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {searchQuery ? `${visible.length} hasil untuk "${searchQuery}"` : `${visible.length} diskusi`}
            </span>
          </div>
        )}

        <div className="animate-fade-up stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <BookmarkSkeleton key={i} />)
          ) : bookmarks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#596570" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                Belum ada diskusi tersimpan
              </p>
              <p style={{ color: '#3d4851', fontSize: '0.8rem', marginBottom: '1.25rem', maxWidth: '280px', margin: '0 auto 1.25rem' }}>
                Simpan diskusi menarik untuk dibaca nanti dengan menekan ikon bookmark.
              </p>
              <Link href="/search" className="btn-outline" style={{ fontSize: '0.825rem' }}>
                Jelajahi Diskusi
              </Link>
            </div>
          ) : visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Tidak ada bookmark yang cocok dengan &quot;{searchQuery}&quot;.
              </p>
              <button onClick={() => setSearchQuery('')} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                Hapus pencarian
              </button>
            </div>
          ) : (
            visible.map(b => (
              <BookmarkCard key={b.id ?? b.discussion?.id} item={b} onRemove={handleRemove} />
            ))
          )}
        </div>

        {hidden.size > 0 && (
          <div className="animate-fade-in" style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, display: 'flex', alignItems: 'center', gap: '1rem',
            background: 'rgba(20,23,25,0.98)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px', padding: '0.75rem 1.25rem', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)', whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {hidden.size} bookmark dihapus
            </span>
            <button
              onClick={() => { hidden.forEach(id => handleRemove(id, 'undo')) }}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600,
                padding: '0.3rem 0.75rem', cursor: 'pointer', transition: 'all 160ms ease',
                fontFamily: "'Syne', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
