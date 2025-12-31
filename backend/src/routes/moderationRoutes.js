// backend/src/routes/moderationRoutes.js
const express = require('express');
const router = express.Router();

// contoh route
router.get('/', (req, res) => {
  res.json({ message: 'Moderation route works!' });
});

module.exports = router;
