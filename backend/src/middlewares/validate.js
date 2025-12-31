// backend/src/middlewares/validate.js
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware untuk memvalidasi hasil dari express-validator
 * - Jika ada error, akan diteruskan ke global error handler
 * - Error pertama saja yang dikirim, bisa disesuaikan untuk mengirim semua errors
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Ambil error pertama
    const firstError = errors.array()[0];
    // Kirim ke global error handler
    return next(new AppError(firstError.msg, 422));
  }

  // Tidak ada error, lanjut ke route handler
  next();
};

/**
 * Optional helper untuk menampilkan semua error sekaligus
 * Jika suatu saat ingin menampilkan full errors array
 */
validateRequest.fullErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(
      'Validation failed',
      422,
      errors.array() // bisa disesuaikan format
    ));
  }

  next();
};

// Export middleware
module.exports = validateRequest;
