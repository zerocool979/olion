export function StatPill({ icon, value, label, accent }) {
  return (
    <div className="ud-stat-pill" style={accent ? { '--pill-accent': accent } : {}}>
      {icon && <span className="ud-stat-pill__icon">{icon}</span>}
      <div>
        <div className="ud-stat-pill__value">{value ?? '—'}</div>
        <div className="ud-stat-pill__label">{label}</div>
      </div>
    </div>
  )
}
