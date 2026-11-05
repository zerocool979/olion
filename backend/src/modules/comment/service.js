'use strict'
const prisma = require('../../config/prisma')
const badgeSvc = require('../badge/service')

// Public-facing user fields only. Never expose email, password hash, or
// Google account identifiers in comment responses.
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

exports.create = async ({ content, discussionId, parentId }, userId) => {
  // Validasi konten
  if (!content || !content.trim()) {
    const err = new Error('Konten komentar tidak boleh kosong')
    err.statusCode = 400
    throw err
  }

  // Pastikan diskusi ada
  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    select: { id: true, userId: true, title: true }
  })
  if (!discussion) {
    const err = new Error('Diskusi tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  // Validasi parentId jika ada (thread reply)
  let parent = null
  if (parentId) {
    parent = await prisma.comment.findUnique({ where: { id: parentId } })
    if (!parent || parent.discussionId !== discussionId) {
      const err = new Error('Komentar induk tidak valid')
      err.statusCode = 400
      throw err
    }
  }

  // Badge first_answer (fire-and-forget)
  badgeSvc.awardSlug(userId, 'first_answer').catch(() => {})

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      discussionId,
      userId,
      parentId: parentId || null,
    },
    include: {
      user: { select: PUBLIC_USER_SELECT },
      replies: {
        include: { user: { select: PUBLIC_USER_SELECT } },
      },
    },
  })

  // Info tambahan untuk controller memicu notifikasi — tidak disimpan di DB,
  // hanya dilampirkan ke object return supaya controller tidak query ulang.
  comment._discussionOwnerId = discussion.userId
  comment._discussionTitle = discussion.title
  comment._parentOwnerId = parent?.userId ?? null

  return comment
}

exports.getByDiscussion = (discussionId) => {
  return prisma.comment.findMany({
    where: { discussionId, isHidden: false, parentId: null },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: PUBLIC_USER_SELECT },
      replies: {
        where: { isHidden: false },
        include: { user: { select: PUBLIC_USER_SELECT } },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { votes: true } },
    },
  })
}


