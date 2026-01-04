const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ======================
// AUTHENTICATE
// ======================
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      req.user = null;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verify failed:', err.message);
      req.user = null;
      return next();
    }

    if (!decoded?.id) {
      req.user = null;
      return next();
    }

    if (!prisma.user || !prisma.user.findUnique) {
      console.error('Prisma client user model undefined');
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    req.user = user || null;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    req.user = null;
    next();
  }
};

// ======================
// AUTHORIZE
// ======================
const authorize = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!req.user.role) {
    return res.status(403).json({ success: false, message: 'Forbidden: role not set' });
  }

  if (req.user.role.toUpperCase() !== requiredRole.toUpperCase()) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
  }

  next();
};

module.exports = { authenticate, authorize };
