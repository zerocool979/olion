import api from './base';

/**
 * =====================================================
 * Discussion API
 * -----------------------------------------------------
 * Semua komunikasi terkait diskusi
 * =====================================================
 */

/**
 * Ambil semua diskusi
 */
export const getDiscussions = async (params = {}) => {
  try {
    const res = await api.get('/discussions', { params });
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
