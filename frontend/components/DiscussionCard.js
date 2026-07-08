import { useState } from 'react';
import ModeBadge from './ModeBadge';
import StatPill from './StatPill';
import Avatar from './Avatar';
import { useContext } from 'react'
import DiscussionLink from './DiscussionLink'

export default function DiscussionCard({ discussion, index }) {
  const [hovered, setHovered] = useState(false);

  const catLabel = discussion.category?.parent
    ? `${discussion.category.parent.name} › ${discussion.category.name}`
    : discussion.category?.name ?? '';

  return (
    <DiscussionLink id={discussion.id} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        className={`discussion-card animate-fade-up stagger-${Math.min(index + 1, 5)} ${
          hovered ? 'discussion-card--hovered' : ''
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top row */}
        <div className="discussion-card__header">
          <h2 className={`discussion-card__title ${hovered ? 'discussion-card__title--hovered' : ''}`}>
            {discussion.title}
          </h2>
          <ModeBadge mode={discussion.mode} />
        </div>

        {/* Body */}
        <p className="discussion-card__excerpt line-clamp-2">{discussion.content}</p>

        {/* Footer */}
        <div className="discussion-card__footer">
          {/* Author */}
          <div className="discussion-card__author">
            <Avatar username={discussion.user?.profile?.username} size={24} />
            <span className="discussion-card__username">
              {discussion.user?.profile?.username || 'Anonim'}
            </span>
            {discussion.user?.isVerifiedExpert && (
              <span className="badge badge-expert">✦ Expert</span>
            )}
          </div>

          {/* Stats */}
          <div className="discussion-card__stats">
            <StatPill
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              value={discussion._count?.votes ?? 0}
              label="vote"
            />
            <StatPill
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7C1 3.68 3.68 1 7 1s6 2.68 6 6c0 1.2-.36 2.32-.96 3.26L13 13l-2.74-.96A5.95 5.95 0 017 13c-3.32 0-6-2.68-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              }
              value={discussion._count?.comments ?? 0}
              label="komentar"
            />
            {catLabel && (
              <span className="badge badge-category">{catLabel}</span>
            )}
          </div>
        </div>
      </div>
    </DiscussionLink>
  );
}



