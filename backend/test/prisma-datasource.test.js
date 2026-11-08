'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const { getPrismaDatasourceOptions } = require('../src/config/prismaDatasource')

test('application Prisma client prefers pooled PostgreSQL URL when available', () => {
  assert.deepEqual(
    getPrismaDatasourceOptions({
      DATABASE_URL: 'postgresql://direct.example/olion',
      DATABASE_URL_POOLED: 'postgresql://pooled.example/olion',
    }),
    {
      datasources: {
        db: { url: 'postgresql://pooled.example/olion' },
      },
    }
  )
})

test('application Prisma client falls back to the direct URL for other PostgreSQL providers', () => {
  assert.deepEqual(
    getPrismaDatasourceOptions({
      DATABASE_URL: 'postgresql://direct.example/olion',
    }),
    {
      datasources: {
        db: { url: 'postgresql://direct.example/olion' },
      },
    }
  )
})

test('Prisma datasource options remain empty when no database URL is configured', () => {
  assert.deepEqual(getPrismaDatasourceOptions({}), {})
})
