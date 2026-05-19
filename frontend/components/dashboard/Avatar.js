export function Avatar({ username, size = 32, src }) {
  const initial = username?.[0]?.toUpperCase() ?? '?'
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className="avatar"
        style={{ width: size, height: size, objectFit: 'cover' }}
      />
    )
  }
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: `${size * 0.38}px` }}
    >
      {initial}
    </span>
  )
}
