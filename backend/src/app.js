// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');

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
const moderationRoutes = require('./routes/moderationRoutes'); // pastikan file ada

// Import middlewares
const errorHandler = require('./middlewares/errorHandler');

const app = express();

/**
 * =====================================================
 * SECURITY & PERFORMANCE MIDDLEWARE
 * =====================================================
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/**
 * =====================================================
 * HEALTH CHECK & STATUS ENDPOINTS
 * =====================================================
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'OLION Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'OLION API is running',
    version: '1.0.0',
    endpoints: [
      '/api/v1/auth - Authentication',
      '/api/v1/users - User management',
      '/api/v1/admin - Admin management',
      '/api/v1/discussions - Discussions',
      '/api/v1/pakars - Expert management',
      '/api/v1/dashboard - Dashboard data',
      '/api/v1/notifications - Notifications',
      '/api/v1/reputation - Reputation system',
      '/api/v1/categories - Categories',
      '/api/v1/answers - Answers',
      '/api/v1/comments - Comments'
    ]
  });
});

/**
 * =====================================================
 * API ROUTES - VERSION 1
 * =====================================================
 */

// Public routes - versioned
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/test', testRoutes);

// Protected routes - versioned
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

// New routes for dashboard features - versioned
app.use('/api/v1/pakars', pakarRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reputation', reputationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Legacy API routes without version (for backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pakars', pakarRoutes);
app.use('/api/reputation', reputationRoutes);

/**
 * =====================================================
 * ERROR HANDLING
 * =====================================================
 */

// 404 handler - function
app.use((req, res) => (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler - use middleware properly
app.use(errorHandler);

/**
 * =====================================================
 * GRACEFUL SHUTDOWN HANDLERS
 * =====================================================
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
