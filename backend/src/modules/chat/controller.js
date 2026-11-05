'use strict'
const prisma = require('../../config/prisma')
const multer = require('multer')
const { cloudinary, isConfigured: cloudinaryConfigured } = require('../../config/cloudinary')
const { CLOUDINARY_CLOUD_NAME, TURN_URL, TURN_USERNAME, TURN_CREDENTIAL } = require('../../config/env')

const PARTICIPANT_SELECT = {
  user: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } },
}

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024
const MAX_MESSAGE_LENGTH = 5000
const MAX_ATTACHMENT_NAME_LENGTH = 255
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1, fields: 10 },
})

function hasValidFileSignature(file) {
  const buffer = file?.buffer
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return false

  switch (file.mimetype) {
    case 'image/jpeg':
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    case 'image/png':
      return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    case 'image/webp':
      return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
    case 'image/gif':
      return buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))
    case 'application/pdf':
      return buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-'
    case 'text/plain': {
      // Reject binary/control-byte payloads masquerading as plain text.
      if (buffer.includes(0)) return false
      const decoded = buffer.toString('utf8')
      return Buffer.from(decoded, 'utf8').equals(buffer)
    }
    default:
      return false
  }
}

function isTrustedCloudinaryUrl(rawUrl, resourceType) {
  if (typeof rawUrl !== 'string' || !CLOUDINARY_CLOUD_NAME) return false
  try {
    const url = new URL(rawUrl)
    const prefix = `/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/`
    return url.protocol === 'https:' &&
      url.hostname === 'res.cloudinary.com' &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname.startsWith(prefix)
  } catch {
    return false
  }
}

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'olion/chat' },
      (err, result) => (err ? reject(err) : resolve(result))
    )
    stream.end(buffer)
  })
}

function getSafeAttachmentName(value) {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return cleaned ? cleaned.slice(0, MAX_ATTACHMENT_NAME_LENGTH) : null
}

module.exports = {
  uploadMiddleware: (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        err.statusCode = 400
        if (err.code === 'LIMIT_FILE_SIZE') err.message = 'Ukuran file maksimal 15MB'
        if (err.code === 'LIMIT_FILE_COUNT') err.message = 'Hanya satu file yang dapat diupload'
        return next(err)
      }
      next()
    })
  },

  // POST /chat/upload — only supported raster images, PDF, and plain text.
  uploadAttachment: async (req, res, next) => {
    try {
      if (!cloudinaryConfigured) {
        return res.status(503).json({ message: 'Fitur kirim foto/file belum dikonfigurasi di server.' })
      }
      if (!req.file) return res.status(400).json({ message: 'File wajib diupload (field "file")' })
      if (!ALLOWED_UPLOAD_MIME_TYPES.has(req.file.mimetype) || !hasValidFileSignature(req.file)) {
        return res.status(415).json({ message: 'Format file tidak didukung atau isi file tidak sesuai tipe yang diklaim.' })
      }

      const isImage = req.file.mimetype.startsWith('image/')
      const resourceType = isImage ? 'image' : 'raw'
      const result = await uploadBufferToCloudinary(req.file.buffer, resourceType)
      if (!result?.secure_url || !isTrustedCloudinaryUrl(result.secure_url, resourceType)) {
        return res.status(502).json({ message: 'Penyimpanan file mengembalikan URL yang tidak valid.' })
      }

      res.status(201).json({
        url: result.secure_url,
        type: isImage ? 'image' : 'file',
        name: getSafeAttachmentName(req.file.originalname),
      })
    } catch (err) { next(err) }
  },

  getIceServers: (req, res) => {
    const iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
    ]
    if (TURN_URL && TURN_USERNAME && TURN_CREDENTIAL) {
      iceServers.push({ urls: TURN_URL, username: TURN_USERNAME, credential: TURN_CREDENTIAL })
    }
    res.json({ iceServers, turnConfigured: !!(TURN_URL && TURN_USERNAME && TURN_CREDENTIAL) })
  },

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

  startConversation: async (req, res, next) => {
    try {
      const { userId: otherId } = req.body || {}
      if (!otherId) return res.status(400).json({ message: 'userId harus diisi' })
      if (otherId === req.userId) return res.status(400).json({ message: 'Tidak bisa chat dengan diri sendiri' })

      const otherExists = await prisma.user.findUnique({ where: { id: otherId }, select: { id: true } })
      if (!otherExists) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })

      const pairKey = [req.userId, otherId].sort().join(':')
      const conversation = await prisma.conversation.upsert({
        where: { pairKey },
        update: {},
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

  listMessages: async (req, res, next) => {
    try {
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: req.params.id, userId: req.userId } },
      })
      if (!participant) return res.status(403).json({ message: 'Bukan bagian dari percakapan ini' })

      // Bound response size and return the most recent messages in chronological order.
      const messages = await prisma.message.findMany({
        where: { conversationId: req.params.id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 100,
        include: { sender: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } } },
      })

      return res.status(200).json({ data: messages.reverse() })
    } catch (err) {
      next(err)
    }
  },

  sendMessage: async (req, res, next) => {
    try {
      const { content, attachmentUrl, attachmentType, attachmentName } = req.body || {}
      if (content !== undefined && typeof content !== 'string') {
        return res.status(400).json({ message: 'Konten pesan harus berupa teks' })
      }
      if (attachmentUrl !== undefined && typeof attachmentUrl !== 'string') {
        return res.status(400).json({ message: 'URL lampiran tidak valid' })
      }

      const trimmedContent = typeof content === 'string' ? content.trim() : null
      if (trimmedContent && trimmedContent.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ message: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter` })
      }

      if (!trimmedContent && !attachmentUrl) {
        return res.status(400).json({ message: 'Pesan tidak boleh kosong' })
      }
      if (attachmentUrl) {
        if (!['image', 'file'].includes(attachmentType)) {
          return res.status(400).json({ message: 'attachmentType harus "image" atau "file"' })
        }
        const resourceType = attachmentType === 'image' ? 'image' : 'raw'
        if (!isTrustedCloudinaryUrl(attachmentUrl, resourceType)) {
          return res.status(400).json({ message: 'Lampiran harus berasal dari penyimpanan Cloudinary OLION yang valid.' })
        }
        if (attachmentName !== undefined && typeof attachmentName !== 'string') {
          return res.status(400).json({ message: 'Nama lampiran tidak valid' })
        }
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
          attachmentName: attachmentUrl ? getSafeAttachmentName(attachmentName) : null,
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
