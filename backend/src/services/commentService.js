const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

/* =======================
   CREATE COMMENT
======================= */
exports.createComment = async (userId, discussionId, content) => {
  if (!content || content.trim() === '')
    throw new AppError('Content is required', 400);

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted)
    throw new AppError('Discussion not found', 404);

  return prisma.comment.create({
    data: {
      userId,
      discussionId,
      content,
    },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });
};

/* =======================
   LIST COMMENTS
======================= */
exports.listByDiscussion = async (discussionId) => {
  return prisma.comment.findMany({
    where: {
      discussionId,
      isDeleted: false,
    },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { id: true, role: true },
      },
    },
  });
};

/* =======================
   DELETE COMMENT
======================= */
exports.deleteComment = async (userId, commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new AppError('Comment not found', 404);
  if (comment.userId !== userId)
    throw new AppError('Forbidden', 403);

  await prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true },
  });
};
