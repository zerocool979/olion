# OLION — Frontend

Antarmuka web untuk platform diskusi OLION. Dibangun dengan **Next.js 14** (Pages Router), **Tailwind CSS**, dan **Axios**.

## Prasyarat

| Tool | Versi minimum |
|---|---|
| Node.js | 18 LTS |
| npm | 9+ |

Backend OLION harus sudah berjalan di `http://localhost:4000` (atau sesuai konfigurasi `.env.local`).

---

## Setup Awal

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependency
npm install

# 3. Salin env template
cp .env.example .env.local
# Sesuaikan NEXT_PUBLIC_API_URL jika backend bukan di localhost:4000

# 4. Jalankan development server
npm run dev
# → Buka http://localhost:3000
```

---

## Script yang Tersedia

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Development server dengan hot-reload |
| `npm run build` | Build production |
| `npm start` | Jalankan build production |

---

## Struktur Folder

```
frontend/
├── components/
│   ├── dashboard/      # Komponen reusable khusus dashboard (Avatar, StatPill, dll)
│   └── images/         # Aset gambar (logo, dll)
├── context/
│   └── AuthContext.js  # State autentikasi global (user, token, login/logout)
├── hooks/              # Custom React hooks
├── lib/
│   ├── api.js          # Instance Axios dengan auto-attach token dari localStorage
│   ├── auth.js         # Helper login/logout/decode token
│   ├── routes.js       # Konstanta path route frontend
│   └── timeAgo.js      # Format waktu relatif
└── pages/
    ├── index.js         # Landing / home
    ├── auth/            # Login & register
    ├── user/
    │   ├── dashboard.js        # Dashboard utama user
    │   ├── discussions/        # Browse & detail diskusi
    │   ├── profile/
    │   │   ├── [username].js         # Halaman profil publik
    │   │   └── [username]/
    │   │       ├── followers.js      # Daftar followers
    │   │       └── following.js      # Daftar following
    │   ├── leaderboard.js      # Ranking reputasi
    │   ├── search.js           # Halaman pencarian
    │   ├── chat.js             # Percakapan 1:1
    │   └── notifications.js    # Notifikasi in-app
    ├── admin/
    │   └── dashboard.js   # Panel admin: user, laporan, statistik
    ├── moderator/
    │   └── dashboard.js   # Panel moderator: antrian laporan, konten tersembunyi
    └── expert/
        └── dashboard.js   # Panel pakar: pertanyaan belum dijawab, riwayat jawaban
```

---

## Halaman & Akses

| Path | Akses | Keterangan |
|---|---|---|
| `/` | Public | Landing page |
| `/auth/login` | Guest only | Form login |
| `/auth/register` | Guest only | Form daftar |
| `/user/dashboard` | Auth | Dashboard personal |
| `/user/discussions` | Public | Daftar semua diskusi |
| `/user/discussions/:id` | Public | Detail diskusi & komentar |
| `/user/profile/:username` | Public | Profil user |
| `/user/leaderboard` | Public | Ranking reputasi |
| `/user/search` | Public | Pencarian diskusi |
| `/user/chat` | Auth | Chat 1:1 |
| `/user/notifications` | Auth | Notifikasi |
| `/admin/dashboard` | ADMIN | Panel administrasi |
| `/moderator/dashboard` | MODERATOR/ADMIN | Panel moderasi |
| `/expert/dashboard` | EXPERT/ADMIN | Panel pakar |

---

## Catatan Teknis

- **Token** disimpan di `localStorage` dan dilampirkan otomatis ke setiap request via Axios interceptor (`lib/api.js`).
- **AuthContext** menyimpan state `user` + `token` secara global. Gunakan `useContext(AuthContext)` untuk mengakses dari komponen mana pun.
- **Design tokens** tersimpan di `components/dashboard/tokens.js` — gunakan `colors.*` untuk konsistensi tema gelap di seluruh halaman dashboard.
- **Route API** dikonfigurasi sebagai rewrite di `next.config.js`: `/api/*` → `http://localhost:4000/api/*`, sehingga tidak ada CORS issue di development.


