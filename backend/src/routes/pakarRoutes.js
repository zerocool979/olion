// =====================================================
// FILE: src/routes/pakarRoutes.js
// ROLE:
//   - USER  : Mengajukan pakar, cek status, cek eligibility
//   - ADMIN : Verifikasi (approve / reject) pakar, lihat semua aplikasi, stats
// =====================================================

const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const pakarService = require('../services/pakarService');
const pakarController = require('../controllers/pakarController');

const router = express.Router();

/**
 * -----------------------------------------------------
 * GET semua pakar (public)
 * GET /api/v1/pakars
 * -----------------------------------------------------
 */
router.get('/', async (req, res, next) => {
  try {
    const data = await pakarController.getAllPakars(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * GET detail pakar (public)
 * GET /api/v1/pakars/:id
 * -----------------------------------------------------
 */
router.get('/:id', async (req, res, next) => {
  try {
    const data = await pakarController.getPakarById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * USER cek eligibility untuk apply pakar
 * GET /api/v1/pakars/check-eligibility
 * -----------------------------------------------------
 */
router.get('/check-eligibility', authenticate, async (req, res, next) => {
  try {
    await pakarController.checkEligibility(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * USER mengajukan permohonan pakar
 * POST /api/v1/pakars/apply
 * -----------------------------------------------------
 */
router.post('/apply', authenticate, async (req, res, next) => {
  try {
    await pakarController.applyForPakar(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * -----------------------------------------------------
 * USER cek status aplikasi pakar
 * GET /api/v1/pakars/my-application
 * -----------------------------------------------------
 */
router.get('/my-application', authenticate, async (req, res, next) => {
  try {
    await pakarController.getMyApplication(req, res, next);
  } catch (error) {
    next(error);
  }
});

// =====================================================
// ADMIN ROUTES
// =====================================================

/**
 * -----------------------------------------------------
 * ADMIN get semua aplikasi pakar
 * GET /api/v1/pakars/applications
 * -----------------------------------------------------
 */
router.get(
  '/applications',
  authenticate,
  authorize(['ADMIN', 'MODERATOR']),
  async (req, res, next) => {
    try {
      await pakarController.getAllApplications(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * -----------------------------------------------------
 * ADMIN get stats pakar
 * GET /api/v1/pakars/stats
 * -----------------------------------------------------
 */
router.get(
  '/stats',
  authenticate,
  authorize(['ADMIN', 'MODERATOR']),
  async (req, res, next) => {
    try {
      await pakarController.getPakarStats(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * -----------------------------------------------------
 * ADMIN review aplikasi pakar (approve/reject)
 * PATCH /api/v1/pakars/applications/:id/review
 * -----------------------------------------------------
 */
router.patch(
  '/applications/:id/review',
  authenticate,
  authorize(['ADMIN', 'MODERATOR']),
  async (req, res, next) => {
    try {
      await pakarController.reviewApplication(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * -----------------------------------------------------
 * ADMIN approve pakar (legacy endpoint - tetap dipertahankan)
 * PATCH /api/v1/pakars/:id/approve
 * -----------------------------------------------------
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      // Call existing service for backward compatibility
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
 * ADMIN revoke pakar (legacy endpoint - tetap dipertahankan)
 * PATCH /api/v1/pakars/:id/revoke
 * -----------------------------------------------------
 */
router.patch(
  '/:id/revoke',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      // Call existing service for backward compatibility
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
