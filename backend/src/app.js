'use strict'
const express        = require('express')
const cors           = require('cors')
const routes         = require('./routes')
const errorMiddleware = require('./middlewares/error')
const { NODE_ENV }   = require('./config/env')

const app = express()

// ── CORS ──────────────────────────────────────────────────────────────────────
// Batasi origin di production; dev bisa dari mana saja
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000']

app.use(cors({
  origin: (origin, cb) => {
    // Izinkan request tanpa origin (curl, server-to-server, Postman)
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin) || NODE_ENV !== 'production') {
      return cb(null, true)
    }
    cb(new Error(`CORS: origin '${origin}' tidak diizinkan`))
  },
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// ── Security headers ringan tanpa helmet ──────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
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


