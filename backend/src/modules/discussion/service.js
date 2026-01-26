const prisma = require('../../config/prisma')

exports.create = (data, userId) =>
  prisma.discussion.create({
    data: { ...data, userId }
  })

exports.list = () =>
  prisma.discussion.findMany({
    where: { isHidden: false },
    include: { user: { include: { profile: true } }, category: true }
  })
