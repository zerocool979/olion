const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.create = async (data, adminId) => {
  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      adminId,
    },
  });
};

exports.findAll = () => {
  return prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });
};
