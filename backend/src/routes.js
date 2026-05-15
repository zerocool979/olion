const router = require('express').Router()
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')

// ─── ADDED: rate limiting untuk auth routes
// npm install express-rate-limit
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,                   // max 10 request per window per IP
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false
})

const authCtrl = require('./modules/auth/controller')
const categoryCtrl = require('./modules/category/controller')
const discussionCtrl = require('./modules/discussion/controller')
const commentCtrl = require('./modules/comment/controller')
const voteCtrl = require('./modules/vote/controller')
const reportCtrl = require('./modules/report/controller')
const adminCtrl = require('./modules/admin/controller')

// ─── Auth routes dengan rate limiting
router.post('/auth/register', authLimiter, authCtrl.register)
router.post('/auth/login', authLimiter, authCtrl.login)
// ─── ADDED: endpoint untuk validasi token dari server
router.get('/auth/me', auth, authCtrl.me)

// ─── Categories
router.get('/categories', categoryCtrl.list)

// ─── Discussions
router.get('/discussions', discussionCtrl.list)
router.get('/discussions/:id', discussionCtrl.detail)
router.post('/discussions', auth, discussionCtrl.create)

// ─── Comments
router.post('/comments', auth, commentCtrl.create)

// ─── Votes
router.post('/votes', auth, voteCtrl.vote)

// ─── Reports
router.post('/reports', auth, reportCtrl.report)
router.put('/reports/:id', auth, role('MODERATOR'), reportCtrl.review)

// ─── Admin
router.get('/admin/users', auth, role('ADMIN'), adminCtrl.users)
router.put('/admin/verify/:id', auth, role('ADMIN'), adminCtrl.verifyExpert)

module.exports = router
