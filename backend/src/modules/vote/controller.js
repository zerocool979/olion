const service = require('./service')

exports.vote = async (req, res, next) => {
  try {
    const { discussionId, commentId, value } = req.body
    const result = await service.vote(req.userId, discussionId, commentId, value)
    res.json({ data: result  })
  } catch (e) { next(e) }
}
