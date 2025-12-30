const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const commentService = require('../services/commentService');

const router = express.Router();

/* =======================
   CREATE COMMENT (DISCUSSION)
   Comment ringan pada diskusi
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
   HANYA komentar langsung ke diskusi
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

/* =====================================================
   ADDITIONAL STRUCTURE (TIDAK MENGHAPUS YANG LAMA)
   ===================================================== */

/* =======================
   CREATE COMMENT (ANSWER)
   Komentar pada jawaban (nested)
======================= */
router.post(
  '/answer/:answerId',
  authenticate,
  async (req, res, next) => {
    try {
      const comment = await commentService.createCommentOnAnswer(
        req.user.id,
        req.params.answerId,
        req.body.content
      );
      res.status(201).json(comment);
    } catch (e) {
      next(e);
    }
  }
);

/* =======================
   LIST COMMENTS BY ANSWER ✅ FIX
   Endpoint WAJIB agar frontend bersih
======================= */
router.get(
  '/answer/:answerId',
  async (req, res, next) => {
    try {
      const comments = await commentService.listByAnswer(
        req.params.answerId
      );
      res.json(comments);
    } catch (e) {
      next(e);
    }
  }
);

/* =======================
   UPDATE COMMENT (OWNER)
======================= */
router.put(
  '/:id',
  authenticate,
  async (req, res, next) => {
    try {
      const comment = await commentService.updateComment(
        req.user.id,
        req.params.id,
        req.body.content
      );
      res.json(comment);
    } catch (e) {
      next(e);
    }
  }
);

/* =======================
   ADMIN DELETE COMMENT (SOFT DELETE)
======================= */
router.delete(
  '/:id/admin',
  authenticate,
  async (req, res, next) => {
    try {
      await commentService.adminDelete(req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }
);

/* =====================================================
   LIST COMMENTS BY ANSWER (NEW)
   Komentar khusus pada jawaban
===================================================== */
exports.listByAnswer = async (answerId) => {
  return prisma.comment.findMany({
    where: {
      answerId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          role: true,
          profile: {
            select: { pseudonym: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

module.exports = router;
