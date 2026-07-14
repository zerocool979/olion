'use strict'
const service = require('./service')
const reputationSvc = require('../reputation/service')
const prisma = require('../../config/prisma')

// ── Reputasi per aksi ─────────────────────────────────────────────────────────
// Upvote pada diskusi seseorang: +10 untuk penulis
// Downvote: -2 untuk penulis
const REP_UPVOTE_DISCUSSION   = 10
const REP_DOWNVOTE_DISCUSSION = -2
const REP_UPVOTE_COMMENT      = 5
const REP_DOWNVOTE_COMMENT    = -1

async function triggerReputation(vote, previousValue) {
  try {
    // Cari user yang memiliki konten yang di-vote
    let ownerId = null
    let upPts   = 0
    let downPts = 0
    let discussionId = null
    let commentId = null

    if (vote.discussionId) {
      const d = await prisma.discussion.findUnique({
        where: { id: vote.discussionId }, select: { userId: true }
      })
      ownerId = d?.userId
      upPts   = REP_UPVOTE_DISCUSSION
      downPts = REP_DOWNVOTE_DISCUSSION
      discussionId = vote.discussionId
    } else if (vote.commentId) {
      const c = await prisma.comment.findUnique({
        where: { id: vote.commentId }, select: { userId: true, discussionId: true }
      })
      ownerId = c?.userId
      upPts   = REP_UPVOTE_COMMENT
      downPts = REP_DOWNVOTE_COMMENT
      commentId = vote.commentId
      discussionId = c?.discussionId ?? null
    }

    if (!ownerId || ownerId === vote.userId) return // jangan reward diri sendiri

    // Batalkan reputasi vote sebelumnya jika ada (upsert)
    const reversal = previousValue === 1 ? -upPts : previousValue === -1 ? -downPts : 0
    const gain     = vote.value      === 1 ? upPts  : vote.value      === -1 ? downPts  : 0

    const delta = reversal + gain
    if (delta !== 0) {
      await reputationSvc.addPoint(ownerId, delta, `Vote ${vote.value > 0 ? 'positif' : 'negatif'}`)
    }

    // ── Notifikasi vote — hanya untuk upvote baru (bukan downvote/un-vote),
    // supaya tidak spam notifikasi negatif ke penulis konten.
    if (vote.value === 1 && previousValue !== 1) {
      prisma.notification.create({
        data: {
          userId: ownerId,
          actorId: vote.userId,
          type: 'VOTE',
          discussionId,
          commentId,
          message: commentId ? 'menyukai komentar kamu' : 'menyukai diskusi kamu',
        },
      }).catch(() => {})
    }
  } catch (err) {
    // Reputasi tidak boleh gagalkan endpoint utama
    console.error('[reputation] vote trigger gagal:', err.message)
  }
}

exports.vote = async (req, res, next) => {
  try {
    const { discussionId, commentId, value } = req.body

    // Cek apakah sudah pernah vote sebelumnya (untuk reversal reputasi)
    const existing = await prisma.vote.findFirst({
      where: {
        userId: req.userId,
        ...(discussionId ? { discussionId } : { commentId }),
      },
    })

    const result = await service.vote(req.userId, discussionId, commentId, value)

    if (result && result.id) {
      await triggerReputation(result, existing?.value ?? 0)
    }

    res.json({ data: result })
  } catch (e) { next(e) }
}

exports.unvote = async (req, res, next) => {
  try {
    const { discussionId, commentId } = req.body
    const result = await service.unvote(req.userId, discussionId, commentId)
    res.json({ data: result })
  } catch (e) { next(e) }
}

exports.listByUser = async (req, res, next) => {
  try {
    const { userId, limit } = req.query
    if (!userId) return res.status(400).json({ message: 'userId harus diisi' })
    const votes = await service.listByUser(userId, limit)
    res.json({ data: votes })
  } catch (e) { next(e) }
}


