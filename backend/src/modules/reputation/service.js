const prisma = require('../../config/prisma')

exports.addPoint = (userId, point, reason) =>
  prisma.reputationLog.create({
    data: { userId, point, reason }
  })

exports.getTotal = async userId => {
  const result = await prisma.reputationLog.aggregate({
    where: { userId },
    _sum: { point: true }
  })
  return result._sum.point || 0
}
