
# Non-Functional Requirements Detail (NFR)

**Project Name:** OLION
**Document Type:** NFR Detail
**Owner/Developer:** beel (Solo Fullstack)
**Version:** 1.0
**Last Update:** 2026-01-28

## 1) Tujuan Dokumen

Dokumen ini mendefinisikan **Non-Functional Requirements (NFR)** OLION yang:

* **tajam & terukur**
* bisa dipakai sebagai standar implementasi
* bisa diverifikasi lewat testing dan evidence

## 2) NFR — Security & Authentication

### NFR-S01 — Password Policy

* Password minimal **10 karakter**
* Tidak ada aturan kompleksitas wajib (cukup panjang)

**Acceptance Criteria:**

* Sistem menolak password < 10 karakter
* Sistem menerima password panjang tanpa memaksa simbol/huruf besar

**Verification:**

* Test case register: password 9 char → FAIL
* Test case register: password 10 char → PASS

### NFR-S02 — Password Storage

* Password harus disimpan menggunakan hashing **Argon2**
* Tidak boleh menyimpan password dalam bentuk plaintext

**Acceptance Criteria:**

* Database hanya menyimpan hash argon2
* Tidak ada endpoint yang mengembalikan password

**Verification:**

* Inspect database: format hash argon2
* Static check: tidak ada log password

### NFR-S03 — Token Security (JWT + Refresh Token)

* Sistem menggunakan:

  * **Access Token expiry: 15 menit**
  * **Refresh Token expiry: 30 hari**
* Refresh token menggunakan **rotation** (refresh token selalu diganti setiap refresh)

**Acceptance Criteria:**

* Access token expired → request protected endpoint ditolak
* Refresh token valid → dapat generate token baru
* Refresh token lama tidak valid setelah rotation

**Verification:**

* Test refresh flow end-to-end
* Cek invalidation refresh token lama

### NFR-S04 — Logout Behavior

* Logout harus melakukan **revoke refresh token di server**
* Logout bukan hanya “hapus token di client”

**Acceptance Criteria:**

* Setelah logout, refresh token tidak dapat digunakan lagi

**Verification:**

* Login → logout → refresh → harus FAIL

### NFR-S05 — Rate Limiting (Auth Protection)

* Endpoint auth harus dibatasi minimal:

  * **5 request/menit per IP** (untuk login/forgot password)

**Acceptance Criteria:**

* Jika melebihi limit, server mengembalikan error (429 Too Many Requests)

**Verification:**

* Stress test ringan auth endpoint → limit aktif

## 3) NFR — Privacy & Pseudonymity

### NFR-P01 — Controlled Pseudonymity

* Identitas publik utama user adalah **pseudonym**
* Sistem tidak menampilkan identitas asli di area publik

**Acceptance Criteria:**

* Profil publik dan konten hanya menampilkan pseudonym
* Email tidak tampil di UI publik

**Verification:**

* UI check: list diskusi/jawaban/komentar hanya pseudonym

### NFR-P02 — Admin Identity Access via Audit Mode

* Admin boleh melihat identitas asli user hanya melalui **audit mode**
* Semua akses audit mode wajib **tercatat dalam audit log**

**Acceptance Criteria:**

* Audit mode action tercatat: siapa, kapan, target user, alasan/tujuan

**Verification:**

* Trigger audit mode → audit log muncul

### NFR-P03 — Expert Document Storage Privacy

* Dokumen verifikasi expert harus disimpan di **S3-compatible/cloud storage**
* Dokumen tidak boleh diekspos sebagai public file tanpa kontrol akses

**Acceptance Criteria:**

* File expert tidak dapat diakses publik tanpa otorisasi
* Link akses bersifat aman (private / signed URL / protected route)

**Verification:**

* Coba akses URL tanpa token → FAIL

## 4) NFR — Performance & Scalability

### NFR-PS01 — API Response Time Target

* Target performa API: **p95 ≤ 500ms** untuk endpoint inti MVP

**Endpoint inti mencakup:**

* auth
* list diskusi
* detail diskusi
* create diskusi/jawaban/komentar
* voting
* report
* moderation actions

**Acceptance Criteria:**

* p95 latency memenuhi target pada kondisi normal

**Verification:**

* Load test ringan / benchmark lokal dengan dataset wajar

### NFR-PS02 — Concurrency Target

* MVP harus mampu melayani minimal **100 concurrent users**

**Acceptance Criteria:**

* Sistem tetap stabil, tidak crash, dan error rate tetap rendah

**Verification:**

* Basic concurrency test (k6 / artillery / simple script)

### NFR-PS03 — Pagination Standard

* Default pagination untuk list endpoint: **20 items/page**

**Acceptance Criteria:**

* Endpoint list diskusi selalu paginated
* Parameter page/limit tervalidasi

**Verification:**

* Test list diskusi page=1 limit=20 → PASS

### NFR-PS04 — Search Strategy (MVP)

* Search diskusi menggunakan **Postgres Full-Text Search (FTS)**

**Acceptance Criteria:**

* Query keyword menghasilkan hasil relevan
* Search tidak menggunakan full scan tanpa index

**Verification:**

* Test search keyword umum & spesifik
* Review query plan (opsional)

## 5) NFR — Availability & Data Protection

### NFR-A01 — Uptime Target MVP

* Target availability MVP: **99% uptime**

**Acceptance Criteria:**

* Sistem dapat dijalankan stabil pada deployment target (local + docker)

**Verification:**

* Smoke test saat deployment
* Monitoring sederhana (manual check)

### NFR-A02 — Database Backup

* Backup database dilakukan **harian (daily)**

**Acceptance Criteria:**

* Tersedia prosedur backup dan restore yang bisa dijalankan

**Verification:**

* Dokumentasi backup ada
* Uji restore minimal 1x pada environment testing

### NFR-A03 — Soft Delete Retention

* Data soft delete **tidak dipurge selama MVP**

**Acceptance Criteria:**

* Konten soft delete tidak muncul di publik
* Data masih ada untuk kebutuhan audit/moderasi

**Verification:**

* Soft delete → konten hilang dari publik → admin masih bisa akses (jika diperlukan)

## 6) NFR — Error Handling & API Consistence

### NFR-E01 — Standard API Response Format

Semua endpoint API wajib mengikuti format:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": []
}
```

**Acceptance Criteria:**

* Semua response sukses dan gagal konsisten
* Validation error masuk ke `errors`

**Verification:**

* Test beberapa endpoint sukses/gagal → format konsisten

### NFR-E02 — Validation & Sanitization

* Semua input harus divalidasi di backend
* Sistem menolak payload invalid dengan error yang jelas (tanpa membocorkan internal)

**Acceptance Criteria:**

* Tidak ada crash karena input aneh
* Error message aman dan informatif

**Verification:**

* Test invalid payload (empty, long text, wrong type)

## 7) NFR — Logging, Auditability, Observability

### NFR-L01 — Request & Error Logging

Sistem wajib mencatat minimal:

* request log (method, path, status, latency)
* error log (stack trace internal tidak ditampilkan ke user)

**Acceptance Criteria:**

* Error tercatat di server log
* Client menerima message aman

**Verification:**

* Trigger error → log muncul → client dapat response aman

### NFR-L02 — Request ID (Traceability)

* Setiap request harus memiliki **request id**
* Request id ikut muncul pada log untuk tracking

**Acceptance Criteria:**

* Request id ada di log
* Bisa menelusuri error berdasarkan request id

**Verification:**

* Cek log output request

### NFR-L03 — Audit Log untuk Aksi Sensitif

Aksi berikut wajib masuk audit log:

* moderasi: hide content, resolve report
* admin role change
* expert approve/reject/revoke
* audit-mode identity view

**Acceptance Criteria:**

* Audit log menyimpan: actor, action, target, timestamp, metadata

**Verification:**

* Lakukan aksi → audit log tercatat

## 8) NFR — Usability & Compatibility

### NFR-U01 — UI Responsiveness

* UI bersifat **desktop-first tapi responsif**
* Tetap usable di mobile browser

**Acceptance Criteria:**

* Layout tidak rusak di layar kecil
* Navigasi diskusi tetap jelas

**Verification:**

* Manual test responsive (desktop + mobile)

### NFR-U02 — Browser Support

OLION harus mendukung browser modern:

* Chrome latest
* Firefox latest
* Edge latest

**Acceptance Criteria:**

* Fitur inti berjalan pada 3 browser tersebut

**Verification:**

* Smoke test UI di 3 browser

## 9) NFR — Maintainability & Development Standards

### NFR-M01 — Code Quality Rules

MVP wajib menerapkan:

* linting
* formatter
* commit convention

**Acceptance Criteria:**

* Repo punya config lint/format (eslint/prettier atau setara)
* Commit message mengikuti pola yang konsisten

**Verification:**

* Run lint/format check
* Review commit history

## 10) NFR — File Upload Constraints (Expert Docs)

### NFR-F01 — File Type Restrictions

Dokumen verifikasi expert hanya boleh:

* PDF
* JPG
* PNG

**Acceptance Criteria:**

* Upload file selain format di atas ditolak

**Verification:**

* Upload `.exe`/`.zip` → FAIL
* Upload `.pdf` → PASS

### NFR-F02 — File Size Limit

* Maksimal ukuran file upload: **5MB**

**Acceptance Criteria:**

* Upload > 5MB ditolak dengan error yang jelas

**Verification:**

* Upload 6MB → FAIL
* Upload 4MB → PASS

## 11) Catatan Implementasi (Guidance)

Dokumen ini menjadi standar untuk:

* implementasi backend middleware & security
* struktur response API
* logging & audit trail
* standar testing evidence

Seluruh NFR harus selaras dengan:

* `02-srs-software-requirement-specification.md`
* `03-feature-breakdown-mvp.md`
* `05-mapping-fr-module-endpoint.md`

---
