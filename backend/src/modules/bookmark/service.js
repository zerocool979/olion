'use strict'
const prisma = require('../../config/prisma')

// Public-facing author fields only; never return account credentials or email.
const PUBLIC_USER_SELECT = {
  id: true,
  role: true,
  isVerifiedExpert: true,
  createdAt: true,
  profile: {
    select: {
      username: true,
      bio: true,
      avatarUrl: true,
      avatarBorder: true,
    },
  },
}

const BOOKMARK_INCLUDE = {
  discussion: {
    include: {
      user: { select: PUBLIC_USER_SELECT },
      category: { include: { parent: true } },
      _count: { select: { votes: true, comments: true } },
    },
  },
}

// GET /bookmarks — daftar bookmark milik user, diurut terbaru disimpan
exports.list = async (userId) => {
  const rows = await prisma.bookmark.findMany({
    // A discussion hidden after bookmarking must no longer leak through this list.
    where: { userId, discussion: { is: { isHidden: false } } },
    include: BOOKMARK_INCLUDE,
    orderBy: { createdAt: 'desc' },
  })

  // Samakan bentuk field dengan yang diharapkan frontend (savedAt)
  return rows.map((b) => ({
    id: b.id,
    savedAt: b.createdAt,
    discussion: b.discussion,
  }))
}

// POST /discussions/:id/bookmark — toggle simpan
exports.add = async (userId, discussionId) => {
  const discussion = await prisma.discussion.findFirst({
    where: { id: discussionId, isHidden: false },
    select: { id: true },
  })
  if (!discussion) {
    const err = new Error('Diskusi tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_discussionId: { userId, discussionId } },
    update: {},
    create: { userId, discussionId },
  })

  return bookmark
}

// DELETE /discussions/:id/bookmark — hapus berdasarkan discussionId
exports.removeByDiscussion = async (userId, discussionId) => {
  await prisma.bookmark.deleteMany({ where: { userId, discussionId } })
  return { bookmarked: false }
}

// DELETE /bookmarks/:id — hapus berdasarkan id row bookmark (hanya pemilik)
exports.removeById = async (userId, bookmarkId) => {
  const existing = await prisma.bookmark.findUnique({ where: { id: bookmarkId } })
  if (!existing) {
    const err = new Error('Bookmark tidak ditemukan')
    err.statusCode = 404
    throw err
  }
  if (existing.userId !== userId) {
    const err = new Error('Tidak diizinkan menghapus bookmark ini')
    err.statusCode = 403
    throw err
  }
  await prisma.bookmark.delete({ where: { id: bookmarkId } })
  return { bookmarked: false }
}

// Dipakai discussion.service untuk menandai isBookmarked di detail diskusi
exports.isBookmarked = async (userId, discussionId) => {
  if (!userId) return false
  const found = await prisma.bookmark.findUnique({
    where: { userId_discussionId: { userId, discussionId } },
    select: { id: true },
  })
  return !!found
}
