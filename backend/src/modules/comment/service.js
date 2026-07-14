'use strict'
const prisma = require('../../config/prisma')
const badgeSvc = require('../badge/service')

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
      user: { include: { profile: true } },
      replies: true,
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
      user: { include: { profile: true } },
      replies: {
        where: { isHidden: false },
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { votes: true } },
    },
  })
}


