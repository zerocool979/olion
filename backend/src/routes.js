'use strict'
const router = require('express').Router()
const { rateLimit, ipKeyGenerator } = require('express-rate-limit')
const auth = require('./middlewares/auth')
const optionalAuth = require('./middlewares/optionalAuth')
const role = require('./middlewares/role')

// Vercel overwrites X-Forwarded-For before invoking the Function. app.js
// trusts exactly that single proxy hop. ipKeyGenerator keeps IPv6 clients
// grouped safely and avoids trusting the user-supplied Forwarded header.
const clientIpKeyGenerator = (req) => ipKeyGenerator(req.ip)

const makeLimiter = (options) => rateLimit({
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientIpKeyGenerator,
  ...options,
})

// ── Controllers ───────────────────────────────────────────────────────────────
const statsRoutes = require('./modules/stats/stats.routes')
const authCtrl = require('./modules/auth/controller')
const userCtrl = require('./modules/user/controller')
const categoryCtrl = require('./modules/category/controller')
const discussionCtrl = require('./modules/discussion/controller')
const commentCtrl = require('./modules/comment/controller')
const voteCtrl = require('./modules/vote/controller')
const reportCtrl = require('./modules/report/controller')
const adminCtrl = require('./modules/admin/controller')
const expertCtrl = require('./modules/expert/controller')
const badgeCtrl = require('./modules/badge/controller')
const trendingCtrl = require('./modules/trending/controller')
const leaderboardCtrl = require('./modules/leaderboard/controller')
const notifCtrl = require('./modules/notification/controller')
const chatCtrl = require('./modules/chat/controller')
const bookmarkCtrl = require('./modules/bookmark/controller')
const moderatorCtrl = require('./modules/moderator/controller')
const liaCtrl = require('./modules/lia/controller')

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
})

const emailActionLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Terlalu banyak permintaan email. Coba lagi dalam 15 menit.' },
})
const writeLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: 'Terlalu banyak permintaan. Coba lagi sebentar.' },
})
const searchLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: 'Terlalu banyak pencarian. Coba lagi sebentar.' },
})
const uploadLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 6,
  message: { message: 'Terlalu banyak upload. Coba lagi sebentar.' },
})
const ingestFileLimiter = makeLimiter({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { message: 'Terlalu banyak proses ingest file. Coba lagi nanti.' },
})
const trendingLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: { message: 'Terlalu banyak permintaan trending. Coba lagi sebentar.' },
})
// LIA is public/guest-accessible; each request can invoke embedding and an LLM.
const liaLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: 12,
  message: { message: 'Terlalu banyak pertanyaan ke LIA. Coba lagi sebentar.' },
})

// ── Public stats ──────────────────────────────────────────────────────────────
router.use('/stats', statsRoutes)

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/auth/register', authLimiter, authCtrl.register)
router.post('/auth/login', authLimiter, authCtrl.login)
router.post('/auth/google', authLimiter, authCtrl.google)
router.post('/auth/verify-email/request', emailActionLimiter, authCtrl.requestEmailVerification)
router.post('/auth/verify-email/confirm', emailActionLimiter, authCtrl.verifyEmail)
router.post('/auth/password/forgot', emailActionLimiter, authCtrl.requestPasswordReset)
router.post('/auth/password/reset', emailActionLimiter, authCtrl.resetPassword)
router.post('/auth/google/link', auth, authLimiter, authCtrl.linkGoogle)
router.get('/auth/me', auth, authCtrl.me)
router.patch('/auth/password', auth, authCtrl.changePassword)

// ── User ──────────────────────────────────────────────────────────────────────
router.get('/users', userCtrl.list)
router.get('/users/by-username/:username', optionalAuth, authCtrl.getByUsername)
router.get('/users/:id', optionalAuth, userCtrl.detail)
router.patch('/users/me/profile', auth, userCtrl.updateProfile)

// ── Follow ────────────────────────────────────────────────────────────────────
router.post('/users/:id/follow', auth, writeLimiter, userCtrl.follow)
router.delete('/users/:id/follow', auth, userCtrl.unfollow)
router.get('/users/:username/followers', optionalAuth, userCtrl.followers)
router.get('/users/:username/following', optionalAuth, userCtrl.followingList)

// ── Badges ────────────────────────────────────────────────────────────────────
router.get('/badges', badgeCtrl.listAll)
router.get('/users/:id/badges', badgeCtrl.listByUser)

// ── Expert application ────────────────────────────────────────────────────────
router.post('/expert/apply', auth, writeLimiter, expertCtrl.apply)
router.get('/expert/my-application', auth, expertCtrl.myApplication)

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', categoryCtrl.getAll)
router.get('/categories/:slug/subcategories', categoryCtrl.getSubcategories)

// ── Discussions ───────────────────────────────────────────────────────────────
router.get('/discussions', optionalAuth, discussionCtrl.list)
router.get('/discussions/:id', optionalAuth, discussionCtrl.detail)
router.post('/discussions', auth, writeLimiter, discussionCtrl.create)
router.patch('/discussions/:id', auth, discussionCtrl.update)
router.delete('/discussions/:id', auth, discussionCtrl.remove)
router.post('/discussions/:id/view', optionalAuth, writeLimiter, discussionCtrl.incrementView)

// ── Bookmarks ─────────────────────────────────────────────────────────────────
router.get('/bookmarks', auth, bookmarkCtrl.list)
router.post('/discussions/:id/bookmark', auth, writeLimiter, bookmarkCtrl.add)
router.delete('/discussions/:id/bookmark', auth, bookmarkCtrl.removeByDiscussion)
router.delete('/bookmarks/:id', auth, bookmarkCtrl.removeById)

// ── Search / Trending / Leaderboard ──────────────────────────────────────────
router.get('/search', searchLimiter, discussionCtrl.search)
router.get('/trending', trendingLimiter, trendingCtrl.list)
router.get('/leaderboard', leaderboardCtrl.list)

// ── Comments ──────────────────────────────────────────────────────────────────
router.get('/discussions/:id/comments', optionalAuth, commentCtrl.listByDiscussion)
router.post('/discussions/:id/comments', auth, writeLimiter, commentCtrl.create)
router.get('/comments', auth, commentCtrl.listByUser)
router.patch('/comments/:id', auth, commentCtrl.update)
router.delete('/comments/:id', auth, commentCtrl.remove)
router.post('/comments/:id/votes', auth, writeLimiter, commentCtrl.vote)

// ── Votes ─────────────────────────────────────────────────────────────────────
router.post('/votes', auth, writeLimiter, voteCtrl.vote)
router.delete('/votes', auth, voteCtrl.unvote)
router.get('/votes', auth, voteCtrl.listByUser)

// ── Notifications ────────────────────────────────────────────────────────────
router.get('/notifications', auth, notifCtrl.list)
router.get('/notifications/unread-count', auth, notifCtrl.unreadCount)
router.patch('/notifications/read-all', auth, notifCtrl.markAllRead)
router.patch('/notifications/:id/read', auth, notifCtrl.markRead)
router.delete('/notifications/:id', auth, notifCtrl.remove)

// ── Chat ──────────────────────────────────────────────────────────────────────
router.get('/chat/conversations', auth, chatCtrl.listConversations)
router.get('/chat/ice-servers', auth, chatCtrl.getIceServers)
router.post('/chat/conversations', auth, writeLimiter, chatCtrl.startConversation)
router.get('/chat/conversations/:id/messages', auth, chatCtrl.listMessages)
router.post('/chat/conversations/:id/messages', auth, writeLimiter, chatCtrl.sendMessage)
router.post('/chat/upload', auth, uploadLimiter, chatCtrl.uploadMiddleware, chatCtrl.uploadAttachment)

// ── Reports ───────────────────────────────────────────────────────────────────
router.post('/reports', auth, writeLimiter, reportCtrl.report)
router.get('/reports', auth, role(['MODERATOR', 'ADMIN']), reportCtrl.list)
router.put('/reports/:id', auth, role(['MODERATOR', 'ADMIN']), reportCtrl.review)

// ── Moderator ─────────────────────────────────────────────────────────────────
const modRole = role(['MODERATOR', 'ADMIN'])
router.patch('/moderator/discussions/:id/hide', auth, modRole, moderatorCtrl.hideDiscussion)
router.patch('/moderator/discussions/:id/unhide', auth, modRole, moderatorCtrl.unhideDiscussion)
router.patch('/moderator/comments/:id/hide', auth, modRole, moderatorCtrl.hideComment)
router.patch('/moderator/comments/:id/unhide', auth, modRole, moderatorCtrl.unhideComment)
router.get('/moderator/comments/hidden', auth, modRole, moderatorCtrl.hiddenComments)

// ── LIA ───────────────────────────────────────────────────────────────────────
// Ingest/knowledge-base management is admin-only.
router.post('/ingest/text', auth, role('ADMIN'), writeLimiter, liaCtrl.ingestText)
router.post('/ingest/file', auth, role('ADMIN'), ingestFileLimiter, liaCtrl.uploadMiddleware, liaCtrl.ingestFile)
router.get('/ingest/documents', auth, role('ADMIN'), liaCtrl.listDocuments)
router.delete('/ingest/documents/:id', auth, role('ADMIN'), liaCtrl.deleteDocument)
router.post('/lia', optionalAuth, liaLimiter, liaCtrl.ask)
router.get('/lia/history', optionalAuth, liaCtrl.history)

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get('/admin/stats', auth, role('ADMIN'), adminCtrl.stats)
router.get('/admin/users', auth, role('ADMIN'), adminCtrl.users)
router.put('/admin/users/:id/role', auth, role('ADMIN'), adminCtrl.setRole)
router.post('/admin/users/:id/ban', auth, role('ADMIN'), adminCtrl.banUser)
router.delete('/admin/users/:id/ban', auth, role('ADMIN'), adminCtrl.unbanUser)
router.put('/admin/verify/:id', auth, role('ADMIN'), adminCtrl.verifyExpert)
router.delete('/admin/verify/:id', auth, role('ADMIN'), adminCtrl.revokeExpert)
router.get('/admin/expert-applications', auth, role('ADMIN'), expertCtrl.listApplications)
router.put('/admin/expert-applications/:id', auth, role('ADMIN'), expertCtrl.reviewApplication)

module.exports = router
