const service = require('../services/answerBookmarkService');

exports.bookmark = async (req, res, next) => {
  try {
    const data = await service.bookmarkAnswer({
      answerId: req.params.id,
      userId: req.user.id,
    });

    res.json({ bookmark: data });
  } catch (e) {
    next(e);
  }
};

exports.unbookmark = async (req, res, next) => {
  try {
    const data = await service.unbookmarkAnswer({
      answerId: req.params.id,
      userId: req.user.id,
    });

    res.json({ bookmark: data });
  } catch (e) {
    next(e);
  }
};
