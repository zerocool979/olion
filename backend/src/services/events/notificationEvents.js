// backend/src/services/events/notificationEvents.js

/**
 * =====================================================
 * Notification Event Constants
 * =====================================================
 * Dipakai agar event konsisten & tidak typo
 */

module.exports = {
  // Discussion
  DISCUSSION_CREATED: 'DISCUSSION_CREATED',
  DISCUSSION_DELETED: 'DISCUSSION_DELETED',

  // Answer & Comment
  ANSWER_CREATED: 'ANSWER_CREATED',
  ANSWER_APPROVED: 'ANSWER_APPROVED',
  ANSWER_REJECTED: 'ANSWER_REJECTED',
  COMMENT_CREATED: 'COMMENT_CREATED',

  // Vote
  VOTE_UP: 'VOTE_UP',
  VOTE_DOWN: 'VOTE_DOWN',

  // Report & Moderation
  REPORT_CREATED: 'REPORT_CREATED',
  REPORT_RESOLVED: 'REPORT_RESOLVED',

  // Pakar
  PAKAR_APPLIED: 'PAKAR_APPLIED',
  PAKAR_APPROVED: 'PAKAR_APPROVED',
  PAKAR_REJECTED: 'PAKAR_REJECTED',
};
