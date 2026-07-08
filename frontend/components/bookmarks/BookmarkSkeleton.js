export function BookmarkSkeleton() {
  return (
    <div style={{ background: 'rgba(14,17,20,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div className="skeleton" style={{ height: '18px', width: '64px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '18px', width: '48px', borderRadius: '4px' }} />
      </div>
      <div className="skeleton" style={{ height: '16px', width: '75%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.3rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '0.875rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '12px', width: '30%' }} />
        <div className="skeleton" style={{ height: '12px', width: '25%' }} />
      </div>
    </div>
  )
}



