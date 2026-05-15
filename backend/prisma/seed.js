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
    data: { name: 'General', slug: 'general', description: 'Diskusi umum dan pengumuman komunitas.' }
  })

  const technology = await db.category.create({
    data: { name: 'Technology', slug: 'technology', description: 'Teknologi, software, AI, data, dan inovasi digital.' }
  })

  const science = await db.category.create({
    data: { name: 'Science', slug: 'science', description: 'Pembahasan sains, penelitian, dan pengetahuan ilmiah.' }
  })

  const hukum = await db.category.create({
    data: { name: 'Hukum', slug: 'hukum', description: 'Diskusi hukum, regulasi, dan perlindungan hak.' }
  })

  const keuangan = await db.category.create({
    data: { name: 'Keuangan', slug: 'keuangan', description: 'Investasi, finansial, pajak, dan perencanaan uang.' }
  })

  const kesehatan = await db.category.create({
    data: { name: 'kesehatan', slug: 'kesehatan', description: 'Kesehatan fisik, mental, nutrisi, dan kebugaran.' }
  })

  const pendidikan = await db.category.create({
    data: { name: 'Pendidikan', slug: 'pendidikan', description: 'Sekolah, kuliah, kursus, dan pengembangan akademik.' }
  })

  const sosial = await db.category.create({
    data: { name: 'Sosial', slug: 'sosial', description: 'Budaya, masyarakat, komunitas, dan isu sosial.' }
  })

  const karier = await db.category.create({
    data: { name: 'Karier', slug: 'karier', description: 'Karier, pekerjaan, CV, interview, dan freelance.' }
  })

  const hubungan = await db.category.create({
    data: { name: 'Hubungan', slug: 'hubungan', description: 'Relasi, keluarga, persahabatan, dan komunikasi.' }
  })

  const lainnya = await db.category.create({
    data: { name: 'Lainnya', slug: 'lainnya', description: 'Topik umum lain di luar kategori utama.' }
  })

  // Create subcategories
  await db.category.createMany({
    data: [

      // General
      { name: 'Introductions', slug: 'introductions', parentId: general.id },
      { name: 'Announcements', slug: 'announcements', parentId: general.id },
      { name: 'Feedback', slug: 'feedback', parentId: general.id },

      // Technology
      { name: 'Software', slug: 'software', parentId: technology.id },
      { name: 'AI & Data', slug: 'ai-data', parentId: technology.id },
      { name: 'Physics', slug: 'physics',parentId: science.id },
      { name: 'Biology', slug: 'biologi',parentId: science.id },

      // Hukum
      { name: 'Pidana', slug: 'pidana', parentId: hukum.id },
      { name: 'Perdata', slug: 'perdata', parentId: hukum.id },
      { name: 'Ketenagakerjaan', slug: 'ketenagakerjaan', parentId: hukum.id },
      { name: 'Hak Kekayaan Intelektual', slug: 'hak-kekayaan-intelektual', parentId: hukum.id },

      // Keuangan
      { name: 'Investasi', slug: 'investasi', parentId: keuangan.id },
      { name: 'Perencanaan Keuangan', slug: 'perencanaan-keuangan', parentId: keuangan.id },
      { name: 'Pajak', slug: 'pajak', parentId: keuangan.id },
      { name: 'Pinjaman & Utang', slug: 'pinjaman-utang', parentId: keuangan.id },

      // Kesehatan
      { name: 'Nutrisi', slug: 'nutrisi', parentId: kesehatan.id },
      { name: 'Olahraga & Kebugaran', slug: 'olahraga-kebbugaran', parentId: kesehatan.id },
      { name: 'Kesehatan Mental', slug: 'kesehatan-mental', parentId: kesehatan.id },
      { name: 'Penyakit & Pengobatan', slug: 'penyakit-pengobatan', parentId: kesehatan.id },

      // Pendidikan
      { name: 'Sekolah Dasar', slug: 'sekolah-dasar', parentId: pendidikan.id },
      { name: 'SMP & SMA', slug: 'smp-sma', parentId: pendidikan.id },
      { name: 'Perkuliahan', slug: 'perkuliahan', parentId: pendidikan.id },
      { name: 'Kursus & Sertifikasi', slug: 'kursus-sertifikasi', parentId: pendidikan.id },

      // Sosial
      { name: 'Budaya & Tradisi', slug: 'budaya-tradisi', parentId: sosial.id },
      { name: 'Lingkungan', slug: 'lingkungan', parentId: sosial.id },
      { name: 'Politik & Kebijakan', slug: 'politik-kebijakan', parentId: sosial.id },
      { name: 'Komunitas', slug: 'komunitas', parentId: sosial.id },

      // Karier
      { name: 'CV & Wawancara', slug: 'cv-wawancara', parentId: karier.id },
      { name: 'Pengembangan Diri', slug: 'pengembangan-diri', parentId: karier.id },
      { name: 'Wirausaha', slug: 'wirausaha', parentId: karier.id },
      { name: 'Remote Work & Freelance', slug: 'remote-work-freelance', parentId: karier.id },

      // Hubungan
      { name: 'Pacaran', slug: 'pacaran', parentId: hubungan.id },
      { name: 'Keluarga', slug: 'keluarga', parentId: hubungan.id },
      { name: 'Persahabatan', slug: 'persahabatan', parentId: hubungan.id },
      { name: 'Konflik & Mediasi', slug: 'konflik-mediasi', parentId: hubungan.id },

      // Lainnya
      { name: 'Hobi & Hiburan', slug: 'hobi-hiburan', parentId: lainnya.id },
      { name: 'Kuliner', slug: 'kuliner', parentId: lainnya.id },
      { name: 'Perjalanan', slug: 'perjalanan', parentId: lainnya.id },
      { name: 'Tips & Trik', slug: 'tips-trik', parentId: lainnya.id },

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

  // Create sample expert
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

  // Create admin user
  const admin = await db.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      profile: {
        create: { username: 'admin_olion' }
      }
    },
    include: { profile: true }
  })

  // Create moderator user
  const moderator = await db.user.create({
    data: {
      email: 'moderator@example.com',
      password: await bcrypt.hash('moderator123', 10),
      role: 'MODERATOR',
      profile: {
        create: { username: 'moderator_olion' }
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
  console.log(`Created: 3 categories, 4 users, 2 discussions, 1 comment, 1 vote`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())

