import { useState } from 'react'
import Link from 'next/link'
import { DiscussionMeta } from './DiscussionMeta'

export function DiscussionHeader({
  discussion,
  onCopyLink,
  onShare,
  isOwner = false,
  isStaff = false,
  isLoggedIn = false,
  isBookmarked = false,
  bookmarkPending = false,
  onToggleBookmark,
  onEditToggle,
  isEditing = false,
  onDelete,
  deleting = false,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const canManage = isOwner || isStaff

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    setConfirmingDelete(false)
    onDelete?.()
  }

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

        <button
          className="dd-icon-btn"
          onClick={onShare ?? onCopyLink}
          aria-label="Bagikan diskusi"
          title="Bagikan"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>

        {isLoggedIn && (
          <button
            className={`dd-icon-btn${isBookmarked ? ' dd-icon-btn--active' : ''}`}
            onClick={onToggleBookmark}
            disabled={bookmarkPending}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
            title={isBookmarked ? 'Hapus dari bookmark' : 'Simpan diskusi'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        )}

        {canManage && (
          <button
            className={`dd-icon-btn${isEditing ? ' dd-icon-btn--active' : ''}`}
            onClick={onEditToggle}
            aria-pressed={isEditing}
            aria-label="Edit diskusi"
            title="Edit diskusi"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}

        {canManage && (
          <button
            className="dd-icon-btn dd-icon-btn--danger"
            onClick={handleDeleteClick}
            onBlur={() => setConfirmingDelete(false)}
            disabled={deleting}
            aria-label={confirmingDelete ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus diskusi'}
            title={confirmingDelete ? 'Klik lagi untuk konfirmasi' : 'Hapus diskusi'}
          >
            {confirmingDelete ? (
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0 2px' }}>?</span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            )}
          </button>
        )}

        {isLoggedIn && !isOwner && (
          <Link
            href={`/user/report?targetId=${discussion.id}&type=discussion`}
            className="dd-icon-btn"
            aria-label="Laporkan diskusi"
            title="Laporkan diskusi"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
            </svg>
          </Link>
        )}
      </div>

      {!isEditing && <h1 className="dd-title">{discussion.title}</h1>}
      <DiscussionMeta discussion={discussion} />
    </header>
  )
}
