'use strict'
const jwt = require('jsonwebtoken')
const { JWT_SECRET, REQUIRE_EMAIL_VERIFICATION } = require('../config/env')
const prisma = require('../config/prisma')

function createAuthMiddleware({
  jwtSecret = JWT_SECRET,
  prismaClient = prisma,
  requireEmailVerification = REQUIRE_EMAIL_VERIFICATION,
} = {}) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token tidak ditemukan' })
      }

      const token = header.slice(7)
      let decoded
      try {
        decoded = jwt.verify(token, jwtSecret)
      } catch {
        return res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
      }

      const user = await prismaClient.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          role: true,
          isBanned: true,
          tokenVersion: true,
          emailVerifiedAt: true,
        },
      })

      if (!user) return res.status(401).json({ message: 'Akun tidak ditemukan' })
      if (user.isBanned) return res.status(403).json({ message: 'Akun kamu telah dinonaktifkan' })
      if (requireEmailVerification && !user.emailVerifiedAt) {
        return res.status(403).json({
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Email belum terverifikasi. Verifikasi email untuk melanjutkan.',
        })
      }
      if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
        return res.status(401).json({ message: 'Sesi telah berakhir. Silakan masuk kembali.' })
      }

      req.userId = user.id
      req.userRole = user.role
      return next()
    } catch (err) {
      return next(err)
    }
  }
}

const authMiddleware = createAuthMiddleware()
authMiddleware.createAuthMiddleware = createAuthMiddleware
module.exports = authMiddleware
