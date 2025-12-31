// backend/src/routes/dashboardRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * =====================================================
 * DASHBOARD ROUTES
 * -----------------------------------------------------
 * Role-based dashboard statistics endpoints
 * =====================================================
 */

/**
 * GET /api/dashboard
 * General dashboard stats for all authenticated users
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const [
      discussionCount,
      answerCount,
      userCount,
    ] = await Promise.all([
      prisma.discussion.count({ where: { isDeleted: false } }),
      prisma.answer.count({ where: { isDeleted: false } }),
      prisma.user.count(),
    ]);

    res.json({
      discussionCount,
      answerCount,
      userCount,
      role: req.user.role,
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/user-stats
 * User-specific dashboard statistics
 */
router.get('/user-stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get user's discussions count
    const myDiscussions = await prisma.discussion.count({
      where: {
        authorId: userId,
        isDeleted: false
      }
    });

    // Get user's answers count
    const myAnswers = await prisma.answer.count({
      where: {
        authorId: userId,
        isDeleted: false
      }
    });

    // Get user's comments count
    const myComments = await prisma.comment.count({
      where: {
        authorId: userId,
        isDeleted: false
      }
    });

    // Get user's reputation (sum of upvotes on their answers)
    const myAnswersWithVotes = await prisma.answer.findMany({
      where: {
        authorId: userId,
        isDeleted: false
      },
      select: {
        upvotes: true
      }
    });

    const myReputation = myAnswersWithVotes.reduce((sum, answer) => sum + (answer.upvotes || 0), 0);

    // Get unread notifications count
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false
      }
    });

    // Get recent user activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentActivity = await prisma.discussion.count({
      where: {
        authorId: userId,
        createdAt: { gte: oneWeekAgo },
        isDeleted: false
      }
    });

    // Get bookmarked discussions count
    const bookmarkedDiscussions = await prisma.discussionBookmark.count({
      where: {
        userId: userId
      }
    });

    res.json({
      myDiscussions,
      myAnswers,
      myComments,
      myReputation,
      unreadNotifications,
      recentActivity,
      bookmarkedDiscussions,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/admin-stats
 * Admin-only dashboard statistics
 */
router.get('/admin-stats', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    // Get total counts
    const [
      totalUsers,
      totalDiscussions,
      totalAnswers,
      totalComments,
      pendingReports,
      pendingPakarApplications,
      newUsersToday,
      activeUsersLast24h
    ] = await Promise.all([
      prisma.user.count(),
      prisma.discussion.count({ where: { isDeleted: false } }),
      prisma.answer.count({ where: { isDeleted: false } }),
      prisma.comment.count({ where: { isDeleted: false } }),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.pakarApplication.count({ where: { status: 'pending' } }),
      // New users today
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      // Active users in last 24 hours (users who created content)
      prisma.user.count({
        where: {
          OR: [
            {
              discussions: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              }
            },
            {
              answers: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              }
            }
          ]
        }
      })
    ]);

    // Get user distribution by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    });

    // Convert to object format
    const roleDistribution = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {});

    // Get recent activities (last 5)
    const recentActivities = await prisma.discussion.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    // Get system health metrics
    const systemHealth = {
      database: 'connected',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.json({
      totalUsers,
      totalDiscussions,
      totalAnswers,
      totalComments,
      pendingReports,
      pendingPakarApplications,
      newUsersToday,
      activeUsersLast24h,
      roleDistribution,
      recentActivities,
      systemHealth,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/pakar-stats
 * Pakar (Expert) dashboard statistics
 */
router.get('/pakar-stats', authenticate, authorize(['pakar', 'admin', 'moderator']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get expert-specific stats
    const [
      expertAnswers,
      answerUpvotes,
      expertApplications,
      averageResponseTime,
      questionsNeedingExpert,
      expertRank
    ] = await Promise.all([
      // Expert answers count
      prisma.answer.count({
        where: {
          authorId: userId,
          isDeleted: false,
          isExpertAnswer: true
        }
      }),
      
      // Total upvotes on expert answers
      prisma.answer.aggregate({
        where: {
          authorId: userId,
          isDeleted: false,
          isExpertAnswer: true
        },
        _sum: {
          upvotes: true
        }
      }),
      
      // Expert applications (if any)
      prisma.pakarApplication.count({
        where: {
          userId: userId
        }
      }),
      
      // Average response time (in hours)
      (async () => {
        const answers = await prisma.answer.findMany({
          where: {
            authorId: userId,
            isDeleted: false,
            isExpertAnswer: true,
            discussion: {
              createdAt: { not: null }
            }
          },
          select: {
            createdAt: true,
            discussion: {
              select: {
                createdAt: true
              }
            }
          }
        });

        if (answers.length === 0) return 0;

        const totalResponseTime = answers.reduce((sum, answer) => {
          const questionTime = new Date(answer.discussion.createdAt);
          const answerTime = new Date(answer.createdAt);
          const diffHours = (answerTime - questionTime) / (1000 * 60 * 60);
          return sum + diffHours;
        }, 0);

        return Math.round(totalResponseTime / answers.length);
      })(),
      
      // Questions needing expert attention
      prisma.discussion.count({
        where: {
          isDeleted: false,
          category: req.user.specialization || undefined, // Filter by expert's specialization if available
          answers: {
            none: {
              isExpertAnswer: true
            }
          }
        }
      }),
      
      // Expert ranking (based on upvotes)
      (async () => {
        const experts = await prisma.user.findMany({
          where: {
            role: 'pakar',
            answers: {
              some: {
                isExpertAnswer: true
              }
            }
          },
          select: {
            id: true,
            name: true,
            answers: {
              where: { isExpertAnswer: true },
              select: { upvotes: true }
            }
          }
        });

        const expertScores = experts.map(expert => ({
          id: expert.id,
          score: expert.answers.reduce((sum, ans) => sum + (ans.upvotes || 0), 0)
        }));

        expertScores.sort((a, b) => b.score - a.score);
        const rank = expertScores.findIndex(expert => expert.id === userId) + 1;
        return rank || 0;
      })()
    ]);

    // Calculate expert score (weighted formula)
    const expertScore = Math.round(
      (expertAnswers * 10) + 
      (answerUpvotes._sum.upvotes || 0) + 
      (averageResponseTime > 0 ? (100 / averageResponseTime) : 0)
    );

    // Determine expert level based on score
    let expertLevel = 1;
    if (expertScore >= 1000) expertLevel = 5;
    else if (expertScore >= 500) expertLevel = 4;
    else if (expertScore >= 250) expertLevel = 3;
    else if (expertScore >= 100) expertLevel = 2;

    // Get recent expert answers
    const recentExpertAnswers = await prisma.answer.findMany({
      where: {
        authorId: userId,
        isDeleted: false,
        isExpertAnswer: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        content: true,
        createdAt: true,
        upvotes: true,
        discussion: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Get user's specialization if available
    const pakarApplication = await prisma.pakarApplication.findFirst({
      where: {
        userId: userId,
        status: 'approved'
      },
      select: {
        specialization: true,
        experience: true
      }
    });

    res.json({
      expertAnswers,
      answerUpvotes: answerUpvotes._sum.upvotes || 0,
      expertApplications,
      avgResponseTime: averageResponseTime,
      questionsNeedingExpert,
      expertRank,
      expertScore,
      expertLevel,
      recentExpertAnswers,
      specialization: pakarApplication?.specialization || req.user.specialization || 'General Expert',
      experience: pakarApplication?.experience || 0,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/moderation-stats
 * Moderator dashboard statistics
 */
router.get('/moderation-stats', authenticate, authorize(['moderator', 'admin']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get moderation statistics
    const [
      pendingReports,
      resolvedToday,
      totalModerated,
      avgResponseTime,
      reportedUsers,
      flaggedContent
    ] = await Promise.all([
      // Pending reports count
      prisma.report.count({
        where: {
          status: 'pending',
          priority: req.user.role === 'moderator' ? { in: ['low', 'medium'] } : undefined // Admins see all
        }
      }),
      
      // Reports resolved today by this moderator
      prisma.report.count({
        where: {
          status: 'resolved',
          resolvedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          },
          resolvedBy: req.user.role === 'moderator' ? userId : undefined
        }
      }),
      
      // Total content moderated by this user
      prisma.report.count({
        where: {
          status: 'resolved',
          resolvedBy: req.user.role === 'moderator' ? userId : undefined
        }
      }),
      
      // Average response time (in hours)
      (async () => {
        const reports = await prisma.report.findMany({
          where: {
            status: 'resolved',
            resolvedBy: req.user.role === 'moderator' ? userId : undefined,
            createdAt: { not: null },
            resolvedAt: { not: null }
          },
          select: {
            createdAt: true,
            resolvedAt: true
          }
        });

        if (reports.length === 0) return 0;

        const totalResponseTime = reports.reduce((sum, report) => {
          const reportTime = new Date(report.createdAt);
          const resolveTime = new Date(report.resolvedAt);
          const diffHours = (resolveTime - reportTime) / (1000 * 60 * 60);
          return sum + diffHours;
        }, 0);

        return Math.round(totalResponseTime / reports.length);
      })(),
      
      // Reported users count
      prisma.user.count({
        where: {
          OR: [
            { discussions: { some: { reports: { some: {} } } } },
            { answers: { some: { reports: { some: {} } } } },
            { comments: { some: { reports: { some: {} } } } }
          ]
        }
      }),
      
      // Flagged content by type
      (async () => {
        const flaggedByType = await prisma.report.groupBy({
          by: ['contentType'],
          where: {
            status: 'pending'
          },
          _count: {
            id: true
          }
        });

        return flaggedByType.reduce((acc, item) => {
          acc[item.contentType] = item._count.id;
          return acc;
        }, {});
      })()
    ]);

    // Calculate moderation score
    const moderationScore = Math.round(
      (totalModerated * 5) + 
      (resolvedToday * 10) + 
      (avgResponseTime > 0 ? (100 / avgResponseTime) : 0)
    );

    // Get recent moderation actions
    const recentModerationActions = await prisma.report.findMany({
      where: {
        status: 'resolved',
        resolvedBy: req.user.role === 'moderator' ? userId : undefined
      },
      orderBy: { resolvedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        contentType: true,
        reason: true,
        actionTaken: true,
        resolvedAt: true,
        moderator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Get priority distribution of pending reports
    const pendingByPriority = await prisma.report.groupBy({
      by: ['priority'],
      where: {
        status: 'pending'
      },
      _count: {
        id: true
      }
    });

    const priorityDistribution = pendingByPriority.reduce((acc, item) => {
      acc[item.priority] = item._count.id;
      return acc;
    }, {});

    res.json({
      pendingReports,
      resolvedToday,
      totalModerated,
      avgResponseTime,
      reportedUsers,
      flaggedContent,
      moderationScore,
      recentModerationActions,
      priorityDistribution,
      moderator: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/recent-discussions
 * Get recent discussions for dashboard
 */
router.get('/recent-discussions', authenticate, async (req, res, next) => {
  try {
    const recentDiscussions = await prisma.discussion.findMany({
      where: {
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        category: true,
        upvotes: true,
        views: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true
          }
        },
        _count: {
          select: {
            answers: true,
            comments: true
          }
        }
      }
    });

    res.json(recentDiscussions);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/need-expert
 * Get discussions that need expert attention
 */
router.get('/need-expert', authenticate, authorize(['pakar', 'admin', 'moderator']), async (req, res, next) => {
  try {
    const discussions = await prisma.discussion.findMany({
      where: {
        isDeleted: false,
        // No expert answers yet
        answers: {
          none: {
            isExpertAnswer: true
          }
        },
        // Optional: filter by expert's specialization
        ...(req.user.specialization ? {
          category: req.user.specialization
        } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    });

    res.json(discussions);
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/dashboard/my-discussions
 * Get current user's discussions
 */
router.get('/my-discussions', authenticate, async (req, res, next) => {
  try {
    const discussions = await prisma.discussion.findMany({
      where: {
        authorId: req.user.id,
        isDeleted: false
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        category: true,
        upvotes: true,
        views: true,
        isClosed: true,
        _count: {
          select: {
            answers: true,
            comments: true
          }
        }
      }
    });

    res.json(discussions);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
