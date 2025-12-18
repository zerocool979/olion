const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/admin',
  authenticate,
  authorize('ADMIN'),
  (req, res) => res.json({ message: 'Admin access granted' })
);

module.exports = router;
