/**
 * DATA CONTRACT:
 * - Frontend menerima `author`
 * - Prisma relasi = `user`
 * - Normalisasi dilakukan di service
 * - Controller tidak transform data
 * 
 * KONTRAK FINAL untuk Frontend:
 * {
 *   "id": "...",
 *   "content": "...",
 *   "author": {
 *     "id": "...",
 *     "email": "...",
 *     "username": "..."
 *   },
 *   "discussionId": "...",
 *   "answerId": "...",
 *   "createdAt": "..."
 * }
 */

/**
 * Normalize single comment object
 * Converts 'user' relation to 'author' for frontend compatibility
 */
function normalizeComment(comment) {
  if (!comment) return comment;

  // Clone the object to avoid mutating original
  const { user, ...rest } = comment;

  return {
    ...rest,
    author: user
      ? {
          id: user.id,
          email: user.email,
          username: user.username || null,
          // Include role if it exists
          ...(user.role && { role: user.role }),
          // Include profile if it exists
          ...(user.profile && { profile: user.profile })
        }
      : null,
  };
}

/**
 * Normalize array of comments
 */
function normalizeCommentList(comments = []) {
  return comments.map(normalizeComment);
}

module.exports = {
  normalizeComment,
  normalizeCommentList,
};
