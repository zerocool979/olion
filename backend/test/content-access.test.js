'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const {
  canViewHiddenContent,
  contentVisibilityFilter,
  discussionLookupWhere,
} = require('../src/security/contentAccess')

test('only moderator and admin can access hidden content', () => {
  assert.equal(canViewHiddenContent('ADMIN'), true)
  assert.equal(canViewHiddenContent('MODERATOR'), true)
  assert.equal(canViewHiddenContent('USER'), false)
  assert.equal(canViewHiddenContent('EXPERT'), false)
  assert.equal(canViewHiddenContent(undefined), false)
})

test('public and ordinary-user queries always constrain hidden content', () => {
  for (const role of [undefined, 'USER', 'EXPERT']) {
    assert.deepEqual(contentVisibilityFilter(role), { isHidden: false })
    assert.deepEqual(discussionLookupWhere('discussion-123', role), {
      id: 'discussion-123',
      isHidden: false,
    })
  }
})

test('moderation staff may query hidden content by its identifier', () => {
  for (const role of ['ADMIN', 'MODERATOR']) {
    assert.deepEqual(contentVisibilityFilter(role), {})
    assert.deepEqual(discussionLookupWhere('discussion-123', role), {
      id: 'discussion-123',
    })
  }
})
