export function QualityChecklist({ items }) {
  return (
    <div className="legal-checklist">
      {items.map(([title, desc]) => (
        <div key={title} className="legal-checklist__item">
          <span className="legal-checklist__check">✓</span>
          <div>
            <strong className="legal-checklist__title">{title}</strong>
            <span className="legal-checklist__desc"> — {desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
