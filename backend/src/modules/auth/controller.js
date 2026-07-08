const authService = require('./service')

// ─── Minimal inline validator (tanpa library tambahan)
// Untuk production, ganti dengan Zod: npm install zod
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body

      // ─── FIX: validasi di backend, jangan percaya frontend saja
      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' })
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Format email tidak valid' })
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password minimal 6 karakter' })
      }

      // ─── FIX: hapus username dari parameter — di-generate otomatis di service
      const result = await authService.register(email, password)

      // ─── FIX: response dengan status 201 untuk resource creation
      return res.status(201).json({
        message: 'Registrasi berhasil',
        user: result.user,
        token: result.token
      })
    } catch (err) {
      next(err)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' })
      }

      const result = await authService.login(email, password)

      return res.status(200).json({
        message: 'Login berhasil',
        user: result.user,
        token: result.token
      })
    } catch (err) {
      next(err)
    }
  },

  // ─── ADDED: /auth/me untuk server-side token validation
  me: async (req, res, next) => {
    try {
      // req.user di-set oleh auth middleware
      const user = await authService.getMe(req.userId)
      return res.status(200).json({ user })
    } catch (err) {
      next(err)
    }
  },

  // ─── ADDED: GET /users/by-username/:username
  // FIX: sebelumnya selalu return status 200 bahkan saat user tidak ditemukan,
  // sehingga frontend ([username].jsx) gagal mendeteksi NotFound (objek
  // {message:...} dianggap truthy). Sekarang return 404 yang benar.
  getByUsername: async (req, res, next) => {
    try {
      const { username } = req.params
      const user = await authService.getByUsername(username)
      if (!user) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
      }
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },

  // ─── ADDED: PATCH /auth/password
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Password lama dan baru harus diisi' })
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password baru minimal 6 karakter' })
      }

      await authService.changePassword(req.userId, oldPassword, newPassword)
      return res.status(200).json({ message: 'Password berhasil diubah' })
    } catch (err) {
      next(err)
    }
  }
}




