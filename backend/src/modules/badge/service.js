'use strict'
const prisma = require('../../config/prisma')

// Badge bawaan yang di-seed ke DB
const SEED_BADGES = [
  { slug: 'first_post',      name: 'Penulis Pertama',  description: 'Membuat diskusi pertama',        icon: '✍️',  threshold: 0   },
  { slug: 'reputation_50',   name: 'Kontributor',      description: 'Mencapai 50 poin reputasi',      icon: '⭐',  threshold: 50  },
  { slug: 'reputation_100',  name: 'Terpercaya',       description: 'Mencapai 100 poin reputasi',     icon: '🌟',  threshold: 100 },
  { slug: 'reputation_500',  name: 'Pakar Komunitas',  description: 'Mencapai 500 poin reputasi',     icon: '🏆',  threshold: 500 },
  { slug: 'reputation_1000', name: 'Legenda',          description: 'Mencapai 1000 poin reputasi',    icon: '💎',  threshold: 1000},
  { slug: 'first_answer',    name: 'Penolong',         description: 'Memberikan komentar pertama',    icon: '💬',  threshold: 0   },
  { slug: 'verified_expert', name: 'Pakar Terverifikasi', description: 'Diverifikasi sebagai pakar', icon: '✅',  threshold: 0   },
]

// Cek dan berikan badge reputasi yang belum dimiliki user
exports.checkAndAward = async (userId) => {
  try {
    const [totalRep, owned, badges] = await Promise.all([
      prisma.reputationLog.aggregate({ where: { userId }, _sum: { point: true } }),
      prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
      prisma.badge.findMany({ where: { threshold: { gt: 0 } } }),
    ])

    const reputation = totalRep._sum.point ?? 0
    const ownedIds   = new Set(owned.map(b => b.badgeId))
    const toAward    = badges.filter(b => b.threshold <= reputation && !ownedIds.has(b.id))

    if (toAward.length > 0) {
      await prisma.userBadge.createMany({
        data: toAward.map(b => ({ userId, badgeId: b.id })),
        skipDuplicates: true,
      })

      // Notifikasi untuk setiap badge baru
      await prisma.notification.createMany({
        data: toAward.map(b => ({
          userId,
          type:    'SYSTEM',
          message: `Selamat! Kamu mendapat badge "${b.name}" ${b.icon}`,
        })),
        skipDuplicates: true,
      })
    }

    return toAward
  } catch (err) {
    // Jangan crash endpoint utama
    console.error('[badge] checkAndAward error:', err.message)
    return []
  }
}

// Award badge spesifik (first_post, first_answer, verified_expert)
exports.awardSlug = async (userId, slug) => {
  try {
    const badge = await prisma.badge.findUnique({ where: { slug } })
    if (!badge) return

    await prisma.userBadge.upsert({
      where:  { userId_badgeId: { userId, badgeId: badge.id } },
      update: {},
      create: { userId, badgeId: badge.id },
    })

    await prisma.notification.create({
      data: {
        userId,
        type:    'SYSTEM',
        message: `Selamat! Kamu mendapat badge "${badge.name}" ${badge.icon}`,
      },
    }).catch(() => {})
  } catch (err) {
    console.error('[badge] awardSlug error:', err.message)
  }
}

exports.getByUser  = (userId) =>
  prisma.userBadge.findMany({
    where:   { userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  })

exports.getAll = () => prisma.badge.findMany({ orderBy: { threshold: 'asc' } })

exports.SEED_BADGES = SEED_BADGES


