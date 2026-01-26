const jwt = require('../utils/jwt')

module.exports = (req, res, next) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = jwt.verify(header.split(' ')[1])
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

