import Link from 'next/link'
import { useState } from 'react'

const USERS = [
  { rank: 1, username: 'Anon#7821', reputation: 4820, discussions: 87, votes: 1240, badge: 'expert', streak: 14 },
  { rank: 2, username: 'Anon#3344', reputation: 3910, discussions: 64, votes: 980, badge: 'expert', streak: 9 },
  { rank: 3, username: 'Anon#9102', reputation: 3450, discussions: 52, votes: 870, badge: 'expert', streak: 7 },
  { rank: 4, username: 'Anon#5567', reputation: 2890, discussions: 48, votes: 720, badge: null, streak: 5 },
  { rank: 5, username: 'Anon#2278', reputation: 2410, discussions: 41, votes: 610, badge: null, streak: 4 },
  { rank: 6, username: 'Anon#6634', reputation: 1980, discussions: 36, votes: 530, badge: null, streak: 3 },
  { rank: 7, username: 'Anon#4421', reputation: 1740, discussions: 31, votes: 460, badge: null, streak: 2 },
  { rank: 8, username: 'Anon#8899', reputation: 1520, discussions: 27, votes: 390, badge: null, streak: 2 },
  { rank: 9, username: 'Anon#1123', reputation: 1300, discussions: 23, votes: 340, badge: null, streak: 1 },
  { rank: 10, username: 'Anon#7756', reputation: 1100, discussions: 19, votes: 290, badge: null, streak: 1 },
]

const PERIODS = ['Minggu Ini', 'Bulan Ini', 'Sepanjang Waktu']

export default function Leaderboard() {
  const [period, setPeriod] = useState('Sepanjang Waktu')

  const top3 = USERS.slice(0, 3)
  const rest = USERS.slice(3)

  const medalColor = (rank) => {
    if (rank === 1) return { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', text: '#facc15' }
    if (rank === 2) return { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)', text: '#94a3b8' }
    return { bg: 'rgba(180,120,80,0.1)', border: 'rgba(180,120,80,0.25)', text: '#c97d4e' }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
              Leaderboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Kontributor terbaik komunitas OLION</p>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '0.35rem 0.75rem', borderRadius: '7px', border: 'none', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all 160ms ease', background: period === p ? 'var(--bg-overlay)' : 'transparent', color: period === p ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[top3[1], top3[0], top3[2]].map((u, i) => {
            if (!u) return null
            const actual = [2, 1, 3][i]
            const m = medalColor(actual)
            return (
              <Link key={u.username} href={`/u/${u.username}`} style={{ textDecoration: 'none', order: i === 1 ? -1 : 0 }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem', background: m.bg, borderColor: m.border, position: 'relative', cursor: 'pointer', transform: actual === 1 ? 'scale(1.03)' : 'scale(1)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                    {actual === 1 ? '🥇' : actual === 2 ? '🥈' : '🥉'}
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#475569,#94a3b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '0 auto 0.75rem', flexShrink: 0 }}>
                    {u.username.slice(-2)}
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{u.username}</p>
                  {u.badge === 'expert' && <span className="badge badge-expert" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>Expert</span>}
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: m.text, fontFamily: "'Syne', sans-serif" }}>{u.reputation.toLocaleString()}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>reputasi</p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Rest of Rankings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rest.map(u => (
            <Link key={u.username} href={`/u/${u.username}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.875rem 1.25rem' }}>
                <div style={{ minWidth: '32px', textAlign: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  #{u.rank}
                </div>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#334155,#64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', flexShrink: 0 }}>
                  {u.username.slice(-2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.username}</p>
                    {u.badge === 'expert' && <span className="badge badge-expert" style={{ fontSize: '0.6rem' }}>Expert</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.discussions}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>diskusi</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.votes.toLocaleString()}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>votes</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: "'Syne', sans-serif" }}>{u.reputation.toLocaleString()}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>rep</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
