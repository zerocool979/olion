const reputationService = require('../services/reputationService');

exports.getMyReputation = async (req, res, next) => {
  try {
    const data = await reputationService.getByUser(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
