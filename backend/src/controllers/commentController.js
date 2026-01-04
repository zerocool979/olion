const commentService = require('../services/commentService');

/**
 * CREATE COMMENT ON DISCUSSION
 * Service sudah handle normalisasi, controller hanya forward
 */
exports.createCommentOnDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await commentService.createComment(req.user.id, discussionId, content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

/**
 * CREATE COMMENT ON ANSWER
 */
exports.createCommentOnAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await commentService.createCommentOnAnswer(req.user.id, answerId, content);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

/**
 * GET COMMENTS BY DISCUSSION
 */
exports.getCommentsByDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const comments = await commentService.listByDiscussion(discussionId);
    res.json({ data: comments });
  } catch (err) {
    next(err);
  }
};

/**
 * GET COMMENTS BY ANSWER
 */
exports.getCommentsByAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const comments = await commentService.listByAnswer(answerId);
    res.json({ data: comments });
  } catch (err) {
    next(err);
  }
};

/**
 * GET COMMENT BY ID
 */
exports.getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentService.findById(id);
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE COMMENT
 */
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await commentService.updateComment(req.user.id, id, content);
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE COMMENT
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await commentService.deleteComment(req.user.id, id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
