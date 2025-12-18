const prisma = require('../lib/prisma');

exports.getByUser = async (userId) => {
  const score = await prisma.reputation.aggregate({
    where: { userId },
    _sum: { value: true }
  });

  return {
    score: score._sum.value || 0,
    activities: ['Menjawab diskusi', 'Vote diterima']
  };
};
