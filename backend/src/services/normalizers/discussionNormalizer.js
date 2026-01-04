/**
 * FINAL DATA CONTRACT (Frontend-safe)
 * ----------------------------------
 * {
 *   id: string,
 *   title: string,
 *   content: string,
 *   createdAt: string,
 *   updatedAt: string,
 *
 *   author: {
 *     id: string,
 *     email: string,
 *     profile?: {
 *       pseudonym?: string,
 *       avatarUrl?: string
 *     }
 *   } | null,
 *
 *   category: {
 *     id: string,
 *     name: string
 *   } | null,
 *
 *   stats: {
 *     voteCount: number,
 *     bookmarkCount: number
 *   },
 *
 *   userVote?: "Up" | "Down" | null,
 *   isBookmarked?: boolean
 * }
 */

/**
 * Normalize single discussion object
 */
function normalizeDiscussion(discussion, currentUserId = null) {
  if (!discussion) return null;

  const {
    user,
    category,
    votes = [],
    bookmarks = [],
    _count,
    ...rest
  } = discussion;

  /**
   * ----------------------------------
   * AUTHOR
   * ----------------------------------
   * Username DIHAPUS karena tidak ada di schema
   * Identitas publik via profile
   */
  const author = user
    ? {
        id: user.id,
        email: user.email,
        ...(user.profile ? { profile: user.profile } : {}),
      }
    : null;

  /**
   * ----------------------------------
   * CATEGORY
   * ----------------------------------
   * Selalu object { id, name } atau null
   */
  const normalizedCategory = category
    ? {
        id: category.id,
        name: category.name,
      }
    : null;

  /**
   * ----------------------------------
   * STATS
   * ----------------------------------
   * Prioritas:
   * 1. _count (lebih efisien)
   * 2. fallback ke votes / bookmarks
   */
  const voteCount =
    typeof _count?.votes === 'number'
      ? _count.votes
      : votes.reduce((acc, v) => acc + (v.type === 'Up' ? 1 : -1), 0);

  const bookmarkCount =
    typeof _count?.bookmarks === 'number'
      ? _count.bookmarks
      : bookmarks.length;

  /**
   * ----------------------------------
   * USER STATE (OPTIONAL)
   * ----------------------------------
   */
  let userVote = null;
  let isBookmarked = false;

  if (currentUserId) {
    const foundVote = votes.find(v => v.userId === currentUserId);
    userVote = foundVote ? foundVote.type : null;

    isBookmarked = bookmarks.some(b => b.userId === currentUserId);
  }

  return {
    ...rest,
    author,
    category: normalizedCategory,
    stats: {
      voteCount,
      bookmarkCount,
    },
    ...(currentUserId && {
      userVote,
      isBookmarked,
    }),
  };
}

/**
 * Normalize array of discussions
 */
function normalizeDiscussionList(discussions = [], currentUserId = null) {
  return discussions.map(d => normalizeDiscussion(d, currentUserId));
}

module.exports = {
  normalizeDiscussion,
  normalizeDiscussionList,
};
