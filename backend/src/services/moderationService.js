const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const reputationService = require('./reputationService');
const notificationService = require('./notificationService');

/* =======================
   CONSTANTS
======================= */

const REPUTATION_RULES = {
  Delete: -10,
  Hide: -5,
  Warning: -2,
  Ignore: 0,
};

/* =======================
   HELPERS
======================= */

const getReportModel = (source) => {
  switch (source) {
    case 'DISCUSSION':
      return prisma.discussionReport;
    case 'ANSWER':
      return prisma.answerReport;
    case 'COMMENT':
      return prisma.commentReport;
    default:
      throw new AppError('Invalid moderation source', 400);
  }
};

const getTargetModel = (source) => {
  switch (source) {
    case 'DISCUSSION':
      return prisma.discussion;
    case 'ANSWER':
      return prisma.answer;
    case 'COMMENT':
      return prisma.comment;
    default:
      throw new AppError('Invalid target source', 400);
  }
};

const applyAction = async (source, targetId, action) => {
  if (action === 'Hide' || action === 'Delete') {
    const model = getTargetModel(source);
    await model.update({
      where: { id: targetId },
      data: { isDeleted: true },
    });
  }
};

/* =======================
   MAIN MODERATION
======================= */

exports.moderate = async (moderatorId, source, reportId, action, note) => {
  const reportModel = getReportModel(source);
  const targetModel = getTargetModel(source);

  /* 1️⃣ LOAD REPORT */
  const report = await reportModel.findUnique({
    where: { id: reportId },
  });

  if (!report) throw new AppError('Report not found', 404);
  if (report.status !== 'Pending')
    throw new AppError('Report already processed', 400);

  /* 2️⃣ TARGET ID */
  const targetId =
    source === 'DISCUSSION'
      ? report.discussionId
      : source === 'ANSWER'
      ? report.answerId
      : report.commentId;

  /* 3️⃣ LOAD TARGET */
  const target = await targetModel.findUnique({
    where: { id: targetId },
    select: { userId: true },
  });

  if (!target?.userId)
    throw new AppError('Target owner not found', 404);

  /* 4️⃣ APPLY ACTION */
  await applyAction(source, targetId, action);


  /* 5️⃣ UPDATE REPORT */
  await reportModel.update({
    where: { id: reportId },
    data: { status: 'Resolved' },
  });

  /* 6️⃣ CREATE MODERATION (INI KUNCI UTAMA) */
  const moderationData = {
    moderatorId,
    action,
    source,
    note,
  };

  if (source === 'DISCUSSION') {
    moderationData.discussionReportId = reportId;
  } else if (source === 'ANSWER') {
    moderationData.answerReportId = reportId;
  } else if (source === 'COMMENT') {
    moderationData.commentReportId = reportId;
  }

  const moderation = await prisma.moderation.create({
    data: moderationData,
  })

  /* 7️⃣ REPUTATION */
  const delta = REPUTATION_RULES[action] ?? 0;
  await reputationService.addModerationReputation({
    userId: target.userId,
    delta,
    action,
    source,
    moderationId: moderation.id,
  });

  /* 8️⃣ NOTIFICATION */
  await notificationService.sendNotification({
    userId: target.userId,
    title: 'Konten Anda dimoderasi',
    message: `Konten ${source.toLowerCase()} Anda dikenai tindakan: ${action}${
      note ? `. Catatan: ${note}` : ''
    }`,
    channel: 'InApp',
  });

  return moderation;
};
