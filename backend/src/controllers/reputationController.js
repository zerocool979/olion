// src/controllers/reputationController.js

const reputationService = require('../services/reputationService');
const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.getMyReputation = async (req, res, next) => {
  try {
    const data = await reputationService.getByUser(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// =====================================================
// REPUTATION DASHBOARD FUNCTIONS - TAMBAHAN BARU
// =====================================================

/**
 * Get detailed reputation data for dashboard
 * GET /api/v1/reputation
 */
exports.getUserReputation = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's current reputation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        reputation: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Calculate reputation breakdown from various sources
    const [
      answerPoints,
      discussionPoints,
      upvotePoints,
      acceptedAnswerPoints,
      reputationHistory,
      totalContributions
    ] = await Promise.all([
      // Points from answers (2 points per answer)
      prisma.answer.count({
        where: { 
          userId,
          isDeleted: false 
        }
      }).then(count => count * 2),
      
      // Points from discussions (1 point per discussion)
      prisma.discussion.count({
        where: { 
          userId,
          isDeleted: false 
        }
      }).then(count => count * 1),
      
      // Points from upvotes on answers (5 points per upvote)
      prisma.answerVote.count({
        where: {
          answer: {
            authorId: userId,
            isDeleted: false
          },
          type: 'Up'
        }
      }).then(count => count * 5),
      
      // Points from accepted answers (10 points per accepted answer)
      prisma.answer.count({
        where: {
          userId,
          isDeleted: false,
          isExpertAnswer: true // Assuming isExpertAnswer means accepted
        }
      }).then(count => count * 10),
      
      // Reputation history (last 30 days)
      prisma.reputationHistory.findMany({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          }
        },
        select: {
          id: true,
          delta: true,
          reason: true,
          source: true,
          sourceId: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50
      }),
      
      // Total contributions count
      Promise.all([
        prisma.discussion.count({ where: { userId, isDeleted: false } }),
        prisma.answer.count({ where: { userId, isDeleted: false } }),
        prisma.comment.count({ where: { userId, isDeleted: false } })
      ]).then(([discussions, answers, comments]) => ({
        discussions,
        answers,
        comments,
        total: discussions + answers + comments
      }))
    ]);

    // Also get upvotes on discussions
    const discussionUpvotePoints = await prisma.discussionVote.count({
      where: {
        discussion: {
          authorId: userId,
          isDeleted: false
        },
        type: 'Up'
      }
    }).then(count => count * 3); // 3 points per discussion upvote

    // Calculate total points from all sources
    const calculatedTotal = answerPoints + discussionPoints + upvotePoints + 
                          acceptedAnswerPoints + discussionUpvotePoints;

    // Use actual reputation if available, otherwise use calculated
    const totalReputation = user.reputation > 0 ? user.reputation : calculatedTotal;

    // Reputation breakdown
    const breakdown = {
      answers: answerPoints,
      discussions: discussionPoints,
      upvotes: upvotePoints + discussionUpvotePoints,
      accepted: acceptedAnswerPoints,
      other: totalReputation - (answerPoints + discussionPoints + upvotePoints + 
             discussionUpvotePoints + acceptedAnswerPoints)
    };

    // Calculate rank based on reputation
    const getRank = (points) => {
      if (points >= 1000) return 'Legend';
      if (points >= 500) return 'Expert';
      if (points >= 250) return 'Master';
      if (points >= 100) return 'Advanced';
      if (points >= 50) return 'Intermediate';
      if (points >= 10) return 'Beginner';
      return 'Newcomer';
    };

    // Calculate next level threshold
    const getNextLevel = (points) => {
      if (points < 10) return 10;
      if (points < 50) return 50;
      if (points < 100) return 100;
      if (points < 250) return 250;
      if (points < 500) return 500;
      if (points < 1000) return 1000;
      return points + 100; // After legend, increment by 100
    };

    // Get reputation level info
    const rank = getRank(totalReputation);
    const nextLevel = getNextLevel(totalReputation);
    const progressPercentage = Math.min((totalReputation / nextLevel) * 100, 100);
    const pointsToNextLevel = nextLevel - totalReputation;

    // Format history with additional info
    const formattedHistory = await Promise.all(
      reputationHistory.map(async (item) => {
        let sourceDetails = null;
        
        // Get source details based on source type
        if (item.source === 'discussion' && item.sourceId) {
          const discussion = await prisma.discussion.findUnique({
            where: { id: item.sourceId },
            select: { title: true }
          });
          sourceDetails = discussion ? { title: discussion.title } : null;
        } else if (item.source === 'answer' && item.sourceId) {
          const answer = await prisma.answer.findUnique({
            where: { id: item.sourceId },
            select: { 
              content: true,
              discussion: {
                select: { title: true }
              }
            }
          });
          sourceDetails = answer ? { 
            title: answer.discussion?.title,
            excerpt: answer.content.substring(0, 50) + '...'
          } : null;
        }

        return {
          id: item.id,
          date: item.createdAt,
          activity: item.reason,
          points: item.delta,
          total: totalReputation, // This would need running total calculation
          source: item.source,
          sourceDetails
        };
      })
    );

    // Get monthly reputation trend (last 6 months)
    const monthlyTrend = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(delta) as monthly_points,
        COUNT(*) as activity_count
      FROM "reputation_history"
      WHERE "userId" = ${userId}
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `.catch(() => []); // Handle if raw query fails

    res.status(200).json({
      success: true,
      data: {
        total: totalReputation,
        rank,
        nextLevel,
        progress: {
          percentage: progressPercentage,
          current: totalReputation,
          required: nextLevel,
          remaining: pointsToNextLevel > 0 ? pointsToNextLevel : 0
        },
        breakdown,
        history: formattedHistory,
        contributions: totalContributions,
        monthlyTrend: monthlyTrend.map(trend => ({
          month: trend.month.toISOString().substring(0, 7), // YYYY-MM
          points: parseInt(trend.monthly_points) || 0,
          activityCount: parseInt(trend.activity_count) || 0
        })),
        // Additional stats for frontend
        stats: {
          dailyAverage: totalReputation > 0 
            ? Math.round(totalReputation / Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))))
            : 0,
          streak: await calculateReputationStreak(userId),
          rankPercentile: await calculateRankPercentile(totalReputation)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get reputation leaderboard
 * GET /api/v1/reputation/leaderboard
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 20, timeframe = 'all', page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let where = {
      isActive: true,
      reputation: {
        gt: 0
      }
    };

    // If timeframe is 'month', filter by recent activity
    if (timeframe === 'month') {
      // Get users with recent contributions
      const recentUserIds = await prisma.$queryRaw`
        SELECT DISTINCT "userId"
        FROM (
          SELECT "authorId" as "userId" FROM "discussions" 
          WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND "isDeleted" = false
          UNION
          SELECT "authorId" as "userId" FROM "answers" 
          WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND "isDeleted" = false
        ) recent_users
      `.catch(() => []);

      if (recentUserIds.length > 0) {
        where.id = {
          in: recentUserIds.map(u => u.userId)
        };
      }
    }

    const [leaderboard, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          reputation: true,
          createdAt: true,
          _count: {
            select: {
              discussions: {
                where: { isDeleted: false }
              },
              answers: {
                where: { isDeleted: false }
              }
            }
          }
        },
        orderBy: {
          reputation: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    // Format leaderboard with ranks
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: skip + index + 1,
      id: user.id,
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: user.role,
      reputation: user.reputation,
      contributions: {
        discussions: user._count.discussions,
        answers: user._count.answers,
        total: user._count.discussions + user._count.answers
      },
      joinDate: user.createdAt,
      isCurrentUser: req.user && req.user.id === user.id
    }));

    // Get current user's position if not in current page
    let currentUserRank = null;
    if (req.user) {
      const userWithRank = await prisma.$queryRaw`
        SELECT rank FROM (
          SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY reputation DESC) as rank
          FROM "users"
          WHERE "isActive" = true AND "reputation" > 0
        ) ranked_users
        WHERE id = ${req.user.id}
      `.catch(() => [{ rank: null }]);
      
      currentUserRank = userWithRank[0]?.rank;
    }

    res.status(200).json({
      success: true,
      data: formattedLeaderboard,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        currentUserRank
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get reputation by category/field
 * GET /api/v1/reputation/by-category
 */
exports.getReputationByCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get reputation by category through discussions
    const categoryReputation = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT d.id) as discussion_count,
        COUNT(DISTINCT a.id) as answer_count,
        COALESCE(SUM(
          CASE 
            WHEN a."isExpertAnswer" = true THEN 10
            ELSE 2
          END
        ), 0) as answer_points,
        COUNT(DISTINCT d.id) as discussion_points,
        COALESCE(SUM(
          CASE 
            WHEN av.type = 'Up' THEN 5
            ELSE 0
          END
        ), 0) as upvote_points
      FROM "categories" c
      LEFT JOIN "discussions" d ON c.id = d."categoryId" AND d."authorId" = ${userId} AND d."isDeleted" = false
      LEFT JOIN "answers" a ON d.id = a."discussionId" AND a."authorId" = ${userId} AND a."isDeleted" = false
      LEFT JOIN "answer_votes" av ON a.id = av."answerId" AND av.type = 'Up'
      WHERE c.id IN (
        SELECT DISTINCT "categoryId" 
        FROM "discussions" 
        WHERE "authorId" = ${userId} 
        UNION
        SELECT DISTINCT d."categoryId"
        FROM "answers" a
        JOIN "discussions" d ON a."discussionId" = d.id
        WHERE a."authorId" = ${userId}
      )
      GROUP BY c.id, c.name
      ORDER BY (answer_points + discussion_points + upvote_points) DESC
    `.catch(() => []);

    const formattedCategories = categoryReputation.map(cat => ({
      category: {
        id: cat.id,
        name: cat.name
      },
      stats: {
        discussions: parseInt(cat.discussion_count) || 0,
        answers: parseInt(cat.answer_count) || 0,
        points: {
          answers: parseInt(cat.answer_points) || 0,
          discussions: parseInt(cat.discussion_points) || 0,
          upvotes: parseInt(cat.upvote_points) || 0,
          total: (parseInt(cat.answer_points) || 0) + 
                 (parseInt(cat.discussion_points) || 0) + 
                 (parseInt(cat.upvote_points) || 0)
        }
      }
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories
    });

  } catch (error) {
    next(error);
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Calculate reputation streak (consecutive days with reputation gain)
 */
async function calculateReputationStreak(userId) {
  try {
    const dailyGains = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        SUM(delta) as daily_gain
      FROM "reputation_history"
      WHERE "userId" = ${userId}
        AND delta > 0
        AND "createdAt" >= NOW() - INTERVAL '90 days'
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;

    let streak = 0;
    let currentDate = new Date();
    
    for (const day of dailyGains) {
      const dayDate = new Date(day.date);
      const dayDiff = Math.floor((currentDate - dayDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    return 0;
  }
}

/**
 * Calculate rank percentile (what percentage of users you're ahead of)
 */
async function calculateRankPercentile(userReputation) {
  try {
    const [totalUsers, usersWithLessReputation] = await Promise.all([
      prisma.user.count({
        where: { isActive: true }
      }),
      prisma.user.count({
        where: {
          isActive: true,
          reputation: {
            lt: userReputation
          }
        }
      })
    ]);

    if (totalUsers === 0) return 100;
    
    const percentile = (usersWithLessReputation / totalUsers) * 100;
    return Math.round(percentile);
  } catch (error) {
    return 50; // Default to middle if calculation fails
  }
}
