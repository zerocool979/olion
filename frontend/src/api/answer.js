import api from './base';

/**
 * =====================================================
 * Answer API
 * -----------------------------------------------------
 * Semua komunikasi terkait jawaban
 * =====================================================
 */

/**
 * Ambil semua jawaban berdasarkan diskusi
 */
export const getAnswersByDiscussion = async (discussionId) => {
  if (!discussionId) {
    throw new Error('Discussion ID is required');
  }

  try {
    const res = await api.get(`/discussions/${discussionId}/answers`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Buat jawaban baru
 */
export const createAnswer = async (discussionId, payload) => {
  if (!discussionId || !payload) {
    throw new Error('Discussion ID and payload are required');
  }

  try {
    const res = await api.post(
      `/discussions/${discussionId}/answers`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update jawaban
 */
export const updateAnswer = async (answerId, payload) => {
  if (!answerId || !payload) {
    throw new Error('Answer ID and payload are required');
  }

  try {
    const res = await api.put(`/answers/${answerId}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus jawaban
 */
export const deleteAnswer = async (answerId) => {
  if (!answerId) {
    throw new Error('Answer ID is required');
  }

  try {
    const res = await api.delete(`/answers/${answerId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
