import api from './base';

/**
 * =====================================================
 * Comment API
 * -----------------------------------------------------
 * Semua komunikasi terkait komentar
 * =====================================================
 */

/**
 * Ambil komentar berdasarkan answer
 */
export const getCommentsByAnswer = async (answerId) => {
  if (!answerId) {
    throw new Error('Answer ID is required');
  }

  try {
    const res = await api.get(`/answers/${answerId}/comments`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Buat komentar baru
 */
export const createComment = async (answerId, payload) => {
  if (!answerId || !payload) {
    throw new Error('Answer ID and payload are required');
  }

  try {
    const res = await api.post(
      `/answers/${answerId}/comments`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update komentar
 */
export const updateComment = async (commentId, payload) => {
  if (!commentId || !payload) {
    throw new Error('Comment ID and payload are required');
  }

  try {
    const res = await api.put(`/comments/${commentId}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus komentar
 */
export const deleteComment = async (commentId) => {
  if (!commentId) {
    throw new Error('Comment ID is required');
  }

  try {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
