import { Avatar } from './Avatar'
import { timeAgo } from '../../lib/timeAgo'

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



