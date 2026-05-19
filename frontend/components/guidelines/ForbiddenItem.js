export function ForbiddenItem({ icon, label }) {
  return (
    <div className="legal-forbidden-item">
      <span className="legal-forbidden-item__icon">{icon}</span>
      <span className="legal-forbidden-item__label">{label}</span>
    </div>
  )
}
