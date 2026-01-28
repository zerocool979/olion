const prisma = require('../../config/prisma')

exports.create = (data, userId) =>
  prisma.discussion.create({
    data: {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      mode: data.mode,
      discipline: data.discipline,
      userId
    }
  })

exports.list = () =>
  prisma.discussion.findMany({
    where: { isHidden: false },
    include: { user: { include: { profile: true } }, category: true }
  })

exports.detail = (id) =>
  prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { include: { profile: true } },
      category: true,
      comments: {
        include: { user: true }
      }
    }
  })
