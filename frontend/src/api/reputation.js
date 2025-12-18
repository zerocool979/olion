import api from './base';

/**
 * =====================================================
 * Reputation API
 * -----------------------------------------------------
 * Semua komunikasi terkait reputasi user
 * =====================================================
 */

/**
 * Ambil reputasi user yang sedang login
 */
export const getMyReputation = async () => {
  try {
    const res = await api.get('/reputation/me');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil reputasi user berdasarkan ID
 */
export const getReputationByUserId = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const res = await api.get(`/reputation/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil leaderboard reputasi
 */
export const getReputationLeaderboard = async (params = {}) => {
  try {
    const res = await api.get('/reputation/leaderboard', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
