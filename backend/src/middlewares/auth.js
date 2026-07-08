'use strict'
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const prisma = require('../config/prisma')

/**
 * Middleware autentikasi.
 * 1. Cek header Authorization: Bearer <token>
 * 2. Verifikasi signature & expiry JWT
 * 3. Pastikan user masih ada di DB dan belum di-ban
 *    (tanpa ini, token lama tetap valid meski akun dihapus/dibanned)
 */
module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak ditemukan' })
    }

    const token = header.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
    }

    // Verifikasi user masih eksis & tidak dibanned
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isBanned: true }
    })

    if (!user) return res.status(401).json({ message: 'Akun tidak ditemukan' })
    if (user.isBanned) return res.status(403).json({ message: 'Akun kamu telah dinonaktifkan' })

    req.userId   = user.id
    req.userRole = user.role
    next()
  } catch (err) {
    next(err)
  }
}


