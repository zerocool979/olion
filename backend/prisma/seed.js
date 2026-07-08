'use strict'
// =============================================================================
// seed.js — OLION  (KOMPREHENSIF — semua 18 model dari schema.prisma final)
// =============================================================================
//
// Cara pakai:
//   node prisma/seed.js           → seed penuh
//   node prisma/seed.js --reset   → hapus semua data, lalu seed ulang
//
// Idempoten: aman dijalankan lebih dari satu kali (pakai upsert / skip jika
// data sudah ada). Exception: --reset akan menghapus semua data terlebih dahulu.
//
// Urutan seeding mengikuti dependency graph:
//   Badge → Category/Tag → User+Profile → Follow →
//   Discussion+DiscussionTag → Comment → Vote → ReputationLog →
//   UserBadge → Notification → Conversation+Participant+Message →
//   ExpertApplication → Report
// =============================================================================

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db  = new PrismaClient()
const ARG = process.argv.slice(2)

// ─── Warna terminal ────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', cyan: '\x1b[36m', yellow: '\x1b[33m',
  red: '\x1b[31m', grey: '\x1b[90m', blue: '\x1b[34m',
}
const ok   = (msg) => console.log(`${c.green}  ✓${c.reset} ${msg}`)
const info = (msg) => console.log(`${c.cyan}  →${c.reset} ${msg}`)
const warn = (msg) => console.log(`${c.yellow}  ⚠${c.reset} ${msg}`)
const step = (msg) => console.log(`\n${c.bold}${c.blue}► ${msg}${c.reset}`)

// ─── Helper: random dari array ────────────────────────────────────────────────
const rng    = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rngInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// ─── Pseudonim anonim ─────────────────────────────────────────────────────────
const ADJ  = ['Bijak','Cerdas','Tangguh','Kreatif','Kritis','Logis','Analitis',
               'Tajam','Berani','Jeli','Teliti','Lantang','Fasih','Sigap']
const NOUN = ['Pejuang','Pemikir','Inovator','Cendekia','Eksplorer','Katalis',
               'Pioner','Pengamat','Narasi','Aksara','Nalar','Wacana']
const pseudoName = () =>
  `${rng(ADJ)}_${rng(NOUN)}_${Math.floor(Math.random() * 9000) + 1000}`

// =============================================================================
// DATA STATIK
// =============================================================================

// ── Badges (7 bawaan) ─────────────────────────────────────────────────────────
const BADGES = [
  { slug: 'first_post',      name: 'Penulis Pertama',      icon: '✍️',
    description: 'Membuat diskusi pertama kamu di OLION',   threshold: 0   },
  { slug: 'first_answer',    name: 'Penolong',              icon: '💬',
    description: 'Memberikan komentar pertama di OLION',    threshold: 0   },
  { slug: 'reputation_50',   name: 'Kontributor',           icon: '⭐',
    description: 'Mencapai 50 poin reputasi',               threshold: 50  },
  { slug: 'reputation_100',  name: 'Terpercaya',            icon: '🌟',
    description: 'Mencapai 100 poin reputasi',              threshold: 100 },
  { slug: 'reputation_500',  name: 'Pakar Komunitas',       icon: '🏆',
    description: 'Mencapai 500 poin reputasi',              threshold: 500 },
  { slug: 'reputation_1000', name: 'Legenda',               icon: '💎',
    description: 'Mencapai 1000 poin reputasi',             threshold: 1000},
  { slug: 'verified_expert', name: 'Pakar Terverifikasi',   icon: '✅',
    description: 'Diverifikasi sebagai pakar di bidangnya', threshold: 0   },
]

// ── Kategori root (6) + subkategori (9) ──────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Sains & Teknologi', slug: 'sains-teknologi',
    color: '#1565C0', borderColor: '#0D47A1',
    description: 'Diskusi ilmu pengetahuan alam dan teknologi terkini',
    subs: [
      { name: 'Kecerdasan Buatan', slug: 'ai',
        description: 'AI, Machine Learning, Deep Learning, LLM' },
      { name: 'Pemrograman',       slug: 'pemrograman',
        description: 'Bahasa pemrograman, arsitektur software, best practice' },
      { name: 'Fisika & Sains',    slug: 'fisika',
        description: 'Fisika, kimia, biologi, dan sains dasar lainnya' },
    ],
  },
  {
    name: 'Sosial & Budaya', slug: 'sosial-budaya',
    color: '#6A1B9A', borderColor: '#4A148C',
    description: 'Diskusi dinamika sosial, budaya, dan kemasyarakatan',
    subs: [
      { name: 'Politik & Kebijakan', slug: 'politik',
        description: 'Kebijakan publik, demokrasi, tata kelola pemerintahan' },
      { name: 'Seni & Sastra',       slug: 'seni',
        description: 'Karya seni, sastra, musik, dan ekspresi budaya' },
    ],
  },
  {
    name: 'Ekonomi & Bisnis', slug: 'ekonomi-bisnis',
    color: '#2E7D32', borderColor: '#1B5E20',
    description: 'Diskusi ekonomi makro/mikro, keuangan, dan dunia bisnis',
    subs: [
      { name: 'Startup & Inovasi', slug: 'startup',
        description: 'Ekosistem startup, kewirausahaan, dan inovasi produk' },
      { name: 'Investasi & Pasar', slug: 'investasi',
        description: 'Saham, obligasi, reksa dana, kripto, dan pasar modal' },
    ],
  },
  {
    name: 'Kesehatan', slug: 'kesehatan',
    color: '#C62828', borderColor: '#B71C1C',
    description: 'Diskusi kesehatan fisik, mental, dan medis berbasis bukti',
    subs: [],
  },
  {
    name: 'Pendidikan', slug: 'pendidikan',
    color: '#E65100', borderColor: '#BF360C',
    description: 'Diskusi kurikulum, pedagogi, riset pendidikan, dan literasi',
    subs: [],
  },
  {
    name: 'Lingkungan & Iklim', slug: 'lingkungan',
    color: '#00695C', borderColor: '#004D40',
    description: 'Diskusi krisis iklim, keberlanjutan, dan lingkungan hidup',
    subs: [],
  },
]

// ── Tags (12) ─────────────────────────────────────────────────────────────────
const TAGS = [
  { name: 'AI',            slug: 'ai-tag' },
  { name: 'Teknologi',     slug: 'teknologi' },
  { name: 'Pendidikan',    slug: 'pendidikan-tag' },
  { name: 'Lingkungan',    slug: 'lingkungan-tag' },
  { name: 'Ekonomi',       slug: 'ekonomi-tag' },
  { name: 'Kesehatan',     slug: 'kesehatan-tag' },
  { name: 'Politik',       slug: 'politik-tag' },
  { name: 'Filsafat',      slug: 'filsafat' },
  { name: 'Riset',         slug: 'riset' },
  { name: 'Open Source',   slug: 'open-source' },
  { name: 'Startup',       slug: 'startup-tag' },
  { name: 'Masa Depan',    slug: 'masa-depan' },
]

// ── Sample diskusi (10) ───────────────────────────────────────────────────────
const DISCUSSIONS = [
  {
    title: 'Apakah AI akan menggantikan pekerjaan programmer dalam 10 tahun ke depan?',
    content: `Model bahasa besar seperti GPT-4, Claude, dan GitHub Copilot telah mengubah cara developer bekerja secara signifikan. Banyak tugas yang dulu membutuhkan jam kerja kini bisa diselesaikan dalam menit.

Namun pertanyaan yang lebih mendasar adalah: apakah ini sekadar alat bantu, atau awal dari redudansi profesi programmer secara masif?

Beberapa perspektif yang perlu dipertimbangkan:
1. AI masih kesulitan memahami konteks bisnis yang kompleks
2. Debugging sistem legacy masih butuh pemahaman domain yang dalam
3. Peran programmer mungkin bergeser ke "AI orchestrator"

Apa pandangan kalian sebagai praktisi atau akademisi di bidang ini?`,
    catSlug: 'ai', mode: 'ARGUMENTATIF', discipline: 'AKADEMIK',
    tags: ['ai-tag', 'teknologi', 'masa-depan'],
  },
  {
    title: 'Dampak media sosial terhadap kualitas diskusi publik di Indonesia',
    content: `Riset Pew Research (2022) menunjukkan bahwa polarisasi politik di platform media sosial meningkat 40% dalam 5 tahun terakhir di negara-negara berkembang.

Di Indonesia, fenomena ini terlihat jelas menjelang Pemilu: ruang diskusi publik semakin terpecah ke dalam gelembung-gelembung informasi (filter bubble) yang memperkuat bias konfirmasi.

Yang perlu kita diskusikan:
- Apakah algoritma rekomendasi yang menjadi akar masalahnya?
- Bagaimana peran platform vs pengguna dalam menjaga kualitas diskursus?
- Apakah regulasi konten adalah solusi yang tepat?`,
    catSlug: 'politik', mode: 'EVALUATIF', discipline: 'AKADEMIK',
    tags: ['politik-tag', 'teknologi', 'riset'],
  },
  {
    title: 'Strategi investasi di era suku bunga tinggi 2024–2025',
    content: `Bank Indonesia mempertahankan BI Rate di level 6,25% sepanjang semester pertama 2024, mengikuti tren hawkish The Fed. Kondisi ini menciptakan landscape investasi yang sangat berbeda dari era suku bunga rendah 2020–2021.

Instrumen yang perlu dievaluasi ulang:
1. **Obligasi pemerintah (SBN)**: yield menarik tapi harga turun
2. **Reksa dana pasar uang**: aman tapi imbal hasil terbatas
3. **Saham growth vs value**: rotasi signifikan ke value stocks
4. **Properti**: cash flow positif tapi capital gain terbatas
5. **Kripto**: volatilitas ekstrem, peran sebagai hedge masih diperdebatkan

Bagaimana kalian menyesuaikan portofolio dalam kondisi ini?`,
    catSlug: 'investasi', mode: 'PRAKTIS', discipline: 'PROFESIONAL',
    tags: ['ekonomi-tag', 'startup-tag'],
  },
  {
    title: 'Kurikulum Merdeka: sudahkah benar-benar "memerdekakan" siswa?',
    content: `Kurikulum Merdeka (KM) resmi diluncurkan Kemendikbudristek pada 2022 sebagai pengganti Kurikulum 2013. Dengan pendekatan "Pembelajaran Berdiferensiasi", KM mengklaim memberikan fleksibilitas lebih bagi guru dan siswa.

Namun laporan dari sejumlah peneliti pendidikan menunjukkan gap antara konsep dan implementasi:
- Banyak sekolah mengimplementasikan KM secara superfisial tanpa memahami filosofinya
- Guru kekurangan pelatihan yang memadai
- Asesmen Nasional masih cenderung mengukur hafalan, bukan kompetensi

Apakah kalian (guru, orang tua, atau peneliti pendidikan) melihat perubahan nyata di lapangan?`,
    catSlug: 'pendidikan', mode: 'EVALUATIF', discipline: 'AKADEMIK',
    tags: ['pendidikan-tag', 'riset'],
  },
  {
    title: 'Net Zero 2060: realistis atau sekadar janji politik Indonesia?',
    content: `Indonesia berkomitmen mencapai net zero emission pada 2060 dalam NDC (Nationally Determined Contribution) yang diperbarui. Namun realitas di lapangan memunculkan banyak tanda tanya:

**Fakta yang mendukung skeptisisme:**
- Pembangunan PLTU batu bara masih berlanjut di beberapa daerah
- Subsidi energi fosil masih jauh lebih besar dari subsidi EBT
- Deforestasi belum sepenuhnya terkendali

**Fakta yang mendukung optimisme:**
- Target 23% EBT pada 2025 (meski perlu diakselerasi)
- Potensi geotermal terbesar kedua di dunia
- Pertumbuhan industri nikel untuk baterai EV

Apakah target ini achievable, atau kita perlu narasi yang lebih jujur soal trade-off pembangunan?`,
    catSlug: 'lingkungan', mode: 'ARGUMENTATIF', discipline: 'RASIONAL',
    tags: ['lingkungan-tag', 'politik-tag', 'masa-depan'],
  },
  {
    title: 'Krisis kesehatan mental mahasiswa Indonesia: darurat yang diabaikan?',
    content: `Survei INTO THE LIGHT Indonesia (2023) menemukan bahwa 1 dari 3 mahasiswa pernah mengalami gejala depresi sedang hingga berat, namun hanya 9% yang mencari bantuan profesional.

Hambatan utama:
- Stigma sosial yang masih kuat
- Keterbatasan akses dan biaya konseling
- Budaya "bertahan" yang diromantisasi

Yang ingin saya diskusikan: apakah kampus sudah melakukan cukup? Bagaimana perbandingan dengan kebijakan di negara lain? Dan apa peran platform diskusi seperti OLION dalam membangun ruang aman untuk topik ini?`,
    catSlug: 'kesehatan', mode: 'EKSPLORATIF', discipline: 'AKADEMIK',
    tags: ['kesehatan-tag', 'riset', 'pendidikan-tag'],
  },
  {
    title: 'Open source vs proprietary: mengapa banyak startup Indonesia masih ragu?',
    content: `Adopsi open source di startup Indonesia masih jauh di bawah India dan Vietnam. Padahal biaya lisensi software proprietary bisa menyedot 15–30% operational budget untuk startup early-stage.

Dari pengalaman saya di beberapa startup:
- Ketakutan utama: "tidak ada yang bertanggung jawab jika ada masalah"
- Realita: komunitas OSS seringkali lebih responsif dari vendor komersial
- Hidden cost OSS: waktu setup, customisasi, dan maintenance in-house

Apakah ini soal edukasi, atau ada faktor struktural lain yang menghambat adopsi OSS di ekosistem startup Indonesia?`,
    catSlug: 'startup', mode: 'PRAKTIS', discipline: 'PROFESIONAL',
    tags: ['open-source', 'startup-tag', 'teknologi'],
  },
  {
    title: 'Etika AI dalam pembuatan konten: di mana garis batasnya?',
    content: `Generative AI kini bisa membuat artikel, gambar, musik, dan video yang sulit dibedakan dari karya manusia. Ini memunculkan pertanyaan filosofis sekaligus praktis:

1. **Kepemilikan intelektual**: siapa yang memiliki output AI — pengguna, developer model, atau tidak ada?
2. **Transparansi**: haruskah konten AI-generated wajib diberi label?
3. **Dampak pada kreator**: apakah ini demokratisasi kreativitas atau devaluasi kerja kreatif?
4. **Misinformasi**: deepfake dan synthetic media sebagai ancaman epistemik

Sebagai pengguna, akademisi, atau pembuat kebijakan — di mana kalian menarik garis batas yang etis?`,
    catSlug: 'ai', mode: 'ARGUMENTATIF', discipline: 'RASIONAL',
    tags: ['ai-tag', 'filsafat', 'teknologi'],
  },
  {
    title: 'Apakah demokrasi deliberatif bisa diterapkan di era digital?',
    content: `Jurgen Habermas mengonseptualisasikan "ruang publik" sebagai arena di mana warga berdebat secara rasional untuk mencapai konsensus. Di era digital, apakah konsep ini masih relevan?

Tantangan spesifik era digital:
- Algoritma memaksimalkan engagement, bukan kualitas deliberasi
- Anonimitas bisa mendorong kebebasan berbicara ATAU disinhibition negatif
- Kesenjangan akses digital (digital divide) menciptakan ketidaksetaraan suara

Platform seperti OLION justru mencoba merespons tantangan ini dengan mode diskusi terstruktur dan sistem reputasi. Apakah ini langkah yang tepat, atau ada desain yang lebih baik?`,
    catSlug: 'politik', mode: 'EKSPLORATIF', discipline: 'AKADEMIK',
    tags: ['politik-tag', 'filsafat', 'teknologi'],
  },
  {
    title: 'Mengapa penelitian reprodusibilitas (replication crisis) penting untuk semua bidang?',
    content: `"Replication crisis" yang dimulai dari psikologi kini merambah ke ekonomi, kedokteran, bahkan ilmu komputer (khususnya ML). Lebih dari 50% studi landmark di beberapa bidang tidak berhasil direplikasi.

Implikasinya sangat luas:
- Kebijakan publik yang didasarkan pada evidence yang tidak solid
- Obat-obatan yang disetujui berdasarkan trial yang tidak representatif
- Model ML yang overfitting pada benchmark tertentu

Sebagai akademisi atau praktisi yang sering mengkonsumsi hasil riset — bagaimana kalian mengevaluasi kredibilitas sebuah studi? Dan apa yang bisa dilakukan komunitas ilmiah Indonesia?`,
    catSlug: 'sains-teknologi', mode: 'KLARIFIKATIF', discipline: 'AKADEMIK',
    tags: ['riset', 'pendidikan-tag', 'ai-tag'],
  },
]

// ── Komentar template ─────────────────────────────────────────────────────────
const COMMENT_TEMPLATES = {
  expert: [
    'Dari perspektif akademis, isu ini memiliki beberapa dimensi yang sering terlewat dalam diskusi populer. Pertama, penting untuk membedakan antara korelasi dan kausalitas dalam data yang sering dikutip. Kedua, konteks historis dan komparatif lintas negara memberikan nuansa yang lebih kaya.',
    'Saya ingin menambahkan perspektif berbasis riset terbaru. Beberapa studi longitudinal dalam 5 tahun terakhir menunjukkan hasil yang lebih kompleks dari narasi utama. Kuncinya adalah pada metodologi pengukuran dan definisi operasional yang digunakan.',
    'Ini adalah pertanyaan yang sangat relevan dan telah menjadi subjek perdebatan serius di komunitas ilmiah. Konsensus saat ini mengarah pada pandangan yang lebih bernuansa dari yang sering disederhanakan di media mainstream.',
    'Dari sudut pandang praktis, ada beberapa intervensi berbasis bukti yang terbukti efektif di konteks serupa. Yang perlu diperhatikan adalah adaptasi konteks — apa yang berhasil di satu setting tidak selalu bisa langsung diterapkan.',
  ],
  regular: [
    'Poin yang sangat menarik. Saya pernah mengalami langsung situasi yang kamu gambarkan, dan memang gap antara teori dan praktik seringkali lebih besar dari yang kita bayangkan.',
    'Setuju dengan premis utama, tapi saya kira ada faktor yang belum dipertimbangkan: aspek insentif ekonomi jangka pendek yang sering mengalahkan pertimbangan jangka panjang.',
    'Perspektif yang segar! Selama ini saya melihat isu ini dari satu sudut pandang saja. Argumen yang kamu bawa membuat saya mempertimbangkan ulang beberapa asumsi yang selama ini saya pegang.',
    'Terima kasih sudah memulai diskusi ini. Topik ini sangat penting tapi jarang dibahas dengan kedalaman yang memadai. Saya ingin menambahkan bahwa pengalaman di daerah/sektor yang berbeda bisa sangat bervariasi.',
    'Ada data terbaru yang menarik soal ini. Laporan OECD 2024 menunjukkan tren yang berbeda dari yang kita asumsikan — mungkin perlu kita evaluasi ulang frameworknya.',
  ],
  reply: [
    'Poin yang bagus! Saya ingin melengkapi dengan menambahkan bahwa...',
    'Terima kasih atas insight-nya. Memang hal ini sering diabaikan dalam diskusi mainstream.',
    'Saya setuju, dan data terbaru semakin memperkuat argumen ini.',
    'Menarik perspektifnya. Tapi apakah sudah mempertimbangkan variabel X yang mungkin menjadi confounding factor?',
    'Ini mengingatkan saya pada kasus serupa yang pernah saya baca. Kesimpulannya cukup mengejutkan.',
  ],
}

// =============================================================================
// FUNGSI SEEDING
// =============================================================================

async function seedBadges() {
  step('Badge')
  let count = 0
  for (const badge of BADGES) {
    await db.badge.upsert({ where: { slug: badge.slug }, update: badge, create: badge })
    count++
  }
  ok(`${count} badge di-upsert`)
  return db.badge.findMany()
}

async function seedCategories() {
  step('Category')
  const created = {}

  for (const cat of CATEGORIES) {
    const { subs, ...catData } = cat
    const parent = await db.category.upsert({
      where:  { slug: cat.slug },
      update: catData,
      create: catData,
    })
    created[cat.slug] = parent

    for (const sub of subs) {
      const child = await db.category.upsert({
        where:  { slug: sub.slug },
        update: { ...sub, parentId: parent.id },
        create: { ...sub, parentId: parent.id },
      })
      created[sub.slug] = child
    }
  }

  const total = await db.category.count()
  ok(`${total} kategori tersedia`)
  return created
}

async function seedTags() {
  step('Tag')
  const created = {}
  for (const tag of TAGS) {
    const t = await db.tag.upsert({ where: { slug: tag.slug }, update: tag, create: tag })
    created[tag.slug] = t
  }
  ok(`${TAGS.length} tag di-upsert`)
  return created
}

async function seedUsers() {
  step('User + Profile')

  if (await db.user.count() > 0) {
    warn('User sudah ada, melewati pembuatan user — gunakan --reset untuk reset penuh')
    return db.user.findMany({ include: { profile: true } })
  }

  const hash = await bcrypt.hash('Password123!', 12)
  const users = []

  // ── Akun khusus ─────────────────────────────────────────────────────────────
  const specials = [
    {
      email: 'admin@olion.id', role: 'ADMIN', isVerifiedExpert: false,
      username: 'admin_olion', bio: 'Administrator platform OLION. Bertanggung jawab atas kebijakan dan konfigurasi sistem.',
    },
    {
      email: 'mod@olion.id', role: 'MODERATOR', isVerifiedExpert: false,
      username: 'moderator_olion', bio: 'Moderator komunitas OLION. Menjaga kualitas diskusi dan menindaklanjuti laporan.',
    },
    {
      email: 'pakar@olion.id', role: 'EXPERT', isVerifiedExpert: true,
      username: 'dr_bilal_ai', bio: 'Peneliti AI & Data Science. PhD Ilmu Komputer UI. Fokus pada NLP dan etika AI.',
    },
    {
      email: 'pakar2@olion.id', role: 'EXPERT', isVerifiedExpert: true,
      username: 'prof_rina_sosio', bio: 'Sosiolog dan peneliti kebijakan publik. Anggota Dewan Riset Nasional.',
    },
  ]

  for (const s of specials) {
    const u = await db.user.create({
      data: {
        email: s.email, password: hash, role: s.role, isVerifiedExpert: s.isVerifiedExpert,
        profile: { create: { username: s.username, bio: s.bio } },
      },
      include: { profile: true },
    })
    users.push(u)
  }

  // ── 12 user reguler ──────────────────────────────────────────────────────────
  const regularBios = [
    'Mahasiswa teknik informatika semester 6. Suka ngoprek dan debat soal teknologi.',
    'Guru SMA yang tertarik dengan inovasi pendidikan dan teknologi pembelajaran.',
    'Fresh graduate ekonomi yang sedang belajar investasi dan pasar modal.',
    'Jurnalis independen. Tertarik dengan isu sosial, politik, dan kebebasan pers.',
    'Software engineer 3 tahun pengalaman. Open source enthusiast.',
    'Peneliti kebijakan iklim di LSM lingkungan. Percaya pada solusi berbasis data.',
    'Dokter umum yang aktif mengikuti perkembangan evidence-based medicine.',
    'Pengusaha startup yang sedang membangun produk di bidang edtech.',
    'Filsuf amatir. Lebih suka pertanyaan daripada jawaban.',
    'Data analyst di perusahaan FMCG. Suka menganalisis tren dan pola.',
    'Aktivis mahasiswa yang tertarik dengan demokrasi deliberatif.',
    'Pensiunan PNS yang ingin tetap mengikuti perkembangan zaman.',
  ]

  for (let i = 0; i < 12; i++) {
    const u = await db.user.create({
      data: {
        email: `user${i + 1}@olion.id`, password: hash, role: 'USER',
        profile: { create: { username: pseudoName(), bio: regularBios[i] } },
      },
      include: { profile: true },
    })
    users.push(u)
  }

  ok(`${users.length} user dibuat (4 khusus + 12 reguler)`)
  return users
}

async function seedFollows(users) {
  step('Follow')

  // Pattern: user reguler follow expert; beberapa user saling follow
  const follows = []
  const [admin, mod, expert1, expert2, ...regulars] = users

  // Semua user reguler follow kedua expert
  for (const u of regulars) {
    follows.push({ followerId: u.id, followingId: expert1.id })
    follows.push({ followerId: u.id, followingId: expert2.id })
  }

  // 6 user pertama follow mod
  for (const u of regulars.slice(0, 6)) {
    follows.push({ followerId: u.id, followingId: mod.id })
  }

  // User saling follow (rantai: user1→user2→user3→...→user6→user1)
  for (let i = 0; i < 6; i++) {
    follows.push({ followerId: regulars[i].id, followingId: regulars[(i + 1) % 6].id })
  }

  let count = 0
  for (const f of follows) {
    await db.follow.upsert({
      where:  { followerId_followingId: f },
      update: {},
      create: f,
    })
    count++
  }

  ok(`${count} relasi follow dibuat`)
}

async function seedDiscussions(users, categories, tags) {
  step('Discussion + DiscussionTag')

  const [admin, mod, expert1, expert2, ...regulars] = users
  const authors = [expert1, expert2, ...regulars]

  const created = []

  for (let i = 0; i < DISCUSSIONS.length; i++) {
    const d    = DISCUSSIONS[i]
    const cat  = categories[d.catSlug] ?? categories['sains-teknologi']
    const author = authors[i % authors.length]

    // Buat atau skip jika title sudah ada
    const existing = await db.discussion.findFirst({ where: { title: d.title } })
    if (existing) {
      created.push(existing)
      continue
    }

    const disc = await db.discussion.create({
      data: {
        title:      d.title,
        content:    d.content,
        mode:       d.mode,
        discipline: d.discipline,
        viewCount:  rngInt(20, 400),
        userId:     author.id,
        categoryId: cat.id,
      },
    })

    // Attach tags
    for (const tagSlug of (d.tags ?? [])) {
      const tag = tags[tagSlug]
      if (tag) {
        await db.discussionTag.upsert({
          where:  { discussionId_tagId: { discussionId: disc.id, tagId: tag.id } },
          update: {},
          create: { discussionId: disc.id, tagId: tag.id },
        })
      }
    }

    created.push(disc)
  }

  ok(`${created.length} diskusi tersedia`)
  return created
}

async function seedComments(users, discussions) {
  step('Comment (root + replies)')

  const [admin, mod, expert1, expert2, ...regulars] = users
  const allComments = []

  for (const disc of discussions) {
    const existingCount = await db.comment.count({ where: { discussionId: disc.id } })
    if (existingCount > 0) continue

    // 1 komentar dari expert
    const expertComment = await db.comment.create({
      data: {
        discussionId: disc.id,
        userId:       rng([expert1.id, expert2.id]),
        content:      rng(COMMENT_TEMPLATES.expert),
      },
    })
    allComments.push(expertComment)

    // 2–4 komentar dari user reguler
    const commenters = shuffle(regulars).slice(0, rngInt(2, 4))
    const rootComments = [expertComment]

    for (const user of commenters) {
      const c = await db.comment.create({
        data: {
          discussionId: disc.id,
          userId:       user.id,
          content:      rng(COMMENT_TEMPLATES.regular),
        },
      })
      rootComments.push(c)
      allComments.push(c)
    }

    // 2–3 reply ke komentar root
    for (let r = 0; r < rngInt(2, 3); r++) {
      const parent  = rng(rootComments)
      const replier = rng(regulars)
      if (replier.id === parent.userId) continue

      const reply = await db.comment.create({
        data: {
          discussionId: disc.id,
          userId:       replier.id,
          parentId:     parent.id,
          content:      rng(COMMENT_TEMPLATES.reply),
        },
      })
      allComments.push(reply)
    }
  }

  ok(`${allComments.length} komentar baru dibuat`)
  return db.comment.findMany()
}

async function seedVotes(users, discussions, comments) {
  step('Vote (diskusi + komentar)')

  const [admin, mod, expert1, expert2, ...regulars] = users
  const voters = [expert1, expert2, ...regulars]
  let count = 0

  // Vote pada diskusi: setiap diskusi dapat 3–8 upvote, 0–2 downvote
  for (const disc of discussions) {
    const upvoters   = shuffle(voters).slice(0, rngInt(3, 8))
    const downvoters = shuffle(voters.filter(v => !upvoters.includes(v))).slice(0, rngInt(0, 2))

    for (const u of upvoters) {
      await db.vote.upsert({
        where:  { userId_discussionId: { userId: u.id, discussionId: disc.id } },
        update: { value: 1 },
        create: { userId: u.id, discussionId: disc.id, value: 1 },
      }).catch(() => {}) // skip jika constraint conflict
      count++
    }
    for (const u of downvoters) {
      await db.vote.upsert({
        where:  { userId_discussionId: { userId: u.id, discussionId: disc.id } },
        update: { value: -1 },
        create: { userId: u.id, discussionId: disc.id, value: -1 },
      }).catch(() => {})
      count++
    }
  }

  // Vote pada komentar: pilih 50% komentar, berikan 1–4 upvote
  const rootComments = comments.filter(c => !c.parentId)
  const sampledComments = shuffle(rootComments).slice(0, Math.ceil(rootComments.length * 0.5))

  for (const comment of sampledComments) {
    const upvoters = shuffle(voters).slice(0, rngInt(1, 4))
    for (const u of upvoters) {
      if (u.id === comment.userId) continue // tidak bisa vote konten sendiri
      await db.vote.upsert({
        where:  { userId_commentId: { userId: u.id, commentId: comment.id } },
        update: { value: 1 },
        create: { userId: u.id, commentId: comment.id, value: 1 },
      }).catch(() => {})
      count++
    }
  }

  ok(`${count} vote dibuat`)
}

async function seedReputationLogs(users, discussions, comments) {
  step('ReputationLog')

  // Hitung reputasi dari vote yang ada di DB
  const discVotes = await db.vote.findMany({
    where: { discussionId: { not: null } },
    include: { discussion: { select: { userId: true } } },
  })
  const commVotes = await db.vote.findMany({
    where: { commentId: { not: null } },
    include: { comment: { select: { userId: true } } },
  })

  // Agregat per pemilik konten
  const repMap = {}
  const addRep = (userId, point, reason) => {
    if (!userId) return
    if (!repMap[userId]) repMap[userId] = []
    repMap[userId].push({ point, reason })
  }

  for (const v of discVotes) {
    const ownerId = v.discussion?.userId
    if (!ownerId || ownerId === v.userId) continue
    addRep(ownerId, v.value === 1 ? 10 : -2, v.value === 1 ? 'Upvote pada diskusi' : 'Downvote pada diskusi')
  }

  for (const v of commVotes) {
    const ownerId = v.comment?.userId
    if (!ownerId || ownerId === v.userId) continue
    addRep(ownerId, v.value === 1 ? 5 : -1, v.value === 1 ? 'Upvote pada komentar' : 'Downvote pada komentar')
  }

  // +5 per diskusi yang dibuat
  for (const d of discussions) {
    if (d.userId) addRep(d.userId, 5, 'Membuat diskusi baru')
  }

  // +2 per komentar root yang dibuat
  const allComments = await db.comment.findMany({ where: { parentId: null } })
  for (const c of allComments) {
    if (c.userId) addRep(c.userId, 2, 'Memberikan komentar')
  }

  // Bonus +50 untuk expert
  for (const u of users.filter(u => u.isVerifiedExpert)) {
    addRep(u.id, 50, 'Bonus Pakar Terverifikasi')
  }

  // Tulis ke DB (hanya jika belum ada log untuk user tersebut)
  let totalLogs = 0
  for (const [userId, logs] of Object.entries(repMap)) {
    const existing = await db.reputationLog.count({ where: { userId } })
    if (existing > 0) continue

    for (const log of logs) {
      await db.reputationLog.create({ data: { userId, ...log } })
      totalLogs++
    }
  }

  ok(`${totalLogs} reputation log dibuat`)

  // Kembalikan total reputasi per user untuk keperluan badge
  const result = {}
  for (const [userId, logs] of Object.entries(repMap)) {
    result[userId] = logs.reduce((s, l) => s + l.point, 0)
  }
  return result
}

async function seedUserBadges(users, reputationMap, badges) {
  step('UserBadge')

  const badgeBySlug = {}
  for (const b of badges) badgeBySlug[b.slug] = b

  let count = 0

  for (const user of users) {
    const rep = reputationMap[user.id] ?? 0

    // Badge berdasarkan threshold reputasi
    for (const b of badges.filter(b => b.threshold > 0)) {
      if (rep >= b.threshold) {
        await db.userBadge.upsert({
          where:  { userId_badgeId: { userId: user.id, badgeId: b.id } },
          update: {},
          create: { userId: user.id, badgeId: b.id },
        })
        count++
      }
    }

    // Badge first_post: jika user punya minimal 1 diskusi
    const discCount = await db.discussion.count({ where: { userId: user.id } })
    if (discCount > 0) {
      const fb = badgeBySlug['first_post']
      if (fb) {
        await db.userBadge.upsert({
          where:  { userId_badgeId: { userId: user.id, badgeId: fb.id } },
          update: {},
          create: { userId: user.id, badgeId: fb.id },
        })
        count++
      }
    }

    // Badge first_answer: jika user punya minimal 1 komentar
    const commCount = await db.comment.count({ where: { userId: user.id } })
    if (commCount > 0) {
      const fa = badgeBySlug['first_answer']
      if (fa) {
        await db.userBadge.upsert({
          where:  { userId_badgeId: { userId: user.id, badgeId: fa.id } },
          update: {},
          create: { userId: user.id, badgeId: fa.id },
        })
        count++
      }
    }

    // Badge verified_expert: hanya untuk isVerifiedExpert=true
    if (user.isVerifiedExpert) {
      const vb = badgeBySlug['verified_expert']
      if (vb) {
        await db.userBadge.upsert({
          where:  { userId_badgeId: { userId: user.id, badgeId: vb.id } },
          update: {},
          create: { userId: user.id, badgeId: vb.id },
        })
        count++
      }
    }
  }

  ok(`${count} UserBadge di-upsert`)
}

async function seedNotifications(users, discussions) {
  step('Notification')

  const existing = await db.notification.count()
  if (existing > 0) {
    warn(`${existing} notifikasi sudah ada, lewati`)
    return
  }

  const [admin, mod, expert1, expert2, ...regulars] = users
  const notifs = []

  // Follow notifications: beberapa user mendapat notif "X mulai mengikuti kamu"
  for (const follower of regulars.slice(0, 5)) {
    notifs.push({
      userId:  expert1.id,
      actorId: follower.id,
      type:    'FOLLOW',
      message: `${follower.profile?.username ?? 'Seseorang'} mulai mengikuti kamu`,
    })
  }

  // Vote notifications: pemilik diskusi dapat notif upvote
  for (const disc of discussions.slice(0, 5)) {
    if (!disc.userId) continue
    const voter = rng(regulars)
    notifs.push({
      userId:       disc.userId,
      actorId:      voter.id,
      type:         'VOTE',
      message:      'Diskusi kamu mendapat upvote',
      discussionId: disc.id,
    })
  }

  // Comment notifications: penulis diskusi mendapat notif komentar baru
  const discComments = await db.comment.findMany({
    take: 5,
    where: { parentId: null },
    include: { discussion: true },
  })
  for (const c of discComments) {
    if (!c.discussion?.userId || c.userId === c.discussion.userId) continue
    notifs.push({
      userId:       c.discussion.userId,
      actorId:      c.userId,
      type:         'COMMENT',
      message:      'Ada komentar baru di diskusi kamu',
      discussionId: c.discussionId,
      commentId:    c.id,
    })
  }

  // Reply notifications
  const replies = await db.comment.findMany({
    take: 4,
    where: { parentId: { not: null } },
    include: { parent: true },
  })
  for (const r of replies) {
    if (!r.parent?.userId || r.userId === r.parent.userId) continue
    notifs.push({
      userId:       r.parent.userId,
      actorId:      r.userId,
      type:         'REPLY',
      message:      'Komentar kamu dibalas',
      discussionId: r.discussionId,
      commentId:    r.id,
    })
  }

  // Expert verified notifications
  for (const u of [expert1, expert2]) {
    notifs.push({
      userId:  u.id,
      type:    'EXPERT_VERIFIED',
      message: '🎉 Selamat! Permohonan pakar kamu telah disetujui. Kamu kini menjadi Pakar Terverifikasi OLION.',
    })
  }

  // System notifications: badge baru
  for (const u of regulars.slice(0, 4)) {
    notifs.push({
      userId:  u.id,
      type:    'SYSTEM',
      message: '⭐ Selamat! Kamu mendapat badge "Kontributor" karena mencapai 50 poin reputasi.',
    })
  }

  // Beberapa sudah dibaca, sisanya belum
  let count = 0
  for (let i = 0; i < notifs.length; i++) {
    await db.notification.create({
      data: { ...notifs[i], read: i < Math.floor(notifs.length * 0.4) },
    })
    count++
  }

  ok(`${count} notifikasi dibuat`)
}

async function seedChats(users) {
  step('Conversation + ConversationParticipant + Message')

  const existing = await db.conversation.count()
  if (existing > 0) {
    warn(`${existing} percakapan sudah ada, lewati`)
    return
  }

  const [admin, mod, expert1, expert2, ...regulars] = users

  const chatPairs = [
    { p1: regulars[0], p2: expert1,   msgs: [
        { sender: 'p1', text: 'Halo Dok, saya ingin bertanya soal topik diskusi AI kemarin. Apakah ada referensi bacaan yang bisa direkomendasikan?' },
        { sender: 'p2', text: 'Tentu! Saya rekomendasikan "The Alignment Problem" oleh Brian Christian sebagai starting point yang bagus. Ada juga paper-paper dari AI Safety Institute yang cukup accessible.' },
        { sender: 'p1', text: 'Terima kasih banyak! Kalau boleh, apakah saya bisa tanya lagi jika ada yang kurang dipahami?' },
        { sender: 'p2', text: 'Silakan, justru itu tujuan platform ini. Diskusi yang baik dimulai dari pertanyaan yang tepat.' },
    ]},
    { p1: regulars[1], p2: expert2,   msgs: [
        { sender: 'p1', text: 'Prof, saya membaca paper Anda tentang demokrasi deliberatif. Ada beberapa poin yang ingin saya klarifikasi.' },
        { sender: 'p2', text: 'Tentu, silakan. Saya senang kalau ada yang membaca dengan teliti dan mau berdiskusi lebih dalam.' },
        { sender: 'p1', text: 'Terutama soal asumsi rasionalitas aktor dalam model Habermas. Apakah ini masih relevan di era post-truth?' },
    ]},
    { p1: regulars[2], p2: regulars[3], msgs: [
        { sender: 'p1', text: 'Eh bro, tadi diskusi soal investasi seru banget. Kamu sudah coba instrumen SBN belum?' },
        { sender: 'p2', text: 'Sudah, SR019 sama ORI024. Cukup bagus untuk dana darurat cadangan. Kamu?' },
        { sender: 'p1', text: 'Belum sempat. Masih belajar bedain fixed vs floating rate. Ada resource yang kamu rekomendasikan?' },
        { sender: 'p2', text: 'Coba cek channel YouTube Stockbit dan buku "Rich Dad Poor Dad" versi Indonesia dulu buat fondasi. Setelah itu langsung praktek aja biar cepat paham.' },
    ]},
    { p1: admin, p2: mod, msgs: [
        { sender: 'p1', text: 'Ada laporan masuk untuk diskusi tentang investasi. Tolong dicek dulu konteksnya.' },
        { sender: 'p2', text: 'Sudah saya lihat. Sepertinya false positive, kontennya masih dalam batas diskusi finansial yang wajar.' },
        { sender: 'p1', text: 'Oke, kalau begitu mark sebagai REJECTED ya. Dan perlu tambahkan catatan untuk pelapornya.' },
        { sender: 'p2', text: 'Siap, sudah diproses.' },
    ]},
  ]

  let convCount = 0, msgCount = 0
  for (const pair of chatPairs) {
    const conv = await db.conversation.create({ data: {} })

    await db.conversationParticipant.createMany({
      data: [
        { conversationId: conv.id, userId: pair.p1.id },
        { conversationId: conv.id, userId: pair.p2.id },
      ],
    })

    for (const msg of pair.msgs) {
      const sender = msg.sender === 'p1' ? pair.p1 : pair.p2
      await db.message.create({
        data: { conversationId: conv.id, senderId: sender.id, content: msg.text },
      })
      msgCount++
    }

    convCount++
  }

  ok(`${convCount} percakapan, ${msgCount} pesan dibuat`)
}

async function seedExpertApplications(users) {
  step('ExpertApplication')

  const existing = await db.expertApplication.count()
  if (existing > 0) {
    warn(`${existing} permohonan sudah ada, lewati`)
    return
  }

  const [admin, mod, expert1, expert2, ...regulars] = users

  const apps = [
    // Sudah disetujui (untuk expert1 dan expert2 — agar ada riwayat permohonan)
    {
      userId:      expert1.id,
      field:       'Kecerdasan Buatan & Machine Learning',
      credentials: 'PhD Ilmu Komputer Universitas Indonesia (2018). Research Fellow di MIT CSAIL 2019–2021. Penulis 12 paper peer-reviewed di NeurIPS, ICML, dan ACL. Google Scholar citations: 847. Sertifikasi: AWS ML Specialty, Google Professional ML Engineer.',
      status:      'APPROVED',
      reviewNote:  'Kredensial sangat kuat. Disetujui sebagai pakar bidang AI/ML.',
    },
    {
      userId:      expert2.id,
      field:       'Sosiologi & Kebijakan Publik',
      credentials: 'Profesor Sosiologi Universitas Gadjah Mada. Anggota Dewan Riset Nasional sejak 2020. Penulis buku "Demokrasi Digital Indonesia" (Gramedia, 2022). Konsultan kebijakan untuk Kemendikbud dan BRIN.',
      status:      'APPROVED',
      reviewNote:  'Track record riset dan kebijakan yang sangat relevan. Disetujui.',
    },
    // Sedang pending (dari user reguler)
    {
      userId:      regulars[4].id,
      field:       'Kesehatan Masyarakat & Epidemiologi',
      credentials: 'Dokter umum dengan spesialisasi kesehatan komunitas. S2 Epidemiologi UI (2020). Pernah terlibat penelitian pandemi COVID-19 bersama WHO Indonesia. Publikasi di Jurnal Kesehatan Masyarakat Indonesia.',
      status:      'PENDING',
    },
    // Pernah ditolak (dari user lain)
    {
      userId:      regulars[7].id,
      field:       'Investasi & Pasar Modal',
      credentials: 'Trader forex 2 tahun. Punya akun Instagram edukasi investasi dengan 50k followers.',
      status:      'REJECTED',
      reviewNote:  'Kredensial belum cukup memenuhi standar verifikasi pakar. Pengalaman trading dan media sosial tidak setara dengan keahlian akademis atau profesional yang terverifikasi. Disarankan melengkapi sertifikasi formal (WPPE/CFA) dan/atau publikasi riset.',
    },
  ]

  for (const app of apps) {
    await db.expertApplication.create({ data: app })
  }

  ok(`${apps.length} expert application dibuat (2 approved, 1 pending, 1 rejected)`)
}

async function seedReports(users, discussions, comments) {
  step('Report')

  const existing = await db.report.count()
  if (existing > 0) {
    warn(`${existing} laporan sudah ada, lewati`)
    return
  }

  const [admin, mod, expert1, expert2, ...regulars] = users

  const reports = [
    // RESOLVED — diskusi (sudah ditangani)
    {
      reporterId:   regulars[0].id,
      discussionId: discussions[2].id,
      reason:       'Konten terkesan mempromosikan produk investasi tertentu tanpa disclosure. Berpotensi menyesatkan pengguna awam.',
      status:       'RESOLVED',
    },
    // REJECTED — false positive
    {
      reporterId:   regulars[1].id,
      discussionId: discussions[6].id,
      reason:       'Saya rasa diskusi ini terlalu teknis dan tidak relevan untuk forum umum.',
      status:       'REJECTED',
    },
    // PENDING — menunggu review
    {
      reporterId:   regulars[3].id,
      commentId:    (await db.comment.findFirst({ where: { parentId: null } }))?.id,
      reason:       'Komentar ini mengandung pernyataan yang tidak didukung bukti dan berpotensi menyebarkan misinformasi medis.',
      status:       'PENDING',
    },
    // PENDING — laporan user
    {
      reporterId:   regulars[5].id,
      targetUserId: regulars[8].id,
      reason:       'User ini tampak membuat beberapa akun untuk memanipulasi voting.',
      status:       'PENDING',
    },
  ]

  for (const r of reports) {
    await db.report.create({ data: r })
  }

  ok(`${reports.length} laporan dibuat (1 resolved, 1 rejected, 2 pending)`)
}

// =============================================================================
// MAIN
// =============================================================================

async function resetAll() {
  console.log(`\n${c.red}${c.bold}⚠  MODE RESET — Menghapus semua data...${c.reset}`)
  // Urutan hapus mengikuti foreign key constraint (child dulu, baru parent)
  const steps = [
    'report', 'expertApplication', 'userBadge', 'notification',
    'message', 'conversationParticipant', 'conversation',
    'reputationLog', 'vote', 'discussionTag', 'comment', 'discussion',
    'follow', 'tag', 'profile', 'user', 'category', 'badge',
  ]
  for (const model of steps) {
    const count = await db[model].deleteMany()
    console.log(`  ${c.grey}Hapus ${model}: ${count.count} baris${c.reset}`)
  }
  console.log(`${c.green}✓ Reset selesai${c.reset}`)
}

async function main() {
  console.log(`\n${c.bold}${c.green}🌱 OLION Database Seeder${c.reset}`)
  console.log(`${c.grey}   Schema: 18 model | Mode: ${ARG.includes('--reset') ? 'RESET + SEED' : 'UPSERT'}${c.reset}`)

  if (ARG.includes('--reset')) await resetAll()

  const badges      = await seedBadges()
  const categories  = await seedCategories()
  const tags        = await seedTags()
  const users       = await seedUsers()

  if (users.length === 0) {
    console.log(`\n${c.yellow}⚠  Tidak ada user yang bisa diproses. Jalankan dengan --reset untuk seed ulang.${c.reset}`)
    return
  }

  await seedFollows(users)
  const discussions = await seedDiscussions(users, categories, tags)
  const comments    = await seedComments(users, discussions)
  await seedVotes(users, discussions, comments)
  const repMap      = await seedReputationLogs(users, discussions, comments)
  await seedUserBadges(users, repMap, badges)
  await seedNotifications(users, discussions)
  await seedChats(users)
  await seedExpertApplications(users)
  await seedReports(users, discussions, comments)

  // ── Ringkasan akhir ─────────────────────────────────────────────────────────
  const counts = await Promise.all([
    db.user.count(), db.profile.count(), db.category.count(), db.tag.count(),
    db.discussion.count(), db.comment.count(), db.vote.count(),
    db.report.count(), db.reputationLog.count(), db.notification.count(),
    db.badge.count(), db.userBadge.count(), db.expertApplication.count(),
    db.follow.count(), db.conversation.count(), db.message.count(),
    db.discussionTag.count(),
  ])
  const labels = [
    'User','Profile','Category','Tag','Discussion','Comment','Vote',
    'Report','ReputationLog','Notification','Badge','UserBadge',
    'ExpertApplication','Follow','Conversation','Message','DiscussionTag',
  ]

  console.log(`\n${c.bold}${c.green}✅ Seeding selesai!${c.reset}`)
  console.log(`\n${c.bold}📊 Ringkasan data:${c.reset}`)
  labels.forEach((l, i) => {
    console.log(`   ${c.grey}${l.padEnd(20)}${c.reset} ${c.bold}${counts[i]}${c.reset}`)
  })

  console.log(`\n${c.bold}🔑 Akun development:${c.reset}`)
  console.log(`   ${c.cyan}admin@olion.id${c.reset}    Password123!  ${c.grey}(ADMIN)${c.reset}`)
  console.log(`   ${c.cyan}mod@olion.id${c.reset}      Password123!  ${c.grey}(MODERATOR)${c.reset}`)
  console.log(`   ${c.cyan}pakar@olion.id${c.reset}    Password123!  ${c.grey}(EXPERT — AI/ML)${c.reset}`)
  console.log(`   ${c.cyan}pakar2@olion.id${c.reset}   Password123!  ${c.grey}(EXPERT — Sosiologi)${c.reset}`)
  console.log(`   ${c.cyan}user1@olion.id${c.reset}    Password123!  ${c.grey}(USER)${c.reset}`)
  console.log(`   ${c.grey}... user2 s.d. user12 dengan password yang sama${c.reset}\n`)
}

main()
  .catch(e => { console.error(`\n${c.red}❌ Error:${c.reset}`, e); process.exit(1) })
  .finally(() => db.$disconnect())
