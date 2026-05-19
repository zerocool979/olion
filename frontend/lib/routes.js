/**
 * frontend/lib/routes.js
 * ══════════════════════
 * Centralized route configuration for OLION.
 * Single source of truth — import from here, never hardcode paths.
 *
 * Usage:
 *   import { ROUTES, roleHome, navLinks } from '../lib/routes'
 *   router.push(ROUTES.guest.search)
 *   router.push(roleHome('ADMIN'))
 */

// ─────────────────────────────────────────────────────────────────────────────
// Route map
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTES = {

  // ── Public / guest ─────────────────────────────────────────────────────────
  guest: {
    home:         '/guest',
    search:       '/search',
    categories:   '/categories',
    leaderboard:  '/leaderboard',
    trending:     '/trending',
    discussion:   (id) => `/discussion/${id}`,
    login:        '/guest/login',
    register:     '/guest/register',
  },

  // ── Authenticated user ─────────────────────────────────────────────────────
  user: {
    dashboard:    '/user/dashboard',
    logout:       '/user/logout',
    profile:      '/user/profile',
    notifications:'/user/notifications',
    bookmarks:    '/user/bookmarks',
    create:       '/user/create',
    settings:     '/user/settings',
    discussion:   (id) => `/user/discussions/${id}`,
  },

  // ── Expert ─────────────────────────────────────────────────────────────────
  expert: {
    dashboard:    '/expert/dashboard',
    answers:      '/expert/answers',
    profile:      '/user/profile',
    notifications:'/user/notifications',
    create:       '/user/create',
  },

  // ── Moderator ──────────────────────────────────────────────────────────────
  moderator: {
    dashboard:    '/moderator/dashboard',
    reports:      '/moderator/reports',
    flagged:      '/moderator/flagged',
    warnings:     '/moderator/warnings',
    notifications:'/user/notifications',
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  admin: {
    dashboard:    '/admin/dashboard',
    users:        '/admin/users',
    roles:        '/admin/roles',
    categories:   '/admin/categories',
    analytics:    '/admin/analytics',
    reports:      '/admin/reports',
  },

  // ── Shared (works for all logged-in users) ─────────────────────────────────
  shared: {
    dashboard:    '/dashboard',    // redirect hub
    logout:       '/logout',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Role → home route
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the landing dashboard path for a given role string.
 * @param {string} role — 'ADMIN' | 'MODERATOR' | 'EXPERT' | 'USER' | null
 * @returns {string} Next.js route path
 */
export function roleHome(role) {
  switch (role?.toUpperCase()) {
    case 'ADMIN':     return ROUTES.admin.dashboard
    case 'MODERATOR': return ROUTES.moderator.dashboard
    case 'EXPERT':    return ROUTES.expert.dashboard
    default:          return ROUTES.user.dashboard
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation link definitions per role
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the primary nav links for the current auth state.
 * Each item: { label, href, icon?, badge? }
 *
 * @param {'GUEST'|'USER'|'EXPERT'|'MODERATOR'|'ADMIN'} role
 * @returns {Array<{label:string, href:string, icon?:string, badge?:string}>}
 */
export function navLinks(role) {
  switch (role?.toUpperCase()) {

    case 'ADMIN':
      return [
        { label: 'Dashboard',   href: ROUTES.admin.dashboard   },
        { label: 'Pengguna',    href: ROUTES.admin.users        },
        { label: 'Laporan',     href: ROUTES.admin.reports      },
        { label: 'Kategori',    href: ROUTES.admin.categories   },
        { label: 'Analitik',    href: ROUTES.admin.analytics    },
      ]

    case 'MODERATOR':
      return [
        { label: 'Dashboard',   href: ROUTES.moderator.dashboard   },
        { label: 'Laporan',     href: ROUTES.moderator.reports      },
        { label: 'Terlapor',    href: ROUTES.moderator.flagged      },
        { label: 'Peringatan',  href: ROUTES.moderator.warnings     },
        { label: 'Notifikasi',  href: ROUTES.user.notifications     },
      ]

    case 'EXPERT':
      return [
        { label: 'Dashboard',   href: ROUTES.expert.dashboard   },
        { label: 'Jawaban',     href: ROUTES.expert.answers     },
        { label: 'Buat',        href: ROUTES.user.create        },
        { label: 'Notifikasi',  href: ROUTES.user.notifications },
      ]

    case 'USER':
      return [
        { label: 'Dashboard',   href: ROUTES.user.dashboard     },
        { label: 'Buat Diskusi',href: ROUTES.user.create        },
        { label: 'Notifikasi',  href: ROUTES.user.notifications },
        { label: 'Bookmark',    href: ROUTES.user.bookmarks     },
      ]

    // GUEST / unauthenticated
    default:
      return [
        { label: 'Cari',        href: ROUTES.guest.search      },
        { label: 'Trending',    href: ROUTES.guest.trending     },
        { label: 'Kategori',    href: ROUTES.guest.categories   },
        { label: 'Leaderboard', href: ROUTES.guest.leaderboard  },
      ]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Role metadata (colors, labels, badge classes)
// ─────────────────────────────────────────────────────────────────────────────

export const ROLE_META = {
  ADMIN: {
    label:       'Admin',
    badgeClass:  'badge badge-admin',
    avatarColor: '#a78bfa',
    initial:     'A',
  },
  MODERATOR: {
    label:       'Moderator',
    badgeClass:  'badge badge-moderator',
    avatarColor: '#fb923c',
    initial:     'M',
  },
  EXPERT: {
    label:       'Expert',
    badgeClass:  'badge badge-expert',
    avatarColor: '#4ade80',
    initial:     'E',
  },
  USER: {
    label:       'User',
    badgeClass:  'badge',
    avatarColor: '#94a3b8',
    initial:     'U',
  },
  GUEST: {
    label:       'Guest',
    badgeClass:  'badge',
    avatarColor: '#596570',
    initial:     'G',
  },
}

/**
 * Resolve role metadata safely.
 * @param {string|null} role
 */
export function roleMeta(role) {
  return ROLE_META[role?.toUpperCase()] ?? ROLE_META.USER
}
