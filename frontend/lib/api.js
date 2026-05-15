import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
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
        localStorage.removeItem('token')
        // ─── FIX: gunakan Next.js router-friendly redirect
        // Tidak bisa pakai useRouter di sini (bukan komponen),
        // tapi window.location tetap diperlukan untuk reset state penuh.
        // Untuk SPA yang lebih clean, emit custom event dan handle di _app.js:
        // window.dispatchEvent(new Event('auth:logout'))
        // Untuk sekarang, hard redirect adalah solusi yang acceptable:
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

