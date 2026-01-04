const answerService = require('../services/answerService');

/**
 * CREATE ANSWER
 * Service sudah handle normalisasi, controller hanya forward
 */
exports.createAnswer = async (req, res, next) => {
  try {
    const { id: discussionId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const answer = await answerService.create(req.user, discussionId, content);
    res.status(201).json(answer);
  } catch (err) {
    next(err);
  }
};

/**
 * GET ANSWERS BY DISCUSSION
 * Service sudah handle normalisasi, controller hanya forward
 */
exports.getAnswersByDiscussion = async (req, res, next) => {
  try {
    const { id: discussionId } = req.params;
    const currentUserId = req.user?.id || null;
    const answers = await answerService.findByDiscussion(discussionId, currentUserId);
    res.json({ data: answers });
  } catch (err) {
    next(err);
  }
};

/**
 * GET ANSWER BY ID
 */
exports.getAnswerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || null;
    const answer = await answerService.findById(id, currentUserId);
    res.json(answer);
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE ANSWER
 */
exports.updateAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const answer = await answerService.update(id, req.user, content);
    res.json(answer);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE ANSWER
 */
exports.deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await answerService.remove(id, req.user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
