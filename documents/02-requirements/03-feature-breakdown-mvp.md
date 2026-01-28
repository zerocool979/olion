# Feature Breakdown MVP

**Project Name:** OLION
**Document Type:** Feature Breakdown MVP
**Owner/Developer:** beel (Solo Fullstack)
**Version:** 1.0
**Last Update:** 2026-01-28

---

## 1) Tujuan MVP (Outcome)

MVP OLION ditujukan untuk mencapai hasil berikut (bukan sekadar fitur):

1. **Meningkatkan partisipasi diskusi yang aman dan berkelanjutan**
2. **Meningkatkan kualitas dan kedalaman kontribusi pengetahuan**
3. **Menciptakan ekosistem diskusi yang tertib dan minim intimidasi**

---

## 2) Success Metrics MVP (Target Minimal)

Target keberhasilan MVP OLION dinyatakan tercapai jika minimal memenuhi:

* **≥ 30 Weekly Active Users (WAU)**
* **≥ 80–100 diskusi** dalam fase MVP
* **≥ 65–70% diskusi terjawab** (punya respons bermakna)
* **Upvote/Downvote ratio > 2:1** pada jawaban

---

## 3) Prinsip MVP (Rules of MVP)

Agar MVP selesai dan siap produksi, maka disepakati prinsip berikut:

* MVP fokus pada **end-to-end flow**:
  register/login → buat diskusi → jawab/komentar → voting → report → moderasi
* UI cukup **fungsional & jelas**, bukan final polishing
* Sistem reputasi dibuat **basic**, tanpa badge/level
* Moderasi dibuat **manual & terkontrol**, bukan AI otomatis
* Semua modul harus sinkron dengan:

  * database schema
  * API endpoint
  * RBAC permission
  * test plan & evidence

---

## 4) Feature Breakdown MVP

### A) Autentikasi & Akun

**Tujuan:** memastikan hanya user login yang bisa berkontribusi, dengan identitas publik pseudonym.

**Sub-fitur minimal:**

* Register menggunakan **email + password**
* Login menghasilkan **JWT access token + refresh token**
* Logout
* Pseudonym default auto-generate format: `society_XXXX` (acak huruf+angka)
* User dapat edit pseudonym **maksimal 3x seumur akun**
* Forgot password (reset password flow)

**Batas MVP (tidak dibuat dulu):**

* Social login (Google/GitHub)
* MFA/2FA
* Anonymous posting tanpa akun

**Definition of Done (DoD):**

* Register/Login/Logout berjalan end-to-end
* Access token + refresh token berjalan stabil
* Endpoint protected menggunakan middleware RBAC
* Pseudonym unik & tervalidasi formatnya
* Edit pseudonym enforce limit max 3x
* Forgot password bekerja dengan token reset
* Test case inti auth minimal PASS

---

### B) Forum Diskusi (Core Knowledge Flow)

**Tujuan:** menyediakan ruang diskusi terstruktur dan mudah diakses.

**Sub-fitur minimal:**

* CRUD Diskusi (create, read/list, update, delete)
* Diskusi wajib memiliki **kategori**
* List diskusi + pagination
* Detail diskusi (isi diskusi + jawaban + komentar)
* Search diskusi by keyword
* Status diskusi: **OPEN / SOLVED**
* Jawaban pada diskusi
* Komentar pada diskusi/jawaban

**Aturan MVP (disepakati):**

* Konten MVP **text-only**, link diperbolehkan
* Edit diskusi/jawaban/komentar maksimal **24 jam**
* Delete konten oleh user = **soft delete**
* Diskusi boleh dibuat meskipun belum ada jawaban

**Batas MVP (tidak dibuat dulu):**

* Rich text editor advanced
* Attachment upload (gambar/file)
* Bookmark/follow thread
* Tagging kompleks

**Definition of Done (DoD):**

* User bisa create diskusi (wajib kategori)
* User bisa jawab + komentar
* List & detail diskusi berjalan stabil
* Search bekerja
* Status OPEN/SOLVED bisa diubah sesuai aturan
* Soft delete tidak menampilkan konten ke publik
* Edit time limit 24 jam enforce di backend
* Test case inti diskusi minimal PASS

---

### C) Voting & Reputasi (Quality Control Basic)

**Tujuan:** mendorong kontribusi berkualitas dan mengurangi noise.

**Sub-fitur minimal:**

* Voting berlaku untuk: **diskusi + jawaban**
* Upvote + Downvote aktif
* Vote dapat di-undo (batal/ganti vote)
* Perhitungan score vote untuk konten
* Reputasi basic berdasarkan upvote & downvote

**Batas MVP (tidak dibuat dulu):**

* Voting untuk komentar
* Badge/level user
* Sistem ranking kompleks / leaderboard

**Definition of Done (DoD):**

* Voting diskusi & jawaban berjalan
* 1 user hanya bisa 1 vote per konten
* Undo vote berjalan benar
* Reputasi update sesuai aturan (basic)
* Test case voting minimal PASS

---

### D) Report & Moderasi (Safety Layer)

**Tujuan:** menjaga OLION tetap menjadi ruang aman dari bullying, spam, dan intimidasi.

**Sub-fitur minimal:**

* Report untuk: **diskusi + jawaban + komentar**
* Hanya user **non-banned** yang boleh report
* Reason report fixed list + note opsional:

  * Spam
  * Bullying/Harassment
  * Hate Speech
  * Misinformation
  * Other
* Moderation queue untuk report
* Aksi moderasi minimal:

  * hide content
  * resolve report
* Jika konten di-hide:

  * publik tidak bisa lihat
  * owner tetap bisa lihat

**Batas MVP (tidak dibuat dulu):**

* AI moderation otomatis penuh
* Auto-ban otomatis berdasarkan report count
* Appeal system / dispute resolution

**Definition of Done (DoD):**

* Report bisa dibuat & masuk queue
* Moderator/Admin bisa lihat queue
* Hide content bekerja sesuai aturan visibility
* Resolve report mengubah status report
* Semua aksi tercatat minimal untuk audit (log sederhana)
* Test case report & moderasi minimal PASS

---

### E) Verified Expert

**Tujuan:** menghadirkan kontribusi kredibel dari pakar untuk memperkuat kualitas diskusi.

**Sub-fitur minimal:**

* User dapat mengajukan expert verification dengan:

  * dokumen (sertifikat/CV/dll)
  * link portofolio (wajib)
* Status request: **pending → approved/rejected → revoked**
* Approve/reject hanya oleh **Admin**
* Label expert muncul pada:

  * profil
  * jawaban
* Expert tetap dapat membuat diskusi seperti user biasa

**Batas MVP (tidak dibuat dulu):**

* Multi-level expert tier
* Verified organization
* Sistem review peer expert

**Definition of Done (DoD):**

* Request expert bisa dibuat dan disimpan
* Admin bisa approve/reject/revoke
* Label expert muncul pada profil & jawaban
* Role/flag expert enforce di backend
* Test case expert verification minimal PASS

---

### F) Admin & Moderator Panel

**Tujuan:** menyediakan kontrol sistem yang cukup untuk menjaga kualitas dan keamanan platform.

**Sub-fitur minimal:**

* Moderator:

  * boleh hide content
  * boleh resolve report
* Admin panel minimal mencakup:

  * user management
  * expert verification
  * report queue
* Admin dapat edit role user manual
* CRUD kategori hanya oleh **Admin**

**Batas MVP (tidak dibuat dulu):**

* Analytics dashboard kompleks
* Bulk actions skala besar
* Workflow moderation multi-step

**Definition of Done (DoD):**

* Panel Admin/Moderator bisa diakses sesuai RBAC
* Admin bisa kelola user & role
* Admin bisa kelola kategori
* Moderator bisa proses report (hide + resolve)
* Test case panel permission minimal PASS

---

### G) Dokumentasi, Testing, Deployment

**Tujuan:** memastikan sistem bisa dipakai, diuji, dan dideploy dengan standar minimum produksi.

**Sub-fitur minimal:**

* API Documentation menggunakan **Swagger**
* Test plan + test cases untuk fitur inti
* Evidence testing berupa **screenshot + log**
* Deployment target: **local + docker**
* File `.env.example` tersedia

**Batas MVP (tidak dibuat dulu):**

* CI/CD pipeline penuh
* Performance testing skala besar
* Auto-deploy ke cloud

**Definition of Done (DoD):**

* Swagger dapat diakses dan sinkron dengan endpoint
* Test cases inti minimal PASS
* Evidence testing tersimpan rapi
* Docker build & docker compose bisa run aplikasi
* `.env.example` tersedia dan valid

---

## 5) Urutan Implementasi

Urutan pengerjaan MVP OLION yang paling efisien:

1. Auth + RBAC + pseudonym + token (access/refresh)
2. Forum diskusi + kategori + status OPEN/SOLVED
3. Jawaban + komentar
4. Voting + reputasi basic
5. Report + moderation queue + hide/resolve
6. Verified expert (request + approval)
7. Admin/Moderator panel (user mgmt + report queue + expert verification)
8. Swagger + testing evidence + docker deployment

---

## 6) Output MVP (Deliverables Minimal)

MVP OLION dinyatakan siap rilis jika deliverables berikut terpenuhi:

1. Frontend Web Application (role-based UI)
2. Backend REST API
3. Database schema + migration/seed
4. Dokumentasi API (Swagger)
5. Testing report + evidence
6. Deployment package (local + docker)

---
