// backend/src/services/notificationService.js
// ===========================================
// FIXED & HARDENED VERSION
// ===========================================

const prisma = require('../prisma'); // FIXED PATH
const AppError = require('../utils/AppError');
const nodemailer = require('nodemailer');
const { Queue, Worker } = require('bullmq');
const EventEmitter = require('events');

const notificationEmitter = new EventEmitter();

// =======================
// CONFIGURATION
// =======================

// Queue Redis
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
};

const notificationQueue = new Queue('notifications', { connection });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// =======================
// SEND NOTIFICATION
// =======================
exports.sendNotification = async ({ userId, title, message, channel }) => {
  // VALIDATE CHANNEL
  const validChannels = ['Email', 'InApp', 'Popup'];
  if (!validChannels.includes(channel)) {
    throw new AppError('Invalid notification channel', 400);
  }

  // CHECK USER PREFERENCE
  const pref = await prisma.userChannelPreference.findUnique({
    where: {
      userId_channel: {
        userId,
        channel,
      },
    },
  });

  if (pref && pref.active === false) {
    return null; // silently ignore
  }

  // Simpan notifikasi di DB
  const notification = await prisma.notification.create({
    data: { userId, title, message, channel },
  });

  // Tambahkan job ke queue (idempotent by notificationId)
  await notificationQueue.add(
    'send',
    {
      notificationId: notification.id,
      userId,
      title,
      message,
      channel,
    },
    {
      jobId: notification.id, // PREVENT DUPLICATE
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    }
  );

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
// WORKER (LAZY INIT)
// =======================
let workerStarted = false;

exports.startNotificationWorker = () => {
  if (workerStarted) return;
  workerStarted = true;

  // OLD
  // new Worker('notifications', async (job) => { ... });

  new Worker(
    'notifications',
    async (job) => {
      const { notificationId, userId, title, message, channel } = job.data;

      // IDPOTENCY CHECK
      const existing = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!existing || existing.isSent) return;

      if (channel === 'Email') {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true },
        });

        if (!user) throw new AppError('User not found', 404);

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: title,
          text: message,
        });
      } else {
        notificationEmitter.emit(`notify:`, {
          userId,
          title,
          message,
          channel,
        });
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { isSent: true },
      });
    },
    { connection }
  );
};

// =======================
// FRONT-END EVENT LISTENER
// =======================
// exports.onNotify = (userId, callback) => {
//   notificationEmitter.on(`notify:${userId}`, callback);
// };

exports.onNotify = (callback) => {
  notificationEmitter.on('notify', callback);
};
