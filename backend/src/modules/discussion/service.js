'use strict'
const prisma = require('../../config/prisma')

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

async function list({ skip = 0, take = 20 } = {}) {
  return prisma.discussion.findMany({
    skip,
    take,
    where: { isHidden: false },
    orderBy: { createdAt: 'desc' },
    include: DISCUSSION_INCLUDE,
  })
}

async function detail(id) {
  return prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { include: { profile: true } },
      category: { include: { parent: true } },
      comments: {
        where: { isHidden: false, parentId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { include: { profile: true } },
          replies: {
            where: { isHidden: false },
            orderBy: { createdAt: 'asc' },
            include: { user: { include: { profile: true } } },
          },
          _count: { select: { votes: true } },
        },
      },
      _count: {
        select: { votes: true, comments: true },
      },
    },
  })
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



