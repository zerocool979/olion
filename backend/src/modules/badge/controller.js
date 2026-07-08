'use strict'
const service = require('./service')

module.exports = {
  // GET /badges — daftar semua badge yang tersedia
  listAll: async (req, res, next) => {
    try {
      const badges = await service.getAll()
      res.json({ data: badges })
    } catch (e) { next(e) }
  },

  // GET /users/:id/badges — badge milik satu user
  listByUser: async (req, res, next) => {
    try {
      const badges = await service.getByUser(req.params.id)
      res.json({ data: badges })
    } catch (e) { next(e) }
  },
}


