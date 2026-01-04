// backend/src/routes/discussionRoutes.js
const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const controller = require('../controllers/discussionController');
const voteController = require('../controllers/voteController');
const bookmarkController = require('../controllers/bookmarkController');
const discussionService = require('../services/discussionService');

const router = express.Router();

/**
 * =====================================================
 * PUBLIC ROUTES
 * =====================================================
 */

// SEARCH DISCUSSIONS (HARUS PALING ATAS)
router.get('/search', async (req, res, next) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const data = await discussionService.search(query, { page, limit });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// GET DISCUSSIONS BY CATEGORY
router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const data = await discussionService.findByCategory(
      categoryId,
      { page, limit }
    );

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// GET POPULAR DISCUSSIONS
router.get('/popular', async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const data = await discussionService.findPopular({ limit });
    res.json({ data });
  } catch (e) {
    next(e);
  }
});

// GET ALL DISCUSSIONS
router.get('/', controller.findAll);

// GET DISCUSSION BY ID (HARUS SETELAH ROUTE KHUSUS)
router.get('/:id', controller.getDiscussionById);

/**
 * =====================================================
 * AUTHENTICATED ROUTES
 * =====================================================
 */

// GET MY DISCUSSIONS
router.get('/my', authenticate, controller.findMy);

// CREATE DISCUSSION
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res
        .status(400)
        .json({ message: 'Title, content, and categoryId are required' });
    }

    const data = await discussionService.create(req.user.id, req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

// UPDATE DISCUSSION
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title && !content && !categoryId) {
      return res.status(400).json({
        message: 'At least one field (title, content, or categoryId) is required',
      });
    }

    const data = await discussionService.update(
      req.params.id,
      req.user,
      req.body
    );

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// DELETE DISCUSSION
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await discussionService.remove(req.params.id, req.user);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * VOTE & BOOKMARK ROUTES
 * =====================================================
 */

router.post('/:id/vote', authenticate, voteController.vote);
router.delete('/:id/vote', authenticate, voteController.unvote);

router.post('/:id/bookmark', authenticate, bookmarkController.bookmark);
router.delete('/:id/bookmark', authenticate, bookmarkController.unbookmark);

/**
 * =====================================================
 * ADMIN ROUTES
 * =====================================================
 */

// RESTORE DELETED DISCUSSION (ADMIN ONLY)
router.post('/:id/restore', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }

    const data = await discussionService.restore(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// ADMIN: DISCUSSION STATS (PAGINATION)
router.get('/admin/stats', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }

    const { page = 1, limit = 10 } = req.query;
    const data = await discussionService.findWithStats({ page, limit });

    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
