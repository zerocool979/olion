import api from '../lib/api'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Link from 'next/link'

// ── Vote button ───────────────────────────────────────────────────────────────
function VoteButton({ onClick, active, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '7px',
        fontSize: '0.78rem',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        background: hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        color: hovered ? '#e2e8f0' : '#596570',
        cursor: 'pointer',
        transition: 'all 160ms ease',
      }}
    >
      {children}
    </button>
  )
}

// ── Report button ─────────────────────────────────────────────────────────────
function ReportButton({ discussionId }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/report?targetId=${discussionId}`}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '7px',
          fontSize: '0.78rem',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          background: hovered ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.05)',
          border: `1px solid ${hovered ? 'rgba(239,68,68,0.28)' : 'rgba(239,68,68,0.12)'}`,
          color: hovered ? '#fca5a5' : '#7a4040',
          cursor: 'pointer',
          transition: 'all 160ms ease',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h8l-1.5 4L10 10H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <line x1="2" y1="10" x2="2" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        Report
      </button>
    </Link>
  )
}

// ── Discussion card ───────────────────────────────────────────────────────────
function DiscussionCard({ discussion, onVote, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`animate-fade-up stagger-${Math.min(index + 1, 5)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(20,23,25,0.95)' : 'rgba(14,17,20,0.8)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        transition: 'all 220ms cubic-bezier(0.34,1.2,0.64,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
          : '0 1px 4px rgba(0,0,0,0.2)',
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.6rem' }}>
        <Link href={`/discussion/${discussion.id}`} style={{ textDecoration: 'none', flex: 1 }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              color: hovered ? '#f8fafc' : '#e2e8f0',
              lineHeight: 1.35,
              transition: 'color 180ms ease',
              cursor: 'pointer',
            }}
          >
            {discussion.title}
          </h2>
        </Link>
        {discussion.mode && (
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.62rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '0.18rem 0.5rem',
              borderRadius: '5px',
              background: discussion.mode === 'ANONYMOUS'
                ? 'rgba(148,163,184,0.08)' : 'rgba(74,222,128,0.07)',
              border: `1px solid ${discussion.mode === 'ANONYMOUS'
                ? 'rgba(148,163,184,0.18)' : 'rgba(74,222,128,0.18)'}`,
              color: discussion.mode === 'ANONYMOUS' ? '#94a3b8' : '#4ade80',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {discussion.mode === 'ANONYMOUS' ? 'Anonim' : 'Publik'}
          </span>
        )}
      </div>

      {/* Content preview */}
      <p
        className="line-clamp-3"
        style={{ fontSize: '0.875rem', color: '#596570', lineHeight: 1.65, marginBottom: '1rem' }}
      >
        {discussion.content}
      </p>

      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#1e293b,#334155)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: '#94a3b8',
            flexShrink: 0,
          }}
        >
          {discussion.user?.profile?.username?.[0]?.toUpperCase() || '?'}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#718496' }}>
          {discussion.user?.profile?.username || 'Anonim'}
        </span>
        {discussion.user?.isVerifiedExpert && (
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.6rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#4ade80',
            }}
          >
            ✦ Expert
          </span>
        )}
        {discussion.category?.name && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              color: '#596570',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '5px',
              padding: '0.15rem 0.5rem',
            }}
          >
            {discussion.category.name}
          </span>
        )}
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '0.875rem' }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <VoteButton onClick={() => onVote(discussion.id, 1)}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Helpful
        </VoteButton>
        <VoteButton onClick={() => onVote(discussion.id, -1)}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 12V2M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Not Helpful
        </VoteButton>
        <div style={{ marginLeft: 'auto' }}>
          <ReportButton discussionId={discussion.id} />
        </div>
      </div>
    </div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: 'rgba(14,17,20,0.8)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div className="skeleton" style={{ height: '18px', width: '60%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '85%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '70%', marginBottom: '1rem' }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '28px', width: '80px', borderRadius: '7px' }} />
        <div className="skeleton" style={{ height: '28px', width: '96px', borderRadius: '7px' }} />
        <div className="skeleton" style={{ height: '28px', width: '64px', borderRadius: '7px', marginLeft: 'auto' }} />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await api.get('/discussions')
        // FIX: res.data.data bukan res.data
        const data = res.data?.data ?? res.data ?? []
        setDiscussions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching discussions:', err)
        setDiscussions([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDiscussions()
    } else {
      setLoading(false)
    }
  }, [user])

  const vote = async (id, value) => {
    try {
      await api.post('/votes', { discussionId: id, value })
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,41,59,0.35) 0%, transparent 70%), #080a0c',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Page header */}
        <div className="animate-fade-up" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {/* breadcrumb dot */}
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
                boxShadow: '0 0 8px rgba(148,163,184,0.4)',
              }}
            />
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#596570',
              }}
            >
              Dashboard
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  letterSpacing: '-0.04em',
                  color: '#f1f3f5',
                  lineHeight: 1.1,
                  marginBottom: '0.4rem',
                }}
              >
                Selamat datang
                {user?.profile?.username && (
                  <span style={{ color: '#596570' }}>, {user.profile.username}</span>
                )}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#596570' }}>
                Jelajahi dan ikuti diskusi komunitas
              </p>
            </div>

            <Link
              href="/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#f1f3f5',
                color: '#080a0c',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '-0.01em',
                padding: '0.55rem 1.1rem',
                borderRadius: '9px',
                textDecoration: 'none',
                border: 'none',
                transition: 'all 180ms ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 20px rgba(241,243,245,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f1f3f5'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Buat Diskusi
            </Link>
          </div>
        </div>

        {/* Section header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '-0.01em',
              color: '#a8b2bc',
            }}
          >
            Semua Diskusi
            {!loading && (
              <span style={{ marginLeft: '0.5rem', color: '#3d4851', fontWeight: 400 }}>
                · {discussions.length}
              </span>
            )}
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && discussions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              background: 'rgba(14,17,20,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M3 11C3 6.58 6.58 3 11 3s8 3.58 8 8c0 1.6-.48 3.1-1.3 4.36L19 19l-3.64-1.3A7.95 7.95 0 0111 19C6.58 19 3 15.42 3 11z" stroke="#596570" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ color: '#596570', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Belum ada diskusi.
            </p>
            <Link
              href="/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                color: '#a8b2bc',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: '0.85rem',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
                transition: 'all 180ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#f1f3f5' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#a8b2bc' }}
            >
              Buat diskusi pertama
            </Link>
          </div>
        )}

        {/* Discussion list */}
        {!loading && discussions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {discussions.map((discussion, index) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onVote={vote}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
