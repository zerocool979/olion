/**
 * frontend/lib/timeAgo.js
 * ────────────────────────
 * SSR-safe relative time formatter.
 * Falls back to absolute date on server to avoid hydration mismatch.
 */

const MINUTE = 60
const HOUR   = 3600
const DAY    = 86400
const WEEK   = 604800
const MONTH  = 2592000

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date)) return '—'

  // Return absolute date if running on server to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 10)     return 'baru saja'
  if (diff < MINUTE) return `${diff} detik lalu`
  if (diff < HOUR)   return `${Math.floor(diff / MINUTE)} menit lalu`
  if (diff < DAY)    return `${Math.floor(diff / HOUR)} jam lalu`
  if (diff < WEEK)   return `${Math.floor(diff / DAY)} hari lalu`
  if (diff < MONTH)  return `${Math.floor(diff / WEEK)} minggu lalu`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function fullDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date)) return '—'
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}



