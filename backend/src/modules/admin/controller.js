const service = require('./service')

exports.verifyExpert = async (req, res, next) => {
  try {
    res.json(await service.verifyExpert(req.params.id))
  } catch (e) { next(e) }
}

exports.users = async (req, res, next) => {
  try {
    res.json(await service.listUsers())
  } catch (e) { next(e) }
}
