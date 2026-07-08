import Link from 'next/link';
import RankBadge from './RankBadge';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function TrendingRow({ d }) {
  const { token } = useContext(AuthContext)
  const href = token ? `/user/discussions/${d.id}` : `/discussion/${d.id}`
  const catLabel = d.category?.parent
    ? `${d.category.parent.name} › ${d.category.name}`
    : d.category?.name ?? '';

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="trending-card card">
        <RankBadge rank={d.rank} />
        <div className="trending-card__body">
          <div className="trending-card__meta">
            {catLabel && <span className="badge badge-mode trending-card__cat">{catLabel}</span>}
            {d.hot && <span className="trending-card__hot-badge">🔥 Hot</span>}
            {d.trend && (
              <span className={`trending-card__trend ${d.trend.startsWith('+') ? 'trending-card__trend--up' : 'trending-card__trend--down'}`}>
                {d.trend}
              </span>
            )}
          </div>
          <h3 className="trending-card__title line-clamp-2">{d.title}</h3>
          <div className="trending-card__stats">
            <span className="trending-card__author">
              {d.user?.profile?.username ?? 'Anonim'}
              {d.user?.isVerifiedExpert && <span className="badge badge-expert trending-card__expert">✦ Expert</span>}
            </span>
            <span className="trending-card__stat">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {(d._count?.votes ?? 0).toLocaleString()}
            </span>
            <span className="trending-card__stat">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7C1 3.68 3.68 1 7 1s6 2.68 6 6c0 1.2-.36 2.32-.96 3.26L13 13l-2.74-.96A5.95 5.95 0 017 13c-3.32 0-6-2.68-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              {(d._count?.comments ?? 0).toLocaleString()}
            </span>
            <span className="trending-card__score">
              score {d.score?.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}



