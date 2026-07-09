'use strict'
const prisma = require('../../config/prisma')

module.exports = {
  // GET /notifications?limit=&unread=true&type=FOLLOW
  list: async (req, res, next) => {
    try {
      const take = Math.min(parseInt(req.query.limit, 10) || 20, 50)
      const where = { userId: req.userId }
      if (req.query.unread === 'true') where.read = false
      if (req.query.type) where.type = String(req.query.type).toUpperCase()

      const notifications = await prisma.notification.findMany({
        where,
        include: {
          actor: { select: { id: true, profile: { select: { username: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take,
      })
      return res.status(200).json({ data: notifications })
    } catch (err) { next(err) }
  },

  // GET /notifications/unread-count
  unreadCount: async (req, res, next) => {
    try {
      const count = await prisma.notification.count({
        where: { userId: req.userId, read: false },
      })
      return res.status(200).json({ count })
    } catch (err) { next(err) }
  },

  // PATCH /notifications/:id/read
  markRead: async (req, res, next) => {
    try {
      const notif = await prisma.notification.findUnique({ where: { id: req.params.id } })
      if (!notif || notif.userId !== req.userId)
        return res.status(404).json({ message: 'Notifikasi tidak ditemukan' })
      const updated = await prisma.notification.update({
        where: { id: req.params.id },
        data:  { read: true },
      })
      return res.status(200).json({ notification: updated })
    } catch (err) { next(err) }
  },

  // PATCH /notifications/read-all
  markAllRead: async (req, res, next) => {
    try {
      await prisma.notification.updateMany({
        where: { userId: req.userId, read: false },
        data:  { read: true },
      })
      return res.status(200).json({ message: 'Semua notifikasi ditandai dibaca' })
    } catch (err) { next(err) }
  },

  // DELETE /notifications/:id
  remove: async (req, res, next) => {
    try {
      const notif = await prisma.notification.findUnique({ where: { id: req.params.id } })
      if (!notif || notif.userId !== req.userId)
        return res.status(404).json({ message: 'Notifikasi tidak ditemukan' })
      await prisma.notification.delete({ where: { id: req.params.id } })
      return res.status(200).json({ message: 'Notifikasi dihapus' })
    } catch (err) { next(err) }
  },
}


