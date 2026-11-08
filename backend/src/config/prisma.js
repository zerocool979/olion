'use strict'

const { assertSafePreviewDatabase } = require('./databaseEnvironmentGuard')

// Preview deployments must never fall back to a Production database or run
// without an explicitly provisioned, isolated staging database.
assertSafePreviewDatabase(process.env)

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['error', 'warn']
    : ['error']
})

module.exports = prisma
