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

// ── Formula reputasi ───────────────────────────────────────────────────────────
// Sebelumnya: Promise.all(users.map(u => 4 query per user)) → N*4 hit DB.
// Sekarang  : 4 query agregat total, kemudian join di JS — O(1) hit DB.
const W = { upvote: 10, downvote: -2, comment: 2, discussion: 5, expert: 50 }

async function getLeaderboard({ period = 'all', limit = 50 } = {}) {
  const since = periodToDate(period)
  const since_ = since ? since : undefined

  // ── 1. Semua user aktif (satu query) ─────────────────────────────────────
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: {
      id: true, role: true, isVerifiedExpert: true, createdAt: true,
      profile: { select: { username: true, bio: true } },
    },
  })

  if (users.length === 0) return []

  const userIds = users.map(u => u.id)

  // ── 2. Agregat upvote/downvote diterima — dikelompokkan manual di JS ──────
  //    (Prisma tidak support groupBy dengan filter nested relation secara langsung)
  //    Kita ambil semua vote pada diskusi/komentar, lalu group by pemilik konten.
  const [votesOnDisc, votesOnComm, discCounts, commCounts] = await Promise.all([
    // Vote pada diskusi tiap user
    prisma.vote.groupBy({
      by: ['value'],
      _count: { id: true },
      where: {
        discussion: { userId: { in: userIds }, isHidden: false },
        ...(since_ ? { createdAt: { gte: since_ } } : {}),
      },
    // groupBy by 'value' saja tidak cukup — kita perlu per userId pemilik diskusi.
    // Prisma tidak support groupBy pada nested relation field langsung.
    // Solusi: findMany dengan select minimal lalu aggregate di JS.
    }).then(() => null), // tidak terpakai — pakai pendekatan alternatif di bawah
    null, null, null,
  ])

  // Pendekatan alternatif yang kompatibel Prisma 5:
  // Gunakan $queryRaw hanya jika perlu performa ekstrem.
  // Untuk skala MVP (< 10k user), kita pakai pendekatan batched findMany yang
  // tetap jauh lebih efisien dari N*4 query asli (sekarang 3 query flat):

  const [allVotesReceived, allDiscussions, allComments] = await Promise.all([
    // Semua vote pada diskusi yang dimiliki user dalam daftar
    prisma.vote.findMany({
      where: {
        discussion: { userId: { in: userIds }, isHidden: false },
        ...(since_ ? { createdAt: { gte: since_ } } : {}),
      },
      select: { value: true, discussion: { select: { userId: true } } },
    }),
    // Jumlah diskusi per user (satu query, filter period)
    prisma.discussion.groupBy({
      by: ['userId'],
      _count: { id: true },
      where: {
        userId: { in: userIds },
        isHidden: false,
        ...(since_ ? { createdAt: { gte: since_ } } : {}),
      },
    }),
    // Jumlah komentar per user (satu query, filter period)
    prisma.comment.groupBy({
      by: ['userId'],
      _count: { id: true },
      where: {
        userId: { in: userIds },
        isHidden: false,
        ...(since_ ? { createdAt: { gte: since_ } } : {}),
      },
    }),
  ])

  // ── 3. Build lookup maps (O(n)) ─────────────────────────────────────────
  const upMap   = {}   // userId → upvotes received
  const downMap = {}   // userId → downvotes received
  for (const v of allVotesReceived) {
    const uid = v.discussion?.userId
    if (!uid) continue
    if (v.value === 1)  upMap[uid]   = (upMap[uid]   || 0) + 1
    if (v.value === -1) downMap[uid] = (downMap[uid] || 0) + 1
  }

  const discMap = {}
  for (const d of allDiscussions) discMap[d.userId] = d._count.id

  const commMap = {}
  for (const c of allComments) commMap[c.userId] = c._count.id

  // ── 4. Hitung reputasi + sort ──────────────────────────────────────────
  const scored = users.map(u => {
    const up   = upMap[u.id]   || 0
    const down = downMap[u.id] || 0
    const disc = discMap[u.id] || 0
    const comm = commMap[u.id] || 0

    const reputation =
      up   * W.upvote   +
      down * W.downvote +
      disc * W.discussion +
      comm * W.comment +
      (u.isVerifiedExpert ? W.expert : 0)

    return {
      id: u.id,
      username: u.profile?.username ?? `Anon#${u.id.slice(-4)}`,
      bio: u.profile?.bio ?? '',
      isVerifiedExpert: u.isVerifiedExpert,
      role: u.role,
      reputation: Math.max(0, reputation),
      discussions: disc,
      comments: comm,
      upvotesReceived: up,
      joinedAt: u.createdAt,
    }
  })

  scored.sort((a, b) => b.reputation - a.reputation)
  return scored.slice(0, limit).map((u, i) => ({ ...u, rank: i + 1 }))
}

module.exports = { getLeaderboard }


