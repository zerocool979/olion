'use strict'
const router    = require('express').Router()
const rateLimit = require('express-rate-limit')
const auth      = require('./middlewares/auth')
const optionalAuth = require('./middlewares/optionalAuth')
const role      = require('./middlewares/role')

// ── Controllers ───────────────────────────────────────────────────────────────
const statsRoutes     = require('./modules/stats/stats.routes')
const authCtrl        = require('./modules/auth/controller')
const userCtrl        = require('./modules/user/controller')
const categoryCtrl    = require('./modules/category/controller')
const discussionCtrl  = require('./modules/discussion/controller')
const commentCtrl     = require('./modules/comment/controller')
const voteCtrl        = require('./modules/vote/controller')
const reportCtrl      = require('./modules/report/controller')
const adminCtrl       = require('./modules/admin/controller')
const expertCtrl      = require('./modules/expert/controller')
const badgeCtrl       = require('./modules/badge/controller')
const trendingCtrl    = require('./modules/trending/controller')
const leaderboardCtrl = require('./modules/leaderboard/controller')
const notifCtrl       = require('./modules/notification/controller')
const chatCtrl        = require('./modules/chat/controller')
const bookmarkCtrl    = require('./modules/bookmark/controller')
const moderatorCtrl   = require('./modules/moderator/controller')

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
})
const writeLimiter = rateLimit({
  windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan. Coba lagi sebentar.' },
})

// ── Public stats ──────────────────────────────────────────────────────────────
router.use('/stats', statsRoutes)

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post  ('/auth/register',  authLimiter, authCtrl.register)
router.post  ('/auth/login',     authLimiter, authCtrl.login)
router.get   ('/auth/me',        auth,        authCtrl.me)
router.patch ('/auth/password',  auth,        authCtrl.changePassword)

// ── User ──────────────────────────────────────────────────────────────────────
router.get   ('/users',                       userCtrl.list)
router.get   ('/users/by-username/:username', optionalAuth, authCtrl.getByUsername)
router.get   ('/users/:id',                   optionalAuth, userCtrl.detail)
router.patch ('/users/me/profile', auth,      userCtrl.updateProfile)

// ── Follow ────────────────────────────────────────────────────────────────────
router.post  ('/users/:id/follow',         auth, writeLimiter, userCtrl.follow)
router.delete('/users/:id/follow',         auth,               userCtrl.unfollow)
router.get   ('/users/:username/followers',      optionalAuth, userCtrl.followers)
router.get   ('/users/:username/following',      optionalAuth, userCtrl.followingList)

// ── Badges ────────────────────────────────────────────────────────────────────
router.get('/badges',              badgeCtrl.listAll)
router.get('/users/:id/badges',    badgeCtrl.listByUser)

// ── Expert application ────────────────────────────────────────────────────────
router.post('/expert/apply',         auth, writeLimiter, expertCtrl.apply)
router.get ('/expert/my-application',auth,               expertCtrl.myApplication)

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories',                     categoryCtrl.getAll)
router.get('/categories/:slug/subcategories', categoryCtrl.getSubcategories)

// ── Discussions ───────────────────────────────────────────────────────────────
router.get   ('/discussions',     optionalAuth, discussionCtrl.list)
router.get   ('/discussions/:id', optionalAuth,        discussionCtrl.detail)
router.post  ('/discussions',     auth, writeLimiter, discussionCtrl.create)
router.patch ('/discussions/:id', auth,               discussionCtrl.update)
router.delete('/discussions/:id', auth,               discussionCtrl.remove)
router.post  ('/discussions/:id/view',                discussionCtrl.incrementView)

// ── Bookmarks ─────────────────────────────────────────────────────────────────
router.get   ('/bookmarks',                  auth,               bookmarkCtrl.list)
router.post  ('/discussions/:id/bookmark',   auth, writeLimiter, bookmarkCtrl.add)
router.delete('/discussions/:id/bookmark',   auth,               bookmarkCtrl.removeByDiscussion)
router.delete('/bookmarks/:id',              auth,               bookmarkCtrl.removeById)

// ── Search / Trending / Leaderboard ──────────────────────────────────────────
router.get('/search',      discussionCtrl.search)
router.get('/trending',    trendingCtrl.list)
router.get('/leaderboard', leaderboardCtrl.list)

// ── Comments ──────────────────────────────────────────────────────────────────
router.get   ('/discussions/:id/comments', commentCtrl.listByDiscussion)
router.post  ('/discussions/:id/comments', auth, writeLimiter, commentCtrl.create)
router.get   ('/comments',                 commentCtrl.listByUser)
router.patch ('/comments/:id',             auth,               commentCtrl.update)
router.delete('/comments/:id',             auth,               commentCtrl.remove)
router.post  ('/comments/:id/votes',       auth, writeLimiter, commentCtrl.vote)

// ── Votes ─────────────────────────────────────────────────────────────────────
router.post  ('/votes', auth, writeLimiter, voteCtrl.vote)
router.delete('/votes', auth,               voteCtrl.unvote)
router.get   ('/votes',                     voteCtrl.listByUser)

// ── Notifications ─────────────────────────────────────────────────────────────
router.get   ('/notifications',              auth, notifCtrl.list)
router.get   ('/notifications/unread-count', auth, notifCtrl.unreadCount)
router.patch ('/notifications/read-all',     auth, notifCtrl.markAllRead)
router.patch ('/notifications/:id/read',     auth, notifCtrl.markRead)
router.delete('/notifications/:id',          auth, notifCtrl.remove)

// ── Chat ──────────────────────────────────────────────────────────────────────
router.get ('/chat/conversations',              auth, chatCtrl.listConversations)
router.post('/chat/conversations',              auth, writeLimiter, chatCtrl.startConversation)
router.get ('/chat/conversations/:id/messages', auth, chatCtrl.listMessages)
router.post('/chat/conversations/:id/messages', auth, writeLimiter, chatCtrl.sendMessage)

// ── Reports ───────────────────────────────────────────────────────────────────
router.post('/reports',     auth, writeLimiter,                   reportCtrl.report)
router.get ('/reports',     auth, role(['MODERATOR', 'ADMIN']),   reportCtrl.list)
router.put ('/reports/:id', auth, role(['MODERATOR', 'ADMIN']),   reportCtrl.review)

// ── Moderator: aksi langsung sembunyikan/tampilkan konten ──────────────────────
const modRole = role(['MODERATOR', 'ADMIN'])
router.patch('/moderator/discussions/:id/hide',   auth, modRole, moderatorCtrl.hideDiscussion)
router.patch('/moderator/discussions/:id/unhide', auth, modRole, moderatorCtrl.unhideDiscussion)
router.patch('/moderator/comments/:id/hide',      auth, modRole, moderatorCtrl.hideComment)
router.patch('/moderator/comments/:id/unhide',    auth, modRole, moderatorCtrl.unhideComment)
router.get  ('/moderator/comments/hidden',        auth, modRole, moderatorCtrl.hiddenComments)

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get   ('/admin/stats',                    auth, role('ADMIN'), adminCtrl.stats)
router.get   ('/admin/users',                    auth, role('ADMIN'), adminCtrl.users)
router.put   ('/admin/users/:id/role',           auth, role('ADMIN'), adminCtrl.setRole)
router.post  ('/admin/users/:id/ban',            auth, role('ADMIN'), adminCtrl.banUser)
router.delete('/admin/users/:id/ban',            auth, role('ADMIN'), adminCtrl.unbanUser)
router.put   ('/admin/verify/:id',               auth, role('ADMIN'), adminCtrl.verifyExpert)
router.delete('/admin/verify/:id',               auth, role('ADMIN'), adminCtrl.revokeExpert)
router.get   ('/admin/expert-applications',      auth, role('ADMIN'), expertCtrl.listApplications)
router.put   ('/admin/expert-applications/:id',  auth, role('ADMIN'), expertCtrl.reviewApplication)

module.exports = router


