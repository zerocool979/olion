import axios from 'axios';

/**
 * =====================================================
 * Axios Base Instance
 * =====================================================
 */
/*
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});
*/

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

/**
 * =====================================================
 * REQUEST INTERCEPTOR
 * =====================================================
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =====================================================
 * RESPONSE INTERCEPTOR (FIXED)
 * =====================================================
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // ===============================
    // OLD (BUGGY)
    // ===============================
    // return Promise.reject({
    //   ...error,
    //   message,
    //   status: error.response?.status,
    // });

    // ===============================
    // FIXED & SAFE
    // ===============================
    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';

    const normalizedError = new Error(apiMessage);

    normalizedError.status = error.response?.status || 500;
    normalizedError.code = error.response?.data?.code || 'API_ERROR';
    normalizedError.raw = error.response?.data; // untuk debugging

    return Promise.reject(normalizedError);
  }
);

export default api;
