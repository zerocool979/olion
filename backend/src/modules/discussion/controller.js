const discussionService = require('./service')

module.exports = {
  list: async (req, res, next) => {
    try {
      const discussions = await discussionService.list()
      res.json({ data: discussions })
    } catch (err) {
      next(err)
    }
  },

  detail: async (req, res, next) => {
    try {
      const discussion = await discussionService.detail(req.params.id)
      res.json({ data: discussion })
    } catch (err) {
      next(err)
    }
  },

  create: async (req, res, next) => {
    try {
      const { categoryId, title, content, mode, discipline } = req.body
      const discussion = await discussionService.create(
        req.userId, categoryId, title, content, mode, discipline
      )
      res.json({ data: discussion })
    } catch (err) {
      next(err)
    }
  }
}
