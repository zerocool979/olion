// backend/src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const AppError = require('../utils/AppError');

/**
 * =====================================================
 * TOKEN GENERATION
 * =====================================================
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * =====================================================
 * REGISTER
 * =====================================================
 */
exports.register = async ({ email, password, ipAddress, userAgent }) => {
  if (!email || !password) throw new AppError('Email and password are required', 400);
  if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);

  email = email.toLowerCase().trim();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      isActive: true,
      profile: {
        create: {
          pseudonym: `anon-${Math.random().toString(36).slice(2, 8)}`,
        },
      },
    },
  });

  // create token
  const token = generateToken({ id: user.id, role: user.role });

  // create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token,
      device: { userAgent }, // simpan userAgent di device JSON
    },
  });

  return { token };
};

/**
 * =====================================================
 * LOGIN
 * =====================================================
 */
exports.login = async ({ email, password, ipAddress, userAgent }) => {
  if (!email || !password) throw new AppError('Email and password are required', 400);

  email = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.isActive) throw new AppError('Account is disabled', 403);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  // create token
  const token = generateToken({ id: user.id, role: user.role });

  // create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token,
      device: { userAgent },
    },
  });

  return { token };
};
