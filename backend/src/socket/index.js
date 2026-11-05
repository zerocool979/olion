'use strict'
const { Server } = require('socket.io')
const { verifyToken } = require('../utils/jwt')
const prisma = require('../config/prisma')
const { NODE_ENV } = require('../config/env')

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : ['http://localhost:3000']

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const MAX_SIGNAL_BYTES = 48 * 1024

// userId -> Set<socket.id> (one user may be connected from multiple tabs/devices)
const onlineSockets = new Map()
// userId -> { partnerId, conversationId, callType, role }
// Both participants receive an entry while a call is pending.
const pendingCallByUser = new Map()
// Active calls are stored only after the callee accepts a matching pending invite.
const activeCallPartner = new Map()
const activeCallConversation = new Map()

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

function emitToUser(io, userId, event, payload) {
  const sockets = onlineSockets.get(userId)
  if (sockets?.size) io.to([...sockets]).emit(event, payload)
}

function hasCallState(userId) {
  return pendingCallByUser.has(userId) || activeCallPartner.has(userId)
}

function clearPendingCall(userId, partnerId) {
  const pending = pendingCallByUser.get(userId)
  if (!pending || pending.partnerId !== partnerId) return null

  pendingCallByUser.delete(userId)
  const partnerPending = pendingCallByUser.get(partnerId)
  if (
    partnerPending &&
    partnerPending.partnerId === userId &&
    partnerPending.conversationId === pending.conversationId
  ) {
    pendingCallByUser.delete(partnerId)
  }
  return pending
}

function clearActiveCall(userId, partnerId) {
  if (activeCallPartner.get(userId) !== partnerId) return false
  if (activeCallPartner.get(partnerId) !== userId) return false

  activeCallPartner.delete(userId)
  activeCallPartner.delete(partnerId)
  activeCallConversation.delete(userId)
  activeCallConversation.delete(partnerId)
  return true
}

function isValidSignal(signal) {
  if (!signal || typeof signal !== 'object') return false

  if (signal.type === 'offer' || signal.type === 'answer') {
    return Boolean(
      signal.sdp &&
      typeof signal.sdp.sdp === 'string' &&
      signal.sdp.sdp.length > 0 &&
      signal.sdp.sdp.length <= MAX_SIGNAL_BYTES
    )
  }

  if (signal.type === 'ice-candidate') {
    if (!signal.candidate || typeof signal.candidate !== 'object') return false
    try {
      return JSON.stringify(signal.candidate).length <= 8192
    } catch {
      return false
    }
  }

  return false
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    maxHttpBufferSize: 64 * 1024,
    cors: {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true)
        if (ALLOWED_ORIGINS.includes(origin) || NODE_ENV !== 'production') return cb(null, true)
        return cb(null, false)
      },
      credentials: true,
    },
  })

  // Authenticate the socket once, then authorize each call event against the
  // exact conversation participants before signaling is allowed.
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

    const callError = () => {
      socket.emit('call:error', {
        message: 'Permintaan panggilan tidak valid atau tidak diizinkan.',
      })
    }

    // ── Caller invites a second participant in an existing conversation ───────
    socket.on('call:invite', async (payload = {}) => {
      const { toUserId, conversationId, callType } = payload || {}
      if (
        typeof toUserId !== 'string' ||
        typeof conversationId !== 'string' ||
        !UUID_RE.test(toUserId) ||
        !UUID_RE.test(conversationId) ||
        toUserId === socket.userId ||
        !['audio', 'video'].includes(callType)
      ) {
        return callError()
      }

      if (hasCallState(socket.userId) || hasCallState(toUserId)) {
        socket.emit('call:busy', { toUserId })
        return
      }

      try {
        const participants = await prisma.conversationParticipant.findMany({
          where: {
            conversationId,
            userId: { in: [socket.userId, toUserId] },
          },
          select: { userId: true },
        })
        const participantIds = new Set(participants.map(row => row.userId))
        if (!participantIds.has(socket.userId) || !participantIds.has(toUserId)) {
          return callError()
        }

        // Recheck after the DB await to avoid two simultaneous invites reserving
        // the same user before either request has populated the pending map.
        if (hasCallState(socket.userId) || hasCallState(toUserId)) {
          socket.emit('call:busy', { toUserId })
          return
        }
        if (!isOnline(toUserId)) {
          socket.emit('call:offline', { toUserId })
          return
        }

        pendingCallByUser.set(socket.userId, {
          partnerId: toUserId,
          conversationId,
          callType,
          role: 'caller',
        })
        pendingCallByUser.set(toUserId, {
          partnerId: socket.userId,
          conversationId,
          callType,
          role: 'callee',
        })

        emitToUser(io, toUserId, 'call:incoming', {
          fromUserId: socket.userId,
          fromUsername: socket.username,
          conversationId,
          callType,
        })
      } catch (err) {
        console.error('[socket] call invite authorization failed:', err.message)
        callError()
      }
    })

    // ── Only the invited callee can accept the matching pending call ───────────
    socket.on('call:accept', (payload = {}) => {
      const { toUserId } = payload || {}
      const pending = pendingCallByUser.get(socket.userId)
      const callerPending = pendingCallByUser.get(toUserId)

      if (
        !pending ||
        pending.role !== 'callee' ||
        pending.partnerId !== toUserId ||
        !callerPending ||
        callerPending.role !== 'caller' ||
        callerPending.partnerId !== socket.userId ||
        callerPending.conversationId !== pending.conversationId
      ) {
        return callError()
      }

      clearPendingCall(socket.userId, toUserId)
      if (!isOnline(toUserId)) {
        socket.emit('call:offline', { toUserId })
        return
      }

      activeCallPartner.set(socket.userId, toUserId)
      activeCallPartner.set(toUserId, socket.userId)
      activeCallConversation.set(socket.userId, pending.conversationId)
      activeCallConversation.set(toUserId, pending.conversationId)
      emitToUser(io, toUserId, 'call:accepted', { fromUserId: socket.userId })
    })

    // ── Only the invited callee can reject a pending call ──────────────────────
    socket.on('call:reject', (payload = {}) => {
      const { toUserId } = payload || {}
      const pending = pendingCallByUser.get(socket.userId)
      if (!pending || pending.role !== 'callee' || pending.partnerId !== toUserId) return

      const cleared = clearPendingCall(socket.userId, toUserId)
      if (cleared) emitToUser(io, toUserId, 'call:rejected', { fromUserId: socket.userId })
    })

    // ── Only the original caller can cancel a pending call ─────────────────────
    socket.on('call:cancel', (payload = {}) => {
      const { toUserId } = payload || {}
      const pending = pendingCallByUser.get(socket.userId)
      if (!pending || pending.role !== 'caller' || pending.partnerId !== toUserId) return

      const cleared = clearPendingCall(socket.userId, toUserId)
      if (cleared) emitToUser(io, toUserId, 'call:cancelled', { fromUserId: socket.userId })
    })

    // ── Either member may end only their own accepted call ─────────────────────
    socket.on('call:end', (payload = {}) => {
      const { toUserId } = payload || {}
      if (!clearActiveCall(socket.userId, toUserId)) return
      emitToUser(io, toUserId, 'call:ended', { fromUserId: socket.userId })
    })

    // ── Relay only validated SDP/ICE for the active, authorized call pair ──────
    socket.on('call:signal', (payload = {}) => {
      const { toUserId, signal } = payload || {}
      const conversationId = activeCallConversation.get(socket.userId)

      if (
        activeCallPartner.get(socket.userId) !== toUserId ||
        activeCallPartner.get(toUserId) !== socket.userId ||
        !conversationId ||
        activeCallConversation.get(toUserId) !== conversationId ||
        !isValidSignal(signal)
      ) {
        return
      }

      emitToUser(io, toUserId, 'call:signal', {
        fromUserId: socket.userId,
        signal,
      })
    })

    socket.on('disconnect', () => {
      removeSocket(socket.userId, socket.id)

      // Keep state while another tab/device for this account remains online.
      if (isOnline(socket.userId)) return

      const pending = pendingCallByUser.get(socket.userId)
      if (pending) {
        const partnerId = pending.partnerId
        clearPendingCall(socket.userId, partnerId)
        emitToUser(io, partnerId, 'call:cancelled', { fromUserId: socket.userId })
      }

      const partnerId = activeCallPartner.get(socket.userId)
      if (partnerId && clearActiveCall(socket.userId, partnerId)) {
        emitToUser(io, partnerId, 'call:ended', { fromUserId: socket.userId })
      }
    })
  })

  return io
}

module.exports = { initSocket }
