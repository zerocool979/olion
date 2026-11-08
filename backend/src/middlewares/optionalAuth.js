'use strict'
const jwt = require('jsonwebtoken')
const { JWT_SECRET, REQUIRE_EMAIL_VERIFICATION } = require('../config/env')
const prisma = require('../config/prisma')

function createOptionalAuthMiddleware({
  jwtSecret = JWT_SECRET,
  prismaClient = prisma,
  requireEmailVerification = REQUIRE_EMAIL_VERIFICATION,
} = {}) {
  return async (req, _res, next) => {
    try {
      const header = req.headers.authorization
      if (!header || !header.startsWith('Bearer ')) return next()

      const token = header.slice(7)
      let decoded
      try {
        decoded = jwt.verify(token, jwtSecret)
      } catch {
        return next()
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

      if (
        user &&
        !user.isBanned &&
        (!requireEmailVerification || user.emailVerifiedAt) &&
        (decoded.tokenVersion ?? 0) === (user.tokenVersion ?? 0)
      ) {
        req.userId = user.id
        req.userRole = user.role
      }

      return next()
    } catch {
      // Optional authentication must never turn a public endpoint into a 500.
      return next()
    }
  }
}

const optionalAuthMiddleware = createOptionalAuthMiddleware()
optionalAuthMiddleware.createOptionalAuthMiddleware = createOptionalAuthMiddleware
module.exports = optionalAuthMiddleware
