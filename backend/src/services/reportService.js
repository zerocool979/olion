const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.reportDiscussion = async (userId, discussionId, data) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new AppError('Discussion not found', 404);
  }

  return prisma.discussionReport.create({
    data: {
      reporterId: userId,
      discussionId,
      reason: data.reason,
      priority: data.priority,
    },
  });
};

exports.reportAnswer = async (userId, answerId, body) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });
  if (!answer)
    throw new AppError('Answer not found', 404);

  return prisma.answerReport.create({
    data: {
      reporterId: userId,
      answerId,
      reason: body.reason,
      priority: body.priority,
      aiScore: body.aiScore ?? null,
    },
  });
};

exports.reportComment = async (userId, commentId, body) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment)
    throw new AppError('Comment not found', 404);

  return prisma.commentReport.create({
    data: {
      reporterId: userId,
      commentId,
      reason: body.reason,
      priority: body.priority,
      aiScore: body.aiScore ?? null,
    },
  });
};
