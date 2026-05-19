const service = require('./service')

exports.create = async (req, res, next) => {
  try {
    const comment = await service.create(req.body, req.userId)
    res.status(201).json({ data: comment })
  } catch (e) {
    next(e)
  }
}

exports.list = async (req, res, next) => {
  try {
    const comments = await service.getByDiscussion(req.params.discussionId)
    res.json({ data: comments })
  } catch (e) {
    next(e)
  }
}
