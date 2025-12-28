const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

exports.createComment = async (userId, discussionId, content) => {
  if (!content || content.trim() === '')
    throw new AppError('Content is required', 400);

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted)
    throw new AppError('Discussion not found', 404);

  const comment = await prisma.comment.create({
    data: { userId, discussionId, content },
  });

  // 🔔 NOTIFICATION: COMMENT CREATED
  await sendNotification({
    userId: discussion.userId,
    title: 'Komentar baru',
    message: 'Diskusi Anda mendapat komentar baru',
    channel: 'InApp',
  });

  return comment;
};
