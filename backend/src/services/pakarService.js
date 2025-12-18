const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

/**
 * USER apply pakar
 */
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

  return prisma.pakar.create({
    data: {
      userId,
      expertise,
      document,
    },
  });
};

/**
 * ADMIN verify pakar
 */
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

  // Jika approved → upgrade role user
  if (status === 'Approved') {
    await prisma.user.update({
      where: { id: pakar.userId },
      data: { role: 'PAKAR' },
    });
  }

  return updated;
};
