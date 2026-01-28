const service = require('./service')

exports.create = async (req, res, next) => {
  try {
    const d = await service.create(req.body, req.user.id)
    res.json(d)
  } catch (e) { next(e) }
}

exports.list = async (req, res, next) => {
  try {
    res.json(await service.list())
  } catch (e) { next(e) }
}

exports.detail = async (req, res, next) => {
  try {
    const d = await service.detail(req.params.id)
    if (!d) return res.status(404).json({ message: 'Discussion not found' })
    res.json(d)
  } catch (e) { next(e) }
}

