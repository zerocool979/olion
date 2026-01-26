const service = require('./service')

exports.vote = async (req, res, next) => {
  try {
    const { discussionId, value } = req.body
    const result = await service.vote(req.user.id, discussionId, value)
    res.json(result)
  } catch (e) { next(e) }
}
