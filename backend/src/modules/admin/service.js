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
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  })


