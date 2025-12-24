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
    // SEBELUM: '/pakar' ❌
    const res = await api.get('/pakars', { params }); // ✅ FIX
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
    // SEBELUM: `/pakar/${pakarId}` ❌
    const res = await api.get(`/pakars/${pakarId}`); // ✅ FIX
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
    // SEBELUM: '/pakar/apply' ❌
    const res = await api.post('/pakars/apply', payload); // ✅ FIX
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
    // SEBELUM: `/pakar/${pakarId}/approve` ❌
    const res = await api.patch(
      `/pakars/${pakarId}/approve` // ✅ FIX
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
    // SEBELUM: `/pakar/${pakarId}/revoke` ❌
    const res = await api.patch(
      `/pakars/${pakarId}/revoke` // ✅ FIX
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
