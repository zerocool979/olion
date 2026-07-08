export default function Avatar({ username, size = 44 }) {
  const initials = username ? username.slice(0, 2).toUpperCase() : '??';
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}



