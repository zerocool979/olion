// backend/src/controllers/bookmarkController.js

const bookmarkService = require('../services/bookmarkService');

/**
 * POST /api/v1/.../:id/bookmark
 */
exports.bookmark = async (req, res, next) => {
  try {
    const data = await bookmarkService.bookmark({
      userId: req.user.id,
      targetId: req.params.id,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/.../:id/bookmark
 */
exports.unbookmark = async (req, res, next) => {
  try {
    const data = await bookmarkService.unbookmark({
      userId: req.user.id,
      targetId: req.params.id,
    });

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
