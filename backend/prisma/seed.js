const prisma = require('../src/config/prisma')

async function main() {
  await prisma.category.createMany({
    data: [{ name: 'General' }, { name: 'Education' }]
  })
}

main()
