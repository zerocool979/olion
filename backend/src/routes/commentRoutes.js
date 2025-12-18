const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const commentService = require('../services/commentService');

const router = express.Router();

/* =======================
   CREATE COMMENT
======================= */
router.post(
  '/discussion/:discussionId',
  authenticate,
  async (req, res, next) => {
    try {
      const comment = await commentService.createComment(
        req.user.id,
        req.params.discussionId,
        req.body.content
      );
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  }
);

/* =======================
   LIST COMMENTS BY DISCUSSION
======================= */
router.get(
  '/discussion/:discussionId',
  async (req, res, next) => {
    try {
      const comments = await commentService.listByDiscussion(
        req.params.discussionId
      );
      res.json(comments);
    } catch (e) {
      next(e);
    }
  }
);

/* =======================
   DELETE COMMENT (OWNER)
======================= */
router.delete(
  '/:id',
  authenticate,
  async (req, res, next) => {
    try {
      await commentService.deleteComment(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
