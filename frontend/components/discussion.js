import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { timeAgo, fullDate } from '../lib/timeAgo'

// ── Shared: Avatar ────────────────────────────────────────────────────────────
export function Avatar({ username, size = 32 }) {
  const initial = username?.[0]?.toUpperCase() ?? '?'
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: `${Math.round(size * 0.38)}px` }}
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}

// ── DiscussionSkeleton ────────────────────────────────────────────────────────
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

// ── DiscussionMeta ────────────────────────────────────────────────────────────
export function DiscussionMeta({ discussion }) {
  const username = discussion.user?.profile?.username ?? 'Anonim'
  const isExpert = discussion.user?.isVerifiedExpert
  const mode     = discussion.mode
  const catName  = discussion.category?.name

  return (
    <div className="dd-meta" role="contentinfo">
      <Avatar username={username} size={36} />
      <div className="dd-meta__body">
        <div className="dd-meta__row">
          <span className="dd-meta__username">{username}</span>
          {isExpert && <span className="badge badge--expert">✦ Expert</span>}
          {mode && (
            <span className={`badge badge--${mode === 'ANONYMOUS' ? 'anon' : 'public'}`}>
              {mode === 'ANONYMOUS' ? 'Anonim' : 'Publik'}
            </span>
          )}
          {catName && <span className="badge badge--category">{catName}</span>}
        </div>
        <time
          className="dd-meta__time"
          dateTime={discussion.createdAt}
          title={fullDate(discussion.createdAt)}
        >
          {timeAgo(discussion.createdAt)}
        </time>
      </div>
    </div>
  )
}

// ── DiscussionHeader ──────────────────────────────────────────────────────────
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

// ── DiscussionVote ────────────────────────────────────────────────────────────
export function DiscussionVote({ voteCount, voteState, votePending, onVote }) {
  return (
    <div className="dd-vote" role="group" aria-label="Voting diskusi">
      <button
        className={`dd-vote__btn dd-vote__btn--up${voteState === 1 ? ' dd-vote__btn--active-up' : ''}`}
        onClick={() => onVote(1)}
        disabled={votePending}
        aria-pressed={voteState === 1}
        aria-label="Upvote diskusi"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="dd-vote__count">{voteCount}</span>
        <span>Upvote</span>
      </button>

      <button
        className={`dd-vote__btn dd-vote__btn--down${voteState === -1 ? ' dd-vote__btn--active-down' : ''}`}
        onClick={() => onVote(-1)}
        disabled={votePending}
        aria-pressed={voteState === -1}
        aria-label="Downvote diskusi"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 12V2M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Downvote</span>
      </button>
    </div>
  )
}

// ── DiscussionContent ─────────────────────────────────────────────────────────
export function DiscussionContent({ discussion }) {
  const stats = discussion._count ?? {}
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

// ── EmptyComments ─────────────────────────────────────────────────────────────
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

// ── CommentItem ───────────────────────────────────────────────────────────────
export function CommentItem({ comment, onVote, onReply, voteState, voteLoading, commentVotes, votingCommentId }) {
  const username = comment.user?.profile?.username ?? 'Anonim'
  const isExpert = comment.user?.isVerifiedExpert
  const isOptimistic = comment._optimistic

  return (
    <article className={`dd-comment${isOptimistic ? ' dd-comment--optimistic' : ''}`}>
      <Avatar username={username} size={32} />
      <div className="dd-comment__body">
        <header className="dd-comment__header">
          <div className="dd-comment__author-row">
            <span className="dd-comment__username">{username}</span>
            {isExpert && <span className="badge badge--expert">✦ Expert</span>}
          </div>
          <time dateTime={comment.createdAt}>
            {isOptimistic ? 'Mengirim...' : timeAgo(comment.createdAt)}
          </time>
        </header>
        <p className="dd-comment__text">{comment.content}</p>

        <div className="dd-comment__actions">
          <button
            className="dd-comment__vote-btn"
            onClick={() => onVote(comment.id, 1)}
            disabled={voteLoading}
            aria-pressed={voteState === 1}
          >
            ▲ {comment._count?.votes ?? 0}
          </button>
          <button
            className="dd-comment__vote-btn"
            onClick={() => onVote(comment.id, -1)}
            disabled={voteLoading}
            aria-pressed={voteState === -1}
          >
            ▼
          </button>
          <button
            className="dd-comment__reply-btn"
            onClick={() => onReply({ commentId: comment.id, username })}
          >
            Balas
          </button>
        </div>

        {comment.replies?.length > 0 && (
          <div className="dd-comment__replies">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onVote={onVote}
                onReply={onReply}
                voteState={commentVotes?.[reply.id] ?? null}
                voteLoading={voteLoading}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// ── CommentList ───────────────────────────────────────────────────────────────
export function CommentList({ comments, loading, onVote, onReply, commentVotes, votingCommentId }) {
  if (loading) {
    return (
      <div role="status" aria-label="Memuat komentar">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="dd-comment dd-comment--skeleton">
            <span className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '30%', marginBottom: '0.4rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '13px', width: '90%', marginBottom: '0.3rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '13px', width: '70%', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) return <EmptyComments />

  return (
    <div className="dd-comment-list">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onVote={onVote} onReply={onReply} voteState={commentVotes[c.id] || null} voteLoading={votingCommentId === c.id} />
      ))}
    </div>
  )
}

// ── CommentForm ───────────────────────────────────────────────────────────────
const MAX_CHARS = 1000

export function CommentForm({ value, onChange, onSubmit, submitting, error, isLoggedIn }) {
  const textareaRef = useRef(null)
  const remaining   = MAX_CHARS - value.length
  const canSubmit   = value.trim().length > 0 && !submitting && remaining >= 0

  // Auto-resize textarea
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

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={`dd-toast dd-toast--${toast.type}`}
      role="alert"
      aria-live="polite"
    >
      {toast.type === 'success' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {toast.type === 'error' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )}
      {toast.msg}
    </div>
  )
}
