const service = require('../services/commentVoteService');

exports.vote = async (req, res, next) => {
  try {
    const { type } = req.body;

    const data = await service.voteComment({
      commentId: req.params.id,
      userId: req.user.id,
      type,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};

exports.unvote = async (req, res, next) => {
  try {
    const data = await service.removeVote({
      commentId: req.params.id,
      userId: req.user.id,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};
