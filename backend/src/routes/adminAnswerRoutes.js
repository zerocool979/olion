const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireModerator } = require('../middlewares/roleMiddleware');
const answerService = require('../services/answerService');

const router = express.Router();

/**
 * APPROVE ANSWER
 */
router.patch('/:id/approve', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.approve(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * REJECT ANSWER
 */
router.patch('/:id/reject', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.reject(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE ANSWER
 */
router.delete('/:id', authenticate, requireModerator, async (req, res, next) => {
  try {
    await answerService.adminDelete(req.params.id, req.user.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
