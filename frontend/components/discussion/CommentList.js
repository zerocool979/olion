import { CommentItem } from './CommentItem'
import { EmptyComments } from './EmptyComments'

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
        <CommentItem
          key={c.id}
          comment={c}
          onVote={onVote}
          onReply={onReply}
          voteState={commentVotes[c.id] || null}
          voteLoading={votingCommentId === c.id}
        />
      ))}
    </div>
  )
}
