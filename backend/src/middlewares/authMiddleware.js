// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const prisma = require('../lib/prisma');

/**
 * AUTHENTICATE
 * Middleware untuk memverifikasi JWT dan mengambil data user dari DB
 * - Memastikan role selalu valid
 */
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil user lengkap dari database (id + role)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user; // Sekarang role pasti ada
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

/**
 * AUTHORIZE
 * Middleware untuk mengecek apakah user memiliki salah satu role yang diizinkan
 * - Harus dipanggil setelah authenticate
 * @param  {...string} roles - daftar role yang diizinkan
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
};

/**
 * OPTIONAL: helper untuk memeriksa role dengan hierarki
 * - Misal: ADMIN > MODERATOR > PAKAR > USER
 */
exports.hasRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    USER: 1,
    PAKAR: 2,
    MODERATOR: 3,
    ADMIN: 4,
  };

  const userLevel = roleHierarchy[userRole?.toUpperCase()] || 0;
  const requiredLevel = roleHierarchy[requiredRole?.toUpperCase()] || 0;

  return userLevel >= requiredLevel;
};
