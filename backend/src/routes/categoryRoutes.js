const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

const {
  authenticate,
  authorize,
} = require('../middlewares/authMiddleware');

/**
 * GET ALL CATEGORIES (PUBLIC)
 * Tidak perlu auth
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE CATEGORY (ADMIN ONLY)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const { name, description } = req.body;

      const category = await prisma.category.create({
        data: {
          name,
          description,
          adminId: req.user.id,
        },
      });

      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
