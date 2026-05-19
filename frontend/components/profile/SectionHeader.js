export function SectionHeader({ title, count }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600,
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        letterSpacing: '-0.01em',
      }}>
        {title}
        {count !== undefined && (
          <span style={{ marginLeft: '0.4rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            · {count}
          </span>
        )}
      </span>
    </div>
  )
}
