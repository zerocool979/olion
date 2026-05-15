import Link from 'next/link'
import api from '../lib/api'
import { useEffect, useState } from 'react'

function CategorySkeleton() {
  return (
    <div className="category-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ height: '16px', width: '55%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.3rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '12px', width: '35%' }} />
    </div>
  )
}

function CategoryCard({ cat }) {
  const count = cat._count?.discussions ?? 0

  return (
    <Link href={`/search?category=${cat.slug}`} className="category-card">
      <p className="category-card__name">{cat.name}</p>

      {cat.description && (
        <p className="category-card__description">{cat.description}</p>
      )}

      <div className="category-card__footer">
        <span className="category-card__count">
          {count.toLocaleString()} diskusi
        </span>
        <span className="category-card__arrow">
          Lihat diskusi
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data.data ?? [])
      } catch (err) {
        console.error('[categories]', err)
        setError('Gagal memuat kategori. Coba muat ulang halaman.')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const totalDiscussions = categories.reduce(
    (sum, c) => sum + (c._count?.discussions ?? 0),
    0
  )
  const mostPopular = categories[0]

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />

      <div className="page-content">

        {/* Header */}
        <header className="page-header animate-fade-up">
          <h1 className="page-title">Kategori</h1>
          <p className="page-subtitle">
            Temukan diskusi berdasarkan topik yang kamu minati
          </p>
        </header>

        {/* Error */}
        {error && <div className="error-banner animate-fade-in">{error}</div>}

        {/* Stats row */}
        {!loading && (
          <div className="stats-grid animate-fade-up stagger-1">
            <div className="stat-card">
              <p className="stat-value">{categories.length}</p>
              <p className="stat-label">Total Kategori</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">{totalDiscussions.toLocaleString()}</p>
              <p className="stat-label">Total Diskusi</p>
            </div>
            <div className="stat-card">
              <p className="stat-value" style={{ fontSize: '1rem' }}>
                {mostPopular?.name ?? '—'}
              </p>
              <p className="stat-label">Kategori Terpopuler</p>
            </div>
          </div>
        )}

        {/* Skeleton stats */}
        {loading && (
          <div className="stats-grid animate-fade-up stagger-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="stat-card">
                <div className="skeleton" style={{ height: '28px', width: '60%', margin: '0 auto 0.4rem' }} />
                <div className="skeleton" style={{ height: '12px', width: '80%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        )}

        {/* Section header */}
        <div className="section-header animate-fade-up stagger-2">
          <span className="section-title">
            Semua Kategori
            {!loading && (
              <span className="section-count">· {categories.length}</span>
            )}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="categories-grid animate-fade-up stagger-3">
            {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state animate-fade-up stagger-3">
            <div className="empty-state__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h12" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="empty-state__text">Belum ada kategori.</p>
          </div>
        ) : (
          <div className="categories-grid animate-fade-up stagger-3">
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
