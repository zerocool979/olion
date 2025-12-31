// backend/src/controllers/adminUserController.js

const adminUserService = require('../services/adminUserService');
const userService = require('../services/userService');
const prisma = require('../lib/prisma');

// Original stats function - keep as is
exports.stats = async (req, res) => {
  const users = await prisma.user.count();
  const discussions = await prisma.discussion.count();
  const reports = await prisma.report.count();

  res.json({ users, discussions, reports });
};

/**
 * =====================================================
 * ENHANCED ADMIN USER CONTROLLER
 * =====================================================
 */

/**
 * Get all users with pagination and filtering
 * GET /admin/users
 * Access: Admin only
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      fromDate,
      toDate
    } = req.query;

    const result = await userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      role: role || undefined,
      status: status || undefined,
      sortBy,
      sortOrder,
      fromDate,
      toDate
    });

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      filters: {
        search,
        role,
        status,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    next(error);
  }
};

/**
 * Get user by ID with detailed information
 * GET /admin/users/:id
 * Access: Admin (full), Moderator (limited), User (own profile)
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is admin or accessing their own profile
    const isAdmin = req.user.role === 'ADMIN';
    const isModerator = req.user.role === 'MODERATOR';
    const isOwnProfile = req.user.id === id;

    if (!isAdmin && !isOwnProfile && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this user'
      });
    }

    const user = await userService.getUserWithDetails(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For non-admins, remove sensitive information
    if (!isAdmin) {
      delete user.emailVerified;
      delete user.lastLogin;
      delete user.loginAttempts;
      delete user.twoFactorEnabled;

      // Moderators see less info than admins
      if (isModerator) {
        delete user.ipAddress;
        delete user.metadata;
      }
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    next(error);
  }
};

/**
 * Create new user (admin only)
 * POST /admin/users
 * Access: Admin only
 */
exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;

    // Validation
    if (!userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Admin can set any role, default to USER
    if (!userData.role) {
      userData.role = 'USER';
    }

    // Validate role
    const validRoles = ['ADMIN', 'MODERATOR', 'PAKAR', 'USER'];
    if (!validRoles.includes(userData.role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Valid roles are: ' + validRoles.join(', ')
      });
    }

    const user = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);

    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    next(error);
  }
};

/**
 * Update user (admin can update anyone, users can update themselves)
 * PUT /admin/users/:id
 * Access: Admin (any user), User (own profile only)
 * 
 * This is the unified updateUser function that replaces the original duplicate definitions.
 * It maintains compatibility with both adminUserService and userService usage patterns.
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const isAdmin = req.user.role === 'ADMIN';

    // Check if adminUserService.updateUser signature is being used (original pattern)
    const usingAdminServicePattern = req.body.adminId || (req.user.id && req.user.id !== id && isAdmin);
    
    if (usingAdminServicePattern && isAdmin) {
      // Original admin service pattern for backward compatibility
      const result = await adminUserService.updateUser(
        req.user.id,       // adminId
        id,                // target user
        updateData
      );
      return res.json({ success: true, data: result });
    }

    // Enhanced pattern with proper permission checks
    // Non-admin users can only update their own profile
    if (!isAdmin && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    // Non-admin users cannot change sensitive fields
    if (!isAdmin) {
      delete updateData.role;
      delete updateData.status;
      delete updateData.permissions;
      delete updateData.isVerified;
      delete updateData.emailVerified;
    }

    // Admin cannot change their own role (safety measure)
    if (isAdmin && req.user.id === id && updateData.role && updateData.role !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot change their own role'
      });
    }

    const updatedUser = await userService.updateUser(id, updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use by another user'
      });
    }

    next(error);
  }
};

/**
 * Delete user (admin only, cannot delete self)
 * DELETE /admin/users/:id
 * Access: Admin only
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Perform soft delete (set status to inactive)
    await prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date(),
        deletedBy: req.user.id
      }
    });

    // Alternatively, hard delete (uncomment if needed):
    // await prisma.user.delete({ where: { id } });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};

/**
 * Change user role (admin only)
 * PATCH /admin/users/:id/role
 * Access: Admin only
 */
exports.changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    // Validate role
    const validRoles = ['ADMIN', 'MODERATOR', 'PAKAR', 'USER'];
    if (!validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Valid roles are: ' + validRoles.join(', ')
      });
    }

    // Cannot change own role
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: `User role changed to ${role}`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Change user role error:', error);

    if (error.code === 'P2025') { // Prisma record not found
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    next(error);
  }
};

/**
 * Change user status (admin and moderator)
 * PATCH /admin/users/:id/status
 * Access: Admin and Moderator
 */
exports.changeUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    // Moderators cannot suspend/banned admins
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.user.role === 'MODERATOR' && targetUser.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Moderators cannot modify admin accounts'
      });
    }

    const updateData = {
      status: status.toUpperCase(),
      statusUpdatedAt: new Date(),
      statusUpdatedBy: req.user.id
    };

    if (reason) {
      updateData.statusReason = reason;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        statusUpdatedAt: true
      }
    });

    res.json({
      success: true,
      message: `User status changed to ${status}`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Change user status error:', error);
    next(error);
  }
};

/**
 * Get user activity log
 * GET /admin/users/:id/activity
 * Access: Admin and Moderator
 */
exports.getUserActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, type } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // In a real implementation, you would query an activity log table
    // For now, we'll return mock data or combine data from different tables

    const activities = await prisma.$transaction([
      // Get user's discussions
      prisma.discussion.findMany({
        where: { authorId: id },
        take: parseInt(limit),
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: { answers: true, comments: true, votes: true }
          }
        }
      }),
      // Get user's answers
      prisma.answer.findMany({
        where: { authorId: id },
        take: parseInt(limit),
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          discussion: {
            select: { id: true, title: true }
          },
          _count: {
            select: { comments: true, votes: true }
          }
        }
      }),
      // Get user's votes
      prisma.vote.findMany({
        where: { userId: id },
        take: parseInt(limit),
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          createdAt: true,
          discussion: {
            select: { id: true, title: true }
          },
          answer: {
            select: { id: true, content: true }
          }
        }
      })
    ]);

    const [discussions, answers, votes] = activities;

    const activityLog = [
      ...discussions.map(d => ({
        type: 'DISCUSSION',
        action: 'created discussion',
        data: d,
        timestamp: d.createdAt
      })),
      ...answers.map(a => ({
        type: 'ANSWER',
        action: 'answered discussion',
        data: a,
        timestamp: a.createdAt
      })),
      ...votes.map(v => ({
        type: 'VOTE',
        action: `voted ${v.type} on ${v.discussion ? 'discussion' : 'answer'}`,
        data: v,
        timestamp: v.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activityLog.slice(0, parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activityLog.length
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    next(error);
  }
};

/**
 * Search users
 * GET /admin/users/search
 * Access: Admin and Moderator
 */
exports.searchUsers = async (req, res, next) => {
  try {
    const { q, field = 'all', limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchTerm = `%${q}%`;
    let whereClause = {};

    if (field === 'all' || !field) {
      whereClause = {
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } }
        ]
      };
    } else if (field === 'email') {
      whereClause = { email: { contains: q, mode: 'insensitive' } };
    } else if (field === 'name') {
      whereClause = { name: { contains: q, mode: 'insensitive' } };
    } else if (field === 'username') {
      whereClause = { username: { contains: q, mode: 'insensitive' } };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: users,
      query: q,
      field,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Search users error:', error);
    next(error);
  }
};

/**
 * Get detailed statistics
 * GET /admin/stats/detailed
 * Access: Admin only
 */
exports.getDetailedStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      admins,
      moderators,
      pakars,
      regularUsers,
      todayRegistrations,
      weekRegistrations,
      monthRegistrations,
      totalDiscussions,
      totalAnswers,
      totalComments,
      totalReports,
      pendingReports
    ] = await Promise.all([
      // User statistics
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'INACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'MODERATOR' } }),
      prisma.user.count({ where: { role: 'PAKAR' } }),
      prisma.user.count({ where: { role: 'USER' } }),

      // Registration statistics
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Content statistics
      prisma.discussion.count(),
      prisma.answer.count(),
      prisma.comment.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } })
    ]);

    const stats = {
      users: {
        total: totalUsers,
        byStatus: {
          active: activeUsers,
          inactive: inactiveUsers,
          suspended: suspendedUsers
        },
        byRole: {
          admin: admins,
          moderator: moderators,
          pakar: pakars,
          user: regularUsers
        },
        registrations: {
          today: todayRegistrations,
          thisWeek: weekRegistrations,
          thisMonth: monthRegistrations
        }
      },
      content: {
        discussions: totalDiscussions,
        answers: totalAnswers,
        comments: totalComments
      },
      moderation: {
        totalReports,
        pendingReports,
        resolvedReports: totalReports - pendingReports
      },
      calculated: {
        avgDiscussionsPerUser: totalUsers > 0 ? (totalDiscussions / totalUsers).toFixed(2) : 0,
        avgAnswersPerDiscussion: totalDiscussions > 0 ? (totalAnswers / totalDiscussions).toFixed(2) : 0,
        activePercentage: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
      }
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get detailed stats error:', error);
    next(error);
  }
};

/**
 * Get recent users
 * GET /admin/users/recent
 * Access: Admin and Moderator
 */
exports.getRecentUsers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const users = await prisma.user.findMany({
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json({
      success: true,
      data: users,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get recent users error:', error);
    next(error);
  }
};

/**
 * Send notification to user
 * POST /admin/users/:id/notify
 * Access: Admin and Moderator
 */
exports.sendNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, type = 'INFO' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: id,
        title,
        message,
        type: type.toUpperCase(),
        sentBy: req.user.id,
        read: false
      }
    });

    // In a real implementation, you would also:
    // 1. Send email notification
    // 2. Send push notification
    // 3. Trigger WebSocket event

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notification,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    next(error);
  }
};

/**
 * Get user analytics
 * GET /admin/users/analytics
 * Access: Admin only
 */
exports.getUserAnalytics = async (req, res, next) => {
  try {
    // This would typically involve complex analytics queries
    // For now, return basic analytics

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const dailyRegistrations = await prisma.$queryRaw`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const userActivity = await prisma.$queryRaw`
      SELECT
        DATE(last_login) as date,
        COUNT(*) as active_users
      FROM users
      WHERE last_login >= ${thirtyDaysAgo}
      GROUP BY DATE(last_login)
      ORDER BY date DESC
    `;

    res.json({
      success: true,
      data: {
        dailyRegistrations,
        userActivity,
        period: '30 days',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    next(error);
  }
};

// === STUBS (WAJIB ADA AGAR ROUTES TIDAK CRASH) ===
exports.exportUsers = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.bulkCreateUsers = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.impersonateUser = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

exports.getRoles = async (req, res) => {
  res.json(['ADMIN', 'MODERATOR', 'PAKAR', 'USER']);
};

exports.getPermissions = async (req, res) => {
  res.json([]);
};

exports.getInactiveUsers = async (req, res) => {
  res.json([]);
};
