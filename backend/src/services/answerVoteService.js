const prisma = require('../prisma');
const { normalizeVotes } = require('./normalizers/voteNormalizer');

exports.voteAnswer = async ({ answerId, userId, type }) => {
  if (!['UP', 'DOWN'].includes(type)) {
    throw new Error('Invalid vote type');
  }

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

  return getVoteSummary(answerId, userId);
};

exports.removeVote = async ({ answerId, userId }) => {
  await prisma.answerVote.deleteMany({
    where: { userId, answerId },
  });

  return getVoteSummary(answerId, userId);
};

async function getVoteSummary(answerId, userId) {
  const votes = await prisma.answerVote.findMany({
    where: { answerId },
    select: {
      type: true,
      userId: true,
    },
  });

  return normalizeVotes({ votes, userId });
}
