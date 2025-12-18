const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');
const { Queue, Worker } = require('bullmq');
const EventEmitter = require('events');

const notificationEmitter = new EventEmitter();

// =======================
// CONFIGURATION
// =======================

// Queue Redis
const notificationQueue = new Queue('notifications', {
  connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 },
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// =======================
// SEND NOTIFICATION
// =======================
exports.sendNotification = async ({ userId, title, message, channel }) => {
  // Simpan notifikasi di DB
  const notification = await prisma.notification.create({
    data: { userId, title, message, channel },
  });

  // Tambahkan job ke queue
  await notificationQueue.add('send', {
    notificationId: notification.id,
    userId,
    title,
    message,
    channel,
  });

  return notification;
};

// Ambil list notifikasi user
exports.listNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};


// =======================
// WORKER: PROCESS NOTIFICATIONS
// =======================
new Worker(
  'notifications',
  async (job) => {
    const { notificationId, userId, title, message, channel } = job.data;

    if (channel === 'Email') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new AppError('User not found', 404);

      // Retry logic simple
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: title,
            text: message,
          });
          break; // sukses
        } catch (err) {
          attempts++;
          if (attempts >= maxAttempts) throw err;
        }
      }
    } else if (channel === 'InApp' || channel === 'Popup') {
      // Emit event untuk WebSocket atau listener front-end
      notificationEmitter.emit('notify', { userId, title, message, channel });
    } else {
      throw new AppError('Invalid notification channel', 400);
    }

    // Tandai isSent true
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isSent: true },
    });
  },
  { connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 } }
);

// =======================
// FRONT-END EVENT LISTENER
// =======================
exports.onNotify = (callback) => {
  notificationEmitter.on('notify', callback);
};
