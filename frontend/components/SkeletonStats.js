/**
 * Placeholder skeleton untuk stat cards (Total Kategori, Total Diskusi, Kategori Terpopuler).
 * Digunakan saat data masih dimuat.
 */
export default function SkeletonStats() {
  return (
    <div className="stats-grid animate-fade-up stagger-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="skeleton skeleton-stat-value" />
          <div className="skeleton skeleton-stat-label" />
        </div>
      ))}
    </div>
  );
}
