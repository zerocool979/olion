'use strict'
const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/error')
const { NODE_ENV } = require('./config/env')

const app = express()

// Vercel overwrites X-Forwarded-For with the client IP before invoking a
// Function. Trust the single Vercel proxy hop only; do not use trust proxy=true.
if (process.env.VERCEL === '1') {
  app.set('trust proxy', 1)
}

// Do not disclose the framework in response headers.
app.disable('x-powered-by')

// ── CORS ──────────────────────────────────────────────────────────────────────
// Keep the allowlist exact. CORS is a browser read policy, not authentication;
// unknown origins receive no CORS headers and are still subject to API auth.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : ['http://localhost:3000']

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin) || NODE_ENV !== 'production') {
      return cb(null, true)
    }
    return cb(null, false)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// ── Security headers ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(), payment=()')
  next()
})

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: false, limit: '2mb' }))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) =>
  res.json({ success: true, service: 'Olion Backend', status: 'running', env: NODE_ENV })
)

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan' }))

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorMiddleware)

module.exports = app
