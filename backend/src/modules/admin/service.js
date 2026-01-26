const prisma = require('../../config/prisma')

exports.verifyExpert = userId =>
  prisma.user.update({
    where: { id: userId },
    data: { role: 'EXPERT', isVerifiedExpert: true }
  })

exports.listUsers = () =>
  prisma.user.findMany({ include: { profile: true } })
