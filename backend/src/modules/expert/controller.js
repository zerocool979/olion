'use strict'
const prisma = require('../../config/prisma')
const badgeSvc = require('../badge/service')

module.exports = {
  // POST /expert/apply  { field, credentials }
  // User biasa mengajukan permohonan menjadi pakar terverifikasi
  apply: async (req, res, next) => {
    try {
      const { field, credentials } = req.body

      if (!field?.trim() || !credentials?.trim())
        return res.status(400).json({ message: 'field dan credentials harus diisi' })

      // Satu permohonan aktif per user
      const existing = await prisma.expertApplication.findFirst({
        where: { userId: req.userId, status: 'PENDING' },
      })
      if (existing)
        return res.status(409).json({ message: 'Kamu sudah memiliki permohonan yang sedang diproses' })

      const app = await prisma.expertApplication.create({
        data: {
          userId:      req.userId,
          field:       field.trim(),
          credentials: credentials.trim(),
        },
      })

      // Notifikasi admin (kirim ke semua admin)
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }, select: { id: true },
      })
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map(a => ({
            userId:  a.id,
            actorId: req.userId,
            type:    'SYSTEM',
            message: `Permohonan verifikasi pakar baru dari pengguna (bidang: ${field})`,
          })),
          skipDuplicates: true,
        })
      }

      res.status(201).json({ data: app })
    } catch (e) { next(e) }
  },

  // GET /expert/my-application — status permohonan user sendiri
  myApplication: async (req, res, next) => {
    try {
      const app = await prisma.expertApplication.findFirst({
        where:   { userId: req.userId },
        orderBy: { createdAt: 'desc' },
      })
      res.json({ data: app ?? null })
    } catch (e) { next(e) }
  },

  // GET /admin/expert-applications?status= — list semua permohonan (admin)
  listApplications: async (req, res, next) => {
    try {
      const { status, skip = 0, take = 50 } = req.query
      const apps = await prisma.expertApplication.findMany({
        where:   status ? { status } : {},
        include: {
          user: {
            select: {
              id: true, email: true, role: true,
              profile: { select: { username: true, bio: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip:    parseInt(skip),
        take:    Math.min(parseInt(take), 100),
      })
      res.json({ data: apps })
    } catch (e) { next(e) }
  },

  // PUT /admin/expert-applications/:id  { status: APPROVED|REJECTED, reviewNote? }
  reviewApplication: async (req, res, next) => {
    try {
      const { status, reviewNote } = req.body

      if (!['APPROVED', 'REJECTED'].includes(status))
        return res.status(400).json({ message: 'status harus APPROVED atau REJECTED' })

      const app = await prisma.expertApplication.findUnique({ where: { id: req.params.id } })
      if (!app)    return res.status(404).json({ message: 'Permohonan tidak ditemukan' })
      if (app.status !== 'PENDING')
        return res.status(409).json({ message: 'Permohonan ini sudah diproses sebelumnya' })

      // Update status permohonan
      const updated = await prisma.expertApplication.update({
        where: { id: req.params.id },
        data:  { status, reviewNote: reviewNote?.trim() ?? null },
      })

      if (status === 'APPROVED') {
        // Naikkan role user menjadi EXPERT
        await prisma.user.update({
          where: { id: app.userId },
          data:  { role: 'EXPERT', isVerifiedExpert: true },
        })
        // Berikan badge verified_expert
        await badgeSvc.awardSlug(app.userId, 'verified_expert')
      }

      // Notifikasi hasil ke pemohon
      await prisma.notification.create({
        data: {
          userId:  app.userId,
          type:    'SYSTEM',
          message: status === 'APPROVED'
            ? '🎉 Permohonan pakar kamu disetujui! Kamu kini menjadi Pakar Terverifikasi.'
            : `❌ Permohonan pakar kamu ditolak.${reviewNote ? ` Catatan: ${reviewNote}` : ''}`,
        },
      }).catch(() => {})

      res.json({ data: updated })
    } catch (e) { next(e) }
  },
}


