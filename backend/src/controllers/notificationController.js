const prisma = require('../lib/prisma');

exports.getMyNotifications = async (req, res) => {
  const data = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(data);
};
