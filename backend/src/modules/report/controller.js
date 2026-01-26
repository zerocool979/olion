const service = require('./service')

exports.report = async (req, res, next) => {
  try {
    const r = await service.create(req.body, req.user.id)
    res.json(r)
  } catch (e) { next(e) }
}

exports.review = async (req, res, next) => {
  try {
    res.json(await service.review(req.params.id, req.body.status))
  } catch (e) { next(e) }
}
