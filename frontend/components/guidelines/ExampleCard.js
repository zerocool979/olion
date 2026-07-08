export function ExampleCard({ example }) {
  return (
    <div
      className="legal-example-card"
      style={{ background: example.bg, borderColor: example.border }}
    >
      <div className="legal-example-card__label" style={{ color: example.color, borderColor: `${example.color}30`, background: `${example.color}10` }}>
        {example.label}
      </div>
      <div className="legal-example-card__title">{example.title}</div>
      <blockquote className="legal-example-card__quote">{example.body}</blockquote>
      <div className="legal-example-card__why" style={{ color: example.color }}>
        <strong>Mengapa:</strong> {example.why}
      </div>
    </div>
  )
}



