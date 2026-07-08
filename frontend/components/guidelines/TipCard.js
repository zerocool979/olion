export function TipCard({ section }) {
  return (
    <div className="legal-tip-card" style={{ '--tip-color': section.color }}>
      <div className="legal-tip-card__header">
        <span className="legal-tip-card__icon">{section.icon}</span>
        <h3 className="legal-tip-card__title" style={{ color: section.color }}>{section.title}</h3>
      </div>
      <ul className="legal-tip-card__list">
        {section.tips.map((tip, idx) => (
          <li key={idx} className="legal-tip-card__item">
            <span style={{ color: section.color, marginRight: '0.4rem' }}>•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}



