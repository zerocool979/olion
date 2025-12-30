const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

/* =====================================================
   CREATE COMMENT ON DISCUSSION (EXISTING)
   ===================================================== */
exports.createComment = async (userId, discussionId, content) => {
  if (!content || content.trim() === '')
    throw new AppError('Content is required', 400);

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted)
    throw new AppError('Discussion not found', 404);

  const comment = await prisma.comment.create({
    data: {
      userId,
      discussionId,
      content,
      // answerId: null // implicit, komentar langsung ke diskusi
    },
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

/* =====================================================
   CREATE COMMENT ON ANSWER (NEW)
   ===================================================== */
exports.createCommentOnAnswer = async (userId, answerId, content) => {
  if (!content || content.trim() === '')
    throw new AppError('Content is required', 400);

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { discussion: true },
  });

  if (!answer || answer.isDeleted)
    throw new AppError('Answer not found', 404);

  const comment = await prisma.comment.create({
    data: {
      userId,
      answerId,
      discussionId: answer.discussionId, // FIX: konsistensi relasi
      content,
    },
  });

  // 🔔 NOTIFICATION: COMMENT ON ANSWER
  if (answer.userId) {
    await sendNotification({
      userId: answer.userId,
      title: 'Komentar pada jawaban',
      message: 'Jawaban Anda mendapat komentar',
      channel: 'InApp',
    });
  }

  return comment;
};

/* =====================================================
   LIST COMMENTS BY DISCUSSION (ONLY ROOT COMMENTS)
   ===================================================== */
exports.listByDiscussion = async (discussionId) => {
  return prisma.comment.findMany({
    where: {
      discussionId,
      answerId: null, // FIX: hanya komentar langsung ke diskusi
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          profile: { select: { pseudonym: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

/* =====================================================
   LIST COMMENTS BY ANSWER (NEW)
   ===================================================== */
exports.listByAnswer = async (answerId) => {
  return prisma.comment.findMany({
    where: {
      answerId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          profile: { select: { pseudonym: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

/* =====================================================
   UPDATE COMMENT (OWNER)
   ===================================================== */
exports.updateComment = async (userId, commentId, content) => {
  if (!content || content.trim() === '')
    throw new AppError('Content is required', 400);

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.isDeleted)
    throw new AppError('Comment not found', 404);

  if (comment.userId !== userId)
    throw new AppError('Forbidden', 403);

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

/* =====================================================
   DELETE COMMENT (OWNER) — SOFT DELETE
   ===================================================== */
exports.deleteComment = async (userId, commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.isDeleted)
    throw new AppError('Comment not found', 404);

  if (comment.userId !== userId)
    throw new AppError('Forbidden', 403);

  return prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true },
  });
};

/* =====================================================
   ADMIN DELETE COMMENT — SOFT DELETE
   ===================================================== */
exports.adminDelete = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.isDeleted)
    throw new AppError('Comment not found', 404);

  return prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true },
  });
};
