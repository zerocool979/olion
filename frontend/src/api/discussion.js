import api from './base';

/**
 * =====================================================
 * Discussion API
 * -----------------------------------------------------
 * Semua komunikasi terkait diskusi
 * =====================================================
 */

/**
 * Ambil semua diskusi dengan filter
 */
export const getDiscussions = async (params = {}) => {
  try {
    // Clean up empty params
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    const res = await api.get('/discussions', { params: cleanParams });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil detail diskusi
 */
export const getDiscussionById = async (id) => {
  if (!id) {
    throw new Error('Discussion ID is required');
  }

  try {
    const res = await api.get(`/discussions/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Buat diskusi baru
 */
export const createDiscussion = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  // Validate required fields
  if (!payload.title || !payload.content || !payload.categoryId) {
    throw new Error('Title, content, and category are required');
  }

  try {
    const res = await api.post('/discussions', payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update diskusi
 */
export const updateDiscussion = async (id, payload) => {
  if (!id || !payload) {
    throw new Error('ID and payload are required');
  }

  try {
    const res = await api.put(`/discussions/${id}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus diskusi
 */
export const deleteDiscussion = async (id) => {
  if (!id) {
    throw new Error('Discussion ID is required');
  }

  try {
    const res = await api.delete(`/discussions/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi milik user yang sedang login
 */
export const getMyDiscussions = async () => {
  try {
    const res = await api.get('/discussions/my');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi yang di-bookmark user
 */
export const getBookmarkedDiscussions = async () => {
  try {
    const res = await api.get('/discussions/bookmarked');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle bookmark diskusi
 */
export const toggleBookmark = async (discussionId) => {
  if (!discussionId) {
    throw new Error('Discussion ID is required');
  }

  try {
    // Cek dulu apakah sudah di-bookmark
    const checkRes = await api.get(`/discussions/${discussionId}/bookmark/status`);
    const isBookmarked = checkRes.data?.isBookmarked;
    
    if (isBookmarked) {
      // Hapus bookmark
      const res = await api.delete(`/discussions/${discussionId}/bookmark`);
      return { ...res.data, action: 'removed' };
    } else {
      // Tambah bookmark
      const res = await api.post(`/discussions/${discussionId}/bookmark`);
      return { ...res.data, action: 'added' };
    }
  } catch (error) {
    // Fallback: langsung coba POST (asumsi belum di-bookmark)
    try {
      const res = await api.post(`/discussions/${discussionId}/bookmark`);
      return { ...res.data, action: 'added' };
    } catch (fallbackError) {
      throw error;
    }
  }
};

/**
 * Vote diskusi (upvote/downvote)
 */
export const voteDiscussion = async (discussionId, voteType) => {
  if (!discussionId || !voteType) {
    throw new Error('Discussion ID and vote type are required');
  }

  if (!['upvote', 'downvote'].includes(voteType)) {
    throw new Error('Vote type must be "upvote" or "downvote"');
  }

  try {
    const res = await api.post(`/discussions/${discussionId}/vote`, { type: voteType });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi trending
 */
export const getTrendingDiscussions = async (limit = 10) => {
  try {
    const res = await api.get('/discussions/trending', { params: { limit } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi terbaru
 */
export const getRecentDiscussions = async (limit = 10) => {
  try {
    const res = await api.get('/discussions/recent', { params: { limit } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi yang belum terjawab
 */
export const getUnansweredDiscussions = async (limit = 10) => {
  try {
    const res = await api.get('/discussions/unanswered', { params: { limit } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update status diskusi (open/closed)
 */
export const updateDiscussionStatus = async (discussionId, status) => {
  if (!discussionId || !status) {
    throw new Error('Discussion ID and status are required');
  }

  if (!['open', 'closed'].includes(status)) {
    throw new Error('Status must be "open" or "closed"');
  }

  try {
    const res = await api.patch(`/discussions/${discussionId}/status`, { status });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Report diskusi
 */
export const reportDiscussion = async (discussionId, reason) => {
  if (!discussionId || !reason) {
    throw new Error('Discussion ID and reason are required');
  }

  try {
    const res = await api.post(`/discussions/${discussionId}/report`, { reason });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil statistik diskusi untuk dashboard
 */
export const getDiscussionStats = async () => {
  try {
    const res = await api.get('/discussions/stats');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil kategori diskusi
 */
export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search diskusi
 */
export const searchDiscussions = async (query, options = {}) => {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }

  try {
    const res = await api.get('/discussions/search', { 
      params: { q: query, ...options }
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi berdasarkan kategori
 */
export const getDiscussionsByCategory = async (categoryId, options = {}) => {
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  try {
    const res = await api.get(`/categories/${categoryId}/discussions`, { params: options });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil diskusi yang diikuti (subscription)
 */
export const getSubscribedDiscussions = async () => {
  try {
    const res = await api.get('/discussions/subscribed');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle subscription/follow diskusi
 */
export const toggleSubscription = async (discussionId) => {
  if (!discussionId) {
    throw new Error('Discussion ID is required');
  }

  try {
    const res = await api.post(`/discussions/${discussionId}/subscribe`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ekspor semua fungsi untuk digunakan
 */
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
  getTrendingDiscussions,
  getRecentDiscussions,
  getUnansweredDiscussions,
  updateDiscussionStatus,
  reportDiscussion,
  getDiscussionStats,
  getCategories,
  searchDiscussions,
  getDiscussionsByCategory,
  getSubscribedDiscussions,
  toggleSubscription
};

/**
 * =====================================================
 * PENGGUNAAN CONTOH:
 * =====================================================
 * 
 * 1. Ambil semua diskusi dengan filter:
 *    const discussions = await getDiscussions({ 
 *      page: 1, 
 *      limit: 10,
 *      category: 'technology',
 *      sort: 'newest'
 *    });
 * 
 * 2. Buat diskusi baru:
 *    const newDiscussion = await createDiscussion({
 *      title: 'Judul Diskusi',
 *      content: 'Isi diskusi...',
 *      categoryId: '123',
 *      tags: ['javascript', 'react']
 *    });
 * 
 * 3. Bookmark diskusi:
 *    const result = await toggleBookmark('discussion_id');
 *    console.log(result.action); // 'added' atau 'removed'
 * 
 * 4. Vote diskusi:
 *    await voteDiscussion('discussion_id', 'upvote');
 * 
 * 5. Search:
 *    const results = await searchDiscussions('react hooks');
 * 
 * =====================================================
 */
