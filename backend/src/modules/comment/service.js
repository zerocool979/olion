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
    select: { id: true }
  })
  if (!discussion) {
    const err = new Error('Diskusi tidak ditemukan')
    err.statusCode = 404
    throw err
  }

  // Validasi parentId jika ada (thread reply)
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } })
    if (!parent || parent.discussionId !== discussionId) {
      const err = new Error('Komentar induk tidak valid')
      err.statusCode = 400
      throw err
    }
  }

  // Badge first_answer (fire-and-forget)
  badgeSvc.awardSlug(userId, 'first_answer').catch(() => {})

  return prisma.comment.create({
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


