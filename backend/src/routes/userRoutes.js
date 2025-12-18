const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');

const router = express.Router();

// UPDATE USER ROLE & STATUS
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (e) {
      next(e);
    }
  }
);

// APPLY PAKAR (USER)
router.post(
  '/pakar/apply',
  authenticate,
  async (req, res, next) => {
    try {
      const pakar = await userService.applyPakar(req.user.id, req.body);
      res.status(201).json(pakar);
    } catch (e) {
      next(e);
    }
  }
);

// VERIFY PAKAR (ADMIN)
router.patch(
  '/pakar/:id/verify',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const result = await userService.verifyPakar(
        req.params.id,
        req.body.status
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

// APPLY PAKAR (USER)
router.post(
  '/pakar/apply',
  authenticate,
  async (req, res, next) => {
    try {
      const pakar = await userService.applyPakar(req.user.id, req.body);
      res.status(201).json(pakar);
    } catch (e) {
      next(e);
    }
  }
);

// VERIFY PAKAR (ADMIN)
router.patch(
  '/pakar/:id/verify',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const result = await userService.verifyPakar(
        req.params.id,
        req.body.status
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/:id/deactivate',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, {
        isActive: false,
      });
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
