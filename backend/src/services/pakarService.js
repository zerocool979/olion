const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { sendNotification } = require('./notificationService'); // FIX

exports.findAllPakars = async () => {
  return prisma.pakar.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
};

exports.findPakarById = async (pakarId) => {
  const pakar = await prisma.pakar.findUnique({
    where: { id: pakarId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!pakar) {
    throw new AppError('Pakar tidak ditemukan', 404);
  }

  return pakar;
};

exports.applyPakar = async (userId, body) => {
  const { expertise, document } = body;

  if (!expertise || !document) {
    throw new AppError('Expertise dan dokumen wajib diisi', 400);
  }

  const existing = await prisma.pakar.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new AppError('Pengajuan pakar sudah ada', 400);
  }

  const pakar = await prisma.pakar.create({
    data: {
      userId,
      expertise,
      document,
      status: 'Pending',
    },
  });

  // 🔔 NOTIFICATION → ADMIN
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true },
  });

  for (const admin of admins) {
    await sendNotification({
      userId: admin.id,
      title: 'Pengajuan pakar baru',
      message: 'Ada user yang mengajukan diri sebagai pakar',
      channel: 'InApp',
    });
  }

  return pakar;
};

exports.verifyPakar = async (pakarId, status) => {
  if (!['Approved', 'Rejected'].includes(status)) {
    throw new AppError('Status tidak valid', 400);
  }

  const pakar = await prisma.pakar.findUnique({
    where: { id: pakarId },
  });

  if (!pakar) throw new AppError('Pakar tidak ditemukan', 404);

  const updated = await prisma.pakar.update({
    where: { id: pakarId },
    data: { status },
  });

  if (status === 'Approved') {
    await prisma.user.update({
      where: { id: pakar.userId },
      data: { role: 'PAKAR' },
    });
  }

  // 🔔 NOTIFICATION → USER
  await sendNotification({
    userId: pakar.userId,
    title:
      status === 'Approved'
        ? 'Pengajuan pakar disetujui'
        : 'Pengajuan pakar ditolak',
    message:
      status === 'Approved'
        ? 'Selamat, Anda sekarang adalah pakar'
        : 'Maaf, pengajuan pakar Anda ditolak',
    channel: 'InApp',
  });

  return updated;
};
