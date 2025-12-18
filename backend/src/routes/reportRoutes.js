const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const reportService = require('../services/reportService');
const moderationService = require('../services/moderationService');

const router = express.Router();

/* =======================
   REPORTING
======================= */

// REPORT DISCUSSION
router.post('/discussion/:id', authenticate, async (req, res, next) => {
  try {
    const data = await reportService.reportDiscussion(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

// REPORT ANSWER
router.post('/answer/:id', authenticate, async (req, res, next) => {
  try {
    const data = await reportService.reportAnswer(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

// REPORT COMMENT
router.post('/comment/:id', authenticate, async (req, res, next) => {
  try {
    const data = await reportService.reportComment(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

/* =======================
   MODERATION (GENERIC)
======================= */

router.post(
  '/moderate/:source/:reportId',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    try {
      const { source, reportId } = req.params;
      const { action, note } = req.body;

      const result = await moderationService.moderate(
        req.user.id,
        source.toUpperCase(),
        reportId,
        action,
        note
      );

      res.json({ success: true, data: result });
    } catch (e) {
      console.error('[MODERATION ERROR]', e);
      next(e);
    }
  }
);

module.exports = router;
