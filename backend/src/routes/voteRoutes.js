const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const service = require('../services/voteService');

const router = express.Router();

router.post('/discussion/:id', authenticate, async (req, res, next) => {
  try {
    const result = await service.voteDiscussion(
      req.user,
      req.params.id,
      req.body.type
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/answer/:id', authenticate, async (req, res, next) => {
  try {
    const result = await service.voteAnswer(
      req.user,
      req.params.id,
      req.body.type
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
