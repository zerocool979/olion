// backend/src/middlewares/notFound.js

/**
 * Middleware untuk menangani route yang tidak ditemukan (404)
 * - Dijalankan setelah semua route lain
 * - Memberikan response JSON standar untuk client
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    // Optional: bisa tambahkan info environment atau base URL
    environment: process.env.NODE_ENV || 'development'
  });
};

// Export middleware
module.exports = notFound;
