// backend/src/middlewares/errorHandler.js

/**
 * Global Error Handler Middleware
 * - Menangani semua error yang dilempar oleh route atau middleware lain
 * - Memisahkan error operasional (user-friendly) dan programming/internal error
 * - Bisa ditambahkan logging ke file atau service eksternal (misal Sentry)
 */

module.exports = (err, req, res, next) => {
  // Ambil status code, default 500 (Internal Server Error)
  const status = err.statusCode || 500;

  // Logging error ke console
  // Bisa dikembangkan ke logger eksternal
  console.error('🔥 GLOBAL ERROR:', {
    message: err.message,
    stack: err.stack,
    status: status,
    isOperational: err.isOperational || false,
    timestamp: new Date().toISOString(),
  });

  // Kirim response ke client
  res.status(status).json({
    success: false,
    // Jika error operasional, kirim pesan spesifik
    // Jika error internal, jangan bocorkan detail
    message: err.isOperational
      ? err.message
      : 'Internal Server Error',
    // Optional: kirim error stack di development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
