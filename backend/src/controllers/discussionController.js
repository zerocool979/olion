// backend/src/controllers/discussionController.js
const service = require('../services/discussionService');

/**
 * =====================================================
 * GET ALL DISCUSSIONS
 * GET /api/discussions
 * Query: ?page=&limit=&sort=
 * =====================================================
 * Service sudah handle:
 * - pagination
 * - normalisasi
 * - meta
 */
exports.findAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const currentUserId = req.user?.id || null;

    const data = await service.findAll(
      { page, limit, sort },
      currentUserId
    );

    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * =====================================================
 * GET MY DISCUSSIONS
 * GET /api/discussions/my
 * =====================================================
 * NOTE:
 * - Pagination BELUM diterapkan di service
 * - limit tetap dikirim sebagai meta (non-breaking)
 */
exports.findMy = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { limit = 10 } = req.query;

    const discussions = await service.findByUserId(req.user.id);

    res.status(200).json({
      data: discussions,
      meta: {
        total: discussions.length,
        limit: Number(limit),
      },
    });
  } catch (e) {
    next(e);
  }
};

/**
 * =====================================================
 * GET DISCUSSION BY ID
 * GET /api/discussions/:id
 * =====================================================
 */
exports.getDiscussionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || null;

    const data = await service.findById(id, currentUserId);

    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};
