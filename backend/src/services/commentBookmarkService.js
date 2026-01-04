const prisma = require('../prisma');
const { normalizeBookmark } = require('./normalizers/bookmarkNormalizer');

exports.bookmarkComment = async ({ commentId, userId }) => {
  await prisma.commentBookmark.upsert({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
    update: {},
    create: {
      userId,
      commentId,
    },
  });

  return getBookmarkState(commentId, userId);
};

exports.unbookmarkComment = async ({ commentId, userId }) => {
  await prisma.commentBookmark.deleteMany({
    where: { userId, commentId },
  });

  return getBookmarkState(commentId, userId);
};

async function getBookmarkState(commentId, userId) {
  const bookmarks = await prisma.commentBookmark.findMany({
    where: { commentId },
    select: { userId: true },
  });

  return normalizeBookmark({ bookmarks, userId });
}
