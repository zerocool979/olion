// backend/src/services/mailService.js

const nodemailer = require('nodemailer');
const AppError = require('../utils/AppError');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Kirim email notifikasi
 */
exports.sendMail = async ({ to, subject, text }) => {
  if (!to) {
    throw new AppError('Email recipient is required', 400);
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
  });
};
