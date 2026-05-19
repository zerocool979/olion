export default function SkeletonCard() {
  return (
    <div className="discussion-card discussion-card--skeleton">
      <div className="skeleton" style={{ height: '18px', width: '65%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '12px', width: '30%' }} />
        <div className="skeleton" style={{ height: '12px', width: '20%' }} />
      </div>
    </div>
  );
}
