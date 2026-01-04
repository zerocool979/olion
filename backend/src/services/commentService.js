const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService');
const { normalizeComment, normalizeCommentList } = require('./normalizers/commentNormalizer');

/**
 * DATA CONTRACT:
 * - Frontend menerima `author`
 * - Prisma relasi = `user`
 * - Normalisasi dilakukan di service
 * - Controller tidak transform data
 */

/**
 * Get default user selection for comment queries
 */
const getUserSelect = (includeProfile = false) => ({
  select: {
    id: true,
    email: true,
    username: true,
    role: true,
    ...(includeProfile && {
      profile: {
        select: {
          pseudonym: true,
          avatarUrl: true
        }
      }
    })
  }
});

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
    },
    include: {
      user: getUserSelect(true),
    },
  });

  // 🔔 NOTIFICATION: COMMENT CREATED
  await sendNotification({
    userId: discussion.userId,
    title: 'Komentar baru',
    message: 'Diskusi Anda mendapat komentar baru',
    channel: 'InApp',
  });

  return normalizeComment(comment);
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
      discussionId: answer.discussionId,
      content,
    },
    include: {
      user: getUserSelect(true),
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

  return normalizeComment(comment);
};

/* =====================================================
   LIST COMMENTS BY DISCUSSION (ONLY ROOT COMMENTS)
   ===================================================== */
exports.listByDiscussion = async (discussionId) => {
  const comments = await prisma.comment.findMany({
    where: {
      discussionId,
      answerId: null,
      isDeleted: false,
    },
    include: {
      user: getUserSelect(true),
    },
    orderBy: { createdAt: 'asc' },
  });

  return normalizeCommentList(comments);
};

/* =====================================================
   LIST COMMENTS BY ANSWER (NEW)
   ===================================================== */
exports.listByAnswer = async (answerId) => {
  const comments = await prisma.comment.findMany({
    where: {
      answerId,
      isDeleted: false,
    },
    include: {
      user: getUserSelect(true),
    },
    orderBy: { createdAt: 'asc' },
  });

  return normalizeCommentList(comments);
};

/* =====================================================
   GET COMMENT BY ID
   ===================================================== */
exports.findById = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: getUserSelect(true),
      discussion: {
        select: {
          id: true,
          title: true,
        },
      },
      answer: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  });

  if (!comment || comment.isDeleted) {
    throw new AppError('Comment not found', 404);
  }

  return normalizeComment(comment);
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

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: getUserSelect(true),
    },
  });

  return normalizeComment(updated);
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

  const deleted = await prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true },
    include: {
      user: getUserSelect(true),
    },
  });

  return normalizeComment(deleted);
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

  const deleted = await prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true },
    include: {
      user: getUserSelect(true),
    },
  });

  return normalizeComment(deleted);
};
