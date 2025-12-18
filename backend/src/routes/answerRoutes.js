const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const answerService = require('../services/answerService');

const router = express.Router();

/**
 * CREATE ANSWER
 * POST /api/answers
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { discussionId, content } = req.body;
    const data = await answerService.create(
      req.user.id,
      discussionId,
      content
    );
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * GET ANSWERS BY DISCUSSION
 * GET /api/answers/discussion/:id
 */
router.get('/discussion/:id', async (req, res, next) => {
  try {
    const data = await answerService.findByDiscussion(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE ANSWER
 * DELETE /api/answers/:id
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await answerService.remove(req.params.id, req.user);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
