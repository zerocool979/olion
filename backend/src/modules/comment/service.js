const prisma = require('../../config/prisma')

exports.create = (data, userId) =>
  prisma.comment.create({
    data: {
      content: data.content,
      discussionId: data.discussionId,
      userId
    },
    include: { user: true }
  })
