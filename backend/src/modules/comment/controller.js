'use strict'
const service = require('./service')
const voteService = require('../vote/service')
const prisma = require('../../config/prisma')
const { notifyMentions } = require('../../utils/mentions')

module.exports = {
  // POST /discussions/:id/comments  { content, parentId? }
  create: async (req, res, next) => {
    try {
      const { content, parentId } = req.body
      const discussionId = req.params.id

      const comment = await service.create(
        { content, discussionId, parentId },
        req.userId
      )

      // ── Notifikasi: balasan ke komentar (prioritas) atau komentar baru di diskusi ──
      if (comment._parentOwnerId && comment._parentOwnerId !== req.userId) {
        prisma.notification.create({
          data: {
            userId: comment._parentOwnerId,
            actorId: req.userId,
            type: 'REPLY',
            discussionId,
            commentId: comment.id,
            message: 'membalas komentar kamu',
          },
        }).catch(() => {})
      } else if (comment._discussionOwnerId && comment._discussionOwnerId !== req.userId) {
        prisma.notification.create({
          data: {
            userId: comment._discussionOwnerId,
            actorId: req.userId,
            type: 'COMMENT',
            discussionId,
            commentId: comment.id,
            message: `mengomentari diskusi "${(comment._discussionTitle ?? '').slice(0, 60)}"`,
          },
        }).catch(() => {})
      }

      notifyMentions({ text: content, actorId: req.userId, discussionId, commentId: comment.id })

      res.status(201).json({ data: comment })
    } catch (e) { next(e) }
  },

  // GET /discussions/:id/comments
  listByDiscussion: async (req, res, next) => {
    try {
      const comments = await service.getByDiscussion(req.params.id)
      res.json({ data: comments })
    } catch (e) { next(e) }
  },

  // GET /comments?userId=&limit=
  listByUser: async (req, res, next) => {
    try {
      const { userId, limit } = req.query
      if (!userId) return res.status(400).json({ message: 'userId harus diisi' })

      const take = Math.min(parseInt(limit, 10) || 20, 50)
      const comments = await prisma.comment.findMany({
        where: { userId, isHidden: false },
        include: {
          discussion: { select: { id: true, title: true } },
          user: { select: { id: true, profile: { select: { username: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take,
      })
      res.json({ data: comments })
    } catch (e) { next(e) }
  },

  // PATCH /comments/:id — pemilik, atau moderator/admin
  update: async (req, res, next) => {
    try {
      const existing = await prisma.comment.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' })
      const isStaff = ['ADMIN', 'MODERATOR'].includes(req.userRole)
      if (!isStaff && existing.userId !== req.userId)
        return res.status(403).json({ message: 'Tidak diizinkan mengubah komentar ini' })

      const { content } = req.body
      if (!content || !content.trim())
        return res.status(400).json({ message: 'Konten tidak boleh kosong' })

      const updated = await prisma.comment.update({
        where: { id: req.params.id },
        data: { content: content.trim() },
      })
      res.json({ data: updated })
    } catch (e) { next(e) }
  },

  // DELETE /comments/:id — pemilik, atau moderator/admin
  remove: async (req, res, next) => {
    try {
      const existing = await prisma.comment.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' })
      const isStaff = ['ADMIN', 'MODERATOR'].includes(req.userRole)
      if (!isStaff && existing.userId !== req.userId)
        return res.status(403).json({ message: 'Tidak diizinkan menghapus komentar ini' })

      await prisma.comment.delete({ where: { id: req.params.id } })
      res.status(200).json({ message: 'Komentar dihapus' })
    } catch (e) { next(e) }
  },

  // POST /comments/:id/votes  { value: 1 | -1 | 0 }
  // Delegasi ke vote/service supaya validasi & logika terpusat di satu tempat
  vote: async (req, res, next) => {
    try {
      const result = await voteService.vote(
        req.userId,
        undefined,          // discussionId
        req.params.id,      // commentId
        req.body.value
      )
      res.status(200).json({ data: result })
    } catch (e) { next(e) }
  },
}


