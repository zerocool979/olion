import api from './base';

/**
 * =====================================================
 * Notification API
 * =====================================================
 */

export const getNotifications = async (params = {}) => {
  try {
    const res = await api.get('/notifications', { params });

    // FIX: backend pakai { success, data }
    return res.data?.data || [];
  } catch (error) {
    throw error;
  }
};

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

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  } catch (error) {
    throw error;
  }
};
