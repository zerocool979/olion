const prisma = require('../prisma');
const { normalizeBookmark } = require('./normalizers/bookmarkNormalizer');

exports.bookmarkAnswer = async ({ answerId, userId }) => {
  await prisma.answerBookmark.upsert({
    where: {
      userId_answerId: {
        userId,
        answerId,
      },
    },
    update: {},
    create: {
      userId,
      answerId,
    },
  });

  return getBookmarkState(answerId, userId);
};

exports.unbookmarkAnswer = async ({ answerId, userId }) => {
  await prisma.answerBookmark.deleteMany({
    where: { userId, answerId },
  });

  return getBookmarkState(answerId, userId);
};

async function getBookmarkState(answerId, userId) {
  const bookmarks = await prisma.answerBookmark.findMany({
    where: { answerId },
    select: { userId: true },
  });

  return normalizeBookmark({ bookmarks, userId });
}
