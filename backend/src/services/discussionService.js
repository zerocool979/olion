const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const checkOwner = require('../utils/ownership');

exports.create = async (userId, data) => {
  return prisma.discussion.create({
    data: {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      userId,
    },
  });
};

exports.findAll = () => {
  return prisma.discussion.findMany({
    where: { isDeleted: false },
    include: {
      user: { select: { id: true } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * ================================
 * FIX: FIND DISCUSSION BY ID
 * ================================
 */
exports.findById = async (id) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          profile: {
            select: { pseudonym: true },
          },
        },
      },
      category: true,
    },
  });

  if (!discussion || discussion.isDeleted) {
    throw new AppError('Discussion not found', 404);
  }

  return discussion;
};

exports.update = async (id, user, data) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Not found', 404);

  checkOwner(discussion.userId, user);

  return prisma.discussion.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
};

exports.remove = async (id, user) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Not found', 404);

  checkOwner(discussion.userId, user);

  return prisma.discussion.update({
    where: { id },
    data: { isDeleted: true },
  });
};
