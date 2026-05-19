export default function TrendingSkeleton() {
  return (
    <div className="trending-skeleton card">
      <div className="skeleton trending-skeleton__rank" />
      <div className="trending-skeleton__body">
        <div className="skeleton" style={{ height: '14px', width: '55%', marginBottom: '0.6rem' }} />
        <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '0.4rem' }} />
        <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '0.75rem' }} />
        <div className="trending-skeleton__lines">
          <div className="skeleton" style={{ height: '12px', width: '48px' }} />
          <div className="skeleton" style={{ height: '12px', width: '48px' }} />
          <div className="skeleton" style={{ height: '12px', width: '64px' }} />
        </div>
      </div>
    </div>
  );
}
