const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

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

exports.findByDiscussion = async (discussionId) => {
  return prisma.answer.findMany({
    where: { discussionId, isDeleted: false },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          profile: { select: { pseudonym: true } },
        },
      },
      votes: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

exports.approve = async (id, moderatorId) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  const updated = await prisma.answer.update({
    where: { id },
    data: { moderation: 'Approved', isFlagged: false },
  });

  // 🔔 NOTIFICATION: ANSWER APPROVED
  await sendNotification({
    userId: answer.userId,
    title: 'Jawaban disetujui',
    message: 'Jawaban Anda telah disetujui moderator',
    channel: 'InApp',
  });

  return updated;
};

exports.reject = async (id, moderatorId) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  const updated = await prisma.answer.update({
    where: { id },
    data: { moderation: 'Rejected', isFlagged: true },
  });

  // 🔔 NOTIFICATION: ANSWER REJECTED
  await sendNotification({
    userId: answer.userId,
    title: 'Jawaban ditolak',
    message: 'Jawaban Anda ditolak moderator',
    channel: 'InApp',
  });

  return updated;
};
