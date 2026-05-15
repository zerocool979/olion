const prisma = require('../../config/prisma')

// ── Shared include block reused across queries ────────────────────────────────
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

// ── list ──────────────────────────────────────────────────────────────────────
// Used by GET /discussions (dashboard, home).
module.exports.list = async ({ skip = 0, take = 20 } = {}) => {
  return prisma.discussion.findMany({
    skip,
    take,
    where: { isHidden: false },
    orderBy: { createdAt: 'desc' },
    include: DISCUSSION_INCLUDE,
  })
}

// ── detail ────────────────────────────────────────────────────────────────────
module.exports.detail = async (id) => {
  return prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { include: { profile: true } },
      category: { include: { parent: true } },
      comments: {
        where: { isHidden: false },
        orderBy: { createdAt: 'asc' },
        include: { user: { include: { profile: true } } },
      },
    },
  })
}

// ── create ────────────────────────────────────────────────────────────────────
module.exports.create = async (userId, categoryId, title, content, mode, discipline) => {
  return prisma.discussion.create({
    data: { title, content, categoryId, userId, mode, discipline },
    include: DISCUSSION_INCLUDE,
  })
}

// ── search ────────────────────────────────────────────────────────────────────
// Supports:
//   q           – full-text search on title + content (case-insensitive)
//   category    – root category slug; expands to include all children
//   subcategory – child category slug; takes precedence over category
//   sort        – 'latest' | 'votes' | 'comments'
//   skip/take   – pagination
module.exports.search = async ({
  q = '',
  category = '',
  subcategory = '',
  sort = 'latest',
  skip = 0,
  take = 20,
} = {}) => {

  // ── Sorting ──────────────────────────────────────────────────────────────
  let orderBy
  switch (sort) {
    case 'votes':
      orderBy = { votes: { _count: 'desc' } }
      break
    case 'comments':
      orderBy = { comments: { _count: 'desc' } }
      break
    default:
      orderBy = { createdAt: 'desc' }
  }

  // ── Category filter ───────────────────────────────────────────────────────
  // Priority: subcategory > category > none
  let categoryIdFilter = undefined

  if (subcategory) {
    // Exact match on child slug
    const sub = await prisma.category.findFirst({ where: { slug: subcategory } })
    if (sub) categoryIdFilter = { equals: sub.id }
  } else if (category) {
    // Find parent + all its children so results include sub-topics
    const parent = await prisma.category.findFirst({
      where: { slug: category },
      include: { children: { select: { id: true } } },
    })
    if (parent) {
      const ids = [parent.id, ...parent.children.map((c) => c.id)]
      categoryIdFilter = { in: ids }
    }
  }

  // ── Full-text where clause ────────────────────────────────────────────────
  const where = {
    isHidden: false,
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(categoryIdFilter && { categoryId: categoryIdFilter }),
  }

  // ── Execute ───────────────────────────────────────────────────────────────
  const [data, total] = await Promise.all([
    prisma.discussion.findMany({ skip, take, where, orderBy, include: DISCUSSION_INCLUDE }),
    prisma.discussion.count({ where }),
  ])

  return { data, total }
}
