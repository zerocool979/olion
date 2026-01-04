const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService');
const { normalizeVotes } = require('./normalizers/voteNormalizer');

/**
 * VOTE DISCUSSION
 */
exports.voteDiscussion = async ({ discussionId, userId, type }) => {
  if (!['Up', 'Down'].includes(type)) {
    throw new AppError('Invalid vote type', 400);
  }

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  if (discussion.userId === userId) {
    throw new AppError('Cannot vote your own discussion', 403);
  }

  // UPSERT = idempotent (aman dipanggil berkali-kali)
  await prisma.discussionVote.upsert({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
    update: { type },
    create: {
      userId,
      discussionId,
      type,
    },
  });

  // 🔔 NOTIFICATION: VOTE
  await sendNotification({
    userId: discussion.userId,
    title: 'Vote baru',
    message: `Diskusi Anda mendapatkan ${type === 'Up' ? 'upvote' : 'downvote'}`,
    channel: 'InApp',
  });

  return getVoteSummary(discussionId, userId);
};

/**
 * UNVOTE DISCUSSION
 */
exports.removeVote = async ({ discussionId, userId }) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  // DELETE MANY = idempotent (aman meskipun record tidak ada)
  await prisma.discussionVote.deleteMany({
    where: { userId, discussionId },
  });

  return getVoteSummary(discussionId, userId);
};

/**
 * GET VOTE SUMMARY
 */
async function getVoteSummary(discussionId, userId) {
  const votes = await prisma.discussionVote.findMany({
    where: { discussionId },
    select: {
      type: true,
      userId: true,
    },
  });

  return normalizeVotes({ votes, userId });
}

/**
 * VOTE ANSWER
 */
exports.voteAnswer = async ({ answerId, userId, type }) => {
  if (!['Up', 'Down'].includes(type)) {
    throw new AppError('Invalid vote type', 400);
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer || answer.isDeleted) {
    throw new AppError('Answer not found', 404);
  }

  if (answer.userId === userId) {
    throw new AppError('Cannot vote your own answer', 403);
  }

  // UPSERT = idempotent
  await prisma.answerVote.upsert({
    where: {
      userId_answerId: {
        userId,
        answerId,
      },
    },
    update: { type },
    create: {
      userId,
      answerId,
      type,
    },
  });

  // 🔔 NOTIFICATION: VOTE ON ANSWER
  if (answer.userId) {
    await sendNotification({
      userId: answer.userId,
      title: 'Vote pada jawaban',
      message: `Jawaban Anda mendapatkan ${type === 'Up' ? 'upvote' : 'downvote'}`,
      channel: 'InApp',
    });
  }

  return getAnswerVoteSummary(answerId, userId);
};

/**
 * UNVOTE ANSWER
 */
exports.removeAnswerVote = async ({ answerId, userId }) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer || answer.isDeleted) {
    throw new AppError('Answer not found', 404);
  }

  await prisma.answerVote.deleteMany({
    where: { userId, answerId },
  });

  return getAnswerVoteSummary(answerId, userId);
};

/**
 * GET ANSWER VOTE SUMMARY
 */
async function getAnswerVoteSummary(answerId, userId) {
  const votes = await prisma.answerVote.findMany({
    where: { answerId },
    select: {
      type: true,
      userId: true,
    },
  });

  return normalizeVotes({ votes, userId });
}
