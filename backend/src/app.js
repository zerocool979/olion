// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const pkg = require('../package.json');

// Route imports
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const voteRoutes = require('./routes/voteRoutes');
const reportRoutes = require('./routes/reportRoutes');
const answerRoutes = require('./routes/answerRoutes');
const commentRoutes = require('./routes/commentRoutes');
const pakarRoutes = require('./routes/pakarRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reputationRoutes = require('./routes/reputationRoutes');
const adminAnswerRoutes = require('./routes/adminAnswerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const userRoutes = require('./routes/userRoutes');
const moderationRoutes = require('./routes/moderationRoutes');

// const bookmarkRoutes = require('./routes/bookmarkRoutes');

// Import middlewares
const errorHandler = require('./middlewares/errorHandler');

const app = express();

/**
 * =====================================================
 * SECURITY & PERFORMANCE MIDDLEWARE
 * =====================================================
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        // OLD: terlalu ketat untuk environment modern
        // scriptSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // FIXED
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// OLD: limiter terlalu general
// app.use('/api/', limiter);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/v1/', apiLimiter); // FIXED: scoped ke v1

app.use(compression());

app.use(
  morgan(process.env.NODE_ENV === 'test' ? 'dev' : 'combined')
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'OLION Backend API',
    version: pkg.version, // FIXED
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * =====================================================
 * API ROUTES
 * =====================================================
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/test', testRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);
app.use('/api/v1/admin/answers', adminAnswerRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/discussions', discussionRoutes);
app.use('/api/v1/answers', answerRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/moderation', moderationRoutes);
app.use('/api/v1/pakars', pakarRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reputation', reputationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// app.get('/bookmarks', authenticate, bookmarkController.getBookmarks);

/**
 * =====================================================
 * LEGACY ROUTES (DEPRECATED)
 * =====================================================
 */
// TODO: remove in v2
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pakars', pakarRoutes);
app.use('/api/reputation', reputationRoutes);

/**
 * =====================================================
 * 404 HANDLER
 * =====================================================
 */
// OLD (BUG)
// app.use((req, res) => (req, res) => { ... });

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

/**
 * =====================================================
 * GLOBAL ERROR HANDLER
 * =====================================================
 */
app.use(errorHandler);

module.exports = app;
