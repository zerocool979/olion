import api from './base';

/**
 * =====================================================
 * User API
 * -----------------------------------------------------
 * Semua komunikasi terkait user & profile
 * =====================================================
 */

/**
 * Ambil profile user yang sedang login
 */
export const getMe = async () => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua user (admin)
 */
export const getUsers = async (params = {}) => {
  try {
    const res = await api.get('/users', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil detail user berdasarkan ID
 */
export const getUserById = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update profile user
 */
export const updateUser = async (userId, payload) => {
  if (!userId || !payload) {
    throw new Error('User ID and payload are required');
  }

  try {
    const res = await api.put(`/users/${userId}`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus user (admin)
 */
export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
