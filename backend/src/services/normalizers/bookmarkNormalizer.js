/**
 * DATA CONTRACT:
 * - Frontend menerima simple boolean untuk bookmark status
 * - Tidak expose internal Prisma bookmark structure
 * 
 * KONTRAK FINAL untuk Frontend:
 * {
 *   "isBookmarked": true | false
 * }
 */

/**
 * Normalize bookmark data from Prisma to frontend format
 * @param {Array} bookmarks - Array of bookmark objects from Prisma
 * @param {string|null} userId - Current user ID (null for guests)
 * @returns {object} Normalized bookmark data
 */
function normalizeBookmark({ bookmarks = [], userId = null }) {
  const isBookmarked = userId
    ? bookmarks.some(bookmark => bookmark.userId === userId)
    : false;

  return { isBookmarked };
}

module.exports = {
  normalizeBookmark,
};
