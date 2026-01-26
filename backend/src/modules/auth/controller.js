const service = require('./service')

exports.register = async (req, res, next) => {
  try {
    const token = await service.register(req.body.email, req.body.password)
    res.json({ token })
  } catch (e) { next(e) }
}

exports.login = async (req, res, next) => {
  try {
    const token = await service.login(req.body.email, req.body.password)
    res.json({ token })
  } catch (e) { next(e) }
}
