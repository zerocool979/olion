export function StatBox({ value, label }) {
  return (
    <div style={{
      flex: 1,
      textAlign: 'center',
      padding: '1rem 0.75rem',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
    }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: '1.4rem',
        letterSpacing: '-0.04em',
        color: 'var(--text-primary)',
        marginBottom: '0.2rem',
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</p>
    </div>
  )
}



