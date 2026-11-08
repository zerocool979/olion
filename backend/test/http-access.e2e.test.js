'use strict'

// HTTP integration tests for OLION access-control routes.
// Express, routing, middleware and JWT verification run for real; only the
// Prisma database layer is replaced with deterministic synthetic fixtures.
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'olion-http-access-test-only-secret-not-for-production'
process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/olion_test'

const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const prisma = require('../src/config/prisma')

const SECRET = process.env.JWT_SECRET
const ids = {
  user: '11111111-1111-4111-8111-111111111111',
  expert: '22222222-2222-4222-8222-222222222222',
  moderator: '33333333-3333-4333-8333-333333333333',
  admin: '44444444-4444-4444-8444-444444444444',
  banned: '55555555-5555-4555-8555-555555555555',
  owner: '66666666-6666-4666-8666-666666666666',
  other: '77777777-7777-4777-8777-777777777777',
}
const hiddenDiscussionId = 'hidden-discussion-fixture'
const hiddenCommentId = 'hidden-comment-fixture'
const conversationId = '88888888-8888-4888-8888-888888888888'

const users = new Map([
  [ids.user, { id: ids.user, role: 'USER', isBanned: false }],
  [ids.expert, { id: ids.expert, role: 'EXPERT', isBanned: false }],
  [ids.moderator, { id: ids.moderator, role: 'MODERATOR', isBanned: false }],
  [ids.admin, { id: ids.admin, role: 'ADMIN', isBanned: false }],
  [ids.banned, { id: ids.banned, role: 'USER', isBanned: true }],
  [ids.owner, { id: ids.owner, role: 'USER', isBanned: false }],
  [ids.other, { id: ids.other, role: 'USER', isBanned: false }],
])

const hiddenDiscussion = {
  id: hiddenDiscussionId,
  title: 'Synthetic hidden discussion fixture',
  content: 'This record is only an in-memory test fixture.',
  mode: 'EKSPLORATIF',
  discipline: 'BEBAS',
  isHidden: true,
  userId: ids.owner,
  category: { id: 'category-fixture', name: 'Test', parent: null },
  user: { id: ids.owner, role: 'USER', isVerifiedExpert: false, profile: { username: 'fixture-owner' } },
  votes: [],
  _count: { votes: 0, comments: 0 },
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
}

function signToken(userId) {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: '5m' })
}

function bearer(userId) {
  return { Authorization: 'Bearer ' + signToken(userId) }
}

async function request(baseUrl, path, { method = 'GET', userId, token, body } = {}) {
  const headers = {}
  if (userId) Object.assign(headers, bearer(userId))
  if (token) headers.Authorization = 'Bearer ' + token
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const response = await fetch(baseUrl + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { status: response.status, data }
}

function patchMethod(target, key, replacement, restore) {
  const original = target[key]
  target[key] = replacement
  restore.push(() => { target[key] = original })
}

test('HTTP access-control routes enforce hidden-content and cross-user boundaries for every role', async t => {
  const restore = []
  const calls = {
    discussionFindMany: [],
    discussionFindFirst: [],
    discussionUpdateMany: [],
    commentFindFirst: [],
    commentFindMany: [],
    commentCreate: 0,
    bookmarkFindMany: [],
    bookmarkFindFirst: [],
    bookmarkUpsert: 0,
    voteFindFirst: [],
    voteFindMany: [],
    voteUpsert: 0,
    participantFindUnique: [],
  }

  patchMethod(prisma.user, 'findUnique', async ({ where }) => users.get(where.id) || null, restore)

  patchMethod(prisma.discussion, 'findFirst', async ({ where }) => {
    calls.discussionFindFirst.push(where)
    if (where.id !== hiddenDiscussionId) return null
    return where.isHidden === false ? null : hiddenDiscussion
  }, restore)

  patchMethod(prisma.discussion, 'findMany', async args => {
    calls.discussionFindMany.push(args)
    return []
  }, restore)

  patchMethod(prisma.discussion, 'updateMany', async args => {
    calls.discussionUpdateMany.push(args)
    return { count: 0 }
  }, restore)

  patchMethod(prisma.discussion, 'findUnique', async ({ where }) => {
    if (where.id === hiddenDiscussionId) return hiddenDiscussion
    return null
  }, restore)

  patchMethod(prisma.comment, 'findFirst', async args => {
    calls.commentFindFirst.push(args)
    return null
  }, restore)

  patchMethod(prisma.comment, 'findMany', async args => {
    calls.commentFindMany.push(args)
    return []
  }, restore)

  patchMethod(prisma.comment, 'create', async args => {
    calls.commentCreate += 1
    return { id: 'unexpected-comment', ...args.data }
  }, restore)

  patchMethod(prisma.bookmark, 'findUnique', async () => null, restore)

  patchMethod(prisma.bookmark, 'findMany', async args => {
    calls.bookmarkFindMany.push(args)
    return []
  }, restore)

  patchMethod(prisma.bookmark, 'upsert', async args => {
    calls.bookmarkUpsert += 1
    return { id: 'unexpected-bookmark', ...args.create }
  }, restore)

  patchMethod(prisma.vote, 'findFirst', async args => {
    calls.voteFindFirst.push(args)
    return null
  }, restore)

  patchMethod(prisma.vote, 'findMany', async args => {
    calls.voteFindMany.push(args)
    return []
  }, restore)

  patchMethod(prisma.vote, 'upsert', async args => {
    calls.voteUpsert += 1
    return { id: 'unexpected-vote', ...args.create }
  }, restore)

  patchMethod(prisma.conversationParticipant, 'findUnique', async args => {
    calls.participantFindUnique.push(args)
    return null
  }, restore)

  const server = http.createServer(app)
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
    const baseUrl = 'http://127.0.0.1:' + server.address().port

    await t.test('invalid and banned credentials are rejected on protected routes', async () => {
      assert.equal((await request(baseUrl, '/api/bookmarks')).status, 401)
      assert.equal((await request(baseUrl, '/api/bookmarks', { token: 'not-a-jwt' })).status, 401)
      assert.equal((await request(baseUrl, '/api/bookmarks', { userId: ids.banned })).status, 403)
    })

    await t.test('guest, USER and EXPERT cannot fetch a hidden discussion by direct ID', async () => {
      for (const userId of [undefined, ids.user, ids.expert]) {
        const result = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId, { userId })
        assert.equal(result.status, 404)
      }
    })

    await t.test('MODERATOR and ADMIN can inspect hidden discussion detail', async () => {
      for (const userId of [ids.moderator, ids.admin]) {
        const result = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId, { userId })
        assert.equal(result.status, 200)
        assert.equal(result.data.data.id, hiddenDiscussionId)
      }
    })

    await t.test('public and ordinary-user lists cannot override hidden-content filtering', async () => {
      const firstIndex = calls.discussionFindMany.length
      assert.equal((await request(baseUrl, '/api/discussions?isHidden=true')).status, 200)
      assert.equal((await request(baseUrl, '/api/discussions?isHidden=true', { userId: ids.user })).status, 200)
      const ordinaryQueries = calls.discussionFindMany.slice(firstIndex)
      assert.equal(ordinaryQueries.length, 2)
      for (const query of ordinaryQueries) assert.equal(query.where.isHidden, false)

      const staffStart = calls.discussionFindMany.length
      assert.equal((await request(baseUrl, '/api/discussions?isHidden=true', { userId: ids.moderator })).status, 200)
      assert.equal((await request(baseUrl, '/api/discussions?isHidden=true', { userId: ids.admin })).status, 200)
      const staffQueries = calls.discussionFindMany.slice(staffStart)
      assert.equal(staffQueries.length, 2)
      for (const query of staffQueries) assert.equal(query.where.isHidden, true)
    })

    await t.test('hidden discussion comment read and create endpoints are blocked', async () => {
      const read = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId + '/comments', { userId: ids.user })
      assert.equal(read.status, 404)

      const create = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId + '/comments', {
        method: 'POST',
        userId: ids.user,
        body: { content: 'attempted comment against hidden fixture' },
      })
      assert.equal(create.status, 404)
      assert.equal(calls.commentCreate, 0)
    })

    await t.test('hidden discussion cannot be bookmarked or voted on', async () => {
      const bookmark = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId + '/bookmark', {
        method: 'POST',
        userId: ids.user,
      })
      assert.equal(bookmark.status, 404)
      assert.equal(calls.bookmarkUpsert, 0)

      const vote = await request(baseUrl, '/api/votes', {
        method: 'POST',
        userId: ids.user,
        body: { discussionId: hiddenDiscussionId, value: 1 },
      })
      assert.equal(vote.status, 404)
      assert.equal(calls.voteUpsert, 0)

      const commentVote = await request(baseUrl, '/api/comments/' + hiddenCommentId + '/votes', {
        method: 'POST',
        userId: ids.user,
        body: { value: 1 },
      })
      assert.equal(commentVote.status, 404)
      assert.equal(calls.voteUpsert, 0)
      const commentVoteQuery = calls.commentFindFirst.at(-1)
      assert.equal(commentVoteQuery.where.discussion.is.isHidden, false)
    })

    await t.test('view counter does not mutate hidden discussion records', async () => {
      const result = await request(baseUrl, '/api/discussions/' + hiddenDiscussionId + '/view', {
        method: 'POST',
        userId: ids.user,
      })
      assert.equal(result.status, 404)
      assert.equal(calls.discussionUpdateMany.at(-1).where.isHidden, false)
    })

    await t.test('bookmark list is scoped to the caller and excludes hidden parent discussions', async () => {
      const result = await request(baseUrl, '/api/bookmarks', { userId: ids.user })
      assert.equal(result.status, 200)
      const query = calls.bookmarkFindMany.at(-1)
      assert.equal(query.where.userId, ids.user)
      assert.equal(query.where.discussion.is.isHidden, false)
    })

    await t.test('users cannot enumerate another user comments or votes by changing userId', async () => {
      const commentsBefore = calls.commentFindMany.length
      const comments = await request(baseUrl, '/api/comments?userId=' + ids.other, { userId: ids.user })
      assert.equal(comments.status, 403)
      assert.equal(calls.commentFindMany.length, commentsBefore)

      const votesBefore = calls.voteFindMany.length
      const votes = await request(baseUrl, '/api/votes?userId=' + ids.other, { userId: ids.user })
      assert.equal(votes.status, 403)
      assert.equal(calls.voteFindMany.length, votesBefore)

      assert.equal((await request(baseUrl, '/api/comments?userId=' + ids.user, { userId: ids.user })).status, 200)
      assert.equal((await request(baseUrl, '/api/votes?userId=' + ids.user, { userId: ids.user })).status, 200)
    })

    await t.test('conversation messages are not readable by a non-participant', async () => {
      const result = await request(baseUrl, '/api/chat/conversations/' + conversationId + '/messages', {
        userId: ids.user,
      })
      assert.equal(result.status, 403)
      assert.equal(calls.participantFindUnique.at(-1).where.conversationId_userId.userId, ids.user)
    })

    await t.test('admin-only endpoints reject USER, EXPERT and MODERATOR', async () => {
      for (const userId of [ids.user, ids.expert, ids.moderator]) {
        const result = await request(baseUrl, '/api/admin/users', { userId })
        assert.equal(result.status, 403)
      }
    })
  } finally {
    await new Promise(resolve => server.close(resolve))
    for (const undo of restore.reverse()) undo()
  }
})
