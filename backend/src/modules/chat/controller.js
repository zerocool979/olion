const prisma = require('../../config/prisma')
const multer = require('multer')
const { cloudinary, isConfigured: cloudinaryConfigured } = require('../../config/cloudinary')
const { TURN_URL, TURN_USERNAME, TURN_CREDENTIAL } = require('../../config/env')

const PARTICIPANT_SELECT = {
  user: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } },
}

// Memory storage (bukan disk) — file lewat langsung ke Cloudinary tanpa
// pernah disimpan sementara di server, jadi tidak ada masalah "hilang saat
// redeploy" atau file sisa yang perlu dibersihkan.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
})

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'olion/chat' },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })
}

module.exports = {
  // Dibungkus supaya error multer (file kepenuhan dst.) jadi 400 yang jelas,
  // bukan jatuh ke 500 generik di error handler global.
  uploadMiddleware: (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        err.statusCode = 400
        if (err.code === 'LIMIT_FILE_SIZE') err.message = 'Ukuran file maksimal 15MB'
        return next(err)
      }
      next()
    })
  },

  // POST /chat/upload — upload lampiran (foto/file) ke Cloudinary, kembalikan
  // URL-nya. Dipanggil TERPISAH sebelum kirim pesan (bukan digabung jadi satu
  // request) — lebih sederhana dan memudahkan preview sebelum benar-benar terkirim.
  uploadAttachment: async (req, res, next) => {
    try {
      if (!cloudinaryConfigured) {
        return res.status(503).json({ message: 'Fitur kirim foto/file belum dikonfigurasi di server (Cloudinary belum diisi admin).' })
      }
      if (!req.file) return res.status(400).json({ message: 'File wajib diupload (field "file")' })

      const isImage = req.file.mimetype.startsWith('image/')
      const result = await uploadBufferToCloudinary(req.file.buffer, isImage ? 'image' : 'raw')

      res.status(201).json({
        url: result.secure_url,
        type: isImage ? 'image' : 'file',
        name: req.file.originalname,
      })
    } catch (err) { next(err) }
  },

  // GET /chat/ice-servers — konfigurasi STUN/TURN untuk RTCPeerConnection di
  // frontend. Dilindungi `auth` (bukan endpoint publik) supaya kredensial
  // TURN (kuota gratis terbatas) tidak dipakai sembarang orang di luar app ini.
  getIceServers: (req, res) => {
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' }, // STUN publik Google, gratis tanpa batas
    ]
    if (TURN_URL && TURN_USERNAME && TURN_CREDENTIAL) {
      iceServers.push({ urls: TURN_URL, username: TURN_USERNAME, credential: TURN_CREDENTIAL })
    }
    res.json({ iceServers, turnConfigured: !!(TURN_URL && TURN_USERNAME && TURN_CREDENTIAL) })
  },

  // GET /chat/conversations
  listConversations: async (req, res, next) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { participants: { some: { userId: req.userId } } },
        include: {
          participants: { select: PARTICIPANT_SELECT },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
      })
      return res.status(200).json({ data: conversations })
    } catch (err) {
      next(err)
    }
  },

  // POST /chat/conversations  { userId }
  startConversation: async (req, res, next) => {
    try {
      const { userId: otherId } = req.body
      if (!otherId) return res.status(400).json({ message: 'userId harus diisi' })
      if (otherId === req.userId) return res.status(400).json({ message: 'Tidak bisa chat dengan diri sendiri' })

      const otherExists = await prisma.user.findUnique({ where: { id: otherId }, select: { id: true } })
      if (!otherExists) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })

      // FIX: sebelumnya "cek dulu baru buat" (findFirst lalu create) — antara
      // dua langkah itu ada celah race condition (dua klik "Chat" nyaris
      // bersamaan bisa lolos jadi 2 conversation berbeda untuk pasangan
      // orang yang sama). pairKey + upsert menjamin atomik di level database:
      // walau dua request datang bersamaan, cuma satu yang akan berhasil
      // "create", yang satunya otomatis dapat conversation yang sama.
      const pairKey = [req.userId, otherId].sort().join(':')

      const conversation = await prisma.conversation.upsert({
        where: { pairKey },
        update: {}, // sudah ada — tidak perlu ubah apa pun, tinggal dipakai
        create: {
          pairKey,
          participants: {
            create: [{ userId: req.userId }, { userId: otherId }],
          },
        },
        include: { participants: { select: PARTICIPANT_SELECT } },
      })

      return res.status(200).json({ conversation })
    } catch (err) {
      next(err)
    }
  },

  // GET /chat/conversations/:id/messages
  listMessages: async (req, res, next) => {
    try {
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: req.params.id, userId: req.userId } },
      })
      if (!participant) return res.status(403).json({ message: 'Bukan bagian dari percakapan ini' })

      const messages = await prisma.message.findMany({
        where: { conversationId: req.params.id },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } } },
      })

      return res.status(200).json({ data: messages })
    } catch (err) {
      next(err)
    }
  },

  // POST /chat/conversations/:id/messages  { content?, attachmentUrl?, attachmentType?, attachmentName? }
  sendMessage: async (req, res, next) => {
    try {
      const { content, attachmentUrl, attachmentType, attachmentName } = req.body
      const trimmedContent = content?.trim() || null

      // Pesan valid kalau ADA teks ATAU ADA lampiran (tidak wajib dua-duanya)
      if (!trimmedContent && !attachmentUrl) {
        return res.status(400).json({ message: 'Pesan tidak boleh kosong' })
      }
      if (attachmentUrl && !['image', 'file'].includes(attachmentType)) {
        return res.status(400).json({ message: 'attachmentType harus "image" atau "file"' })
      }

      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: req.params.id, userId: req.userId } },
      })
      if (!participant) return res.status(403).json({ message: 'Bukan bagian dari percakapan ini' })

      const message = await prisma.message.create({
        data: {
          content: trimmedContent,
          attachmentUrl: attachmentUrl || null,
          attachmentType: attachmentUrl ? attachmentType : null,
          attachmentName: attachmentUrl ? (attachmentName || null) : null,
          conversationId: req.params.id,
          senderId: req.userId,
        },
        include: { sender: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } } },
      })

      await prisma.conversation.update({
        where: { id: req.params.id },
        data: { updatedAt: new Date() },
      })

      return res.status(201).json({ message })
    } catch (err) {
      next(err)
    }
  },
}



