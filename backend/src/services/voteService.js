const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const reputationService = require('./reputationService');
const { sendNotification } = require('./notificationService'); // FIX

exports.voteDiscussion = async (user, discussionId, type) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion)
    throw new AppError('Discussion not found', 404);

  if (discussion.userId === user.id)
    throw new AppError('Cannot vote your own discussion', 403);

  const vote = await prisma.discussionVote.upsert({
    where: {
      userId_discussionId: {
        userId: user.id,
        discussionId,
      },
    },
    update: { type },
    create: { userId: user.id, discussionId, type },
  });

  // 🔔 NOTIFICATION: VOTE
  await sendNotification({
    userId: discussion.userId,
    title: 'Vote baru',
    message: `Diskusi Anda mendapatkan ${type === 'Up' ? 'upvote' : 'downvote'}`,
    channel: 'InApp',
  });

  return vote;
};
