'use strict'
const prisma = require('../../config/prisma')

// ── Period helpers ─────────────────────────────────────────────────────────────
function periodToDate(period) {
  const now = new Date()
  switch (period) {
    case 'week':  return new Date(now - 7  * 86400000)
    case 'month': return new Date(now - 30 * 86400000)
    default:      return null
  }
}

/**
 * Leaderboard dihitung dari ReputationLog — sumber kebenaran yang sama dengan
 * yang dipakai halaman profil & pengecekan badge. Sebelumnya modul ini
 * merekonstruksi ulang formula reputasi dari vote/diskusi/komentar mentah,
 * yang bisa berbeda hasil dari angka reputasi di profil (mis. tidak menghitung
 * vote pada komentar) — sekarang keduanya selalu konsisten.
 */
async function getLeaderboard({ period = 'all', limit = 50 } = {}) {
  const since = periodToDate(period)

  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: {
      id: true, role: true, isVerifiedExpert: true, createdAt: true,
      profile: { select: { username: true, bio: true } },
      _count: { select: { discussions: true, comments: true } },
    },
  })
  if (users.length === 0) return []

  const userIds = users.map(u => u.id)

  const repGroups = await prisma.reputationLog.groupBy({
    by: ['userId'],
    _sum: { point: true },
    where: {
      userId: { in: userIds },
      ...(since ? { createdAt: { gte: since } } : {}),
    },
  })
  const repMap = {}
  for (const r of repGroups) repMap[r.userId] = r._sum.point ?? 0

  const scored = users.map(u => ({
    id: u.id,
    username: u.profile?.username ?? `Anon#${u.id.slice(-4)}`,
    bio: u.profile?.bio ?? '',
    isVerifiedExpert: u.isVerifiedExpert,
    role: u.role,
    reputation: Math.max(0, repMap[u.id] || 0),
    discussions: u._count.discussions,
    comments: u._count.comments,
    joinedAt: u.createdAt,
  }))

  scored.sort((a, b) => b.reputation - a.reputation)
  return scored.slice(0, limit).map((u, i) => ({ ...u, rank: i + 1 }))
}

module.exports = { getLeaderboard }
