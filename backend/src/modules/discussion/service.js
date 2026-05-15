const prisma = require('../../config/prisma')

module.exports = {
  create: async (userId, categoryId, title, content, mode, discipline) => {
    return prisma.discussion.create({
      data: {
        title,
        content,
        categoryId,
        userId,
        mode,
        discipline
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true
      }
    })
  },

  list: async (skip = 0, take = 10) => {
    return prisma.discussion.findMany({
      skip,
      take,
      where: { isHidden: false },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true,
        _count: {
          select: {
            comments: true,
            votes: true
          }
        }
      }
    })
  },

  detail: async (id) => {
    return prisma.discussion.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true,
        comments: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          },
          where: { isHidden: false }
        }
      }
    })
  }
}
