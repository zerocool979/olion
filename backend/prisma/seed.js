const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const db = new PrismaClient()

async function main() {
  // Clear existing data
  await db.vote.deleteMany()
  await db.comment.deleteMany()
  await db.report.deleteMany()
  await db.discussion.deleteMany()
  await db.reputationLog.deleteMany()
  await db.profile.deleteMany()
  await db.user.deleteMany()
  await db.category.deleteMany()

  // Create categories
  const general = await db.category.create({
    data: { name: 'General' }
  })

  const technology = await db.category.create({
    data: { name: 'Technology' }
  })

  const science = await db.category.create({
    data: { name: 'Science' }
  })

  // Create subcategories
  await db.category.createMany({
    data: [
      { name: 'Software', parentId: technology.id },
      { name: 'AI & Data', parentId: technology.id },
      { name: 'Physics', parentId: science.id },
      { name: 'Biology', parentId: science.id }
    ]
  })

  // Create sample users
  const user1 = await db.user.create({
    data: {
      email: 'user1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'USER',
      profile: {
        create: { username: 'anonymous_user1' }
      }
    },
    include: { profile: true }
  })

  const user2 = await db.user.create({
    data: {
      email: 'user2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'EXPERT',
      isVerifiedExpert: true,
      profile: {
        create: { username: 'expert_user2' }
      }
    },
    include: { profile: true }
  })

  // Create sample discussions
  const discussion1 = await db.discussion.create({
    data: {
      title: 'Best practices for Node.js development',
      content: 'What are the best practices we should follow when developing Node.js applications?',
      categoryId: technology.id,
      mode: 'INFORMATIF',
      discipline: 'AKADEMIK',
      userId: user1.id
    }
  })

  const discussion2 = await db.discussion.create({
    data: {
      title: 'Understanding Machine Learning Basics',
      content: 'Can someone explain the fundamentals of machine learning in simple terms?',
      categoryId: science.id,
      mode: 'KLARIFIKATIF',
      discipline: 'BEBAS',
      userId: user2.id
    }
  })

  // Create sample comment
  const comment1 = await db.comment.create({
    data: {
      content: 'Great question! Here are some key practices: use async/await, implement proper error handling, and follow the DRY principle.',
      discussionId: discussion1.id,
      userId: user2.id
    }
  })

  // Create sample vote
  const vote1 = await db.vote.create({
    data: {
      value: 1,
      discussionId: discussion1.id,
      userId: user2.id
    }
  })

  console.log('Seed completed successfully!')
  console.log(`Created: 3 categories, 2 users, 2 discussions, 1 comment, 1 vote`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())

