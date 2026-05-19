export function EthicsCard({ icon, title, desc, color, index }) {
  return (
    <div
      className={`guideline-card animate-fade-up stagger-${Math.min(index + 1, 5)}`}
      style={{ '--guide-color': color }}
    >
      <span className="guideline-card__icon" style={{ color, background: `${color}0f`, borderColor: `${color}22` }}>
        {icon}
      </span>
      <h3 className="guideline-card__title" style={{ color }}>{title}</h3>
      <p className="guideline-card__desc">{desc}</p>
    </div>
  )
}
