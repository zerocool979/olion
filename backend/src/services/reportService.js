const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

exports.reportDiscussion = async (userId, discussionId, data) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion) {
    throw new AppError('Discussion not found', 404);
  }

  const report = await prisma.discussionReport.create({
    data: {
      reporterId: userId,
      discussionId,
      reason: data.reason,
      priority: data.priority,
    },
  });

  // 🔔 NOTIFICATION → ADMIN
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  for (const admin of admins) {
    await sendNotification({
      userId: admin.id,
      title: 'Laporan diskusi baru',
      message: 'Ada laporan diskusi baru yang perlu ditinjau',
      channel: 'InApp',
    });
  }

  return report;
};

exports.reportAnswer = async (userId, answerId, body) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer)
    throw new AppError('Answer not found', 404);

  const report = await prisma.answerReport.create({
    data: {
      reporterId: userId,
      answerId,
      reason: body.reason,
      priority: body.priority,
      aiScore: body.aiScore ?? null,
    },
  });

  // 🔔 NOTIFICATION → ADMIN
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  for (const admin of admins) {
    await sendNotification({
      userId: admin.id,
      title: 'Laporan jawaban baru',
      message: 'Ada laporan jawaban baru yang perlu ditinjau',
      channel: 'InApp',
    });
  }

  return report;
};

exports.reportComment = async (userId, commentId, body) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment)
    throw new AppError('Comment not found', 404);

  const report = await prisma.commentReport.create({
    data: {
      reporterId: userId,
      commentId,
      reason: body.reason,
      priority: body.priority,
      aiScore: body.aiScore ?? null,
    },
  });

  // 🔔 NOTIFICATION → ADMIN
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  for (const admin of admins) {
    await sendNotification({
      userId: admin.id,
      title: 'Laporan komentar baru',
      message: 'Ada laporan komentar baru yang perlu ditinjau',
      channel: 'InApp',
    });
  }

  return report;
};
