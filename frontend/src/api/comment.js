import api from './base';

/**
 * =====================================================
 * Comment API
 * -----------------------------------------------------
 * Semua komunikasi terkait komentar
 * =====================================================
 */

/**
 * =====================================================
 * Ambil komentar berdasarkan ANSWER
 * FIX: endpoint disesuaikan dengan backend
 * =====================================================
 */
export const getCommentsByAnswer = async (answerId) => {
  if (!answerId) {
    throw new Error('Answer ID is required');
  }

  try {
    // OLD (SALAH, JANGAN DIHAPUS)
    // const res = await api.get(`/answers/${answerId}/comments`);

    // FIX
    const res = await api.get(`/comments/answer/${answerId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * =====================================================
 * Buat komentar baru PADA ANSWER
 * =====================================================
 */
export const createComment = async (answerId, payload) => {
  if (!answerId || !payload) {
    throw new Error('Answer ID and payload are required');
  }

  try {
    // OLD (SALAH)
    // const res = await api.post(`/answers/${answerId}/comments`, payload);

    // FIX
    const res = await api.post(
      `/comments/answer/${answerId}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * =====================================================
 * Update komentar (OWNER)
 * =====================================================
 */
export const updateComment = async (commentId, payload) => {
  if (!commentId || !payload) {
    throw new Error('Comment ID and payload are required');
  }

  try {
    const res = await api.put(
      `/comments/${commentId}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * =====================================================
 * Hapus komentar (OWNER)
 * =====================================================
 */
export const deleteComment = async (commentId) => {
  if (!commentId) {
    throw new Error('Comment ID is required');
  }

  try {
    const res = await api.delete(
      `/comments/${commentId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
