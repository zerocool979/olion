# Non-Functional Requirements (NFR) — Detail

**Project Name:** OLION
**Document Type:** Non-Functional Requirements (NFR) Detail
**Owner:** beel
**Version:** 1.0
**Last Update:** 2026-01-28
**Status:** Implementation Standard

---

# 1. Purpose

Dokumen ini menetapkan standar **Non-Functional Requirements (NFR)** untuk sistem OLION yang bersifat:

* terukur
* dapat diverifikasi
* langsung dapat diimplementasikan
* selaras dengan proses engineering nyata

Seluruh requirement pada dokumen ini dimaksudkan sebagai **engineering contract**, bukan sekadar guideline konseptual.

---

# 2. Security & Authentication

## NFR-S01 — Password Policy

Password pengguna harus memenuhi aturan berikut:

* Minimum panjang: **10 karakter**
* Tidak diwajibkan kombinasi karakter kompleks
* Tidak boleh disimpan dalam bentuk plaintext

**Acceptance Criteria**

* Password dengan panjang < 10 karakter ditolak
* Password ≥ 10 karakter diterima

**Verification**

* Register dengan password 9 karakter → ditolak
* Register dengan password 10 karakter → diterima

---

## NFR-S02 — Password Storage Standard

Semua password harus disimpan menggunakan algoritma hashing modern.

**Implementation Standard**

* Algoritma: **Argon2id**
* Salt wajib digunakan
* Password tidak boleh dicatat di log

**Acceptance Criteria**

* Database hanya menyimpan hash
* Tidak ada endpoint yang mengembalikan password

---

## NFR-S03 — Token Lifecycle Security

Authentication menggunakan JWT dengan mekanisme refresh token.

**Token Policy**

* Access Token expiry: **15 menit**
* Refresh Token expiry: **30 hari**
* Refresh Token menggunakan **rotation**

**Acceptance Criteria**

* Access token expired → request ditolak
* Refresh token lama tidak valid setelah rotasi

---

## NFR-S04 — Logout Token Revocation

Logout harus mencabut token pada sisi server.

**Acceptance Criteria**

* Refresh token tidak dapat digunakan kembali setelah logout

---

## NFR-S05 — Authentication Rate Limiting

Endpoint autentikasi harus memiliki pembatasan permintaan.

**Rate Limit**

* Login: 5 request/menit/IP
* Forgot password: 5 request/menit/IP

**Acceptance Criteria**

* Melebihi limit menghasilkan HTTP 429

---

## NFR-S06 — Password Reset Security

Reset password harus menggunakan mekanisme token aman.

**Requirements**

* Token bersifat unik
* Token expiry maksimal: **15 menit**
* Token hanya dapat digunakan satu kali
* Token tidak disimpan dalam bentuk plaintext

---

## NFR-S07 — Security Middleware Enforcement

Semua kontrol keamanan harus ditempatkan pada middleware.

**Mandatory Middleware**

* Authentication middleware
* Authorization middleware
* Validation middleware
* Rate limiting middleware
* Sanitization middleware

Implementasi tidak diperbolehkan langsung di controller.

---

## NFR-S08 — HTTP Security Headers

Response server wajib menyertakan security headers berikut:

* Content-Security-Policy
* X-Frame-Options
* X-Content-Type-Options
* Strict-Transport-Security

---

# 3. Privacy & Identity Control

## NFR-P01 — Pseudonym-Based Identity

Identitas publik pengguna harus berbasis pseudonym.

**Rules**

* Email tidak ditampilkan di area publik
* Username publik tidak mengandung data sensitif

---

## NFR-P02 — Admin Audit Mode Access

Admin dapat melihat identitas asli hanya melalui audit mode.

**Audit Requirements**

* Semua akses tercatat
* Menyimpan actor, target, timestamp, alasan

---

## NFR-P03 — Secure Document Storage

Dokumen verifikasi expert harus disimpan secara aman.

**Storage Rules**

* Menggunakan storage private (S3-compatible)
* Tidak boleh public access
* Menggunakan signed URL

---

## NFR-P04 — Storage Lifecycle Policy

Dokumen memiliki lifecycle policy.

**Retention Policy**

* Active storage: 180 hari
* Archive storage: hingga 365 hari

---

# 4. Performance & Scalability

## NFR-PS01 — API Response Performance

Target latency untuk endpoint inti:

**Target:**

p95 ≤ **500ms**

Endpoint inti meliputi:

* authentication
* discussion list
* discussion detail
* voting
* reporting

---

## NFR-PS02 — Concurrency Capacity

Sistem harus mampu menangani:

**≥ 100 concurrent users**

Tanpa crash atau peningkatan error signifikan.

---

## NFR-PS03 — Pagination Standard

Semua endpoint list harus menggunakan pagination.

**Default Pagination**

* limit: 20 item
* parameter: page, limit

---

## NFR-PS04 — Search Implementation Strategy

Search menggunakan database full-text search.

**Technology**

* PostgreSQL Full-Text Search
* GIN index wajib digunakan

---

## NFR-PS05 — Database Index Policy

Index wajib tersedia pada kolom berikut:

* user_id
* discussion_id
* created_at
* vote_target_id

---

## NFR-PS06 — Performance Measurement Standard

Pengukuran performa harus menggunakan tool standar.

**Tooling**

* k6

**Metric Minimum**

* p50 latency
* p95 latency
* throughput
* error rate

---

# 5. Availability & Data Protection

## NFR-A01 — Availability Target

Target availability sistem:

**≥ 99% uptime**

---

## NFR-A02 — Database Backup Strategy

Backup harus dilakukan secara otomatis.

**Schedule**

* Daily backup

---

## NFR-A03 — Disaster Recovery Target

Standar recovery harus ditentukan.

**Recovery Targets**

* RPO ≤ 24 jam
* RTO ≤ 2 jam

---

## NFR-A04 — Soft Delete Policy

Data yang dihapus tidak dihapus permanen.

**Rules**

* Tidak muncul di publik
* Tetap tersedia untuk audit

---

# 6. API Behavior & Error Handling

## NFR-E01 — Standard Response Format

Semua API response harus mengikuti struktur berikut:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": []
}
```

---

## NFR-E02 — Input Validation & Sanitization

Semua input harus divalidasi pada backend.

**Rules**

* Invalid payload ditolak
* Error message tidak mengandung informasi internal

---

## NFR-E03 — API Versioning Policy

Semua endpoint harus memiliki versi.

**Format**

```
/api/v1/...
```

Breaking change harus dibuat pada versi baru.

---

## NFR-E04 — Error Language Standard

Semua pesan error menggunakan:

**English only**

---

# 7. Logging, Auditability & Observability

## NFR-L01 — Structured Logging

Semua log harus menggunakan format JSON.

**Mandatory Fields**

* timestamp
* request_id
* method
* path
* status
* latency_ms
* user_id (optional)

---

## NFR-L02 — Request Traceability

Setiap request harus memiliki request ID unik.

Digunakan untuk:

* tracing error
* debugging
* performance review

---

## NFR-L03 — Audit Log Policy

Aksi sensitif harus dicatat.

**Mandatory Audit Actions**

* moderation action
* role change
* expert approval
* identity audit access

---

## NFR-O01 — Monitoring & Health Check

Sistem harus menyediakan monitoring dasar.

**Required Components**

* /health endpoint
* uptime monitoring
* error counter

---

# 8. Usability & Compatibility

## NFR-U01 — Responsive Interface

UI harus tetap usable pada:

* Desktop
* Tablet
* Mobile browser

---

## NFR-U02 — Browser Compatibility

Browser yang didukung:

* Chrome (latest)
* Firefox (latest)
* Edge (latest)

---

# 9. Maintainability & Development Standards

## NFR-M01 — Code Quality Enforcement

Project harus menggunakan:

* linting
* formatting
* commit convention

---

## NFR-M02 — Environment Standardization

Semua environment harus menggunakan container.

**Technology**

* Docker
* docker-compose

**Environment Types**

* local
* staging
* production

---

## NFR-M03 — Testing Coverage Standard

Testing wajib memenuhi target minimum.

**Coverage Target**

* Unit test ≥ 70%
* Critical flow = 100%

**Critical Flow**

* login
* refresh token
* create discussion
* voting

---

# 10. File Upload Constraints

## NFR-F01 — File Type Restriction

Format file yang diizinkan:

* PDF
* JPG
* PNG

---

## NFR-F02 — File Size Limit

Ukuran maksimal file:

**5MB**

---

# 11. Engineering Alignment Notes

Dokumen ini menjadi referensi implementasi untuk:

* middleware security
* database indexing
* logging strategy
* monitoring setup
* testing framework

Dokumen ini harus selaras dengan:

* Software Requirement Specification (SRS)
* Feature Breakdown MVP
* Module–Endpoint Mapping

Setiap perubahan NFR wajib dicatat pada CHANGELOG proyek.
