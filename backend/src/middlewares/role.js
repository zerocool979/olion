const prisma = require('../config/prisma')

module.exports = (requiredRole) => async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    })
    if (user.role !== requiredRole) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}