export function DiscussionSkeleton() {
  return (
    <div style={{ padding: '0.875rem 1rem', background: 'rgba(14,17,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '11px', width: '30%' }} />
    </div>
  )
}
