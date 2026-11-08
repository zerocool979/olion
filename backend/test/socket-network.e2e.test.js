'use strict'

// Network-level Socket.IO regression test. The real Socket.IO server/client and
// WebSocket transport are used; Prisma and token verification are isolated mocks.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'olion-socket-e2e-test-only-secret'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/olion_test'

const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { io: connectSocket } = require('socket.io-client')
const { initSocket } = require('../src/socket')

const ids = {
  caller: '11111111-1111-4111-8111-111111111111',
  callee: '22222222-2222-4222-8222-222222222222',
  thirdParty: '33333333-3333-4333-8333-333333333333',
  outsider: '44444444-4444-4444-8444-444444444444',
  banned: '55555555-5555-4555-8555-555555555555',
}
const conversations = {
  callerCallee: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  calleeThirdParty: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
}

function waitForEvent(socket, event, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(event, handler)
      reject(new Error('Timed out waiting for Socket.IO event: ' + event))
    }, timeoutMs)
    const handler = payload => {
      clearTimeout(timer)
      resolve(payload)
    }
    socket.once(event, handler)
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function assertNoEvent(socket, event, emitAction, waitMs = 150) {
  let received = false
  const handler = () => { received = true }
  socket.once(event, handler)
  emitAction()
  await delay(waitMs)
  socket.off(event, handler)
  assert.equal(received, false, 'unexpected Socket.IO event: ' + event)
}

function makeClient(url, token) {
  return connectSocket(url, {
    auth: { token },
    transports: ['websocket'],
    reconnection: false,
    timeout: 2000,
  })
}

test('real Socket.IO WebSocket transport enforces authenticated call membership and active-pair authorization', async t => {
  const users = new Map(Object.entries(ids).map(([name, id]) => [
    id,
    { id, isBanned: name === 'banned', profile: { username: name } },
  ]))
  const memberships = {
    [conversations.callerCallee]: [ids.caller, ids.callee],
    [conversations.calleeThirdParty]: [ids.callee, ids.thirdParty],
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

  const httpServer = http.createServer()
  const socketServer = initSocket(httpServer, {
    prismaClient,
    verifyTokenFn: token => {
      if (typeof token !== 'string' || !token.startsWith('valid:')) throw new Error('invalid token')
      return { id: token.slice('valid:'.length) }
    },
  })
  const clients = []

  try {
    await new Promise((resolve, reject) => {
      httpServer.once('error', reject)
      httpServer.listen(0, '127.0.0.1', resolve)
    })
    const address = httpServer.address()
    const url = 'http://127.0.0.1:' + address.port

    const invalidClient = makeClient(url, 'not-a-valid-token')
    clients.push(invalidClient)
    const invalidError = await waitForEvent(invalidClient, 'connect_error')
    assert.match(invalidError.message, /Token tidak valid/)

    const bannedClient = makeClient(url, 'valid:' + ids.banned)
    clients.push(bannedClient)
    const bannedError = await waitForEvent(bannedClient, 'connect_error')
    assert.match(bannedError.message, /Akun tidak valid/)

    const connectUser = async id => {
      const socket = makeClient(url, 'valid:' + id)
      clients.push(socket)
      await waitForEvent(socket, 'connect')
      return socket
    }

    const caller = await connectUser(ids.caller)
    const callee = await connectUser(ids.callee)
    const thirdParty = await connectUser(ids.thirdParty)
    const outsider = await connectUser(ids.outsider)

    // Both identities must be members of the exact conversation.
    const unauthorizedError = waitForEvent(caller, 'call:error')
    caller.emit('call:invite', {
      toUserId: ids.outsider,
      conversationId: conversations.callerCallee,
      callType: 'audio',
    })
    await unauthorizedError
    await assertNoEvent(outsider, 'call:incoming', () => {})

    const incoming = waitForEvent(callee, 'call:incoming')
    caller.emit('call:invite', {
      toUserId: ids.callee,
      conversationId: conversations.callerCallee,
      callType: 'audio',
    })
    const invitation = await incoming
    assert.equal(invitation.fromUserId, ids.caller)
    assert.equal(invitation.conversationId, conversations.callerCallee)

    // A pending participant cannot be invited into a competing conversation.
    const busy = waitForEvent(thirdParty, 'call:busy')
    thirdParty.emit('call:invite', {
      toUserId: ids.callee,
      conversationId: conversations.calleeThirdParty,
      callType: 'video',
    })
    await busy

    // Caller cannot accept its own invite; only the invited callee can.
    const callerError = waitForEvent(caller, 'call:error')
    caller.emit('call:accept', { toUserId: ids.callee })
    await callerError

    const accepted = waitForEvent(caller, 'call:accepted')
    callee.emit('call:accept', { toUserId: ids.caller })
    const acceptedPayload = await accepted
    assert.equal(acceptedPayload.fromUserId, ids.callee)

    const validOffer = {
      type: 'offer',
      sdp: { type: 'offer', sdp: 'v=0\r\n' },
    }
    const offerReceived = waitForEvent(callee, 'call:signal')
    caller.emit('call:signal', { toUserId: ids.callee, signal: validOffer })
    const relayedOffer = await offerReceived
    assert.equal(relayedOffer.fromUserId, ids.caller)
    assert.equal(relayedOffer.signal.type, 'offer')

    const answerReceived = waitForEvent(caller, 'call:signal')
    callee.emit('call:signal', {
      toUserId: ids.caller,
      signal: { type: 'answer', sdp: { type: 'answer', sdp: 'v=0\r\n' } },
    })
    const relayedAnswer = await answerReceived
    assert.equal(relayedAnswer.fromUserId, ids.callee)
    assert.equal(relayedAnswer.signal.type, 'answer')

    // Third parties, mismatched SDP types, and oversized payloads are not relayed.
    await assertNoEvent(callee, 'call:signal', () => {
      thirdParty.emit('call:signal', { toUserId: ids.callee, signal: validOffer })
    })
    await assertNoEvent(callee, 'call:signal', () => {
      caller.emit('call:signal', {
        toUserId: ids.callee,
        signal: { type: 'answer', sdp: { type: 'offer', sdp: 'v=0\r\n' } },
      })
    })
    await assertNoEvent(callee, 'call:signal', () => {
      caller.emit('call:signal', {
        toUserId: ids.callee,
        signal: { type: 'offer', sdp: { type: 'offer', sdp: 'x'.repeat(48 * 1024 + 1) } },
      })
    })

    // Only the active pair can terminate this call.
    await assertNoEvent(callee, 'call:ended', () => {
      thirdParty.emit('call:end', { toUserId: ids.callee })
    })
    const ended = waitForEvent(callee, 'call:ended')
    caller.emit('call:end', { toUserId: ids.callee })
    const endedPayload = await ended
    assert.equal(endedPayload.fromUserId, ids.caller)

    await assertNoEvent(callee, 'call:signal', () => {
      caller.emit('call:signal', { toUserId: ids.callee, signal: validOffer })
    })
  } finally {
    for (const client of clients) client.disconnect()
    await new Promise(resolve => socketServer.close(resolve))
  }
})
