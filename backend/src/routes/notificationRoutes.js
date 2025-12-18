const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authenticate, notificationController.getMyNotifications);

module.exports = router;
