# Feature Breakdown MVP

**Project Name:** OLION  
**Document Type:** Feature Breakdown MVP  
**Owner:** beel  
**Version:** 1.0  
**Last Update:** 2026-03-27  

---

# 1. Tujuan MVP

Minimum Viable Product (MVP) OLION dirancang untuk menghadirkan platform diskusi berbasis reputasi yang stabil, aman, dan terstruktur.

Fokus utama MVP adalah memastikan seluruh alur utama sistem dapat berjalan secara end-to-end, mulai dari autentikasi pengguna hingga moderasi konten.

Tujuan utama MVP:

1. Menyediakan ruang diskusi yang aman dan terstruktur
2. Mendorong kontribusi pengetahuan yang berkualitas
3. Menjaga kualitas konten melalui sistem voting dan moderasi
4. Menyediakan kontrol administratif dasar untuk menjaga stabilitas sistem

---

# 2. Target Keberhasilan MVP

MVP dianggap berhasil jika memenuhi indikator berikut:

- ≥ 30 Weekly Active Users (WAU)
- ≥ 80 diskusi aktif selama fase MVP
- ≥ 65% diskusi memiliki minimal satu jawaban
- ≥ 50% konten menerima voting
- ≥ 90% laporan (report) diproses dalam waktu 24 jam
- Sistem berjalan stabil dengan error rate API < 2%

---

# 3. Prinsip Pengembangan MVP

Pengembangan MVP mengikuti prinsip berikut:

- Fitur difokuskan pada alur utama sistem, bukan kelengkapan maksimal
- Setiap fitur memiliki integrasi jelas dengan database dan API
- Validasi data dilakukan di sisi backend
- Kontrol akses berbasis role diterapkan pada seluruh endpoint
- Aktivitas penting dicatat dalam sistem logging dasar
- Pengujian dilakukan untuk memastikan stabilitas fitur inti

---

# 4. Breakdown Fitur MVP

---

# MODULE A — Authentication & Account Management

Modul ini mengelola identitas pengguna serta proses autentikasi.

## Fitur Utama

### A1 — Registrasi Pengguna

Pengguna dapat membuat akun menggunakan email dan password.

Fungsi utama:

- Pendaftaran menggunakan email unik
- Password disimpan dalam bentuk hash
- Sistem secara otomatis membuat pseudonym unik
- Role default pengguna adalah `user`

Data utama:

- email
- password_hash
- pseudonym
- role
- status
- created_at

---

### A2 — Login

Pengguna dapat masuk ke sistem menggunakan email dan password.

Output login:

- Access token (JWT)
- Refresh token

Access token digunakan untuk autentikasi request API, sedangkan refresh token digunakan untuk memperbarui sesi login.

---

### A3 — Logout

Logout mengakhiri sesi aktif pengguna dengan menonaktifkan refresh token.

---

### A4 — Reset Password

Pengguna dapat melakukan reset password melalui email.

Alur:

1. Pengguna meminta reset password
2. Sistem mengirim token reset
3. Pengguna membuat password baru
4. Password diperbarui di database

Token reset memiliki batas waktu valid.

---

### A5 — Manajemen Pseudonym

Pengguna dapat mengubah pseudonym dalam batas tertentu.

Batasan:

- Maksimal 3 kali perubahan pseudonym selama masa akun

---

# MODULE B — Forum Discussion

Modul inti yang menyediakan ruang diskusi.

---

## Fitur Utama

### B1 — Membuat Diskusi

Pengguna dapat membuat diskusi baru.

Setiap diskusi wajib memiliki:

- Judul
- Konten
- Kategori

Konten dalam MVP berbasis teks.

---

### B2 — Daftar Diskusi

Sistem menampilkan daftar diskusi dengan dukungan:

- Pagination
- Filter kategori
- Pencarian berdasarkan kata kunci

---

### B3 — Detail Diskusi

Halaman detail diskusi menampilkan:

- Konten diskusi
- Daftar jawaban
- Komentar terkait

---

### B4 — Update Diskusi

Pengguna dapat mengubah diskusi dalam waktu maksimal 24 jam setelah dibuat.

---

### B5 — Hapus Diskusi

Penghapusan dilakukan menggunakan metode soft delete.

Diskusi tidak tampil ke publik namun tetap tersimpan di database.

---

### B6 — Jawaban Diskusi

Pengguna dapat memberikan jawaban pada diskusi.

Setiap jawaban terkait langsung dengan diskusi.

---

### B7 — Komentar

Komentar dapat ditambahkan pada:

- Diskusi
- Jawaban

---

# MODULE C — Voting & Reputation

Modul ini membantu menjaga kualitas konten melalui sistem voting.

---

## Fitur Utama

### C1 — Voting Konten

Voting tersedia untuk:

- Diskusi
- Jawaban

Jenis voting:

- Upvote
- Downvote

Setiap pengguna hanya dapat memberikan satu vote pada satu konten.

---

### C2 — Pembatalan Vote

Pengguna dapat membatalkan atau mengganti vote yang telah diberikan.

---

### C3 — Reputasi Pengguna

Reputasi dihitung berdasarkan interaksi voting terhadap konten pengguna.

Reputasi digunakan sebagai indikator kontribusi pengguna.

---

# MODULE D — Report & Moderation

Modul ini berfungsi menjaga keamanan dan kualitas konten.

---

## Fitur Utama

### D1 — Report Konten

Pengguna dapat melaporkan konten berupa:

- Diskusi
- Jawaban
- Komentar

Kategori laporan:

- Spam
- Harassment
- Hate Speech
- Misinformation
- Other

---

### D2 — Moderation Queue

Moderator dapat melihat daftar laporan yang masuk.

Queue berisi:

- Detail konten
- Alasan laporan
- Status laporan

---

### D3 — Hide Content

Moderator dapat menyembunyikan konten bermasalah.

Efek:

- Konten tidak tampil ke publik
- Pemilik konten tetap dapat melihatnya

---

### D4 — Resolve Report

Moderator dapat menandai laporan sebagai selesai.

Status laporan diperbarui dalam sistem.

---

# MODULE E — Verified Expert

Modul ini memungkinkan identifikasi pengguna dengan keahlian tertentu.

---

## Fitur Utama

### E1 — Pengajuan Expert

Pengguna dapat mengajukan verifikasi dengan:

- Dokumen pendukung
- Link portofolio

Status permintaan:

- Pending
- Approved
- Rejected
- Revoked

---

### E2 — Persetujuan Expert

Admin dapat menyetujui atau menolak permintaan.

Jika disetujui:

- Role pengguna diperbarui menjadi `expert`
- Label expert tampil di profil dan jawaban

---

# MODULE F — Admin & Moderator Panel

Modul ini menyediakan kontrol administratif sistem.

---

## Fitur Utama

### F1 — Manajemen Pengguna

Admin dapat:

- Melihat daftar pengguna
- Mengubah role
- Menonaktifkan akun

---

### F2 — Manajemen Kategori

Admin dapat:

- Membuat kategori
- Mengubah kategori
- Menghapus kategori

Kategori digunakan sebagai klasifikasi diskusi.

---

### F3 — Role Management

Role yang tersedia:

- user
- expert
- moderator
- admin

Setiap role memiliki hak akses yang berbeda.

---

# MODULE G — System Foundation

Komponen pendukung sistem.

---

## Fitur Utama

### G1 — Dokumentasi API

Seluruh endpoint tersedia dalam dokumentasi API menggunakan OpenAPI / Swagger.

Dokumentasi harus selalu sesuai dengan implementasi API.

---

### G2 — Deployment Docker

Aplikasi dapat dijalankan menggunakan Docker.

File minimal:

- Dockerfile
- docker-compose.yml
- .env.example

---

### G3 — Logging

Aktivitas penting dicatat dalam sistem logging.

Contoh aktivitas:

- Login pengguna
- Voting
- Moderasi konten

Logging digunakan untuk kebutuhan audit dan troubleshooting.

---

# 5. Urutan Implementasi

Urutan pengembangan:

1. Authentication & RBAC
2. Category Management
3. Discussion System
4. Answer System
5. Comment System
6. Voting System
7. Report & Moderation
8. Verified Expert
9. Admin Panel
10. API Documentation
11. Deployment Setup

---

# 6. Deliverables MVP

MVP OLION dianggap siap digunakan ketika komponen berikut tersedia:

1. Frontend Web Application
2. Backend REST API
3. Database schema
4. API Documentation
5. Test cases dasar
6. Docker deployment package
7. Basic system logging

---

# Document Status

Status: **Finalized**  
Readiness: **Ready for System Design & Implementation**
