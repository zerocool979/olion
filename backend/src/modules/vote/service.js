const prisma = require('../../config/prisma')

exports.vote = async (userId, discussionId, value) => {
  return prisma.vote.upsert({
    where: {
      userId_discussionId: { userId, discussionId }
    },
    update: { value },
    create: { userId, discussionId, value }
  })
}
