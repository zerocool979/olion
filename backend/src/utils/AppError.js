// backend/src/utils/AppError.js

// ============================================
// OLD VERSION (KEPT FOR CONTEXT)
// ============================================
// class AppError extends Error {
//   constructor(message, statusCode = 400) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = true;
//   }
// }

// ============================================
// NEW VERSION (STABLE & CONSISTENT)
// ============================================

class AppError extends Error {
  /**
   * @param {string} message - Human readable message
   * @param {number} statusCode - HTTP status code
   * @param {string} errorCode - Stable machine readable error code
   * @param {Array|Object} errors - Optional detailed errors
   */
  constructor(
    message,
    statusCode = 400,
    errorCode = 'APP_ERROR',
    errors = null
  ) {
    super(message);

    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;

    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
