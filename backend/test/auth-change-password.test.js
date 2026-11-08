'use strict'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'olion-password-change-test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/olion_test'

const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const prisma = require('../src/config/prisma')
const authService = require('../src/modules/auth/service')

test('changing a password rotates the current JWT version and invalidates older sessions', async t => {
  const originalFindUnique = prisma.user.findUnique
  const originalUpdate = prisma.user.update
  const originalCompare = bcrypt.compare
  const originalHash = bcrypt.hash
  const id = '11111111-1111-4111-8111-111111111111'
  let updateArgs = null

  prisma.user.findUnique = async () => ({
    id,
    password: 'old-hash',
    tokenVersion: 6,
  })
  prisma.user.update = async args => {
    updateArgs = args
    return { tokenVersion: 7 }
  }
  bcrypt.compare = async () => true
  bcrypt.hash = async () => 'new-bcrypt-hash'

  t.after(() => {
    prisma.user.findUnique = originalFindUnique
    prisma.user.update = originalUpdate
    bcrypt.compare = originalCompare
    bcrypt.hash = originalHash
  })

  const token = await authService.changePassword(id, 'correct-current-password', 'a-new-long-password')
  const claims = jwt.verify(token, process.env.JWT_SECRET)

  assert.equal(claims.id, id)
  assert.equal(claims.tokenVersion, 7)
  assert.equal(updateArgs.where.id, id)
  assert.equal(updateArgs.data.password, 'new-bcrypt-hash')
  assert.deepEqual(updateArgs.data.tokenVersion, { increment: 1 })
})

test('changing a password with a wrong current password does not write a new hash', async t => {
  const originalFindUnique = prisma.user.findUnique
  const originalUpdate = prisma.user.update
  const originalCompare = bcrypt.compare
  const id = '22222222-2222-4222-8222-222222222222'
  let updateCalled = false

  prisma.user.findUnique = async () => ({ id, password: 'old-hash', tokenVersion: 0 })
  prisma.user.update = async () => { updateCalled = true }
  bcrypt.compare = async () => false

  t.after(() => {
    prisma.user.findUnique = originalFindUnique
    prisma.user.update = originalUpdate
    bcrypt.compare = originalCompare
  })

  await assert.rejects(
    () => authService.changePassword(id, 'wrong-current-password', 'a-new-long-password'),
    err => err.statusCode === 401
  )
  assert.equal(updateCalled, false)
})
