'use strict'
const prisma = require('../../config/prisma')
const bookmarkService = require('../bookmark/service')

const DISCUSSION_INCLUDE = {
  user: {
    include: { profile: true },
  },
  category: {
    include: { parent: true },
  },
  _count: {
    select: { comments: true, votes: true },
  },
}

async function list({
  skip = 0,
  take = 20,
  userId,
  categoryId,
  sort = 'recent',
  feed,
  role,
  viewerId,
  isHidden = false,
} = {}) {
  let orderBy
  if (sort === 'votes') orderBy = { votes: { _count: 'desc' } }
  else if (sort === 'comments') orderBy = { comments: { _count: 'desc' } }
  else orderBy = { createdAt: 'desc' }

  const where = { isHidden }
  if (userId) where.userId = userId
  if (categoryId) where.categoryId = categoryId
  if (role) where.user = { role: String(role).toUpperCase() }

  if (feed === 'following') {
    // Tanpa login, feed following kosong (bukan 401) — konsisten dengan
    // endpoint publik lain yang tetap bisa dipanggil oleh guest.
    if (!viewerId) return []
    const follows = await prisma.follow.findMany({
      where: { followerId: viewerId },
      select: { followingId: true },
    })
    const ids = follows.map((f) => f.followingId)
    if (ids.length === 0) return []
    where.userId = { in: ids }
  }

  return prisma.discussion.findMany({
    skip,
    take,
    where,
    orderBy,
    include: DISCUSSION_INCLUDE,
  })
}

async function detail(id, currentUserId) {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { include: { profile: true } },
      category: { include: { parent: true } },
      votes: currentUserId ? { where: { userId: currentUserId }, select: { value: true } } : false,
      _count: {
        select: { votes: true, comments: true },
      },
    },
  })

  if (!discussion) return null

  // FIX: sebelumnya komentar diambil lewat Prisma `include` bersarang yang
  // cuma menjangkau 2 level (komentar utama + balasannya) — balasan dari
  // balasan tidak pernah ikut ter-include sama sekali, jadi walau berhasil
  // dibuat di database, tidak akan pernah muncul lagi setelah refresh.
  // Sekarang komentar diambil flat (satu query, semua kedalaman sekaligus),
  // lalu pohonnya dibangun di sini — mendukung balas-membalas tanpa batas.
  const flatComments = await prisma.comment.findMany({
    where: { discussionId: id, isHidden: false },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { include: { profile: true } },
      votes: currentUserId ? { where: { userId: currentUserId }, select: { value: true } } : false,
      _count: { select: { votes: true } },
    },
  })

  // Ratakan userVote per node supaya mudah dipakai frontend, tanpa membocorkan
  // daftar vote user lain (relasi votes penuh tidak diekspos ke response).
  const flatten = (node) => {
    const userVote = Array.isArray(node.votes) ? (node.votes[0]?.value ?? null) : null
    const { votes, ...rest } = node
    return { ...rest, userVote, replies: [] }
  }

  const byId = new Map()
  for (const c of flatComments) byId.set(c.id, flatten(c))

  const roots = []
  for (const c of flatComments) {
    const node = byId.get(c.id)
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId).replies.push(node)
    } else {
      roots.push(node)
    }
  }

  const withReplies = {
    ...discussion,
    comments: roots,
  }

  // flatten() dipakai ulang di sini murni untuk meratakan userVote milik
  // objek diskusi itu sendiri; field `replies: []` tambahan dari flatten()
  // tidak relevan untuk objek diskusi dan diabaikan lewat destructuring.
  const { replies: _unused, ...flat } = flatten(withReplies)

  if (currentUserId) {
    flat.isBookmarked = await bookmarkService.isBookmarked(currentUserId, id)
  } else {
    flat.isBookmarked = false
  }

  return flat
}

async function create(userId, categoryId, title, content, mode, discipline) {
  return prisma.discussion.create({
    data: { title, content, categoryId, userId, mode, discipline },
    include: DISCUSSION_INCLUDE,
  })
}

async function search({
  q = '',
  category = '',
  subcategory = '',
  sort = 'latest',
  skip = 0,
  take = 20,
} = {}) {

  let orderBy
  if (sort === 'votes') {
    orderBy = { votes: { _count: 'desc' } }
  } else if (sort === 'comments') {
    orderBy = { comments: { _count: 'desc' } }
  } else {
    orderBy = { createdAt: 'desc' }
  }

  let categoryIdFilter

  if (subcategory) {
    const sub = await prisma.category.findFirst({ where: { slug: subcategory } })
    if (sub) categoryIdFilter = { equals: sub.id }
  } else if (category) {
    const parent = await prisma.category.findFirst({
      where: { slug: category },
      include: { children: { select: { id: true } } },
    })
    if (parent) {
      const ids = [parent.id, ...parent.children.map((c) => c.id)]
      categoryIdFilter = { in: ids }
    }
  }

  const where = {
    isHidden: false,
    ...(q && {
      OR: [
        { title:   { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(categoryIdFilter && { categoryId: categoryIdFilter }),
  }

  const [data, total] = await Promise.all([
    prisma.discussion.findMany({ skip, take, where, orderBy, include: DISCUSSION_INCLUDE }),
    prisma.discussion.count({ where }),
  ])

  return { data, total }
}

module.exports = { list, detail, create, search }



