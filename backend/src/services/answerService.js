const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.create = async (userId, discussionId, content) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });
  if (!discussion)
    throw new AppError('Discussion not found', 404);

  return prisma.answer.create({
    data: {
      content,
      discussionId,
      userId,
    },
  });
};


exports.findByDiscussion = async (discussionId) => {
  return prisma.answer.findMany({
    where: { discussionId, isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });
};
exports.remove = async (id, user) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  if (answer.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  return prisma.answer.update({
    where: { id },
    data: { isDeleted: true },
  });
};
