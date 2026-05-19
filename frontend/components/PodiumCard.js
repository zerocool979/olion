import Link from 'next/link';
import Avatar from './Avatar';

function getMedalClass(rank) {
  if (rank === 1) return 'podium-card--gold';
  if (rank === 2) return 'podium-card--silver';
  return 'podium-card--bronze';
}
function getMedalEmoji(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  return '🥉';
}
function getMedalRepColor(rank) {
  if (rank === 1) return '#facc15';
  if (rank === 2) return '#94a3b8';
  return '#c97d4e';
}

export default function PodiumCard({ u }) {
  const medalClass = getMedalClass(u.rank);
  const emoji = getMedalEmoji(u.rank);
  const repColor = getMedalRepColor(u.rank);

  return (
    <Link href={`/u/${u.username}`} style={{ textDecoration: 'none' }}>
      <div className={`podium-card card ${medalClass}`}>
        <div className="podium-emoji">{emoji}</div>
        <Avatar username={u.username} size={44} />
        <p className="podium-username">{u.username}</p>
        {u.isVerifiedExpert && (
          <span className="badge badge-expert podium-expert">✦ Expert</span>
        )}
        <p className="podium-reputation" style={{ color: repColor }}>
          {u.reputation.toLocaleString()}
        </p>
        <p className="podium-reputation-label">reputasi</p>
      </div>
    </Link>
  );
}
