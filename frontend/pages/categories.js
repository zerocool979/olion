import api from '../lib/api';
import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import CategorySkeleton from '../components/CategorySkeleton';
import EmptyState from '../components/EmptyState';
import SkeletonStats from '../components/SkeletonStats';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data ?? []);
      } catch (err) {
        console.error('[categories]', err);
        setError('Gagal memuat kategori. Coba muat ulang halaman.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const totalDiscussions = categories.reduce(
    (sum, c) => sum + (c.totalDiscussions ?? 0),
    0
  );
  const mostPopular = categories[0];

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">
        <header className="page-header animate-fade-up">
          <h1 className="page-title">Kategori</h1>
          <p className="page-subtitle">
            Temukan diskusi berdasarkan topik yang kamu minati
          </p>
        </header>

        {error && <div className="error-banner animate-fade-in">{error}</div>}

        {/* Stats row */}
        {!loading ? (
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
              <p className="stat-value stat-value--sm">
                {mostPopular?.name ?? '—'}
              </p>
              <p className="stat-label">Kategori Terpopuler</p>
            </div>
          </div>
        ) : (
          <SkeletonStats />
        )}

        <div className="section-header animate-fade-up stagger-2">
          <span className="section-title">
            Semua Kategori
            {!loading && <span className="section-count">· {categories.length}</span>}
          </span>
        </div>

        {loading ? (
          <div className="categories-grid animate-fade-up stagger-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            message="Belum ada kategori."
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 12h18M3 17h12" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        ) : (
          <div className="categories-grid animate-fade-up stagger-3">
            {categories.map(cat => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
