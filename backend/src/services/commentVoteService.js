const prisma = require('../prisma');
const { normalizeVotes } = require('./normalizers/voteNormalizer');

exports.voteComment = async ({ commentId, userId, type }) => {
  if (!['UP', 'DOWN'].includes(type)) {
    throw new Error('Invalid vote type');
  }

  await prisma.commentVote.upsert({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
    update: { type },
    create: {
      userId,
      commentId,
      type,
    },
  });

  return getVoteSummary(commentId, userId);
};

exports.removeVote = async ({ commentId, userId }) => {
  await prisma.commentVote.deleteMany({
    where: { userId, commentId },
  });

  return getVoteSummary(commentId, userId);
};

async function getVoteSummary(commentId, userId) {
  const votes = await prisma.commentVote.findMany({
    where: { commentId },
    select: {
      type: true,
      userId: true,
    },
  });

  return normalizeVotes({ votes, userId });
}
