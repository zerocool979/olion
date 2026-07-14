'use strict'
const discussionService = require('./service')
const badgeSvc = require('../badge/service')
const reputationSvc = require('../reputation/service')
const prisma = require('../../config/prisma')
const { notifyMentions } = require('../../utils/mentions')

const REP_CREATE_DISCUSSION = 5

module.exports = {
  list: async (req, res, next) => {
    try {
      const skip = parseInt(req.query.skip) || 0
      const take = Math.min(parseInt(req.query.take ?? req.query.limit) || 20, 50)
      const { userId, categoryId, sort, feed, role } = req.query

      // Hanya staff (moderator/admin) yang boleh melihat konten tersembunyi —
      // publik/guest tetap hanya melihat konten isHidden:false.
      const isStaff = ['ADMIN', 'MODERATOR'].includes(req.userRole)
      const isHidden = isStaff && req.query.isHidden === 'true'

      const data = await discussionService.list({
        skip, take, userId, categoryId, sort, feed, role, viewerId: req.userId, isHidden,
      })
      res.json({ data })
    } catch (err) { next(err) }
  },

  detail: async (req, res, next) => {
    try {
      const discussion = await discussionService.detail(req.params.id, req.userId)
      if (!discussion) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })
      res.json({ data: discussion })
    } catch (err) { next(err) }
  },

  create: async (req, res, next) => {
    try {
      const { categoryId, title, content } = req.body

      if (!categoryId || !title?.trim() || !content?.trim()) {
        return res.status(400).json({ message: 'categoryId, title, dan content harus diisi' })
      }

      // FIX: `mode` dan `discipline` wajib diisi di skema (tidak ada default),
      // tapi form lama tidak pernah mengirim keduanya sama sekali → Prisma
      // selalu menolak dengan "Argument `mode` is missing". Sekarang divalidasi
      // kalau dikirim, dan diberi default yang masuk akal kalau tidak dikirim,
      // supaya endpoint ini tidak pernah crash gara-gara field opsional ini.
      const VALID_MODES = ['INFORMATIF', 'KLARIFIKATIF', 'EKSPLORATIF', 'EVALUATIF', 'ARGUMENTATIF']
      const VALID_DISCIPLINES = ['BEBAS', 'RASIONAL', 'AKADEMIK', 'PROFESIONAL']

      const mode = req.body.mode
      const discipline = req.body.discipline

      if (mode !== undefined && !VALID_MODES.includes(mode)) {
        return res.status(400).json({ message: `mode harus salah satu dari: ${VALID_MODES.join(', ')}` })
      }
      if (discipline !== undefined && !VALID_DISCIPLINES.includes(discipline)) {
        return res.status(400).json({ message: `discipline harus salah satu dari: ${VALID_DISCIPLINES.join(', ')}` })
      }

      const discussion = await discussionService.create(
        req.userId, categoryId, title.trim(), content.trim(),
        mode || 'EKSPLORATIF', discipline || 'BEBAS'
      )

      // Reputasi + badge untuk kontribusi diskusi baru
      reputationSvc.addPoint(req.userId, REP_CREATE_DISCUSSION, 'Membuat diskusi baru').catch(() => {})
      badgeSvc.awardSlug(req.userId, 'first_post').catch(() => {})
      notifyMentions({ text: `${title} ${content}`, actorId: req.userId, discussionId: discussion.id })

      res.status(201).json({ data: discussion })
    } catch (err) { next(err) }
  },

  update: async (req, res, next) => {
    try {
      const existing = await prisma.discussion.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })

      // Admin & moderator boleh edit konten manapun
      const isStaff = ['ADMIN', 'MODERATOR'].includes(req.userRole)
      if (!isStaff && existing.userId !== req.userId)
        return res.status(403).json({ message: 'Tidak diizinkan mengubah diskusi ini' })

      const { title, content, categoryId, mode, discipline } = req.body
      const data = {}
      if (title      !== undefined) data.title      = title.trim()
      if (content    !== undefined) data.content     = content.trim()
      if (categoryId !== undefined) data.categoryId  = categoryId
      if (mode       !== undefined) data.mode        = mode
      if (discipline !== undefined) data.discipline  = discipline

      const updated = await prisma.discussion.update({ where: { id: req.params.id }, data })
      res.json({ data: updated })
    } catch (err) { next(err) }
  },

  remove: async (req, res, next) => {
    try {
      const existing = await prisma.discussion.findUnique({ where: { id: req.params.id } })
      if (!existing) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })

      const isStaff = ['ADMIN', 'MODERATOR'].includes(req.userRole)
      if (!isStaff && existing.userId !== req.userId)
        return res.status(403).json({ message: 'Tidak diizinkan menghapus diskusi ini' })

      await prisma.discussion.delete({ where: { id: req.params.id } })
      res.status(200).json({ message: 'Diskusi dihapus' })
    } catch (err) { next(err) }
  },

  incrementView: async (req, res, next) => {
    try {
      const discussion = await prisma.discussion.update({
        where: { id: req.params.id },
        data:  { viewCount: { increment: 1 } },
        select: { id: true, viewCount: true },
      })
      res.status(200).json({ viewCount: discussion.viewCount })
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ message: 'Diskusi tidak ditemukan' })
      next(err)
    }
  },

  search: async (req, res, next) => {
    try {
      const { q = '', category = '', subcategory = '', sort = 'latest' } = req.query
      const skip = parseInt(req.query.skip) || 0
      const take = Math.min(parseInt(req.query.take) || 20, 50)
      const result = await discussionService.search({ q, category, subcategory, sort, skip, take })
      res.json({ data: result.data, meta: { total: result.total, skip, take } })
    } catch (err) { next(err) }
  },
}


