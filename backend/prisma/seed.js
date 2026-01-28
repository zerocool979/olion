const prisma = require('@prisma/client').PrismaClient
const db = new prisma()

async function main() {
  const teknologi = await db.category.create({
    data: { name: 'Teknologi' }
  })

  await db.category.createMany({
    data: [
      { name: 'Software', parentId: teknologi.id },
      { name: 'AI & Data', parentId: teknologi.id },
      { name: 'Keamanan Siber', parentId: teknologi.id }
    ]
  })
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())

