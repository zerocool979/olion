/**
 * DATA CONTRACT:
 * - Frontend menerima aggregated vote data
 * - Tidak expose internal Prisma vote structure
 * - userId hanya untuk menghitung userVote
 * 
 * KONTRAK FINAL untuk Frontend:
 * {
 *   "upvotes": 12,
 *   "downvotes": 3,
 *   "userVote": "Up" | "Down" | null
 * }
 */

/**
 * Normalize vote data from Prisma to frontend format
 * @param {Array} votes - Array of vote objects from Prisma
 * @param {string|null} userId - Current user ID (null for guests)
 * @returns {object} Normalized vote data
 */
function normalizeVotes({ votes = [], userId = null }) {
  let upvotes = 0;
  let downvotes = 0;
  let userVote = null;

  // Count votes and check user's vote
  for (const vote of votes) {
    if (vote.type === 'Up') upvotes++;
    if (vote.type === 'Down') downvotes++;

    // Check if this vote belongs to the current user
    if (userId && vote.userId === userId) {
      userVote = vote.type;
    }
  }

  return {
    upvotes,
    downvotes,
    userVote,
  };
}

module.exports = {
  normalizeVotes,
};
