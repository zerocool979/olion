const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

/**
 * =====================================================
 * CREATE ANSWER
 * =====================================================
 */
exports.create = async (user, discussionId, content) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new AppError('Discussion not found', 404);
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      discussionId,
      userId: user.id,
      isExpertAnswer: user.role === 'PAKAR',
    },
  });

  // 🔔 NOTIFICATION: ANSWER CREATED
  await sendNotification({
    userId: discussion.userId,
    title: 'Jawaban baru',
    message: 'Diskusi Anda mendapatkan jawaban baru',
    channel: 'InApp',
  });

  return answer;
};

/**
 * =====================================================
 * GET ANSWERS BY DISCUSSION
 * =====================================================
 */
exports.findByDiscussion = async (discussionId) => {
  return prisma.answer.findMany({
    where: {
      discussionId,
      isDeleted: false,
      moderation: 'Approved', // FIX: hanya jawaban valid
    },

    include: {
      // FIX: author untuk frontend
      user: {
        select: {
          id: true,
          role: true,
          profile: {
            select: { pseudonym: true },
          },
        },
      },

      // OLD (masih dipertahankan)
      votes: true,

      // FIX: hitung vote & comment tanpa query tambahan
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },

    orderBy: { createdAt: 'asc' },
  });
};

/**
 * =====================================================
 * UPDATE ANSWER (OWNER ONLY)
 * =====================================================
 */
exports.update = async (id, user, content) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer || answer.isDeleted) {
    throw new AppError('Answer not found', 404);
  }

  if (answer.userId !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  return prisma.answer.update({
    where: { id },
    data: { content },
  });
};

/**
 * =====================================================
 * DELETE ANSWER (OWNER / ADMIN)
 * =====================================================
 */
exports.remove = async (id, user) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  if (answer.userId !== user.id && user.role !== 'ADMIN') {
    throw new AppError('Forbidden', 403);
  }

  return prisma.answer.update({
    where: { id },
    data: { isDeleted: true },
  });
};

/**
 * =====================================================
 * ADMIN / MODERATOR ACTIONS
 * =====================================================
 */
exports.approve = async (id, moderatorId) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  const updated = await prisma.answer.update({
    where: { id },
    data: {
      moderation: 'Approved',
      isFlagged: false,
      isVerified: true, // FIX: konsisten dengan schema
    },
  });

  // 🔔 NOTIFICATION: ANSWER APPROVED
  if (answer.userId) {
    await sendNotification({
      userId: answer.userId,
      title: 'Jawaban disetujui',
      message: 'Jawaban Anda telah disetujui moderator',
      channel: 'InApp',
    });
  }

  return updated;
};

exports.reject = async (id, moderatorId) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  const updated = await prisma.answer.update({
    where: { id },
    data: {
      moderation: 'Rejected',
      isFlagged: true,
    },
  });

  // 🔔 NOTIFICATION: ANSWER REJECTED
  if (answer.userId) {
    await sendNotification({
      userId: answer.userId,
      title: 'Jawaban ditolak',
      message: 'Jawaban Anda ditolak moderator',
      channel: 'InApp',
    });
  }

  return updated;
};

/**
 * =====================================================
 * ADMIN DELETE (SOFT)
 * =====================================================
 */
exports.adminDelete = async (id) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  return prisma.answer.update({
    where: { id },
    data: { isDeleted: true },
  });
};
