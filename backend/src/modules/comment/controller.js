const service = require('./service')

exports.create = async (req, res, next) => {
  try {
    const c = await service.create(req.body, req.user.id)
    res.json(c)
  } catch (e) { next(e) }
}

