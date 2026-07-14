import Link from 'next/link';
import Avatar from './dashboard/Avatar';

export default function LeaderRow({ u }) {
  return (
    <Link href={`/u/${u.username}`} style={{ textDecoration: 'none' }}>
      <div className="leader-row card">
        <div className="leader-row__rank">#{u.rank}</div>
        <Avatar username={u.username} src={u.avatarUrl} border={u.avatarBorder} size={34} />
        <div className="leader-row__info">
          <div className="leader-row__name-row">
            <p className="leader-row__name">{u.username}</p>
            {u.isVerifiedExpert && (
              <span className="badge badge-expert leader-row__expert">✦ Expert</span>
            )}
          </div>
          <p className="leader-row__meta">
            {u.discussions} diskusi · {u.comments} komentar
          </p>
        </div>
        <div className="leader-row__stats">
          <div className="leader-row__upvotes">
            <p className="leader-row__upvotes-value">
              {u.upvotesReceived?.toLocaleString() ?? 0}
            </p>
            <p className="leader-row__upvotes-label">upvotes</p>
          </div>
          <div className="leader-row__rep">
            <p className="leader-row__rep-value">
              {u.reputation.toLocaleString()}
            </p>
            <p className="leader-row__rep-label">rep</p>
          </div>
        </div>
      </div>
    </Link>
  );
}



