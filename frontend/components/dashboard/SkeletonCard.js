export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="ud-skeleton-card">
      <div className="skeleton" style={{ height: '13px', width: '40%', marginBottom: '0.875rem' }} />
      <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '0.6rem' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '12px', width: `${85 - i * 12}%`, marginBottom: '0.35rem' }} />
      ))}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem' }}>
        <div className="skeleton" style={{ height: '26px', width: '72px', borderRadius: '7px' }} />
        <div className="skeleton" style={{ height: '26px', width: '88px', borderRadius: '7px' }} />
      </div>
    </div>
  )
}
