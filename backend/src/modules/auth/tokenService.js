'use strict'

const crypto = require('node:crypto')
const bcrypt = require('bcryptjs')
const prisma = require('../../config/prisma')
const mailer = require('./mailer')

const PURPOSE = Object.freeze({
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
})
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000

function invalidTokenError() {
  const err = new Error('Token tidak valid, sudah digunakan, atau telah kedaluwarsa.')
  err.statusCode = 400
  err.code = 'AUTH_TOKEN_INVALID'
  return err
}

function createAuthTokenService({
  prismaClient = prisma,
  mailerClient = mailer,
  randomBytesFn = crypto.randomBytes,
  hashFn = value => crypto.createHash('sha256').update(value).digest('hex'),
  nowFn = () => new Date(),
  passwordHashFn = value => bcrypt.hash(value, 12),
} = {}) {
  async function issue({ userId, email, purpose, expiresInMs }) {
    if (!mailerClient.isConfigured()) {
      const err = new Error('Pengiriman email belum dikonfigurasi.')
      err.statusCode = 503
      err.code = 'MAIL_NOT_CONFIGURED'
      throw err
    }

    const rawToken = randomBytesFn(32).toString('hex')
    const tokenHash = hashFn(rawToken)
    const now = nowFn()
    const expiresAt = new Date(now.getTime() + expiresInMs)

    await prismaClient.$transaction(async tx => {
      await tx.authToken.updateMany({
        where: { userId, purpose, consumedAt: null },
        data: { consumedAt: now },
      })
      await tx.authToken.create({
        data: { userId, purpose, tokenHash, expiresAt },
      })
    })

    try {
      await mailerClient.sendAuthLink({ to: email, token: rawToken, purpose })
    } catch {
      // A failed delivery must never leave a usable token behind.
      await prismaClient.$transaction(async tx => {
        await tx.authToken.updateMany({
          where: { tokenHash, consumedAt: null },
          data: { consumedAt: nowFn() },
        })
      }).catch(() => {})
      const err = new Error('Email tidak dapat dikirim saat ini. Silakan coba lagi nanti.')
      err.statusCode = 503
      err.code = 'MAIL_DELIVERY_FAILED'
      throw err
    }
    // Never return or log raw tokens outside the outbound email.
    return { expiresAt }
  }

  async function consume(rawToken, purpose, updateUser) {
    if (typeof rawToken !== 'string' || rawToken.length !== 64 || !/^[a-f0-9]{64}$/i.test(rawToken)) {
      throw invalidTokenError()
    }
    const tokenHash = hashFn(rawToken)
    const now = nowFn()

    await prismaClient.$transaction(async tx => {
      const record = await tx.authToken.findUnique({ where: { tokenHash } })
      if (
        !record ||
        record.purpose !== purpose ||
        record.consumedAt ||
        record.expiresAt <= now
      ) {
        throw invalidTokenError()
      }

      // Conditional update makes a token single-use even under concurrent requests.
      const claimed = await tx.authToken.updateMany({
        where: {
          id: record.id,
          purpose,
          consumedAt: null,
          expiresAt: { gt: now },
        },
        data: { consumedAt: now },
      })
      if (claimed.count !== 1) throw invalidTokenError()

      await updateUser(tx, record.userId, now)
    })
  }

  return {
    isConfigured: () => mailerClient.isConfigured(),

    issueVerification: (userId, email) => issue({
      userId,
      email,
      purpose: PURPOSE.EMAIL_VERIFICATION,
      expiresInMs: EMAIL_VERIFICATION_TTL_MS,
    }),

    issuePasswordReset: (userId, email) => issue({
      userId,
      email,
      purpose: PURPOSE.PASSWORD_RESET,
      expiresInMs: PASSWORD_RESET_TTL_MS,
    }),

    verifyEmail: rawToken => consume(rawToken, PURPOSE.EMAIL_VERIFICATION, async (tx, userId, now) => {
      await tx.user.update({
        where: { id: userId },
        data: { emailVerifiedAt: now },
      })
      await tx.authToken.updateMany({
        where: { userId, purpose: PURPOSE.EMAIL_VERIFICATION, consumedAt: null },
        data: { consumedAt: now },
      })
    }),

    resetPassword: async (rawToken, newPassword) => {
      const password = await passwordHashFn(newPassword)
      await consume(rawToken, PURPOSE.PASSWORD_RESET, async (tx, userId) => {
        // Increment tokenVersion so all previously issued JWTs become invalid.
        await tx.user.update({
          where: { id: userId },
          data: { password, tokenVersion: { increment: 1 } },
        })
        await tx.authToken.updateMany({
          where: { userId, purpose: PURPOSE.PASSWORD_RESET, consumedAt: null },
          data: { consumedAt: nowFn() },
        })
      })
    },
  }
}

module.exports = {
  PURPOSE,
  EMAIL_VERIFICATION_TTL_MS,
  PASSWORD_RESET_TTL_MS,
  createAuthTokenService,
}
