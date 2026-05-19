import { Avatar } from './Avatar'
import { fullDate } from '../../lib/timeAgo'
import { timeAgo } from '../../lib/timeAgo'

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
