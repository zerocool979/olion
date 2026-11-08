'use strict'

// A Google identity may only sign in directly when it is already linked.
// An existing password account must be authenticated before it can be linked.
function resolveGoogleLogin({ linkedUser, existingEmailUser } = {}) {
  if (linkedUser) return 'LOGIN_LINKED'
  if (existingEmailUser) return 'REQUIRE_EXISTING_ACCOUNT_AUTH'
  return 'CREATE_ACCOUNT'
}

module.exports = { resolveGoogleLogin }
