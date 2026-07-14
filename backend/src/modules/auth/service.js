const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const { generateToken } = require('../../utils/jwt')
const { GOOGLE_CLIENT_ID } = require('../../config/env')

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null

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
    // ─── FIX: cek email duplikat dengan pesan yang ramah
    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
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
        email,
        password: hashedPassword,
        profile: {
          create: { username }
        }
      },
      select: SAFE_USER_SELECT  // ─── FIX: tidak return password
    })

    const token = generateToken(user.id)
    return { user, token }
  },

  login: async (email, password) => {
    // ─── FIX: query dengan select minimal, ambil password hanya untuk compare
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,  // perlu untuk bcrypt compare
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

    // ─── FIX: buang password dari object sebelum return
    const { password: _removed, ...safeUser } = user

    const token = generateToken(user.id)
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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, password: true } })
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
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    })
  },

  // ─── ADDED: POST /auth/google  { idToken }
  // Login/register via Google Identity Services. Alur:
  //  1. Verifikasi idToken ke server Google (memastikan token asli & untuk app ini)
  //  2. Jika googleId sudah tertaut ke user → login user itu
  //  3. Jika belum, tapi email sudah terdaftar (akun password) → tautkan googleId
  //     ke akun yang sudah ada (supaya orang tidak punya 2 akun dengan email sama)
  //  4. Jika email juga belum ada → buat akun baru tanpa password
  loginWithGoogle: async (idToken) => {
    if (!googleClient) {
      const err = new Error('Login Google belum dikonfigurasi di server (GOOGLE_CLIENT_ID kosong).')
      err.statusCode = 503
      throw err
    }
    if (!idToken) {
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

    if (!payload?.email) {
      const err = new Error('Google tidak mengembalikan email untuk akun ini')
      err.statusCode = 400
      throw err
    }
    if (payload.email_verified === false) {
      const err = new Error('Email Google kamu belum terverifikasi')
      err.statusCode = 400
      throw err
    }

    const googleId = payload.sub
    const email = payload.email

    // 1) Sudah pernah login Google sebelumnya di akun ini
    let user = await prisma.user.findUnique({ where: { googleId }, select: SAFE_USER_SELECT })

    if (!user) {
      // 2) Email sudah terdaftar (mungkin dari signup password) → tautkan
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        user = await prisma.user.update({
          where: { id: existing.id },
          data: { googleId },
          select: SAFE_USER_SELECT,
        })
      } else {
        // 3) Akun baru — generate username pseudonim seperti registrasi biasa,
        // supaya konsisten dengan identitas anonim platform ini.
        let username
        let attempts = 0
        while (attempts < 5) {
          const candidate = generatePseudonym()
          const exists = await prisma.profile.findUnique({ where: { username: candidate } })
          if (!exists) { username = candidate; break }
          attempts++
        }
        if (!username) throw new Error('Gagal generate username, silakan coba lagi')

        user = await prisma.user.create({
          data: {
            email,
            googleId,
            password: null,
            profile: { create: { username } },
          },
          select: SAFE_USER_SELECT,
        })
      }
    }

    const token = generateToken(user.id)
    return { user, token }
  },
}



