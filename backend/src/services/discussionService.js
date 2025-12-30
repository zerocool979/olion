const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const checkOwner = require('../utils/ownership');
const { sendNotification } = require('./notificationService'); // FIX

/**
 * =====================================================
 * CREATE DISCUSSION
 * =====================================================
 */
exports.create = async (userId, data) => {
  const discussion = await prisma.discussion.create({
    data: {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      userId,
    },
  });

  // 🔔 NOTIFICATION: DISCUSSION CREATED
  // NOTE:
  // - Discussion adalah ROOT entity
  // - Tidak mengandung Answer / Comment
  await sendNotification({
    userId,
    title: 'Diskusi berhasil dibuat',
    message: `Diskusi "${data.title}" berhasil diposting`,
    channel: 'InApp',
  });

  return discussion;
};

/**
 * =====================================================
 * GET ALL DISCUSSIONS
 * =====================================================
 */
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
 * =====================================================
 * GET DISCUSSION BY ID
 * NOTE:
 * - Digunakan untuk halaman detail discussion
 * - Answer & Comment TIDAK diambil di sini
 * - Konsisten dengan konsep hirarki
 * =====================================================
 */
exports.findById = async (id) => {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          profile: { select: { pseudonym: true } },
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

/**
 * =====================================================
 * UPDATE DISCUSSION
 * =====================================================
 */
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

/**
 * =====================================================
 * SOFT DELETE DISCUSSION
 * NOTE:
 * - Tidak menghapus Answer / Comment
 * - Menjaga histori diskusi
 * =====================================================
 */
exports.remove = async (id, user) => {
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) throw new AppError('Not found', 404);

  checkOwner(discussion.userId, user);

  const deleted = await prisma.discussion.update({
    where: { id },
    data: { isDeleted: true },
  });

  // 🔔 NOTIFICATION: DISCUSSION DELETED
  await sendNotification({
    userId: discussion.userId,
    title: 'Diskusi dihapus',
    message: `Diskusi "${discussion.title}" telah dihapus`,
    channel: 'InApp',
  });

  return deleted;
};
