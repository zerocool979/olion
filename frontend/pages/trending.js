import { useState, useEffect } from 'react';
import api from '../lib/api';
import FilterPill from '../components/FilterPill';
import TrendingRow from '../components/TrendingRow';
import TrendingSkeleton from '../components/TrendingSkeleton';
import EmptyState from '../components/EmptyState';

const PERIODS = [
  { label: '24 Jam', value: '24h' },
  { label: '7 Hari', value: '7d'  },
  { label: '30 Hari', value: '30d' },
];

export default function Trending() {
  const [period, setPeriod]   = useState('24h');
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/trending', { params: { period, limit: 20 } });
        if (!cancelled) setData(res.data.data ?? []);
      } catch (err) {
        console.error('[trending]', err);
        if (!cancelled) setError('Gagal memuat data trending.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true };
  }, [period]);

  const periodLabel = PERIODS.find(p => p.value === period)?.label ?? '';

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">
        {/* Header */}
        <div className="page-header page-header--flex animate-fade-up">
          <div>
            <div className="page-eyebrow">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 14c2-3 4-4 6-2s4-1 6-4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 4v4h4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: '#f59e0b' }}>Trending</span>
            </div>
            <h1 className="page-title">Diskusi Populer</h1>
            <p className="page-subtitle">
              {loading ? 'Menghitung engagement...' : `${data.length} diskusi trending dalam ${periodLabel}`}
            </p>
          </div>

          <div className="filter-group">
            {PERIODS.map(p => (
              <FilterPill
                key={p.value}
                active={period === p.value}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {error && <div className="error-banner animate-fade-in">{error}</div>}

        <div className="discussion-list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <TrendingSkeleton key={i} />)
            : data.length === 0
              ? (
                <EmptyState
                  message="Belum ada diskusi trending dalam periode ini."
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 17c3-4 6-5 9-2s6-2 9-6" stroke="#596570" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  }
                />
              )
              : data.map((d, i) => (
                  <div key={d.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
                    <TrendingRow d={d} />
                  </div>
                ))
          }
        </div>
      </div>
    </div>
  );
}
