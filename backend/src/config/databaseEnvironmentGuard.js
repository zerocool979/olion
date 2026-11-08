'use strict'

/**
 * A Vercel Preview deployment is not allowed to use an implicit/shared
 * database. A branch-scoped database URL and an explicit isolation marker
 * must both be provisioned before the API initializes Prisma.
 *
 * Production and local development are deliberately unaffected.
 */
function assertSafePreviewDatabase(env = process.env) {
  if (env.VERCEL_ENV !== 'preview') return true

  if (env.OLION_PREVIEW_DATABASE_ISOLATED !== 'true') {
    throw new Error(
      'OLION Preview is disabled: provision a branch-specific isolated staging database before deployment.'
    )
  }

  if (!env.DATABASE_URL) {
    throw new Error(
      'OLION Preview is disabled: the isolated staging DATABASE_URL is missing.'
    )
  }

  let parsed
  try {
    parsed = new URL(env.DATABASE_URL)
  } catch {
    throw new Error(
      'OLION Preview is disabled: the staging DATABASE_URL is invalid.'
    )
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error(
      'OLION Preview is disabled: staging DATABASE_URL must use PostgreSQL.'
    )
  }

  const host = parsed.hostname.toLowerCase()
  const normalizedHost = host.replace(/^\[|\]$/g, '')
  const isLoopback = normalizedHost === 'localhost'
    || normalizedHost.endsWith('.localhost')
    || normalizedHost === '::1'
    || normalizedHost.startsWith('127.')
  if (isLoopback) {
    throw new Error(
      'OLION Preview is disabled: staging DATABASE_URL must use a remote isolated database.'
    )
  }

  return true
}

module.exports = { assertSafePreviewDatabase }
