import axios from 'axios'

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/guest/login' && currentPath !== '/guest/register') {
          localStorage.removeItem('token')
          window.location.href = '/guest/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api



