'use strict'
const prisma = require('../../config/prisma')

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

// ── Trend direction ───────────────────────────────────────────────────────────
// Compare score in first half of window vs second half.
// Returns '+X%' or '-X%' string.
async function computeTrend(discussionId, windowStart) {
  const windowMs  = Date.now() - windowStart.getTime()
  const midpoint  = new Date(Date.now() - windowMs / 2)

  const [firstHalf, secondHalf] = await Promise.all([
    // votes + comments in older half of window
    Promise.all([
      prisma.vote.count({
        where: { discussionId, createdAt: { gte: windowStart, lt: midpoint } },
      }),
      prisma.comment.count({
        where: { discussionId, createdAt: { gte: windowStart, lt: midpoint } },
      }),
    ]),
    // votes + comments in recent half
    Promise.all([
      prisma.vote.count({
        where: { discussionId, createdAt: { gte: midpoint } },
      }),
      prisma.comment.count({
        where: { discussionId, createdAt: { gte: midpoint } },
      }),
    ]),
  ])

  const oldActivity  = firstHalf[0]  + firstHalf[1]
  const newActivity  = secondHalf[0] + secondHalf[1]

  if (oldActivity === 0 && newActivity === 0) return null
  if (oldActivity === 0) return `+${(newActivity * 100)}%`

  const pct = Math.round(((newActivity - oldActivity) / oldActivity) * 100)
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

// ── Main export ───────────────────────────────────────────────────────────────
// GET /trending?period=24h|7d|30d&limit=20
async function getTrending({ period = '24h', limit = 20 } = {}) {
  const windowStart = periodToDate(period)

  // Fetch discussions that have had any activity in the window,
  // OR were created within the window.
  const discussions = await prisma.discussion.findMany({
    where: {
      isHidden: false,
      OR: [
        { createdAt: { gte: windowStart } },
        { votes:    { some: { createdAt: { gte: windowStart } } } },
        { comments: { some: { createdAt: { gte: windowStart } } } },
      ],
    },
    include: {
      user:     { include: { profile: true } },
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

  // Attach rank + trend (parallelised per item)
  const ranked = await Promise.all(
    top.map(async (d, idx) => {
      const trend = await computeTrend(d.id, windowStart)
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
  )

  return ranked
}

module.exports = { getTrending }
