import Link from 'next/link'
import { DiscussionMeta } from './DiscussionMeta'

export function DiscussionHeader({ discussion, onCopyLink }) {
  return (
    <header className="dd-header">
      <Link href="/user/discussions" className="dd-back btn-ghost" aria-label="Kembali ke daftar diskusi">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Kembali
      </Link>

      <div className="dd-header__actions">
        <button
          className="dd-icon-btn"
          onClick={onCopyLink}
          aria-label="Salin link diskusi"
          title="Salin link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
        <button className="dd-icon-btn" aria-label="Bagikan diskusi" title="Bagikan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      <h1 className="dd-title">{discussion.title}</h1>
      <DiscussionMeta discussion={discussion} />
    </header>
  )
}
