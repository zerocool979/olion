'use strict'

/**
 * Middleware otorisasi berbasis role.
 *
 * Perbaikan dari versi sebelumnya:
 * - Dukung array role: role('ADMIN') | role(['ADMIN', 'MODERATOR'])
 * - Ambil role dari req.userRole (sudah diset auth.js) — tidak perlu hit DB lagi
 * - Handle user null dengan 401, bukan 500
 * - ADMIN secara implisit lolos semua level (hierarki role)
 *
 * Penggunaan di routes.js:
 *   router.put('/reports/:id', auth, role('MODERATOR'), ...)
 *   router.get('/admin/users', auth, role('ADMIN'), ...)
 */
module.exports = (requiredRoles) => (req, res, next) => {
  const allowed = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

  if (!req.userRole) {
    return res.status(401).json({ message: 'Autentikasi diperlukan' })
  }

  // ADMIN lolos semua endpoint
  if (req.userRole === 'ADMIN' || allowed.includes(req.userRole)) {
    return next()
  }

  return res.status(403).json({
    message: `Akses ditolak. Diperlukan role: ${allowed.join(' atau ')}`
  })
}


