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

/**
 * Ajukan diri sebagai pakar
 */
export const applyForPakar = async (data) => {
  try {
    const res = await api.post('/users/apply-pakar', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil statistik dashboard user
 */
export const getUserDashboardStats = async () => {
  try {
    const res = await api.get('/users/dashboard-stats');
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil notifikasi user
 */
export const getUserNotifications = async (params = {}) => {
  try {
    const res = await api.get('/notifications', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error('Notification ID is required');
  }

  try {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's reputation history
 */
export const getUserReputationHistory = async (params = {}) => {
  try {
    const res = await api.get('/reputation/history', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's bookmarked discussions
 */
export const getUserBookmarks = async (params = {}) => {
  try {
    const res = await api.get('/bookmarks', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};
