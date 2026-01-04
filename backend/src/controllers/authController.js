// backend/src/controllers/authController.js
const authService = require('../services/authService');

/**
 * =====================================================
 * REGISTER
 * =====================================================
 */
exports.register = async (req, res, next) => {
  try {
    // OLD
    // const result = await authService.register(req.body);

    const result = await authService.register({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================================
 * LOGIN
 * =====================================================
 */
exports.login = async (req, res, next) => {
  try {
    // OLD
    // const result = await authService.login(req.body);

    const result = await authService.login({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================================
 * CURRENT USER
 * =====================================================
 */
exports.me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'APP_ERROR', message: 'Invalid token payload' },
        meta: { path: req.originalUrl, timestamp: new Date().toISOString() },
      });
    }

    // FIXED: explicit whitelist + compatible payload
    const safeUser = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
      createdAt: req.user.createdAt,
      profile: req.user.profile || null,
    };

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
