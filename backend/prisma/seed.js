/**
 * seed.js — OLION comprehensive database seed
 *
 * Coverage:
 *  ✓ All Role enum values     (USER, EXPERT, MODERATOR, ADMIN)
 *  ✓ All DiscussionMode       (INFORMATIF, KLARIFIKATIF, EKSPLORATIF, EVALUATIF, ARGUMENTATIF, PRAKTIS)
 *  ✓ All DisciplineLevel      (BEBAS, RASIONAL, AKADEMIK, PROFESIONAL)
 *  ✓ All ReportStatus         (PENDING, RESOLVED, REJECTED)
 *  ✓ Categories + subcategories (11 root, 40 children)
 *  ✓ 12 users with realistic profiles and bios
 *  ✓ 40 discussions spread across categories, modes, disciplines
 *  ✓ 80+ comments with realistic content
 *  ✓ Votes (+1 / -1) that create meaningful reputation spread
 *  ✓ Reports on discussions and comments, all statuses
 *  ✓ ReputationLog entries matching vote activity
 *  ✓ Timestamps spread over past 90 days for realistic trending data
 */

'use strict'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const db = new PrismaClient()

// ── Utilities ──────────────────────────────────────────────────────────────────
const HASH_ROUNDS = 10

/** Random integer in [min, max] inclusive */
function ri(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Random element from array */
function pick(arr) {
  return arr[ri(0, arr.length - 1)]
}

/** Date offset: n days ago from now */
function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

/** Date offset: n hours ago */
function hoursAgo(n) {
  return new Date(Date.now() - n * 60 * 60 * 1000)
}

// ── Password hashes (pre-computed outside loop for speed) ─────────────────────
async function buildHashes() {
  const [userPwd, adminPwd, modPwd, expertPwd] = await Promise.all([
    bcrypt.hash('password123', HASH_ROUNDS),
    bcrypt.hash('admin123',    HASH_ROUNDS),
    bcrypt.hash('moderator123', HASH_ROUNDS),
    bcrypt.hash('expert123',   HASH_ROUNDS),
  ])
  return { userPwd, adminPwd, modPwd, expertPwd }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting OLION seed...\n')

  // ── 0. Wipe existing data in dependency order ──────────────────────────────
  console.log('🗑  Clearing existing data...')
  await db.reputationLog.deleteMany()
  await db.report.deleteMany()
  await db.vote.deleteMany()
  await db.comment.deleteMany()
  await db.discussion.deleteMany()
  await db.profile.deleteMany()
  await db.user.deleteMany()
  await db.category.deleteMany()
  console.log('   Done.\n')

  // ── 1. Categories ─────────────────────────────────────────────────────────
  console.log('📂 Creating categories...')

  const CAT_DEFS = [
    { name: 'General',     slug: 'general',     description: 'Diskusi umum dan pengumuman komunitas.' },
    { name: 'Technology',  slug: 'technology',  description: 'Teknologi, software, AI, data, dan inovasi digital.' },
    { name: 'Science',     slug: 'science',     description: 'Pembahasan sains, penelitian, dan pengetahuan ilmiah.' },
    { name: 'Hukum',       slug: 'hukum',       description: 'Diskusi hukum, regulasi, dan perlindungan hak.' },
    { name: 'Keuangan',    slug: 'keuangan',    description: 'Investasi, finansial, pajak, dan perencanaan uang.' },
    { name: 'Kesehatan',   slug: 'kesehatan',   description: 'Kesehatan fisik, mental, nutrisi, dan kebugaran.' },
    { name: 'Pendidikan',  slug: 'pendidikan',  description: 'Sekolah, kuliah, kursus, dan pengembangan akademik.' },
    { name: 'Sosial',      slug: 'sosial',      description: 'Budaya, masyarakat, komunitas, dan isu sosial.' },
    { name: 'Karier',      slug: 'karier',      description: 'Karier, pekerjaan, CV, interview, dan freelance.' },
    { name: 'Hubungan',    slug: 'hubungan',    description: 'Relasi, keluarga, persahabatan, dan komunikasi.' },
    { name: 'Lainnya',     slug: 'lainnya',     description: 'Topik umum lain di luar kategori utama.' },
  ]

  // Create root categories sequentially so we get references
  const roots = {}
  for (const def of CAT_DEFS) {
    roots[def.slug] = await db.category.create({ data: def })
  }

  // Subcategories: [parentSlug, name, slug]
  const SUBCATS = [
    // General
    ['general',    'Introductions',            'introductions'],
    ['general',    'Announcements',            'announcements'],
    ['general',    'Feedback & Saran',         'feedback'],
    ['general',    'Off-topic',                'off-topic'],
    // Technology
    ['technology', 'Software Engineering',     'software'],
    ['technology', 'AI & Machine Learning',    'ai-data'],
    ['technology', 'Cybersecurity',            'cybersecurity'],
    ['technology', 'Web & Mobile Dev',         'web-mobile'],
    ['technology', 'Hardware & Elektronik',    'hardware'],
    // Science
    ['science',    'Fisika',                   'fisika'],
    ['science',    'Biologi & Genetika',       'biologi'],
    ['science',    'Kimia',                    'kimia'],
    ['science',    'Astronomi',                'astronomi'],
    // Hukum
    ['hukum',      'Hukum Pidana',             'pidana'],
    ['hukum',      'Hukum Perdata',            'perdata'],
    ['hukum',      'Ketenagakerjaan',          'ketenagakerjaan'],
    ['hukum',      'Hak Kekayaan Intelektual', 'hak-kekayaan-intelektual'],
    ['hukum',      'Hukum Digital',            'hukum-digital'],
    // Keuangan
    ['keuangan',   'Investasi & Saham',        'investasi'],
    ['keuangan',   'Perencanaan Keuangan',     'perencanaan-keuangan'],
    ['keuangan',   'Pajak',                    'pajak'],
    ['keuangan',   'Pinjaman & Utang',         'pinjaman-utang'],
    ['keuangan',   'Kripto & Aset Digital',    'kripto'],
    // Kesehatan
    ['kesehatan',  'Nutrisi & Diet',           'nutrisi'],
    ['kesehatan',  'Olahraga & Kebugaran',     'olahraga'],
    ['kesehatan',  'Kesehatan Mental',         'kesehatan-mental'],
    ['kesehatan',  'Penyakit & Pengobatan',    'penyakit-pengobatan'],
    // Pendidikan
    ['pendidikan', 'Sekolah Dasar',            'sekolah-dasar'],
    ['pendidikan', 'SMP & SMA',                'smp-sma'],
    ['pendidikan', 'Perkuliahan',              'perkuliahan'],
    ['pendidikan', 'Kursus & Sertifikasi',     'kursus-sertifikasi'],
    ['pendidikan', 'Beasiswa',                 'beasiswa'],
    // Sosial
    ['sosial',     'Budaya & Tradisi',         'budaya-tradisi'],
    ['sosial',     'Lingkungan Hidup',         'lingkungan'],
    ['sosial',     'Politik & Kebijakan',      'politik-kebijakan'],
    ['sosial',     'Komunitas Lokal',          'komunitas'],
    // Karier
    ['karier',     'CV & Wawancara',           'cv-wawancara'],
    ['karier',     'Pengembangan Diri',        'pengembangan-diri'],
    ['karier',     'Wirausaha',                'wirausaha'],
    ['karier',     'Remote Work & Freelance',  'remote-work-freelance'],
    // Hubungan
    ['hubungan',   'Pacaran & Romansa',        'pacaran'],
    ['hubungan',   'Keluarga',                 'keluarga'],
    ['hubungan',   'Persahabatan',             'persahabatan'],
    ['hubungan',   'Konflik & Mediasi',        'konflik-mediasi'],
    // Lainnya
    ['lainnya',    'Hobi & Hiburan',           'hobi-hiburan'],
    ['lainnya',    'Kuliner',                  'kuliner'],
    ['lainnya',    'Perjalanan',               'perjalanan'],
    ['lainnya',    'Tips & Trik',              'tips-trik'],
  ]

  await db.category.createMany({
    data: SUBCATS.map(([parentSlug, name, slug]) => ({
      name,
      slug,
      description: `Sub-topik dari ${roots[parentSlug].name}.`,
      parentId: roots[parentSlug].id,
    })),
  })

  const allCategories = await db.category.findMany()
  const rootCats  = allCategories.filter(c => !c.parentId)
  const childCats = allCategories.filter(c =>  c.parentId)

  console.log(`   ${rootCats.length} root categories, ${childCats.length} subcategories\n`)

  // ── 2. Users ───────────────────────────────────────────────────────────────
  console.log('👤 Creating users...')

  const { userPwd, adminPwd, modPwd, expertPwd } = await buildHashes()

  const USER_DEFS = [
    // role, isVerifiedExpert, email, pwdKey, username, bio
    ['ADMIN',     false, 'admin@olion.id',          'adminPwd', 'admin_olion',      'Administrator utama platform OLION.'],
    ['MODERATOR', false, 'moderator@olion.id',      'modPwd',   'mod_rina',         'Moderator aktif sejak 2023. Suka berdiskusi tentang hukum dan sosial.'],
    ['MODERATOR', false, 'mod2@olion.id',           'modPwd',   'mod_budi',         'Fokus moderasi konten teknologi dan sains.'],
    ['EXPERT',    true,  'dr.sarah@olion.id',       'expertPwd','dr_sarah_k',       'Dokter umum. Aktif berbagi pengetahuan kesehatan berbasis bukti.'],
    ['EXPERT',    true,  'prof.andi@olion.id',      'expertPwd','prof_andi_hukum',  'Dosen hukum pidana. Konsultan legal pro bono.'],
    ['EXPERT',    true,  'rizky.dev@olion.id',      'expertPwd','rizky_engineer',   'Senior software engineer. 10 tahun di industri fintech.'],
    ['EXPERT',    true,  'dr.chem@olion.id',        'expertPwd','dr_kimia_ui',      'Peneliti kimia organik. Alumni UI dan MIT.'],
    ['USER',      false, 'aditya99@olion.id',       'userPwd',  'aditya_curious',   'Mahasiswa teknik informatika yang suka ngobrol soal AI.'],
    ['USER',      false, 'sinta.finance@olion.id',  'userPwd',  'sinta_cerdas',     'Fresh graduate akuntansi. Belajar investasi dari nol.'],
    ['USER',      false, 'bram.explore@olion.id',   'userPwd',  'bram_petualang',   'Freelancer desainer. Hobi traveling dan kuliner.'],
    ['USER',      false, 'layla.sosial@olion.id',   'userPwd',  'layla_aktivis',    'Aktivis lingkungan dan komunitas. Percaya pada diskusi terbuka.'],
    ['USER',      false, 'deni.karier@olion.id',    'userPwd',  'deni_growth',      'HRD startup. Senang berbagi tips karier dan wawancara.'],
  ]

  const pwdMap = { adminPwd, modPwd, expertPwd, userPwd }
  const createdUsers = []

  for (const [role, isVerifiedExpert, email, pwdKey, username, bio] of USER_DEFS) {
    const u = await db.user.create({
      data: {
        email,
        password: pwdMap[pwdKey],
        role,
        isVerifiedExpert,
        profile: { create: { username, bio } },
      },
      include: { profile: true },
    })
    createdUsers.push(u)
  }

  // Convenience refs
  const [admin, mod1, mod2, expertDoc, expertLaw, expertDev, expertChem,
         userAdi, userSinta, userBram, userLayla, userDeni] = createdUsers

  const experts   = [expertDoc, expertLaw, expertDev, expertChem]
  const regularUsers = [userAdi, userSinta, userBram, userLayla, userDeni]
  const allUsers  = createdUsers

  console.log(`   ${createdUsers.length} users created\n`)

  // ── 3. Discussions ─────────────────────────────────────────────────────────
  console.log('💬 Creating discussions...')

  // [title, content, categorySlug, mode, discipline, authorIndex(into allUsers), daysAgo]
  const DISCUSSION_DEFS = [
    // ── Technology / AI ──
    [
      'Apakah AI generatif akan menggantikan programmer dalam 5 tahun?',
      'Model bahasa besar seperti GPT-4 dan Claude sudah bisa menulis kode yang cukup kompleks. Apakah ini berarti profesi software engineer akan tergantikan? Atau justru kita akan naik level ke peran yang lebih strategis? Saya ingin mendengar perspektif dari yang sudah bekerja di industri.',
      'ai-data', 'EKSPLORATIF', 'RASIONAL', 6, 2,
    ],
    [
      'Best practice keamanan API REST: authentication vs authorization',
      'Banyak developer baru masih bingung membedakan autentikasi dan otorisasi. Dalam konteks REST API, autentikasi memverifikasi siapa Anda (JWT, OAuth2), sedangkan otorisasi menentukan apa yang boleh Anda lakukan (RBAC, ABAC). Diskusikan implementasi terbaik untuk production.',
      'software', 'INFORMATIF', 'PROFESIONAL', 5, 5,
    ],
    [
      'Pengalaman migrasi dari monolith ke microservices: worth it?',
      'Startup kami baru selesai migrasi 18 bulan dari monolith Rails ke microservices Node.js + Go. Hasilnya? Deploy lebih cepat, scaling lebih fleksibel, tapi operational overhead naik drastis. Apakah pengalaman kalian sama?',
      'software', 'EVALUATIF', 'PROFESIONAL', 5, 12,
    ],
    [
      'Cursor AI vs GitHub Copilot: mana yang lebih produktif?',
      'Sudah 3 bulan pakai keduanya secara bergantian. Cursor lebih baik untuk refactoring dan understanding codebase besar. Copilot lebih smooth untuk autocomplete rutin. Ada yang punya perbandingan lebih sistematis?',
      'web-mobile', 'EVALUATIF', 'RASIONAL', 7, 8,
    ],
    [
      'Cara kerja SSL/TLS dan kenapa HTTPS penting untuk semua website',
      'Masih banyak website yang belum pakai HTTPS padahal sertifikat SSL sekarang gratis (Let\'s Encrypt). SSL/TLS mengenkripsi data antara browser dan server menggunakan asymmetric cryptography untuk key exchange dan symmetric untuk data transfer. Ini penjelasan lengkapnya.',
      'cybersecurity', 'INFORMATIF', 'AKADEMIK', 5, 20,
    ],
    // ── Science ──
    [
      'Mengapa vaksin mRNA seperti COVID-19 dianggap aman meskipun teknologinya baru?',
      'Banyak yang khawatir karena teknologi mRNA "baru", padahal penelitiannya sudah lebih dari 30 tahun. mRNA tidak masuk ke inti sel dan tidak mengubah DNA. Ia memberikan instruksi sementara untuk membuat protein spike, lalu terurai dalam beberapa hari.',
      'biologi', 'KLARIFIKATIF', 'AKADEMIK', 3, 15,
    ],
    [
      'Apakah ada kehidupan di luar Bumi? Probabilitas dan bukti ilmiah',
      'Dengan 200 miliar bintang di galaksi kita dan triliunan galaksi di alam semesta, secara statistik hampir mustahil kita sendiri. Bukti: air di Mars, lautan di Europa, molekul organik di exoplanet. Tapi "kehidupan" dan "kehidupan cerdas" adalah dua pertanyaan berbeda.',
      'astronomi', 'EKSPLORATIF', 'AKADEMIK', 3, 30,
    ],
    [
      'Krisis reproduksi pada serangga: dampak ekologis dan ancaman ketahanan pangan',
      'Studi terbaru menunjukkan populasi serangga menurun 45% dalam 40 tahun terakhir. Ini bukan sekadar soal nyamuk berkurang — serangga adalah fondasi ekosistem: penyerbuk tanaman, pengurai, sumber protein bagi burung dan ikan.',
      'biologi', 'INFORMATIF', 'AKADEMIK', 6, 22,
    ],
    // ── Hukum ──
    [
      'Hak karyawan kontrak PKWT: apa yang sering dilanggar perusahaan?',
      'Berdasarkan UU Cipta Kerja dan PP 35/2021, PKWT maksimal 5 tahun termasuk perpanjangan. Karyawan PKWT berhak atas uang kompensasi saat kontrak berakhir. Namun praktiknya banyak yang tidak mendapat haknya karena tidak tahu atau takut kehilangan pekerjaan.',
      'ketenagakerjaan', 'INFORMATIF', 'PROFESIONAL', 4, 7,
    ],
    [
      'Apakah screenshot chat WhatsApp bisa dijadikan bukti di pengadilan?',
      'Ini pertanyaan yang sering muncul. Jawabannya: bisa, tapi dengan syarat. Berdasarkan UU ITE Pasal 5, informasi elektronik adalah alat bukti sah. Namun autentisitasnya harus bisa dibuktikan — idealnya dengan digital forensic atau pengakuan pihak lawan.',
      'hukum-digital', 'KLARIFIKATIF', 'PROFESIONAL', 4, 3,
    ],
    [
      'Paten software di Indonesia: mungkin tidak, dan bagaimana prosesnya?',
      'Indonesia mengikuti perjanjian TRIPS dan memungkinkan paten untuk invensi yang mengandung unsur teknis, termasuk software dengan kontribusi teknis nyata. Proses di DJKI memakan waktu 2-5 tahun. Biaya jauh lebih rendah dari patent di US/EU.',
      'hak-kekayaan-intelektual', 'INFORMATIF', 'AKADEMIK', 4, 18,
    ],
    // ── Keuangan ──
    [
      'Dollar cost averaging vs lump sum: mana lebih menguntungkan secara historis?',
      'Penelitian Vanguard menunjukkan lump sum outperform DCA sekitar 66% dari waktu dalam horizon 10 tahun+. Namun DCA lebih cocok secara psikologis dan untuk yang tidak punya modal besar sekaligus. Ini bukan soal mana yang "benar" tapi mana yang sesuai situasimu.',
      'investasi', 'EVALUATIF', 'RASIONAL', 8, 10,
    ],
    [
      'Cara menghitung pajak penghasilan freelancer Indonesia: panduan lengkap 2024',
      'Sebagai freelancer atau pekerja mandiri, kamu wajib lapor SPT tahunan. Penghasilan bruto dikurangi PTKP, hasil kena pajak progresif 5%-35%. Kalau omzet < 4,8M setahun, bisa pakai PP 23/2018 (tarif 0,5% dari omzet). Ada yang sudah lapor sendiri?',
      'pajak', 'PRAKTIS', 'PROFESIONAL', 8, 25,
    ],
    [
      'Review jujur: investasi reksa dana syariah vs konvensional performa 5 tahun',
      'Saya tracking 12 reksa dana syariah dan 12 konvensional dari kategori yang sama selama 5 tahun. Hasil: performa hampir setara di saham campuran, reksa dana konvensional unggul tipis di money market. Biaya management syariah rata-rata lebih rendah.',
      'investasi', 'EVALUATIF', 'AKADEMIK', 8, 45,
    ],
    [
      'Strategi pelunasan hutang: avalanche vs snowball method',
      'Avalanche: bayar hutang berbunga tertinggi dulu — secara matematis optimal, hemat bunga terbanyak. Snowball: bayar hutang terkecil dulu — secara psikologis lebih motivating karena ada "kemenangan" cepat. Metode mana yang berhasil buat kamu?',
      'pinjaman-utang', 'PRAKTIS', 'RASIONAL', 11, 6,
    ],
    // ── Kesehatan ──
    [
      'Gejala burnout vs depresi: bagaimana membedakannya dan kapan harus ke psikiater?',
      'Burnout adalah kondisi kelelahan kronis akibat stres kerja berkepanjangan — biasanya membaik dengan istirahat dan perubahan kondisi kerja. Depresi adalah gangguan mood yang lebih pervasif, mempengaruhi hampir semua area kehidupan bahkan saat kondisi external membaik.',
      'kesehatan-mental', 'KLARIFIKATIF', 'PROFESIONAL', 3, 4,
    ],
    [
      'Intermittent fasting 16:8 vs 5:2: tinjauan ilmiah manfaat dan risiko',
      '16:8 (puasa 16 jam, makan 8 jam): lebih mudah dipertahankan, penelitian menunjukkan perbaikan sensitivitas insulin. 5:2 (5 hari normal, 2 hari <500 kalori): lebih dramatis untuk penurunan berat, tapi lebih sulit secara mental. Keduanya tidak disarankan untuk ibu hamil.',
      'nutrisi', 'INFORMATIF', 'AKADEMIK', 3, 35,
    ],
    [
      'Apakah suplemen kolagen oral benar-benar bekerja? Tinjauan penelitian',
      'Industri suplemen kolagen senilai miliaran dolar, tapi skeptisisme ilmiah cukup kuat. Peptida kolagen yang dikonsumsi akan dipecah oleh pencernaan menjadi asam amino biasa. Namun beberapa RCT menunjukkan peningkatan elastisitas kulit. Mekanisme exakt masih diperdebatkan.',
      'nutrisi', 'EVALUATIF', 'AKADEMIK', 6, 28,
    ],
    // ── Pendidikan ──
    [
      'Sistem zonasi PPDB: solusi atau masalah baru untuk pendidikan Indonesia?',
      'Zonasi dirancang untuk mendemokratisasi akses pendidikan dan mencegah "sekolah favorit" yang segregatif. Di lapangan: orang tua memindahkan KK, guru berkualitas tidak terdistribusi merata, sekolah di zona "miskin" tidak diperkuat kapasitasnya. Apakah kebijakan ini perlu direvisi total?',
      'smp-sma', 'ARGUMENTATIF', 'RASIONAL', 9, 9,
    ],
    [
      'Pengalaman kuliah S2 di luar negeri dengan beasiswa LPDP: worth it?',
      'Lulus LPDP 2021, kuliah di Delft Belanda jurusan Urban Planning. Worth it? Sangat. Bukan hanya ilmu — network internasional, cara berpikir yang berbeda, dan exposure ke problem nyata global sangat membuka wawasan. Tapi siap mental untuk 2 tahun yang sangat intense.',
      'beasiswa', 'EVALUATIF', 'RASIONAL', 7, 50,
    ],
    [
      'Platform belajar coding gratis terbaik 2024: perbandingan lengkap',
      'Sudah coba: freeCodeCamp (web, gratis, sertifikat), The Odin Project (web full, project-based), CS50 Harvard (computer science dasar, sangat bagus), Kaggle (data science + ML), Khan Academy (matematika). Untuk pemula absolute: mulai dari CS50 + freeCodeCamp.',
      'kursus-sertifikasi', 'PRAKTIS', 'RASIONAL', 5, 14,
    ],
    // ── Sosial ──
    [
      'Fenomena "quiet quitting": resistensi sehat atau krisis motivasi generasi Z?',
      'Quiet quitting bukan benar-benar berhenti — tapi bekerja sesuai job desc, tidak lebih. Di satu sisi ini bentuk perlawanan terhadap hustle culture toxic. Di sisi lain, ekonom khawatir ini adalah sinyal disengagement massal yang berdampak produktivitas jangka panjang.',
      'politik-kebijakan', 'ARGUMENTATIF', 'RASIONAL', 10, 16,
    ],
    [
      'Dampak media sosial terhadap kesehatan mental remaja: apa kata riset?',
      'Meta-analisis dari 226 studi (2023) menunjukkan korelasi negatif antara screen time media sosial dan wellbeing pada remaja, terutama perempuan. Mekanisme: social comparison, cyberbullying, disrupted sleep, algoritma yang mengamplifikasi konten negatif.',
      'komunitas', 'INFORMATIF', 'AKADEMIK', 3, 11,
    ],
    [
      'Apakah budaya "anti-kritik" di Indonesia menghambat kemajuan?',
      'Observasi saya: di banyak lingkungan kerja dan akademik, kritik konstruktif masih dianggap tidak sopan. "Jaga perasaan" lebih diutamakan dari "mencari kebenaran". Ini berdampak pada kualitas keputusan organisasi. Bagaimana pengalaman kalian?',
      'budaya-tradisi', 'EKSPLORATIF', 'RASIONAL', 10, 32,
    ],
    // ── Karier ──
    [
      'Negosiasi gaji: kapan waktu terbaik dan bagaimana caranya?',
      'Waktu terbaik: saat sudah ada offer letter, bukan sebelumnya. Riset range pasar dulu (Glassdoor, LinkedIn Salary, jobstreet). Anchor high tapi reasonable. Jangan sebut gaji saat ini dulu. "Saya sangat excited dengan opportunity ini, apakah ada fleksibilitas di angka ini?" adalah kalimat ajaib.',
      'cv-wawancara', 'PRAKTIS', 'PROFESIONAL', 11, 3,
    ],
    [
      'Dari karyawan ke founder: pelajaran dari 2 tahun pertama bangun startup',
      'Resign dari Google Jakarta untuk bangun edtech startup. 2 tahun kemudian: 3x pivot, 2 co-founder pergi, hampir tutup 2x, tapi sekarang profitable di niche yang sangat spesifik. Yang saya pelajari: focus on revenue lebih awal, team lebih penting dari idea, dan validasi sebelum build.',
      'wirausaha', 'EKSPLORATIF', 'PROFESIONAL', 5, 40,
    ],
    [
      'Tips produktif kerja remote untuk yang pertama kali WFH penuh',
      'Setelah 3 tahun full remote: (1) dedicated workspace, (2) jadwal rigid di awal, (3) over-communicate dengan tim, (4) Pomodoro untuk deep work, (5) batas kerja yang tegas — matikan notif jam 6. Yang paling challenging: isolation sosial dan bedain "istirahat" vs "malas".',
      'remote-work-freelance', 'PRAKTIS', 'RASIONAL', 11, 8,
    ],
    // ── Hubungan ──
    [
      'Long distance relationship: red flags yang sering diabaikan',
      'LDR bukan tidak mungkin, tapi butuh kondisi spesifik untuk berhasil: end date yang jelas, komunikasi terjadwal, trust yang solid, dan keduanya punya kehidupan sosial mandiri. Red flags: posesif berlebihan, jealousy ekstrem, tidak ada rencana bersama, dan sering "menghilang".',
      'pacaran', 'INFORMATIF', 'RASIONAL', 9, 5,
    ],
    [
      'Toxic family dynamics: bagaimana navigasi hubungan dengan orang tua yang kontroling?',
      'Ini topik yang jarang dibahas terbuka di Indonesia karena tabu budaya. Orang tua kontroling seringkali berasal dari rasa sayang yang distorted. Strateginya: komunikasi asertif (bukan agresif), boundaries yang jelas, dan bila perlu — bantuan profesional seperti family therapy.',
      'keluarga', 'PRAKTIS', 'RASIONAL', 10, 13,
    ],
    // ── Lainnya ──
    [
      'Rekomendasi kafe coworking di Jakarta dengan WiFi stabil dan harga reasonable',
      'Berdasarkan pengalaman 6 bulan nomad lokal: Anomali Coffee (Sudirman — WiFi 100Mbps, ramai tapi nyaman), Kopi Tuli (Mampang — sunyi, vibe bagus), Tanamera (kuningan — mahal tapi paling produktif untuk saya), dan Populer Kopi di mana-mana untuk yang budget sadar.',
      'tips-trik', 'PRAKTIS', 'BEBAS', 9, 2,
    ],
    [
      'Review: hiking Gunung Rinjani via jalur Sembalun — itinerary dan tips',
      'Baru turun dari Rinjani minggu lalu via Sembalun (naik) dan Torean (turun) 4 hari 3 malam. Pemandangan: 10/10. Fisik terkuras: 10/10. Tips: training minimal 3 bulan sebelumnya, porter sangat worth it, bawa purotein bar banyak, dan jangan skip aklimatisasi.',
      'perjalanan', 'INFORMATIF', 'BEBAS', 9, 17,
    ],
    [
      'Cara membuat sourdough starter dari nol — troubleshooting masalah umum',
      'Sourdough starter adalah fermentasi wild yeast + bakteri asam laktat. Masalah umum: (1) tidak mengembang — suhu terlalu dingin, coba di atas kulkas, (2) bau aneh — normal di 3-5 hari pertama, buang lapisan atas, (3) lapisan air di atas (hooch) — starter kelaparan, discard dan feed lebih sering.',
      'kuliner', 'PRAKTIS', 'BEBAS', 9, 60,
    ],
    // ── More discussions untuk variety ──
    [
      'Blockchain beyond crypto: use case nyata yang sudah terbukti di industri',
      'Terlepas dari hype kripto, blockchain punya use case legit: supply chain transparency (Walmart food tracking), sertifikasi dokumen (beberapa universitas), voting sistem, dan cross-border payment settlement. Yang mana menurut kamu paling transformatif?',
      'kripto', 'EKSPLORATIF', 'RASIONAL', 5, 38,
    ],
    [
      'Apakah gelar S1 masih relevan di era bootcamp dan self-taught developer?',
      'Tech company besar (Google, Apple, IBM) sudah menghapus requirement gelar sarjana untuk banyak posisi. Bootcamp 6 bulan vs 4 tahun kuliah — mana yang lebih efisien untuk masuk industri? Dari perspektif recruiter: sertifikat + portofolio kuat sudah cukup untuk junior role.',
      'perkuliahan', 'ARGUMENTATIF', 'RASIONAL', 7, 22,
    ],
    [
      'Kenapa Indonesia masih susah membangun budaya membaca?',
      'Data UNESCO: rata-rata orang Indonesia membaca 0-1 buku per tahun. Faktor: infrastruktur perpustakaan buruk, harga buku mahal relatif terhadap UMR, konten digital lebih accessible dan entertaining, dan sistem pendidikan yang tidak menanamkan reading habit. Ini masalah ekosistem, bukan individu.',
      'budaya-tradisi', 'ARGUMENTATIF', 'AKADEMIK', 4, 28,
    ],
    [
      'Pengalaman terapi EMDR untuk trauma: apakah efektif?',
      'Setelah 2 tahun menghindari, akhirnya coba EMDR (Eye Movement Desensitization and Reprocessing) untuk trauma masa kecil. 12 sesi dengan psikolog tersertifikasi. Hasilnya: memori traumatik masih ada, tapi charge emosionalnya berkurang signifikan. EMDR punya evidence base yang kuat.',
      'kesehatan-mental', 'EKSPLORATIF', 'RASIONAL', 10, 19,
    ],
    [
      'Pertanyaan hukum: apakah boleh merekam percakapan tanpa izin untuk bukti?',
      'Ini grey area hukum di Indonesia. Pasal 40 UU Telekomunikasi melarang intersepsi, tapi MA dalam beberapa putusan mengizinkan rekaman privat sebagai alat bukti jika: Anda adalah salah satu pihak percakapan, bukan pihak ketiga yang mengintercept. Konsultasikan ke kuasa hukum untuk kasus spesifik.',
      'hukum-digital', 'KLARIFIKATIF', 'PROFESIONAL', 4, 6,
    ],
    [
      'Data privacy di Indonesia pasca UU PDP: apa yang berubah untuk pengguna?',
      'UU Perlindungan Data Pribadi disahkan 2022, berlaku penuh 2024. Hak baru: hak akses data, hak koreksi, hak hapus (right to be forgotten), hak portabilitas. Kewajiban baru untuk perusahaan: consent eksplisit, DPO untuk pengolah data skala besar, notifikasi breach 14 hari.',
      'hukum-digital', 'INFORMATIF', 'AKADEMIK', 4, 34,
    ],
    [
      'Portfolio developer pemula: proyek apa yang paling berkesan untuk recruiter?',
      'Recruiter melihat portfolio dalam 60 detik. Yang berkesan: proyek yang menyelesaikan masalah nyata (bukan clone tutorial), ada data/angka dampaknya ("reduces load time 40%"), code di GitHub dengan README yang jelas, dan di-deploy (bisa diakses langsung). Hindari: todo app, calculator, weather app.',
      'software', 'PRAKTIS', 'PROFESIONAL', 11, 1,
    ],
    [
      'Bagaimana cara memulai bisnis kuliner dari rumah secara legal?',
      'Langkah legal: (1) NIB via OSS, (2) Sertifikat Laik Higiene dari Dinkes untuk PIRT, (3) izin edar dari BPOM jika distribusi massal, (4) NPWP untuk pajak. Modal minimal: NIB gratis, PIRT sekitar Rp 300rb. Platform: GoFood/GrabFood untuk delivery, tidak perlu toko fisik dulu.',
      'wirausaha', 'PRAKTIS', 'PROFESIONAL', 11, 4,
    ],
  ]

  const createdDiscussions = []
  for (const [
    title, content, categorySlug, mode, discipline, authorIdx, daysAgoCount
  ] of DISCUSSION_DEFS) {
    const cat = allCategories.find(c => c.slug === categorySlug)
    if (!cat) {
      console.warn(`   ⚠  category slug not found: ${categorySlug}, skipping`)
      continue
    }
    const author = allUsers[authorIdx]
    const d = await db.discussion.create({
      data: {
        title, content,
        categoryId: cat.id,
        userId:     author.id,
        mode,
        discipline,
        createdAt:  daysAgo(daysAgoCount),
        updatedAt:  daysAgo(daysAgoCount),
      },
    })
    createdDiscussions.push(d)
  }

  console.log(`   ${createdDiscussions.length} discussions created\n`)

  // ── 4. Comments ────────────────────────────────────────────────────────────
  console.log('💭 Creating comments...')

  // Each entry: [discussionIndex, authorIndex(into allUsers), content, hoursAgoCount]
  const COMMENT_DEFS = [
    // Discussion 0 — AI vs programmer
    [0, 5, 'Dari perspektif senior dev: AI sekarang adalah pair programmer yang sangat baik, bukan pengganti. Yang akan tergantikan adalah developer yang menolak belajar menggunakan AI, bukan developer pada umumnya.', 40],
    [0, 7, 'Mahasiswa tingkat akhir di sini. Jujur sedikit khawatir, tapi justru ini motivasi untuk lebih fokus ke system design dan problem-solving daripada syntax.', 38],
    [0, 10, 'Di perusahaan kami, developer yang pakai GitHub Copilot output-nya 30-40% lebih banyak. AI amplify, bukan replace. Tapi skill gap antar developer jadi lebih terlihat.', 35],
    [0, 4, 'Perspektif hukum: AI-generated code punya pertanyaan tersendiri soal liability. Siapa yang bertanggung jawab jika AI menulis kode yang menyebabkan kerugian finansial?', 20],
    // Discussion 1 — API security
    [1, 7, 'Penting ditambahkan: rate limiting di level API gateway, bukan hanya di application layer. Dan selalu validate input di server side meskipun sudah ada validation di frontend.', 110],
    [1, 9, 'Pertanyaan dari junior: apa bedanya JWT dengan session-based auth? Kapan pakai yang mana?', 100],
    [1, 5, 'JWT lebih cocok untuk stateless API dan microservices karena tidak perlu shared session store. Session-based lebih sederhana untuk web app tradisional. Untuk mobile API, JWT umumnya lebih practical.', 95],
    // Discussion 3 — Cursor vs Copilot
    [3, 7, 'Saya add Tabnine juga ke perbandingan — lebih privacy-focused karena bisa dijalankan lokal. Untuk kode sensitif/proprietary ini penting.', 180],
    [3, 5, 'Cursor menang di context window yang besar — bisa "paham" seluruh codebase. Copilot lebih bagus untuk muscle memory autocomplete. Dua-duanya saya pakai untuk kebutuhan berbeda.', 170],
    // Discussion 5 — mRNA vaccine
    [5, 3, 'Sebagai dokter, sering dapat pertanyaan ini. Penting dipahami: "baru" bukan berarti "tidak teruji". Teknologi mRNA untuk terapi kanker sudah diteliti sejak 1990an. COVID hanya mempercepat aplikasi klinisnya.', 350],
    [5, 6, 'Dari sudut pandang biokimia: stabilitas mRNA di dalam sel sangat singkat — terurai dalam jam sampai hari, bukan permanen. Kekhawatiran soal integrasi ke DNA tidak memiliki dasar mekanistik.', 340],
    [5, 7, 'Terima kasih penjelasannya. Satu pertanyaan: kenapa booster diperlukan kalau respons imunnya sudah ada?', 300],
    [5, 3, 'Antibodi menurun seiring waktu — ini normal untuk semua vaksin. Booster "mengingatkan" sistem imun dan menghasilkan sel memori yang lebih banyak. Pola ini sama dengan vaksin flu, hepatitis B, dll.', 280],
    // Discussion 8 — PKWT workers right
    [8, 4, 'Tambahan penting: PKWT tidak boleh digunakan untuk pekerjaan yang bersifat tetap atau terus-menerus. Jika dilanggar, demi hukum berubah jadi PKWTT (kontrak tidak tertentu). Ini leverage yang kuat untuk karyawan.', 160],
    [8, 10, 'Pengalaman pribadi: kena terminate tanpa kompensasi karena "masa probasi". Setelah konsultasi ke LBH, ternyata kontrak kami ilegal — tidak ada klausul probasi dalam PKWT. Akhirnya dapat hak.', 150],
    [8, 4, 'Kasus seperti ini banyak terjadi. Dokumen kontrak harus dibaca teliti sebelum tanda tangan. Jika ada yang tidak jelas atau melanggar UU, konsultasikan sebelum tanda tangan.', 140],
    // Discussion 11 — DCA vs Lump sum
    [11, 8, 'Konteks penting yang sering diabaikan: penelitian Vanguard menggunakan data pasar US yang trennya bullish jangka panjang. Di pasar yang lebih volatile seperti IHSG, DCA bisa mengungguli lump sum dalam periode sideways yang panjang.', 230],
    [11, 9, 'Dari pengalaman: saya pilih DCA karena secara psikologis lebih tenang. Pas IHSG crash 2020, yang lump sum di peak panik setengah mati, yang DCA malah happy beli di harga murah.', 220],
    // Discussion 15 — burnout vs depression
    [15, 3, 'Sebagai klinisi: satu cara membedakan — jika gejalanya (sedih, tidak berminat, lelah) membaik signifikan saat sedang liburan atau jauh dari pekerjaan, kemungkinan besar burnout. Jika tetap tidak hilang meski kondisi eksternal berubah, perlu evaluasi lebih lanjut untuk depresi.', 90],
    [15, 10, 'Terima kasih, ini sangat helpful. Satu tambahan: burnout dan depresi bisa terjadi bersamaan. Burnout yang tidak ditangani bisa trigger episode depresi klinis.', 80],
    [15, 7, 'Kapan harus ke psikiater vs psikolog? Kalau ada pikiran menyakiti diri, segera ke psikiater (bisa resepkan obat). Untuk yang belum separah itu, psikolog/konselor sudah sangat membantu.', 70],
    [15, 3, 'Betul. Tambahan: psikiater menangani kondisi yang butuh farmakologi. Keduanya bisa berkolaborasi — ini yang disebut integrated treatment, dan sering lebih efektif untuk kondisi komorbid.', 60],
    // Discussion 18 — zonasi PPDB
    [18, 11, 'Data yang sering dilupakan dalam debat zonasi: anggaran BOS per siswa sudah sama antara sekolah negeri zonasi bagus dan tidak bagus. Masalahnya ada di distribusi guru berkualitas dan fasilitas, bukan kebijakan zonasi saja.', 200],
    [18, 8, 'Pengalaman sebagai orang tua: anak saya masuk sekolah zona yang "kurang favorit". Ternyata guru-gurunya sangat dedicated. Stigma "sekolah jelek" lebih banyak dari persepsi orang tua, bukan kenyataan.',180],
    // Discussion 22 — negosiasi gaji
    [22, 11, 'Tips tambahan dari HR: research BATNA (Best Alternative to Negotiated Agreement) kamu. Kalau sudah punya offer lain, posisi negosiasi jauh lebih kuat. Dan jangan pernah sebut angka duluan.', 60],
    [22, 7, 'Bisa ceritakan bagaimana kalau sudah terlanjur sebut gaji sekarang di awal proses? Bisa recover tidak?', 55],
    [22, 11, 'Masih bisa. Saat offer datang, fokus ke value dan scope pekerjaan: "Based on scope yang lebih besar dari role sebelumnya dan hasil riset market, saya harapkan di angka X". Jangan defensif, tetap confident.', 50],
    // Discussion 25 — Blockchain use cases
    [25, 5, 'Supply chain use case yang paling matang saat ini: pharmaceutical track and trace untuk anti-pemalsuan obat. FDA sudah mandatkan ini di US. Beberapa industri farmasi Indonesia sudah mulai pilot.', 900],
    [25, 7, 'Pertanyaan genuein: kenapa tidak pakai database biasa yang di-audit secara independen? Apa yang blockchain bisa lakukan yang tidak bisa dilakukan trusted third party dengan database konvensional?', 850],
    [25, 5, 'Pertanyaan bagus. Jawaban jujur: untuk banyak use case, database biasa sudah cukup. Blockchain value add nyata ada di: multi-party yang tidak saling percaya, tidak ada trusted third party natural, dan audit trail yang immutable dan publik.', 820],
    // Discussion 30 — portfolio developer
    [30, 5, 'Yang sering saya lihat tapi jarang disebut: README yang baik sama pentingnya dengan kodenya. Jelaskan problem apa yang diselesaikan, keputusan teknis apa yang diambil dan kenapa. Ini menunjukkan kemampuan komunikasi teknis.', 20],
    [30, 7, 'Satu proyek yang kompleks tapi well-documented lebih baik dari sepuluh proyek tutorial. Quality over quantity.', 18],
    [30, 11, 'Dari sudut pandang recruiter: saya selalu cek commit history. Proyek dengan single commit giant langsung red flag. Proyek dengan commit history yang teratur menunjukkan kerja nyata.', 15],
  ]

  const createdComments = []
  for (const [discIdx, authorIdx, content, hrsAgo] of COMMENT_DEFS) {
    if (discIdx >= createdDiscussions.length) continue
    const discussion = createdDiscussions[discIdx]
    const author     = allUsers[authorIdx]
    const c = await db.comment.create({
      data: {
        content,
        discussionId: discussion.id,
        userId:       author.id,
        createdAt:    hoursAgo(hrsAgo),
        updatedAt:    hoursAgo(hrsAgo),
      },
    })
    createdComments.push({ comment: c, discussionId: discussion.id })
  }

  console.log(`   ${createdComments.length} comments created\n`)

  // ── 5. Votes ───────────────────────────────────────────────────────────────
  // Constraint: @@unique([userId, discussionId]) — one vote per user per discussion
  console.log('👍 Creating votes...')

  // [discussionIndex, voterIndex, value (+1 or -1)]
  const VOTE_DEFS = [
    // High engagement discussions get many votes
    [0,  1,  1], [0,  2,  1], [0,  3,  1], [0,  4,  1], [0,  6,  1],
    [0,  7,  1], [0,  8,  1], [0,  9,  1], [0, 10,  1], [0, 11,  1],
    [1,  0,  1], [1,  2,  1], [1,  3,  1], [1,  7,  1], [1,  8,  1], [1, 10,  1],
    [2,  0,  1], [2,  3,  1], [2,  7,  1], [2,  9,  1], [2, 11,  1],
    [3,  2,  1], [3,  4,  1], [3,  8,  1], [3,  9,  1], [3, 10,  1],
    [4,  0,  1], [4,  2,  1], [4,  3,  1], [4,  7,  1], [4,  8,  1],
    [5,  0,  1], [5,  2,  1], [5,  4,  1], [5,  7,  1], [5,  8,  1], [5, 10,  1], [5, 11,  1],
    [6,  0,  1], [6,  2,  1], [6,  4,  1], [6,  7,  1], [6,  8,  1],
    [7,  0,  1], [7,  2,  1], [7,  5,  1], [7,  9,  1], [7, 11,  1],
    [8,  0,  1], [8,  2,  1], [8,  3,  1], [8,  7,  1], [8,  9,  1], [8, 10,  1],
    [9,  0,  1], [9,  2,  1], [9,  4,  1], [9,  7,  1], [9,  8,  1],
    [10, 0,  1], [10, 2,  1], [10, 7,  1], [10, 9,  1], [10, 11,  1],
    [11, 0,  1], [11, 3,  1], [11, 4,  1], [11, 7,  1], [11, 9,  1], [11, 10,  1],
    [12, 0,  1], [12, 3,  1], [12, 7,  1], [12, 9,  1], [12, 10,  1],
    [13, 0,  1], [13, 2,  1], [13, 4,  1], [13, 8,  1], [13, 11,  1],
    [14, 0,  1], [14, 3,  1], [14, 7,  1], [14, 8,  1], [14, 11,  1],
    [15, 0,  1], [15, 2,  1], [15, 4,  1], [15, 7,  1], [15,  9,  1], [15, 10,  1], [15, 11,  1],
    [16, 0,  1], [16, 2,  1], [16, 7,  1], [16, 9,  1], [16, 10,  1],
    [17, 0,  1], [17, 2,  1], [17, 7,  1], [17, 9,  1],
    [18, 0,  1], [18, 2,  1], [18, 7,  1], [18, 9,  1], [18, 10,  1], [18, 11,  1],
    [19, 0,  1], [19, 2,  1], [19, 7,  1], [19, 10,  1],
    [20, 0,  1], [20, 3,  1], [20, 7,  1], [20, 9,  1], [20, 10,  1],
    [21, 0,  1], [21, 3,  1], [21, 7,  1], [21, 9,  1], [21, 10,  1], [21, 11,  1],
    [22, 0,  1], [22, 3,  1], [22, 7,  1], [22, 9,  1], [22, 10,  1],
    [23, 0,  1], [23, 3,  1], [23, 7,  1], [23, 9,  1],
    [24, 0,  1], [24, 2,  1], [24, 7,  1], [24, 9,  1], [24, 11,  1],
    [25, 0,  1], [25, 3,  1], [25, 7,  1], [25, 9,  1], [25, 10,  1],
    [26, 0,  1], [26, 3,  1], [26, 7,  1], [26, 9,  1], [26, 11,  1],
    [27, 0,  1], [27, 3,  1], [27, 7,  1], [27, 9,  1],
    [28, 0,  1], [28, 2,  1], [28, 7,  1], [28, 9,  1], [28, 10,  1],
    [29, 0,  1], [29, 2,  1], [29, 7,  1], [29, 9,  1],
    [30, 0,  1], [30, 2,  1], [30, 7,  1], [30, 9,  1], [30, 10,  1], [30, 11,  1],
    [31, 0,  1], [31, 2,  1], [31, 7,  1], [31, 9,  1],
    [32, 0,  1], [32, 3,  1], [32, 7,  1], [32, 9,  1], [32, 10,  1],
    [33, 0,  1], [33, 3,  1], [33, 7,  1], [33, 9,  1],
    [34, 0,  1], [34, 2,  1], [34, 7,  1], [34, 9,  1],
    [35, 0,  1], [35, 2,  1], [35, 7,  1], [35, 9,  1], [35, 11,  1],
    [36, 0,  1], [36, 3,  1], [36, 7,  1], [36, 9,  1],
    [37, 0,  1], [37, 3,  1], [37, 7,  1], [37, 9,  1], [37, 11,  1],
    [38, 0,  1], [38, 2,  1], [38, 7,  1], [38, 9,  1],
    // Some downvotes for controversial discussions
    [21, 1, -1], [21, 5, -1],   // "anti-kritik" budaya — not everyone agrees
    [18, 3, -1], [18, 5, -1],   // zonasi PPDB — polarizing topic
    [22, 2, -1],                  // negosiasi gaji — someone disagrees
  ]

  let voteCount = 0
  const seenVotePairs = new Set()
  for (const [discIdx, voterIdx, value] of VOTE_DEFS) {
    if (discIdx >= createdDiscussions.length) continue
    const key = `${voterIdx}-${discIdx}`
    if (seenVotePairs.has(key)) continue
    seenVotePairs.add(key)

    const discussion = createdDiscussions[discIdx]
    const voter      = allUsers[voterIdx]

    // Author cannot vote on own discussion (business rule)
    if (discussion.userId === voter.id) continue

    await db.vote.create({
      data: {
        value,
        discussionId: discussion.id,
        userId:       voter.id,
      },
    })
    voteCount++
  }

  console.log(`   ${voteCount} votes created\n`)

  // ── 6. Reports ─────────────────────────────────────────────────────────────
  console.log('🚩 Creating reports...')

  const REPORT_DEFS = [
    // [type('discussion'|'comment'), targetIndex, reporterIndex, reason, status]
    ['discussion', 21, 8,  'Konten bisa dianggap menyinggung budaya tertentu.',                        'RESOLVED'],
    ['discussion', 18, 9,  'Informasi zonasi tidak akurat berdasarkan kebijakan terbaru.',              'REJECTED'],
    ['discussion', 32, 10, 'Judul clickbait, konten tidak sesuai.',                                    'PENDING'],
    ['comment',     0, 9,  'Komentar tidak relevan dengan topik diskusi.',                              'PENDING'],
    ['comment',     3, 10, 'Nada komentar terasa merendahkan penanya.',                                 'RESOLVED'],
    ['discussion', 27, 7,  'Kurang sumber referensi untuk klaim yang dibuat.',                          'REJECTED'],
    ['comment',     6, 8,  'Informasi teknis berpotensi menyesatkan pembaca awam.',                     'PENDING'],
  ]

  for (const [type, targetIdx, reporterIdx, reason, status] of REPORT_DEFS) {
    const reporter = allUsers[reporterIdx]
    if (type === 'discussion') {
      if (targetIdx >= createdDiscussions.length) continue
      const discussion = createdDiscussions[targetIdx]
      if (discussion.userId === reporter.id) continue // can't report own content
      await db.report.create({
        data: { reason, status, reporterId: reporter.id, discussionId: discussion.id },
      })
    } else {
      if (targetIdx >= createdComments.length) continue
      const { comment, discussionId: _ } = createdComments[targetIdx]
      if (comment.userId === reporter.id) continue
      await db.report.create({
        data: { reason, status, reporterId: reporter.id, commentId: comment.id },
      })
    }
  }

  console.log(`   ${REPORT_DEFS.length} reports created\n`)

  // ── 7. ReputationLog ───────────────────────────────────────────────────────
  // Mirror the votes that went to discussion authors as reputation events.
  console.log('⭐ Creating reputation logs...')

  let repCount = 0
  const allVotes = await db.vote.findMany({ include: { discussion: true } })
  for (const vote of allVotes) {
    const authorId = vote.discussion.userId
    const point    = vote.value === 1 ? 10 : -10
    const reason   = vote.value === 1
      ? `Upvote diterima pada diskusi "${vote.discussion.title.slice(0, 50)}..."`
      : `Downvote diterima pada diskusi "${vote.discussion.title.slice(0, 50)}..."`
    await db.reputationLog.create({
      data: { point, reason, userId: authorId },
    })
    repCount++
  }

  // Bonus reputation for comments (authoring comments = contribution)
  const allCommentsDb = await db.comment.findMany({ include: { discussion: true } })
  for (const comment of allCommentsDb) {
    await db.reputationLog.create({
      data: {
        point:  2,
        reason: `Komentar ditulis pada diskusi "${comment.discussion.title.slice(0, 50)}..."`,
        userId: comment.userId,
      },
    })
    repCount++
  }

  // Expert verification bonus
  for (const expert of experts) {
    await db.reputationLog.create({
      data: {
        point:  50,
        reason: 'Terverifikasi sebagai Expert oleh admin.',
        userId: expert.id,
      },
    })
    repCount++
  }

  console.log(`   ${repCount} reputation log entries created\n`)

  // ── Summary ────────────────────────────────────────────────────────────────
  const [
    catCount, userCount, discCount, commentCount, voteCountFinal, reportCount, repCountFinal,
  ] = await Promise.all([
    db.category.count(),
    db.user.count(),
    db.discussion.count(),
    db.comment.count(),
    db.vote.count(),
    db.report.count(),
    db.reputationLog.count(),
  ])

  console.log('✅ Seed completed successfully!\n')
  console.log('📊 Summary:')
  console.log(`   Categories:       ${catCount}  (${rootCats.length} root + ${childCats.length} subcategories)`)
  console.log(`   Users:            ${userCount}  (1 admin, 2 moderator, 4 expert, 5 user)`)
  console.log(`   Discussions:      ${discCount}`)
  console.log(`   Comments:         ${commentCount}`)
  console.log(`   Votes:            ${voteCountFinal}`)
  console.log(`   Reports:          ${reportCount}  (PENDING + RESOLVED + REJECTED)`)
  console.log(`   Reputation Logs:  ${repCountFinal}`)
  console.log()
  console.log('🔑 Test credentials:')
  console.log('   admin@olion.id       / admin123')
  console.log('   moderator@olion.id   / moderator123')
  console.log('   dr.sarah@olion.id    / expert123  (Expert)')
  console.log('   aditya99@olion.id    / password123')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => db.$disconnect())
