const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const reputationController = require('../controllers/reputationController');

router.get('/', authenticate, reputationController.getMyReputation);

module.exports = router;
