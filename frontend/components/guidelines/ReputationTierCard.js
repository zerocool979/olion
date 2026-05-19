export function ReputationTierCard({ tier, type }) {
  return (
    <div className="legal-rep-card" style={{ '--rep-color': tier.color }}>
      <div className="legal-rep-card__header">
        <span className="legal-rep-card__icon" style={{ color: tier.color }}>{tier.icon}</span>
        <div>
          <div className="legal-rep-card__name" style={{ color: tier.color }}>{tier.name}</div>
          <div className="legal-rep-card__range">{tier.rep} rep</div>
        </div>
      </div>
      <ul className="legal-rep-card__perks">
        {tier.perks.map((p) => (
          <li key={p} className="legal-rep-card__perk">
            <span style={{ color: tier.color, fontSize: '0.6rem' }}>◆</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}
