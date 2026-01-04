const service = require('../services/commentBookmarkService');

exports.bookmark = async (req, res, next) => {
  try {
    const data = await service.bookmarkComment({
      commentId: req.params.id,
      userId: req.user.id,
    });

    res.json({ bookmark: data });
  } catch (e) {
    next(e);
  }
};

exports.unbookmark = async (req, res, next) => {
  try {
    const data = await service.unbookmarkComment({
      commentId: req.params.id,
      userId: req.user.id,
    });

    res.json({ bookmark: data });
  } catch (e) {
    next(e);
  }
};
