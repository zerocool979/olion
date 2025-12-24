const answerService = require('../services/answer.service');

exports.createAnswer = async (req, res) => {
  try {
    const { id: discussionId } = req.params;
    const { content } = req.body;

    const answer = await answerService.createAnswer({
      discussionId,
      content,
      user: req.user,
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create answer' });
  }
};

exports.getAnswersByDiscussion = async (req, res) => {
  try {
    const { id: discussionId } = req.params;
    const answers = await answerService.getAnswersByDiscussion(discussionId);
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch answers' });
  }
};
