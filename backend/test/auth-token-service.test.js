'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const {
  createAuthTokenService,
  EMAIL_VERIFICATION_TTL_MS,
  PASSWORD_RESET_TTL_MS,
} = require('../src/modules/auth/tokenService')

function createHarness({ configured = true, sendFails = false } = {}) {
  const now = { value: new Date('2026-11-08T00:00:00.000Z') }
  const tokens = []
  const users = new Map([
    ['user-1', { id: 'user-1', emailVerifiedAt: null, password: 'old-hash', tokenVersion: 0 }],
  ])
  const deliveries = []
  let randomCounter = 0

  function matches(record, where) {
    if (where.id && record.id !== where.id) return false
    if (where.userId && record.userId !== where.userId) return false
    if (where.purpose && record.purpose !== where.purpose) return false
    if (where.tokenHash && record.tokenHash !== where.tokenHash) return false
    if (where.consumedAt === null && record.consumedAt !== null) return false
    if (where.expiresAt?.gt && !(record.expiresAt > where.expiresAt.gt)) return false
    return true
  }

  const tx = {
    authToken: {
      updateMany: async ({ where, data }) => {
        let count = 0
        for (const record of tokens) {
          if (matches(record, where)) {
            Object.assign(record, data)
            count++
          }
        }
        return { count }
      },
      create: async ({ data }) => {
        const record = {
          id: 'auth-token-' + (tokens.length + 1),
          consumedAt: null,
          createdAt: now.value,
          ...data,
        }
        tokens.push(record)
        return record
      },
      findUnique: async ({ where }) => tokens.find(row => row.tokenHash === where.tokenHash) || null,
    },
    user: {
      update: async ({ where, data }) => {
        const user = users.get(where.id)
        if (!user) throw new Error('missing user fixture')
        for (const [key, value] of Object.entries(data)) {
          if (key === 'tokenVersion' && value?.increment) user.tokenVersion += value.increment
          else user[key] = value
        }
        return user
      },
    },
  }

  const prismaClient = { $transaction: callback => callback(tx) }
  const mailerClient = {
    isConfigured: () => configured,
    sendAuthLink: async payload => {
      if (sendFails) throw new Error('synthetic SMTP failure')
      deliveries.push(payload)
    },
  }

  const service = createAuthTokenService({
    prismaClient,
    mailerClient,
    nowFn: () => new Date(now.value),
    randomBytesFn: () => Buffer.alloc(32, ++randomCounter),
    passwordHashFn: async value => 'bcrypt-hash:' + value,
  })

  return { service, tokens, users, deliveries, now }
}

test('email verification token is SHA-256 stored, expires in 24 hours, and is single-use', async () => {
  const h = createHarness()
  const result = await h.service.issueVerification('user-1', 'person@example.com')
  const delivery = h.deliveries[0]
  const record = h.tokens[0]

  assert.equal(delivery.purpose, 'EMAIL_VERIFICATION')
  assert.equal(delivery.to, 'person@example.com')
  assert.equal(result.expiresAt.getTime() - h.now.value.getTime(), EMAIL_VERIFICATION_TTL_MS)
  assert.notEqual(record.tokenHash, delivery.token)
  assert.equal(record.tokenHash, crypto.createHash('sha256').update(delivery.token).digest('hex'))

  await h.service.verifyEmail(delivery.token)
  assert.ok(h.users.get('user-1').emailVerifiedAt instanceof Date)
  assert.ok(record.consumedAt instanceof Date)
  await assert.rejects(() => h.service.verifyEmail(delivery.token), /Token tidak valid/)
})

test('password reset token expires in one hour and revokes previously issued JWT versions', async () => {
  const h = createHarness()
  const result = await h.service.issuePasswordReset('user-1', 'person@example.com')
  const delivery = h.deliveries[0]
  assert.equal(delivery.purpose, 'PASSWORD_RESET')
  assert.equal(result.expiresAt.getTime() - h.now.value.getTime(), PASSWORD_RESET_TTL_MS)

  await h.service.resetPassword(delivery.token, 'a-strong-password')
  const user = h.users.get('user-1')
  assert.equal(user.password, 'bcrypt-hash:a-strong-password')
  assert.equal(user.tokenVersion, 1)
  assert.ok(h.tokens[0].consumedAt instanceof Date)
  await assert.rejects(() => h.service.resetPassword(delivery.token, 'another-password'), /Token tidak valid/)
})

test('expired tokens cannot be consumed', async () => {
  const h = createHarness()
  const result = await h.service.issueVerification('user-1', 'person@example.com')
  h.now.value = new Date(result.expiresAt.getTime() + 1)
  await assert.rejects(() => h.service.verifyEmail(h.deliveries[0].token), /Token tidak valid/)
  assert.equal(h.users.get('user-1').emailVerifiedAt, null)
})

test('issuing a replacement token consumes earlier active tokens of the same purpose', async () => {
  const h = createHarness()
  await h.service.issueVerification('user-1', 'person@example.com')
  await h.service.issueVerification('user-1', 'person@example.com')
  assert.ok(h.tokens[0].consumedAt instanceof Date)
  assert.equal(h.tokens[1].consumedAt, null)
  await assert.rejects(() => h.service.verifyEmail(h.deliveries[0].token), /Token tidak valid/)
  await h.service.verifyEmail(h.deliveries[1].token)
  assert.ok(h.users.get('user-1').emailVerifiedAt instanceof Date)
})

test('SMTP delivery failure invalidates the token and does not return its raw value', async () => {
  const h = createHarness({ sendFails: true })
  await assert.rejects(
    () => h.service.issueVerification('user-1', 'person@example.com'),
    err => err.code === 'MAIL_DELIVERY_FAILED' && err.statusCode === 503
  )
  assert.equal(h.tokens.length, 1)
  assert.ok(h.tokens[0].consumedAt instanceof Date)
})

test('token issuance is blocked when SMTP is not configured', async () => {
  const h = createHarness({ configured: false })
  await assert.rejects(
    () => h.service.issuePasswordReset('user-1', 'person@example.com'),
    err => err.code === 'MAIL_NOT_CONFIGURED' && err.statusCode === 503
  )
  assert.equal(h.tokens.length, 0)
  assert.equal(h.deliveries.length, 0)
})

test('malformed tokens are rejected before database access', async () => {
  const h = createHarness()
  await assert.rejects(() => h.service.verifyEmail('not-a-token'), /Token tidak valid/)
  assert.equal(h.tokens.length, 0)
})
