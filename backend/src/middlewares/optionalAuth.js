'use strict'
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const prisma = require('../config/prisma')

/**
 * Middleware autentikasi opsional.
 * Dipakai di endpoint publik (mis. detail diskusi) yang tetap ingin tahu
 * "apakah user ini sudah login" agar bisa menyertakan status vote/bookmark
 * milik user tersebut — tanpa memblokir akses tamu (guest).
 *
 * Beda dengan auth.js: request TETAP lanjut walau token tidak ada / tidak valid,
 * req.userId hanya akan terisi jika token valid & user aktif.
 */
module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) return next()

    const token = header.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch {
      return next()
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isBanned: true },
    })

    if (user && !user.isBanned) {
      req.userId = user.id
      req.userRole = user.role
    }

    next()
  } catch {
    next()
  }
}
