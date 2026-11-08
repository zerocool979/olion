'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
// The socket module imports the application JWT and Prisma singletons at load time.
// Tests inject their own verifier/database; these placeholders are never used to connect.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'olion-socket-test-only-secret'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/olion_test'

const { initSocket } = require('../src/socket')

const ids = {
  a: '11111111-1111-4111-8111-111111111111',
  b: '22222222-2222-4222-8222-222222222222',
  c: '33333333-3333-4333-8333-333333333333',
  outsider: '44444444-4444-4444-8444-444444444444',
  banned: '55555555-5555-4555-8555-555555555555',
}
const conversations = {
  ab: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  ac: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  bc: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
}

class FakeSocket {
  constructor(id, token, server) {
    this.id = id
    this.handshake = { auth: { token } }
    this.server = server
    this.handlers = new Map()
    this.received = []
    this.connected = true
  }

  on(event, handler) {
    this.handlers.set(event, handler)
  }

  emit(event, payload) {
    this.received.push({ event, payload })
  }

  async clientEmit(event, payload) {
    const handler = this.handlers.get(event)
    assert.equal(typeof handler, 'function', 'server handler registered for ' + event)
    return handler(payload)
  }

  disconnect() {
    if (!this.connected) return
    this.connected = false
    this.server.sockets.delete(this.id)
    this.handlers.get('disconnect')?.('client disconnect')
  }
}

class FakeIoServer {
  constructor() {
    this.middleware = null
    this.connectionHandler = null
    this.sockets = new Map()
    this.nextSocketId = 1
  }

  use(handler) {
    this.middleware = handler
  }

  on(event, handler) {
    if (event === 'connection') this.connectionHandler = handler
  }

  to(socketIds) {
    const targets = Array.isArray(socketIds) ? socketIds : [socketIds]
    return {
      emit: (event, payload) => {
        for (const id of targets) this.sockets.get(id)?.emit(event, payload)
      },
    }
  }

  async connect(token) {
    const socket = new FakeSocket('socket-' + this.nextSocketId++, token, this)
    let authError = null
    await new Promise((resolve, reject) => {
      const next = error => {
        authError = error || null
        resolve()
      }
      Promise.resolve(this.middleware(socket, next)).catch(reject)
    })

    if (authError) return { socket, error: authError }
    this.sockets.set(socket.id, socket)
    this.connectionHandler(socket)
    return { socket, error: null }
  }
}

function events(socket, name) {
  return socket.received.filter(item => item.event === name)
}

test('Socket.IO authenticates users and authorizes call signaling against conversation membership and call state', async () => {
  const users = new Map(Object.entries(ids).map(([name, id]) => [
    id,
    { id, isBanned: name === 'banned', profile: { username: name } },
  ]))
  const memberships = {
    [conversations.ab]: [ids.a, ids.b],
    [conversations.ac]: [ids.a, ids.c],
    [conversations.bc]: [ids.b, ids.c],
  }
  const prismaClient = {
    user: {
      findUnique: async ({ where }) => users.get(where.id) || null,
    },
    conversationParticipant: {
      findMany: async ({ where }) => (memberships[where.conversationId] || [])
        .filter(userId => where.userId.in.includes(userId))
        .map(userId => ({ userId })),
    },
  }

  const scheduled = new Map()
  let timerId = 0
  const io = initSocket(null, {
    ServerImpl: FakeIoServer,
    prismaClient,
    verifyTokenFn: token => {
      if (typeof token !== 'string' || !token.startsWith('valid:')) throw new Error('invalid token')
      return { id: token.slice('valid:'.length) }
    },
    setTimeoutFn: (callback, delay) => {
      const id = ++timerId
      scheduled.set(id, { callback, delay })
      return id
    },
    clearTimeoutFn: id => scheduled.delete(id),
  })

  const invalid = await io.connect('invalid-token')
  assert.match(invalid.error.message, /Token tidak valid/)
  const banned = await io.connect('valid:' + ids.banned)
  assert.match(banned.error.message, /Akun tidak valid/)

  const connect = async id => {
    const result = await io.connect('valid:' + id)
    assert.equal(result.error, null)
    return result.socket
  }
  const a = await connect(ids.a)
  const b = await connect(ids.b)
  const c = await connect(ids.c)
  const outsider = await connect(ids.outsider)

  // A user who is not a participant cannot create a call in another pair's conversation.
  await a.clientEmit('call:invite', {
    toUserId: ids.outsider,
    conversationId: conversations.ab,
    callType: 'audio',
  })
  assert.equal(events(a, 'call:error').length, 1)
  assert.equal(events(outsider, 'call:incoming').length, 0)

  // Invalid call types are rejected before any call state is created.
  await a.clientEmit('call:invite', {
    toUserId: ids.b,
    conversationId: conversations.ab,
    callType: 'data',
  })
  assert.equal(events(a, 'call:error').length, 2)

  await a.clientEmit('call:invite', {
    toUserId: ids.b,
    conversationId: conversations.ab,
    callType: 'audio',
  })
  assert.equal(events(b, 'call:incoming').length, 1)
  assert.equal(events(b, 'call:incoming')[0].payload.fromUserId, ids.a)

  // A second user cannot invite a participant who is already in a pending call.
  await c.clientEmit('call:invite', {
    toUserId: ids.b,
    conversationId: conversations.bc,
    callType: 'audio',
  })
  assert.equal(events(c, 'call:busy').length, 1)

  const validOffer = { type: 'offer', sdp: { type: 'offer', sdp: 'v=0\r\n' } }
  await a.clientEmit('call:signal', { toUserId: ids.b, signal: validOffer })
  assert.equal(events(b, 'call:signal').length, 0, 'signals are blocked until the callee accepts')

  // Only the invited callee can accept. The caller and a third party cannot.
  await a.clientEmit('call:accept', { toUserId: ids.b })
  await outsider.clientEmit('call:accept', { toUserId: ids.a })
  assert.equal(events(a, 'call:accepted').length, 0)
  assert.equal(events(outsider, 'call:accepted').length, 0)

  await b.clientEmit('call:accept', { toUserId: ids.a })
  assert.equal(events(a, 'call:accepted').length, 1)
  assert.equal(scheduled.size, 0, 'accepting a call cancels its pending timeout')

  // Only the two active peers can exchange well-formed, size-bounded SDP/ICE.
  await outsider.clientEmit('call:signal', { toUserId: ids.b, signal: validOffer })
  assert.equal(events(b, 'call:signal').length, 0)

  await a.clientEmit('call:signal', { toUserId: ids.b, signal: validOffer })
  assert.equal(events(b, 'call:signal').length, 1)

  await a.clientEmit('call:signal', {
    toUserId: ids.b,
    signal: { type: 'answer', sdp: { type: 'offer', sdp: 'v=0\r\n' } },
  })
  await a.clientEmit('call:signal', {
    toUserId: ids.b,
    signal: { type: 'offer', sdp: { type: 'offer', sdp: 'x'.repeat(48 * 1024 + 1) } },
  })
  assert.equal(events(b, 'call:signal').length, 1, 'mismatched and oversized SDP are rejected')

  // A third party cannot terminate the active pair; either peer can end it.
  await c.clientEmit('call:end', { toUserId: ids.b })
  assert.equal(events(b, 'call:ended').length, 0)
  await a.clientEmit('call:end', { toUserId: ids.b })
  assert.equal(events(b, 'call:ended').length, 1)
  await a.clientEmit('call:signal', { toUserId: ids.b, signal: validOffer })
  assert.equal(events(b, 'call:signal').length, 1, 'signaling stops after call termination')

  // The invited callee may reject; the original caller may cancel, but not reject.
  await a.clientEmit('call:invite', {
    toUserId: ids.c,
    conversationId: conversations.ac,
    callType: 'video',
  })
  assert.equal(events(c, 'call:incoming').length, 1)
  await a.clientEmit('call:reject', { toUserId: ids.c })
  await c.clientEmit('call:cancel', { toUserId: ids.a })
  assert.equal(events(a, 'call:rejected').length, 0)
  assert.equal(events(c, 'call:cancelled').length, 0)
  await c.clientEmit('call:reject', { toUserId: ids.a })
  assert.equal(events(a, 'call:rejected').length, 1)

  // Pending calls expire after the configured TTL and release both participants.
  await a.clientEmit('call:invite', {
    toUserId: ids.b,
    conversationId: conversations.ab,
    callType: 'audio',
  })
  const [timeoutKey, timeout] = [...scheduled.entries()][0]
  assert.equal(timeout.delay, 60_000)
  scheduled.delete(timeoutKey)
  timeout.callback()
  assert.equal(events(a, 'call:timeout').length, 1)
  assert.equal(events(b, 'call:timeout').length, 1)

  // Disconnecting one tab must not cancel a call while another tab for the same
  // authenticated user remains online; disconnecting the last tab must clean it up.
  await a.clientEmit('call:invite', {
    toUserId: ids.b,
    conversationId: conversations.ab,
    callType: 'audio',
  })
  const secondTab = await connect(ids.a)
  const cancelledBeforeLastTab = events(b, 'call:cancelled').length
  a.disconnect()
  assert.equal(events(b, 'call:cancelled').length, cancelledBeforeLastTab)
  secondTab.disconnect()
  assert.equal(events(b, 'call:cancelled').length, cancelledBeforeLastTab + 1)
  assert.equal(scheduled.size, 0)

  b.disconnect()
  c.disconnect()
  outsider.disconnect()
})
