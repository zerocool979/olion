import { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../lib/api'

// Polling ringan untuk badge notifikasi di nav — dipakai NavLinks & NavUserMenu.
// Tidak pakai websocket karena backend belum menyediakan channel realtime untuk ini.
export function useUnreadNotifications() {
  const { token } = useContext(AuthContext)
  const [count, setCount] = useState(0)

  const refresh = useCallback(() => {
    if (!token) return
    api.get('/notifications/unread-count')
      .then(r => setCount(r.data?.count ?? 0))
      .catch(() => {})
  }, [token])

  useEffect(() => {
    if (!token) {
      setCount(0)
      return
    }
    refresh()
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [token, refresh])

  return count
}
