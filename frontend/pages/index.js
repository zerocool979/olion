import api from '../lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ── tiny helper ──────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`
  return `${Math.floor(diff / 86400)}h lalu`
}

// ── sub-components ────────────────────────────────────────────────────────────
function StatPill({ icon, value, label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.78rem',
        color: '#596570',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {icon}
      <span style={{ color: '#a8b2bc', fontWeight: 500 }}>{value ?? 0}</span>
      <span>{label}</span>
    </span>
  )
}

function ModeBadge({ mode }) {
  const label = mode === 'ANONYMOUS' ? 'Anonim' : mode === 'IDENTIFIED' ? 'Publik' : mode
  const style = {
    ANONYMOUS: { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.18)', color: '#94a3b8' },
    IDENTIFIED: { bg: 'rgba(74,222,128,0.07)', border: 'rgba(74,222,128,0.18)', color: '#4ade80' },
  }[mode] || { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#94a3b8' }

  return (
    <span
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 600,
        fontSize: '0.65rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        padding: '0.18rem 0.5rem',
        borderRadius: '5px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function DiscussionCard({ discussion, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/discussion/${discussion.id}`} style={{ textDecoration: 'none', display: 'block' }}>
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
          cursor: 'pointer',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.65rem' }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              color: hovered ? '#f8fafc' : '#e2e8f0',
              lineHeight: 1.35,
              transition: 'color 180ms ease',
              flex: 1,
            }}
          >
            {discussion.title}
          </h2>
          <ModeBadge mode={discussion.mode} />
        </div>

        {/* Body */}
        <p
          className="line-clamp-2"
          style={{ fontSize: '0.875rem', color: '#596570', lineHeight: 1.65, marginBottom: '1rem' }}
        >
          {discussion.content}
        </p>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#1e293b,#334155)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#94a3b8',
                flexShrink: 0,
              }}
            >
              {discussion.user?.profile?.username?.[0]?.toUpperCase() || '?'}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#718496', fontWeight: 400 }}>
              {discussion.user?.profile?.username || 'Anonim'}
            </span>
            {discussion.user?.isVerifiedExpert && (
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.62rem',
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
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <StatPill
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7C1 3.68 3.68 1 7 1s6 2.68 6 6c0 1.2-.36 2.32-.96 3.26L13 13l-2.74-.96A5.95 5.95 0 017 13c-3.32 0-6-2.68-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              }
              value={discussion._count?.comments}
              label="komentar"
            />
            <StatPill
              icon={
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              value={discussion._count?.votes}
              label="vote"
            />
            {discussion.category?.name && (
              <span
                style={{
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
        </div>
      </div>
    </Link>
  )
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────
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
      <div className="skeleton" style={{ height: '18px', width: '65%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ height: '12px', width: '30%' }} />
        <div className="skeleton" style={{ height: '12px', width: '20%' }} />
      </div>
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await api.get('/discussions')
        setDiscussions(res.data.data)
      } catch (err) {
        setError('Gagal memuat diskusi')
        console.error('Error fetching discussions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,41,59,0.35) 0%, transparent 70%), #080a0c',
      }}
    >
      {/* Subtle grid background */}
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── HERO ── */}
        <section
          className="animate-fade-up"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '5rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          {/* pill */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(148,163,184,0.07)',
              border: '1px solid rgba(148,163,184,0.14)',
              borderRadius: '99px',
              padding: '0.3rem 0.85rem',
              fontSize: '0.78rem',
              color: '#94a3b8',
              marginBottom: '1.75rem',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade80',
                display: 'inline-block',
              }}
            />
            Platform Diskusi Anonim
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: '#f1f3f5',
              marginBottom: '1.25rem',
            }}
          >
            Berbagi Ide,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #cbd5e1, #64748b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tanpa Identitas
            </span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#596570',
              maxWidth: '480px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.7,
            }}
          >
            Forum diskusi anonim untuk berbagi pengetahuan, bertanya, dan bertukar gagasan secara bebas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/create" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}>
              Buat Diskusi
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/register" className="btn-outline" style={{ fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}>
              Daftar Gratis
            </Link>
          </div>
        </section>

        {/* ── Separator ── */}
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        />

        {/* ── Discussions ── */}
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
          {/* Section header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.02em',
                  color: '#e2e8f0',
                  marginBottom: '0.2rem',
                }}
              >
                Diskusi Terbaru
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#596570' }}>
                {loading ? '…' : `${discussions.length} diskusi`}
              </p>
            </div>

            <Link
              href="/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                color: '#596570',
                textDecoration: 'none',
                transition: 'color 160ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#596570')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Baru
            </Link>
          </div>

          {/* Error state */}
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                color: '#fca5a5',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && discussions.length === 0 && !error && (
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11C3 6.58 6.58 3 11 3s8 3.58 8 8c0 1.6-.48 3.1-1.3 4.36L19 19l-3.64-1.3A7.95 7.95 0 0111 19C6.58 19 3 15.42 3 11z" stroke="#596570" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ color: '#596570', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Belum ada diskusi. Jadilah yang pertama!
              </p>
              <Link href="/create" className="btn-outline" style={{ fontSize: '0.85rem' }}>
                Buat Diskusi Pertama
              </Link>
            </div>
          )}

          {/* Discussion list */}
          {!loading && discussions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {discussions.map((discussion, index) => (
                <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
