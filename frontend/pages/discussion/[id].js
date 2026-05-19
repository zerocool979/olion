import { useRouter } from 'next/router'
import { useContext } from 'react'
import Link from 'next/link'
import { ROUTES } from '../../lib/routes'
import { AuthContext } from '../../context/AuthContext'
import { useDiscussion } from '../../hooks/useDiscussion'
import {
  DiscussionSkeleton,
  DiscussionHeader,
  DiscussionContent,
  DiscussionVote,
  CommentList,
  CommentForm,
  Toast,
} from '../../components/discussion'

export default function GuestDiscussion() {
  const router = useRouter()
  const { id } = router.query
  const { token } = useContext(AuthContext)
  const isLoggedIn = !!token

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

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-grid-bg" />
        <div className="page-content" style={{ maxWidth: '760px' }}>
          <DiscussionSkeleton />
        </div>
      </div>
    )
  }

  if (error || !discussion) {
    return (
      <div className="page-shell">
        <div className="page-grid-bg" />
        <div className="page-content" style={{ textAlign: 'center', paddingTop: '6rem' }}>
          <p className="text-error" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            {error ?? 'Diskusi tidak ditemukan.'}
          </p>
          <Link href={ROUTES.guest.search} className="btn-outline">← Cari diskusi lain</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content" style={{ maxWidth: '760px' }}>
        <DiscussionHeader discussion={discussion} onCopyLink={handleCopyLink} />

        {isLoggedIn && (
          <DiscussionVote
            voteCount={voteCount}
            voteState={voteState}
            votePending={votePending}
            onVote={handleVote}
          />
        )}

        <DiscussionContent discussion={discussion} />

        <section style={{ marginTop: '2rem' }}>
          <CommentList
            comments={comments}
            loading={false}
            onVote={handleCommentVote}
            onReply={setReplyTarget}
            commentVotes={commentVotes}
            votingCommentId={votingCommentId}
          />

          {replyTarget && (
            <div style={{ marginTop: '1rem', paddingLeft: '2.5rem' }}>
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

          {isLoggedIn ? (
            <CommentForm
              value={newComment}
              onChange={setNewComment}
              onSubmit={handleComment}
              submitting={submitting}
              error={submitError}
              isLoggedIn={true}
            />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Masuk untuk ikut berdiskusi dan memberikan jawaban.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link href={ROUTES.guest.login} className="btn-primary">Login</Link>
                <Link href={ROUTES.guest.register} className="btn-outline">Daftar</Link>
              </div>
            </div>
          )}
        </section>

        <Toast toast={toast} />
      </div>
    </div>
  )
}
