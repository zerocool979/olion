export function EmptyComments() {
  return (
    <div className="dd-empty-comments" role="status">
      <div className="dd-empty-comments__icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#596570" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </div>
      <p className="dd-empty-comments__text">Belum ada komentar.</p>
      <p className="dd-empty-comments__sub">Jadilah yang pertama memulai diskusi!</p>
    </div>
  )
}



