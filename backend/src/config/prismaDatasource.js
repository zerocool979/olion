'use strict'

/**
 * Prisma Postgres on Vercel Marketplace provides a direct DATABASE_URL for
 * schema/migration commands and DATABASE_URL_POOLED for application traffic.
 * Existing PostgreSQL providers remain supported through DATABASE_URL.
 */
function getPrismaDatasourceOptions(env = process.env) {
  const url = env.DATABASE_URL_POOLED || env.DATABASE_URL
  if (!url) return {}

  return {
    datasources: {
      db: { url },
    },
  }
}

module.exports = { getPrismaDatasourceOptions }
