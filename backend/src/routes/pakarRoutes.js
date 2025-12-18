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
 * USER mengajukan permohonan pakar
 * POST /api/pakar/apply
 * Body: { expertise, document }
 * -----------------------------------------------------
 */
router.post(
  '/apply',
  authenticate,
  async (req, res, next) => {
    try {
      const data = await pakarService.applyPakar(
        req.user.id,
        req.body
      );

      res.status(201).json({
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
 * ADMIN memverifikasi pakar
 * PATCH /api/pakar/:id/verify
 * Body: { status: 'Approved' | 'Rejected' }
 * -----------------------------------------------------
 */
router.patch(
  '/:id/verify',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const { status } = req.body;

      const data = await pakarService.verifyPakar(
        req.params.id,
        status
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
