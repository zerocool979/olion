'use strict'
const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')

const statsRoutes = require('./modules/stats/stats.routes')
router.use('/stats', statsRoutes)

// ── Controllers ───────────────────────────────────────────────────────────────
const authCtrl        = require('./modules/auth/controller')
const categoryCtrl    = require('./modules/category/controller')
const discussionCtrl  = require('./modules/discussion/controller')
const commentCtrl     = require('./modules/comment/controller')
const voteCtrl        = require('./modules/vote/controller')
const reportCtrl      = require('./modules/report/controller')
const adminCtrl       = require('./modules/admin/controller')
const trendingCtrl    = require('./modules/trending/controller')
const leaderboardCtrl = require('./modules/leaderboard/controller')

// ── Rate limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/register', authLimiter, authCtrl.register)
router.post('/auth/login',    authLimiter, authCtrl.login)
router.get('/auth/me',        auth,        authCtrl.me)

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories',                       categoryCtrl.getAll)
router.get('/categories/:slug/subcategories',   categoryCtrl.getSubcategories)

// ── Discussions ───────────────────────────────────────────────────────────────
router.get('/discussions',      discussionCtrl.list)
router.get('/discussions/:id',  discussionCtrl.detail)
router.post('/discussions',     auth, discussionCtrl.create)

// ── Search ────────────────────────────────────────────────────────────────────
// GET /search?q=&category=&subcategory=&sort=latest|votes|comments
router.get('/search', discussionCtrl.search)

// ── Trending ──────────────────────────────────────────────────────────────────
// GET /trending?period=24h|7d|30d&limit=20
router.get('/trending', trendingCtrl.list)

// ── Leaderboard ───────────────────────────────────────────────────────────────
// GET /leaderboard?period=week|month|all&limit=50
router.get('/leaderboard', leaderboardCtrl.list)

// ── Comments ──────────────────────────────────────────────────────────────────
router.post('//discussions/:id/comments', auth, commentCtrl.create)

// ── Votes ─────────────────────────────────────────────────────────────────────
router.post('/votes', auth, voteCtrl.vote)

// ── Reports ───────────────────────────────────────────────────────────────────
router.post('/reports',      auth,                    reportCtrl.report)
router.put('/reports/:id',   auth, role('MODERATOR'), reportCtrl.review)

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/admin/users',       auth, role('ADMIN'), adminCtrl.users)
router.put('/admin/verify/:id',  auth, role('ADMIN'), adminCtrl.verifyExpert)

module.exports = router
