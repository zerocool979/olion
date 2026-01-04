const voteService = require('../services/voteService');

/**
 * VOTE DISCUSSION
 * POST /api/discussions/:id/vote
 */
exports.vote = async (req, res, next) => {
  try {
    const { type } = req.body;
    const { id: discussionId } = req.params;

    if (!type || !['Up', 'Down'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type is required and must be "Up" or "Down"' 
      });
    }

    const data = await voteService.voteDiscussion({
      discussionId,
      userId: req.user.id,
      type,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};

/**
 * UNVOTE DISCUSSION
 * DELETE /api/discussions/:id/vote
 */
exports.unvote = async (req, res, next) => {
  try {
    const { id: discussionId } = req.params;
    
    const data = await voteService.removeVote({
      discussionId,
      userId: req.user.id,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};

/**
 * VOTE ANSWER
 * POST /api/answers/:id/vote
 */
exports.voteAnswer = async (req, res, next) => {
  try {
    const { type } = req.body;
    const { id: answerId } = req.params;

    if (!type || !['Up', 'Down'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type is required and must be "Up" or "Down"' 
      });
    }

    const data = await voteService.voteAnswer({
      answerId,
      userId: req.user.id,
      type,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};

/**
 * UNVOTE ANSWER
 * DELETE /api/answers/:id/vote
 */
exports.unvoteAnswer = async (req, res, next) => {
  try {
    const { id: answerId } = req.params;
    
    const data = await voteService.removeAnswerVote({
      answerId,
      userId: req.user.id,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};
