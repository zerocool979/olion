// backend/src/routes/adminUserRoutes.js

const express = require('express');
const router = express.Router();

// ✅ controller saja
const adminUserController = require('../controllers/adminUserController');

// ❌ SEMUA DI BAWAH INI SALAH TEMPAT
// const adminUserService = require('../services/adminUserService');
// const userService = require('../services/userService');
// const prisma = require('../lib/prisma');

// ❌ SEMUA exports.* DIKOMENTARI
// exports.stats = async (req, res) => { ... }
// exports.getAllUsers = async (req, res) => { ... }
// dst...

/**
 * =====================================================
 * ROUTE DEFINITIONS (CLEAN)
 * =====================================================
 */

// stats
router.get('/stats', adminUserController.stats);
router.get('/stats/detailed', adminUserController.getDetailedStats);

// users
router.get('/users', adminUserController.getAllUsers);
router.get('/users/recent', adminUserController.getRecentUsers);
router.get('/users/search', adminUserController.searchUsers);
router.get('/users/analytics', adminUserController.getUserAnalytics);
router.get('/users/:id', adminUserController.getUserById);
router.post('/users', adminUserController.createUser);
router.put('/users/:id', adminUserController.updateUser);
router.delete('/users/:id', adminUserController.deleteUser);

// role & status
router.patch('/users/:id/role', adminUserController.changeUserRole);
router.patch('/users/:id/status', adminUserController.changeUserStatus);

// activity & notification
router.get('/users/:id/activity', adminUserController.getUserActivity);
router.post('/users/:id/notify', adminUserController.sendNotification);

// stubs
router.post('/users/export', adminUserController.exportUsers);
router.post('/users/bulk', adminUserController.bulkCreateUsers);
router.post('/users/:id/impersonate', adminUserController.impersonateUser);
router.get('/roles', adminUserController.getRoles);
router.get('/permissions', adminUserController.getPermissions);
router.get('/users/inactive', adminUserController.getInactiveUsers);

module.exports = router;
