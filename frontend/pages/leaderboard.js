import { useState, useEffect } from 'react';
import api from '../lib/api';
import FilterPill from '../components/FilterPill';
import EmptyState from '../components/EmptyState';
import LeaderSkeleton from '../components/LeaderSkeleton';
import PodiumCard from '../components/PodiumCard';
import LeaderRow from '../components/LeaderRow';

const PERIODS = [
  { label: 'Minggu Ini',      value: 'week'  },
  { label: 'Bulan Ini',       value: 'month' },
  { label: 'Sepanjang Waktu',  value: 'all'   },
];

export default function Leaderboard() {
  const [period, setPeriod]   = useState('all');
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/leaderboard', { params: { period, limit: 50 } });
        if (!cancelled) setData(res.data.data ?? []);
      } catch (err) {
        console.error('[leaderboard]', err);
        if (!cancelled) setError('Gagal memuat data leaderboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true };
  }, [period]);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">

        {/* Header */}
        <div className="page-header page-header--flex animate-fade-up">
          <div>
            <h1 className="page-title">Leaderboard</h1>
            <p className="page-subtitle">Kontributor terbaik komunitas OLION berdasarkan reputasi</p>
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

        {/* Podium (top 3) */}
        {!loading && top3.length >= 3 && (
          <div className="podium-grid animate-fade-up stagger-1">
            {podiumOrder.map(u => u && <PodiumCard key={u.id} u={u} />)}
          </div>
        )}

        {/* Podium skeleton */}
        {loading && (
          <div className="podium-grid animate-fade-up stagger-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="card podium-card podium-card--skeleton">
                <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 0.75rem' }} />
                <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto 0.75rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '70%', margin: '0 auto 0.4rem' }} />
                <div className="skeleton" style={{ height: '20px', width: '50%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        )}

        {/* Section header */}
        {!loading && rest.length > 0 && (
          <div className="section-header animate-fade-up stagger-2">
            <span className="section-title">
              Ranking Selanjutnya
              <span className="section-count">· #{top3.length + 1} – #{data.length}</span>
            </span>
          </div>
        )}

        {/* Rest of rankings */}
        {loading ? (
          <div className="discussion-list animate-fade-up stagger-2">
            {Array.from({ length: 7 }).map((_, i) => <LeaderSkeleton key={i} />)}
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            message="Belum ada data untuk periode ini."
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#596570" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            }
          />
        ) : (
          <div className="discussion-list animate-fade-up stagger-3">
            {rest.map(u => <LeaderRow key={u.id} u={u} />)}
          </div>
        )}

        {/* Reputation formula note */}
        {!loading && data.length > 0 && (
          <div className="reputation-formula animate-fade-up">
            <span className="reputation-formula__title">Cara Perhitungan Reputasi</span>
            Upvote diterima ×10 · Komentar dibuat ×2 · Diskusi dibuat ×5
            {' '}· Expert bonus +50 · Semua aktivitas dalam periode yang dipilih.
          </div>
        )}
      </div>
    </div>
  );
}



