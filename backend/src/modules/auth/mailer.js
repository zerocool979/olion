'use strict'

const nodemailer = require('nodemailer')
const {
  FRONTEND_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = require('../../config/env')

const isConfigured = () => Boolean(SMTP_HOST && Number.isInteger(SMTP_PORT) && SMTP_PORT > 0 && SMTP_FROM)
let transporter

function getTransporter() {
  if (!isConfigured()) {
    const err = new Error('Pengiriman email belum dikonfigurasi.')
    err.statusCode = 503
    err.code = 'MAIL_NOT_CONFIGURED'
    throw err
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      ...(SMTP_USER && SMTP_PASS ? { auth: { user: SMTP_USER, pass: SMTP_PASS } } : {}),
      tls: { minVersion: 'TLSv1.2' },
    })
  }
  return transporter
}

function buildAuthLink(purpose, token) {
  const pathname = purpose === 'EMAIL_VERIFICATION'
    ? '/guest/verify-email'
    : '/guest/reset-password'
  const url = new URL(pathname, FRONTEND_URL)
  url.searchParams.set('token', token)
  return url.toString()
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char])
}

async function sendAuthLink({ to, token, purpose }) {
  const link = buildAuthLink(purpose, token)
  const verification = purpose === 'EMAIL_VERIFICATION'
  const subject = verification ? 'Verifikasi email OLION' : 'Reset password OLION'
  const action = verification ? 'Verifikasi Email' : 'Atur Password Baru'
  const description = verification
    ? 'Konfirmasi alamat email untuk akun OLION Anda.'
    : 'Kami menerima permintaan untuk mengatur ulang password akun OLION Anda.'

  const text = [
    'OLION',
    '',
    description,
    '',
    action + ': ' + link,
    '',
    verification ? 'Link berlaku selama 24 jam dan hanya dapat digunakan sekali.' : 'Link berlaku selama 1 jam dan hanya dapat digunakan sekali.',
    'Jika Anda tidak meminta ini, abaikan email ini.',
  ].join('\n')

  const html = '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#202124;line-height:1.6">' +
    '<div style="max-width:560px;margin:32px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">' +
    '<h1 style="font-size:22px">OLION</h1><p>' + escapeHtml(description) + '</p>' +
    '<p><a href="' + escapeHtml(link) + '" style="display:inline-block;padding:12px 18px;background:#365cf5;color:#fff;text-decoration:none;border-radius:8px">' + action + '</a></p>' +
    '<p style="font-size:13px;color:#5f6368">' + (verification ? 'Link berlaku selama 24 jam.' : 'Link berlaku selama 1 jam.') + ' Link hanya dapat digunakan sekali.</p>' +
    '<p style="font-size:13px;color:#5f6368">Jika Anda tidak meminta ini, abaikan email ini.</p></div></body></html>'

  return getTransporter().sendMail({ from: SMTP_FROM, to, subject, text, html })
}

module.exports = { isConfigured, sendAuthLink, buildAuthLink }
