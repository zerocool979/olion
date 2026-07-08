'use strict'
const service = require('./service')
const moderatorSvc = require('../moderator/service')
const reputationSvc = require('../reputation/service')

const VALID_STATUSES = new Set(['PENDING', 'RESOLVED', 'REJECTED'])
const VALID_TYPES    = new Set(['discussion', 'comment', 'user'])

module.exports = {
  // POST /reports  { type, targetId, reason }
  report: async (req, res, next) => {
    try {
      const { type, targetId, reason } = req.body

      if (!type || !targetId || !reason?.trim()) {
        return res.status(400).json({ message: 'type, targetId, dan reason harus diisi' })
      }
      if (!VALID_TYPES.has(type)) {
        return res.status(400).json({ message: 'type harus discussion, comment, atau user' })
      }

      const mappedBody = { reason: reason.trim() }

      if (type === 'discussion') {
        mappedBody.discussionId = targetId
      } else if (type === 'comment') {
        mappedBody.commentId = targetId
      } else {
        if (targetId === req.userId)
          return res.status(400).json({ message: 'Tidak bisa melaporkan diri sendiri' })
        mappedBody.targetUserId = targetId
      }

      const report = await service.create(mappedBody, req.userId)
      res.status(201).json({ data: report })
    } catch (e) { next(e) }
  },

  // PUT /reports/:id  { status, action? }
  // status  : PENDING | RESOLVED | REJECTED
  // action  : hide_discussion | hide_comment | warn_user | ban_user | none
  review: async (req, res, next) => {
    try {
      const { status, action } = req.body

      if (!status || !VALID_STATUSES.has(status)) {
        return res.status(400).json({
          message: `status harus salah satu dari: ${[...VALID_STATUSES].join(', ')}`
        })
      }

      // Ambil laporan terlebih dahulu untuk tahu target-nya
      const existing = await service.findById(req.params.id)
      if (!existing) return res.status(404).json({ message: 'Laporan tidak ditemukan' })

      // Jalankan tindakan moderasi sesuai pilihan
      if (status === 'RESOLVED' && action) {
        if (action === 'hide_discussion' && existing.discussionId) {
          await moderatorSvc.hideDiscussion(existing.discussionId)
        } else if (action === 'hide_comment' && existing.commentId) {
          await moderatorSvc.hideComment(existing.commentId)
        } else if (action === 'ban_user' && existing.targetUserId) {
          await moderatorSvc.banUser(existing.targetUserId)
        }
      }

      // Kurangi reputasi pelapor jika laporan ditolak (spam prevention)
      if (status === 'REJECTED') {
        await reputationSvc.addPoint(existing.reporterId, -5, 'Laporan ditolak moderator').catch(() => {})
      }

      const updated = await service.review(req.params.id, status)
      res.json({ data: updated })
    } catch (e) { next(e) }
  },

  // GET /reports?status=&skip=&take= — untuk moderator/admin
  list: async (req, res, next) => {
    try {
      const { status, skip = 0, take = 20 } = req.query
      const reports = await service.list({
        status: status || undefined,
        skip: parseInt(skip),
        take: Math.min(parseInt(take), 50),
      })
      res.json({ data: reports })
    } catch (e) { next(e) }
  },
}


