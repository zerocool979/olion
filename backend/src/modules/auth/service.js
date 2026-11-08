const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const { generateToken } = require('../../utils/jwt')
const { GOOGLE_CLIENT_ID, REQUIRE_EMAIL_VERIFICATION } = require('../../config/env')
const authTokens = require('./tokenService')
const { resolveGoogleLogin } = require('./googlePolicy')

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

const normalizeEmail = (email) => email.trim().toLowerCase()

async function verifyGoogleCredential(idToken) {
  if (!googleClient) {
    const err = new Error('Login Google belum dikonfigurasi di server (GOOGLE_CLIENT_ID kosong).')
    err.statusCode = 503
    throw err
  }
  if (typeof idToken !== 'string' || !idToken.trim()) {
    const err = new Error('idToken harus diisi')
    err.statusCode = 400
    throw err
  }

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })
    payload = ticket.getPayload()
  } catch {
    const err = new Error('Token Google tidak valid atau sudah kedaluwarsa')
    err.statusCode = 401
    throw err
  }

  if (!payload?.sub || typeof payload.email !== 'string' || !payload.email.trim()) {
    const err = new Error('Google tidak mengembalikan identitas akun yang lengkap')
    err.statusCode = 401
    throw err
  }
  // Do not trust an unverified Google email as proof of ownership.
  if (payload.email_verified !== true) {
    const err = new Error('Email Google harus terverifikasi sebelum digunakan.')
    err.statusCode = 403
    throw err
  }

  return { ...payload, email: normalizeEmail(payload.email) }
}

// ─── Pseudonym generator untuk anonymous username
// Format: adjective + noun + random number (e.g. "SwiftFalcon#4821")
const ADJECTIVES = [
  'Swift', 'Silent', 'Bright', 'Dark', 'Calm', 'Bold', 'Sharp', 'Clear',
  'Wise', 'Keen', 'Free', 'Deep', 'Fierce', 'Noble', 'Brave', 'Vivid',
  'Serene', 'Rapid', 'Lunar', 'Solar', 'Velvet', 'Iron', 'Cosmic', 'Hollow'
]

const NOUNS = [
  'Falcon', 'River', 'Stone', 'Echo', 'Flame', 'Shadow', 'Tide', 'Wind',
  'Forest', 'Peak', 'Cloud', 'Spark', 'Dawn', 'Dusk', 'Crater', 'Prism',
  'Orbit', 'Cipher', 'Veil', 'Axiom', 'Nexus', 'Forge', 'Drift', 'Pulse'
]

const generatePseudonym = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${adj}${noun}${num}`
}

// ─── Safe user select — TIDAK PERNAH return password
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  role: true,
  isVerifiedExpert: true,
  createdAt: true,
  profile: {
    select: {
      username: true,
      bio: true,
      avatarUrl: true,
      avatarBorder: true
    }
  }
}

module.exports = {
  register: async (email, password) => {
    const normalizedEmail = normalizeEmail(email)
    if (REQUIRE_EMAIL_VERIFICATION && !authTokens.isConfigured()) {
      const err = new Error('Verifikasi email diwajibkan, tetapi SMTP belum dikonfigurasi.')
      err.statusCode = 503
      throw err
    }
    // Prevent duplicate accounts that differ only by email letter casing.
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: { id: true },
    })
    if (existingUser) {
      const err = new Error('Email sudah terdaftar')
      err.statusCode = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, 12) // ← FIX: 12 rounds lebih aman dari 10

    // ─── FIX: generate username unik, retry jika collision (sangat jarang)
    let username
    let attempts = 0
    while (attempts < 5) {
      const candidate = generatePseudonym()
      const exists = await prisma.profile.findUnique({ where: { username: candidate } })
      if (!exists) {
        username = candidate
        break
      }
      attempts++
    }

    if (!username) {
      throw new Error('Gagal generate username, silakan coba lagi')
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        profile: {
          create: { username }
        }
      },
      select: SAFE_USER_SELECT  // ─── FIX: tidak return password
    })

    if (REQUIRE_EMAIL_VERIFICATION) {
      let emailSent = false
      try {
        await authTokens.issueVerification(user.id, normalizedEmail)
        emailSent = true
      } catch (err) {
        console.error('[auth] initial verification email delivery failed:', err.code || err.message)
      }
      return { user, token: null, verificationRequired: true, emailSent }
    }

    const token = generateToken(user.id, 0)
    return { user, token, verificationRequired: false }
  },

  login: async (email, password) => {
    // ─── FIX: query dengan select minimal, ambil password hanya untuk compare
    const normalizedEmail = normalizeEmail(email)
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: {
        id: true,
        email: true,
        password: true,  // perlu untuk bcrypt compare
        emailVerifiedAt: true,
        tokenVersion: true,
        role: true,
        isVerifiedExpert: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            bio: true,
            avatarUrl: true,
            avatarBorder: true
          }
        }
      }
    })

    // ─── FIX: pesan error yang SAMA untuk user-not-found dan wrong-password
    // Ini mencegah user enumeration attack
    const GENERIC_AUTH_ERROR = 'Email atau password salah'

    if (!user) {
      // ─── FIX: tetap jalankan bcrypt compare palsu untuk mencegah timing attack
      await bcrypt.compare(password, '$2a$12$invalidhashfortimingprotection00000000000000000000000')
      const err = new Error(GENERIC_AUTH_ERROR)
      err.statusCode = 401
      throw err
    }

    if (!user.password) {
      // Akun ini dibuat/ditautkan lewat Google, tidak pernah punya password.
      await bcrypt.compare(password, '$2a$12$invalidhashfortimingprotection00000000000000000000000')
      const err = new Error('Akun ini terdaftar lewat Google. Silakan masuk dengan tombol "Masuk dengan Google".')
      err.statusCode = 401
      throw err
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      const err = new Error(GENERIC_AUTH_ERROR)
      err.statusCode = 401
      throw err
    }

    if (REQUIRE_EMAIL_VERIFICATION && !user.emailVerifiedAt) {
      const err = new Error('Email belum terverifikasi. Kirim ulang link verifikasi melalui halaman verifikasi email.')
      err.statusCode = 403
      err.code = 'EMAIL_NOT_VERIFIED'
      throw err
    }

    // Do not expose internal token/version or credential fields to the client.
    const { password: _removed, emailVerifiedAt: _emailVerifiedAt, tokenVersion: _tokenVersion, ...safeUser } = user

    const token = generateToken(user.id, user.tokenVersion ?? 0)
    return { user: safeUser, token }
  },

  // ─── ADDED: untuk /auth/me endpoint — validasi token dari server
  getMe: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...SAFE_USER_SELECT,
        password: true,
        googleId: true,
        _count: { select: { discussions: true, comments: true, votes: true, followers: true, following: true } },
      }
    })

    if (!user) {
      const err = new Error('User tidak ditemukan')
      err.statusCode = 404
      throw err
    }

    // FIX: sebelumnya /auth/me tidak pernah menghitung reputasi ataupun
    // jumlah diskusi/follower/following sama sekali — jadi AuthContext.user
    // (dipakai sidebar beranda, dsb) dan halaman /user/profile selalu
    // menampilkan 0 untuk semua angka ini, beda dari halaman profil publik
    // (/users/by-username/:username) yang sudah benar menghitungnya.
    const repAgg = await prisma.reputationLog.aggregate({
      where: { userId }, _sum: { point: true },
    })

    // FIX: jangan pernah kirim password (walau hash) atau googleId mentah ke
    // client — cukup flag boolean supaya halaman Settings tahu metode login
    // apa saja yang tersedia untuk akun ini.
    const { password, googleId, ...safeUser } = user
    return {
      ...safeUser,
      reputation: repAgg._sum.point ?? 0,
      hasPassword: !!password,
      hasGoogle: !!googleId,
    }
  },

  // ─── ADDED: GET /users/by-username/:username — public profile lookup
  // username hidup di Profile, bukan User — query lewat relasi.
  // Reputasi dihitung dari agregat ReputationLog, bukan field langsung.
  getByUsername: async (username, viewerId) => {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        bio: true,
        avatarUrl: true,
        avatarBorder: true,
        user: {
          select: {
            id: true,
            role: true,
            isVerifiedExpert: true,
            createdAt: true,
            _count: {
              select: { discussions: true, votes: true, followers: true, following: true }
            }
          }
        }
      }
    })

    if (!profile) return null

    const repAgg = await prisma.reputationLog.aggregate({
      where: { userId: profile.user.id },
      _sum: { point: true }
    })

    let isFollowed = false
    if (viewerId && viewerId !== profile.user.id) {
      const followRow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: viewerId, followingId: profile.user.id } },
        select: { id: true },
      })
      isFollowed = !!followRow
    }

    return {
      id: profile.user.id,
      username,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      avatarBorder: profile.avatarBorder,
      role: profile.user.role,
      isVerifiedExpert: profile.user.isVerifiedExpert,
      createdAt: profile.user.createdAt,
      reputation: repAgg._sum.point ?? 0,
      _count: profile.user._count,
      isFollowed,
    }
  },

  // ─── ADDED: PATCH /auth/password
  // Kalau akun belum punya password (login lewat Google saja), ini jadi
  // "Set Password" — oldPassword tidak divalidasi/diwajibkan. Kalau akun
  // sudah punya password, oldPassword WAJIB dan diverifikasi seperti biasa.
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, tokenVersion: true },
    })
    if (!user) {
      const err = new Error('User tidak ditemukan')
      err.statusCode = 404
      throw err
    }

    if (user.password) {
      if (!oldPassword) {
        const err = new Error('Password lama harus diisi')
        err.statusCode = 400
        throw err
      }
      const valid = await bcrypt.compare(oldPassword, user.password)
      if (!valid) {
        const err = new Error('Password lama salah')
        err.statusCode = 401
        throw err
      }
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, tokenVersion: { increment: 1 } },
      select: { tokenVersion: true },
    })
    // Rotate the current browser session while invalidating all other sessions.
    return generateToken(userId, updated.tokenVersion)
  },

  // Google sign-in only logs into an identity that is already linked.
  // Existing password accounts must be authenticated before linking Google.
  loginWithGoogle: async (idToken) => {
    const payload = await verifyGoogleCredential(idToken)
    const googleId = payload.sub
    const email = payload.email

    const linkedUser = await prisma.user.findUnique({
      where: { googleId },
      select: { ...SAFE_USER_SELECT, emailVerifiedAt: true, tokenVersion: true },
    })

    const existingEmailUser = linkedUser ? null : await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    })

    const resolution = resolveGoogleLogin({ linkedUser, existingEmailUser })
    if (resolution === 'REQUIRE_EXISTING_ACCOUNT_AUTH') {
      const err = new Error(
        'Email ini sudah memiliki akun OLION. Masuk dengan email dan password terlebih dahulu, lalu hubungkan Google melalui Pengaturan Akun.'
      )
      err.statusCode = 409
      throw err
    }

    if (resolution === 'LOGIN_LINKED') {
      if (!linkedUser.emailVerifiedAt) {
        await prisma.user.update({
          where: { id: linkedUser.id },
          data: { emailVerifiedAt: new Date() },
        })
      }
      const { emailVerifiedAt: _emailVerifiedAt, tokenVersion: _tokenVersion, ...safeLinkedUser } = linkedUser
      const token = generateToken(linkedUser.id, linkedUser.tokenVersion ?? 0)
      return { user: safeLinkedUser, token }
    }

    let username
    let attempts = 0
    while (attempts < 5) {
      const candidate = generatePseudonym()
      const exists = await prisma.profile.findUnique({ where: { username: candidate } })
      if (!exists) { username = candidate; break }
      attempts++
    }
    if (!username) throw new Error('Gagal generate username, silakan coba lagi')

    const user = await prisma.user.create({
      data: {
        email,
        googleId,
        password: null,
        emailVerifiedAt: new Date(),
        profile: { create: { username } },
      },
      select: { ...SAFE_USER_SELECT, tokenVersion: true },
    })

    const { tokenVersion: _tokenVersion, ...safeUser } = user
    const token = generateToken(user.id, user.tokenVersion ?? 0)
    return { user: safeUser, token }
  },

  requestEmailVerification: async (email) => {
    if (!authTokens.isConfigured()) {
      const err = new Error('Pengiriman email belum dikonfigurasi.')
      err.statusCode = 503
      throw err
    }
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizeEmail(email), mode: 'insensitive' } },
      select: { id: true, email: true, emailVerifiedAt: true },
    })
    if (!user || user.emailVerifiedAt) return
    try {
      await authTokens.issueVerification(user.id, user.email)
    } catch (err) {
      // Public response stays generic to prevent account enumeration.
      console.error('[auth] verification email delivery failed:', err.code || err.message)
    }
  },

  verifyEmail: async (rawToken) => authTokens.verifyEmail(rawToken),

  requestPasswordReset: async (email) => {
    if (!authTokens.isConfigured()) {
      const err = new Error('Pengiriman email belum dikonfigurasi.')
      err.statusCode = 503
      throw err
    }
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizeEmail(email), mode: 'insensitive' } },
      select: { id: true, email: true },
    })
    if (!user) return
    try {
      await authTokens.issuePasswordReset(user.id, user.email)
    } catch (err) {
      // Public response stays generic to prevent account enumeration.
      console.error('[auth] password reset email delivery failed:', err.code || err.message)
    }
  },

  resetPassword: async (rawToken, newPassword) => authTokens.resetPassword(rawToken, newPassword),

  // Link Google only from an authenticated OLION session. The verified
  // Google email must exactly match the email of the current OLION account.
  linkGoogle: async (userId, idToken) => {
    const payload = await verifyGoogleCredential(idToken)
    const account = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, googleId: true, emailVerifiedAt: true },
    })

    if (!account) {
      const err = new Error('Akun OLION tidak ditemukan')
      err.statusCode = 404
      throw err
    }
    if (normalizeEmail(account.email) !== payload.email) {
      const err = new Error('Email Google harus sama dengan email akun OLION yang sedang digunakan.')
      err.statusCode = 403
      throw err
    }
    if (account.googleId && account.googleId !== payload.sub) {
      const err = new Error('Akun OLION ini sudah terhubung ke akun Google lain.')
      err.statusCode = 409
      throw err
    }

    const googleOwner = await prisma.user.findUnique({
      where: { googleId: payload.sub },
      select: { id: true },
    })
    if (googleOwner && googleOwner.id !== userId) {
      const err = new Error('Akun Google tersebut sudah terhubung ke akun OLION lain.')
      err.statusCode = 409
      throw err
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { googleId: payload.sub, emailVerifiedAt: account.emailVerifiedAt || new Date() },
        select: SAFE_USER_SELECT,
      })
      return { user }
    } catch (err) {
      if (err.code === 'P2002') {
        const conflict = new Error('Akun Google tersebut sudah digunakan oleh akun OLION lain.')
        conflict.statusCode = 409
        throw conflict
      }
      throw err
    }
  },
}
