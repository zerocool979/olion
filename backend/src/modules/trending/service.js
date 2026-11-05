'use strict'
const prisma = require('../../config/prisma')

// Public-facing author fields only; never return account credentials or email.
const PUBLIC_USER_SELECT = {
  id: true,
  role: true,
  isVerifiedExpert: true,
  createdAt: true,
  profile: {
    select: {
      username: true,
      bio: true,
      avatarUrl: true,
      avatarBorder: true,
    },
  },
}

// ── Period helpers ────────────────────────────────────────────────────────────
function periodToDate(period) {
  const now = new Date()
  switch (period) {
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000)
    case '7d':
      return new Date(now - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now - 30 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now - 24 * 60 * 60 * 1000)
  }
}

// ── Trending score formula ────────────────────────────────────────────────────
// Score = (votes * W_VOTE) + (comments * W_COMMENT) + recency_boost
//
// Recency boost: discussions created more recently get a multiplier.
// The older the post (relative to period window), the more the boost decays.
//
// W_VOTE    = 3   (votes signal quality consensus)
// W_COMMENT = 2   (comments signal engagement depth)
// Recency   = score * (1 + decay_factor)
//   decay_factor = max(0, 1 - age_in_hours / window_in_hours)
//   — a post at age=0 gets +100% boost, at age=window gets +0%

const W_VOTE    = 3
const W_COMMENT = 2

function computeScore(votes, comments, createdAt, windowStart) {
  const baseScore = votes * W_VOTE + comments * W_COMMENT

  const windowMs  = Date.now() - windowStart.getTime()
  const ageMs     = Date.now() - new Date(createdAt).getTime()
  const decay     = Math.max(0, 1 - ageMs / windowMs)
  const boosted   = baseScore * (1 + decay)

  return Math.round(boosted)
}

// ── Trend direction (batched) ──────────────────────────────────────────────────
// Fetch activity buckets for all candidate discussions in two grouped queries,
// avoiding four COUNT queries per discussion (N+1 query amplification).
async function computeTrends(discussionIds, windowStart) {
  if (discussionIds.length === 0) return new Map()

  const midpoint = new Date((Date.now() + windowStart.getTime()) / 2)
  const where = { discussionId: { in: discussionIds }, createdAt: { gte: windowStart } }
  const [votes, comments] = await Promise.all([
    prisma.vote.groupBy({
      by: ['discussionId', 'createdAt'],
      where,
      _count: { _all: true },
    }),
    prisma.comment.groupBy({
      by: ['discussionId', 'createdAt'],
      where,
      _count: { _all: true },
    }),
  ])

  const activity = new Map(discussionIds.map(id => [id, { old: 0, recent: 0 }]))
  for (const row of [...votes, ...comments]) {
    const bucket = activity.get(row.discussionId)
    if (!bucket) continue
    if (new Date(row.createdAt) < midpoint) bucket.old += row._count._all
    else bucket.recent += row._count._all
  }

  const trends = new Map()
  for (const [id, counts] of activity) {
    const { old, recent } = counts
    if (old === 0 && recent === 0) trends.set(id, null)
    else if (old === 0) trends.set(id, `+${recent * 100}%`)
    else {
      const pct = Math.round(((recent - old) / old) * 100)
      trends.set(id, pct >= 0 ? `+${pct}%` : `${pct}%`)
    }
  }
  return trends
}

// ── Main export ───────────────────────────────────────────────────────────────
// GET /trending?period=24h|7d|30d&limit=20
async function getTrending({ period = '24h', limit = 20 } = {}) {
  const windowStart = periodToDate(period)

  // Fetch discussions that have had any activity in the window,
  // OR were created within the window.
  // Bound candidate work so a public request cannot load the full discussion table.
  const discussions = await prisma.discussion.findMany({
    take: 200,
    orderBy: { createdAt: 'desc' },
    where: {
      isHidden: false,
      OR: [
        { createdAt: { gte: windowStart } },
        { votes:    { some: { createdAt: { gte: windowStart } } } },
        { comments: { some: { createdAt: { gte: windowStart } } } },
      ],
    },
    include: {
      user:     { select: PUBLIC_USER_SELECT },
      category: { include: { parent: true } },
      _count:   { select: { votes: true, comments: true } },
    },
  })

  // Score each discussion
  const scored = discussions.map((d) => ({
    ...d,
    score: computeScore(d._count.votes, d._count.comments, d.createdAt, windowStart),
  }))

  // Sort by score desc, take top N
  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, limit)

  // Attach rank + trend using batched activity aggregation.
  const trends = await computeTrends(top.map(d => d.id), windowStart)
  const ranked = top.map((d, idx) => {
      const trend = trends.get(d.id)
      const isHot = d.score > (top[0]?.score ?? 0) * 0.7 // top 70% of leader score = hot
      return {
        id:        d.id,
        rank:      idx + 1,
        title:     d.title,
        content:   d.content,
        mode:      d.mode,
        createdAt: d.createdAt,
        score:     d.score,
        trend,
        hot:       isHot && idx < 5, // only first 5 eligible for hot badge
        category:  d.category,
        user:      d.user,
        _count:    d._count,
      }
    })

  return ranked
}

module.exports = { getTrending }



