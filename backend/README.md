# OLION — Backend

REST API untuk platform diskusi OLION. Dibangun dengan **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

## Prasyarat

| Tool | Versi minimum |
|---|---|
| Node.js | 18 LTS |
| npm | 9+ |
| PostgreSQL | 14+ |

---

## Setup Awal

```bash
# 1. Clone & masuk ke folder backend
cd backend

# 2. Install dependency
npm install

# 3. Salin env template dan isi nilainya
cp .env.example .env
# Edit DATABASE_URL dan JWT_SECRET di .env

# 4. Jalankan migrasi database
npx prisma migrate dev --name init

# 5. Seed data awal (badge, kategori, user dev, sample diskusi)
ALLOW_OLION_SEED=true npm run seed
# PowerShell: $env:ALLOW_OLION_SEED="true"; npm run seed
# Seed hanya untuk database development/test; production selalu ditolak.

# 6. Generate Prisma Client
npx prisma generate

# 7. Jalankan server development
npm run dev
# → Server berjalan di http://localhost:4000
```

---

## Script yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Server development dengan hot-reload (nodemon) |
| `npm start` | Server production |
| `npm test` | Jalankan security regression tests (Node.js built-in test runner) |
| `ALLOW_OLION_SEED=true npm run seed` | Isi database development dengan data awal (production ditolak) |
| `npx prisma migrate dev` | Jalankan migrasi database |
| `npx prisma studio` | GUI browser untuk inspeksi database |

---

## Struktur Folder

```
backend/
├── prisma/
│   ├── schema.prisma   # Definisi model database
│   └── seed.js         # Data awal (badge, kategori, user dev)
└── src/
    ├── app.js           # Setup Express, CORS, middleware
    ├── server.js        # Entry point (listen port)
    ├── routes.js        # Semua route terdaftar di sini
    ├── config/
    │   ├── env.js       # Variabel environment
    │   └── prisma.js    # Instance PrismaClient (singleton)
    ├── middlewares/
    │   ├── auth.js      # Verifikasi JWT + cek user aktif di DB
    │   ├── role.js      # Otorisasi role (mendukung array role)
    │   └── error.js     # Global error handler
    ├── utils/
    │   └── jwt.js       # sign & verify token
    └── modules/         # Satu folder per domain
        ├── auth/        # Register, login, ganti password
        ├── user/        # Profil, follow/unfollow, list user
        ├── discussion/  # CRUD diskusi, search, view count
        ├── comment/     # CRUD komentar, reply, vote komentar
        ├── vote/        # Vote diskusi & komentar (upvote/downvote)
        ├── report/      # Laporan konten
        ├── moderator/   # Aksi hide/unhide/ban (dipanggil oleh report)
        ├── admin/       # Manajemen user, role, statistik platform
        ├── expert/      # Pengajuan & review verifikasi pakar
        ├── badge/       # Sistem badge & auto-award
        ├── reputation/  # Log poin reputasi, trigger badge
        ├── notification/# Notifikasi in-app
        ├── chat/        # Percakapan & pesan 1:1
        ├── category/    # Kategori & subkategori diskusi
        ├── trending/    # Diskusi trending
        ├── leaderboard/ # Ranking reputasi user
        └── stats/       # Statistik publik platform
```

---

## Endpoint Utama

### Auth
| Method | Path | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Daftar akun baru |
| POST | `/api/auth/login` | Public | Login, dapat JWT |
| POST | `/api/auth/google` | Public | Login Google untuk identitas yang sudah tertaut |
| POST | `/api/auth/google/link` | Auth | Hubungkan Google dengan email terverifikasi yang sama |
| GET | `/api/auth/me` | Auth | Info user saat ini |
| PATCH | `/api/auth/password` | Auth | Ganti password |

### Diskusi
| Method | Path | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/discussions` | Public | Daftar diskusi |
| POST | `/api/discussions` | Auth | Buat diskusi baru |
| GET | `/api/discussions/:id` | Public | Detail diskusi + komentar |
| PATCH | `/api/discussions/:id` | Auth/Pemilik/Staff | Edit diskusi |
| DELETE | `/api/discussions/:id` | Auth/Pemilik/Staff | Hapus diskusi |
| GET | `/api/search` | Public | Cari diskusi |

### Expert & Badge
| Method | Path | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/expert/apply` | Auth | Ajukan verifikasi pakar |
| GET | `/api/expert/my-application` | Auth | Status permohonan sendiri |
| GET | `/api/admin/expert-applications` | Admin | List semua permohonan |
| PUT | `/api/admin/expert-applications/:id` | Admin | Setujui / tolak permohonan |
| GET | `/api/badges` | Public | Semua badge tersedia |
| GET | `/api/users/:id/badges` | Public | Badge milik user |

### Admin
| Method | Path | Akses | Keterangan |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Statistik platform |
| GET | `/api/admin/users` | Admin | Daftar semua user |
| PUT | `/api/admin/users/:id/role` | Admin | Ganti role user |
| POST | `/api/admin/users/:id/ban` | Admin | Ban user |
| DELETE | `/api/admin/users/:id/ban` | Admin | Unban user |

---

## Data Development

Seed menyiapkan akun dan konten demo untuk database lokal. Kredensial demo tidak boleh digunakan pada staging atau production. Script seed menolak berjalan tanpa `ALLOW_OLION_SEED=true` dan menolak `NODE_ENV=production`.

---

## Catatan Arsitektur

- **JWT** disimpan di sisi client (localStorage). Masa aktif 7 hari. Token diperiksa keberadaan user di DB per-request sehingga akun yang di-ban langsung diblokir tanpa menunggu expire.
- **Reputasi** dihitung dari `ReputationLog` (bukan agregat real-time), sehingga mudah diaudit. Setiap kali reputasi bertambah, sistem otomatis mengecek dan memberikan badge yang layak.
- **Vote** hanya menerima `value: 1` (upvote) atau `-1` (downvote). Kirim `value: 0` untuk mencabut vote. Satu user satu vote per konten (upsert).
- **Leaderboard** menggunakan 3 query flat (bukan N*4 query per user) sehingga tetap efisien hingga ribuan user.


