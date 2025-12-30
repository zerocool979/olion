const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireModerator } = require('../middlewares/roleMiddleware'); // dipakai utk admin/mod
const answerService = require('../services/answerService');

const router = express.Router();

/**
 * =====================================================
 * NESTED ROUTE (PRIMARY)
 * =====================================================
 * Answer SELALU milik Discussion
 * Frontend memakai route ini
 * -----------------------------------------------------
 * GET /api/discussions/:discussionId/answers
 * POST /api/discussions/:discussionId/answers
 * =====================================================
 */

/**
 * GET ANSWERS BY DISCUSSION (NESTED)
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
 * CREATE ANSWER (NESTED)
 */
router.post('/discussion/:id', authenticate, async (req, res, next) => {
  try {
    const { content } = req.body;

    const data = await answerService.create(
      req.user,
      req.params.id,
      content
    );

    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * LEGACY / FLAT ROUTES (DIPERTAHANKAN)
 * =====================================================
 * Tidak dihapus sesuai instruksi
 * Dipakai jika frontend lama masih bergantung
 * =====================================================
 */

/**
 * CREATE ANSWER
 * POST /api/answers
 */
// router.post('/', authenticate, async (req, res, next) => {
//   try {
//     const { discussionId, content } = req.body;
//
//     const data = await answerService.create(
//       req.user,
//       discussionId,
//       content
//     );
//
//     res.status(201).json(data);
//   } catch (e) {
//     next(e);
//   }
// });

/**
 * UPDATE ANSWER
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
 * =====================================================
 * ADMIN / MODERATOR ACTIONS
 * =====================================================
 */

/**
 * APPROVE ANSWER
 */
router.patch('/:id/approve', authenticate, requireModerator, async (req, res, next) => {
  try {
    const data = await answerService.approve(req.params.id);
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
    const data = await answerService.reject(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE ANSWER (ADMIN)
 */
router.delete('/:id/admin', authenticate, requireModerator, async (req, res, next) => {
  try {
    await answerService.adminDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
