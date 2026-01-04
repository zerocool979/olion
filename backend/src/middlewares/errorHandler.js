// backend/src/middlewares/errorHandler.js

const AppError = require('../utils/AppError');

/**
 * Global Error Handler Middleware (STABLE v1)
 */
const errorHandler = (err, req, res, next) => {
  // ===== DEFAULT =====
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorCode = 'INTERNAL_ERROR';
  let errors;

  // ===== APP ERROR (MAIN PATH) =====
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode || errorCode;
    errors = err.errors;
  }

  // ===== PRISMA =====
  else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry detected';
    errorCode = 'PRISMA_DUPLICATE';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    errorCode = 'PRISMA_NOT_FOUND';
  }

  // ===== JWT =====
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorCode = 'AUTH_INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorCode = 'AUTH_TOKEN_EXPIRED';
  }

  // ===== LOGGING (STRUCTURED) =====
  console.error({
    type: 'ERROR',
    path: req.originalUrl,
    method: req.method,
    errorCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // ===== RESPONSE =====
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      errors: errors || undefined,
    },
    meta: {
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = errorHandler;
