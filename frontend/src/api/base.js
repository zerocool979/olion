import axios from 'axios';

/**
 * =====================================================
 * Axios Base Instance
 * -----------------------------------------------------
 * - SINGLE source of truth for API communication
 * - Digunakan oleh AuthContext & seluruh API
 * =====================================================
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // JWT via Authorization header
});

/**
 * -----------------------------------------------------
 * Request Interceptor
 * - Inject JWT token if exists
 * -----------------------------------------------------
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -----------------------------------------------------
 * Response Interceptor
 * - Normalize error message
 * - Preserve backend message
 * -----------------------------------------------------
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);

export default api;
