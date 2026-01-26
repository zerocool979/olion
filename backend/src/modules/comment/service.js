const prisma = require('../../config/prisma')

exports.create = (content, discussionId, userId) =>
  prisma.comment.create({
    data: { content, discussionId, userId }
  })
