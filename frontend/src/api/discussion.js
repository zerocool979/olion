import api from './base';

/**
 * =====================================================
 * Discussion API - FULL FIX (categoryId | categoryName)
 * =====================================================
 */

/**
 * Ambil semua diskusi dengan filter
 */
export const getDiscussions = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
      cleanParams[key] = params[key];
    }
  });

  const res = await api.get('/discussions', { params: cleanParams });
  return res.data;
};

/**
 * Ambil detail diskusi
 */
export const getDiscussionById = async (id) => {
  if (!id) throw new Error('Discussion ID is required');
  const res = await api.get(`/discussions/${id}`);
  return res.data;
};

/**
 * =====================================================
 * CREATE DISCUSSION (FIXED)
 * - support categoryId OR categoryName
 * =====================================================
 */
export const createDiscussion = async (payload) => {
  if (!payload) throw new Error('Payload is required');

  const { title, content, categoryId, categoryName } = payload;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  if (!categoryId && !categoryName) {
    throw new Error('categoryId or categoryName is required');
  }

  const res = await api.post('/discussions', payload);
  return res.data;
};

/**
 * Update diskusi
 */
export const updateDiscussion = async (id, payload) => {
  if (!id || !payload) throw new Error('ID and payload are required');
  const res = await api.put(`/discussions/${id}`, payload);
  return res.data;
};

/**
 * Hapus diskusi
 */
export const deleteDiscussion = async (id) => {
  if (!id) throw new Error('Discussion ID is required');
  await api.delete(`/discussions/${id}`);
  return { success: true };
};

/**
 * Ambil diskusi milik user yang login
 */
export const getMyDiscussions = async () => {
  const res = await api.get('/discussions/my');
  return res.data;
};

/**
 * Ambil diskusi yang di-bookmark user
 */
export const getBookmarkedDiscussions = async () => {
  const res = await api.get('/discussions/bookmarked');
  return res.data;
};

/**
 * Toggle bookmark diskusi
 */
export const toggleBookmark = async (discussionId) => {
  if (!discussionId) throw new Error('Discussion ID is required');
  const res = await api.post(`/discussions/${discussionId}/bookmark`);
  return res.data;
};

/**
 * Vote diskusi
 * voteType: 'up' | 'down'
 */
export const voteDiscussion = async (discussionId, voteType) => {
  if (!discussionId || !voteType) {
    throw new Error('Discussion ID and vote type are required');
  }
  if (!['up', 'down'].includes(voteType)) {
    throw new Error('Vote type must be "up" or "down"');
  }

  const res = await api.post(`/discussions/${discussionId}/vote`, { type: voteType });
  return res.data;
};

/**
 * Report diskusi
 */
export const reportDiscussion = async (discussionId, reason) => {
  if (!discussionId || !reason) {
    throw new Error('Discussion ID and reason are required');
  }

  const res = await api.post(`/discussions/${discussionId}/report`, { reason });
  return res.data;
};

/**
 * Search diskusi
 */
export const searchDiscussions = async (query, options = {}) => {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }

  const res = await api.get('/discussions/search', {
    params: { q: query, ...options },
  });
  return res.data;
};

/**
 * Ambil diskusi berdasarkan kategori
 */
export const getDiscussionsByCategory = async (categoryId, options = {}) => {
  if (!categoryId) throw new Error('Category ID is required');
  const res = await api.get(`/discussions/category/${categoryId}`, {
    params: options,
  });
  return res.data;
};

/**
 * Ambil statistik diskusi (admin)
 */
export const getDiscussionStats = async () => {
  const res = await api.get('/discussions/admin/stats');
  return res.data;
};

export default {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getMyDiscussions,
  getBookmarkedDiscussions,
  toggleBookmark,
  voteDiscussion,
  reportDiscussion,
  searchDiscussions,
  getDiscussionsByCategory,
  getDiscussionStats,
};
