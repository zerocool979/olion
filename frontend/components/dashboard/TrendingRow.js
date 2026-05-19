import Link from 'next/link'

export function TrendingRow({ discussion, rank }) {
  return (
    <Link href={`/user/discussions/${discussion.id}`} className="ud-trending-row">
      <span className={`ud-trending-row__rank ${rank <= 3 ? 'ud-trending-row__rank--top' : ''}`}>
        {rank}
      </span>
      <div className="ud-trending-row__body">
        <p className="ud-trending-row__title line-clamp-2">{discussion.title}</p>
        <div className="ud-trending-row__meta">
          {discussion.category?.name && (
            <span className="badge badge--category">{discussion.category.name}</span>
          )}
          <span className="ud-trending-row__stat">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {discussion._voteCount ?? 0}
          </span>
          <span className="ud-trending-row__stat">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4 9l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {discussion._answerCount ?? 0}
          </span>
        </div>
      </div>
    </Link>
  )
}
