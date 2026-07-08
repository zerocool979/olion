import { jwtDecode } from 'jwt-decode'

export function getUser() {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      return null
    }
    return decoded
  } catch (err) {
    console.error('Invalid token', err)
    localStorage.removeItem('token')
    return null
  }
}

export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

export function isTokenValid() {
  const user = getUser()
  return user !== null
}




