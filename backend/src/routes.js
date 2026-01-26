const router = require('express').Router()
const auth = require('./middlewares/auth')
const role = require('./middlewares/role')

const authCtrl = require('./modules/auth/controller')
const discussionCtrl = require('./modules/discussion/controller')
const commentCtrl = require('./modules/comment/controller')
const voteCtrl = require('./modules/vote/controller')
const reportCtrl = require('./modules/report/controller')
const adminCtrl = require('./modules/admin/controller')

router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)

router.get('/discussions', discussionCtrl.list)
router.post('/discussions', auth, discussionCtrl.create)

router.post('/comments', auth, commentCtrl.create)

router.post('/votes', auth, voteCtrl.vote)

router.post('/reports', auth, reportCtrl.report)
router.put('/reports/:id', auth, role('MODERATOR'), reportCtrl.review)

router.get('/admin/users', auth, role('ADMIN'), adminCtrl.users)
router.put('/admin/verify/:id', auth, role('ADMIN'), adminCtrl.verifyExpert)

module.exports = router

