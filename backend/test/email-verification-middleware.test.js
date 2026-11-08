'use strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'olion-email-verification-middleware-test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/olion_test'

const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const { createAuthMiddleware } = require('../src/middlewares/auth')
const { createOptionalAuthMiddleware } = require('../src/middlewares/optionalAuth')

const secret = process.env.JWT_SECRET
const id = '11111111-1111-4111-8111-111111111111'
const token = jwt.sign({ id, tokenVersion: 0 }, secret, { expiresIn: '5m' })

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
  }
}

test('required email verification blocks existing unverified JWT sessions on protected routes', async () => {
  const middleware = createAuthMiddleware({
    jwtSecret: secret,
    requireEmailVerification: true,
    prismaClient: {
      user: { findUnique: async () => ({
        id, role: 'USER', isBanned: false, tokenVersion: 0, emailVerifiedAt: null,
      }) },
    },
  })
  const req = { headers: { authorization: 'Bearer ' + token } }
  const res = response()
  let nextCalled = false

  await middleware(req, res, () => { nextCalled = true })

  assert.equal(res.statusCode, 403)
  assert.equal(res.body.code, 'EMAIL_NOT_VERIFIED')
  assert.equal(nextCalled, false)
  assert.equal(req.userId, undefined)
})

test('verified accounts pass protected-route email verification and retain their role context', async () => {
  const middleware = createAuthMiddleware({
    jwtSecret: secret,
    requireEmailVerification: true,
    prismaClient: {
      user: { findUnique: async () => ({
        id, role: 'EXPERT', isBanned: false, tokenVersion: 0,
        emailVerifiedAt: new Date('2026-11-08T00:00:00.000Z'),
      }) },
    },
  })
  const req = { headers: { authorization: 'Bearer ' + token } }
  const res = response()
  let nextCalled = false

  await middleware(req, res, () => { nextCalled = true })

  assert.equal(nextCalled, true)
  assert.equal(req.userId, id)
  assert.equal(req.userRole, 'EXPERT')
})

test('optional authentication treats unverified JWT sessions as guests when verification is required', async () => {
  const middleware = createOptionalAuthMiddleware({
    jwtSecret: secret,
    requireEmailVerification: true,
    prismaClient: {
      user: { findUnique: async () => ({
        id, role: 'USER', isBanned: false, tokenVersion: 0, emailVerifiedAt: null,
      }) },
    },
  })
  const req = { headers: { authorization: 'Bearer ' + token } }
  let nextCalled = false

  await middleware(req, response(), () => { nextCalled = true })

  assert.equal(nextCalled, true)
  assert.equal(req.userId, undefined)
  assert.equal(req.userRole, undefined)
})

test('email verification remains backward-compatible while the feature flag is disabled', async () => {
  const middleware = createAuthMiddleware({
    jwtSecret: secret,
    requireEmailVerification: false,
    prismaClient: {
      user: { findUnique: async () => ({
        id, role: 'USER', isBanned: false, tokenVersion: 0, emailVerifiedAt: null,
      }) },
    },
  })
  const req = { headers: { authorization: 'Bearer ' + token } }
  let nextCalled = false

  await middleware(req, response(), () => { nextCalled = true })

  assert.equal(nextCalled, true)
  assert.equal(req.userId, id)
})
