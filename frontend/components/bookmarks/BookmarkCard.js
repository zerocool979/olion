import { useState, useRef } from 'react'
import Link from 'next/link'
import Avatar from '../dashboard/Avatar'
import { timeAgo } from '../../lib/timeAgo'

const MODE_LABELS = {
  INFORMATIF: 'Informatif',
  KLARIFIKATIF: 'Klarifikasi',
  EKSPLORATIF: 'Eksploratif',
  EVALUATIF: 'Evaluatif',
  ARGUMENTATIF: 'Argumentatif',
}

export function BookmarkCard({ item, onRemove }) {
  const d = item.discussion ?? item
  const [hov, setHov] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [undoVisible, setUndoVisible] = useState(false)
  const undoTimer = useRef(null)

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setRemoving(true)
    setUndoVisible(true)
    onRemove(item.id ?? d.id, 'hide')
    undoTimer.current = setTimeout(() => {
      onRemove(item.id ?? d.id, 'confirm')
      setUndoVisible(false)
    }, 4000)
  }

  const handleUndo = (e) => {
    e.preventDefault()
    e.stopPropagation()
    clearTimeout(undoTimer.current)
    onRemove(item.id ?? d.id, 'undo')
    setRemoving(false)
    setUndoVisible(false)
  }

  const username = d.user?.profile?.username ?? 'Anonim'
  const avatarUrl = d.user?.profile?.avatarUrl ?? null
  const avatarBorder = d.user?.profile?.avatarBorder ?? null
  const catLabel = d.category?.parent
    ? `${d.category.parent.name} › ${d.category.name}`
    : d.category?.name ?? ''
  // FIX: sama seperti bug yang sudah diperbaiki di DiscussionContent.js &
  // DiscussionMeta.js — `mode` bukan soal anonim/publik ('IDENTIFIED' bukan
  // nilai enum yang valid sama sekali), tapi jenis/tujuan diskusi.
  const modeLabel = MODE_LABELS[d.mode] ?? null

  return (
    <Link href={`/user/discussions/${d.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? 'rgba(20,23,25,0.95)' : 'rgba(14,17,20,0.8)',
          border: `1px solid ${hov ? 'var(--border-default)' : 'var(--border-subtle)'}`,
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          transition: 'all 220ms cubic-bezier(0.34,1.2,0.64,1)',
          transform: hov ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hov ? '0 8px 36px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <button
          onClick={handleRemove}
          title="Hapus bookmark"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            padding: '0.25rem',
            cursor: 'pointer',
            color: hov ? 'var(--text-muted)' : 'transparent',
            borderRadius: '5px',
            transition: 'all 160ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = hov ? 'var(--text-muted)' : 'transparent'; e.currentTarget.style.background = 'transparent' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            <line x1="9" y1="10" x2="15" y2="16"/><line x1="15" y1="10" x2="9" y2="16"/>
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', paddingRight: '1.5rem' }}>
          {catLabel && (
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.62rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(148,163,184,0.08)',
              border: '1px solid rgba(148,163,184,0.15)',
              color: '#94a3b8',
            }}>
              {catLabel}
            </span>
          )}
          {modeLabel && (
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.6rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              background: 'rgba(74,222,128,0.07)',
              border: '1px solid rgba(74,222,128,0.15)',
              color: '#4ade80',
            }}>
              {modeLabel}
            </span>
          )}
        </div>

        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          fontSize: '0.975rem',
          letterSpacing: '-0.02em',
          color: hov ? '#f8fafc' : 'var(--text-primary)',
          lineHeight: 1.35,
          marginBottom: '0.5rem',
          transition: 'color 160ms ease',
          paddingRight: '1.5rem',
        }}>
          {d.title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.65,
          marginBottom: '0.875rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}>
          {d.content}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Avatar username={username} src={avatarUrl} border={avatarBorder} size={18} />
            <span style={{ fontSize: '0.78rem', color: '#718496' }}>{username}</span>
            {d.user?.isVerifiedExpert && (
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '0.58rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#4ade80',
              }}>
                ✦ Expert
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ↑ {d._count?.votes ?? 0}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              💬 {d._count?.comments ?? 0}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#3d4851' }}>
              Disimpan {timeAgo(item.savedAt ?? item.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}



