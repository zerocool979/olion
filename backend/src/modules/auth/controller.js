const authService = require('./service')

// ─── Minimal inline validator (tanpa library tambahan)
// Untuk production, ganti dengan Zod: npm install zod
const validateEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const PASSWORD_MIN_LENGTH = 12
const PASSWORD_MAX_BYTES = 72
const validateNewPassword = (password) =>
  typeof password === 'string' &&
  Array.from(password).length >= PASSWORD_MIN_LENGTH &&
  Buffer.byteLength(password, 'utf8') <= PASSWORD_MAX_BYTES

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body || {}

      // ─── FIX: validasi di backend, jangan percaya frontend saja
      if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' })
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Format email tidak valid' })
      }

      if (!validateNewPassword(password)) {
        return res.status(400).json({
          message: `Password baru minimal ${PASSWORD_MIN_LENGTH} karakter dan maksimal ${PASSWORD_MAX_BYTES} byte UTF-8.`
        })
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
      const { email, password } = req.body || {}

      if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
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

  // ─── POST /auth/google  { idToken }
  google: async (req, res, next) => {
    try {
      const { idToken, credential } = req.body || {}
      // Google Identity Services mengirim field "credential" pada onSuccess
      // callback; terima juga "idToken" untuk fleksibilitas nama field.
      const token = idToken || credential
      if (!token) {
        return res.status(400).json({ message: 'idToken harus diisi' })
      }

      const result = await authService.loginWithGoogle(token)

      return res.status(200).json({
        message: 'Login Google berhasil',
        user: result.user,
        token: result.token
      })
    } catch (err) {
      next(err)
    }
  },

  // Link a verified Google identity to the currently authenticated account.
  linkGoogle: async (req, res, next) => {
    try {
      const { idToken, credential } = req.body || {}
      const token = idToken || credential
      if (typeof token !== 'string' || !token.trim()) {
        return res.status(400).json({ message: 'idToken harus diisi' })
      }

      const result = await authService.linkGoogle(req.userId, token)
      return res.status(200).json({
        message: 'Akun Google berhasil dihubungkan.',
        user: result.user,
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
      const user = await authService.getByUsername(username, req.userId)
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
      const { oldPassword, newPassword } = req.body || {}
      if (!newPassword) {
        return res.status(400).json({ message: 'Password baru harus diisi' })
      }
      if (!validateNewPassword(newPassword)) {
        return res.status(400).json({
          message: `Password baru minimal ${PASSWORD_MIN_LENGTH} karakter dan maksimal ${PASSWORD_MAX_BYTES} byte UTF-8.`
        })
      }

      // oldPassword hanya wajib kalau akun ini SUDAH punya password.
      // Akun Google-only boleh set password pertama kali tanpa oldPassword —
      // authService.changePassword yang menentukan mana yang berlaku.
      await authService.changePassword(req.userId, oldPassword, newPassword)
      return res.status(200).json({ message: 'Password berhasil disimpan' })
    } catch (err) {
      next(err)
    }
  }
}




