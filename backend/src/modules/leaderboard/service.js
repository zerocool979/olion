'use strict'
const prisma = require('../../config/prisma')

// ── Period helpers ────────────────────────────────────────────────────────────
function periodToDate(period) {
  const now = new Date()
  switch (period) {
    case 'week':  return new Date(now - 7  * 24 * 60 * 60 * 1000)
    case 'month': return new Date(now - 30 * 24 * 60 * 60 * 1000)
    default:      return null   // all-time → no date filter
  }
}

// ── Reputation formula ────────────────────────────────────────────────────────
// Reputation = (upvotes_received * 10)
//            + (downvotes_given penalty: -2 per net downvote on own posts)
//            + (comments_authored * 2)
//            + (discussions_authored * 5)
//            + expert_bonus (50 flat if isVerifiedExpert)
//
// All activity is scoped to the chosen period window.
// For 'all-time' the reputationLog aggregate (if present) is used as the source
// of truth; otherwise we compute on the fly from votes/comments/discussions.
//
// Because Prisma doesn't support GROUP BY in findMany easily, we fetch the
// relevant raw counts and compute in JS. This is fine for leaderboard sizes
// (top 100 users); for very large scale a materialized view would be better.

const W_UPVOTE     = 10
const W_COMMENT    =  2
const W_DISCUSSION =  5
const W_EXPERT     = 50

async function getLeaderboard({ period = 'all', limit = 50 } = {}) {
  const since = periodToDate(period)

  // ── 1. Build date filters ─────────────────────────────────────────────────
  const dateFilter = since ? { createdAt: { gte: since } } : {}

  // ── 2. Fetch all non-banned users with their profiles ────────────────────
  const users = await prisma.user.findMany({
    where: { isBanned: false },
    include: {
      profile: true,
      // Count discussions authored in period
      _count: {
        select: {
          discussions: true,   // total; we'll refine below
          comments:    true,
        },
      },
    },
  })

  // ── 3. For each user: count votes received on their discussions in period ─
  // and discussions + comments scoped to period
  const scored = await Promise.all(
    users.map(async (u) => {
      const [
        upvotesReceived,
        downvotesReceived,
        discussionsCount,
        commentsCount,
      ] = await Promise.all([
        // upvotes on this user's discussions
        prisma.vote.count({
          where: {
            value: 1,
            discussion: { userId: u.id },
            ...dateFilter,
          },
        }),
        // downvotes on this user's discussions
        prisma.vote.count({
          where: {
            value: -1,
            discussion: { userId: u.id },
            ...dateFilter,
          },
        }),
        // discussions authored in period
        prisma.discussion.count({
          where: { userId: u.id, isHidden: false, ...dateFilter },
        }),
        // comments authored in period
        prisma.comment.count({
          where: { userId: u.id, isHidden: false, ...dateFilter },
        }),
      ])

      const netVotes   = upvotesReceived - downvotesReceived
      const reputation =
        Math.max(0, netVotes)    * W_UPVOTE +
        commentsCount            * W_COMMENT +
        discussionsCount         * W_DISCUSSION +
        (u.isVerifiedExpert ? W_EXPERT : 0)

      return {
        id:              u.id,
        username:        u.profile?.username ?? `Anon#${u.id.slice(-4)}`,
        isVerifiedExpert: u.isVerifiedExpert,
        role:            u.role,
        reputation,
        discussions:     discussionsCount,
        comments:        commentsCount,
        upvotesReceived,
        joinedAt:        u.createdAt,
      }
    })
  )

  // ── 4. Sort by reputation desc, assign rank ───────────────────────────────
  scored.sort((a, b) => b.reputation - a.reputation)

  return scored
    .slice(0, limit)
    .map((u, idx) => ({ ...u, rank: idx + 1 }))
}

module.exports = { getLeaderboard }
