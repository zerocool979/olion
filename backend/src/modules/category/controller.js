const prisma = require('../../config/prisma')

// GET /categories
// Returns only root categories (parentId = null) with discussion count.
// Sorted by discussion count desc so frontend always gets "most popular" first.
exports.getAll = async (req, res) => {
  try {
    const roots = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { discussions: true } }
          }
        },
        _count: { select: { discussions: true } }
      }
    })

    const categoriesWithTotal = roots.map(cat => {
      const childTotal = cat.children.reduce(
        (sum, child) => sum + child._count.discussions, 0
      )
      return {
        ...cat,
        totalDiscussions: cat._count.discussions + childTotal,
        children: cat.children.map(({ _count, ...child }) => child),
      }
    })

    categoriesWithTotal.sort((a, b) => b.totalDiscussions - a.totalDiscussions)

    res.json({ success: true, data: categoriesWithTotal })
  } catch (error) {
    console.error('[category.getAll]', error)
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori' })
  }
}

// GET /categories/:slug/subcategories
// Returns children of a given parent slug — used by frontend search filter.
exports.getSubcategories = async (req, res) => {
  try {
    const { slug } = req.params

    const parent = await prisma.category.findFirst({
      where: { slug },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
      },
    })

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' })
    }

    res.json({ success: true, data: parent.children })
  } catch (error) {
    console.error('[category.getSubcategories]', error)
    res.status(500).json({ success: false, message: 'Gagal mengambil subkategori' })
  }
}
