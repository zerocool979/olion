export function AchievementPanel({ user, reputation }) {
  const tiers = [
    { label: 'Pemula',       min: 0,   max: 49,   color: '#596570', icon: '◎' },
    { label: 'Kontributor',  min: 50,  max: 199,  color: '#60a5fa', icon: '◈' },
    { label: 'Aktif',        min: 200, max: 749,  color: '#a78bfa', icon: '◆' },
    { label: 'Ahli',         min: 750, max: 1499, color: '#f59e0b', icon: '✦' },
    { label: 'Master',       min: 1500, max: Infinity, color: '#4ade80', icon: '★' },
  ]

  const current = tiers.findIndex(t => reputation >= t.min && reputation <= t.max)
  const tier = tiers[current] ?? tiers[0]
  const next = tiers[current + 1]
  const progress = next
    ? Math.round(((reputation - tier.min) / (next.min - tier.min)) * 100)
    : 100

  return (
    <div className="ud-achievement">
      <div className="ud-achievement__header">
        <span className="ud-achievement__icon" style={{ color: tier.color }}>{tier.icon}</span>
        <div>
          <div className="ud-achievement__tier" style={{ color: tier.color }}>{tier.label}</div>
          <div className="ud-achievement__rep">{reputation.toLocaleString()} rep</div>
        </div>
      </div>

      {next && (
        <div className="ud-achievement__progress-wrap">
          <div className="ud-achievement__progress-track">
            <div
              className="ud-achievement__progress-bar"
              style={{ width: `${progress}%`, background: tier.color }}
            />
          </div>
          <div className="ud-achievement__progress-label">
            <span>{progress}%</span>
            <span>{next.label} — {next.min.toLocaleString()} rep</span>
          </div>
        </div>
      )}

      <div className="ud-achievement__badges">
        {tiers.slice(0, current + 1).map(t => (
          <div key={t.label} className="ud-achievement__badge" title={t.label} style={{ color: t.color, borderColor: `${t.color}30` }}>
            {t.icon}
          </div>
        ))}
        {tiers.slice(current + 1).map(t => (
          <div key={t.label} className="ud-achievement__badge ud-achievement__badge--locked" title={`${t.label} (terkunci)`}>
            {t.icon}
          </div>
        ))}
      </div>
    </div>
  )
}
