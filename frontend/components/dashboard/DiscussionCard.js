import { useState } from 'react'
import Link from 'next/link'
import { Avatar } from './Avatar'

export function DiscussionCard({ discussion, onVote, index, variant = 'feed' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`ud-disc-card animate-fade-up stagger-${Math.min(index + 1, 5)}`}
      data-hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {variant === 'trending' && (
        <span className={`ud-disc-card__rank ${index < 3 ? 'ud-disc-card__rank--hot' : ''}`}>
          {index + 1}
        </span>
      )}

      <div className="ud-disc-card__body">
        <div className="ud-disc-card__meta">
          <Avatar username={discussion.user?.profile?.username} size={18} />
          <span className="ud-disc-card__author">
            {discussion.user?.profile?.username || 'Anonim'}
          </span>
          {discussion.user?.isVerifiedExpert && (
            <span className="badge badge--expert">✦ Expert</span>
          )}
          {discussion.category?.name && (
            <span className="badge badge--category">{discussion.category.name}</span>
          )}
          {discussion.mode && (
            <span className={`badge ${discussion.mode === 'ANONYMOUS' ? 'badge--anon' : 'badge--public'}`}>
              {discussion.mode === 'ANONYMOUS' ? 'Anonim' : 'Publik'}
            </span>
          )}
          {variant === 'trending' && discussion._voteCount > 0 && (
            <span className="ud-disc-card__hot-badge">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6.5 0C6.5 3 4 4 4 6.5c0 1.4 1.1 2.5 2.5 2.5S9.5 7.9 9.5 6.5C9.5 3.5 6.5 3 6.5 0z"/>
              </svg>
              Hot
            </span>
          )}
        </div>

        <Link href={`/user/discussions/${discussion.id}`} className="ud-disc-card__title">
          {discussion.title}
        </Link>

        <p className="ud-disc-card__preview line-clamp-2">{discussion.content}</p>

        <div className="ud-disc-card__footer">
          <button
            className="ud-vote-btn"
            onClick={() => onVote?.(discussion.id, 1)}
            title="Helpful"
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {discussion._voteCount > 0 ? discussion._voteCount : 'Helpful'}
          </button>
          <Link href={`/user/discussions/${discussion.id}#answers`} className="ud-vote-btn">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h10v7H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M5 11l2 2 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {discussion._answerCount ?? 0} Jawaban
          </Link>
          <Link href={`/user/discussions/${discussion.id}`} className="ud-disc-card__readmore">
            Baca →
          </Link>
        </div>
      </div>
    </div>
  )
}
