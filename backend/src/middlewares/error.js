'use strict'
const { NODE_ENV } = require('../config/env')

/**
 * Global error handler.
 *
 * Perbaikan:
 * - Di production, TIDAK kirim err.message mentah ke client (bisa bocorkan
 *   nama tabel/kolom Prisma atau detail internal lain)
 * - err.statusCode dari service/controller dihormati (400, 401, 403, 404, 409, ...)
 * - Log selalu di server terlepas environment
 * - Di development, error detail tetap dikembalikan untuk memudahkan debugging
 */
module.exports = (err, req, res, next) => {
  // Log lengkap di server
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  console.error(err)

  const status = err.statusCode || err.status || 500

  // Jangan bocorkan detail ke production
  if (NODE_ENV === 'production' && status === 500) {
    return res.status(500).json({ message: 'Terjadi kesalahan internal. Silakan coba lagi.' })
  }

  res.status(status).json({ message: err.message || 'Internal server error' })
}


