const prisma = require('../../config/prisma')

exports.getStats = async (req, res) => {
  try {
    const discussions = await prisma.discussion.count()
    const users = await prisma.user.count()
    const categories = await prisma.category.count()
    const experts = await prisma.user.count({
      where: {
        role: 'EXPERT',
      },
    })

    const moderators = await prisma.user.count({
      where: {
        role: 'MODERATOR',
      },
    })

    res.json({
      data: {
        discussions,
        users,
        experts,
        moderators,
        categories,
        protection: '99%',
      },
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: 'Failed get stats',
    })
  }
}
