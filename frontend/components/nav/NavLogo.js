import Link from 'next/link'

export function NavLogo() {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '-0.04em',
          color: '#f1f3f5',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
            boxShadow: '0 0 10px rgba(148,163,184,0.5)',
            flexShrink: 0,
          }}
        />
        OLION
      </span>
    </Link>
  )
}
