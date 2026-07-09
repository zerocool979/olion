'use strict'
const service = require('./service')

module.exports = {
  // GET /bookmarks
  list: async (req, res, next) => {
    try {
      const data = await service.list(req.userId)
      res.json({ data })
    } catch (e) { next(e) }
  },

  // POST /discussions/:id/bookmark
  add: async (req, res, next) => {
    try {
      const data = await service.add(req.userId, req.params.id)
      res.status(201).json({ data })
    } catch (e) { next(e) }
  },

  // DELETE /discussions/:id/bookmark
  removeByDiscussion: async (req, res, next) => {
    try {
      const data = await service.removeByDiscussion(req.userId, req.params.id)
      res.status(200).json({ data })
    } catch (e) { next(e) }
  },

  // DELETE /bookmarks/:id
  removeById: async (req, res, next) => {
    try {
      const data = await service.removeById(req.userId, req.params.id)
      res.status(200).json({ data })
    } catch (e) { next(e) }
  },
}
