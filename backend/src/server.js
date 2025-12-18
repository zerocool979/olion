require("dotenv").config();
const app = require("./app");
const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Socket.IO
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});


// Pasang listener notifikasi
const { onNotify } = require('./services/notificationService');
onNotify(({ userId, title, message, channel }) => {
  io.to(userId).emit('notification', { title, message, channel });
});

server.listen(PORT, () => {
  console.log(`🔥 OLION Backend running on port ${PORT}`);
});
