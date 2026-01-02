// src/middlewares/errorHandler.js

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry detected';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => e.message);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
