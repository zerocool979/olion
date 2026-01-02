// src/routes/userRoutes.js

const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');
const userController = require('../controllers/userController');

const router = express.Router();

// =====================================================
// PUBLIC USER PROFILE ROUTES (optional - if needed)
// =====================================================

/**
 * Get user public profile
 * GET /api/v1/users/profile/:id
 */
router.get('/profile/:id', async (req, res, next) => {
  try {
    const user = await userService.getPublicProfile(req.params.id);
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

// =====================================================
// AUTHENTICATED USER ROUTES
// =====================================================

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    await userController.getMyProfile(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Update current user profile
 * PATCH /api/v1/users/me
 */
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    await userController.updateMyProfile(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user dashboard statistics
 * GET /api/v1/users/dashboard-stats
 */
router.get('/dashboard-stats', authenticate, async (req, res, next) => {
  try {
    await userController.getDashboardStats(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Apply for pakar via user route (alternative to /pakars/apply)
 * POST /api/v1/users/apply-pakar
 */
router.post('/apply-pakar', authenticate, async (req, res, next) => {
  try {
    await userController.applyForPakar(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user's pakar application status via user route
 * GET /api/v1/users/pakar-application
 */
router.get('/pakar-application', authenticate, async (req, res, next) => {
  try {
    await userController.getMyPakarApplication(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user's discussions
 * GET /api/v1/users/me/discussions
 */
router.get('/me/discussions', authenticate, async (req, res, next) => {
  try {
    await userController.getMyDiscussions(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user's answers
 * GET /api/v1/users/me/answers
 */
router.get('/me/answers', authenticate, async (req, res, next) => {
  try {
    await userController.getMyAnswers(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user's bookmarks
 * GET /api/v1/users/me/bookmarks
 */
router.get('/me/bookmarks', authenticate, async (req, res, next) => {
  try {
    await userController.getMyBookmarks(req, res, next);
  } catch (e) {
    next(e);
  }
});

// =====================================================
// ADMIN USER MANAGEMENT ROUTES
// =====================================================

/**
 * Get all users (admin only)
 * GET /api/v1/users
 */
router.get('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await userController.listUsers(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Get user by ID (admin only)
 * GET /api/v1/users/:id
 */
router.get('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await userController.getUserById(req, res, next);
  } catch (e) {
    next(e);
  }
});

/**
 * Update user (admin only - for role, status, etc.)
 * PATCH /api/v1/users/:id
 */
router.patch('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (e) {
    next(e);
  }
});

/**
 * Update user role (admin only)
 * PATCH /api/v1/users/:id/role
 */
router.patch(
  '/:id/role',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await userController.updateRole(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Toggle user active status (admin only)
 * PATCH /api/v1/users/:id/toggle-active
 */
router.patch(
  '/:id/toggle-active',
  authenticate,
  authorize('ADMIN'),
  async (req, res, next) => {
    try {
      const user = await userController.toggleActive(req, res, next);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Deactivate user (admin only)
 * PATCH /api/v1/users/:id/deactivate
 */
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

/**
 * Verify pakar (admin only)
 * PATCH /api/v1/users/pakar/:id/verify
 */
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

// =====================================================
// REPUTATION ROUTES (if not in separate reputationRoutes.js)
// =====================================================

/**
 * Get user reputation (moved to reputation routes)
 * Note: This endpoint should be in reputationRoutes.js
 * GET /api/v1/users/me/reputation
 */
// router.get('/me/reputation', authenticate, async (req, res, next) => {
//   try {
//     const reputationService = require('../services/reputationService');
//     const data = await reputationService.getByUser(req.user.id);
//     res.json(data);
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
