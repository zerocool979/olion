export function DiscussionContent({
  discussion,
  isEditing = false,
  editTitle = '',
  setEditTitle,
  editContent = '',
  setEditContent,
  editSubmitting = false,
  editError = '',
  onSaveEdit,
  onCancelEdit,
}) {
  const stats = discussion._count ?? {}

  if (isEditing) {
    return (
      <form className="dd-content dd-content--edit" onSubmit={onSaveEdit} aria-label="Edit diskusi">
        <label htmlFor="dd-edit-title" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
          Judul
        </label>
        <input
          id="dd-edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          disabled={editSubmitting}
          maxLength={200}
          className="dd-comment-form__textarea"
          style={{ marginBottom: '0.75rem' }}
        />
        <label htmlFor="dd-edit-content" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
          Isi diskusi
        </label>
        <textarea
          id="dd-edit-content"
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          disabled={editSubmitting}
          rows={6}
          className="dd-comment-form__textarea"
        />
        {editError && (
          <p className="dd-comment-form__error" role="alert" style={{ marginTop: '0.5rem' }}>{editError}</p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button type="submit" className="btn-primary" disabled={editSubmitting} style={{ fontSize: '0.84rem' }}>
            {editSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancelEdit} disabled={editSubmitting} style={{ fontSize: '0.84rem' }}>
            Batal
          </button>
        </div>
      </form>
    )
  }

  return (
    <article className="dd-content" aria-label="Isi diskusi">
      <p className="dd-content__body">{discussion.content}</p>

      <footer className="dd-content__footer">
        <span className="dd-content__stat">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7C1 3.68 3.68 1 7 1s6 2.68 6 6c0 1.2-.36 2.32-.96 3.26L13 13l-2.74-.96A5.95 5.95 0 017 13c-3.32 0-6-2.68-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          {stats.comments ?? 0} komentar
        </span>
        <span className="dd-content__stat">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {stats.votes ?? 0} vote
        </span>
        {discussion.mode && (
          <span className="dd-content__stat">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {discussion.mode === 'ANONYMOUS' ? 'Anonim' : 'Teridentifikasi'}
          </span>
        )}
      </footer>
    </article>
  )
}
