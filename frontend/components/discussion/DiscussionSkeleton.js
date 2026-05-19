export function DiscussionSkeleton() {
  return (
    <div className="dd-skeleton" role="status" aria-label="Memuat diskusi...">
      <div className="dd-skeleton__breadcrumb skeleton" />
      <div className="dd-skeleton__title skeleton" />
      <div className="dd-skeleton__title-sm skeleton" />
      <div className="dd-skeleton__meta skeleton" />
      <div className="dd-skeleton__body skeleton" />
      <div className="dd-skeleton__body skeleton" style={{ width: '85%' }} />
      <div className="dd-skeleton__body skeleton" style={{ width: '70%' }} />
    </div>
  )
}
