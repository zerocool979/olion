const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const prisma = require('../lib/prisma');

/**
 * AUTHENTICATE
 * - FIX: Ambil user dari DB agar role selalu valid
 */
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return next(new AppError('Unauthorized', 401));

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * ❌ SALAH (tidak dihapus sesuai instruksi)
     * req.user = decoded;
     */

    // ✅ FIX: ambil user lengkap dari database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user)
      return next(new AppError('User not found', 401));

    req.user = user; // ✅ sekarang role PASTI ADA
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

/**
 * AUTHORIZE
 * - Sudah BENAR
 * - Akan bekerja setelah authenticate di-fix
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('Forbidden', 403));
    next();
  };
};
