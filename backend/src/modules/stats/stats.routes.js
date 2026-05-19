const express = require('express')
const { getStats } = require('./stats.controller')

const router = express.Router()

router.get('/', getStats)

module.exports = router
