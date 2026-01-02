// src/controllers/userController.js

const userService = require('../services/userService');
const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(
      req.params.id,
      req.body.role
    );
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.toggleActive = async (req, res, next) => {
  try {
    const user = await userService.toggleActive(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

// =====================================================
// DASHBOARD & PAKAR FUNCTIONS - TAMBAHAN BARU
// =====================================================

/**
 * Get user dashboard statistics
 * GET /api/v1/users/dashboard-stats
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [
      discussionCount,
      answerCount,
      userData,
      unreadNotifications,
      upvotesReceived,
      bookmarksCount,
      reputationHistory
    ] = await Promise.all([
      // Discussion count
      prisma.discussion.count({
        where: { 
          userId,
          isDeleted: false 
        }
      }),
      
      // Answer count
      prisma.answer.count({
        where: { 
          userId,
          isDeleted: false 
        }
      }),
      
      // User data (reputation, etc)
      prisma.user.findUnique({
        where: { id: userId },
        select: { 
          reputation: true,
          role: true,
          hasAppliedPakar: true
        }
      }),
      
      // Unread notifications
      prisma.notification.count({
        where: {
          userId,
          isSent: true // Assuming isSent means delivered
          // Note: might need to add 'read' field to Notification model
        }
      }),
      
      // Total upvotes received on answers
      prisma.answerVote.count({
        where: {
          answer: {
            userId: userId,
            isDeleted: false
          },
          type: 'Up'
        }
      }),
      
      // Bookmarks count (if Bookmark model exists)
      prisma.bookmark.count({
        where: { userId }
      }).catch(() => 0), // Return 0 if Bookmark model doesn't exist yet
      
      // Recent reputation changes (last 7 days)
      prisma.reputationHistory.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          delta: {
            gt: 0
          }
        }
      })
    ]);

    // Check pakar application status
    const pakarApplication = await prisma.pakarApplication.findFirst({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        status: true,
        field: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        discussionCount,
        answerCount,
        reputation: userData?.reputation || 0,
        unreadNotifications,
        upvotesReceived,
        bookmarksCount,
        recentReputationChanges: reputationHistory,
        role: userData?.role || 'USER',
        hasAppliedPakar: userData?.hasAppliedPakar || false,
        pakarApplication: pakarApplication ? {
          id: pakarApplication.id,
          status: pakarApplication.status,
          field: pakarApplication.field,
          appliedDate: pakarApplication.createdAt
        } : null,
        // Additional stats for frontend display
        stats: {
          reputationProgress: Math.min(((userData?.reputation || 0) / 50) * 100, 100), // Progress towards 50 for pakar
          answerProgress: Math.min((answerCount / 10) * 100, 100) // Progress towards 10 answers for pakar
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Apply for pakar via user route (alternative endpoint)
 * POST /api/v1/users/apply-pakar
 */
exports.applyForPakar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { field, reason, yearsOfExperience, qualifications, portfolioUrl, references } = req.body;

    // Validasi input
    if (!field || !reason) {
      throw new AppError('Field and reason are required', 400);
    }

    // Check if user already has pending application
    const existingApplication = await prisma.pakarApplication.findFirst({
      where: {
        userId,
        status: 'pending'
      }
    });

    if (existingApplication) {
      throw new AppError('You already have a pending application. Please wait for review.', 400);
    }

    // Check if user is already a pakar
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.role === 'PAKAR') {
      throw new AppError('You are already a Pakar', 400);
    }

    // Check eligibility (minimum 50 reputation OR 10 answers)
    const [answerCount] = await Promise.all([
      prisma.answer.count({
        where: { 
          userId,
          isDeleted: false 
        }
      })
    ]);

    const isEligible = user.reputation >= 50 || answerCount >= 10;
    
    if (!isEligible) {
      throw new AppError(`Not eligible yet. Requirements: 50+ reputation (you have ${user.reputation}) OR 10+ answers (you have ${answerCount})`, 400);
    }

    // Create application
    const application = await prisma.pakarApplication.create({
      data: {
        userId,
        field,
        reason,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        qualifications: qualifications || null,
        portfolioUrl: portfolioUrl || null,
        references: references || null,
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            reputation: true
          }
        }
      }
    });

    // Update user hasAppliedPakar flag
    await prisma.user.update({
      where: { id: userId },
      data: { hasAppliedPakar: true }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Admin will review your application.',
      data: application
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user's pakar application status via user route
 * GET /api/v1/users/pakar-application
 */
exports.getMyPakarApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const application = await prisma.pakarApplication.findFirst({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            reputation: true
          }
        }
      }
    });

    if (!application) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No application found'
      });
    }

    // Format response to match frontend expectations
    const formattedApplication = {
      id: application.id,
      field: application.field,
      reason: application.reason,
      yearsOfExperience: application.yearsOfExperience,
      qualifications: application.qualifications,
      portfolioUrl: application.portfolioUrl,
      references: application.references,
      status: application.status,
      adminNotes: application.adminNotes,
      rejectionReason: application.rejectionReason,
      reviewedAt: application.reviewedAt,
      canReapplyAfter: application.canReapplyAfter,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      user: application.user
    };

    res.status(200).json({
      success: true,
      data: formattedApplication
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user's discussions
 * GET /api/v1/users/me/discussions
 */
exports.getMyDiscussions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      isDeleted: false
    };

    if (status) {
      where.status = status;
    }

    const orderBy = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where,
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          isFlagged: true,
          moderation: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              answers: {
                where: { isDeleted: false }
              },
              comments: {
                where: { isDeleted: false }
              },
              votes: {
                where: { type: 'Up' }
              }
            }
          }
        },
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.discussion.count({ where })
    ]);

    // Format discussions with stats
    const formattedDiscussions = discussions.map(discussion => ({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content.substring(0, 200) + (discussion.content.length > 200 ? '...' : ''),
      status: discussion.status,
      category: discussion.category,
      stats: {
        answers: discussion._count.answers,
        comments: discussion._count.comments,
        upvotes: discussion._count.votes
      },
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      isFlagged: discussion.isFlagged,
      moderation: discussion.moderation
    }));

    res.status(200).json({
      success: true,
      data: formattedDiscussions,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user's answers
 * GET /api/v1/users/me/answers
 */
exports.getMyAnswers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [answers, total] = await Promise.all([
      prisma.answer.findMany({
        where: {
          userId,
          isDeleted: false
        },
        select: {
          id: true,
          content: true,
          isExpertAnswer: true,
          isVerified: true,
          createdAt: true,
          discussion: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              votes: {
                where: { type: 'Up' }
              },
              comments: {
                where: { isDeleted: false }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.answer.count({
        where: {
          userId,
          isDeleted: false
        }
      })
    ]);

    // Format answers
    const formattedAnswers = answers.map(answer => ({
      id: answer.id,
      content: answer.content.substring(0, 150) + (answer.content.length > 150 ? '...' : ''),
      isExpertAnswer: answer.isExpertAnswer,
      isVerified: answer.isVerified,
      discussion: answer.discussion,
      stats: {
        upvotes: answer._count.votes,
        comments: answer._count.comments
      },
      createdAt: answer.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedAnswers,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get user's bookmarks
 * GET /api/v1/users/me/bookmarks
 */
exports.getMyBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        select: {
          id: true,
          createdAt: true,
          discussion: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              },
              category: {
                select: {
                  name: true
                }
              },
              _count: {
                select: {
                  answers: {
                    where: { isDeleted: false }
                  },
                  votes: {
                    where: { type: 'Up' }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }).catch(() => []), // Return empty array if Bookmark model doesn't exist
      prisma.bookmark.count({ where: { userId } }).catch(() => 0)
    ]);

    // Format bookmarks
    const formattedBookmarks = bookmarks.map(bookmark => ({
      id: bookmark.id,
      discussion: {
        id: bookmark.discussion.id,
        title: bookmark.discussion.title,
        excerpt: bookmark.discussion.content.substring(0, 100) + (bookmark.discussion.content.length > 100 ? '...' : ''),
        author: bookmark.discussion.user,
        category: bookmark.discussion.category?.name,
        stats: {
          answers: bookmark.discussion._count.answers,
          upvotes: bookmark.discussion._count.votes
        },
        createdAt: bookmark.discussion.createdAt
      },
      bookmarkedAt: bookmark.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedBookmarks,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};
