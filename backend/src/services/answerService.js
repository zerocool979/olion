const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

/**
 * FIX:
 * - parameter pertama HARUS user object, bukan userId
 * - user.role dipakai untuk isExpertAnswer
 */
exports.create = async (user, discussionId, content) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new AppError('Discussion not found', 404);
  }

  return prisma.answer.create({
    data: {
      content,
      discussionId,
      userId: user.id, // FIX
      isExpertAnswer: user.role === 'PAKAR', // FIX
    },
  });
};

exports.findByDiscussion = async (discussionId) => {
  return prisma.answer.findMany({
    where: { discussionId, isDeleted: false },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          profile: {
            select: { pseudonym: true },
          },
        },
      },
      votes: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

/**
 * SALAH / TIDAK DIPAKAI
 * Function createAnswer & getAnswersByDiscussion tidak ada implementasinya
 * Jangan dihapus sesuai instruksi, hanya dikomentari
 */
// module.exports = {
//   createAnswer,
//   getAnswersByDiscussion,
// };

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
 * ADMIN / MODERATOR
 * Approve answer
 */
exports.approve = async (id, moderatorId) => {
  const answer = await prisma.answer.update({
    where: { id },
    data: {
      moderation: 'Approved',
      isFlagged: false,
    },
  });
  await logModeration({
    moderatorId,
    action: 'Ignore', // atau Approved jika enum ditambah
  });

  return answer;
};

/**
 * ADMIN / MODERATOR
 * Reject answer
 */
exports.reject = async (id, moderatorId) => {
  const answer = await prisma.answer.update({
    where: { id },
    data: {
      moderation: 'Rejected',
      isFlagged: true,
    },
  });
  await logModeration({
    moderatorId,
    action: 'Hide',
  });

  return answer;
};


/**
 * ADMIN / MODERATOR
 * Soft delete answer
 */
exports.adminDelete = async (id, moderatorId) => {
  const answer = await prisma.answer.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  await logModeration({
    moderatorId,
    action: 'Delete',
  });

  return answer;
};

const logModeration = async ({ moderatorId, action, answerReportId = null }) => {
  return prisma.moderation.create({
    data: {
      moderatorId,
      action,
      source: 'ANSWER',
      answerReportId,
    },
  });
};
