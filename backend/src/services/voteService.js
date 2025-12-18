const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const reputationService = require('./reputationService');

/**
 * Apply vote to a model (discussionVote / answerVote)
 * Return:
 *  - vote: Prisma record
 *  - isNew: boolean (true ONLY if create)
 */
const applyVote = async (model, where, data) => {
  const existing = await prisma[model].findUnique({ where });

  // CASE 1: Vote sudah ada → UPDATE (NO reputation)
  if (existing) {
    const vote = await prisma[model].update({
      where,
      data: { type: data.type },
    });

    return { vote, isNew: false };
  }

  // CASE 2: Vote baru → CREATE (YES reputation)
  const vote = await prisma[model].create({ data });
  return { vote, isNew: true };
};

/**
 * Vote discussion
 */
exports.voteDiscussion = async (user, discussionId, type) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion)
    throw new AppError('Discussion not found', 404);

  if (discussion.userId === user.id)
    throw new AppError('Cannot vote your own discussion', 403);

  const { vote, isNew } = await applyVote(
    'discussionVote',
    {
      userId_discussionId: {
        userId: user.id,
        discussionId,
      },
    },
    {
      userId: user.id,
      discussionId,
      type,
    }
  );

  // 🔥 LANGKAH 3 — TRIGGER REPUTATION (HANYA JIKA VOTE BARU)
  if (isNew) {
    const delta = type === 'Up' ? 10 : -2;

    await reputationService.addReputation(
      discussion.userId,     // pemilik konten
      delta,                 // poin
      'DISCUSSION_VOTE',     // reason
      discussionId           // sourceId
    );
  }

  return vote;
};

/**
 * Vote answer
 */
exports.voteAnswer = async (user, answerId, type) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });

  if (!answer)
    throw new AppError('Answer not found', 404);

  if (answer.userId === user.id)
    throw new AppError('Cannot vote your own answer', 403);

  const { vote, isNew } = await applyVote(
    'answerVote',
    {
      userId_answerId: {
        userId: user.id,
        answerId,
      },
    },
    {
      userId: user.id,
      answerId,
      type,
    }
  );

  // 🔥 LANGKAH 3 — TRIGGER REPUTATION (HANYA JIKA VOTE BARU)
  if (isNew) {
    const delta = type === 'Up' ? 15 : -3;

    await reputationService.addReputation(
      answer.userId,
      delta,
      'ANSWER_VOTE',
      answerId
    );
  }

  return vote;
};
