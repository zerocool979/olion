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
