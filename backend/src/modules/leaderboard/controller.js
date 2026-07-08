'use strict'
const { getLeaderboard } = require('./service')

// GET /leaderboard?period=week|month|all&limit=50
module.exports.list = async (req, res, next) => {
  try {
    const period = ['week', 'month', 'all'].includes(req.query.period)
      ? req.query.period
      : 'all'

    const limit = Math.min(parseInt(req.query.limit) || 50, 100)

    const data = await getLeaderboard({ period, limit })

    res.json({ data, meta: { period, count: data.length } })
  } catch (err) {
    next(err)
  }
}



