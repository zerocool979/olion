import api from './base';

/**
 * =====================================================
 * Report API
 * -----------------------------------------------------
 * Semua komunikasi terkait pelaporan konten
 * =====================================================
 */

/**
 * Buat laporan baru
 * @param {Object} payload
 * @param {'discussion'|'answer'|'comment'} payload.type
 * @param {number} payload.targetId
 * @param {string} payload.reason
 */
export const createReport = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post('/reports', payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil semua laporan (admin/moderator)
 */
export const getReports = async (params = {}) => {
  try {
    const res = await api.get('/reports', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil detail laporan
 */
export const getReportById = async (reportId) => {
  if (!reportId) {
    throw new Error('Report ID is required');
  }

  try {
    const res = await api.get(`/reports/${reportId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update status laporan (admin/moderator)
 */
export const updateReportStatus = async (
  reportId,
  payload
) => {
  if (!reportId || !payload) {
    throw new Error('Report ID and payload are required');
  }

  try {
    const res = await api.patch(
      `/reports/${reportId}`,
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
