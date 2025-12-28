const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireModerator } = require('../middlewares/roleMiddleware'); // dipakai utk admin/mod
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
      req.user, // FIX: kirim object
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
 * UPDATE ANSWER ✅ (NEW)
 * PUT /api/answers/:id
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;

    const data = await answerService.update(
      req.params.id,
      req.user,
      content
    );

    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE ANSWER (OWNER / ADMIN)
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

/**
 * ADMIN / MODERATOR
 * APPROVE ANSWER
 */
router.patch('/:id/approve', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.approve(
      req.params.id,
      req.user.id
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * ADMIN / MODERATOR
 * REJECT ANSWER
 */
router.patch('/:id/reject', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.reject(
      req.params.id,
      req.user.id
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * ADMIN / MODERATOR
 * DELETE ANSWER
 */
router.delete('/:id/admin', authenticate, requireModerator, async (req, res, next) => {
  try {
    await answerService.adminDelete(
      req.params.id,
      req.user.id
    );
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
