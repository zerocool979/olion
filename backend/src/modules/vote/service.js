'use strict'
const prisma = require('../../config/prisma')

// ── Konstanta validasi ─────────────────────────────────────────────────────────
// Satu-satunya tempat nilai vote divalidasi — jangan validasi ulang di controller lain.
const VALID_VOTE_VALUES = new Set([1, -1])

function assertVoteValue(value) {
  if (!VALID_VOTE_VALUES.has(value)) {
    const err = new Error('Nilai vote harus 1 (upvote) atau -1 (downvote)')
    err.statusCode = 400
    throw err
  }
}

function assertOneTarget(discussionId, commentId) {
  if (!discussionId && !commentId) {
    const err = new Error('Target vote diperlukan: discussionId atau commentId')
    err.statusCode = 400
    throw err
  }
  if (discussionId && commentId) {
    const err = new Error('Hanya bisa vote satu target sekaligus')
    err.statusCode = 400
    throw err
  }
}

// ── POST /votes  { discussionId?, commentId?, value } ───────────────────────────
exports.vote = async (userId, discussionId, commentId, value) => {
  assertOneTarget(discussionId, commentId)

  // value === 0 berarti hapus vote (un-vote)
  if (value === 0) {
    return exports.unvote(userId, discussionId, commentId)
  }

  assertVoteValue(value)

  // Pastikan target ada sebelum upsert
  if (discussionId) {
    const d = await prisma.discussion.findUnique({ where: { id: discussionId }, select: { id: true } })
    if (!d) { const e = new Error('Diskusi tidak ditemukan'); e.statusCode = 404; throw e }
  } else {
    const c = await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true } })
    if (!c) { const e = new Error('Komentar tidak ditemukan'); e.statusCode = 404; throw e }
  }

  const vote = await prisma.vote.upsert({
    where: discussionId
      ? { userId_discussionId: { userId, discussionId } }
      : { userId_commentId:   { userId, commentId   } },
    update: { value },
    create: {
      value,
      userId,
      discussionId: discussionId || null,
      commentId:    commentId    || null,
    },
  })

  return vote
}

// ── DELETE /votes ─────────────────────────────────────────────────────────────
exports.unvote = async (userId, discussionId, commentId) => {
  assertOneTarget(discussionId, commentId)

  if (discussionId) {
    await prisma.vote.deleteMany({ where: { userId, discussionId } })
  } else {
    await prisma.vote.deleteMany({ where: { userId, commentId } })
  }

  return { voted: null }
}

// ── GET /votes?userId=&limit= ─────────────────────────────────────────────────
exports.listByUser = async (userId, limit) => {
  const take = Math.min(parseInt(limit, 10) || 20, 50)

  return prisma.vote.findMany({
    where: { userId, value: { gt: 0 }, discussionId: { not: null } },
    include: {
      discussion: {
        select: {
          id: true, title: true, content: true, createdAt: true,
          user: { select: { id: true, profile: { select: { username: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take,
  })
}


