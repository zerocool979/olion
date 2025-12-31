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
      '/api/auth - Authentication',
      '/api/users - User management',
      '/api/admin - Admin management',
      '/api/discussions - Discussions',
      '/api/pakar - Expert management',
      '/api/dashboard - Dashboard data',
      '/api/notifications - Notifications',
      '/api/reputation - Reputation system'
    ]
  });
});

/**
 * =====================================================
 * API ROUTES
 * =====================================================
 */
// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

// Protected routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin/answers', adminAnswerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/reports', reportRoutes);

// FIX: pastikan moderationRoutes adalah router
app.use('/api/moderation', moderationRoutes); // harus function/router

app.use('/api/pakar', pakarRoutes);
app.use('/api/pakars', pakarRoutes); // backward compatibility
app.use('/api/notifications', notificationRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/dashboard', dashboardRoutes);

/**
 * =====================================================
 * ERROR HANDLING
 * =====================================================
 */

// Middlewares
const errorHandler = require('./middlewares/errorHandler'); // harus ex>

// FIX: import notFound sesuai export default function
const notFound = require('./middlewares/notFound'); // harus function, >

// 404 handler
// app.use('*', notFoundHandler); // ❌ Express v5 error

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
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
