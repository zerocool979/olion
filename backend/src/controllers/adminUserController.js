const adminUserService = require('../services/adminUserService');

exports.updateUser = async (req, res, next) => {
  try {
    const result = await adminUserService.updateUser(
      req.user.id,       // adminId
      req.params.id,     // target user
      req.body
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (req, res) => {
  const users = await prisma.user.count();
  const discussions = await prisma.discussion.count();
  const reports = await prisma.report.count();

  res.json({ users, discussions, reports });
};
