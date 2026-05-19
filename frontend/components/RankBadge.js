export default function RankBadge({ rank }) {
  const top = rank <= 3;
  return (
    <div className={`rank-badge ${top ? 'rank-badge--top' : 'rank-badge--normal'}`}>
      {rank}
    </div>
  );
}
