'use client'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'

function BadgeCard({ badge, earned, earnedAt }) {
  return (
    <div style={{
      background: earned ? colors.bgElevated : colors.bg,
      border: `1px solid ${earned ? colors.accent + '44' : colors.borderLight}`,
      borderRadius: 12, padding: '20px 16px', textAlign: 'center',
      opacity: earned ? 1 : 0.45, transition: 'all 0.2s', position: 'relative',
    }}>
      {earned && (
        <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
      )}
      <div style={{ fontSize: 36, marginBottom: 8 }}>{badge.icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary, marginBottom: 4 }}>{badge.name}</div>
      <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 8 }}>{badge.description}</div>
      {badge.threshold > 0 && (
        <div style={{ fontSize: 10, color: earned ? colors.accent : colors.textSecondary, background: earned ? colors.accent + '11' : colors.bgElevated, borderRadius: 20, padding: '2px 8px', display: 'inline-block' }}>
          ⭐ {badge.threshold} reputasi
        </div>
      )}
      {earned && earnedAt && (
        <div style={{ fontSize: 10, color: '#10b981', marginTop: 6 }}>
          Diperoleh {new Date(earnedAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
        </div>
      )}
    </div>
  )
}

export default function BadgesPage() {
  const { user } = useContext(AuthContext)
  const router   = useRouter()
  const { userId } = router.query

  const [allBadges,   setAllBadges]   = useState([])
  const [userBadges,  setUserBadges]  = useState([])
  const [targetUser,  setTargetUser]  = useState(null)
  const [loading,     setLoading]     = useState(true)

  // Gunakan userId dari query param jika ada, fallback ke user sendiri
  const viewingId = userId ?? user?.id

  useEffect(() => {
    if (!viewingId) return
    setLoading(true)
    Promise.all([
      api.get('/badges'),
      api.get(`/users/${viewingId}/badges`),
      api.get(`/users/${viewingId}`).catch(() => ({ data: null })),
    ]).then(([bRes, ubRes, uRes]) => {
      setAllBadges(bRes.data.data ?? [])
      setUserBadges(ubRes.data.data ?? [])
      setTargetUser(uRes.data?.user ?? null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [viewingId])

  const earnedMap = {}
  for (const ub of userBadges) earnedMap[ub.badgeId] = ub.earnedAt

  const earnedCount = userBadges.length
  const totalCount  = allBadges.length

  return (
    <>
      <Head><title>Badge — {targetUser?.profile?.username ?? 'OLION'}</title></Head>
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui,sans-serif' }}>
        {/* Topbar */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
          <Link href="/user/dashboard" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: 20 }}>←</Link>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Badge & Pencapaian</span>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 20px' }}>
          {/* Header user */}
          {targetUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, background: colors.bgElevated, borderRadius: 12, padding: '16px 20px', border: `1px solid ${colors.border}` }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {(targetUser.profile?.username ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{targetUser.profile?.username}</div>
                <div style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                  {earnedCount} dari {totalCount} badge diperoleh
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ flex: 1, marginLeft: 12 }}>
                <div style={{ height: 8, background: colors.border, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${totalCount ? (earnedCount/totalCount)*100 : 0}%`, background: colors.accent, borderRadius: 99, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4, textAlign: 'right' }}>
                  {totalCount ? Math.round((earnedCount/totalCount)*100) : 0}% selesai
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 60 }}>Memuat badge...</div>
          ) : (
            <>
              {/* Badge yang sudah diperoleh */}
              {userBadges.length > 0 && (
                <>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.textSecondary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ✨ Diperoleh ({earnedCount})
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 32 }}>
                    {allBadges.filter(b => earnedMap[b.id]).map(b => (
                      <BadgeCard key={b.id} badge={b} earned earnedAt={earnedMap[b.id]} />
                    ))}
                  </div>
                </>
              )}

              {/* Badge yang belum diperoleh */}
              {allBadges.filter(b => !earnedMap[b.id]).length > 0 && (
                <>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.textSecondary, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔒 Belum Diperoleh ({allBadges.filter(b => !earnedMap[b.id]).length})
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12 }}>
                    {allBadges.filter(b => !earnedMap[b.id]).map(b => (
                      <BadgeCard key={b.id} badge={b} earned={false} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}


