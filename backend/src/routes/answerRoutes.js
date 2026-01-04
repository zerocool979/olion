const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireModerator } = require('../middlewares/roleMiddleware');

const answerService = require('../services/answerService');
const answerController = require('../controllers/answerController');
const answerVoteController = require('../controllers/answerVoteController');
const answerBookmarkController = require('../controllers/answerBookmarkController');

const router = express.Router();

/**
 * =====================================================
 * ANSWER VOTE
 * =====================================================
 */
router.post('/:id/vote', authenticate, answerVoteController.vote);
router.delete('/:id/vote', authenticate, answerVoteController.unvote);

/**
 * =====================================================
 * ANSWER BOOKMARK
 * =====================================================
 */
router.post('/:id/bookmark', authenticate, answerBookmarkController.bookmark);
router.delete('/:id/bookmark', authenticate, answerBookmarkController.unbookmark);

/**
 * =====================================================
 * ANSWER CRUD (NESTED — PRIMARY)
 * =====================================================
 */
router.post('/:discussionId/answers', authenticate, answerController.createAnswer);
router.get('/:discussionId/answers', answerController.getAnswersByDiscussion);

/**
 * =====================================================
 * ANSWER CRUD (FLAT / LEGACY)
 * =====================================================
 */
router.get('/answers/:id', answerController.getAnswerById);
router.put('/answers/:id', authenticate, answerController.updateAnswer);
router.delete('/answers/:id', authenticate, answerController.deleteAnswer);

/**
 * =====================================================
 * SERVICE-BASED (NESTED, DIPERTAHANKAN)
 * =====================================================
 */
router.get('/discussion/:id', async (req, res, next) => {
  try {
    const data = await answerService.findByDiscussion(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/discussion/:id', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;
    const data = await answerService.create(req.user, req.params.id, content);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * MODERATOR / ADMIN
 * =====================================================
 */
router.patch('/:id/approve', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.approve(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/reject', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.reject(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id/admin', authenticate, requireModerator, async (req, res, next) => {
  try {
    await answerService.adminDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
