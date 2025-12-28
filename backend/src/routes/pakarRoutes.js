// =====================================================
// FILE: src/routes/pakarRoutes.js
// ROLE:
//   - USER  : Mengajukan pakar
//   - ADMIN : Verifikasi (approve / reject) pakar
// =====================================================

const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const pakarService = require('../services/pakarService');

const router = express.Router();

/**
 * -----------------------------------------------------
 * GET semua pakar
 * GET /api/pakars
 * -----------------------------------------------------
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const data = await pakarService.findAllPakars();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * GET detail pakar
 * GET /api/pakars/:id
 * -----------------------------------------------------
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const data = await pakarService.findPakarById(req.params.id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * USER mengajukan permohonan pakar
 * POST /api/pakars/apply
 * -----------------------------------------------------
 */
router.post('/apply', authenticate, async (req, res, next) => {
  try {
    const data = await pakarService.applyPakar(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * ADMIN approve pakar
 * PATCH /api/pakars/:id/approve
 * -----------------------------------------------------
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const data = await pakarService.verifyPakar(
        req.params.id,
        'Approved'
      );
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * -----------------------------------------------------
 * ADMIN revoke pakar
 * PATCH /api/pakars/:id/revoke
 * -----------------------------------------------------
 */
router.patch(
  '/:id/revoke',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const data = await pakarService.verifyPakar(
        req.params.id,
        'Rejected'
      );
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
