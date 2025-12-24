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
 * BACKEND: GET /api/answers/discussion/:id
 */
export const getAnswersByDiscussion = async (discussionId) => {
  if (!discussionId) {
    throw new Error('Discussion ID is required');
  }

  try {
    // ❌ SALAH (tidak ada di backend)
    // const res = await api.get(`/discussions/${discussionId}/answers`);

    // ✅ BENAR (sesuai backend)
    const res = await api.get(
      `/answers/discussion/${discussionId}`
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Buat jawaban baru
 * BACKEND: POST /api/answers
 */
export const createAnswer = async (discussionId, payload) => {
  if (!discussionId || !payload) {
    throw new Error('Discussion ID and payload are required');
  }

  try {
    // ❌ SALAH
    // const res = await api.post(
    //   `/discussions/${discussionId}/answers`,
    //   payload
    // );

    // ✅ BENAR
    const res = await api.post('/answers', {
      discussionId,
      ...payload,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update jawaban
 * ❗ BELUM ADA ENDPOINT DI BACKEND
 * Dibiarkan tapi ditandai
 */
export const updateAnswer = async (answerId, payload) => {
  if (!answerId || !payload) {
    throw new Error('Answer ID and payload are required');
  }

  try {
    // ❌ BACKEND BELUM MENYEDIAKAN ENDPOINT INI
    // const res = await api.put(`/answers/${answerId}`, payload);

    throw new Error(
      'Update answer endpoint is not implemented in backend'
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus jawaban
 * BACKEND: DELETE /api/answers/:id
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
