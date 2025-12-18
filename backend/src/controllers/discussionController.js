const service = require('../services/discussionService');

exports.findAll = async (req, res, next) => {
  try {
    const data = await service.findAll();
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};
