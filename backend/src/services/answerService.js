const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService');
const { normalizeAnswer, normalizeAnswerList } = require('./normalizers/answerNormalizer');
const { normalizeVotes } = require('./normalizers/voteNormalizer');

/**
 * DATA CONTRACT:
 * - Frontend menerima `author`
 * - Prisma relasi = `user`
 * - Normalisasi dilakukan di service
 * - Controller tidak transform data
 */

/**
 * Get default user selection for answer queries
 */
const getUserSelect = (includeProfile = false) => ({
  select: {
    id: true,
    email: true,
    username: true,
    role: true,
    ...(includeProfile && {
      profile: {
        select: {
          pseudonym: true,
          avatarUrl: true
        }
      }
    })
  }
});

/**
 * Normalize answer with votes
 */
function normalizeAnswerWithVotes(answer, currentUserId = null) {
  const normalized = normalizeAnswer(answer);
  
  // Normalize votes if they exist
  if (answer.votes) {
    normalized.vote = normalizeVotes({
      votes: answer.votes,
      userId: currentUserId
    });
  }
  
  // Remove raw data array to prevent leaking
  delete normalized.votes;
  
  return normalized;
}

/**
 * Normalize list of answers with votes
 */
function normalizeAnswerListWithVotes(answers = [], currentUserId = null) {
  return answers.map(answer => 
    normalizeAnswerWithVotes(answer, currentUserId)
  );
}

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
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // 🔔 NOTIFICATION: ANSWER CREATED
  await sendNotification({
    userId: discussion.userId,
    title: 'Jawaban baru',
    message: 'Diskusi Anda mendapatkan jawaban baru',
    channel: 'InApp',
  });

  return normalizeAnswerWithVotes(answer, user.id);
};

/**
 * =====================================================
 * GET ANSWERS BY DISCUSSION
 * =====================================================
 */
exports.findByDiscussion = async (discussionId, currentUserId = null) => {
  const answers = await prisma.answer.findMany({
    where: {
      discussionId,
      isDeleted: false,
      moderation: 'Approved',
    },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return normalizeAnswerListWithVotes(answers, currentUserId);
};

/**
 * =====================================================
 * GET ANSWER BY ID
 * =====================================================
 */
exports.findById = async (id, currentUserId = null) => {
  const answer = await prisma.answer.findUnique({
    where: { id },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      comments: {
        where: { isDeleted: false },
        include: {
          user: getUserSelect(),
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!answer || answer.isDeleted) {
    throw new AppError('Answer not found', 404);
  }

  // Normalize answer with votes
  const normalizedAnswer = normalizeAnswerWithVotes(answer, currentUserId);
  
  // Normalize comments within the answer
  if (normalizedAnswer.comments) {
    const { normalizeCommentList } = require('./normalizers/commentNormalizer');
    normalizedAnswer.comments = normalizeCommentList(normalizedAnswer.comments);
  }

  return normalizedAnswer;
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

  const updated = await prisma.answer.update({
    where: { id },
    data: { content },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  return normalizeAnswerWithVotes(updated, user.id);
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

  const deleted = await prisma.answer.update({
    where: { id },
    data: { isDeleted: true },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  return normalizeAnswerWithVotes(deleted, user.id);
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
      isVerified: true,
    },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
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

  return normalizeAnswerWithVotes(updated, moderatorId);
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
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
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

  return normalizeAnswerWithVotes(updated, moderatorId);
};

/**
 * =====================================================
 * ADMIN DELETE (SOFT)
 * =====================================================
 */
exports.adminDelete = async (id) => {
  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) throw new AppError('Answer not found', 404);

  const deleted = await prisma.answer.update({
    where: { id },
    data: { isDeleted: true },
    include: {
      user: getUserSelect(true),
      votes: {
        select: {
          type: true,
          userId: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  return normalizeAnswerWithVotes(deleted);
};
