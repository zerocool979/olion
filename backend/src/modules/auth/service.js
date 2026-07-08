const prisma = require('../../config/prisma')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../../utils/jwt')

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
      bio: true
    }
  }
}

module.exports = {
  register: async (email, password) => {
    // ─── FIX: cek email duplikat dengan pesan yang ramah
    const existingUser = await prisma.user.findUnique({ where: { email } })
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
            bio: true
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
      select: SAFE_USER_SELECT
    })

    if (!user) {
      const err = new Error('User tidak ditemukan')
      err.statusCode = 404
      throw err
    }

    return user
  },

  // ─── ADDED: GET /users/by-username/:username — public profile lookup
  // username hidup di Profile, bukan User — query lewat relasi.
  // Reputasi dihitung dari agregat ReputationLog, bukan field langsung.
  getByUsername: async (username) => {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        bio: true,
        user: {
          select: {
            id: true,
            role: true,
            isVerifiedExpert: true,
            createdAt: true,
            _count: {
              select: { discussions: true, votes: true }
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

    return {
      id: profile.user.id,
      username,
      bio: profile.bio,
      role: profile.user.role,
      isVerifiedExpert: profile.user.isVerifiedExpert,
      createdAt: profile.user.createdAt,
      reputation: repAgg._sum.point ?? 0,
      _count: profile.user._count,
    }
  },

  // ─── ADDED: PATCH /auth/password
  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      const err = new Error('User tidak ditemukan')
      err.statusCode = 404
      throw err
    }

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) {
      const err = new Error('Password lama salah')
      err.statusCode = 401
      throw err
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed }
    })
  }
}



