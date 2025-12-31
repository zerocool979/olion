// backend/src/middlewares/roleMiddleware.js

/**
 * =====================================================
 * Role Middleware - Enhanced Version
 * -----------------------------------------------------
 * Features:
 * 1. Flexible role-based authorization
 * 2. Case-insensitive role checking
 * 3. Detailed error responses
 * 4. Support for multiple allowed roles
 * 5. Role hierarchy support (admin > moderator > pakar > user)
 * =====================================================
 */

// Original code - keep for backward compatibility
exports.requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

/**
 * =====================================================
 * ENHANCED ROLE MIDDLEWARE
 * =====================================================
 */

/**
 * Middleware untuk mengecek apakah user memiliki salah satu dari roles yang diizinkan
 * @param {...string} allowedRoles - Role yang diizinkan mengakses route
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role?.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        details: {
          requiredRoles: normalizedAllowedRoles,
          yourRole: userRole,
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  };
};

/**
 * Middleware untuk mengecek role hierarchy
 * Admin > Moderator > Pakar > User
 */
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userRole = req.user.role?.toUpperCase();
  if (userRole !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
      details: { yourRole: userRole }
    });
  }

  next();
};

exports.requireAdminOrModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userRole = req.user.role?.toUpperCase();
  const allowedRoles = ['ADMIN', 'MODERATOR'];

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin or Moderator access required',
      details: { yourRole: userRole, allowedRoles }
    });
  }

  next();
};

exports.requirePakarOrAbove = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userRole = req.user.role?.toUpperCase();
  const allowedRoles = ['ADMIN', 'MODERATOR', 'PAKAR'];

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Pakar or higher access required',
      details: { yourRole: userRole, allowedRoles }
    });
  }

  next();
};

/**
 * Middleware untuk mengecek ownership (user hanya bisa akses data sendiri)
 * @param {string} resourceParam - Nama parameter yang berisi resource ID (default: 'id')
 * @param {string} userField - Field di resource yang berisi user ID (default: 'userId')
 */
exports.requireOwnership = (resourceParam = 'id', userField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (req.user.role?.toUpperCase() === 'ADMIN') return next();

      const resourceId = req.params[resourceParam];
      if (!resourceId) return res.status(400).json({ success: false, message: 'Resource ID is required' });

      if (resourceParam === 'id' && resourceId === req.user.id) return next();

      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only access your own data',
        details: { requestedResource: resourceId, yourUserId: req.user.id }
      });

    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error during ownership validation' });
    }
  };
};

/**
 * Middleware untuk kombinasi ownership dan role
 * Allows: Admin selalu bisa, Owner jika memiliki salah satu dari roles yang diizinkan
 */
exports.requireOwnershipOrRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const userRole = req.user.role?.toUpperCase();
      const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());

      if (userRole === 'ADMIN' || normalizedAllowedRoles.includes(userRole)) return next();

      const resourceId = req.params.id;
      if (resourceId && resourceId === req.user.id) return next();

      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this resource',
        details: { yourRole: userRole, allowedRoles: normalizedAllowedRoles, resourceId }
      });

    } catch (error) {
      console.error('OwnershipOrRole check error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error during permission validation' });
    }
  };
};

/**
 * Helper function untuk mengecek role hierarchy
 */
exports.hasRole = (userRole, requiredRole) => {
  const roleHierarchy = { USER: 1, PAKAR: 2, MODERATOR: 3, ADMIN: 4 };
  const userLevel = roleHierarchy[userRole?.toUpperCase()] || 0;
  const requiredLevel = roleHierarchy[requiredRole?.toUpperCase()] || 0;
  return userLevel >= requiredLevel;
};

module.exports = exports;
