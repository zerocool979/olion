const prisma = require('../../config/prisma')

exports.create = async (data, userId) => {
  const { content, discussionId, parentId } = data

  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } })
    if (!parent || parent.discussionId !== discussionId) {
      throw new Error('Komentar induk tidak valid')
    }
  }

  return prisma.comment.create({
    data: {
      content,
      discussionId,
      userId,
      parentId: parentId || null,
    },
    include: {
      user: { include: { profile: true } },
      replies: true,
    },
  })
}

exports.getByDiscussion = (discussionId) => {
  return prisma.comment.findMany({
    where: { discussionId, isHidden: false, parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { include: { profile: true } },
      replies: {
        include: {
          user: { include: { profile: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { votes: true } },
    },
  })
}
