const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const prisma = require('../lib/prisma');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const [
      discussionCount,
      answerCount,
      userCount,
    ] = await Promise.all([
      prisma.discussion.count({ where: { isDeleted: false } }),
      prisma.answer.count({ where: { isDeleted: false } }),
      prisma.user.count(),
    ]);

    res.json({
      discussionCount,
      answerCount,
      userCount,
      role: req.user.role,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
