'use strict'
const prisma = require('../../config/prisma')
const reputationSvc = require('../reputation/service')

const PUBLIC_USER_SELECT = {
  id: true, role: true, isVerifiedExpert: true, isBanned: true, createdAt: true,
  profile: { select: { username: true, bio: true } },
  _count:  { select: { discussions: true, comments: true, followers: true, following: true } },
}

async function withReputation(user) {
  const agg = await prisma.reputationLog.aggregate({
    where: { userId: user.id }, _sum: { point: true },
  })
  return { ...user, reputation: agg._sum.point ?? 0 }
}

module.exports = {
  // GET /users/:id
  detail: async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id }, select: PUBLIC_USER_SELECT,
      })
      if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
      res.json({ user: await withReputation(user) })
    } catch (err) { next(err) }
  },

  // GET /users?role=&sort=reputation&limit=&username=
  list: async (req, res, next) => {
    try {
      const { role, sort, limit, username } = req.query
      const take = Math.min(parseInt(limit, 10) || 20, 50)
      const where = { isBanned: false }

      if (username) {
        where.profile = { username: { contains: username, mode: 'insensitive' } }
      }
      if (role) where.role = role.toUpperCase()

      let users = await prisma.user.findMany({
        where, select: PUBLIC_USER_SELECT,
        take: sort === 'reputation' ? undefined : take,
      })

      if (sort === 'reputation') {
        // Batched aggregate untuk sort reputasi — satu query per batch, bukan per user
        const userIds = users.map(u => u.id)
        const logs = await prisma.reputationLog.groupBy({
          by: ['userId'],
          _sum: { point: true },
          where: { userId: { in: userIds } },
        })
        const repMap = {}
        for (const l of logs) repMap[l.userId] = l._sum.point ?? 0
        users = users
          .map(u => ({ ...u, reputation: repMap[u.id] ?? 0 }))
          .sort((a, b) => b.reputation - a.reputation)
          .slice(0, take)
      }

      res.json({ data: users })
    } catch (err) { next(err) }
  },

  // PATCH /users/me/profile  { username?, bio? }
  updateProfile: async (req, res, next) => {
    try {
      const { username, bio } = req.body
      const data = {}

      if (username !== undefined) {
        const trimmed = username.trim()
        if (!trimmed || trimmed.length < 3)
          return res.status(400).json({ message: 'Username minimal 3 karakter' })
        if (trimmed.length > 30)
          return res.status(400).json({ message: 'Username maksimal 30 karakter' })
        if (!/^[a-zA-Z0-9_]+$/.test(trimmed))
          return res.status(400).json({ message: 'Username hanya boleh huruf, angka, dan underscore' })
        const existing = await prisma.profile.findUnique({ where: { username: trimmed } })
        if (existing && existing.userId !== req.userId)
          return res.status(409).json({ message: 'Username sudah dipakai' })
        data.username = trimmed
      }
      if (bio !== undefined) data.bio = bio.trim().slice(0, 300)

      const profile = await prisma.profile.update({
        where: { userId: req.userId }, data,
        select: { username: true, bio: true },
      })
      res.json({ profile })
    } catch (err) { next(err) }
  },

  // POST /users/:id/follow
  follow: async (req, res, next) => {
    try {
      const followingId = req.params.id
      if (followingId === req.userId)
        return res.status(400).json({ message: 'Tidak bisa mengikuti diri sendiri' })

      const target = await prisma.user.findUnique({ where: { id: followingId } })
      if (!target) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })

      const follow = await prisma.follow.upsert({
        where: { followerId_followingId: { followerId: req.userId, followingId } },
        update: {},
        create: { followerId: req.userId, followingId },
      })

      prisma.notification.create({
        data: { userId: followingId, actorId: req.userId, type: 'FOLLOW', message: 'mulai mengikuti kamu' },
      }).catch(() => {})

      res.status(201).json({ follow })
    } catch (err) { next(err) }
  },

  // DELETE /users/:id/follow
  unfollow: async (req, res, next) => {
    try {
      await prisma.follow.deleteMany({ where: { followerId: req.userId, followingId: req.params.id } })
      res.json({ message: 'Berhenti mengikuti' })
    } catch (err) { next(err) }
  },

  // GET /users/:username/followers
  followers: async (req, res, next) => {
    try {
      const profile = await prisma.profile.findUnique({ where: { username: req.params.username } })
      if (!profile) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
      const follows = await prisma.follow.findMany({
        where: { followingId: profile.userId },
        include: { follower: { select: PUBLIC_USER_SELECT } },
        orderBy: { createdAt: 'desc' },
      })
      res.json({ data: follows.map(f => f.follower) })
    } catch (err) { next(err) }
  },

  // GET /users/:username/following
  followingList: async (req, res, next) => {
    try {
      const profile = await prisma.profile.findUnique({ where: { username: req.params.username } })
      if (!profile) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
      const follows = await prisma.follow.findMany({
        where: { followerId: profile.userId },
        include: { following: { select: PUBLIC_USER_SELECT } },
        orderBy: { createdAt: 'desc' },
      })
      res.json({ data: follows.map(f => f.following) })
    } catch (err) { next(err) }
  },
}


