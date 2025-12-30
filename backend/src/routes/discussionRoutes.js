const express = require('express');
const service = require('../services/discussionService');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();
const controller = require('../controllers/discussionController');

/**
 * =====================================================
 * GET ALL DISCUSSIONS
 * NOTE:
 * - Menggunakan controller (existing code)
 * - Dipertahankan sesuai instruksi (tidak dihapus)
 * =====================================================
 */
router.get('/', controller.findAll);

/**
 * =====================================================
 * FIX: GET DISCUSSION BY ID
 * GET /api/discussions/:id
 *
 * NOTE:
 * - Menggunakan service langsung
 * - Konsisten dengan kebutuhan frontend
 * - Error handling didelegasikan ke service
 * =====================================================
 */
router.get('/:id', async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * CREATE DISCUSSION
 * =====================================================
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = await service.create(req.user.id, req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * UPDATE DISCUSSION
 * =====================================================
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.user, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

/**
 * =====================================================
 * SOFT DELETE DISCUSSION
 * =====================================================
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await service.remove(req.params.id, req.user);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
