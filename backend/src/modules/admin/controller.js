'use strict'
const service = require('./service')
const moderatorSvc = require('../moderator/service')
const prisma = require('../../config/prisma')

exports.users = async (req, res, next) => {
  try {
    const { role, isBanned, skip = 0, take = 50 } = req.query
    const users = await service.listUsers({
      role: role?.toUpperCase(),
      isBanned: isBanned !== undefined ? isBanned === 'true' : undefined,
      skip: parseInt(skip),
      take: Math.min(parseInt(take), 100),
    })
    res.json({ data: users })
  } catch (e) { next(e) }
}

exports.verifyExpert = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true } })
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
    const updated = await service.verifyExpert(req.params.id)
    res.json({ data: updated })
  } catch (e) { next(e) }
}

exports.revokeExpert = async (req, res, next) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: 'USER', isVerifiedExpert: false },
      select: { id: true, email: true, role: true, isVerifiedExpert: true, isBanned: true, profile: true },
    })
    res.json({ data: updated })
  } catch (e) { next(e) }
}

exports.banUser = async (req, res, next) => {
  try {
    if (req.params.id === req.userId)
      return res.status(400).json({ message: 'Tidak bisa ban diri sendiri' })
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, role: true } })
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
    if (user.role === 'ADMIN')
      return res.status(403).json({ message: 'Tidak bisa ban admin lain' })
    await moderatorSvc.banUser(req.params.id)
    res.json({ message: 'Pengguna telah dinonaktifkan' })
  } catch (e) { next(e) }
}

exports.unbanUser = async (req, res, next) => {
  try {
    await moderatorSvc.unbanUser(req.params.id)
    res.json({ message: 'Pengguna telah diaktifkan kembali' })
  } catch (e) { next(e) }
}

exports.setRole = async (req, res, next) => {
  try {
    const { role } = req.body
    const VALID_ROLES = ['USER', 'EXPERT', 'MODERATOR', 'ADMIN']
    if (!VALID_ROLES.includes(role))
      return res.status(400).json({ message: `role harus salah satu dari: ${VALID_ROLES.join(', ')}` })
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data:  { role },
      select: { id: true, email: true, role: true, isVerifiedExpert: true, isBanned: true, profile: true },
    })
    res.json({ data: updated })
  } catch (e) { next(e) }
}

exports.stats = async (req, res, next) => {
  try {
    const [users, discussions, comments, reports, experts, moderators, bannedUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.discussion.count(),
        prisma.comment.count(),
        prisma.report.count({ where: { status: 'PENDING' } }),
        prisma.user.count({ where: { role: 'EXPERT' } }),
        prisma.user.count({ where: { role: 'MODERATOR' } }),
        prisma.user.count({ where: { isBanned: true } }),
      ])
    res.json({ data: { users, discussions, comments, pendingReports: reports, experts, moderators, bannedUsers } })
  } catch (e) { next(e) }
}


