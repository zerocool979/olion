export function Avatar({ username, size = 32 }) {
  const initial = username?.[0]?.toUpperCase() ?? '?'
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: `${Math.round(size * 0.38)}px` }}
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}



