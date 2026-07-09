'use strict'
const prisma = require('../../config/prisma')

exports.verifyExpert = (userId) =>
  prisma.user.update({
    where: { id: userId },
    data:  { role: 'EXPERT', isVerifiedExpert: true },
    select: { id: true, email: true, role: true, isVerifiedExpert: true, profile: true },
  })

exports.listUsers = ({ role, isBanned, skip = 0, take = 50 } = {}) =>
  prisma.user.findMany({
    where: {
      ...(role      !== undefined ? { role }     : {}),
      ...(isBanned  !== undefined ? { isBanned } : {}),
    },
    select: {
      id: true,
      email: true,
      role: true,
      isBanned: true,
      isVerifiedExpert: true,
      createdAt: true,
      profile: true,
      _count: { select: { discussions: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })


