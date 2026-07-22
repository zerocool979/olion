'use strict'
const { Server } = require('socket.io')
const { verifyToken } = require('../utils/jwt')
const prisma = require('../config/prisma')
const { NODE_ENV } = require('../config/env')

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000']

// userId -> Set<socket.id>  (satu user bisa buka beberapa tab/device sekaligus)
const onlineSockets = new Map()
// userId -> userId lawan bicara saat ini (dipakai supaya tahu siapa yang harus
// diberi tahu kalau salah satu pihak disconnect mendadak di tengah panggilan)
const activeCallPartner = new Map()

function addSocket(userId, socketId) {
  if (!onlineSockets.has(userId)) onlineSockets.set(userId, new Set())
  onlineSockets.get(userId).add(socketId)
}
function removeSocket(userId, socketId) {
  const set = onlineSockets.get(userId)
  if (!set) return
  set.delete(socketId)
  if (set.size === 0) onlineSockets.delete(userId)
}
function isOnline(userId) {
  return onlineSockets.has(userId)
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true)
        if (ALLOWED_ORIGINS.includes(origin) || NODE_ENV !== 'production') return cb(null, true)
        cb(new Error(`Socket.IO CORS: origin '${origin}' tidak diizinkan`))
      },
      credentials: true,
    },
  })

  // ── Autentikasi koneksi socket lewat JWT yang sama dipakai REST API ──────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('Token tidak ditemukan'))

      const decoded = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, isBanned: true, profile: { select: { username: true } } },
      })
      if (!user || user.isBanned) return next(new Error('Akun tidak valid'))

      socket.userId = user.id
      socket.username = user.profile?.username ?? 'Pengguna'
      next()
    } catch {
      next(new Error('Token tidak valid atau sudah expired'))
    }
  })

  io.on('connection', (socket) => {
    addSocket(socket.userId, socket.id)

    // ── Ajukan panggilan (audio/video) ──────────────────────────────────────
    socket.on('call:invite', ({ toUserId, conversationId, callType }) => {
      if (!toUserId || !['audio', 'video'].includes(callType)) return

      if (activeCallPartner.has(toUserId) || activeCallPartner.has(socket.userId)) {
        io.to(socket.id).emit('call:busy', { toUserId })
        return
      }
      if (!isOnline(toUserId)) {
        io.to(socket.id).emit('call:offline', { toUserId })
        return
      }

      io.to([...onlineSockets.get(toUserId)]).emit('call:incoming', {
        fromUserId: socket.userId,
        fromUsername: socket.username,
        conversationId,
        callType,
      })
    })

    // ── Callee menerima ──────────────────────────────────────────────────────
    socket.on('call:accept', ({ toUserId }) => {
      activeCallPartner.set(socket.userId, toUserId)
      activeCallPartner.set(toUserId, socket.userId)
      if (isOnline(toUserId)) {
        io.to([...onlineSockets.get(toUserId)]).emit('call:accepted', { fromUserId: socket.userId })
      }
    })

    // ── Callee menolak ───────────────────────────────────────────────────────
    socket.on('call:reject', ({ toUserId }) => {
      if (isOnline(toUserId)) {
        io.to([...onlineSockets.get(toUserId)]).emit('call:rejected', { fromUserId: socket.userId })
      }
    })

    // ── Caller batalkan sebelum diangkat ─────────────────────────────────────
    socket.on('call:cancel', ({ toUserId }) => {
      if (isOnline(toUserId)) {
        io.to([...onlineSockets.get(toUserId)]).emit('call:cancelled', { fromUserId: socket.userId })
      }
    })

    // ── Salah satu pihak mengakhiri panggilan yang sedang berlangsung ───────
    socket.on('call:end', ({ toUserId }) => {
      activeCallPartner.delete(socket.userId)
      activeCallPartner.delete(toUserId)
      if (isOnline(toUserId)) {
        io.to([...onlineSockets.get(toUserId)]).emit('call:ended', { fromUserId: socket.userId })
      }
    })

    // ── Relay SDP offer/answer & ICE candidate — backend TIDAK melihat isi
    //    media/audio/video sama sekali, cuma meneruskan pesan sinyal WebRTC
    //    mentah antar dua browser (media sesudahnya lewat langsung P2P/TURN). ──
    socket.on('call:signal', ({ toUserId, signal }) => {
      if (!isOnline(toUserId)) return
      io.to([...onlineSockets.get(toUserId)]).emit('call:signal', {
        fromUserId: socket.userId,
        signal,
      })
    })

    socket.on('disconnect', () => {
      removeSocket(socket.userId, socket.id)

      // Kalau lagi di tengah panggilan dan device/tab terakhirnya barusan
      // tutup, beri tahu lawan bicara supaya UI-nya tidak menggantung.
      if (!isOnline(socket.userId)) {
        const partnerId = activeCallPartner.get(socket.userId)
        if (partnerId) {
          activeCallPartner.delete(socket.userId)
          activeCallPartner.delete(partnerId)
          if (isOnline(partnerId)) {
            io.to([...onlineSockets.get(partnerId)]).emit('call:ended', { fromUserId: socket.userId })
          }
        }
      }
    })
  })

  return io
}

module.exports = { initSocket }
