import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

export const AuthContext = createContext()

// ─── Helper untuk decode JWT payload di client (tanpa verifikasi signature)
// Hanya untuk membaca data UI (username, role) — BUKAN untuk authorization
const decodeTokenPayload = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    const decoded = JSON.parse(atob(base64Payload))
    // Cek expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null
    return decoded
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null)
  const [user, setUser] = useState(null)
  // ─── loading: true = masih inisialisasi dari localStorage
  const [loading, setLoading] = useState(true)

  // ─── FIX: validasi token ke server via /auth/me untuk hydrasi user yang akurat
  const hydrateUser = useCallback(async (storedToken) => {
    try {
      // Set token dulu agar interceptor bisa attach ke header
      setTokenState(storedToken)
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch {
      // Token invalid/expired — clear semua
      localStorage.removeItem('token')
      setTokenState(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setLoading(false)
      return
    }

    // ─── FIX: quick client-side check dulu sebelum hit server
    const payload = decodeTokenPayload(storedToken)
    if (!payload) {
      // Token expired atau invalid, hapus tanpa hit server
      localStorage.removeItem('token')
      setLoading(false)
      return
    }

    // Token masih valid di client, validasi ke server
    hydrateUser(storedToken)
  }, [hydrateUser])

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken)
    setTokenState(newToken)
    // ─── FIX: user data langsung dari response login, tidak perlu decode JWT
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setTokenState(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
