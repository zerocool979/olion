const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env')

// ─── FIX: Fail fast jika JWT_SECRET tidak di-set
// Ini harus di-check saat app startup, bukan saat generate token
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set')
}

const DEFAULT_EXPIRE = '7d'

module.exports = {
  generateToken: (userId, tokenVersion = 0) => {
    return jwt.sign(
      { id: userId, tokenVersion },
      JWT_SECRET,
      // ─── FIX: fallback ke '7d' jika JWT_EXPIRE tidak di-set
      { expiresIn: JWT_EXPIRE || DEFAULT_EXPIRE }
    )
  },

  verifyToken: (token) => {
    // ─── FIX: biarkan caller handle error, jangan swallow exception
    return jwt.verify(token, JWT_SECRET)
  }
}


