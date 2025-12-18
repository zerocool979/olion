const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

const VALID_ROLES = ['USER', 'MODERATOR', 'ADMIN', 'PAKAR'];

exports.updateUser = async (adminId, userId, payload) => {
  const { role, isActive } = payload;

  /* 1️⃣ LOAD USER */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pakar: true },
  });

  if (!user) throw new AppError('User not found', 404);

  /* 2️⃣ ADMIN TIDAK BOLEH TURUNKAN DIRI SENDIRI */
  if (adminId === userId && role && role !== user.role) {
    throw new AppError('Cannot change your own role', 403);
  }

  /* 3️⃣ VALIDASI ROLE */
  if (role && !VALID_ROLES.includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  /* 4️⃣ UPDATE USER */
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(role && { role }),
      ...(typeof isActive === 'boolean' && { isActive }),
    },
  });

  /* 5️⃣ AUTO CREATE PAKAR RECORD (JIKA ROLE = PAKAR) */
  if (role === 'PAKAR' && !user.pakar) {
    await prisma.pakar.create({
      data: {
        userId,
        expertise: '',
        document: '',
        status: 'Pending',
      },
    });
  }

  return updatedUser;
};
