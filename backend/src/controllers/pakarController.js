// src/controllers/pakarController.js
// Controller untuk fitur Pakar (pengajuan, review, status)

const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');

/**
 * Apply to become a Pakar
 * POST /api/v1/pakars/apply
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

    // Check if user has recently been rejected (within 30 days)
    const recentRejection = await prisma.pakarApplication.findFirst({
      where: {
        userId,
        status: 'rejected',
        canReapplyAfter: {
          gt: new Date()
        }
      }
    });

    if (recentRejection) {
      const daysLeft = Math.ceil((recentRejection.canReapplyAfter - new Date()) / (1000 * 60 * 60 * 24));
      throw new AppError(`You can reapply after ${daysLeft} days`, 400);
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
 * Get user's pakar application status
 * GET /api/v1/pakars/my-application
 */
exports.getMyApplication = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all pakar applications (admin only)
 * GET /api/v1/pakars/applications
 */
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    
    // Search by user email or name
    if (search) {
      where.OR = [
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          field: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.pakarApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              reputation: true,
              role: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.pakarApplication.count({ where })
    ]);

    res.status(200).json({
      success: true,
      data: applications,
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
 * Review pakar application (admin only)
 * PATCH /api/v1/pakars/applications/:id/review
 */
exports.reviewApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, rejectionReason } = req.body;
    const moderatorId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      throw new AppError('Invalid status. Must be "approved" or "rejected"', 400);
    }

    const application = await prisma.pakarApplication.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.status !== 'pending') {
      throw new AppError('Application has already been reviewed', 400);
    }

    // Update application
    const updatedApplication = await prisma.pakarApplication.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
        reviewedAt: new Date(),
        canReapplyAfter: status === 'rejected' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null // 30 days later
      }
    });

    // If approved, update user role to PAKAR
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { 
          role: 'PAKAR',
          hasAppliedPakar: false
        }
      });
      
      // Also update existing Pakar record if exists, or create new one
      await prisma.pakar.upsert({
        where: { userId: application.userId },
        update: {
          expertise: application.field,
          status: 'Approved'
        },
        create: {
          userId: application.userId,
          expertise: application.field,
          document: 'Approved via application',
          status: 'Approved'
        }
      });
    }

    // If rejected, reset hasAppliedPakar flag
    if (status === 'rejected') {
      await prisma.user.update({
        where: { id: application.userId },
        data: { hasAppliedPakar: false }
      });
    }

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: status === 'approved' ? 'Pakar Application Approved' : 'Pakar Application Update',
        message: status === 'approved' 
          ? `Congratulations! Your application to become a Pakar in ${application.field} has been approved.`
          : `Your Pakar application in ${application.field} has been reviewed. Status: ${status}.`,
        channel: 'InApp',
        isSent: true
      }
    });

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: updatedApplication
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get pakar statistics (admin only)
 * GET /api/v1/pakars/stats
 */
exports.getPakarStats = async (req, res, next) => {
  try {
    const [totalPakars, totalApplications, pendingApplications, approvedApplications, rejectedApplications] = await Promise.all([
      // Total Pakars
      prisma.user.count({
        where: { role: 'PAKAR' }
      }),
      
      // Total applications
      prisma.pakarApplication.count(),
      
      // Pending applications
      prisma.pakarApplication.count({
        where: { status: 'pending' }
      }),
      
      // Approved applications
      prisma.pakarApplication.count({
        where: { status: 'approved' }
      }),
      
      // Rejected applications
      prisma.pakarApplication.count({
        where: { status: 'rejected' }
      })
    ]);

    // Get applications by month for chart
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM "pakar_applications"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
    `;

    // Get top application fields
    const topFields = await prisma.$queryRaw`
      SELECT 
        field,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count
      FROM "pakar_applications"
      GROUP BY field
      ORDER BY count DESC
      LIMIT 10
    `;

    res.status(200).json({
      success: true,
      data: {
        totalPakars,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        approvalRate: totalApplications > 0 
          ? Math.round((approvedApplications / totalApplications) * 100) 
          : 0,
        monthlyStats: monthlyStats.map(stat => ({
          month: stat.month.toISOString().substring(0, 7),
          total: parseInt(stat.total),
          approved: parseInt(stat.approved),
          rejected: parseInt(stat.rejected),
          pending: parseInt(stat.pending)
        })),
        topFields: topFields.map(field => ({
          field: field.field,
          count: parseInt(field.count),
          approvedCount: parseInt(field.approved_count)
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all pakars (public)
 * GET /api/v1/pakars
 */
exports.getAllPakars = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, expertise, sortBy = 'reputation', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      role: 'PAKAR',
      isActive: true
    };

    if (expertise) {
      where.OR = [
        {
          pakar: {
            expertise: {
              contains: expertise,
              mode: 'insensitive'
            }
          }
        },
        {
          pakarApplications: {
            some: {
              field: {
                contains: expertise,
                mode: 'insensitive'
              },
              status: 'approved'
            }
          }
        }
      ];
    }

    const orderBy = {};
    if (sortBy === 'reputation') {
      orderBy.reputation = sortOrder;
    } else if (sortBy === 'joined') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [pakars, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          reputation: true,
          createdAt: true,
          pakar: {
            select: {
              expertise: true,
              status: true
            }
          },
          _count: {
            select: {
              discussions: true,
              answers: true
            }
          }
        },
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    // Format response
    const formattedPakars = pakars.map(pakar => ({
      ...pakar,
      expertise: pakar.pakar?.expertise || 'General',
      verificationStatus: pakar.pakar?.status || 'Pending',
      contributions: {
        discussions: pakar._count.discussions,
        answers: pakar._count.answers
      }
    }));

    res.status(200).json({
      success: true,
      data: formattedPakars,
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
 * Get pakar by ID (public)
 * GET /api/v1/pakars/:id
 */
exports.getPakarById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pakar = await prisma.user.findUnique({
      where: {
        id,
        role: 'PAKAR',
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reputation: true,
        createdAt: true,
        lastLogin: true,
        pakar: {
          select: {
            expertise: true,
            document: true,
            status: true
          }
        },
        pakarApplications: {
          where: {
            status: 'approved'
          },
          select: {
            field: true,
            createdAt: true,
            reviewedAt: true
          }
        },
        _count: {
          select: {
            discussions: {
              where: {
                isDeleted: false
              }
            },
            answers: {
              where: {
                isDeleted: false,
                isExpertAnswer: true
              }
            },
            reputationLog: true
          }
        },
        // Get recent expert answers
        answers: {
          where: {
            isDeleted: false,
            isExpertAnswer: true
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            discussion: {
              select: {
                id: true,
                title: true
              }
            },
            _count: {
              select: {
                votes: {
                  where: {
                    type: 'Up'
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!pakar) {
      throw new AppError('Pakar not found', 404);
    }

    // Calculate acceptance rate for expert answers
    const totalAnswers = pakar._count.answers;
    const acceptedAnswers = pakar.answers.filter(a => a.isExpertAnswer).length;
    const acceptanceRate = totalAnswers > 0 ? Math.round((acceptedAnswers / totalAnswers) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...pakar,
        expertise: pakar.pakar?.expertise || 'General',
        verificationStatus: pakar.pakar?.status || 'Pending',
        stats: {
          reputation: pakar.reputation,
          totalDiscussions: pakar._count.discussions,
          totalAnswers: pakar._count.answers,
          expertAnswers: pakar._count.answers,
          reputationHistory: pakar._count.reputationLog,
          acceptanceRate
        },
        recentContributions: pakar.answers.map(answer => ({
          id: answer.id,
          content: answer.content.substring(0, 150) + (answer.content.length > 150 ? '...' : ''),
          discussion: answer.discussion,
          upvotes: answer._count.votes,
          createdAt: answer.createdAt
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Check if user is eligible to apply for pakar
 * GET /api/v1/pakars/check-eligibility
 */
exports.checkEligibility = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, existingApplication, userStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          reputation: true,
          hasAppliedPakar: true
        }
      }),
      prisma.pakarApplication.findFirst({
        where: {
          userId,
          status: 'pending'
        }
      }),
      // Get user contribution stats
      Promise.all([
        prisma.discussion.count({ where: { userId } }),
        prisma.answer.count({ where: { userId } }),
        prisma.answer.count({ 
          where: { 
            userId,
            isExpertAnswer: true 
          } 
        })
      ])
    ]);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check eligibility criteria
    const hasMinReputation = user.reputation >= 50;
    const hasMinAnswers = userStats[1] >= 10;
    const isEligible = hasMinReputation || hasMinAnswers;

    const eligibility = {
      isEligible,
      criteria: {
        minReputation: {
          required: 50,
          current: user.reputation,
          met: hasMinReputation
        },
        minAnswers: {
          required: 10,
          current: userStats[1],
          met: hasMinAnswers
        }
      },
      userStatus: {
        role: user.role,
        hasAppliedPakar: user.hasAppliedPakar,
        hasPendingApplication: !!existingApplication,
        existingApplicationId: existingApplication?.id
      },
      stats: {
        discussions: userStats[0],
        answers: userStats[1],
        expertAnswers: userStats[2]
      }
    };

    res.status(200).json({
      success: true,
      data: eligibility
    });

  } catch (error) {
    next(error);
  }
};
