const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const adminUserController = require('../controllers/adminUserController');

const router = express.Router();

router.patch(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  adminUserController.updateUser
);

router.get(
  '/stats',
  authenticate,
  authorize('ADMIN'),
  adminUserController.stats
);

module.exports = router;
