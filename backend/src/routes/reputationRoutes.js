// src/routes/reputationRoutes.js

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const reputationController = require('../controllers/reputationController');

// =====================================================
// AUTHENTICATED USER ROUTES
// =====================================================

/**
 * Get user's detailed reputation data
 * GET /api/v1/reputation
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    await reputationController.getUserReputation(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * Get user reputation (legacy endpoint - backward compatibility)
 * GET /api/v1/reputation/my
 */
router.get('/my', authenticate, async (req, res, next) => {
  try {
    await reputationController.getMyReputation(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * Get reputation leaderboard
 * GET /api/v1/reputation/leaderboard
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    await reputationController.getLeaderboard(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * Get reputation by category/field
 * GET /api/v1/reputation/by-category
 */
router.get('/by-category', authenticate, async (req, res, next) => {
  try {
    await reputationController.getReputationByCategory(req, res, next);
  } catch (err) {
    next(err);
  }
});

/**
 * Get reputation history with filters
 * GET /api/v1/reputation/history
 */
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50, type } = req.query;
    
    // Call service function or implement here
    const reputationService = require('../services/reputationService');
    const data = await reputationService.getReputationHistory({
      userId: req.user.id,
      startDate,
      endDate,
      limit: parseInt(limit),
      type
    });
    
    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

// =====================================================
// ADMIN REPUTATION MANAGEMENT ROUTES
// =====================================================

/**
 * Adjust user reputation (admin only)
 * POST /api/v1/reputation/adjust
 */
router.post('/adjust', authenticate, authorize(['ADMIN', 'MODERATOR']), async (req, res, next) => {
  try {
    const { userId, points, reason } = req.body;
    
    if (!userId || !points || !reason) {
      return res.status(400).json({
        success: false,
        error: 'userId, points, and reason are required'
      });
    }

    const reputationService = require('../services/reputationService');
    const result = await reputationService.adjustReputation({
      userId,
      points: parseInt(points),
      reason,
      adminId: req.user.id
    });

    res.json({
      success: true,
      message: 'Reputation adjusted successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get all reputation adjustments (admin only)
 * GET /api/v1/reputation/adjustments
 */
router.get('/adjustments', authenticate, authorize(['ADMIN', 'MODERATOR']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, userId } = req.query;
    const skip = (page - 1) * limit;

    const prisma = require('../lib/prisma');
    
    const where = {
      source: 'admin_adjustment'
    };
    
    if (userId) {
      where.userId = userId;
    }

    const [adjustments, total] = await Promise.all([
      prisma.reputationHistory.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.reputationHistory.count({ where })
    ]);

    res.json({
      success: true,
      data: adjustments,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get system-wide reputation statistics (admin only)
 * GET /api/v1/reputation/stats
 */
router.get('/stats', authenticate, authorize(['ADMIN', 'MODERATOR']), async (req, res, next) => {
  try {
    const prisma = require('../lib/prisma');
    
    const [
      totalReputationPoints,
      averageReputation,
      topReputationUsers,
      reputationDistribution,
      monthlyReputationGrowth
    ] = await Promise.all([
      // Total reputation points in system
      prisma.user.aggregate({
        _sum: {
          reputation: true
        }
      }),
      
      // Average reputation per user
      prisma.user.aggregate({
        _avg: {
          reputation: true
        },
        where: {
          isActive: true
        }
      }),
      
      // Top 10 users by reputation
      prisma.user.findMany({
        where: {
          isActive: true,
          reputation: {
            gt: 0
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          reputation: true
        },
        orderBy: {
          reputation: 'desc'
        },
        take: 10
      }),
      
      // Reputation distribution
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN reputation >= 1000 THEN 'Legend (1000+)'
            WHEN reputation >= 500 THEN 'Expert (500-999)'
            WHEN reputation >= 250 THEN 'Master (250-499)'
            WHEN reputation >= 100 THEN 'Advanced (100-249)'
            WHEN reputation >= 50 THEN 'Intermediate (50-99)'
            WHEN reputation >= 10 THEN 'Beginner (10-49)'
            ELSE 'Newcomer (0-9)'
          END as level,
          COUNT(*) as user_count
        FROM "users"
        WHERE "isActive" = true
        GROUP BY level
        ORDER BY 
          CASE level
            WHEN 'Legend (1000+)' THEN 1
            WHEN 'Expert (500-999)' THEN 2
            WHEN 'Master (250-499)' THEN 3
            WHEN 'Advanced (100-249)' THEN 4
            WHEN 'Intermediate (50-99)' THEN 5
            WHEN 'Beginner (10-49)' THEN 6
            ELSE 7
          END
      `,
      
      // Monthly reputation growth
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM(delta) as monthly_gain,
          COUNT(*) as activity_count
        FROM "reputation_history"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `
    ]);

    res.json({
      success: true,
      data: {
        totalPoints: totalReputationPoints._sum.reputation || 0,
        averageReputation: Math.round(averageReputation._avg.reputation || 0),
        topUsers: topReputationUsers,
        distribution: reputationDistribution.map(dist => ({
          level: dist.level,
          userCount: parseInt(dist.user_count)
        })),
        monthlyGrowth: monthlyReputationGrowth.map(growth => ({
          month: growth.month.toISOString().substring(0, 7),
          gain: parseInt(growth.monthly_gain) || 0,
          activityCount: parseInt(growth.activity_count) || 0
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
