// src/middlewares/notFound.js

/**
 * 404 Not Found Middleware
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
};

module.exports = notFound;
