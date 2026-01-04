// backend/src/server.js

require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// =====================================================
// SOCKET.IO SETUP
// =====================================================
const { Server } = require('socket.io');

// OLD: terlalu longgar
// const io = new Server(server, {
//   cors: { origin: '*' },
// });

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// =====================================================
// SOCKET AUTH MIDDLEWARE
// =====================================================
const jwt = require('jsonwebtoken');

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload; // { id, role, ... }

    next();
  } catch (err) {
    next(new Error('Invalid authentication token'));
  }
});

// =====================================================
// SOCKET CONNECTION HANDLING
// =====================================================
io.on('connection', (socket) => {
  const userId = socket.user.id;

  // OLD (INSECURE)
  // socket.on('join', (userId) => {
  //   socket.join(userId);
  // });

  // FIXED: auto join authenticated user room
  socket.join(userId);

  socket.on('disconnect', (reason) => {
    console.log(`🔌 Socket disconnected: ${userId} (${reason})`);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// =====================================================
// NOTIFICATION EVENT BRIDGE
// =====================================================
const { startNotificationWorker } = require('./services/notificationService');
startNotificationWorker();

const { onNotify } = require('./services/notificationService');

const notifyListener = ({ userId, title, message, channel }) => {
  io.to(userId).emit('notification', {
    title,
    message,
    channel,
    timestamp: new Date().toISOString(),
  });
};

onNotify(notifyListener);

// =====================================================
// SERVER START
// =====================================================
server.listen(PORT, () => {
  console.log(`🔥 OLION Backend running on port ${PORT}`);
});

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
const shutdown = () => {
  console.log('🛑 Shutting down server...');
  io.close(() => {
    console.log('Socket.IO closed');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
