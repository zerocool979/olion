const prisma = require('../../config/prisma')

exports.vote = async (userId, discussionId, commentId, value) => {
  if (!discussionId && !commentId) throw new Error('Target vote diperlukan')
  if (discussionId && commentId) throw new Error('Hanya bisa vote satu target')
  if (value === 0) {
    if (discussionId) {
      await prisma.vote.deleteMany({
        where: { userId, discussionId },
      })
    } else {
      await prisma.vote.deleteMany({
        where: { userId, commentId },
      })
    }
    return { voted: null }
  }
  if (discussionId) {
    const d = await prisma.discussion.findUnique({ where: { id: discussionId } })
    if (!d) throw new Error('Diskusi tidak ditemukan')
  } else {
    const c = await prisma.comment.findUnique({ where: { id: commentId } })
    if (!c) throw new Error('Komentar tidak ditemukan')
  }
  const vote = await prisma.vote.upsert({
    where: {
      userId_discussionId: discussionId ? { userId, discussionId } : undefined,
      userId_commentId: commentId ? { userId, commentId } : undefined,
    },
    update: { value },
    create: {
      value,
      userId,
      discussionId: discussionId || null,
      commentId: commentId || null,
    },
  })

  return vote
}
