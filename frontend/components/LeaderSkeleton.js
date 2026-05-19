export default function LeaderSkeleton() {
  return (
    <div className="leader-skeleton card">
      <div className="skeleton leader-skeleton__rank" />
      <div className="skeleton leader-skeleton__avatar" />
      <div className="leader-skeleton__info">
        <div className="skeleton leader-skeleton__info-name" />
        <div className="skeleton leader-skeleton__info-meta" />
      </div>
      <div className="skeleton leader-skeleton__rep" />
    </div>
  );
}
