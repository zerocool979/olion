const service = require('../services/answerVoteService');

exports.vote = async (req, res, next) => {
  try {
    const { type } = req.body;

    const data = await service.voteAnswer({
      answerId: req.params.id,
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
      answerId: req.params.id,
      userId: req.user.id,
    });

    res.json({ vote: data });
  } catch (e) {
    next(e);
  }
};

