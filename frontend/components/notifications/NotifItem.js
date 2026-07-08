import { useState } from 'react'

const TYPE_META = {
  VOTE: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    ),
    color: '#4ade80',
    label: 'Upvote',
    tab: 'VOTE',
  },
  DOWNVOTE: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M19 12l-7 7-7-7"/>
      </svg>
    ),
    color: '#f87171',
    label: 'Downvote',
    tab: 'VOTE',
  },
  ANSWER: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    color: '#60a5fa',
    label: 'Komentar',
    tab: 'ANSWER',
  },
  MENTION: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94"/>
      </svg>
    ),
    color: '#f59e0b',
    label: 'Mention',
    tab: 'ANSWER',
  },
  REPORT: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
      </svg>
    ),
    color: '#f87171',
    label: 'Laporan',
    tab: 'OTHER',
  },
  SYSTEM: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    color: '#94a3b8',
    label: 'Sistem',
    tab: 'OTHER',
  },
}

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return 'baru saja'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`
  if (diff < 604800) return `${Math.floor(diff / 86400)}h lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function NotifItem({ item, onRead }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.SYSTEM
  const [hov, setHov] = useState(false)

  const handleClick = () => {
    if (!item.isRead) onRead(item.id)
    if (item.discussionId) {
      window.location.href = `/user/discussions/${item.discussionId}`
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        padding: '1rem 1.125rem',
        background: !item.isRead
          ? 'rgba(20,23,25,0.9)'
          : hov ? 'rgba(14,17,20,0.6)' : 'rgba(14,17,20,0.4)',
        border: `1px solid ${!item.isRead
          ? 'rgba(255,255,255,0.1)'
          : hov ? 'var(--border-default)' : 'var(--border-subtle)'}`,
        borderRadius: '12px',
        cursor: item.discussionId ? 'pointer' : 'default',
        transition: 'all 180ms ease',
        position: 'relative',
      }}
    >
      {!item.isRead && (
        <span style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: meta.color,
          boxShadow: `0 0 6px ${meta.color}`,
        }} />
      )}

      <span style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: `${meta.color}12`,
        border: `1px solid ${meta.color}25`,
        color: meta.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {meta.icon}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: meta.color,
          }}>
            {meta.label}
          </span>
        </div>
        <p style={{
          fontSize: '0.875rem',
          color: !item.isRead ? 'var(--text-primary)' : 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '0.35rem',
          fontWeight: !item.isRead ? 500 : 400,
        }}>
          {item.message ?? item.content ?? 'Notifikasi baru'}
        </p>
        {item.discussionTitle && (
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            📄 {item.discussionTitle}
          </p>
        )}
      </div>

      <span style={{
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        paddingRight: !item.isRead ? '1rem' : '0',
      }}>
        {timeAgo(item.createdAt)}
      </span>
    </div>
  )
}



