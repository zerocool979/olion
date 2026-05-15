const discussionService = require('./service')

module.exports = {
  // GET /discussions
  list: async (req, res, next) => {
    try {
      const skip = parseInt(req.query.skip) || 0
      const take = parseInt(req.query.take) || 20
      const discussions = await discussionService.list({ skip, take })
      res.json({ data: discussions })
    } catch (err) {
      next(err)
    }
  },

  // GET /discussions/:id
  detail: async (req, res, next) => {
    try {
      const discussion = await discussionService.detail(req.params.id)
      if (!discussion) return res.status(404).json({ message: 'Diskusi tidak ditemukan' })
      res.json({ data: discussion })
    } catch (err) {
      next(err)
    }
  },

  // POST /discussions
  create: async (req, res, next) => {
    try {
      const { categoryId, title, content, mode, discipline } = req.body
      const discussion = await discussionService.create(
        req.userId, categoryId, title, content, mode, discipline
      )
      res.status(201).json({ data: discussion })
    } catch (err) {
      next(err)
    }
  },

  // GET /search?q=&category=&subcategory=&sort=&skip=&take=
  search: async (req, res, next) => {
    try {
      const { q = '', category = '', subcategory = '', sort = 'latest' } = req.query
      const skip = parseInt(req.query.skip) || 0
      const take = parseInt(req.query.take) || 20

      const result = await discussionService.search({ q, category, subcategory, sort, skip, take })

      res.json({
        data: result.data,
        meta: { total: result.total, skip, take },
      })
    } catch (err) {
      next(err)
    }
  },
}
