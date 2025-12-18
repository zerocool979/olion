import api from './base';

/**
 * =====================================================
 * Pakar API
 * -----------------------------------------------------
 * Semua komunikasi terkait role Pakar
 * =====================================================
 */

/**
 * Ambil daftar pakar
 */
export const getPakars = async (params = {}) => {
  try {
    const res = await api.get('/pakars', { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ambil detail pakar berdasarkan ID
 */
export const getPakarById = async (pakarId) => {
  if (!pakarId) {
    throw new Error('Pakar ID is required');
  }

  try {
    const res = await api.get(`/pakars/${pakarId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ajukan diri sebagai pakar
 */
export const applyAsPakar = async (payload) => {
  if (!payload) {
    throw new Error('Payload is required');
  }

  try {
    const res = await api.post('/pakars/apply', payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Approve pakar (admin/moderator)
 */
export const approvePakar = async (pakarId) => {
  if (!pakarId) {
    throw new Error('Pakar ID is required');
  }

  try {
    const res = await api.patch(
      `/pakars/${pakarId}/approve`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke status pakar (admin/moderator)
 */
export const revokePakar = async (pakarId) => {
  if (!pakarId) {
    throw new Error('Pakar ID is required');
  }

  try {
    const res = await api.patch(
      `/pakars/${pakarId}/revoke`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
