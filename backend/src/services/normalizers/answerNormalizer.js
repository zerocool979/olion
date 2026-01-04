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
 *   "isExpertAnswer": boolean,
 *   "isVerified": boolean,
 *   "createdAt": "..."
 * }
 */

/**
 * Normalize single answer object
 * Converts 'user' relation to 'author' for frontend compatibility
 */
function normalizeAnswer(answer) {
  if (!answer) return answer;

  // Clone the object to avoid mutating original
  const { user, ...rest } = answer;

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
 * Normalize array of answers
 */
function normalizeAnswerList(answers = []) {
  return answers.map(normalizeAnswer);
}

module.exports = {
  normalizeAnswer,
  normalizeAnswerList,
};
