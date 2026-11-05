'use strict'
const { getTrending } = require('./service')

// GET /trending?period=24h|7d|30d&limit=20
module.exports.list = async (req, res, next) => {
  try {
    const period = ['24h', '7d', '30d'].includes(req.query.period)
      ? req.query.period
      : '24h'

    const parsedLimit = Number.parseInt(req.query.limit, 10)
    const limit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 20

    const data = await getTrending({ period, limit })

    res.json({ data, meta: { period, count: data.length } })
  } catch (err) {
    next(err)
  }
}



