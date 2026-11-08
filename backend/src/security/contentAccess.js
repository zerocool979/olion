'use strict'

const STAFF_ROLES = new Set(['ADMIN', 'MODERATOR'])

function canViewHiddenContent(role) {
  return STAFF_ROLES.has(role)
}

function contentVisibilityFilter(role) {
  return canViewHiddenContent(role) ? {} : { isHidden: false }
}

function discussionLookupWhere(id, role) {
  return { id, ...contentVisibilityFilter(role) }
}

module.exports = {
  canViewHiddenContent,
  contentVisibilityFilter,
  discussionLookupWhere,
}
