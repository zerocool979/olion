'use strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'olion-auth-enumeration-test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/olion_test'
process.env.REQUIRE_EMAIL_VERIFICATION = 'false'

const test = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcryptjs')
const prisma = require('../src/config/prisma')
const authService = require('../src/modules/auth/service')

test('unknown, Google-only, and wrong-password accounts share one public login error', async t => {
  const originalFindFirst = prisma.user.findFirst
  const originalCompare = bcrypt.compare
  const originalHash = bcrypt.hash
  const hashCalls = []
  const compareCalls = []

  bcrypt.hash = async (value, rounds) => {
    hashCalls.push({ value, rounds })
    return 'synthetic-dummy-hash'
  }
  bcrypt.compare = async (value, hash) => {
    compareCalls.push({ value, hash })
    return false
  }

  t.after(() => {
    prisma.user.findFirst = originalFindFirst
    bcrypt.compare = originalCompare
    bcrypt.hash = originalHash
  })

  const cases = [
    { label: 'unknown account', user: null, expected: 'hash' },
    {
      label: 'Google-only account',
      user: {
        id: 'google-user',
        email: 'person@example.com',
        password: null,
        tokenVersion: 0,
        emailVerifiedAt: null,
      },
      expected: 'hash',
    },
    {
      label: 'wrong password',
      user: {
        id: 'password-user',
        email: 'person@example.com',
        password: 'stored-bcrypt-hash',
        tokenVersion: 0,
        emailVerifiedAt: null,
      },
      expected: 'compare',
    },
  ]

  const responses = []
  for (const item of cases) {
    prisma.user.findFirst = async () => item.user
    const result = await assert.rejects(
      () => authService.login('person@example.com', 'incorrect-password'),
      err => {
        assert.equal(err.statusCode, 401)
        assert.equal(err.message, 'Email atau password salah')
        return true
      },
      item.label
    )
    responses.push(result)
    if (item.expected === 'hash') {
      assert.deepEqual(hashCalls.at(-1), { value: 'olion-invalid-login-probe-v1', rounds: 12 })
    } else {
      assert.deepEqual(compareCalls.at(-1), { value: 'incorrect-password', hash: 'stored-bcrypt-hash' })
    }
  }

  assert.equal(responses.length, 3)
  assert.equal(hashCalls.length, 2)
  assert.equal(compareCalls.length, 1)
})
