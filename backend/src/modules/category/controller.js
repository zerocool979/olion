const prisma = require('../../config/prisma')

exports.list = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: { children: true }
    })
    res.json(categories)
  } catch (e) { next(e) }
}
