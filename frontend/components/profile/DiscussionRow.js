import { useState } from 'react'
import Link from 'next/link'

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}h lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function DiscussionRow({ d }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={`/user/discussions/${d.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: '0.875rem 1rem',
          background: hov ? 'rgba(20,23,25,0.95)' : 'rgba(14,17,20,0.5)',
          border: `1px solid ${hov ? 'var(--border-default)' : 'var(--border-subtle)'}`,
          borderRadius: '10px',
          transition: 'all 200ms ease',
          transform: hov ? 'translateX(4px)' : 'translateX(0)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '0.875rem',
            color: hov ? '#f8fafc' : 'var(--text-primary)',
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
            transition: 'color 160ms ease',
            flex: 1,
          }}>
            {d.title}
          </p>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '0.6rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            background: 'rgba(148,163,184,0.08)',
            border: '1px solid rgba(148,163,184,0.15)',
            color: '#94a3b8',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {d.category?.name ?? 'Umum'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ↑ {d._count?.votes ?? 0}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            💬 {d._count?.comments ?? 0}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {timeAgo(d.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}



