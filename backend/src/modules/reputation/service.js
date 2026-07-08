'use strict'
const prisma = require('../../config/prisma')

exports.addPoint = async (userId, point, reason) => {
  const log = await prisma.reputationLog.create({ data: { userId, point, reason } })

  // Lazy-load untuk menghindari circular dependency
  const badgeSvc = require('../badge/service')
  badgeSvc.checkAndAward(userId).catch(() => {})

  return log
}

exports.getTotal = async (userId) => {
  const result = await prisma.reputationLog.aggregate({
    where: { userId }, _sum: { point: true },
  })
  return result._sum.point ?? 0
}


