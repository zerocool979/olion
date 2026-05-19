import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useDiscussion } from '../../../hooks/useDiscussion'
import {
  DiscussionSkeleton,
  DiscussionHeader,
  DiscussionContent,
  DiscussionVote,
  CommentList,
  CommentForm,
  Toast,
} from '../../../components/discussion'

function ErrorState({ message }) {
  return (
    <div className="dd-error-state" role="alert">
      <div className="dd-error-state__icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#596570" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 className="dd-error-state__title">Diskusi tidak ditemukan</h2>
      <p className="dd-error-state__msg">{message}</p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          className="btn-outline"
          onClick={() => window.location.reload()}
          style={{ fontSize: '0.85rem' }}
        >
          Coba Lagi
        </button>
        <Link href="/user/discussions" className="btn-ghost" style={{ fontSize: '0.85rem' }}>
          ← Kembali
        </Link>
      </div>
    </div>
  )
}

export default function UserDiscussionDetail() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)

  const {
    discussion,
    comments,
    loading,
    error,
    voteState,
    voteCount,
    votePending,
    newComment,
    setNewComment,
    submitting,
    submitError,
    toast,
    replyTarget,
    setReplyTarget,
    replyContent,
    setReplyContent,
    replySubmitting,
    commentVotes,
    votingCommentId,
    handleVote,
    handleComment,
    handleReply,
    handleCommentVote,
    handleCopyLink,
  } = useDiscussion(id)

  const siteTitle  = discussion ? `${discussion.title} — OLION` : 'Diskusi — OLION'
  const siteDesc   = discussion
    ? `${discussion.content?.slice(0, 155)}...`
    : 'Forum diskusi anonim modern — OLION'

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDesc} />
        <meta property="og:title"       content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type"        content="article" />
        {discussion && (
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        )}
      </Head>

      <div className="page-shell">
        <div className="page-grid-bg" />

        <Toast toast={toast} />

        {loading && (
          <div className="dd-page">
            <DiscussionSkeleton />
          </div>
        )}

        {!loading && (error || !discussion) && (
          <div className="dd-page">
            <ErrorState message={error || 'Diskusi tidak dapat dimuat.'} />
          </div>
        )}

        {!loading && discussion && (
          <div className="dd-page">
            <div className="dd-container">

              <main className="dd-main" id="main-content">

                <DiscussionHeader
                  discussion={discussion}
                  onCopyLink={handleCopyLink}
                />

                <DiscussionContent discussion={discussion} />

                <div className="dd-vote-bar">
                  <DiscussionVote
                    voteCount={voteCount}
                    voteState={voteState}
                    votePending={votePending}
                    onVote={handleVote}
                  />
                  <Link
                    href={`/user/report?targetId=${discussion.id}&type=discussion`}
                    className="dd-report-link"
                    aria-label="Laporkan diskusi ini"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
                    </svg>
                    Laporkan
                  </Link>
                </div>

                <section className="dd-comments-section" aria-label="Komentar">
                  <div className="dd-comments-header">
                    <h2 className="dd-comments-title">
                      Komentar
                      <span className="dd-comments-count">{discussion._count?.comments ?? 0}</span>
                    </h2>
                  </div>

                  <CommentList
                    comments={comments}
                    loading={false}
                    onVote={handleCommentVote}
                    onReply={setReplyTarget}
                    commentVotes={commentVotes}
                    votingCommentId={votingCommentId}
                  />

                  {replyTarget && (
                    <div className="dd-reply-form" style={{ marginTop: '1rem', paddingLeft: '2.5rem' }}>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Membalas <strong>@{replyTarget.username}</strong>
                      </p>
                      <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: '0.5rem' }}
                        placeholder="Tulis balasan..."
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={handleReply}
                          disabled={replySubmitting || !replyContent.trim()}
                          className="btn-primary"
                          style={{ fontSize: '0.8rem' }}
                        >
                          {replySubmitting ? 'Mengirim...' : 'Kirim Balasan'}
                        </button>
                        <button
                          onClick={() => { setReplyTarget(null); setReplyContent('') }}
                          className="btn-ghost"
                          style={{ fontSize: '0.8rem' }}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="dd-comment-form-wrap">
                    <CommentForm
                      value={newComment}
                      onChange={setNewComment}
                      onSubmit={handleComment}
                      submitting={submitting}
                      error={submitError}
                      isLoggedIn={!!user}
                    />
                  </div>
                </section>
              </main>

              <aside className="dd-sidebar" aria-label="Informasi tambahan">
                <div className="dd-sidebar-card">
                  <h3 className="dd-sidebar-card__title">Info Diskusi</h3>
                  <div className="dd-sidebar-info">
                    {[
                      {
                        label: 'Dibuat',
                        value: discussion.createdAt
                          ? new Date(discussion.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                          : '—',
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Kategori',
                        value: discussion.category?.name ?? '—',
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Mode',
                        value: discussion.mode === 'ANONYMOUS' ? 'Anonim' : 'Publik',
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Vote',
                        value: voteCount,
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M7 2v10M2 7l5-5 5 5"/>
                          </svg>
                        ),
                      },
                      {
                        label: 'Komentar',
                        value: discussion._count?.comments ?? 0,
                        icon: (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                          </svg>
                        ),
                      },
                    ].map((row) => (
                      <div key={row.label} className="dd-sidebar-info__row">
                        <span className="dd-sidebar-info__icon">{row.icon}</span>
                        <span className="dd-sidebar-info__label">{row.label}</span>
                        <span className="dd-sidebar-info__value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dd-sidebar-card">
                  <h3 className="dd-sidebar-card__title">Penulis</h3>
                  <div className="dd-sidebar-author">
                    <div className="avatar" style={{ width: 40, height: 40, fontSize: '15px' }} aria-hidden="true">
                      {(discussion.user?.profile?.username?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="dd-sidebar-author__name">
                        {discussion.user?.profile?.username ?? 'Anonim'}
                      </p>
                      {discussion.user?.isVerifiedExpert && (
                        <span className="badge badge--expert">✦ Verified Expert</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dd-sidebar-card">
                  <h3 className="dd-sidebar-card__title">Aksi</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      className="btn-ghost"
                      onClick={handleCopyLink}
                      style={{ justifyContent: 'flex-start', fontSize: '0.84rem' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                      Salin Link
                    </button>
                    <Link
                      href={`/user/report?targetId=${discussion.id}&type=discussion`}
                      className="btn-ghost"
                      style={{ justifyContent: 'flex-start', fontSize: '0.84rem', color: '#f87171' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
                      </svg>
                      Laporkan Diskusi
                    </Link>
                  </div>
                </div>

              </aside>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
