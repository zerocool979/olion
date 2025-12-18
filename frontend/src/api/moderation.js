import api from './base';

/**
 * =====================================================
 * Moderation API
 * -----------------------------------------------------
 * Semua aksi moderasi (admin / moderator)
 * =====================================================
 */

/**
 * Ambil queue konten untuk moderasi
 */
export const getModerationQueue = async (params = {}) => {
  try {
    const res = await api.get('/moderation/queue', {
      params,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve konten
 */
export const approveContent = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post(
      '/moderation/approve',
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject konten
 */
export const rejectContent = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post(
      '/moderation/reject',
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Suspend user
 */
export const suspendUser = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post(
      '/moderation/suspend',
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unsuspend user
 */
export const unsuspendUser = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post(
      '/moderation/unsuspend',
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
