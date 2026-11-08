'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { assertSafePreviewDatabase } = require('../src/config/databaseEnvironmentGuard')

const validStagingEnv = {
  VERCEL_ENV: 'preview',
  OLION_PREVIEW_DATABASE_ISOLATED: 'true',
  DATABASE_URL: 'postgresql://staging_user:staging_password@ep-staging.us-east-2.aws.neon.tech/olion_staging?sslmode=require',
}

test('production and local environments are not blocked by the Preview guard', () => {
  assert.equal(assertSafePreviewDatabase({ VERCEL_ENV: 'production' }), true)
  assert.equal(assertSafePreviewDatabase({ NODE_ENV: 'development' }), true)
})

test('Preview fails closed without explicit isolated-database marker', () => {
  assert.throws(
    () => assertSafePreviewDatabase({
      VERCEL_ENV: 'preview',
      DATABASE_URL: validStagingEnv.DATABASE_URL,
    }),
    /isolated staging database/
  )
})

test('Preview fails closed when isolated staging DATABASE_URL is missing', () => {
  assert.throws(
    () => assertSafePreviewDatabase({
      VERCEL_ENV: 'preview',
      OLION_PREVIEW_DATABASE_ISOLATED: 'true',
    }),
    /DATABASE_URL is missing/
  )
})

test('Preview rejects malformed and non-PostgreSQL database URLs', () => {
  assert.throws(
    () => assertSafePreviewDatabase({
      ...validStagingEnv,
      DATABASE_URL: 'not-a-url',
    }),
    /DATABASE_URL is invalid/
  )

  assert.throws(
    () => assertSafePreviewDatabase({
      ...validStagingEnv,
      DATABASE_URL: 'https://example.com/database',
    }),
    /must use PostgreSQL/
  )
})

test('Preview rejects loopback database hosts', () => {
  assert.throws(
    () => assertSafePreviewDatabase({
      ...validStagingEnv,
      DATABASE_URL: 'postgresql://user:pass@127.0.0.1:5432/olion',
    }),
    /remote isolated database/
  )
})

test('Preview accepts an explicitly isolated remote PostgreSQL database', () => {
  assert.equal(assertSafePreviewDatabase(validStagingEnv), true)
})
