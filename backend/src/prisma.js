// backend/src/prisma.js

const { PrismaClient } = require('@prisma/client');

// =====================================================
// PRISMA SINGLETON
// =====================================================

// OLD (BERPOTENSI BUG)
// const prisma = new PrismaClient();

// FIXED: gunakan global singleton (aman untuk dev & prod)
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
const shutdown = async () => {
  try {
    console.log('🧹 Disconnecting Prisma...');
    await prisma.$disconnect();
    console.log('✅ Prisma disconnected');
  } catch (err) {
    console.error('❌ Prisma disconnect error:', err);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = prisma;
