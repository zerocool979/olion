const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { normalizeBookmark } = require('./normalizers/bookmarkNormalizer');

/**
 * BOOKMARK DISCUSSION
 */
exports.bookmarkDiscussion = async ({ discussionId, userId }) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  // UPSERT dengan update: {} = idempotent (create jika tidak ada, tidak error jika sudah ada)
  await prisma.bookmark.upsert({
    where: {
      userId_discussionId: {
        userId,
        discussionId,
      },
    },
    update: {}, // Tidak mengubah apa-apa jika sudah ada
    create: {
      userId,
      discussionId,
    },
  });

  return getBookmarkState(discussionId, userId);
};

/**
 * UNBOOKMARK DISCUSSION
 */
exports.unbookmarkDiscussion = async ({ discussionId, userId }) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  // DELETE MANY = idempotent (aman meskipun record tidak ada)
  await prisma.bookmark.deleteMany({
    where: { userId, discussionId },
  });

  return getBookmarkState(discussionId, userId);
};

/**
 * GET BOOKMARK STATE
 */
async function getBookmarkState(discussionId, userId) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { discussionId },
    select: { userId: true },
  });

  return normalizeBookmark({ bookmarks, userId });
}

/**
 * GET USER'S BOOKMARKS
 */
exports.getUserBookmarks = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId },
      include: {
        discussion: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            category: true,
            votes: {
              select: {
                type: true,
                userId: true,
              },
            },
            bookmarks: {
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                answers: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: Number(skip),
      take: Number(limit),
    }),
    prisma.bookmark.count({
      where: { userId },
    }),
  ]);

  // Extract discussions from bookmarks and normalize
  const discussions = items.map(item => item.discussion);
  
  // Use discussion normalizer with metadata
  const { normalizeDiscussionWithMeta } = require('./discussionService');
  const normalizedDiscussions = discussions.map(discussion => 
    normalizeDiscussionWithMeta(discussion, userId)
  );

  return {
    data: normalizedDiscussions,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};
