export function BadgePill({ label, color, bg, border }) {
  return (
    <span
      className="badge-pill"
      style={{ color, background: bg, borderColor: border }}
    >
      {label}
    </span>
  )
}
