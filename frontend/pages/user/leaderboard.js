/**
 * pages/user/leaderboard.jsx  — Papan Peringkat
 */
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'
import { Avatar, StatPill, SkeletonCard, EmptyState, AchievementPanel, colors } from '../../components/dashboard'
import UserLayout from './_layout'

const REPUTATION_TIERS = [
  { id: 'pemula',    icon: '🌱', label: 'Pemula',    threshold: 0 },
  { id: 'aktif',     icon: '✍️', label: 'Aktif',     threshold: 100 },
  { id: 'tepercaya', icon: '🔥', label: 'Tepercaya', threshold: 500 },
  { id: 'ahli',      icon: '🎓', label: 'Ahli',      threshold: 2000 },
]

const PERIODS = [
  { val: 'all',   label: 'Semua Waktu' },
  { val: 'month', label: 'Bulan Ini' },
  { val: 'week',  label: 'Minggu Ini' },
]

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useContext(AuthContext)

  const [period,  setPeriod]  = useState('all')
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [myRank,  setMyRank]  = useState(null)

  const username   = user?.profile?.username   ?? user?.username ?? 'Kamu'
  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0

  const achievements = REPUTATION_TIERS.map(t => ({
    ...t, unlocked: reputation >= t.threshold, hint: `${t.threshold.toLocaleString()} rep`,
  }))

  useEffect(() => {
    if (!user) return
    setLoading(true)
    api.get(`/leaderboard?limit=50&period=${period}`)
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        const arr = Array.isArray(d) ? d : []
        setLeaders(arr)
        const idx = arr.findIndex(u => u.id === user.id)
        setMyRank(idx >= 0 ? idx + 1 : null)
      })
      .catch(() => setLeaders([]))
      .finally(() => setLoading(false))
  }, [user, period])

  const tierFor = (rep) => [...REPUTATION_TIERS].reverse().find(t => rep >= t.threshold)

  const sidebar = (
    <>
      {/* Posisiku */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>📍 Posisiku</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar username={username} size={40} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{username}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>{reputation.toLocaleString()} rep</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {myRank
            ? <StatPill icon="🏅" value={`#${myRank}`} label="Peringkat" accent="#f59e0b" />
            : <p style={{ fontSize: 12, color: colors.textSecondary }}>Belum masuk peringkat.</p>
          }
        </div>
      </div>

      <AchievementPanel title="Badgemu" icon="🏆" achievements={achievements} />
    </>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10, borderBottom: `1px solid ${colors.border}` }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>🏆 Papan Peringkat</h1>
        <div style={{ display: 'flex' }}>
          {PERIODS.map(p => (
            <button key={p.val} onClick={() => setPeriod(p.val)} style={{
              flex: 1, padding: '10px 0', background: 'none', border: 'none',
              borderBottom: period === p.val ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontWeight: period === p.val ? 700 : 400,
              color: period === p.val ? colors.textPrimary : colors.textSecondary,
              fontSize: 13, cursor: 'pointer',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {!loading && leaders.length >= 3 && (
        <div style={{ padding: '24px 16px 16px', display: 'flex', justifyContent: 'center', gap: 16, borderBottom: `1px solid ${colors.border}`, background: `linear-gradient(180deg, ${colors.bgElevated} 0%, transparent 100%)` }}>
          {/* 2nd */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🥈</div>
            <Avatar username={leaders[1]?.profile?.username ?? leaders[1]?.username ?? '?'} size={52} />
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary, marginTop: 6, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {leaders[1]?.profile?.username ?? leaders[1]?.username ?? 'Anonim'}
            </div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{(leaders[1]?.profile?.reputation ?? leaders[1]?.reputation ?? 0).toLocaleString()} rep</div>
          </div>
          {/* 1st */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>🥇</div>
            <Avatar username={leaders[0]?.profile?.username ?? leaders[0]?.username ?? '?'} size={68} />
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginTop: 6, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {leaders[0]?.profile?.username ?? leaders[0]?.username ?? 'Anonim'}
            </div>
            <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>{(leaders[0]?.profile?.reputation ?? leaders[0]?.reputation ?? 0).toLocaleString()} rep</div>
          </div>
          {/* 3rd */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🥉</div>
            <Avatar username={leaders[2]?.profile?.username ?? leaders[2]?.username ?? '?'} size={52} />
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary, marginTop: 6, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {leaders[2]?.profile?.username ?? leaders[2]?.username ?? 'Anonim'}
            </div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{(leaders[2]?.profile?.reputation ?? leaders[2]?.reputation ?? 0).toLocaleString()} rep</div>
          </div>
        </div>
      )}

      {/* Full list */}
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
        : leaders.length === 0
        ? <EmptyState icon="🏆" title="Belum ada data peringkat" Link={Link} />
        : leaders.map((u, i) => {
            const uname  = u.profile?.username ?? u.username ?? 'Anonim'
            const rep    = u.profile?.reputation ?? u.reputation ?? 0
            const tier   = tierFor(rep)
            const isMe   = u.id === user?.id
            return (
              <Link key={u.id ?? i} href={`/user/profile/${encodeURIComponent(uname)}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 16px', borderBottom: `1px solid ${colors.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: isMe ? `${colors.accent}18` : 'transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
                onMouseLeave={e => (e.currentTarget.style.background = isMe ? `${colors.accent}18` : 'transparent')}
                >
                  {/* Rank */}
                  <div style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15, color: i < 3 ? '#f59e0b' : colors.textSecondary, flexShrink: 0 }}>
                    {MEDAL[i] ?? `${i + 1}`}
                  </div>
                  <Avatar username={uname} size={40} verified={u.isExpert ?? u.role === 'expert'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{uname}</span>
                      {isMe && <StatPill variant="tag" tone="accent" label="Kamu" />}
                      {(u.isExpert ?? u.role === 'expert') && <StatPill variant="tag" tone="accent" label="Pakar" />}
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, display: 'flex', gap: 8, marginTop: 2 }}>
                      <span>{tier?.icon} {tier?.label}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{rep.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>rep</div>
                  </div>
                </div>
              </Link>
            )
          })
      }
    </UserLayout>
  )
}



