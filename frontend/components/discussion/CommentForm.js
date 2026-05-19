import { useRef, useEffect } from 'react'
import Link from 'next/link'

const MAX_CHARS = 1000

export function CommentForm({ value, onChange, onSubmit, submitting, error, isLoggedIn }) {
  const textareaRef = useRef(null)
  const remaining   = MAX_CHARS - value.length
  const canSubmit   = value.trim().length > 0 && !submitting && remaining >= 0

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 260)}px`
  }, [value])

  if (!isLoggedIn) {
    return (
      <div className="dd-comment-cta" role="complementary" aria-label="Login untuk berkomentar">
        <div className="dd-comment-cta__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#596570" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <p className="dd-comment-cta__text">Masuk untuk ikut berdiskusi</p>
        <p className="dd-comment-cta__sub">Diskusi anonim. Identitasmu tetap terlindungi.</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Link href="/guest/login"    className="btn-primary" style={{ fontSize: '0.85rem' }}>Masuk</Link>
          <Link href="/guest/register" className="btn-outline" style={{ fontSize: '0.85rem' }}>Daftar Gratis</Link>
        </div>
      </div>
    )
  }

  return (
    <form className="dd-comment-form" onSubmit={onSubmit} noValidate aria-label="Form komentar">
      <div className={`dd-comment-form__wrap${value.length > 0 ? ' dd-comment-form__wrap--active' : ''}`}>
        <textarea
          ref={textareaRef}
          className="dd-comment-form__textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Tulis komentarmu... (identitasmu tetap anonim)"
          rows={3}
          maxLength={MAX_CHARS}
          aria-label="Kolom komentar"
          aria-describedby={error ? 'comment-error' : undefined}
          disabled={submitting}
        />
        <div className="dd-comment-form__footer">
          <span
            className={`dd-comment-form__counter${remaining < 50 ? ' dd-comment-form__counter--warn' : ''}${remaining < 0 ? ' dd-comment-form__counter--error' : ''}`}
          >
            {remaining}
          </span>
          <button
            type="submit"
            className="btn-primary"
            disabled={!canSubmit}
            aria-busy={submitting}
            style={{ fontSize: '0.84rem', padding: '0.45rem 1.125rem' }}
          >
            {submitting ? (
              <>
                <svg style={{ animation: 'spin-inner 0.75s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="rgba(8,10,12,0.25)" strokeWidth="3"/>
                  <path fill="rgba(8,10,12,0.75)" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
                </svg>
                Mengirim...
              </>
            ) : 'Kirim Komentar'}
          </button>
        </div>
      </div>
      {error && (
        <p id="comment-error" className="dd-comment-form__error" role="alert">{error}</p>
      )}
    </form>
  )
}
