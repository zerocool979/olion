import Avatar from '../dashboard/Avatar'
import { fullDate } from '../../lib/timeAgo'
import { timeAgo } from '../../lib/timeAgo'

// Sama seperti label yang sudah diperbaiki di DiscussionContent.js — `mode`
// bukan soal anonim/publik, tapi jenis/tujuan diskusi. Badge ini sebelumnya
// menampilkan "Anonim"/"Publik" yang keliru total.
const MODE_LABELS = {
  INFORMATIF: 'Informatif',
  KLARIFIKATIF: 'Klarifikasi',
  EKSPLORATIF: 'Eksploratif',
  EVALUATIF: 'Evaluatif',
  ARGUMENTATIF: 'Argumentatif',
}

export function DiscussionMeta({ discussion }) {
  const username = discussion.user?.profile?.username ?? 'Anonim'
  const avatarUrl = discussion.user?.profile?.avatarUrl ?? null
  const avatarBorder = discussion.user?.profile?.avatarBorder ?? null
  const isExpert = discussion.user?.isVerifiedExpert
  const mode     = discussion.mode
  const catName  = discussion.category?.name

  return (
    <div className="dd-meta" role="contentinfo">
      <Avatar username={username} src={avatarUrl} border={avatarBorder} size={36} />
      <div className="dd-meta__body">
        <div className="dd-meta__row">
          <span className="dd-meta__username">{username}</span>
          {isExpert && <span className="badge badge--expert">✦ Expert</span>}
          {mode && (
            <span className="badge badge--public">
              {MODE_LABELS[mode] ?? mode}
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



