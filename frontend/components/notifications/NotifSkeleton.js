export function NotifSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '0.875rem', padding: '1rem 1.125rem', background: 'rgba(14,17,20,0.4)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
      <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: '11px', width: '25%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '13px', width: '85%', marginBottom: '0.35rem' }} />
        <div className="skeleton" style={{ height: '11px', width: '55%' }} />
      </div>
      <div className="skeleton" style={{ height: '11px', width: '48px', flexShrink: 0 }} />
    </div>
  )
}
