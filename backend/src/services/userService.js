const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.updateUser = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  return prisma.user.update({
    where: { id: userId },
    data: {
      role: data.role,
      isActive: data.isActive,
    },
  });
};

exports.applyPakar = async (userId, data) => {
  return prisma.pakar.create({
    data: {
      userId,
      expertise: data.expertise,
      document: data.document,
    },
  });
};

exports.verifyPakar = async (pakarId, status) => {
  if (!['Approved', 'Rejected'].includes(status))
    throw new AppError('Invalid status', 400);

  const pakar = await prisma.pakar.update({
    where: { id: pakarId },
    data: { status },
    include: { user: true },
  });

  if (status === 'Approved') {
    await prisma.user.update({
      where: { id: pakar.userId },
      data: { role: 'PAKAR' },
    });
  }

  return pakar;
};


exports.listUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

exports.getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      reputation: true,
      pakar: true,
    },
  });
};
