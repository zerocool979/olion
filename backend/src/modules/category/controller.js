const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

// GET /categories
// Returns only root categories (parentId = null) with discussion count.
// Sorted by discussion count desc so frontend always gets "most popular" first.
exports.getAll = async (req, res) => {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        _count: {
          select: { discussions: true },
        },
      },
      orderBy: {
        discussions: { _count: 'desc' },
      },
    })

    res.json({ success: true, data: categories })
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

    const parent = await db.category.findFirst({
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
