'use strict'
const prisma = require('../../config/prisma')
const moderatorSvc = require('./service')

module.exports = {
  // PATCH /moderator/discussions/:id/hide
  hideDiscussion: async (req, res, next) => {
    try {
      const existing = await prisma.discussion.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })
      const updated = await moderatorSvc.hideDiscussion(req.params.id)
      res.json({ data: updated })
    } catch (err) { next(err) }
  },

  // PATCH /moderator/discussions/:id/unhide
  unhideDiscussion: async (req, res, next) => {
    try {
      const existing = await prisma.discussion.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })
      const updated = await moderatorSvc.unhideDiscussion(req.params.id)
      res.json({ data: updated })
    } catch (err) { next(err) }
  },

  // PATCH /moderator/comments/:id/hide
  hideComment: async (req, res, next) => {
    try {
      const existing = await prisma.comment.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' })
      const updated = await moderatorSvc.hideComment(req.params.id)
      res.json({ data: updated })
    } catch (err) { next(err) }
  },

  // PATCH /moderator/comments/:id/unhide
  unhideComment: async (req, res, next) => {
    try {
      const existing = await prisma.comment.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Komentar tidak ditemukan' })
      const updated = await moderatorSvc.unhideComment(req.params.id)
      res.json({ data: updated })
    } catch (err) { next(err) }
  },

  // GET /moderator/comments/hidden?take=
  hiddenComments: async (req, res, next) => {
    try {
      const take = Math.min(parseInt(req.query.take, 10) || 50, 100)
      const comments = await prisma.comment.findMany({
        where: { isHidden: true },
        include: {
          discussion: { select: { id: true, title: true } },
          user: { select: { id: true, profile: { select: { username: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take,
      })
      res.json({ data: comments })
    } catch (err) { next(err) }
  },
}
