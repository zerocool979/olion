const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log('✅ Prisma Client OK');
  await prisma.$disconnect();
}

main();
