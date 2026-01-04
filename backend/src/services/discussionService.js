// backend/src/services/discussionService.js
const prisma = require('../prisma');
const AppError = require('../utils/AppError');
const checkOwner = require('../utils/ownership');
const { sendNotification } = require('./notificationService');

const {
  normalizeDiscussion,
  normalizeDiscussionList,
} = require('./normalizers/discussionNormalizer');

/**
 * =====================================================
 * USER SELECTOR
 * =====================================================
 */
const getUserSelect = (includeProfile = false) => ({
  select: {
    id: true,
    email: true,
    ...(includeProfile && {
      profile: {
        select: {
          pseudonym: true,
          avatarUrl: true,
        },
      },
    }),
  },
});

/**
 * =====================================================
 * GET ALL DISCUSSIONS
 * =====================================================
 */
exports.findAll = async (
  { page = 1, limit = 10, sort = 'newest' },
  currentUserId = null
) => {
  const skip = (page - 1) * limit;
  const orderBy =
    sort === 'newest' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const [items, total] = await Promise.all([
    prisma.discussion.findMany({
      where: { isDeleted: false },
      orderBy,
      skip: Number(skip),
      take: Number(limit),
      include: {
        user: getUserSelect(true),
        category: { select: { id: true, name: true } },
        votes: { select: { type: true, userId: true } },
        bookmarks: { select: { userId: true } },
        _count: { select: { votes: true, bookmarks: true } },
      },
    }),
    prisma.discussion.count({ where: { isDeleted: false } }),
  ]);

  return {
    data: normalizeDiscussionList(items, currentUserId),
    meta: { page: Number(page), limit: Number(limit), total },
  };
};

/**
 * =====================================================
 * GET DISCUSSION BY ID
 * =====================================================
 */
exports.findById = async (id, currentUserId = null) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: getUserSelect(true),
      category: { select: { id: true, name: true } },
      votes: { select: { type: true, userId: true } },
      bookmarks: { select: { userId: true } },
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  return normalizeDiscussion(discussion, currentUserId);
};

/**
 * =====================================================
 * GET MY DISCUSSIONS
 * =====================================================
 */
exports.findByUserId = async (userId) => {
  const discussions = await prisma.discussion.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: getUserSelect(true),
      category: { select: { id: true, name: true } },
      votes: { select: { type: true, userId: true } },
      bookmarks: { select: { userId: true } },
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return normalizeDiscussionList(discussions, userId);
};

/**
 * =====================================================
 * CREATE DISCUSSION
 * - categoryId OR categoryName (manual input)
 * =====================================================
 */
exports.create = async (userId, data) => {
  const { title, content, categoryId, categoryName } = data;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  let finalCategoryId = categoryId || null;

  if (!finalCategoryId && categoryName) {
    const normalizedName = categoryName.trim();
    if (!normalizedName) {
      throw new AppError('Category name is invalid', 400);
    }

    let category = await prisma.category.findFirst({
      where: { name: { equals: normalizedName, mode: 'insensitive' } },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: normalizedName },
      });
    }

    finalCategoryId = category.id;
  }

  if (!finalCategoryId) {
    throw new AppError('Category is required', 400);
  }

  const discussion = await prisma.discussion.create({
    data: {
      title,
      content,
      categoryId: finalCategoryId,
      userId,
    },
    include: {
      user: getUserSelect(true),
      category: { select: { id: true, name: true } },
      votes: true,
      bookmarks: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  await sendNotification({
    userId,
    title: 'Diskusi berhasil dibuat',
    message: `Diskusi "${title}" berhasil diposting`,
    channel: 'InApp',
  });

  return normalizeDiscussion(discussion, userId);
};

/**
 * =====================================================
 * UPDATE DISCUSSION
 * =====================================================
 */
exports.update = async (id, user, data) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Discussion not found', 404);

  checkOwner(discussion.userId, user);

  const updated = await prisma.discussion.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      ...(data.categoryId && { categoryId: data.categoryId }),
    },
    include: {
      user: getUserSelect(true),
      category: { select: { id: true, name: true } },
      votes: true,
      bookmarks: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return normalizeDiscussion(updated, user.id);
};

/**
 * =====================================================
 * SOFT DELETE
 * =====================================================
 */
exports.remove = async (id, user) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Discussion not found', 404);

  checkOwner(discussion.userId, user);

  const deleted = await prisma.discussion.update({
    where: { id },
    data: { isDeleted: true },
    include: {
      user: getUserSelect(true),
      category: { select: { id: true, name: true } },
      votes: true,
      bookmarks: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return normalizeDiscussion(deleted, user.id);
};

/**
 * =====================================================
 * SEARCH DISCUSSIONS
 * =====================================================
 */
exports.search = async (query, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const discussions = await prisma.discussion.findMany({
    where: {
      isDeleted: false,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      user: getUserSelect(true),
      category: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return {
    data: normalizeDiscussionList(discussions),
    meta: { page: Number(page), limit: Number(limit) },
  };
};

/**
 * =====================================================
 * GET DISCUSSIONS BY CATEGORY
 * =====================================================
 */
exports.findByCategory = async (categoryId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const discussions = await prisma.discussion.findMany({
    where: {
      categoryId,
      isDeleted: false,
    },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      user: getUserSelect(true),
      category: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return {
    data: normalizeDiscussionList(discussions),
    meta: { page: Number(page), limit: Number(limit) },
  };
};

/**
 * =====================================================
 * TRENDING / POPULAR DISCUSSIONS
 * =====================================================
 */
exports.findPopular = async ({ limit = 5 }) => {
  const discussions = await prisma.discussion.findMany({
    where: { isDeleted: false },
    orderBy: [{ votes: { _count: 'desc' } }],
    take: Number(limit),
    include: {
      user: getUserSelect(true),
      category: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return normalizeDiscussionList(discussions);
};

/**
 * =====================================================
 * RESTORE DELETED DISCUSSION (ADMIN)
 * =====================================================
 */
exports.restore = async (id) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Discussion not found', 404);

  const restored = await prisma.discussion.update({
    where: { id },
    data: { isDeleted: false },
    include: {
      user: getUserSelect(true),
      category: true,
      _count: { select: { votes: true, bookmarks: true } },
    },
  });

  return normalizeDiscussion(restored);
};

/**
 * =====================================================
 * ADMIN: DISCUSSION STATS (PAGINATION)
 * =====================================================
 */
exports.findWithStats = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.discussion.findMany({
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: getUserSelect(),
        category: true,
        _count: {
          select: {
            votes: true,
            bookmarks: true,
            comments: true,
          },
        },
      },
    }),
    prisma.discussion.count(),
  ]);

  return {
    data: items,
    meta: { page: Number(page), limit: Number(limit), total },
  };
};
