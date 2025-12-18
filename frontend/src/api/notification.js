import api from './base';

/**
 * =====================================================
 * Notification API
 * -----------------------------------------------------
 * Semua komunikasi terkait notifikasi
 * =====================================================
 */

/**
 * Ambil semua notifikasi user
 */
export const getNotifications = async (params = {}) => {
  try {
    const res = await api.get('/notifications', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tandai notifikasi sebagai dibaca
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error('Notification ID is required');
  }

  try {
    const res = await api.patch(
      `/notifications/${notificationId}/read`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tandai semua notifikasi sebagai dibaca
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  } catch (error) {
    throw error;
  }
};
