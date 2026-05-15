const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')

const authCtrl = require('./modules/auth/controller')
const categoryCtrl = require('./modules/category/controller')
const discussionCtrl = require('./modules/discussion/controller')
const commentCtrl = require('./modules/comment/controller')
const voteCtrl = require('./modules/vote/controller')
const reportCtrl = require('./modules/report/controller')
const adminCtrl = require('./modules/admin/controller')

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
router.post('/auth/login', authLimiter, authCtrl.login)
router.get('/auth/me', auth, authCtrl.me)

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', categoryCtrl.getAll)
// Returns children of a root category — used by search page filter
router.get('/categories/:slug/subcategories', categoryCtrl.getSubcategories)

// ── Discussions ───────────────────────────────────────────────────────────────
router.get('/discussions', discussionCtrl.list)
router.get('/discussions/:id', discussionCtrl.detail)
router.post('/discussions', auth, discussionCtrl.create)

// ── Search — dedicated endpoint, no controller alias confusion ─────────────────
router.get('/search', discussionCtrl.search)

// ── Comments ──────────────────────────────────────────────────────────────────
router.post('/comments', auth, commentCtrl.create)

// ── Votes ─────────────────────────────────────────────────────────────────────
router.post('/votes', auth, voteCtrl.vote)

// ── Reports ───────────────────────────────────────────────────────────────────
router.post('/reports', auth, reportCtrl.report)
router.put('/reports/:id', auth, role('MODERATOR'), reportCtrl.review)

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/admin/users', auth, role('ADMIN'), adminCtrl.users)
router.put('/admin/verify/:id', auth, role('ADMIN'), adminCtrl.verifyExpert)

module.exports = router
