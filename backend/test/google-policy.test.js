'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { resolveGoogleLogin } = require('../src/modules/auth/googlePolicy')

test('an already-linked Google identity can sign in', () => {
  assert.equal(
    resolveGoogleLogin({ linkedUser: { id: 'user-1' }, existingEmailUser: null }),
    'LOGIN_LINKED'
  )
})

test('an existing email account is never linked automatically', () => {
  assert.equal(
    resolveGoogleLogin({ linkedUser: null, existingEmailUser: { id: 'user-1' } }),
    'REQUIRE_EXISTING_ACCOUNT_AUTH'
  )
})

test('a verified Google identity with no existing account can create one', () => {
  assert.equal(
    resolveGoogleLogin({ linkedUser: null, existingEmailUser: null }),
    'CREATE_ACCOUNT'
  )
})
