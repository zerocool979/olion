# Olion Frontend

Frontend untuk **Olion**, sebuah platform diskusi berbasis role (User, Pakar, Admin) dengan sistem reputasi, notifikasi, dan moderasi.

Project ini dibangun dengan fokus pada **arsitektur bersih, konsistensi data, dan production‑ready flow**.

---

## Tech Stack

* **Framework**: Next.js (Pages Router)
* **UI**: React + Tailwind CSS
* **State Global**: React Context (AuthContext)
* **HTTP Client**: Axios (single instance)
* **Auth**: JWT (Bearer Token)
* **Style**: Utility‑first + minimal inline style

---

## Struktur Folder

```
frontend/
├── public/
├── src/
│   ├── api/            # Semua komunikasi ke backend
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state (Auth)
│   ├── pages/          # Routing (Next.js)
│   ├── styles/         # Global styles
│   └── socket.js       # (opsional realtime)
├── next.config.js
└── package.json
```

---

## Authentication Flow

1. User login / register
2. Backend mengembalikan **JWT token**
3. Token disimpan di `localStorage`
4. Axios interceptor otomatis mengirim token
5. `/auth/me` dipakai untuk validasi sesi

**Single source of truth**: `AuthContext`

---

## API Layer

Semua request backend melalui folder `src/api/`

Contoh:

* `discussion.js`
* `answer.js`
* `comment.js`
* `vote.js`
* `notification.js`
* `pakar.js`
* `report.js`
* `moderation.js`

 Tidak ada business logic di API layer

---

## Routing & Pages

| Route               | Akses             | Deskripsi      |
| ------------------- | ----------------- | -------------- |
| `/login`            | Public            | Login user     |
| `/register`         | Public            | Registrasi     |
| `/`                 | Protected         | Dashboard      |
| `/discussions`      | Protected         | List diskusi   |
| `/discussions/[id]` | Protected         | Detail diskusi |
| `/notifications`    | Protected         | Notifikasi     |
| `/pakar`            | Protected         | Daftar pakar   |
| `/reputation`       | Protected         | Reputasi user  |
| `/users`            | Protected (Admin) | Manajemen user |

Proteksi route menggunakan **`ProtectedRoute`**.

---

## Components Philosophy

Semua komponen:

* Presentational only
* Defensive rendering
* Tidak fetch data
* Tidak akses auth langsung

Contoh komponen:

* `DiscussionCard`
* `AnswerCard`
* `CommentCard`
* `PakarCard`
* `ReputationCard`

---

## Design Principles

* 🔹 **Separation of Concerns**
* 🔹 **Backend‑driven authorization**
* 🔹 **Single Axios Instance**
* 🔹 **No Silent Error**
* 🔹 **Production‑ready structure**

---

## ▶️ Menjalankan Project

```bash
npm install
npm run dev
```

Pastikan backend berjalan dan env tersedia:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Testing Checklist (Manual)

* [ ] Login & logout
* [ ] Token expired handling
* [ ] Protected route redirect
* [ ] API error surfaced to UI
* [ ] Role‑based access (Admin / Pakar)

---

## Catatan Penting

* Tidak ada logic role di frontend
* Semua keputusan keamanan di backend
* Frontend hanya **render & handle UX**

---

## Status Project

Frontend **Not Finished, Finished But Not Perfect**

Struktur ini siap untuk:

* Penilaian akademik
* Scaling fitur
* Production deployment

---

**Built with discipline, not shortcuts...**
