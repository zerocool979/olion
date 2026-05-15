# Software Requirements Specification (SRS)

**Project Name: olion**
**Document Type: Software Requirements Specification (SRS)**
**Document Version: v2.0**
**Date: 10-04-2026**
**Document History**

| Version |    Date    | Author |       Description        |
|--------:|------------|:------:|--------------------------|
|   v1.0  | 03-02-2026 |  beel  | Initial draft of the SRS |
|   v2.0  | 10-04-2026 |  beel  | Tidy up the SRS draft    |
|   v3.0  | XX-XX-XXXX |        |                          |

---

## Table of Contents

**1. Introduction**
   * 1.1 Purpose
   * 1.2 System Scope
   * 1.3 Definitions, Acronyms, and Terms
   * 1.4 References

**2. Overall Description**
   * 2.1 Product Perspective
   * 2.2 User Classes and Characteristics
   * 2.3 Design and Implementation Constraints
   * 2.4 Assumptions and Dependencies

**3. Business Rules**
   * 3.1 General System Rules
   * 3.2 Authentication & Account Management
   * 3.3 Discussion System
   * 3.4 Answer & Comment Interaction
   * 3.5 Voting & Reputation Logic
   * 3.6 Reporting & Community Moderation
   * 3.7 AI-Powered Services
   * 3.8 Notification System
   * 3.9 Search & Discovery
   * 3.10 Analytics & Business Reporting
   * 3.11 System Safety & Security Standards
   * 3.12 Verified Expert Management
   * 3.13 Appeal & Dispute Management

**4. Stakeholders & Users**
   * 4.1 Stakeholder Profiles
   * 4.2 Actor Classification
   * 4.3 RBAC Access Matrix
   * 4.4 Critical Permissions & Restrictions

**5. Functional Requirements**
   * 5.1 Module A - Authentication & Account Management
   * 5.2 Module B - Discussion System
   * 5.3 Module C - Answer & Comment Interaction
   * 5.4 Module D - Voting & Reputation Logic
   * 5.5 Module E - Reporting & Community Moderation
   * 5.6 Module F - AI-Powered Services
   * 5.7 Module G - Notification System
   * 5.8 Module H - Search & Discovery
   * 5.9 Module I - Analytics & Business Reporting
   * 5.10 Module J - System Safety & Security Standards
   * 5.11 MODULE K — Verified Expert Management
   * 5.12 Module L - Appeal & Dispute Management

**6. Non-Functional Requirements**
   * 6.1 Global Architecture
   * 6.2 Performance
   * 6.3 Security & Privacy
   * 6.4 Availability & Reliability
   * 6.5 Scalability
   * 6.6 Maintainability

**7. External Interface Requirements**
   * 7.1 User Interfaces
   * 7.2 Software Interfaces
   * 7.3 Communication Interfaces

**8. System Modeling**
   * 8.1 Use Case Diagram
   * 8.2 Entity Relationship Diagram
   * 8.3 State Machine Diagrams

**9. Traceability Matrix**
   * 9.1 Mapping BRD to SRS

**10. Acceptance Criteria**
   * 10.1 Functional Acceptance Criteria
   * 10.2 Quality & Performance Acceptance Criteria

**11. Deliverables & Deployment**
   * 11.1 Software Deliverables
   * 11.2 Deployment Environment

**12. Approval & Sign-off**

---

## 1. Introduction

### 1.1 Purpose
Dokumen *Software Requirements Specification* (SRS) ini disusun untuk merinci setiap kebutuhan teknis, fungsional, dan non-fungsional dari platform **OLION v2.0**. Dokumen ini berfungsi sebagai:
1. **Panduan Teknis Utama:** Menjadi instruksi detail bagi pengembang (*Backend* dan *Frontend*) untuk membangun logika sistem sesuai aturan bisnis.
2. **Standardisasi Pengujian:** Menjadi dasar bagi tim *Quality Assurance* (QA) dalam menyusun *test case* guna memastikan kualitas perangkat lunak.
3. **Validasi Kebutuhan:** Memastikan bahwa setiap modul (A hingga L) yang didefinisikan dalam BRD telah diterjemahkan ke dalam spesifikasi sistem yang dapat diimplementasikan.

### 1.2 System Scope
Sistem OLION adalah platform forum diskusi berbasis web yang mengintegrasikan kecerdasan buatan (AI) untuk menciptakan ekosistem diskusi yang sehat dan anonim secara terkontrol (*pseudonymity*). Ruang lingkup teknis sistem mencakup:
* **Manajemen Identitas:** Implementasi algoritma untuk menghasilkan pseudonim otomatis dan sistem autentikasi aman.
* **Interaksi Konten:** Pengembangan mesin diskusi yang mendukung utas (*thread*), jawaban, komentar, dan sistem voting.
* **Sistem Reputasi:** Logika perhitungan poin otomatis berdasarkan aktivitas user untuk menentukan kredibilitas.
* **Moderasi AI:** Integrasi API LLM (OpenAI/Gemini) untuk pendeteksian toksisitas konten secara *real-time*.
* **Manajemen Pakar:** Alur kerja verifikasi dokumen pendukung untuk pemberian status *Verified Expert*.

### 1.3 Definitions, Acronyms, and Terms
Daftar istilah teknis yang digunakan dalam dokumen ini adalah sebagai berikut:

| Istilah / Akronim | Definisi |
| :--- | :--- |
| **BRL (Business Rule Logic)** | Kode referensi untuk aturan teknis spesifik yang harus diterapkan pada logika program. |
| **Pseudonym** | Identitas samaran yang diberikan sistem kepada pengguna untuk menjaga privasi identitas asli. |
| **Toxicity Score** | Nilai numerik (0.0 - 1.0) dari model AI yang menunjukkan tingkat pelanggaran pada sebuah teks. |
| **JWT (JSON Web Token)** | Standar keamanan untuk transmisi data autentikasi antar server dan klien secara aman. |
| **RBAC** | *Role-Based Access Control*; pengaturan izin akses sistem berdasarkan peran pengguna. |
| **MVP** | *Minimum Viable Product*; versi produk dengan fitur dasar yang cukup untuk memenuhi kebutuhan awal. |

### 1.4 References
Dokumen ini disusun berdasarkan referensi utama berikut:
1. **Business Requirement Document (BRD) OLION v3.0** (Tanggal: 10-04-2026).
2. **Standard IEEE 830-1998** untuk penulisan spesifikasi perangkat lunak yang sistematis.
3. **OpenAPI Specification (OAS)** sebagai standar dokumentasi antarmuka API yang akan dikembangkan.

---

## 2. Overall Description

### 2.1 Product Perspective
OLION dirancang sebagai sistem aplikasi web modern yang beroperasi secara mandiri dengan ekosistem kecerdasan buatan yang terbagi menjadi dua ranah entitas guna menjamin performa dan keamanan:

* **Frontend Layer:** Antarmuka responsif yang dapat diakses melalui browser desktop maupun perangkat mobile.
* **Backend Layer:** *Service-oriented architecture* yang menangani logika bisnis dari 12 modul utama (A-L).
* **Internal AI Services (Engine Internal):** Layanan AI yang berjalan di sisi server internal untuk pemrosesan data otomatis tanpa tergantung penuh pada latensi eksternal:
    * **AI Moderation:** Melakukan filtrasi konten toksik secara otomatis berdasarkan *threshold* yang ditentukan.
    * **AI Classification:** Mengkategorikan utas atau jawaban ke dalam topik/tag yang relevan.
    * **AI Risk Detection:** Mendeteksi pola perilaku mencurigakan atau potensi pelanggaran keamanan sistem.
* **External AI Services (Engine Eksternal):** * **AI Chatbot Interaction:** Integrasi API LLM untuk menyediakan fitur bantuan interaktif bagi pengguna secara cerdas dan kontekstual.
* **Database Layer:** Penyimpanan data relasional untuk menjaga integritas hubungan antara user, reputasi, dan konten diskusi.

### 2.2 User Classes and Characteristics
Sistem membedakan pengguna ke dalam beberapa kelas berdasarkan otorisasi dan interaksinya:
* **Unauthenticated User:** Pengunjung umum dengan akses hanya-baca pada diskusi publik.
* **Regular User:** Pengguna terdaftar dengan identitas pseudonim yang memiliki akses penuh untuk berdiskusi dan memberikan suara (*voting*).
* **Verified Expert:** Pengguna dengan hak istimewa untuk memberikan jawaban yang divalidasi oleh label kepakaran.
* **Moderator:** Tim pengelola yang memiliki akses untuk meninjau laporan (*reports*) dan melakukan tindakan moderasi.
* **Administrator:** Pengelola tingkat sistem yang mengonfigurasi aturan keamanan, manajemen peran, dan audit analitik.

### 2.3 Design and Implementation Constraints
Beberapa batasan yang harus dipatuhi dalam pengembangan sistem meliputi:
1. **Keamanan Data:** Enkripsi *end-to-end* pada data sensitif pengguna (Email & Nama Asli) untuk mendukung prinsip pseudonimitas.
2. **Latensi AI:** Proses analisis AI tidak boleh menghambat pengalaman pengguna; diperlukan mekanisme antrean (*queue*) jika latensi API meningkat.
3. **Kepatuhan Perangkat:** Sistem harus kompatibel dengan standar browser modern (Chrome, Safari, Firefox) dan responsif terhadap berbagai ukuran layar (Mobile-First).

### 2.4 Assumptions and Dependencies
Keberhasilan operasional sistem bergantung pada asumsi dan ketergantungan berikut:
* **Ketersediaan Layanan Cloud:** Diasumsikan infrastruktur server dan database memiliki *uptime* minimal 99.7%.
* **Ketergantungan API AI:** Fungsionalitas Modul F (AI Services) sangat bergantung pada stabilitas layanan pihak ketiga (OpenAI/Gemini).
* **Integritas Pengguna:** Sistem reputasi diasumsikan akan berjalan efektif seiring dengan meningkatnya volume partisipasi jujur dari komunitas.

---

## 3. Business Rules

### 3.1 General System Rules

| ID | Business Rule Name | Business Rule Description (Aturan Kebijakan) | Rationale (Alasan Bisnis) | Ref. BR |
| :--- | :--- | :--- | :--- | :--- |
| **BRL-GEN-01** | **Identity Decoupling** | Sistem dilarang keras menampilkan korelasi antara *Real Identity* dan *Pseudonym Identity* kepada pengguna manapun, termasuk Moderator. Aktivitas publik wajib menggunakan identitas samaran. | Melindungi integritas anonimitas sebagai nilai jual utama platform OLION. | BR-A06 |
| **BRL-GEN-02** | **Unique Account Constraint** | Satu alamat email hanya dapat diasosiasikan dengan satu akun pengguna aktif guna mencegah manipulasi reputasi, *sybil attack*, dan perilaku *spam*. | Menjamin validitas basis pengguna dan keadilan sistem poin. | BR-A15 |
| **BRL-GEN-03** | **Data Immutability (Audit)** | Setiap tindakan administratif (modifikasi konten, *banned*, verifikasi expert) wajib mencatat aktor, waktu, dan alasan pada *Audit Log* bersifat *Read-Only*. | Menjamin akuntabilitas dan transparansi penuh dalam pengelolaan komunitas. | BR-E05 |
| **BRL-GEN-04** | **Content Ownership** | Pengguna memiliki hak cipta atas konten, namun memberikan hak siar permanen kepada platform selama akun aktif agar diskusi tetap terjaga keberlangsungannya. | Melindungi ketersediaan informasi akademik bagi pengguna lain. | BR-B01 |
| **BRL-GEN-05** | **Zero-Tolerance Policy** | Konten yang mengandung unsur SARA, diskriminasi ekstrem, atau pornografi memicu penangguhan akun permanen secara otomatis tanpa peringatan. | Menjaga keamanan ruang diskusi sesuai standar hukum dan etika akademik. | BR-J02 |
| **BRL-GEN-06** | **System State Consistency** | Semua transaksi data (posting, voting, poin) harus mengikuti prinsip ACID untuk mencegah duplikasi poin atau *data loss* saat terjadi gangguan teknis. | Menjamin integritas data teknis dan kepercayaan pengguna pada sistem reputasi. | BR-D01 |
| **BRL-GEN-07** | **Grace Period for Deletion** | Akun yang diajukan untuk dihapus memiliki masa tunggu (*Grace Period*) 14 hari sebelum data identitas asli dihapus secara permanen dari server. | Mematuhi regulasi privasi data (UU PDP/GDPR) dan memberikan ruang pembatalan. | BR-A20 |
| **BRL-GEN-08** | **Session Re-Auth** | Aktivitas sensitif (perubahan kata sandi atau penghapusan akun) memerlukan re-autentikasi wajib meskipun sesi pengguna dalam keadaan aktif. | Mencegah pengambilalihan akun jika perangkat fisik jatuh ke tangan pihak lain. | BR-A03 |

### 3.2 Authentication & Account Management

| BRL-ID     | Business Rule Description (Detailed Logic)                                                     | Referensi BR   |
| ---------- | ---------------------------------------------------------------------------------------------- | -------------- |
| BRL-A01-01 | Sistem harus memverifikasi email menggunakan token unik (UUID v4, expiry 15 menit).            | BR-A01         |
| BRL-A01-02 | Sistem harus menolak pendaftaran jika email sudah terdaftar (unique constraint).               | BR-A01, BR-A15 |
| BRL-A01-03 | Password minimal 8 karakter, mengandung huruf besar, kecil, angka, dan simbol.                 | BR-A05         |
| BRL-A02-01 | Sistem harus menggunakan hashing password dengan bcrypt (cost ≥ 12).                           | BR-A02         |
| BRL-A02-02 | Sistem harus membatasi percobaan login maksimal 5 kali dalam 10 menit.                         | BR-A02, BR-A17 |
| BRL-A02-03 | Sistem harus menghasilkan JWT dengan expiry 60 menit setelah login berhasil.                   | BR-A08         |
| BRL-A03-01 | Sistem harus memvalidasi token autentikasi sebelum akses endpoint protected.                   | BR-A03         |
| BRL-A03-02 | Sistem harus mengembalikan HTTP 401 jika token tidak valid atau tidak ada.                     | BR-A03         |
| BRL-A04-01 | Sistem harus mengirim link reset password dengan token expiry 15 menit.                        | BR-A04         |
| BRL-A04-02 | Token reset hanya dapat digunakan satu kali (one-time use).                                    | BR-A04         |
| BRL-A05-01 | Password tidak boleh mengandung username/email (string match).                                 | BR-A05         |
| BRL-A05-02 | Sistem harus menolak password yang terdapat dalam daftar breached password (API check).        | BR-A05         |
| BRL-A06-01 | Sistem harus menghasilkan username publik acak jika tidak disediakan (min 6, max 20 karakter). | BR-A06         |
| BRL-A07-01 | Username hanya boleh mengandung alfanumerik dan underscore.                                    | BR-A07         |
| BRL-A07-02 | Perubahan username maksimal 3 kali dalam 30 hari.                                              | BR-A07         |
| BRL-A08-01 | Sistem harus mengizinkan maksimal 5 sesi aktif per user.                                       | BR-A08         |
| BRL-A08-02 | Setiap sesi harus memiliki session ID unik (UUID).                                             | BR-A08         |
| BRL-A09-01 | Logout harus menghapus session/token dari whitelist/blacklist store.                           | BR-A09         |
| BRL-A10-01 | Status akun: ACTIVE, SUSPENDED, DELETED.                                                       | BR-A10         |
| BRL-A10-02 | Hanya akun ACTIVE yang dapat login.                                                            | BR-A10         |
| BRL-A11-01 | Role default: USER, ADMIN.                                                                     | BR-A11         |
| BRL-A11-02 | Sistem harus memverifikasi role sebelum akses endpoint (RBAC middleware).                      | BR-A11         |
| BRL-A12-01 | Session idle timeout: 30 menit tanpa aktivitas.                                                | BR-A12         |
| BRL-A12-02 | Absolute session timeout: 24 jam.                                                              | BR-A12         |
| BRL-A13-01 | Sistem dilarang menyimpan IP Address mentah di log permanen. IP wajib di-masking atau di-hash dengan rotating salt.   | BR-A13         |
| BRL-A13-02 | Sistem harus trigger MFA jika aktivitas mencurigakan terdeteksi.                               | BR-A13, BR-A16 |
| BRL-A14-01 | Log autentikasi harus menyimpan: user_id, ip_hash (HMAC + rotating salt), device, timestamp.   | BR-A14         |
| BRL-A14-02 | Retensi log minimal 90 hari.                                                                   | BR-A14         |
| BRL-A15-01 | Email dan username harus unique pada level database (unique index).                            | BR-A15         |
| BRL-A16-01 | MFA menggunakan TOTP (RFC 6238) dengan interval 30 detik.                                      | BR-A16         |
| BRL-A16-02 | Backup code MFA minimal 5 kode, sekali pakai.                                                  | BR-A16         |
| BRL-A17-01 | Akun dikunci selama 15 menit setelah 5 login gagal.                                            | BR-A17         |
| BRL-A18-01 | Deteksi anomali berdasarkan geolocation berbeda dalam waktu <1 jam.                            | BR-A18         |
| BRL-A19-01 | Menghapus kewajiban rotasi password berkala. Sistem wajib melakukan pengecekan terhadap database kebocoran kredensial eksternal (API integration) setiap kali user login atau ganti password.  | BR-A19         |
| BRL-A20-01 | Riwayat akses harus menyimpan minimal 100 aktivitas terakhir.                                  | BR-A20         |
| BRL-A21-01 | Permintaan hapus akun harus melalui konfirmasi password.                                       | BR-A21         |
| BRL-A21-02 | Akun dihapus secara soft delete selama 30 hari sebelum permanen.                               | BR-A21         |
| BRL-A22-01 | Data penghapusan disimpan minimal 1 tahun untuk audit.                                         | BR-A22         |
| BRL-A23-01 | Persetujuan disimpan dengan timestamp dan versi kebijakan.                                     | BR-A23         |
| BRL-A24-01 | Perubahan password harus menginvalidasi semua session aktif.                                   | BR-A24         |
| BRL-A25-01 | User dapat melihat daftar session metadata : device, IP (tanpa IP mentah), last activity.      | BR-A25         |
| BRL-A26-01 | User/Admin dapat revoke sesi berdasarkan session ID.                                           | BR-A26         |
| BRL-A27-01 | Notifikasi dikirim via email dalam ≤1 menit setelah event risk.                                | BR-A27         |
| BRL-A28-01 | Admin dapat force logout semua sesi user (revoke session, tidak melihat identitas).            | BR-A28         |

### 3.3 Discussion System

| BRL-ID     | Business Rule Description (Detailed Logic)                                                   | Referensi BR   |
| ---------- | -------------------------------------------------------------------------------------------- | -------------- |
| BRL-B01-01 | Judul diskusi wajib 10–150 karakter.                                                         | BR-B01         |
| BRL-B01-02 | Konten diskusi minimal 20 karakter, maksimal 10.000 karakter.                                | BR-B01         |
| BRL-B01-03 | Hanya user terautentikasi yang dapat membuat diskusi (IF not authenticated THEN reject 401). | BR-B01         |
| BRL-B02-01 | Sistem harus menggunakan parent_id untuk membangun struktur thread (NULL untuk root).        | BR-B02         |
| BRL-B02-02 | Kedalaman thread maksimal 5 level.                                                           | BR-B02         |
| BRL-B02-03 | Sorting default berdasarkan created_at ascending dalam satu thread.                          | BR-B02         |
| BRL-B03-01 | Pengguna hanya dapat mengedit diskusi miliknya (IF user_id ≠ owner THEN reject 403).         | BR-B03         |
| BRL-B03-02 | Edit diperbolehkan maksimal 30 hari sejak publikasi.                                         | BR-B03         |
| BRL-B03-03 | Sistem harus menyimpan versi sebelum perubahan (versioning incremental).                     | BR-B03, BR-B14 |
| BRL-B04-01 | Penghapusan hanya oleh pemilik atau admin.                                                   | BR-B04         |
| BRL-B04-02 | Diskusi dihapus menggunakan Soft delete + Tombstone record (flag deleted=true).              | BR-B04         |
| BRL-B04-03 | Hard delete dilakukan setelah 30 hari.                                                       | BR-B04         |
| BRL-B05-01 | Setiap diskusi wajib memiliki tepat 1 category_id valid (FK constraint).                     | BR-B05         |
| BRL-B05-02 | Category harus berasal dari predefined list (enum/lookup table).                             | BR-B05         |
| BRL-B06-01 | Label maksimal 5 per diskusi.                                                                | BR-B06         |
| BRL-B06-02 | Setiap label panjangnya 2–30 karakter.                                                       | BR-B06         |
| BRL-B07-01 | Visibility: PUBLIC, PRIVATE, RESTRICTED.                                                     | BR-B07         |
| BRL-B07-02 | IF visibility=PRIVATE THEN hanya owner yang dapat akses.                                     | BR-B07         |
| BRL-B07-03 | IF visibility=RESTRICTED THEN akses berdasarkan role/group.                                  | BR-B07         |
| BRL-B08-01 | Status diskusi: DRAFT, PUBLISHED, ARCHIVED, DELETED.                                         | BR-B08         |
| BRL-B08-02 | Transisi status harus mengikuti state machine valid.                                         | BR-B08         |
| BRL-B09-01 | Draf tidak boleh terlihat oleh user lain.                                                    | BR-B09         |
| BRL-B09-02 | Draf disimpan otomatis setiap 30 detik (auto-save).                                          | BR-B09         |
| BRL-B10-01 | Draf disimpan minimal 7 hari sejak terakhir update.                                          | BR-B10         |
| BRL-B10-02 | Sistem harus restore draf berdasarkan last_saved timestamp.                                  | BR-B10         |
| BRL-B11-01 | Diskusi tanpa aktivitas selama 90 hari → status ARCHIVED.                                    | BR-B11         |
| BRL-B11-02 | Diskusi archived tidak muncul di default listing.                                            | BR-B11         |
| BRL-B12-01 | Retensi diskusi minimal 1 tahun sebelum eligible deletion.                                   | BR-B12         |
| BRL-B12-02 | Data harus comply dengan kebijakan retention (configurable).                                 | BR-B12         |
| BRL-B13-01 | Setiap diskusi wajib memiliki owner_id (owner_id → persona_id).                              | BR-B13         |
| BRL-B13-02 | Owner dicatat saat create dan immutable kecuali transfer.                                    | BR-B13         |
| BRL-B14-01 | Setiap perubahan menyimpan: version, user_id, timestamp.                                     | BR-B14         |
| BRL-B14-02 | Maksimal 50 versi disimpan per diskusi.                                                      | BR-B14         |
| BRL-B15-01 | Restore hanya bisa ke versi sebelumnya (version rollback).                                   | BR-B15         |
| BRL-B15-02 | Restore hanya oleh owner/admin.                                                              | BR-B15         |
| BRL-B16-01 | IF status=LOCKED THEN disable edit/delete/comment.                                           | BR-B16         |
| BRL-B16-02 | Hanya moderator/admin yang dapat mengunci diskusi.                                           | BR-B16         |
| BRL-B17-01 | Transfer ownership memerlukan konfirmasi kedua pihak.                                        | BR-B17         |
| BRL-B17-02 | Log transfer harus dicatat dalam audit trail.                                                | BR-B17         |
| BRL-B18-01 | Sistem harus melakukan similarity check ≥80% untuk deteksi duplikasi.                        | BR-B18         |
| BRL-B18-02 | IF duplicate detected THEN tampilkan rekomendasi diskusi serupa.                             | BR-B18         |
| BRL-B19-01 | Pagination default: 20 item per page.                                                        | BR-B19         |
| BRL-B19-02 | Sorting: latest, most_popular, most_commented.                                               | BR-B19         |
| BRL-B19-03 | Search menggunakan full-text index dengan minimal query 3 karakter.                          | BR-B19         |
| BRL-B20-01 | Metrik: view_count, comment_count, like_count.                                               | BR-B20         |
| BRL-B20-02 | View dihitung unik per user per 1 jam.                                                       | BR-B20         |
| BRL-B20-03 | Data metrik disimpan dalam aggregation table (daily granularity).                            | BR-B20         |
| BRL-B      | Ownership history tidak tampil publik                                                        |                |

### 3.4 Answer & Comment Interaction

| BRL-ID     | Business Rule Description (Detailed Logic)                                           | Referensi BR   |
| ---------- | ------------------------------------------------------------------------------------ | -------------- |
| BRL-C01-01 | Jawaban hanya dapat dibuat oleh user terautentikasi (IF not authenticated THEN 401). | BR-C01         |
| BRL-C01-02 | Panjang jawaban minimal 30 karakter, maksimal 15.000 karakter.                       | BR-C01         |
| BRL-C01-03 | Satu user dapat membuat maksimal 10 jawaban per diskusi.                             | BR-C01         |
| BRL-C02-01 | Komentar hanya dapat dibuat oleh user terautentikasi.                                | BR-C02         |
| BRL-C02-02 | Panjang komentar minimal 5 karakter, maksimal 2.000 karakter.                        | BR-C02         |
| BRL-C02-03 | Komentar dapat terkait ke diskusi atau jawaban (polymorphic relation).               | BR-C02         |
| BRL-C03-01 | Struktur komentar menggunakan parent_id (NULL untuk root).                           | BR-C03         |
| BRL-C03-02 | Kedalaman komentar maksimal 3 level.                                                 | BR-C03         |
| BRL-C03-03 | Urutan komentar dalam thread berdasarkan created_at ascending.                       | BR-C03         |
| BRL-C04-01 | Edit hanya diperbolehkan untuk pemilik (IF user_id ≠ owner THEN 403).                | BR-C04         |
| BRL-C04-02 | Edit diperbolehkan maksimal 7 hari setelah publikasi.                                | BR-C04         |
| BRL-C04-03 | Setiap edit menghasilkan versi baru (versioning incremental).                        | BR-C04, BR-C10 |
| BRL-C05-01 | Penghapusan hanya oleh pemilik atau admin.                                           | BR-C05         |
| BRL-C05-02 | Soft delete menggunakan flag deleted=true.                                           | BR-C05         |
| BRL-C05-03 | Hard delete dilakukan setelah 30 hari.                                               | BR-C05         |
| BRL-C06-01 | Setiap jawaban/komentar wajib memiliki owner_id NOT NULL.                            | BR-C06         |
| BRL-C06-02 | owner_id immutable kecuali oleh sistem/admin.                                        | BR-C06         |
| BRL-C07-01 | Visibility mengikuti parent (diskusi/jawaban).                                       | BR-C07         |
| BRL-C07-02 | IF parent PRIVATE THEN komentar/jawaban juga PRIVATE.                                | BR-C07         |
| BRL-C08-01 | Jawaban diurutkan berdasarkan score (descending) lalu created_at.                    | BR-C08         |
| BRL-C08-02 | Komentar diurutkan berdasarkan created_at ascending.                                 | BR-C08         |
| BRL-C09-01 | Sistem harus melakukan profanity filtering (blocklist ≥100 kata).                    | BR-C09         |
| BRL-C09-02 | Konten mengandung URL berbahaya → ditolak (regex + blacklist).                       | BR-C09         |
| BRL-C09-03 | IF konten melanggar THEN status=REJECTED.                                            | BR-C09         |
| BRL-C10-01 | Riwayat menyimpan: version, user_id, timestamp, diff.                                | BR-C10         |
| BRL-C10-02 | Maksimal 30 versi per konten disimpan.                                               | BR-C10         |
| BRL-C11-01 | Restore hanya ke versi sebelumnya (rollback).                                        | BR-C11         |
| BRL-C11-02 | Restore hanya oleh owner/admin.                                                      | BR-C11         |
| BRL-C12-01 | Sistem mendeteksi spam jika >5 komentar dalam 1 menit.                               | BR-C12         |
| BRL-C12-02 | Aktivitas mencurigakan ditandai dengan flag suspicious=true.                         | BR-C12         |
| BRL-C13-01 | Rate limit: maksimal 10 komentar per menit per user.                                 | BR-C13         |
| BRL-C13-02 | Rate limit: maksimal 5 jawaban per 10 menit.                                         | BR-C13         |
| BRL-C14-01 | Kedalaman komentar maksimal 3 level (hard limit).                                    | BR-C14         |
| BRL-C15-01 | Hanya pemilik diskusi yang dapat menandai accepted answer.                           | BR-C15         |
| BRL-C15-02 | Hanya satu jawaban yang dapat berstatus accepted per diskusi.                        | BR-C15         |
| BRL-C16-01 | IF answer=ACCEPTED THEN edit dibatasi (hanya typo fix ≤5% perubahan).                | BR-C16         |
| BRL-C16-02 | Edit besar pada accepted answer memerlukan approval moderator.                       | BR-C16         |
| BRL-C17-01 | Moderator dapat disable komentar (flag comments_enabled=false).                      | BR-C17         |
| BRL-C17-02 | IF comments_enabled=false THEN create comment → reject 403.                          | BR-C17         |

### 3.5 Voting & Reputation Logic

| BRL-ID     | Business Rule Description (Detailed Logic)                                                                       | Referensi BR   |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| BRL-D01-01 | Vote hanya dapat dilakukan oleh user dengan status **AUTHENTICATED = TRUE** dan **ACCOUNT_STATUS = ACTIVE**.     | BR-D01         |
| BRL-D01-02 | Jenis vote wajib berupa ENUM: {UPVOTE = +1, DOWNVOTE = -1}.                                                      | BR-D01         |
| BRL-D01-03 | Vote hanya dapat diberikan pada konten dengan **CONTENT_STATUS = PUBLISHED**.                                    | BR-D01         |
| BRL-D02-01 | Sistem wajib menerapkan **UNIQUE(user_id, content_id)** pada tabel voting.                                       | BR-D02         |
| BRL-D02-02 | IF existing_vote = TRUE THEN hanya diperbolehkan **UPDATE vote_type** atau **DELETE (set vote = 0)**.            | BR-D02         |
| BRL-D03-01 | User dapat mengubah vote dalam waktu **≤ 24 jam (86400 detik)** sejak timestamp vote awal.                       | BR-D03         |
| BRL-D03-02 | IF current_time - vote_timestamp > 24 jam THEN vote menjadi **IMMUTABLE**.                                       | BR-D03         |
| BRL-D03-03 | User dapat menarik vote dengan set **vote_type = 0 (neutral)**.                                                  | BR-D03         |
| BRL-D04-01 | Reputasi dihitung dengan formula: **reputation = Σ(event_value)** dengan event berbasis voting.                  | BR-D04         |
| BRL-D04-02 | IF vote_type = UPVOTE AND content_type = ANSWER THEN **+10 poin** ke author.                                     | BR-D04         |
| BRL-D04-03 | IF vote_type = UPVOTE AND content_type = QUESTION THEN **+5 poin** ke author.                                    | BR-D04         |
| BRL-D04-04 | IF vote_type = DOWNVOTE THEN **-2 poin** ke author (target konten).                                              | BR-D04         |
| BRL-D04-05 | IF vote_type = DOWNVOTE THEN **-1 poin** ke voter (cost anti-abuse).                                             | BR-D04         |
| BRL-D04-06 | Sistem wajib enforce **REPUTATION ≥ 0** (IF result < 0 THEN set = 0).                                            | BR-D04, BR-D05 |
| BRL-D05-01 | Reputasi user ditampilkan secara **real-time (≤1 detik latency)** setelah event voting.                          | BR-D05         |
| BRL-D05-02 | Nilai reputasi yang ditampilkan ke publik tidak boleh < 0.                                                       | BR-D05         |
| BRL-D06-01 | Hak voting penuh (UPVOTE + DOWNVOTE) hanya tersedia jika **reputation ≥ 50**.                                    | BR-D06, BR-D11 |
| BRL-D06-02 | Hak melakukan DOWNVOTE hanya tersedia jika **reputation ≥ 100**.                                                 | BR-D06         |
| BRL-D06-03 | Hak memberikan **Expert Validation** hanya tersedia jika **reputation ≥ 2000**.                                  | BR-D06         |
| BRL-D06-04 | Sistem wajib melakukan validasi threshold sebelum setiap aksi: IF reputation < threshold THEN **REJECT ACTION**. | BR-D06         |
| BRL-D07-01 | Maksimal voting per user adalah **30 vote / 24 jam (rolling window)**.                                           | BR-D07         |
| BRL-D07-02 | IF vote_count_24h ≥ 30 THEN sistem wajib **BLOCK voting request**.                                               | BR-D07         |
| BRL-D07-03 | Voting pada konten milik sendiri (**user_id = author_id**) adalah **DILARANG (HARD CONSTRAINT)**.                | BR-D07         |
| BRL-D08-01 | IF jumlah vote oleh user > 10 dalam **60 detik** THEN tandai sebagai **SUSPICIOUS_ACTIVITY**.                    | BR-D08         |
| BRL-D08-02 | IF SUSPICIOUS_ACTIVITY = TRUE THEN sistem wajib **FREEZE voting privilege selama 24 jam**.                       | BR-D08         |
| BRL-D08-03 | Sistem wajib mencatat flag abuse dengan severity level: {LOW, MEDIUM, HIGH}.                                     | BR-D08         |
| BRL-D09-01 | Score konten dihitung sebagai: **score = total_upvote - total_downvote**.                                        | BR-D09         |
| BRL-D09-02 | Identitas voter tidak boleh ditampilkan ke publik (**ANONYMIZED**).                                              | BR-D09         |
| BRL-D10-01 | Log voting wajib menyimpan: {user_id, content_id, vote_type, timestamp, ip_hash}.                                | BR-D10         |
| BRL-D10-02 | Retensi log voting minimal **180 hari**.                                                                         | BR-D10         |
| BRL-D11-01 | User dengan status **SUSPENDED atau BANNED** tidak dapat melakukan voting.                                       | BR-D11         |
| BRL-D11-02 | User baru dengan umur akun **< 24 jam** tidak diperbolehkan melakukan DOWNVOTE.                                  | BR-D11         |
| BRL-D12-01 | Penalti pelanggaran valid mengurangi reputasi sebesar **-50 poin per incident**.                                 | BR-D12         |
| BRL-D12-02 | Maksimal akumulasi penalti per hari adalah **-100 poin (daily loss cap)**.                                       | BR-D12         |
| BRL-D13-01 | Maksimal reputasi yang dapat diperoleh dari voting adalah **+200 poin / 24 jam (daily gain cap)**.               | BR-D13         |
| BRL-D13-02 | IF reputation_gain_today ≥ 200 THEN tambahan reputasi selanjutnya = **0 (capped)**.                              | BR-D13         |
| BRL-D13-03 | Pemulihan reputasi dilakukan otomatis setiap **24 jam** jika user memperoleh ≥10 upvote valid.                   | BR-D13         |
| BRL-D14-01 | Sistem wajib mencatat setiap perubahan reputasi dalam bentuk **delta_event (±value, source_type)**.              | BR-D14         |
| BRL-D14-02 | Maksimal histori reputasi yang disimpan adalah **1000 record per user (FIFO eviction)**.                         | BR-D14         |

### 3.6 Reporting & Community Moderation

| BRL-ID     | Business Rule Description (Detailed Logic)                                          | Referensi BR   |
| ---------- | ----------------------------------------------------------------------------------- | -------------- |
| BRL-E01-01 | Laporan hanya dapat dibuat oleh user terautentikasi.                                | BR-E01         |
| BRL-E01-02 | Setiap laporan wajib menyertakan alasan minimal 10 karakter, maksimal 500 karakter. | BR-E01         |
| BRL-E01-03 | Satu user maksimal membuat 20 laporan per hari.                                     | BR-E01, BR-E11 |
| BRL-E02-01 | Kategori pelanggaran: SPAM, ABUSE, HATE_SPEECH, MISINFORMATION, OTHER.              | BR-E02         |
| BRL-E02-02 | Setiap laporan wajib memiliki satu kategori valid (enum constraint).                | BR-E02         |
| BRL-E03-01 | Risk level: LOW, MEDIUM, HIGH, CRITICAL.                                            | BR-E03         |
| BRL-E03-02 | IF kategori=HATE_SPEECH THEN risk=HIGH.                                             | BR-E03         |
| BRL-E03-03 | IF laporan >5 untuk konten sama dalam 1 jam THEN risk=CRITICAL.                     | BR-E03         |
| BRL-E04-01 | Antrian moderasi menggunakan priority queue berdasarkan risk_level dan timestamp.   | BR-E04         |
| BRL-E04-02 | FIFO berlaku untuk laporan dengan risk level sama.                                  | BR-E04         |
| BRL-E05-01 | Moderator hanya dapat mengakses laporan dengan status OPEN.                         | BR-E05         |
| BRL-E05-02 | Moderator harus memilih action: IGNORE, WARNING, DELETE, BAN.                       | BR-E05         |
| BRL-E06-01 | IF action=DELETE THEN konten di-soft delete.                                        | BR-E06         |
| BRL-E06-02 | IF action=BAN THEN akun dinonaktifkan sementara/permanen.                           | BR-E06         |
| BRL-E07-01 | Status laporan: OPEN, IN_REVIEW, RESOLVED, REJECTED.                                | BR-E07         |
| BRL-E07-02 | Status berubah ke RESOLVED setelah tindakan dilakukan.                              | BR-E07         |
| BRL-E08-01 | Log moderasi mencatat moderator_id, action, timestamp, reason.                      | BR-E08         |
| BRL-E08-02 | Retensi log minimal 1 tahun.                                                        | BR-E08         |
| BRL-E09-01 | Notifikasi dikirim ke pelapor dalam ≤5 menit setelah resolusi.                      | BR-E09         |
| BRL-E09-02 | Notifikasi berisi hasil dan ringkasan tindakan.                                     | BR-E09         |
| BRL-E10-01 | Kasus dengan risk=CRITICAL otomatis dieskalasi ke senior moderator.                 | BR-E10         |
| BRL-E10-02 | Eskalasi harus diselesaikan dalam ≤24 jam.                                          | BR-E10         |
| BRL-E11-01 | IF laporan ditolak >3 kali dalam 24 jam THEN user dibatasi membuat laporan.         | BR-E11         |
| BRL-E11-02 | False reporting berulang → penalti reputasi (-20).                                  | BR-E11         |
| BRL-E12-01 | Riwayat pelanggaran menyimpan jenis pelanggaran dan timestamp.                      | BR-E12         |
| BRL-E12-02 | Maksimal 100 pelanggaran disimpan per user.                                         | BR-E12         |
| BRL-E13-01 | Pelanggaran ke-1 → WARNING, ke-2 → TEMP BAN (24 jam), ke-3 → PERM BAN.              | BR-E13         |
| BRL-E13-02 | Perhitungan berdasarkan periode rolling 90 hari.                                    | BR-E13         |
| BRL-E14-01 | Banding harus diajukan dalam ≤7 hari setelah keputusan.                             | BR-E14         |
| BRL-E14-02 | Satu kasus hanya boleh 1 banding.                                                   | BR-E14         |
| BRL-E15-01 | Review banding dilakukan oleh moderator berbeda.                                    | BR-E15         |
| BRL-E15-02 | Keputusan banding bersifat final.                                                   | BR-E15         |
| BRL-E16-01 | KPI moderasi: avg response time, resolution rate.                                   | BR-E16         |
| BRL-E16-02 | Target SLA: respon awal ≤2 jam.                                                     | BR-E16         |
| BRL-E17-01 | Setiap laporan harus assigned ke 1 moderator.                                       | BR-E17         |
| BRL-E17-02 | Maksimal 50 kasus aktif per moderator.                                              | BR-E17         |
| BRL-E18-01 | Laporan analitik mencakup jumlah kasus, jenis pelanggaran, SLA.                     | BR-E18         |
| BRL-E18-02 | Data agregasi diperbarui setiap 24 jam.                                             | BR-E18         |

### 3.7 AI-Powered Services

| BRL-ID     | Business Rule Description (Detailed Logic)                                                                             | Referensi BR   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- |
| BRL-F21-01 | Toxicity Score wajib berupa **FLOAT dalam rentang 0.0 ≤ score ≤ 1.0**.                                                 | BR-F01, BR-F02 |
| BRL-F21-02 | IF score < 0.30 THEN konten diklasifikasikan sebagai **SAFE** dan status = PUBLISHED tanpa intervensi.                 | BR-F02         |
| BRL-F21-03 | IF 0.30 ≤ score < 0.60 THEN konten diklasifikasikan sebagai **WARNING** dan tetap PUBLISHED dengan flag **low-risk**.  | BR-F02         |
| BRL-F21-04 | IF 0.60 ≤ score < 0.85 THEN konten wajib masuk ke **MANUAL_REVIEW_QUEUE** dan status sementara = **PENDING_REVIEW**.   | BR-F02, BR-F04 |
| BRL-F21-05 | IF score ≥ 0.85 THEN konten otomatis **AUTO-HIDDEN (status = HIDDEN)** dan tidak ditampilkan ke publik.                | BR-F02, BR-F04 |
| BRL-F21-06 | IF score ≥ 0.95 THEN konten wajib **AUTO-BLOCKED**, tidak disimpan sebagai publik, dan dibuatkan **VIOLATION_RECORD**. | BR-F04, BR-F05 |
| BRL-F22-01 | IF score ≥ 0.70 THEN sistem wajib mengirim **AUTO-WARNING** ke user (1 event per konten).                              | BR-F04         |
| BRL-F22-02 | AUTO-WARNING maksimal **3 kali dalam 24 jam**; selebihnya tidak dikirim ulang (anti-spam notifikasi).                  | BR-F04         |
| BRL-F22-03 | IF AUTO-WARNING_COUNT ≥ 3 dalam 24 jam THEN user diberi flag **HIGH_RISK_USER = TRUE**.                                | BR-F03         |
| BRL-F23-01 | IF user melakukan ≥3 pelanggaran dengan score ≥0.70 dalam **24 jam** THEN trigger **REPEAT_OFFENSE = TRUE**.           | BR-F03         |
| BRL-F23-02 | IF REPEAT_OFFENSE = TRUE THEN semua konten baru user otomatis **AUTO-HIDDEN** selama **24 jam berikutnya**.            | BR-F03, BR-F04 |
| BRL-F23-03 | IF REPEAT_OFFENSE terjadi ≥2 kali dalam 7 hari THEN sistem wajib **ESCALATE ke moderator (priority HIGH)**.            | BR-F03         |
| BRL-F24-01 | Konten dalam MANUAL_REVIEW_QUEUE wajib diproses maksimal **≤ 12 jam** sejak masuk queue.                               | BR-F04         |
| BRL-F24-02 | Queue prioritas ditentukan oleh score: semakin mendekati 0.85 → prioritas lebih tinggi.                                | BR-F04         |
| BRL-F24-03 | IF review_timeout > 12 jam THEN sistem fallback ke **AUTO-HIDDEN** sebagai default safety.                             | BR-F04         |
| BRL-F25-01 | Sistem wajib menyimpan metadata moderasi: {toxicity_score, category, action_taken, timestamp}.                         | BR-F05, BR-F13 |
| BRL-F25-02 | Setiap aksi moderasi wajib bersifat **idempotent (tidak boleh double-trigger)**.                                       | BR-F05         |
| BRL-F26-01 | Rate limit chatbot: maksimal **20 request / user / 60 menit (rolling window)**.                                        | BR-F06, BR-F16 |
| BRL-F26-02 | IF request_count_1h ≥ 20 THEN sistem wajib **REJECT request (HTTP 429 / throttled)**.                                  | BR-F16         |
| BRL-F26-03 | Burst limit: maksimal **5 request / 60 detik** per user.                                                               | BR-F16         |
| BRL-F26-04 | IF request_count_1min > 5 THEN sistem wajib **TEMP BLOCK selama 60 detik (cooldown)**.                                 | BR-F16         |
| BRL-F26-05 | Daily usage cap: maksimal **100 request / user / 24 jam**.                                                             | BR-F16         |
| BRL-F26-06 | IF request_count_24h ≥ 100 THEN akses chatbot **DISABLED hingga reset window**.                                        | BR-F16         |
| BRL-F27-01 | Timeout response chatbot maksimal **5 detik**.                                                                         | BR-F10, BR-F18 |
| BRL-F27-02 | IF response_time > 5 detik OR error THEN trigger **FALLBACK_RESPONSE (rule-based)**.                                   | BR-F11, BR-F12 |
| BRL-F27-03 | Fallback response wajib dikirim dalam waktu **≤ 1 detik**.                                                             | BR-F12         |
| BRL-F28-01 | Sistem wajib melakukan logging request chatbot: {user_id, request_count, timestamp, latency}.                          | BR-F13         |
| BRL-F28-02 | Retensi log chatbot minimal **180 hari**.                                                                              | BR-F13         |
| BRL-F29-01 | Sistem wajib melakukan throttling berbasis **token bucket algorithm** untuk efisiensi resource.                        | BR-F16         |
| BRL-F29-02 | Prioritas akses chatbot dapat diberikan ke user dengan reputasi ≥1000 (optional bypass +20% limit).                    | BR-F06, BR-F16 |
| BRL-F      | AI dilarang akses Identity Vault                                                                                       |                |
| BRL-F      | Semua aksi AI wajib generate: **Reasoning Metadata**                                                                   |                |

### 3.8 Notification System

| BRL-ID     | Business Rule Description (Detailed Logic)                                                 | Referensi BR   |
| ---------- | ------------------------------------------------------------------------------------------ | -------------- |
| BRL-G01-01 | Event trigger notifikasi harus berasal dari event system (CREATE, UPDATE, DELETE, ACTION). | BR-G01         |
| BRL-G01-02 | Notifikasi dibuat ≤1 detik setelah event terjadi (near real-time).                         | BR-G01         |
| BRL-G01-03 | Payload notifikasi maksimal 2.000 karakter.                                                | BR-G01         |
| BRL-G02-01 | Channel notifikasi: IN_APP, EMAIL, PUSH.                                                   | BR-G02         |
| BRL-G02-02 | IF channel=EMAIL THEN gunakan format RFC 5322 valid.                                       | BR-G02         |
| BRL-G02-03 | Timeout pengiriman maksimal 5 detik per channel.                                           | BR-G02         |
| BRL-G03-01 | Jenis notifikasi: INFO, WARNING, ALERT, SYSTEM.                                            | BR-G03         |
| BRL-G03-02 | Setiap notifikasi wajib memiliki type dan context_id.                                      | BR-G03         |
| BRL-G04-01 | User dapat mengaktifkan/menonaktifkan channel per jenis notifikasi.                        | BR-G04         |
| BRL-G04-02 | Default: semua channel aktif kecuali dinonaktifkan user.                                   | BR-G04         |
| BRL-G05-01 | IF user_opt_out=true THEN notifikasi tidak dikirim.                                        | BR-G05         |
| BRL-G05-02 | Sistem harus validasi preferensi sebelum dispatch.                                         | BR-G05         |
| BRL-G06-01 | Notifikasi dikelompokkan berdasarkan context_id dan event_type.                            | BR-G06         |
| BRL-G06-02 | Maksimal 10 notifikasi dalam satu grup.                                                    | BR-G06         |
| BRL-G07-01 | Riwayat notifikasi disimpan minimal 30 hari.                                               | BR-G07         |
| BRL-G07-02 | Pagination: 20 notifikasi per halaman.                                                     | BR-G07         |
| BRL-G08-01 | Status: UNREAD, READ.                                                                      | BR-G08         |
| BRL-G08-02 | Status berubah ke READ saat user membuka notifikasi.                                       | BR-G08         |
| BRL-G09-01 | Priority level: LOW, MEDIUM, HIGH, CRITICAL.                                               | BR-G09         |
| BRL-G09-02 | IF priority=CRITICAL THEN bypass batching dan dikirim langsung.                            | BR-G09         |
| BRL-G10-01 | Rate limit: maksimal 50 notifikasi per user per hari.                                      | BR-G10         |
| BRL-G10-02 | Burst limit: maksimal 5 notifikasi per menit.                                              | BR-G10         |
| BRL-G11-01 | Delivery success rate minimal 99%.                                                         | BR-G11         |
| BRL-G11-02 | Retry dilakukan jika gagal ≤3 kali dengan interval exponential backoff.                    | BR-G11, BR-G13 |
| BRL-G12-01 | Log mencatat user_id, channel, status, timestamp.                                          | BR-G12         |
| BRL-G12-02 | Retensi log minimal 90 hari.                                                               | BR-G12         |
| BRL-G13-01 | Retry hanya dilakukan untuk status FAILED.                                                 | BR-G13         |
| BRL-G13-02 | Retry dihentikan jika status SUCCESS.                                                      | BR-G13         |
| BRL-G14-01 | Sistem menyaring notifikasi berdasarkan relevansi user (interest/context match).           | BR-G14         |
| BRL-G14-02 | IF relevance_score <0.5 THEN notifikasi tidak dikirim.                                     | BR-G14         |

### 3.9 Search & Discovery

| BRL-ID     | Business Rule Description (Detailed Logic)                                          | Referensi BR |
| ---------- | ----------------------------------------------------------------------------------- | ------------ |
| BRL-H01-01 | Query minimal 3 karakter dan maksimal 100 karakter.                                 | BR-H01       |
| BRL-H01-02 | Sistem mendukung operator dasar: AND, OR, NOT.                                      | BR-H01       |
| BRL-H01-03 | Input harus disanitasi untuk mencegah injection (OWASP standard).                   | BR-H01       |
| BRL-H02-01 | Relevansi dihitung menggunakan scoring (TF-IDF/BM25 atau AI ranking).               | BR-H02       |
| BRL-H02-02 | Hasil dengan score <0.2 tidak ditampilkan.                                          | BR-H02       |
| BRL-H03-01 | Filter: kategori, tanggal, popularitas, status.                                     | BR-H03       |
| BRL-H03-02 | Maksimal 5 filter aktif per query.                                                  | BR-H03       |
| BRL-H04-01 | Sorting: relevance, newest, oldest, most_viewed, most_voted.                        | BR-H04       |
| BRL-H04-02 | Default sorting = relevance.                                                        | BR-H04       |
| BRL-H05-01 | Autocomplete muncul setelah ≥2 karakter.                                            | BR-H05       |
| BRL-H05-02 | Maksimal 10 saran per query.                                                        | BR-H05       |
| BRL-H06-01 | Preview maksimal 200 karakter.                                                      | BR-H06       |
| BRL-H06-02 | Highlight keyword dalam preview.                                                    | BR-H06       |
| BRL-H07-01 | Riwayat disimpan maksimal 50 query terakhir per user (Search history → PersonaID).  | BR-H07       |
| BRL-H07-02 | Retensi riwayat: 30 hari.                                                           | BR-H07       |
| BRL-H07-03 | TTL search history = max 30 hari.                                                   | BR-H07       |
| BRL-H08-01 | Rekomendasi berdasarkan collaborative filtering atau content similarity ≥70%.       | BR-H08       |
| BRL-H08-02 | Maksimal 10 item rekomendasi ditampilkan.                                           | BR-H08       |
| BRL-H09-01 | Konten populer dihitung berdasarkan view ≥100 atau vote ≥10 dalam 7 hari.           | BR-H09       |
| BRL-H10-01 | Konten terbaru: dibuat dalam ≤7 hari terakhir.                                      | BR-H10       |
| BRL-H11-01 | Setiap konten wajib memiliki minimal 1 kategori.                                    | BR-H11       |
| BRL-H11-02 | Maksimal 3 kategori per konten.                                                     | BR-H11       |
| BRL-H12-01 | Konten terkait berdasarkan similarity score ≥0.6.                                   | BR-H12       |
| BRL-H12-02 | Maksimal 5 konten terkait.                                                          | BR-H12       |
| BRL-H13-01 | Response time pencarian ≤2 detik.                                                   | BR-H13       |
| BRL-H13-02 | Timeout query maksimal 5 detik.                                                     | BR-H13       |
| BRL-H14-01 | Log menyimpan query, user_id, timestamp, result_count.                              | BR-H14       |
| BRL-H14-02 | Retensi log minimal 90 hari.                                                        | BR-H14       |
| BRL-H15-01 | Personalisasi berdasarkan riwayat interaksi ≥10 data terakhir.                      | BR-H15       |
| BRL-H15-02 | IF user tidak memiliki histori THEN gunakan default ranking.                        | BR-H15       |
| BRL-H16-01 | Jalur discovery: search, kategori, rekomendasi, trending.                           | BR-H16       |
| BRL-H16-02 | Navigasi harus tersedia dalam ≤2 klik dari halaman utama.                           | BR-H16       |

### 3.10 Analytics & Business Reporting

| BRL-ID     | Business Rule Description (Detailed Logic)                                                             | Referensi BR   |
| ---------- | ------------------------------------------------------------------------------------------------------ | -------------- |
| BRL-I01-01 | Data dikumpulkan dari modul A–H melalui event streaming.                                               | BR-I01         |
| BRL-I01-02 | Event ingestion latency ≤5 detik.                                                                      | BR-I01         |
| BRL-I01-03 | Format event menggunakan JSON schema terstandarisasi.                                                  | BR-I01         |
| BRL-I01-04 | Tidak boleh join PersonaID ↔ AccountID.                                                                | BR-I01         |
| BRL-I02-01 | Metrik: DAU, MAU, retention_rate, engagement_rate.                                                     | BR-I02         |
| BRL-I02-02 | Aggregation window: real-time (<1 menit) dan batch (harian).                                           | BR-I02         |
| BRL-I03-01 | Visualisasi: chart (line, bar, pie).                                                                   | BR-I03         |
| BRL-I03-02 | Refresh dashboard setiap ≤60 detik.                                                                    | BR-I03         |
| BRL-I04-01 | Dashboard hanya dapat diakses oleh role ADMIN/ANALYST.                                                 | BR-I04, BR-I11 |
| BRL-I04-02 | Maksimal 20 widget per dashboard.                                                                      | BR-I04         |
| BRL-I05-01 | Laporan otomatis dikirim setiap periode (harian/mingguan/bulanan).                                     | BR-I05         |
| BRL-I05-02 | Format laporan: PDF, CSV.                                                                              | BR-I05         |
| BRL-I06-01 | Custom report dapat memfilter berdasarkan tanggal, user, konten.                                       | BR-I06         |
| BRL-I06-02 | Maksimal 5 filter dalam custom report.                                                                 | BR-I06         |
| BRL-I07-01 | Analisis tren menggunakan data historis minimal 7 hari.                                                | BR-I07         |
| BRL-I07-02 | Trend dihitung menggunakan moving average.                                                             | BR-I07         |
| BRL-I08-01 | Aktivitas user dihitung berdasarkan login, post, vote.                                                 | BR-I08         |
| BRL-I08-02 | Data dianonimkan (masking user_id) untuk analisis agregat.                                             | BR-I08         |
| BRL-I09-01 | Metrik konten: view_count, vote_count, comment_count.                                                  | BR-I09         |
| BRL-I09-02 | Engagement_rate = (interaksi / view).                                                                  | BR-I09         |
| BRL-I10-01 | Alert trigger jika metric turun ≥30% dalam 24 jam.                                                     | BR-I10         |
| BRL-I10-02 | Alert dikirim ke ADMIN via notifikasi sistem.                                                          | BR-I10         |
| BRL-I11-01 | Akses analitik menggunakan RBAC (role-based access control).                                           | BR-I11         |
| BRL-I11-02 | Autentikasi wajib menggunakan token valid (JWT).                                                       | BR-I11         |
| BRL-I12-01 | Data consistency check dilakukan setiap 24 jam.                                                        | BR-I12         |
| BRL-I12-02 | Error tolerance maksimal 1%.                                                                           | BR-I12         |
| BRL-I13-01 | Data historis disimpan minimal 1 tahun.                                                                | BR-I13         |
| BRL-I13-02 | Data lama diarsipkan setelah 1 tahun.                                                                  | BR-I13         |
| BRL-I14-01 | Ekspor maksimal 100.000 baris per request.                                                             | BR-I14         |
| BRL-I14-02 | File expire setelah 24 jam.                                                                            | BR-I14         |
| BRL-I15-01 | Insight otomatis dihasilkan jika perubahan signifikan ≥20%.                                            | BR-I15         |
| BRL-I15-02 | Insight maksimal 500 karakter.                                                                         | BR-I15         |
| BRL-I16-01 | Evaluasi kebijakan dilakukan per periode ≥30 hari.                                                     | BR-I16         |
| BRL-I16-02 | Perbandingan menggunakan baseline sebelum implementasi.                                                | BR-I16         |

### 3.11 System Safety & Security Standards

| BRL-ID     | Business Rule Description (Detailed Logic)                     | Referensi BR |
| ---------- | -------------------------------------------------------------- | ------------ |
| BRL-J01-01 | Semua komunikasi menggunakan TLS 1.3 (HTTPS).                  | BR-J01       |
| BRL-J01-02 | Cipher suite minimal AES-256-GCM.                              | BR-J01       |
| BRL-J01-03 | Sertifikat SSL harus valid dan diperbarui sebelum expiry.      | BR-J01       |
| BRL-J02-01 | Password di-hash menggunakan bcrypt dengan cost ≥12.           | BR-J02       |
| BRL-J02-02 | MFA opsional menggunakan OTP (6 digit, expiry 5 menit).        | BR-J02       |
| BRL-J02-03 | Token autentikasi menggunakan JWT dengan expiry ≤1 jam.        | BR-J02       |
| BRL-J03-01 | Otorisasi menggunakan RBAC (role-based access control).        | BR-J03       |
| BRL-J03-02 | Role default: USER, MODERATOR, ADMIN.                          | BR-J03       |
| BRL-J03-03 | IF role tidak valid THEN akses ditolak.                        | BR-J03       |
| BRL-J04-01 | Session timeout: 30 menit idle.                                | BR-J04       |
| BRL-J04-02 | Maksimal 5 sesi aktif per user.                                | BR-J04       |
| BRL-J04-03 | Session invalidated setelah logout.                            | BR-J04       |
| BRL-J05-01 | Data sensitif dienkripsi menggunakan AES-256 at rest.          | BR-J05       |
| BRL-J05-02 | Field sensitif (email, phone) di-mask saat ditampilkan.        | BR-J05       |
| BRL-J06-01 | Integrity check menggunakan hash (SHA-256).                    | BR-J06       |
| BRL-J06-02 | IF checksum mismatch THEN data dianggap corrupt.               | BR-J06       |
| BRL-J07-01 | Suspicious activity: ≥5 login gagal dalam 5 menit.             | BR-J07       |
| BRL-J07-02 | IP berbeda dalam ≤10 menit memicu alert.                       | BR-J07       |
| BRL-J08-01 | Log mencatat user_id, action, timestamp, IP address.           | BR-J08       |
| BRL-J08-02 | Retensi log minimal 180 hari.                                  | BR-J08       |
| BRL-J09-01 | Recovery time objective (RTO) ≤1 jam.                          | BR-J09       |
| BRL-J09-02 | Recovery point objective (RPO) ≤15 menit.                      | BR-J09       |
| BRL-J10-01 | Availability target ≥99.9% uptime.                             | BR-J10       |
| BRL-J10-02 | Health check dilakukan setiap 30 detik.                        | BR-J10       |
| BRL-J11-01 | Maksimal 5 login gagal sebelum akun dikunci.                   | BR-J11       |
| BRL-J11-02 | Lockout duration: 15 menit.                                    | BR-J11       |
| BRL-J12-01 | Proteksi terhadap OWASP Top 10 vulnerabilities.                | BR-J12       |
| BRL-J12-02 | Input validation untuk semua request user.                     | BR-J12       |
| BRL-J13-01 | Backup dilakukan setiap 24 jam.                                | BR-J13       |
| BRL-J13-02 | Backup disimpan di lokasi berbeda (offsite).                   | BR-J13       |
| BRL-J14-01 | Restore data harus selesai ≤2 jam.                             | BR-J14       |
| BRL-J14-02 | Backup diuji minimal 1x per bulan.                             | BR-J14       |
| BRL-J15-01 | Config perubahan harus melalui approval admin.                 | BR-J15       |
| BRL-J15-02 | Audit trail untuk setiap perubahan konfigurasi.                | BR-J15       |
| BRL-J16-01 | Setiap user memiliki unique ID (UUID v4).                      | BR-J16       |
| BRL-J16-02 | Identity lifecycle: create, update, deactivate.                | BR-J16       |
| BRL-J17-01 | Sistem harus comply dengan standar keamanan internal.          | BR-J17       |
| BRL-J17-02 | Audit compliance dilakukan setiap 6 bulan.                     | BR-J17       |
| BRL-J18-01 | Monitoring menggunakan alert threshold (CPU, memory, traffic). | BR-J18       |
| BRL-J18-02 | Alert dikirim real-time ke admin jika threshold terlampaui.    | BR-J18       |

### 3.12 Verified Expert Management

| BRL-ID     | Business Rule Description (Detailed Logic)                                                                                   | Referensi BR   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------- |
| BRL-K12-01 | Setiap user **wajib memiliki minimal 1 kategori keahlian** saat pengajuan expert.                                            | BR-K01, BR-K05 |
| BRL-K12-02 | Maksimal kategori keahlian per user adalah **3 kategori (ARRAY SIZE ≤ 3)**.                                                  | BR-K05         |
| BRL-K12-03 | IF jumlah kategori > 3 THEN sistem wajib **REJECT submission**.                                                              | BR-K05         |
| BRL-K12-04 | Sistem wajib memastikan setiap kategori bersifat **UNIQUE (no duplicate category_id)**.                                      | BR-K05         |
| BRL-K12-05 | IF user memiliki >1 kategori (multi-expertise) THEN semua kategori wajib melalui **validasi dokumen terpisah per kategori**. | BR-K02, BR-K05 |
| BRL-K13-01 | Status expert memiliki masa berlaku **12 bulan (365 hari)** sejak timestamp APPROVED.                                        | BR-K03         |
| BRL-K13-02 | Sistem wajib menyimpan field **expert_expiry_date = approved_at + 365 hari**.                                                | BR-K03         |
| BRL-K13-03 | IF current_date ≥ expert_expiry_date THEN status otomatis berubah menjadi **EXPIRED**.                                       | BR-K03, BR-K07 |
| BRL-K13-04 | IF status = EXPIRED THEN semua privilege expert **DINONAKTIFKAN (multiplier=1.0, no boost)**.                                | BR-K06, BR-K10 |
| BRL-K13-05 | Re-verifikasi wajib dilakukan jika: (a) status EXPIRED, atau (b) kategori diubah.                                            | BR-K09         |
| BRL-K13-06 | Sistem wajib mengirim notifikasi re-verifikasi pada **H-30 sebelum expiry**.                                                 | BR-K09         |
| BRL-K14-01 | IF user melakukan ≥2 pelanggaran valid dalam 30 hari THEN status expert = **REVOKED** sebelum expiry.                        | BR-K07         |
| BRL-K14-02 | IF status = REVOKED THEN user tidak dapat mengajukan ulang selama **30 hari (cooldown)**.                                    | BR-K07         |
| BRL-K14-03 | IF REVOKED terjadi ≥2 kali dalam 90 hari THEN user masuk **BLACKLIST_EXPERT (tidak dapat apply selama 180 hari)**.           | BR-K07         |
| BRL-K15-01 | Multiplier reputasi untuk jawaban expert adalah **1.5x dari base reward**.                                                   | BR-K10         |
| BRL-K15-02 | Formula: **final_reputation = base_reputation × multiplier_expert (1.5)**.                                                   | BR-K10         |
| BRL-K15-03 | IF konten berada di luar kategori keahlian expert THEN multiplier otomatis **= 1.0 (no bonus)**.                             | BR-K05, BR-K10 |
| BRL-K15-04 | Multiplier hanya berlaku untuk event: **UPVOTE pada ANSWER (bukan QUESTION atau COMMENT)**.                                  | BR-K10         |
| BRL-K15-05 | Multiplier tidak boleh menyebabkan pelanggaran terhadap **daily reputation cap (Module D)**.                                 | BR-K10         |
| BRL-K16-01 | Expert Validation (vote khusus expert) memiliki bobot **2x dari vote normal (weight = 2)**.                                  | BR-K06         |
| BRL-K16-02 | IF expert memberikan validation pada konten THEN skor konten bertambah **+2 (setara 2 upvote)**.                             | BR-K06         |
| BRL-K16-03 | Expert Validation hanya dapat diberikan jika **reputation ≥ 2000 AND status = APPROVED**.                                    | BR-K06         |
| BRL-K16-04 | Maksimal Expert Validation yang dapat diberikan adalah **10 per 24 jam**.                                                    | BR-K06         |
| BRL-K16-05 | IF konten ≠ kategori keahlian expert THEN validation weight = **1x (fallback normal vote)**.                                 | BR-K05         |
| BRL-K17-01 | Ranking boost untuk konten expert adalah **+20% weight pada scoring algorithm**.                                             | BR-K06         |
| BRL-K17-02 | Formula ranking: **final_score = base_score × 1.2 (jika expert & kategori match)**.                                          | BR-K06         |
| BRL-K17-03 | IF kategori tidak sesuai THEN ranking boost = **0% (multiplier = 1.0)**.                                                     | BR-K05         |
| BRL-K18-01 | Eligibility pengajuan expert mensyaratkan **reputation ≥ 1000**.                                                             | BR-K01, BR-K10 |
| BRL-K18-02 | IF reputation < 1000 THEN sistem wajib **REJECT application**.                                                               | BR-K01         |
| BRL-K18-03 | IF reputasi turun <500 setelah menjadi expert THEN status masuk **UNDER_REVIEW**.                                            | BR-K10         |
| BRL-K18-04 | IF reputasi tidak kembali ≥500 dalam 7 hari THEN status otomatis **REVOKED**.                                                | BR-K10         |
| BRL-K19-01 | Maksimal pengajuan expert adalah **2 kali dalam 30 hari (rolling window)**.                                                  | BR-K01         |
| BRL-K19-02 | IF submission_count_30d ≥ 2 THEN sistem wajib **BLOCK submission**.                                                          | BR-K01         |
| BRL-K20-01 | SLA verifikasi admin maksimal **72 jam** sejak submission.                                                                   | BR-K03         |
| BRL-K20-02 | IF verifikasi >72 jam THEN sistem wajib **AUTO-ESCALATE ke admin senior**.                                                   | BR-K03         |
| BRL-K20-03 | IF >120 jam tanpa keputusan THEN status otomatis **FLAGGED_FOR_AUDIT**.                                                      | BR-K03         |

### 3.13 Appeal & Dispute Management

| BRL-ID     | Business Rule Description (Detailed Logic)                                                                                          | Referensi BR   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| BRL-L12-01 | Banding hanya dapat diajukan oleh **user_id yang sama dengan target tindakan moderasi (affected_user_id)**.                         | BR-L01         |
| BRL-L12-02 | Batas waktu pengajuan banding adalah **≤ 7 hari (168 jam)** sejak **moderation_action_timestamp**.                                  | BR-L01         |
| BRL-L12-03 | IF current_time - moderation_action_timestamp > 168 jam THEN sistem wajib **REJECT appeal (EXPIRED)**.                              | BR-L01         |
| BRL-L12-04 | Konten banding wajib memiliki panjang **20 ≤ karakter ≤ 1000**.                                                                     | BR-L02         |
| BRL-L12-05 | IF content_length < 20 OR > 1000 THEN sistem wajib **REJECT submission (VALIDATION_ERROR)**.                                        | BR-L02         |
| BRL-L13-01 | Maksimal **1 appeal per case_id (HARD CONSTRAINT)**.                                                                                | BR-L02         |
| BRL-L13-02 | Sistem wajib menerapkan **UNIQUE(case_id, user_id)** pada tabel appeal.                                                             | BR-L02         |
| BRL-L13-03 | Maksimal banding per user adalah **3 case / 30 hari (rolling window)**.                                                             | BR-L02         |
| BRL-L13-04 | IF appeal_count_30d ≥ 3 THEN sistem wajib **BLOCK submission**.                                                                     | BR-L02         |
| BRL-L14-01 | Status appeal wajib berupa ENUM: {SUBMITTED, IN_REVIEW, APPROVED, REJECTED}, Appeal tidak boleh ditinjau oleh moderator yang sama.  | BR-L03         |
| BRL-L14-02 | SLA respon awal wajib ≤ **24 jam (86400 detik)** sejak status SUBMITTED.                                                            | BR-L03         |
| BRL-L14-03 | IF response_time > 24 jam THEN sistem wajib **FLAG SLA_BREACH_LEVEL_1**.                                                            | BR-L03         |
| BRL-L14-04 | SLA penyelesaian final wajib ≤ **72 jam (259200 detik)** sejak SUBMITTED.                                                           | BR-L03         |
| BRL-L14-05 | IF resolution_time > 72 jam THEN sistem wajib **AUTO-ESCALATE ke SENIOR_MODERATOR**.                                                | BR-L03, BR-L04 |
| BRL-L14-06 | IF resolution_time > 120 jam THEN sistem wajib **FLAG CRITICAL_SLA_BREACH + PRIORITY_OVERRIDE**.                                    | BR-L03         |
| BRL-L15-01 | Reviewer banding wajib memiliki **reviewer_id ≠ original_moderator_id** (no self-review).                                           | BR-L04         |
| BRL-L15-02 | IF conflict detected THEN sistem wajib **AUTO-ASSIGN ke SENIOR_MODERATOR**.                                                         | BR-L04         |
| BRL-L15-03 | Minimal reviewer privilege: **role ∈ {MODERATOR, SENIOR_MODERATOR}**.                                                               | BR-L04         |
| BRL-L16-01 | IF appeal_status = APPROVED THEN sistem wajib **REVERT moderation_action (restore content/status)**.                                | BR-L05         |
| BRL-L16-02 | IF appeal_status = REJECTED THEN status moderasi tetap berlaku tanpa perubahan.                                                     | BR-L05         |
| BRL-L16-03 | Keputusan banding bersifat **FINAL (NO RE-APPEAL, HARD CONSTRAINT)**.                                                               | BR-L05         |
| BRL-L17-01 | Sistem mendeteksi abuse jika **invalid_appeal_count ≥ 3 dalam 24 jam**.                                                             | BR-L07         |
| BRL-L17-02 | IF abuse_detected = TRUE THEN sistem wajib memberikan penalti **-20 reputasi**.                                                     | BR-L07         |
| BRL-L17-03 | IF abuse_detected = TRUE THEN user masuk status **APPEAL_COOLDOWN selama 7 hari (168 jam)**.                                        | BR-L07         |
| BRL-L17-04 | IF user dalam status APPEAL_COOLDOWN THEN semua submission appeal **DITOLAK otomatis**.                                             | BR-L07         |
| BRL-L18-01 | Sistem wajib mencatat log appeal: {user_id, case_id, decision, reviewer_id, timestamps}.                                            | BR-L06         |
| BRL-L18-02 | Retensi log appeal minimal **365 hari**.                                                                                            | BR-L06         |
| BRL-L19-01 | Identitas user wajib di-mask menggunakan **pseudonymization (no real identity exposure)**.                                          | BR-L08         |
| BRL-L19-02 | Data sensitif wajib dienkripsi menggunakan **AES-256 encryption**.                                                                  | BR-L08         |
| BRL-L20-01 | Notifikasi hasil banding wajib dikirim dalam waktu **≤ 5 menit (300 detik)** setelah decision dibuat.                               | BR-L09         |
| BRL-L20-02 | Notifikasi wajib berisi: {decision, reasoning_summary ≤ 500 karakter}.                                                              | BR-L09         |
| BRL-L21-01 | Sistem wajib menghitung KPI: {avg_response_time, avg_resolution_time, appeal_success_rate}.                                         | BR-L10         |
| BRL-L21-02 | Evaluasi performa appeal dilakukan setiap **30 hari (batch job)**.                                                                  | BR-L10         |
| BRL-L22-01 | Akses data appeal dibatasi menggunakan **RBAC (role ∈ {ADMIN, SENIOR_MODERATOR})**.                                                 | BR-L11         |
| BRL-L22-02 | Semua akses wajib menggunakan **JWT valid + token expiry ≤ 1 jam**.                                                                 | BR-L11         |
| BRL-L      | Action BAN/DELETE butuh 2 moderator                                                                                                 |                |
| BRL-L      | Moderation Ledger = append-only                                                                                                     |                |
| BRL-L      | Report weight berbasis reputasi pelapor                                                                                             |                |
| BRL-L      | Anti mass-report: z-score anomaly detection                                                                                         |                |
| BRL-L      | Appeal harus direview oleh **2 moderator berbeda**.                                                                                 |                |
| BRL-L      | Moderator tidak boleh review case sendiri.                                                                                          |                |

---

## 4. Stakeholders & Users

Bagian ini merinci entitas manusia dan sistem yang berinteraksi dengan platform OLION. Penentuan peran dilakukan berdasarkan tingkat otoritas, tanggung jawab, dan batasan akses terhadap data sensitif untuk menjaga integritas anonimitas serta kualitas diskusi akademik.

### 4.1 Stakeholder Profiles
Pihak-pihak yang memiliki kepentingan terhadap keberhasilan dan operasional platform:

1.  **Project Owner & Developer (beel)**
    Pengembang sistem dan pengambil keputusan teknis utama yang menjamin kualitas teknis, keamanan data, dan ketercapaian target MVP.
2.  **End Users**
    Mahasiswa atau individu umum yang membutuhkan ruang diskusi aman dengan jaminan pseudonimitas.
3.  **Verified Experts**
    Profesional atau akademisi dengan kredensial tervalidasi yang memberikan bobot kredibilitas pada konten.
4.  **Moderator & Administrator**
    Tim operasional yang memastikan tata kelola komunitas (governance) dan stabilitas sistem berjalan sesuai aturan bisnis.
5.  **Dosen Pengampu / Institusi**
    Mentor intelektual yang memantau validitas platform sebagai media pembelajaran dan riset akademik.

### 4.2 Actor Classification (Final)
Berikut adalah klasifikasi aktor berdasarkan interaksi teknisnya dengan sistem:

| Actor ID | Actor Name | Type | Deskripsi Singkat |
| :--- | :--- | :--- | :--- |
| **ROL-01** | **Guest** | Human | Pengguna belum terautentikasi; hanya akses baca konten publik. |
| **ROL-02** | **Regular User** | Human | Pengguna terdaftar (pseudonim); aktor utama diskusi & voting. |
| **ROL-03** | **Verified Expert** | Human | Pakar terverifikasi; otoritas validasi keilmuan. |
| **ROL-04** | **Moderator** | Human | Pengawas konten; review laporan & penegakan etika komunitas. |
| **ROL-05** | **Administrator** | Human | Pengelola sistem; manajemen user, verifikasi, & audit log. |
| **ROL-06** | **System AI** | System Actor | Entitas internal untuk moderasi, klasifikasi, & deteksi risiko. |
| **ROL-07** | **Chatbot AI** | System Actor | Entitas eksternal untuk asisten interaksi pengguna. |

### 4.3 RBAC Access Matrix
Matriks Kontrol Akses Berbasis Peran (Role-Based Access Control) mendefinisikan izin fungsional untuk setiap aktor:

| Fungsi Utama / Modul | Guest | User | Expert | Moderator | Admin | System AI |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Melihat Diskusi & Jawaban** | V | V | V | V | V | V |
| **Membuat Post / Komentar** | - | V | V | - | - | V |
| **AI Chatbot Interaction** | - | V | V | - | - | V |
| **Voting (Upvote/Downvote)** | - | V* | V | - | - | - |
| **Memberikan Verified Label** | - | - | V | - | - | - |
| **Proses Laporan (Moderasi)** | - | - | - | V | V | V |
| **Manajemen Status Akun** | - | - | - | V | V | - |
| **Verifikasi Dokumen Expert** | - | - | - | - | V | - |
| **Akses Audit Log (Read-only)** | - | - | - | - | V | - |

*\*Keterangan: Hak akses voting dibatasi secara dinamis oleh ambang batas (threshold) poin reputasi sesuai BRL-D06.*

### 4.4 Critical Permissions & Restrictions
Batasan ketat yang diterapkan sistem untuk menjaga nilai utama platform (anonimitas dan akuntabilitas):

1.  **Identity Decoupling (BRL-GEN-01):** Sistem dilarang menampilkan korelasi antara *Real Identity* (Data Pribadi) dengan *Pseudonym Identity* kepada aktor manapun, termasuk Moderator dan Administrator pada dashboard operasional.
2.  **Reputation-Based Access (BRL-D06):** Izin fungsional tertentu (seperti Downvote) bersifat dinamis; sistem otomatis mencabut akses jika poin reputasi < 100 meskipun status akun aktif.
3.  **Moderator Constraints (BRL-E05):** Moderator tidak memiliki otoritas untuk mengubah isi (edit) teks diskusi milik pengguna, hanya diizinkan mengelola visibilitas konten (Hide/Delete).
4.  **Audit Trail Immutability (BRL-GEN-03):** Setiap tindakan administratif wajib dicatat dalam *Audit Log* yang bersifat *Read-Only* untuk menjamin transparansi penuh.
5.  **AI Autonomy & Human-in-the-loop (BRL-F21):** System AI dapat melakukan *Auto-Hidden* pada konten berisiko tinggi (skor ≥ 0.85), namun keputusan tersebut wajib tersedia dalam antrean review untuk divalidasi atau dibatalkan oleh Moderator manusia.

---

## 5. Functional Requirements

Bagian ini merinci entitas manusia dan sistem yang berinteraksi dengan platform OLION. Penentuan peran dilakukan berdasarkan tingkat otoritas, tanggung jawab, dan batasan akses terhadap data sensitif untuk menjaga integritas anonimitas serta kualitas diskusi akademik.

### 5.1 Module A - Authentication & Account Management

| FR-ID  | Function Name                | Requirement Description                                                                                                                            | Traceability                               | Priority |
| :----- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- | :------- |
| FR-A01 | User Registration            | The System shall allow users to register using email and password and set account status to **PENDING** until email verification is completed.     | BR-A01, BRL-A01-01                         | High     |
| FR-A02 | Email Uniqueness             | The System shall reject registration if the email already exists using a database unique constraint.                                               | BR-A15, BRL-A01-02, BRL-A15-01             | High     |
| FR-A03 | Password Policy Validation   | The System shall validate password minimum 8 characters with uppercase, lowercase, number, symbol, not containing email, and not in breached list. | BR-A05, BRL-A01-03, BRL-A05-01, BRL-A05-02 | High     |
| FR-A04 | Email Verification Token     | The System shall generate UUID v4 verification token with 15-minute expiry and send verification email.                                            | BR-A01, BRL-A01-01                         | High     |
| FR-A05 | Account Activation           | The System shall activate account (status=ACTIVE) after valid token verification and delete the token.                                             | BR-A01                                     | High     |
| FR-A06 | Password Hashing             | The System shall hash passwords using bcrypt with cost ≥12 before storing.                                                                         | BR-A02, BRL-A02-01                         | High     |
| FR-A07 | Login Attempt Limiting       | The System shall limit login attempts to 5 within 10 minutes and lock account for 15 minutes if exceeded.                                          | BR-A17, BRL-A02-02, BRL-A17-01             | High     |
| FR-A08 | JWT Generation               | The System shall generate JWT with 60-minute expiry upon successful login.                                                                         | BR-A08, BRL-A02-03                         | High     |
| FR-A09 | Session Creation             | The System shall create a session with unique UUID and store IP, device, timestamp metadata.                                                       | BR-A08, BRL-A08-02                         | High     |
| FR-A10 | Max Active Sessions          | The System shall allow maximum 5 active sessions per user and remove the oldest if exceeded.                                                       | BR-A08, BRL-A08-01                         | High     |
| FR-A11 | JWT Validation               | The System shall validate JWT on every protected endpoint and return HTTP 401 if invalid or expired.                                               | BR-A03, BRL-A03-01, BRL-A03-02             | High     |
| FR-A12 | Logout                       | The System shall revoke session and blacklist JWT upon logout.                                                                                     | BR-A09, BRL-A09-01                         | High     |
| FR-A13 | Account Status Enforcement   | The System shall allow login only for accounts with status ACTIVE.                                                                                 | BR-A10, BRL-A10-02                         | High     |
| FR-A14 | RBAC Middleware              | The System shall verify role before granting access to endpoints using RBAC middleware.                                                            | BR-A11, BRL-A11-02                         | High     |
| FR-A15 | Idle Session Timeout         | The System shall terminate session after 30 minutes of inactivity.                                                                                 | BR-A12, BRL-A12-01                         | Medium   |
| FR-A16 | Absolute Session Timeout     | The System shall terminate session after 24 hours regardless of activity.                                                                          | BR-A12, BRL-A12-02                         | Medium   |
| FR-A17 | Suspicious Login Detection   | The System shall flag login from different IP within 5 minutes as suspicious.                                                                      | BR-A13, BRL-A13-01                         | High     |
| FR-A18 | MFA Trigger                  | The System shall trigger MFA challenge when suspicious activity is detected.                                                                       | BR-A13, BRL-A13-02                         | High     |
| FR-A19 | MFA Verification             | The System shall validate TOTP (RFC 6238, 30s interval) or one-time backup code.                                                                   | BR-A16, BRL-A16-01, BRL-A16-02             | High     |
| FR-A20 | Authentication Logging       | The System shall log user_id, IP, device, timestamp for every authentication event with ≥90 days retention.                                        | BR-A14, BRL-A14-01, BRL-A14-02             | High     |
| FR-A21 | Geolocation Anomaly          | The System shall detect geolocation changes within <1 hour and flag risk event.                                                                    | BR-A18, BRL-A18-01                         | Medium   |
| FR-A22 | Password Expiry Enforcement  | The System shall force password change every 90 days during login.                                                                                 | BR-A19, BRL-A19-01                         | Medium   |
| FR-A23 | Access History               | The System shall store the last 100 access activities per user (FIFO).                                                                             | BR-A20, BRL-A20-01                         | Low      |
| FR-A24 | Password Reset Request       | The System shall send password reset link with UUID token valid for 15 minutes and one-time use.                                                   | BR-A04, BRL-A04-01, BRL-A04-02             | High     |
| FR-A25 | Password Reset Execution     | The System shall validate token, update password, and invalidate all active sessions.                                                              | BR-A04, BR-A24, BRL-A24-01                 | High     |
| FR-A26 | Pseudonym Generation         | The System shall auto-generate unique pseudonym (6–20 chars, alphanumeric + underscore) if not provided.                                           | BR-A06, BRL-A06-01, BRL-A07-01             | Medium   |
| FR-A27 | Pseudonym Update             | The System shall allow pseudonym change max 3 times in 30 days with uniqueness check.                                                              | BR-A07, BRL-A07-02                         | Medium   |
| FR-A28 | Account Deletion Request     | The System shall require password confirmation and set account to DELETED (soft delete 30 days).                                                   | BR-A21, BRL-A21-01, BRL-A21-02             | High     |
| FR-A29 | Deletion Audit Log           | The System shall store account deletion log for minimum 1 year.                                                                                    | BR-A22, BRL-A22-01                         | Medium   |
| FR-A30 | Policy Consent Logging       | The System shall store policy version and timestamp upon user consent.                                                                             | BR-A23, BRL-A23-01                         | Medium   |
| FR-A31 | Active Session Monitoring    | The System shall allow users to view active sessions (IP, device, last activity).                                                                  | BR-A25, BRL-A25-01                         | Low      |
| FR-A32 | Session Revoke by User/Admin | The System shall allow session revocation by session ID.                                                                                           | BR-A26, BRL-A26-01                         | Medium   |
| FR-A33 | Risk Notification            | The System shall send email notification within ≤1 minute after risk event detection.                                                              | BR-A27, BRL-A27-01                         | Medium   |
| FR-A34 | Admin Force Logout           | The System shall allow administrator to revoke all sessions of a user.                                                                             | BR-A28, BRL-A28-01                         | Medium   |
| FR-A35 |                              | MFA wajib berbasis risk (adaptive MFA)                                                                                                             |                                            |          |
| FR-A36 |                              | Device binding (fingerprint hash)                                                                                                                  |                                            |          |
| FR-A37 |                              | Session = HttpOnly Cookie + SameSite=Strict + Secure                                                                                               |                                            |          |
| FR-A38 | Persona Isolation            | Sistem wajib memastikan bahwa AccountID (identitas asli) tidak pernah disimpan dalam tabel yang sama dengan PersonaID (konten).                    |                                            |          |
| FR-A39 | Session Revocation Only	    | Fitur manajemen sesi oleh Admin hanya boleh berupa perintah Revoke (paksa logout), tanpa kemampuan untuk Impersonate (masuk sebagai user).         |                                            |          |

## **System Logic Flow & Constraints**

1. **Registrasi tidak langsung ACTIVE** — akun selalu melalui status **PENDING → ACTIVE** via verifikasi email.
2. **Semua kredensial disimpan terenkripsi** menggunakan bcrypt, tidak ada plaintext.
3. **Autentikasi adalah kombinasi JWT + Session Store**, sehingga logout & revoke bisa dilakukan (JWT saja tidak cukup).
4. **Sesi memiliki dua batas waktu**: idle (30 menit) dan absolut (24 jam).
5. **Sistem protektif terhadap brute-force**: 5 gagal → lock 15 menit.
6. **Deteksi risiko berbasis perilaku**: IP berbeda cepat, geolocation anomali, memicu MFA & notifikasi.
7. **Perubahan password & reset password** otomatis menginvalidasi seluruh sesi aktif (security-first design).
8. **Pseudonym adalah identitas publik utama**, email tidak pernah terekspos ke UI publik.
9. **Soft delete akun** memberi jendela 30 hari sebelum penghapusan permanen (compliance & audit).
10. **RBAC wajib di semua endpoint** — tidak ada endpoint business yang bisa diakses tanpa middleware role check.

FR ini sekarang **siap dijadikan dasar pembuatan:**

* API endpoint list
* Middleware auth & RBAC
* Database schema constraint
* Test case (QA)
* Traceability matrix ke BR & BRL

### 5.2 Module B - Discussion System

| FR-ID  | Function Name             | Requirement Description                                                                                                                                | Traceability                                       | Priority |
| :----- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- | :------- |
| FR-B01 | Create Discussion         | The System shall allow authenticated users to create a discussion with title 10–150 chars and content 20–10,000 chars and set owner_id and created_at. | BR-B01, BRL-B01-01, BRL-B01-02, BRL-B01-03, BR-B13 |          |
| FR-B02 | Assign Category           | The System shall require exactly one valid category_id from predefined list for every discussion using FK constraint.                                  | BR-B05, BRL-B05-01, BRL-B05-02                     |          |
| FR-B03 | Assign Labels             | The System shall allow up to 5 labels per discussion and validate each label length 2–30 characters after normalization.                               | BR-B06, BRL-B06-01, BRL-B06-02                     |          |
| FR-B04 | Set Visibility            | The System shall set discussion visibility to PUBLIC, PRIVATE, or RESTRICTED and enforce access rules accordingly.                                     | BR-B07, BRL-B07-01, BRL-B07-02, BRL-B07-03         |          |
| FR-B05 | Initialize Status         | The System shall initialize new discussion status as DRAFT or PUBLISHED following valid state machine.                                                 | BR-B08, BRL-B08-01, BRL-B08-02                     |          |
| FR-B06 | Duplicate Detection       | The System shall perform ≥80% similarity check on title and content before publish and display similar discussions if detected.                        | BR-B18, BRL-B18-01, BRL-B18-02                     |          |
| FR-B07 | Create Thread Structure   | The System shall store parent_id (NULL for root) and enforce maximum thread depth of 5 levels.                                                         | BR-B02, BRL-B02-01, BRL-B02-02                     |          |
| FR-B08 | Default Thread Sorting    | The System shall sort items in a thread by created_at ascending by default.                                                                            | BR-B02, BRL-B02-03                                 |          |
| FR-B09 | Edit Discussion           | The System shall allow only owner to edit discussion within 30 days after publish and store previous version.                                          | BR-B03, BRL-B03-01, BRL-B03-02, BRL-B03-03         |          |
| FR-B10 | Versioning Limit          | The System shall store maximum 50 versions per discussion using FIFO purge.                                                                            | BR-B14, BRL-B14-02                                 |          |
| FR-B11 | Restore Version           | The System shall allow owner/admin to rollback to previous version only.                                                                               | BR-B15, BRL-B15-01, BRL-B15-02                     |          |
| FR-B12 | Soft Delete Discussion    | The System shall allow owner/admin to set deleted=true and hide discussion from listings.                                                              | BR-B04, BRL-B04-01, BRL-B04-02                     |          |
| FR-B13 | Hard Delete Scheduler     | The System shall permanently delete discussions 30 days after soft delete via scheduler.                                                               | BR-B04, BRL-B04-03                                 |          |
| FR-B14 | Enforce Ownership         | The System shall assign owner_id at creation and keep immutable except via transfer process.                                                           | BR-B13, BRL-B13-01, BRL-B13-02                     |          |
| FR-B15 | Transfer Ownership        | The System shall transfer ownership after confirmation from both parties and log the event.                                                            | BR-B17, BRL-B17-01, BRL-B17-02                     |          |
| FR-B16 | Lock Discussion           | The System shall allow moderator/admin to set status=LOCKED and disable edit/delete/comment.                                                           | BR-B16, BRL-B16-01, BRL-B16-02                     |          |
| FR-B17 | Auto-Save Draft           | The System shall auto-save draft content every 30 seconds with last_saved timestamp.                                                                   | BR-B09, BRL-B09-02                                 |          |
| FR-B18 | Draft Privacy             | The System shall ensure drafts are not visible to other users.                                                                                         | BR-B09, BRL-B09-01                                 |          |
| FR-B19 | Restore Draft             | The System shall restore draft based on latest last_saved timestamp within 7 days.                                                                     | BR-B10, BRL-B10-01, BRL-B10-02                     |          |
| FR-B20 | Archive Inactive          | The System shall set status=ARCHIVED for discussions without activity for 90 days.                                                                     | BR-B11, BRL-B11-01                                 |          |
| FR-B21 | Exclude Archived          | The System shall exclude archived discussions from default listing.                                                                                    | BR-B11, BRL-B11-02                                 |          |
| FR-B22 | Retention Policy          | The System shall enforce minimum 1-year retention before eligible deletion based on config.                                                            | BR-B12, BRL-B12-01, BRL-B12-02                     |          |
| FR-B23 | List Discussions          | The System shall list discussions with pagination 20 items/page and sorting (latest, most_popular, most_commented).                                    | BR-B19, BRL-B19-01, BRL-B19-02                     |          |
| FR-B24 | Full-Text Search          | The System shall perform full-text search with minimum query length 3 characters.                                                                      | BR-B19, BRL-B19-03                                 |          |
| FR-B25 | Visibility Access Control | The System shall check visibility rules and deny access if user does not meet criteria.                                                                | BR-B07, BRL-B07-02, BRL-B07-03                     |          |
| FR-B26 | Unique View Counting      | The System shall count view as unique per user per discussion per 1-hour window.                                                                       | BR-B20, BRL-B20-02                                 |          |
| FR-B27 | Engagement Metrics        | The System shall increment comment_count and like_count and update daily aggregation table.                                                            | BR-B20, BRL-B20-01, BRL-B20-03                     |          |
| FR-B28 | Metadata Display          | The System shall display metadata (created_at, pseudonym, counts) on discussion detail.                                                                | BR-B19, BR-B20                                     |          |
| FR-B29 | Scheduler Archive Job     | The System shall run scheduler to evaluate inactivity and archive eligible discussions.                                                                | BR-B11                                             |          |
| FR-B30 | Scheduler Retention Job   | The System shall run scheduler to evaluate retention and mark eligible deletion.                                                                       | BR-B12                                             |          |
| FR-B31 |                           | GDPR Mode: hard delete → encrypt + isolate (legal hold)                                                                                                |                                                    |          |
| FR-B32 |                           | Semua konten publish → attach PersonaID                                                                                                                |                                                    |          |

## **System Logic Flow & Constraints**

1. **Pembuatan diskusi tidak langsung publik** — dapat melalui **DRAFT → PUBLISHED** sesuai state machine.
2. **Thread bukan flat** — seluruh relasi menggunakan **parent_id** dengan batas **maksimum 5 level** untuk menjaga performa query.
3. **Edit dibatasi waktu (30 hari)** dan **selalu menyimpan versi lama** sebelum perubahan (auditability).
4. **Delete bukan langsung hilang** — selalu **soft delete → hard delete +30 hari** oleh scheduler.
5. **Draft sangat protektif** — auto-save 30 detik, private, dan bisa dipulihkan maksimal 7 hari.
6. **Diskusi bisa terkunci (LOCKED)** oleh moderator sehingga semua endpoint modifikasi otomatis ditolak oleh middleware.
7. **Diskusi lama otomatis ARCHIVED** setelah 90 hari tanpa aktivitas dan tidak tampil di listing default.
8. **Sistem mencegah duplikasi konten** dengan similarity ≥80% sebelum publikasi.
9. **Akses diskusi selalu melewati pemeriksaan visibility** (PUBLIC/PRIVATE/RESTRICTED) sebelum data ditampilkan.
10. **Metrik bukan dihitung real-time saja** — disimpan dalam **aggregation table harian** untuk kebutuhan analitik.
11. **Retention compliance** memastikan data tidak bisa dihapus sebelum 1 tahun meskipun sudah soft delete.
12. **Ownership adalah konsep inti** — semua aksi edit, delete, restore, transfer, selalu diverifikasi terhadap owner/admin.

FR ini siap diturunkan menjadi:

* Endpoint API (create, edit, list, search, archive, restore)
* Constraint database (FK, enum, versioning, retention flag)
* Middleware (ownership, visibility, lock state)
* Test case QA dan Traceability Matrix ke BR/BRL

### 5.3 Module C - Answer & Comment Interaction

| FR-ID  | Function Name                  | Requirement Description                                                                                                                     | Traceability                               | Priority |
| :----- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------- | :------- |
| FR-C01 | Create Answer                  | The System shall allow authenticated users to create an answer with content length 30–15,000 characters and assign owner_id and created_at. | BR-C01, BRL-C01-01, BRL-C01-02, BRL-C06-01 |          |
| FR-C02 | Limit Answer Per User          | The System shall restrict a user to maximum 10 answers per discussion.                                                                      | BR-C01, BRL-C01-03                         |          |
| FR-C03 | Create Comment                 | The System shall allow authenticated users to create a comment with content length 5–2,000 characters linked to discussion or answer.       | BR-C02, BRL-C02-01, BRL-C02-02, BRL-C02-03 |          |
| FR-C04 | Comment Thread Structure       | The System shall store parent_id for comments and enforce maximum depth of 3 levels.                                                        | BR-C03, BRL-C03-01, BRL-C03-02, BRL-C14-01 |          |
| FR-C05 | Default Comment Sorting        | The System shall sort comments in a thread by created_at ascending.                                                                         | BR-C03, BRL-C03-03                         |          |
| FR-C06 | Content Validation Filter      | The System shall validate content using profanity blocklist ≥100 words and URL blacklist/regex and set status=REJECTED if violated.         | BR-C09, BRL-C09-01, BRL-C09-02, BRL-C09-03 |          |
| FR-C07 | Edit Answer/Comment            | The System shall allow only owner to edit within 7 days after publish and store previous version.                                           | BR-C04, BRL-C04-01, BRL-C04-02, BRL-C04-03 |          |
| FR-C08 | Versioning Limit               | The System shall store maximum 30 versions per answer/comment using FIFO purge.                                                             | BR-C10, BRL-C10-02                         |          |
| FR-C09 | Restore Version                | The System shall allow owner/admin to rollback to previous version only.                                                                    | BR-C11, BRL-C11-01, BRL-C11-02             |          |
| FR-C10 | Soft Delete                    | The System shall allow owner/admin to set deleted=true and hide the content.                                                                | BR-C05, BRL-C05-01, BRL-C05-02             |          |
| FR-C11 | Hard Delete Scheduler          | The System shall permanently delete content 30 days after soft delete via scheduler.                                                        | BR-C05, BRL-C05-03                         |          |
| FR-C12 | Enforce Ownership              | The System shall assign owner_id NOT NULL at creation and keep immutable.                                                                   | BR-C06, BRL-C06-01, BRL-C06-02             |          |
| FR-C13 | Inherit Visibility             | The System shall inherit visibility from its parent (discussion/answer) and restrict access accordingly.                                    | BR-C07, BRL-C07-01, BRL-C07-02             |          |
| FR-C14 | Answer Sorting                 | The System shall sort answers by score descending then created_at.                                                                          | BR-C08, BRL-C08-01                         |          |
| FR-C15 | Spam Detection                 | The System shall flag suspicious=true if a user posts more than 5 comments within 1 minute.                                                 | BR-C12, BRL-C12-01, BRL-C12-02             |          |
| FR-C16 | Comment Rate Limit             | The System shall enforce rate limit of maximum 10 comments per minute per user.                                                             | BR-C13, BRL-C13-01                         |          |
| FR-C17 | Answer Rate Limit              | The System shall enforce rate limit of maximum 5 answers per 10 minutes per user.                                                           | BR-C13, BRL-C13-02                         |          |
| FR-C18 | Mark Accepted Answer           | The System shall allow only discussion owner to mark one answer as ACCEPTED.                                                                | BR-C15, BRL-C15-01, BRL-C15-02             |          |
| FR-C19 | Restrict Accepted Edit         | The System shall restrict edits on ACCEPTED answer to ≤5% content change or require moderator approval.                                     | BR-C16, BRL-C16-01, BRL-C16-02             |          |
| FR-C20 | Disable Comments               | The System shall allow moderator to set comments_enabled=false on a discussion.                                                             | BR-C17, BRL-C17-01                         |          |
| FR-C21 | Reject Comment When Disabled   | The System shall reject comment creation with 403 if comments_enabled=false.                                                                | BR-C17, BRL-C17-02                         |          |
| FR-C22 | Update Answer Ranking          | The System shall re-sort answers when score changes due to voting activity.                                                                 | BR-C08                                     |          |
| FR-C23 | Moderation Queue Trigger       | The System shall send content to moderation queue if suspicious=true or status=REJECTED.                                                    | BR-C12                                     |          |
| FR-C24 | Ownership Validation on Update | The System shall return 403 if user_id ≠ owner_id during edit/delete/restore actions.                                                       | BR-C04, BR-C05                             |          |
| FR-C25 | Polymorphic Relation Integrity | The System shall validate that comment target exists (discussion_id or answer_id) before saving.                                            | BR-C02                                     |          |
| FR-C26 | Metadata Display               | The System shall display pseudonym, created_at, score, and status for each answer/comment.                                                  | BR-C08                                     |          |

## **System Logic Flow & Constraints**

1. **Jawaban & komentar hanya oleh user terautentikasi** — semua endpoint create dilindungi JWT middleware.
2. **Struktur komentar dibatasi 3 level** untuk menjaga keterbacaan dan performa query tree.
3. **Konten selalu melewati profanity & URL filtering** sebelum publish. Pelanggaran langsung **REJECTED**.
4. **Edit sangat dibatasi waktu (7 hari)** dan selalu menyimpan versi sebelumnya (audit trail).
5. **Accepted Answer adalah state khusus**:

   * Hanya 1 per diskusi
   * Edit besar (>5%) perlu persetujuan moderator
6. **Spam & abuse dikendalikan 2 lapis**:

   * Rate limit (hard reject)
   * Suspicious detection (soft flag ke moderasi)
7. **Visibility tidak berdiri sendiri** — selalu mewarisi dari parent (discussion/answer).
8. **Delete bukan langsung hilang** — soft delete dahulu, hard delete oleh scheduler +30 hari.
9. **Komentar bisa dimatikan moderator** di level diskusi (global untuk thread tersebut).
10. **Sorting berbeda antara jawaban dan komentar**:

    * Jawaban: berdasarkan **score**
    * Komentar: berdasarkan **waktu**
11. **Versioning dibatasi 30 versi** untuk efisiensi storage.
12. **Setiap aksi edit/delete/restore selalu diverifikasi ownership** untuk mencegah manipulasi konten.

FR ini siap diturunkan menjadi:

* Endpoint API Answer & Comment
* Middleware (auth, ownership, visibility, rate limit)
* DB constraint (parent_id, versioning, retention, ownership)
* Test case QA dan RTM (Requirement Traceability Matrix)

### 5.4 Module D - Voting & Reputation Logic

| FR-ID  | Function Name                           | Requirement Description                                                                                        | Traceability                   | Priority |
| :----- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :----------------------------- | :------- |
| FR-D01 | Validate Voter Eligibility              | The System shall allow voting only if AUTHENTICATED=TRUE, ACCOUNT_STATUS=ACTIVE, and content status=PUBLISHED. | BR-D01, BRL-D01-01, BRL-D01-03 |          |
| FR-D02 | Enforce Vote Type                       | The System shall accept only ENUM vote_type {UPVOTE=+1, DOWNVOTE=-1}.                                          | BR-D01, BRL-D01-02             |          |
| FR-D03 | Prevent Self Voting                     | The System shall reject voting if user_id equals content author_id.                                            | BR-D07, BRL-D07-03             |          |
| FR-D04 | Unique Vote Constraint                  | The System shall enforce UNIQUE(user_id, content_id) in voting table.                                          | BR-D02, BRL-D02-01             |          |
| FR-D05 | Insert or Update Vote                   | The System shall insert vote if not exists or update/delete vote if exists.                                    | BR-D02, BRL-D02-02             |          |
| FR-D06 | Vote Change Window                      | The System shall allow vote update only within 24 hours since initial vote timestamp.                          | BR-D03, BRL-D03-01             |          |
| FR-D07 | Immutable Vote After Window             | The System shall reject vote changes if time elapsed exceeds 24 hours.                                         | BR-D03, BRL-D03-02             |          |
| FR-D08 | Retract Vote                            | The System shall allow user to set vote_type=0 (neutral) within allowed window.                                | BR-D03, BRL-D03-03             |          |
| FR-D09 | Daily Vote Limit                        | The System shall block voting if user reaches 30 votes within rolling 24-hour window.                          | BR-D07, BRL-D07-01, BRL-D07-02 |          |
| FR-D10 | Suspicious Voting Detection             | The System shall flag SUSPICIOUS_ACTIVITY if user performs >10 votes within 60 seconds.                        | BR-D08, BRL-D08-01             |          |
| FR-D11 | Freeze Voting Privilege                 | The System shall freeze voting privilege for 24 hours when suspicious activity is detected.                    | BR-D08, BRL-D08-02             |          |
| FR-D12 | Abuse Severity Logging                  | The System shall record abuse flag with severity {LOW, MEDIUM, HIGH}.                                          | BR-D08, BRL-D08-03             |          |
| FR-D13 | Calculate Content Score                 | The System shall calculate content score as total_upvote minus total_downvote.                                 | BR-D09, BRL-D09-01             |          |
| FR-D14 | Anonymize Voter Identity                | The System shall hide voter identity from public view.                                                         | BR-D09, BRL-D09-02             |          |
| FR-D15 | Reputation Impact Upvote Answer         | The System shall add +10 reputation to answer author for each UPVOTE.                                          | BR-D04, BRL-D04-02             |          |
| FR-D16 | Reputation Impact Upvote Question       | The System shall add +5 reputation to question author for each UPVOTE.                                         | BR-D04, BRL-D04-03             |          |
| FR-D17 | Reputation Impact Downvote Target       | The System shall subtract −2 reputation from content author for each DOWNVOTE.                                 | BR-D04, BRL-D04-04             |          |
| FR-D18 | Reputation Cost Downvote Voter          | The System shall subtract −1 reputation from voter for each DOWNVOTE.                                          | BR-D04, BRL-D04-05             |          |
| FR-D19 | Enforce Reputation Minimum              | The System shall ensure reputation value never falls below 0.                                                  | BR-D04, BRL-D04-06             |          |
| FR-D20 | Real-Time Reputation Update             | The System shall update and display reputation within ≤1 second after voting event.                            | BR-D05, BRL-D05-01             |          |
| FR-D21 | Display Non-Negative Reputation         | The System shall prevent public display of reputation below 0.                                                 | BR-D05, BRL-D05-02             |          |
| FR-D22 | Voting Privilege Threshold              | The System shall allow UPVOTE and DOWNVOTE only if reputation ≥50.                                             | BR-D06, BRL-D06-01             |          |
| FR-D23 | Downvote Threshold                      | The System shall allow DOWNVOTE only if reputation ≥100.                                                       | BR-D06, BRL-D06-02             |          |
| FR-D24 | Expert Validation Threshold             | The System shall allow Expert Validation action only if reputation ≥2000.                                      | BR-D06, BRL-D06-03             |          |
| FR-D25 | Threshold Enforcement                   | The System shall reject action if reputation is below required threshold.                                      | BR-D06, BRL-D06-04             |          |
| FR-D26 | Restrict Voting by Account Status       | The System shall reject voting for users with SUSPENDED or BANNED status.                                      | BR-D11, BRL-D11-01             |          |
| FR-D27 | Restrict New User Downvote              | The System shall reject DOWNVOTE if account age <24 hours.                                                     | BR-D11, BRL-D11-02             |          |
| FR-D28 | Reputation Daily Gain Cap               | The System shall cap reputation gain from voting to +200 per 24 hours.                                         | BR-D13, BRL-D13-01, BRL-D13-02 |          |
| FR-D29 | Reputation Recovery Scheduler           | The System shall add recovery reputation every 24 hours if user gains ≥10 valid upvotes.                       | BR-D13, BRL-D13-03             |          |
| FR-D30 | Reputation Penalty                      | The System shall subtract −50 reputation per valid violation with daily loss cap −100.                         | BR-D12, BRL-D12-01, BRL-D12-02 |          |
| FR-D31 | Reputation History Log                  | The System shall store delta_event (±value, source_type, timestamp) for reputation changes.                    | BR-D14, BRL-D14-01             |          |
| FR-D32 | Reputation History Limit                | The System shall keep maximum 1000 history records per user using FIFO eviction.                               | BR-D14, BRL-D14-02             |          |
| FR-D33 | Voting Audit Log                        | The System shall log {user_id, content_id, vote_type, timestamp, ip_hash} with retention ≥180 days.            | BR-D10, BRL-D10-01, BRL-D10-02 |          |
| FR-D34 | Reputation Recalculation on Vote Update | The System shall rollback previous reputation impact and apply new impact when vote is updated or retracted.   | BR-D04                         |          |
| FR-D35 |                                         | Voting wajib lulus risk scoring.                                                                               |                                |          |
| FR-D36 |                                         | reCAPTCHA v3 pada suspicious behavior.                                                                         |                                |          |

## **System Logic Flow & Constraints**

1. **Voting bukan sekadar insert data** — selalu melalui validasi: auth, status akun, status konten, reputasi, dan anti self-vote.
2. **Vote memiliki lifecycle**: insert → update/retract (≤24 jam) → immutable.
3. **Sistem anti-abuse berlapis**:

   * Limit 30 vote/24 jam
   * Deteksi >10 vote/menit → freeze 24 jam
   * Logging severity abuse
4. **Reputasi dihitung berbasis event (event-driven)**, bukan angka statis.
5. **Reputasi tidak boleh negatif** dan ditampilkan real-time (≤1 detik).
6. **Hak fitur bergantung reputasi** (threshold enforcement sebelum aksi).
7. **Score konten dan reputasi adalah dua entitas berbeda** tetapi dipicu oleh event yang sama.
8. **Perubahan vote harus idempotent** — sistem rollback dampak lama sebelum menerapkan dampak baru.
9. **Auditability sangat ketat** — semua voting dan reputasi memiliki jejak log ≥180 hari.
10. **Daily cap** mencegah lonjakan reputasi yang tidak wajar.
11. **Scheduler pemulihan reputasi** memberi kesempatan rehabilitasi user aktif dan berkualitas.

FR ini siap diturunkan menjadi:

* Voting API & middleware threshold
* Reputation service (event processor)
* Abuse detection service
* Audit & forensic logging
* QA test case dan RTM ke BR/BRL

### 5.5 Module E - Reporting & Community Moderation

| FR-ID  | Function Name                    | Requirement Description                                                                                       | Traceability                   | Priority |
| :----- | :------------------------------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------- | :------- |
| FR-E01 | Validate Reporter Authentication | The System shall allow report creation only if the user is authenticated and account status is ACTIVE.        | BR-E01, BRL-E01-01             | High     |
| FR-E02 | Validate Report Reason Length    | The System shall accept report reason only if length is between 10 and 500 characters.                        | BR-E01, BRL-E01-02             | High     |
| FR-E03 | Enforce Daily Report Limit       | The System shall reject report creation if user has created ≥20 reports within rolling 24 hours.              | BR-E01, BRL-E01-03, BR-E11     | High     |
| FR-E04 | Enforce Category Enum            | The System shall accept report only if category ∈ {SPAM, ABUSE, HATE_SPEECH, MISINFORMATION, OTHER}.          | BR-E02, BRL-E02-01, BRL-E02-02 | High     |
| FR-E05 | Initialize Report Status         | The System shall create report with initial status = OPEN.                                                    | BR-E07, BRL-E07-01             | High     |
| FR-E06 | Assign Default Risk Level        | The System shall assign default risk_level = LOW upon report creation.                                        | BR-E03, BRL-E03-01             | High     |
| FR-E07 | Auto Risk for Hate Speech        | The System shall set risk_level = HIGH if category = HATE_SPEECH.                                             | BR-E03, BRL-E03-02             | High     |
| FR-E08 | Escalate Risk by Volume          | The System shall set risk_level = CRITICAL if >5 reports exist for the same content within 1 hour.            | BR-E03, BRL-E03-03             | High     |
| FR-E09 | Push to Priority Queue           | The System shall insert report into moderation queue sorted by risk_level DESC then timestamp ASC.            | BR-E04, BRL-E04-01             | High     |
| FR-E10 | FIFO for Same Risk               | The System shall apply FIFO ordering for reports with identical risk_level.                                   | BR-E04, BRL-E04-02             | High     |
| FR-E11 | Fetch Open Reports Only          | The System shall allow moderator to fetch only reports with status = OPEN.                                    | BR-E05, BRL-E05-01             | High     |
| FR-E12 | Lock Report for Review           | The System shall lock the report record and change status to IN_REVIEW when assigned to a moderator.          | BR-E05, BR-E07                 | High     |
| FR-E13 | Enforce Single Assignment        | The System shall ensure one report is assigned to exactly one moderator using record locking.                 | BR-E17, BRL-E17-01             | High     |
| FR-E14 | Limit Active Cases per Moderator | The System shall prevent assignment if moderator has ≥50 active cases.                                        | BR-E17, BRL-E17-02             | High     |
| FR-E15 | Moderator Action Enum            | The System shall allow moderator action only ∈ {IGNORE, WARNING, DELETE, BAN}.                                | BR-E05, BRL-E05-02             | High     |
| FR-E16 | Soft Delete Content              | The System shall set content.deleted = TRUE if action = DELETE.                                               | BR-E06, BRL-E06-01             | High     |
| FR-E17 | Suspend or Ban Account           | The System shall set account status = SUSPENDED or PERMANENT if action = BAN.                                 | BR-E06, BRL-E06-02             | High     |
| FR-E18 | Resolve Report Status            | The System shall update report status to RESOLVED after valid moderation action.                              | BR-E07, BRL-E07-02             | High     |
| FR-E19 | Reject Invalid Report            | The System shall update report status to REJECTED if moderator selects IGNORE.                                | BR-E07                         | Medium   |
| FR-E20 | Moderation Audit Log             | The System shall log {moderator_id, action, reason, timestamp} for each moderation event.                     | BR-E08, BRL-E08-01             | High     |
| FR-E21 | Log Retention Policy             | The System shall retain moderation logs for minimum 1 year.                                                   | BR-E08, BRL-E08-02             | High     |
| FR-E22 | Notify Reporter                  | The System shall send notification to reporter within ≤5 minutes after report resolution.                     | BR-E09, BRL-E09-01             | High     |
| FR-E23 | Notification Content             | The System shall include moderation result and action summary in notification.                                | BR-E09, BRL-E09-02             | High     |
| FR-E24 | Auto Escalation Critical         | The System shall auto-assign reports with risk = CRITICAL to senior moderator.                                | BR-E10, BRL-E10-01             | High     |
| FR-E25 | Escalation SLA                   | The System shall enforce escalation resolution within ≤24 hours.                                              | BR-E10, BRL-E10-02             | High     |
| FR-E26 | Prevent Reporting Abuse          | The System shall restrict reporting if user has >3 rejected reports within 24 hours.                          | BR-E11, BRL-E11-01             | High     |
| FR-E27 | False Report Penalty             | The System shall subtract −20 reputation for confirmed false reporting.                                       | BR-E11, BRL-E11-02             | High     |
| FR-E28 | Store Violation History          | The System shall store violation type and timestamp for moderated users.                                      | BR-E12, BRL-E12-01             | High     |
| FR-E29 | Violation History Limit          | The System shall store maximum 100 violation records per user using FIFO eviction.                            | BR-E12, BRL-E12-02             | Medium   |
| FR-E30 | Progressive Discipline           | The System shall apply WARNING, TEMP BAN (24h), PERM BAN based on 1st, 2nd, 3rd violation in rolling 90 days. | BR-E13, BRL-E13-01, BRL-E13-02 | High     |
| FR-E31 | Accept Appeal Request            | The System shall accept appeal only if submitted ≤7 days after moderation decision.                           | BR-E14, BRL-E14-01             | High     |
| FR-E32 | Single Appeal Constraint         | The System shall reject appeal if an appeal already exists for the case.                                      | BR-E14, BRL-E14-02             | High     |
| FR-E33 | Assign Appeal Reviewer           | The System shall assign appeal to a different moderator than original reviewer.                               | BR-E15, BRL-E15-01             | High     |
| FR-E34 | Final Appeal Decision            | The System shall mark appeal decision as FINAL and immutable.                                                 | BR-E15, BRL-E15-02             | High     |
| FR-E35 | Calculate Moderation KPI         | The System shall calculate avg response time and resolution rate for moderators.                              | BR-E16, BRL-E16-01             | Medium   |
| FR-E36 | Enforce Response SLA             | The System shall trigger alert if first response time exceeds 2 hours.                                        | BR-E16, BRL-E16-02             | Medium   |
| FR-E37 | Auto Case Assignment             | The System shall automatically assign incoming reports to moderators with available capacity.                 | BR-E17                         | High     |
| FR-E38 | Generate Moderation Analytics    | The System shall aggregate case volume, violation types, and SLA metrics.                                     | BR-E18, BRL-E18-01             | Medium   |
| FR-E39 | Daily Analytics Scheduler        | The System shall update moderation analytics every 24 hours.                                                  | BR-E18, BRL-E18-02             | Medium   |
| FR-E40 | AI Pre-Moderation Analysis       | The System shall invoke AI service to analyze reported content before moderator review.                       | BR-E03 (extended), FR Draft    | Medium   |
| FR-E41 | Display AI Risk Recommendation   | The System shall display AI-derived risk recommendation in moderation queue.                                  | BR-E03 (extended), FR Draft    | Medium   |
| FR-E42 | Store AI Metadata                | The System shall store AI analysis result as report metadata for audit.                                       | BR-E08 (extended), FR Draft    | Medium   |
| FR-E43 |                                  | Blind Moderation (tanpa metadata user)                                                                        |                                |          |
| FR-E44 |                                  | Ombudsman role untuk banding                                                                                  |                                |          |

## **System Logic Flow & Constraints**

1. **Report bukan langsung masuk ke moderator**, tetapi melalui validasi berlapis: autentikasi, panjang alasan, kategori enum, dan limit harian.
2. **Risk engine berjalan otomatis saat report dibuat**:

   * Default LOW
   * HATE_SPEECH → HIGH
   * > 5 laporan/1 jam/konten → CRITICAL
3. **Moderation queue adalah priority queue**, bukan FIFO biasa.
4. **Race condition dicegah** dengan record locking saat moderator mengambil kasus.
5. **Satu laporan = satu moderator** dengan batas 50 kasus aktif.
6. **State machine ketat**: OPEN → IN_REVIEW → RESOLVED/REJECTED (tidak boleh lompat status).
7. **Tindakan DELETE dan BAN memicu efek ke modul lain** (visibility konten & status akun).
8. **Abuse reporting dilindungi**: false reporter dibatasi & kena penalti reputasi.
9. **Violation history menjadi dasar progressive discipline** (rolling 90 hari).
10. **Banding bersifat ketat**: 1 kali, ≤7 hari, reviewer berbeda, keputusan final.
11. **SLA operasional dimonitor otomatis** dengan alert jika melewati 2 jam.
12. **AI hanya memberi rekomendasi**, keputusan tetap pada moderator (human-in-the-loop).
13. **Auditability tinggi**: semua aksi tercatat ≥1 tahun, termasuk metadata AI.
14. **Analytics dan KPI bukan real-time**, tetapi di-refresh terjadwal 24 jam.

### 5.6 Module F - AI-Powered Services

| FR-ID  | Function Name                       | Requirement Description                                                                                       | Traceability          | Priority |
| :----- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------ | :-------------------- | :------- |
| FR-F01 | Accept Content for AI Analysis      | The System shall accept text content ≤20,000 characters for AI moderation analysis.                           | BR-F01                | High     |
| FR-F02 | Preprocess Content                  | The System shall preprocess content using PII masking and normalization before AI inference.                  | BR-F20, BR-F01        | High     |
| FR-F03 | Invoke AI Inference                 | The System shall send preprocessed content to AI service and receive toxicity_score as FLOAT (0.0–1.0).       | BR-F01, BRL-F21-01    | High     |
| FR-F04 | Classify SAFE Content               | The System shall classify content as SAFE and set status=PUBLISHED if score <0.30.                            | BR-F02, BRL-F21-02    | High     |
| FR-F05 | Classify WARNING Content            | The System shall classify content as WARNING and keep status=PUBLISHED with low-risk flag if 0.30≤score<0.60. | BR-F02, BRL-F21-03    | High     |
| FR-F06 | Route to Manual Review              | The System shall move content to MANUAL_REVIEW_QUEUE and set status=PENDING_REVIEW if 0.60≤score<0.85.        | BR-F02, BRL-F21-04    | High     |
| FR-F07 | Auto Hide High Toxic Content        | The System shall set status=HIDDEN if score ≥0.85.                                                            | BR-F02, BRL-F21-05    | High     |
| FR-F08 | Auto Block Extreme Content          | The System shall AUTO-BLOCK content and create VIOLATION_RECORD if score ≥0.95.                               | BR-F04, BRL-F21-06    | High     |
| FR-F09 | Send Auto Warning                   | The System shall send AUTO-WARNING to user if score ≥0.70 (max 1 per content).                                | BR-F04, BRL-F22-01    | High     |
| FR-F10 | Limit Auto Warning Spam             | The System shall prevent sending AUTO-WARNING more than 3 times within 24 hours.                              | BR-F04, BRL-F22-02    | Medium   |
| FR-F11 | Flag High Risk User                 | The System shall set HIGH_RISK_USER=TRUE if AUTO-WARNING count ≥3 within 24 hours.                            | BR-F03, BRL-F22-03    | High     |
| FR-F12 | Detect Repeat Offense               | The System shall set REPEAT_OFFENSE=TRUE if user commits ≥3 violations (score ≥0.70) within 24 hours.         | BR-F03, BRL-F23-01    | High     |
| FR-F13 | Auto Hide Repeat Offender Content   | The System shall AUTO-HIDE all new content from repeat offender for 24 hours.                                 | BR-F03, BRL-F23-02    | High     |
| FR-F14 | Escalate Repeat Offense             | The System shall escalate case to moderator with HIGH priority if repeat offense occurs ≥2 times in 7 days.   | BR-F03, BRL-F23-03    | High     |
| FR-F15 | Enforce Manual Review SLA           | The System shall ensure content in MANUAL_REVIEW_QUEUE is processed within ≤12 hours.                         | BR-F04, BRL-F24-01    | High     |
| FR-F16 | Prioritize Review Queue             | The System shall prioritize manual review by score proximity to 0.85.                                         | BR-F04, BRL-F24-02    | Medium   |
| FR-F17 | Fallback Auto Hide on Timeout       | The System shall set status=HIDDEN if manual review exceeds 12 hours.                                         | BR-F04, BRL-F24-03    | High     |
| FR-F18 | Store Moderation Metadata           | The System shall store {toxicity_score, category, action_taken, timestamp}.                                   | BR-F05, BRL-F25-01    | High     |
| FR-F19 | Ensure Idempotent Moderation        | The System shall prevent duplicate moderation actions for the same content event.                             | BR-F05, BRL-F25-02    | High     |
| FR-F20 | Enforce Chatbot Rate Limit Hourly   | The System shall limit chatbot usage to ≤20 requests per user per 60 minutes.                                 | BR-F06, BRL-F26-01    | High     |
| FR-F21 | Reject Excess Hourly Requests       | The System shall return HTTP 429 if hourly limit exceeded.                                                    | BR-F16, BRL-F26-02    | High     |
| FR-F22 | Enforce Burst Limit                 | The System shall limit chatbot usage to ≤5 requests per 60 seconds.                                           | BR-F16, BRL-F26-03    | High     |
| FR-F23 | Apply Cooldown                      | The System shall block chatbot access for 60 seconds if burst exceeded.                                       | BR-F16, BRL-F26-04    | High     |
| FR-F24 | Enforce Daily Cap                   | The System shall disable chatbot access if user reaches ≥100 requests in 24 hours.                            | BR-F16, BRL-F26-05,06 | High     |
| FR-F25 | Enforce Chatbot Timeout             | The System shall enforce chatbot response timeout ≤5 seconds.                                                 | BR-F10, BRL-F27-01    | High     |
| FR-F26 | Trigger Fallback Response           | The System shall trigger rule-based fallback if timeout or AI error occurs.                                   | BR-F11, BRL-F27-02    | High     |
| FR-F27 | Fallback SLA                        | The System shall return fallback response within ≤1 second.                                                   | BR-F12, BRL-F27-03    | High     |
| FR-F28 | Log Chatbot Activity                | The System shall log {user_id, request_count, timestamp, latency}.                                            | BR-F13, BRL-F28-01    | Medium   |
| FR-F29 | Retain Chatbot Logs                 | The System shall retain chatbot logs for ≥180 days.                                                           | BR-F13, BRL-F28-02    | Medium   |
| FR-F30 | Apply Token Bucket Throttling       | The System shall apply token bucket algorithm for chatbot throttling.                                         | BR-F16, BRL-F29-01    | High     |
| FR-F31 | Priority Bypass for High Reputation | The System shall increase chatbot limit by +20% for users with reputation ≥1000.                              | BR-F06, BRL-F29-02    | Low      |
| FR-F32 | Provide Explainable AI Output       | The System shall provide explanation ≤500 characters with confidence score.                                   | BR-F14                | Medium   |
| FR-F33 | AI Performance Monitoring           | The System shall monitor latency, error_rate, and accuracy of AI services.                                    | BR-F10                | Medium   |
| FR-F34 | Trigger AI Failure Alert            | The System shall trigger alert if error_rate >5% within 5 minutes.                                            | BR-F11                | Medium   |
| FR-F35 | Support Model Versioning            | The System shall support semantic versioning for AI model updates without downtime.                           | BR-F15                | Low      |
| FR-F36 | Provide AI Integration API          | The System shall expose standardized AI API with auth validation and timeout ≤5 seconds.                      | BR-F18                | High     |
| FR-F37 | Manage Knowledge Base               | The System shall update AI knowledge base weekly after validation.                                            | BR-F19                | Low      |
| FR-F38 | Enforce Responsible AI              | The System shall filter biased/harmful output before returning AI response.                                   | BR-F20                | High     |
| FR-F39 |                                     | AI output → audit log (Persona domain only).                                                                  |                       |          |
| FR-F40 |                                     | Shadowban → tetap bisa appeal.                                                                                |                       |          |

## **System Logic Flow & Constraints**

1. **AI moderation berjalan sebelum konten dipublikasikan** (pre-publish gate).
2. **Toxicity score adalah pusat keputusan** dengan threshold kuantitatif yang kaku.
3. **Auto-warning, repeat offense, dan escalation** membentuk lapisan pencegahan berjenjang.
4. **Manual review memiliki SLA ketat (12 jam)** dengan fallback auto-hide bila terlewati.
5. **Semua aksi moderasi harus idempotent** untuk mencegah double trigger.
6. **Chatbot dilindungi 3 lapis pembatasan**: burst, hourly, dan daily cap dengan token bucket.
7. **SLA chatbot keras (5 detik)**, jika gagal langsung fallback ≤1 detik.
8. **AI bukan single point of failure** — selalu ada rule-based fallback.
9. **Auditability tinggi**: logging ≥180 hari + metadata moderasi lengkap.
10. **Model AI dapat diperbarui tanpa downtime** melalui versioning.
11. **Responsible AI enforcement** dilakukan sebelum output diberikan ke user.
12. **Integrasi lintas modul**: hasil AI langsung memicu alur di Module E (Moderation) dan Module D (Reputation).

### 5.7 Module G - Notification System

| FR-ID  | Function Name                       | Requirement Description                                                                            | Traceability                   | Priority |
| :----- | :---------------------------------- | :------------------------------------------------------------------------------------------------- | :----------------------------- | :------- |
| FR-G01 | Capture System Event                | The System shall capture system events {CREATE, UPDATE, DELETE, ACTION} as notification triggers.  | BR-G01, BRL-G01-01             | High     |
| FR-G02 | Generate Notification Object        | The System shall generate a notification object ≤1 second after the triggering event.              | BR-G01, BRL-G01-02             | High     |
| FR-G03 | Validate Payload Size               | The System shall ensure notification payload size ≤2,000 characters.                               | BR-G01, BRL-G01-03             | High     |
| FR-G04 | Assign Notification Type            | The System shall assign notification type {INFO, WARNING, ALERT, SYSTEM} and mandatory context_id. | BR-G03, BRL-G03-01,02          | High     |
| FR-G05 | Determine Priority                  | The System shall assign priority {LOW, MEDIUM, HIGH, CRITICAL} to each notification.               | BR-G09, BRL-G09-01             | High     |
| FR-G06 | Bypass Batching for Critical        | The System shall dispatch notifications immediately if priority=CRITICAL.                          | BR-G09, BRL-G09-02             | High     |
| FR-G07 | Apply Relevance Filtering           | The System shall compute relevance_score and skip delivery if score <0.5.                          | BR-G14, BRL-G14-01,02          | High     |
| FR-G08 | Manage User Preferences             | The System shall allow users to enable/disable channels per notification type.                     | BR-G04, BRL-G04-01             | High     |
| FR-G09 | Default Preference State            | The System shall set all channels active by default unless disabled by user.                       | BR-G04, BRL-G04-02             | Medium   |
| FR-G10 | Validate Opt-Out                    | The System shall not dispatch notifications if user_opt_out=true.                                  | BR-G05, BRL-G05-01             | High     |
| FR-G11 | Validate Preference Before Dispatch | The System shall validate user preferences before dispatching notifications.                       | BR-G05, BRL-G05-02             | High     |
| FR-G12 | Support Multi-Channel Dispatch      | The System shall dispatch notifications via {IN_APP, EMAIL, PUSH}.                                 | BR-G02, BRL-G02-01             | High     |
| FR-G13 | Validate Email Format               | The System shall validate EMAIL notifications using RFC 5322 format.                               | BR-G02, BRL-G02-02             | Medium   |
| FR-G14 | Enforce Channel Timeout             | The System shall enforce delivery timeout ≤5 seconds per channel.                                  | BR-G02, BRL-G02-03             | High     |
| FR-G15 | Group Notifications                 | The System shall group notifications by context_id and event_type with max 10 items per group.     | BR-G06, BRL-G06-01,02          | Medium   |
| FR-G16 | Store Notification History          | The System shall store notification history for ≥30 days.                                          | BR-G07, BRL-G07-01             | High     |
| FR-G17 | Paginate Notification History       | The System shall paginate notification history with 20 items per page.                             | BR-G07, BRL-G07-02             | Low      |
| FR-G18 | Track Notification Status           | The System shall mark notification status as {UNREAD, READ}.                                       | BR-G08, BRL-G08-01             | High     |
| FR-G19 | Update Status on Open               | The System shall change notification status to READ when opened by user.                           | BR-G08, BRL-G08-02             | High     |
| FR-G20 | Enforce Daily Rate Limit            | The System shall limit notifications to ≤50 per user per day.                                      | BR-G10, BRL-G10-01             | High     |
| FR-G21 | Enforce Burst Limit                 | The System shall limit notifications to ≤5 per user per minute.                                    | BR-G10, BRL-G10-02             | High     |
| FR-G22 | Monitor Delivery Success Rate       | The System shall ensure notification delivery success rate ≥99%.                                   | BR-G11, BRL-G11-01             | Medium   |
| FR-G23 | Retry Failed Delivery               | The System shall retry FAILED notifications ≤3 times using exponential backoff.                    | BR-G11, BRL-G11-02, BRL-G13-01 | High     |
| FR-G24 | Stop Retry on Success               | The System shall stop retry attempts when delivery status=SUCCESS.                                 | BR-G13, BRL-G13-02             | High     |
| FR-G25 | Log Notification Activity           | The System shall log {user_id, channel, status, timestamp}.                                        | BR-G12, BRL-G12-01             | High     |
| FR-G26 | Retain Notification Logs            | The System shall retain notification logs for ≥90 days.                                            | BR-G12, BRL-G12-02             | Medium   |
| FR-G27 |                                     | Detail konten hanya via authenticated session.                                                     |                                |          |

## **System Logic Flow & Constraints**

1. **Event-Driven Architecture** — Notifikasi hanya dibuat dari event sistem yang valid.
2. **Near Real-Time Guarantee** — Object notifikasi wajib dibuat ≤1 detik setelah event.
3. **Relevance & Preference First** — Sebelum dikirim, sistem menghitung *relevance_score* dan memvalidasi preferensi user.
4. **Priority-Aware Dispatch** — Notifikasi CRITICAL melewati batching dan langsung dikirim.
5. **Multi-Channel dengan SLA** — Setiap channel memiliki timeout keras 5 detik.
6. **Anti-Spam Protection** — Rate limit harian dan burst mencegah notifikasi berlebihan.
7. **Grouping untuk Keterbacaan** — Notifikasi dengan konteks sama digabung (maks 10).
8. **Reliability Loop** — Jika gagal, retry otomatis ≤3 kali dengan exponential backoff.
9. **Observability & Audit** — Seluruh aktivitas dicatat ≥90 hari.
10. **User Awareness** — Status READ/UNREAD dikelola otomatis berdasarkan interaksi user.
11. **Hard Stop Conditions** — Jika user opt-out atau relevance <0.5 → notifikasi tidak pernah dikirim.
12. **Scalable Design** — Siap diimplementasikan dengan message queue (Kafka/RabbitMQ) + worker dispatcher.

### 5.8 Module H - Search & Discovery

| FR-ID  | Function Name                   | Requirement Description                                                                        | Traceability          | Priority |
| :----- | :------------------------------ | :--------------------------------------------------------------------------------------------- | :-------------------- | :------- |
| FR-H01 | Validate Query Length           | The System shall accept search queries with length between 3 and 100 characters.               | BR-H01, BRL-H01-01    | High     |
| FR-H02 | Sanitize Query Input            | The System shall sanitize query input according to OWASP standards to prevent injection.       | BR-H01, BRL-H01-03    | High     |
| FR-H03 | Parse Boolean Operators         | The System shall support AND, OR, NOT operators in search queries.                             | BR-H01, BRL-H01-02    | Medium   |
| FR-H04 | Normalize Query                 | The System shall normalize query using lowercase transformation and stemming before execution. | BR-H01                | Medium   |
| FR-H05 | Compute Relevance Score         | The System shall compute relevance using BM25/TF-IDF or AI ranking algorithm.                  | BR-H02, BRL-H02-01    | High     |
| FR-H06 | Filter Low Score Results        | The System shall exclude results with relevance score <0.2 from display.                       | BR-H02, BRL-H02-02    | High     |
| FR-H07 | Apply Search Filters            | The System shall allow filters {category, date, popularity, status}.                           | BR-H03, BRL-H03-01    | High     |
| FR-H08 | Limit Active Filters            | The System shall limit active filters to a maximum of 5 per query.                             | BR-H03, BRL-H03-02    | Medium   |
| FR-H09 | Apply Sorting Options           | The System shall support sorting {relevance, newest, oldest, most_viewed, most_voted}.         | BR-H04, BRL-H04-01    | High     |
| FR-H10 | Default Sorting                 | The System shall apply relevance as default sorting.                                           | BR-H04, BRL-H04-02    | Medium   |
| FR-H11 | Provide Autocomplete            | The System shall show autocomplete suggestions after ≥2 characters typed.                      | BR-H05, BRL-H05-01    | Medium   |
| FR-H12 | Limit Autocomplete Results      | The System shall limit autocomplete suggestions to 10 items.                                   | BR-H05, BRL-H05-02    | Low      |
| FR-H13 | Generate Result Preview         | The System shall generate content preview ≤200 characters.                                     | BR-H06, BRL-H06-01    | High     |
| FR-H14 | Highlight Keywords              | The System shall highlight matched keywords in the preview snippet.                            | BR-H06, BRL-H06-02    | Medium   |
| FR-H15 | Store Search History            | The System shall store up to 50 recent queries per user.                                       | BR-H07, BRL-H07-01    | Medium   |
| FR-H16 | Enforce History Retention       | The System shall retain search history for 30 days.                                            | BR-H07, BRL-H07-02    | Low      |
| FR-H17 | Generate Recommendations        | The System shall recommend content using similarity ≥70% or collaborative filtering.           | BR-H08, BRL-H08-01    | High     |
| FR-H18 | Limit Recommendation Items      | The System shall limit recommendations to 10 items.                                            | BR-H08, BRL-H08-02    | Low      |
| FR-H19 | Identify Trending Content       | The System shall identify trending content with view ≥100 or vote ≥10 within 7 days.           | BR-H09, BRL-H09-01    | High     |
| FR-H20 | Identify Fresh Content          | The System shall identify fresh content created within the last 7 days.                        | BR-H10, BRL-H10-01    | Medium   |
| FR-H21 | Enforce Content Categorization  | The System shall ensure each content has at least 1 and at most 3 categories.                  | BR-H11, BRL-H11-01,02 | High     |
| FR-H22 | Generate Related Content        | The System shall display up to 5 related contents with similarity score ≥0.6.                  | BR-H12, BRL-H12-01,02 | Medium   |
| FR-H23 | Enforce Search SLA              | The System shall return search results within ≤2 seconds.                                      | BR-H13, BRL-H13-01    | High     |
| FR-H24 | Enforce Query Timeout           | The System shall terminate search query if execution exceeds 5 seconds.                        | BR-H13, BRL-H13-02    | High     |
| FR-H25 | Log Search Activity             | The System shall log {query, user_id, timestamp, result_count}.                                | BR-H14, BRL-H14-01    | Medium   |
| FR-H26 | Retain Search Logs              | The System shall retain search logs for ≥90 days.                                              | BR-H14, BRL-H14-02    | Low      |
| FR-H27 | Personalize Ranking             | The System shall adjust ranking using ≥10 recent user interaction history.                     | BR-H15, BRL-H15-01    | High     |
| FR-H28 | Fallback Default Ranking        | The System shall use default ranking if user history is unavailable.                           | BR-H15, BRL-H15-02    | Medium   |
| FR-H29 | Provide Discovery Entry Points  | The System shall provide discovery paths {search, category, recommendation, trending}.         | BR-H16, BRL-H16-01    | High     |
| FR-H30 | Enforce Discovery Accessibility | The System shall make discovery paths accessible within ≤2 clicks from homepage.               | BR-H16, BRL-H16-02    | Medium   |

## **System Logic Flow & Constraints**

1. **Query Gatekeeping** — Panjang query, sanitasi OWASP, dan parsing operator terjadi sebelum eksekusi.
2. **Ranking First Principle** — Semua hasil dihitung skor relevansi, dan skor <0.2 tidak pernah tampil.
3. **Filter & Sort Layer** — Filter maksimal 5, sorting default relevance.
4. **Preview Optimization** — Snippet ≤200 karakter dengan highlight untuk mempercepat scanning.
5. **Performance Hard SLA** — Respon ≤2 detik, hard timeout 5 detik untuk mencegah resource lock.
6. **Personalization Conditional** — Personalisasi hanya aktif jika histori ≥10 interaksi.
7. **Discovery Beyond Search** — Rekomendasi, trending, fresh, kategori adalah jalur discovery alternatif.
8. **Data Governance** — Log pencarian ≥90 hari, histori user ≤50 query selama 30 hari.
9. **Category Integrity** — Setiap konten wajib memiliki 1–3 kategori agar discovery konsisten.
10. **Fail-Safe** — Jika personalisasi gagal atau histori kosong, sistem kembali ke ranking default.

### 5.9 Module I - Analytics & Business Reporting

| FR-ID  | Function Name                  | Requirement Description                                                                            | Traceability                           | Priority |
| :----- | :----------------------------- | :------------------------------------------------------------------------------------------------- | :------------------------------------- | :------- |
| FR-I01 | Ingest Event Stream            | The System shall ingest events from Modules A–H using event streaming with JSON schema validation. | BR-I01, BRL-I01-01,03                  | High     |
| FR-I02 | Enforce Ingestion Latency      | The System shall ensure event ingestion latency ≤5 seconds from publish time.                      | BR-I01, BRL-I01-02                     | High     |
| FR-I03 | Store Raw Events               | The System shall store ingested raw events in an event store for downstream processing.            | BR-I01                                 | Medium   |
| FR-I04 | Compute Core Metrics           | The System shall compute DAU, MAU, retention_rate, and engagement_rate.                            | BR-I02, BRL-I02-01                     | High     |
| FR-I05 | Support Aggregation Windows    | The System shall perform aggregation in real-time (<1 minute) and daily batch windows.             | BR-I02, BRL-I02-02                     | High     |
| FR-I06 | Generate Metric Visualizations | The System shall render metrics into line, bar, and pie charts.                                    | BR-I03, BRL-I03-01                     | Medium   |
| FR-I07 | Auto Refresh Dashboard         | The System shall refresh dashboard data every ≤60 seconds.                                         | BR-I03, BRL-I03-02                     | Medium   |
| FR-I08 | Validate Dashboard Access      | The System shall allow dashboard access only for roles ADMIN and ANALYST using RBAC.               | BR-I04, BR-I11, BRL-I04-01, BRL-I11-01 | High     |
| FR-I09 | Limit Dashboard Widgets        | The System shall limit each dashboard to a maximum of 20 widgets.                                  | BR-I04, BRL-I04-02                     | Low      |
| FR-I10 | Generate Scheduled Reports     | The System shall generate automated reports on daily, weekly, and monthly schedules.               | BR-I05, BRL-I05-01                     | High     |
| FR-I11 | Support Report Formats         | The System shall generate reports in PDF and CSV formats.                                          | BR-I05, BRL-I05-02                     | Medium   |
| FR-I12 | Build Custom Reports           | The System shall allow custom reports filtered by date, user, and content.                         | BR-I06, BRL-I06-01                     | High     |
| FR-I13 | Limit Custom Report Filters    | The System shall limit custom report filters to a maximum of 5.                                    | BR-I06, BRL-I06-02                     | Medium   |
| FR-I14 | Perform Trend Analysis         | The System shall compute trends using historical data of at least 7 days.                          | BR-I07, BRL-I07-01                     | Medium   |
| FR-I15 | Apply Moving Average           | The System shall calculate trend using moving average method.                                      | BR-I07, BRL-I07-02                     | Low      |
| FR-I16 | Analyze User Activity          | The System shall analyze user activity based on login, post, and vote events.                      | BR-I08, BRL-I08-01                     | High     |
| FR-I17 | Anonymize User Data            | The System shall mask user_id for aggregated analytics.                                            | BR-I08, BRL-I08-02                     | High     |
| FR-I18 | Analyze Content Metrics        | The System shall compute view_count, vote_count, and comment_count per content.                    | BR-I09, BRL-I09-01                     | High     |
| FR-I19 | Compute Engagement Rate        | The System shall compute engagement_rate = interactions / views.                                   | BR-I09, BRL-I09-02                     | High     |
| FR-I20 | Detect Metric Anomalies        | The System shall trigger alerts if any metric drops ≥30% within 24 hours.                          | BR-I10, BRL-I10-01                     | High     |
| FR-I21 | Send Alert Notification        | The System shall send anomaly alerts to ADMIN via system notification.                             | BR-I10, BRL-I10-02                     | High     |
| FR-I22 | Enforce JWT Authentication     | The System shall validate analytics access using a valid JWT token.                                | BR-I11, BRL-I11-02                     | High     |
| FR-I23 | Perform Data Consistency Check | The System shall run data consistency checks every 24 hours.                                       | BR-I12, BRL-I12-01                     | Medium   |
| FR-I24 | Enforce Error Tolerance        | The System shall ensure data error tolerance ≤1% during validation.                                | BR-I12, BRL-I12-02                     | Medium   |
| FR-I25 | Store Historical Data          | The System shall retain analytics data for at least 1 year.                                        | BR-I13, BRL-I13-01                     | High     |
| FR-I26 | Archive Old Data               | The System shall archive analytics data older than 1 year to cold storage.                         | BR-I13, BRL-I13-02                     | Low      |
| FR-I27 | Export Analytics Reports       | The System shall allow report export up to 100,000 rows per request.                               | BR-I14, BRL-I14-01                     | Medium   |
| FR-I28 | Expire Export Files            | The System shall expire exported report files after 24 hours.                                      | BR-I14, BRL-I14-02                     | Low      |
| FR-I29 | Generate Automated Insights    | The System shall generate insights if metric changes ≥20%.                                         | BR-I15, BRL-I15-01                     | Medium   |
| FR-I30 | Limit Insight Length           | The System shall limit generated insights to 500 characters.                                       | BR-I15, BRL-I15-02                     | Low      |
| FR-I31 | Evaluate Policy Effectiveness  | The System shall evaluate policy effectiveness using ≥30 days data.                                | BR-I16, BRL-I16-01                     | Medium   |
| FR-I32 | Compare With Baseline          | The System shall compare metrics against baseline before policy implementation.                    | BR-I16, BRL-I16-02                     | Medium   |
| FR-I33 |                                | Data warehouse anonymization layer                                                                 |                                        |          |

## **System Logic Flow & Constraints**

1. **Event-First Architecture** — Semua analitik berasal dari event modul A–H dengan validasi JSON schema dan SLA ingestion ≤5 detik.
2. **Dual Aggregation Mode** — Sistem mengolah metrik secara real-time (<1 menit) dan batch harian.
3. **Secure Analytics Access** — Dashboard hanya bisa diakses ADMIN/ANALYST melalui JWT + RBAC.
4. **Visualization as Read Layer** — Data divisualisasikan (line, bar, pie) dan auto-refresh tiap ≤60 detik.
5. **Reporting Engine** — Laporan otomatis (periodik) dan kustom (maks 5 filter) tersedia dalam PDF/CSV.
6. **Anonymized Behavior Analytics** — Aktivitas user dianalisis secara agregat dengan masking user_id.
7. **Anomaly & Insight Engine** — Penurunan ≥30% memicu alert; perubahan ≥20% memicu insight otomatis.
8. **Data Governance** — Validasi konsistensi harian (error ≤1%), retensi data ≥1 tahun, arsip cold storage.
9. **Export Guardrail** — Ekspor dibatasi 100.000 baris dan link kedaluwarsa 24 jam.
10. **Policy Evaluation Loop** — Evaluasi kebijakan berbasis perbandingan baseline vs current minimal 30 hari.

### 5.10 Module J - System Safety & Security Standards

| FR-ID  | Function Name                      | Requirement Description                                                                      | Traceability          | Priority |
| :----- | :--------------------------------- | :------------------------------------------------------------------------------------------- | :-------------------- | :------- |
| FR-J01 | Enforce TLS Communication          | The System shall enforce HTTPS using TLS 1.3 for all client-server communications.           | BR-J01, BRL-J01-01    | High     |
| FR-J02 | Enforce Strong Cipher Suite        | The System shall use a minimum cipher suite of AES-256-GCM for encrypted communication.      | BR-J01, BRL-J01-02    | High     |
| FR-J03 | Validate SSL Certificate           | The System shall validate SSL certificates and renew them before expiry.                     | BR-J01, BRL-J01-03    | Medium   |
| FR-J04 | Hash Password Securely             | The System shall hash user passwords using bcrypt with cost factor ≥12.                      | BR-J02, BRL-J02-01    | High     |
| FR-J05 | Support Optional MFA               | The System shall validate a 6-digit OTP with expiry ≤5 minutes when MFA is enabled.          | BR-J02, BRL-J02-02    | Medium   |
| FR-J06 | Issue JWT Token                    | The System shall issue JWT authentication tokens with expiry ≤1 hour after successful login. | BR-J02, BRL-J02-03    | High     |
| FR-J07 | Enforce RBAC Authorization         | The System shall authorize API access using RBAC roles USER, MODERATOR, ADMIN.               | BR-J03, BRL-J03-01,02 | High     |
| FR-J08 | Reject Invalid Role                | The System shall deny access if the user role is not valid.                                  | BR-J03, BRL-J03-03    | High     |
| FR-J09 | Enforce Session Timeout            | The System shall terminate sessions after 30 minutes of inactivity.                          | BR-J04, BRL-J04-01    | Medium   |
| FR-J10 | Limit Active Sessions              | The System shall limit active sessions to a maximum of 5 per user.                           | BR-J04, BRL-J04-02    | Medium   |
| FR-J11 | Invalidate Session on Logout       | The System shall invalidate user session tokens immediately after logout.                    | BR-J04, BRL-J04-03    | High     |
| FR-J12 | Encrypt Sensitive Data at Rest     | The System shall encrypt sensitive data using AES-256 when stored.                           | BR-J05, BRL-J05-01    | High     |
| FR-J13 | Mask Sensitive Fields              | The System shall mask sensitive fields (email, phone) when displayed.                        | BR-J05, BRL-J05-02    | Medium   |
| FR-J14 | Generate Data Checksum             | The System shall generate SHA-256 checksum when writing data.                                | BR-J06, BRL-J06-01    | Medium   |
| FR-J15 | Validate Data Integrity            | The System shall flag data as corrupt if checksum mismatch occurs.                           | BR-J06, BRL-J06-02    | Medium   |
| FR-J16 | Detect Failed Login Pattern        | The System shall detect ≥5 failed login attempts within 5 minutes.                           | BR-J07, BRL-J07-01    | High     |
| FR-J17 | Detect IP Anomaly                  | The System shall trigger an alert if login IP changes within ≤10 minutes.                    | BR-J07, BRL-J07-02    | Medium   |
| FR-J18 | Record Security Audit Logs         | The System shall log user_id, action, timestamp, and IP address for security events.         | BR-J08, BRL-J08-01    | High     |
| FR-J19 | Retain Security Logs               | The System shall retain security logs for at least 180 days.                                 | BR-J08, BRL-J08-02    | Medium   |
| FR-J20 | Meet Recovery Time Objective       | The System shall restore service within ≤1 hour after disruption.                            | BR-J09, BRL-J09-01    | High     |
| FR-J21 | Meet Recovery Point Objective      | The System shall ensure data loss ≤15 minutes during recovery.                               | BR-J09, BRL-J09-02    | High     |
| FR-J22 | Maintain High Availability         | The System shall maintain uptime ≥99.9%.                                                     | BR-J10, BRL-J10-01    | High     |
| FR-J23 | Perform Health Checks              | The System shall perform system health checks every 30 seconds.                              | BR-J10, BRL-J10-02    | Medium   |
| FR-J24 | Lock Account After Failed Attempts | The System shall lock user accounts after 5 failed login attempts.                           | BR-J11, BRL-J11-01    | High     |
| FR-J25 | Enforce Lockout Duration           | The System shall enforce account lockout for 15 minutes.                                     | BR-J11, BRL-J11-02    | High     |
| FR-J26 | Protect Against OWASP Top 10       | The System shall implement protections against OWASP Top 10 vulnerabilities.                 | BR-J12, BRL-J12-01    | High     |
| FR-J27 | Validate All User Inputs           | The System shall sanitize and validate all user inputs.                                      | BR-J12, BRL-J12-02    | High     |
| FR-J28 | Perform Daily Backup               | The System shall perform automated backups every 24 hours.                                   | BR-J13, BRL-J13-01    | High     |
| FR-J29 | Store Backup Offsite               | The System shall store backups in an offsite location.                                       | BR-J13, BRL-J13-02    | Medium   |
| FR-J30 | Restore Data Within SLA            | The System shall complete data restore within ≤2 hours.                                      | BR-J14, BRL-J14-01    | High     |
| FR-J31 | Test Backup Monthly                | The System shall test backup restoration at least once per month.                            | BR-J14, BRL-J14-02    | Medium   |
| FR-J32 | Require Admin Approval for Config  | The System shall require admin approval before applying security configuration changes.      | BR-J15, BRL-J15-01    | High     |
| FR-J33 | Record Config Audit Trail          | The System shall record an audit trail for all configuration changes.                        | BR-J15, BRL-J15-02    | Medium   |
| FR-J34 | Assign UUID to Users               | The System shall assign a UUID v4 to every user identity.                                    | BR-J16, BRL-J16-01    | Medium   |
| FR-J35 | Manage Identity Lifecycle          | The System shall support create, update, and deactivate identity lifecycle.                  | BR-J16, BRL-J16-02    | Medium   |
| FR-J36 | Enforce Security Compliance        | The System shall comply with internal security standards.                                    | BR-J17, BRL-J17-01    | Medium   |
| FR-J37 | Perform Biannual Compliance Audit  | The System shall perform compliance audits every 6 months.                                   | BR-J17, BRL-J17-02    | Low      |
| FR-J38 | Monitor System Security Metrics    | The System shall monitor CPU, memory, and traffic continuously.                              | BR-J18, BRL-J18-01    | Medium   |
| FR-J39 | Send Real-time Security Alerts     | The System shall send real-time alerts to ADMIN when thresholds are exceeded.                | BR-J18, BRL-J18-02    | High     |

## **System Logic Flow & Constraints**

1. **Secure-by-Default Communication** — Semua komunikasi dipaksa melalui TLS 1.3 dengan cipher kuat dan sertifikat valid.
2. **Strong Identity & Access Control** — Autentikasi bcrypt + JWT, otorisasi RBAC ketat, role invalid langsung ditolak.
3. **Session Guardrails** — Timeout idle 30 menit, maksimal 5 sesi, logout langsung invalidasi.
4. **Data Protection Layer** — Enkripsi AES-256 at-rest dan masking saat display.
5. **Integrity Verification** — SHA-256 checksum memastikan data tidak dimodifikasi tanpa izin.
6. **Threat Detection Rules** — Pola login gagal dan anomali IP memicu deteksi dini & alert.
7. **Audit & Forensics Ready** — Log keamanan lengkap disimpan ≥180 hari.
8. **Resilience & Availability** — RTO ≤1 jam, RPO ≤15 menit, uptime ≥99.9%, health check 30 detik.
9. **Brute Force & OWASP Defense** — Lockout otomatis dan proteksi terhadap OWASP Top 10.
10. **Backup & Restore Discipline** — Backup harian, offsite, uji restore bulanan, SLA restore ≤2 jam.
11. **Governed Configuration & Identity** — Perubahan konfigurasi wajib approval + audit trail, UUID unik per user.
12. **Continuous Monitoring & Compliance** — Monitoring real-time dan audit compliance setiap 6 bulan.

### 5.11 MODULE K — Verified Expert Management

| FR-ID  | Function Name                          | Requirement Description                                                                              | Traceability               | Priority |
| :----- | :------------------------------------- | :--------------------------------------------------------------------------------------------------- | :------------------------- | :------- |
| FR-K01 | Validate Expert Eligibility            | The System shall reject expert applications if user reputation < 1000.                               | BR-K01, BRL-K18-01,02      | High     |
| FR-K02 | Limit Expert Submissions               | The System shall block expert submission if submission_count_30d ≥ 2.                                | BR-K01, BRL-K19-01,02      | Medium   |
| FR-K03 | Require Minimum Expertise Category     | The System shall require at least 1 expertise category during expert submission.                     | BR-K01, BR-K05, BRL-K12-01 | High     |
| FR-K04 | Enforce Maximum Expertise Categories   | The System shall reject submission if expertise categories > 3.                                      | BR-K05, BRL-K12-02,03      | High     |
| FR-K05 | Ensure Unique Categories               | The System shall reject submission if duplicate category_id is detected.                             | BR-K05, BRL-K12-04         | Medium   |
| FR-K06 | Require Document per Category          | The System shall require separate document validation for each expertise category.                   | BR-K02, BR-K05, BRL-K12-05 | High     |
| FR-K07 | Record Expert Status Lifecycle         | The System shall store expert status with states: PENDING, APPROVED, EXPIRED, REVOKED, UNDER_REVIEW. | BR-K03                     | High     |
| FR-K08 | Set Expert Expiry Date                 | The System shall set expert_expiry_date = approved_at + 365 days.                                    | BR-K03, BRL-K13-01,02      | High     |
| FR-K09 | Auto Expire Expert Status              | The System shall change status to EXPIRED when current_date ≥ expert_expiry_date.                    | BR-K03, BR-K07, BRL-K13-03 | High     |
| FR-K10 | Disable Privileges on Expiry           | The System shall disable all expert privileges when status = EXPIRED.                                | BR-K06, BR-K10, BRL-K13-04 | High     |
| FR-K11 | Trigger Reverification Notification    | The System shall send re-verification notification at H-30 before expiry.                            | BR-K09, BRL-K13-06         | Medium   |
| FR-K12 | Require Reverification                 | The System shall require re-verification if status EXPIRED or categories changed.                    | BR-K09, BRL-K13-05         | High     |
| FR-K13 | Revoke on Violations                   | The System shall set status = REVOKED if ≥2 valid violations occur within 30 days.                   | BR-K07, BRL-K14-01         | High     |
| FR-K14 | Enforce Cooldown After Revoke          | The System shall block new expert application for 30 days after REVOKED.                             | BR-K07, BRL-K14-02         | Medium   |
| FR-K15 | Enforce Expert Blacklist               | The System shall set BLACKLIST_EXPERT for 180 days if REVOKED ≥2 times in 90 days.                   | BR-K07, BRL-K14-03         | Medium   |
| FR-K16 | Apply Reputation Multiplier            | The System shall apply multiplier 1.5× for expert answers receiving upvotes.                         | BR-K10, BRL-K15-01,02      | High     |
| FR-K17 | Restrict Multiplier by Category        | The System shall set multiplier = 1.0 if content category ≠ expert category.                         | BR-K05, BRL-K15-03         | High     |
| FR-K18 | Restrict Multiplier Scope              | The System shall apply multiplier only for UPVOTE on ANSWER.                                         | BR-K10, BRL-K15-04         | High     |
| FR-K19 | Respect Daily Reputation Cap           | The System shall ensure multiplier does not exceed daily reputation cap.                             | BR-K10, BRL-K15-05         | Medium   |
| FR-K20 | Enable Expert Validation Vote          | The System shall assign vote weight = 2 for expert validation.                                       | BR-K06, BRL-K16-01         | High     |
| FR-K21 | Increase Content Score by Validation   | The System shall add +2 score when expert validation is applied.                                     | BR-K06, BRL-K16-02         | Medium   |
| FR-K22 | Validate Expert Validation Eligibility | The System shall allow expert validation only if reputation ≥2000 and status APPROVED.               | BR-K06, BRL-K16-03         | High     |
| FR-K23 | Limit Expert Validation Count          | The System shall limit expert validation to 10 per 24 hours.                                         | BR-K06, BRL-K16-04         | Medium   |
| FR-K24 | Fallback Validation Weight             | The System shall set validation weight = 1 if category mismatch.                                     | BR-K05, BRL-K16-05         | Medium   |
| FR-K25 | Apply Ranking Boost                    | The System shall apply +20% ranking weight for expert content in matching category.                  | BR-K06, BRL-K17-01,02      | High     |
| FR-K26 | Remove Ranking Boost on Mismatch       | The System shall set ranking multiplier = 1.0 if category mismatch.                                  | BR-K05, BRL-K17-03         | Medium   |
| FR-K27 | Monitor Reputation Drop                | The System shall set status UNDER_REVIEW if expert reputation < 500.                                 | BR-K10, BRL-K18-03         | High     |
| FR-K28 | Auto Revoke on Low Reputation          | The System shall set status REVOKED if reputation <500 for 7 days.                                   | BR-K10, BRL-K18-04         | High     |
| FR-K29 | Enforce Verification SLA               | The System shall require admin verification decision within 72 hours.                                | BR-K03, BRL-K20-01         | High     |
| FR-K30 | Auto Escalate Verification             | The System shall escalate to senior admin if verification >72 hours.                                 | BR-K03, BRL-K20-02         | Medium   |
| FR-K31 | Flag Audit on Delay                    | The System shall set status FLAGGED_FOR_AUDIT if no decision after 120 hours.                        | BR-K03, BRL-K20-03         | Medium   |
| FR-K32 | Preserve User Anonymity                | The System shall ensure real identity documents are not exposed to public users.                     | BR-K11                     | High     |
| FR-K33 | Store Verification History             | The System shall store full expert verification history for audit trail.                             | BR-K08                     | Medium   |
| FR-K34 | Display Expert Badge                   | The System shall display visual expert badge on user content when status APPROVED.                   | BR-K04                     | Medium   |
| FR-K35 | Link Expert to Categories              | The System shall associate expert profile with validated expertise categories.                       | BR-K05                     | High     |
| FR-K36 | Display Expert Badge on Persona        | The System shall display visual expert badge on Persona without expose RealID.                       | BR-K12                     | High     |

## **System Logic Flow & Constraints**

1. **Eligibility Gate** — Reputasi <1000 langsung ditolak, submission dibatasi 2 kali/30 hari.
2. **Category Integrity** — Minimal 1, maksimal 3 kategori unik, dokumen wajib per kategori.
3. **Lifecycle Governance** — Status expert memiliki lifecycle jelas: PENDING → APPROVED → EXPIRED/REVOKED/UNDER_REVIEW.
4. **Time-Bound Validity** — Masa berlaku 365 hari, notifikasi H-30, auto-expire jika lewat.
5. **Privilege Automation** — Semua privilege (multiplier, ranking boost, validation weight) otomatis nonaktif jika EXPIRED/REVOKED.
6. **Reputation & Behavior Watch** — Pelanggaran, penurunan reputasi, dan aktivitas anomali memicu revoke otomatis.
7. **Gamification Sync** — Multiplier reputasi, validation weight, dan ranking boost hanya berlaku jika kategori sesuai.
8. **Strict Validation Limits** — Expert validation dibatasi 10/hari dan hanya untuk reputasi ≥2000.
9. **Verification SLA Control** — SLA 72 jam, auto-escalation, dan audit flag jika lambat.
10. **Anonymity Preservation** — Dokumen verifikasi hanya dapat diakses admin, tidak pernah ditampilkan publik.
11. **Auditability** — Seluruh histori verifikasi dan perubahan status tercatat untuk audit.

### 5.12 Module L - Appeal & Dispute Management

| FR-ID  | Function Name                    | Requirement Description                                                                              | Traceability                  | Priority |
| :----- | :------------------------------- | :--------------------------------------------------------------------------------------------------- | :---------------------------- | :------- |
| FR-L01 | Validate Affected User           | The System shall allow appeal submission only if user_id = affected_user_id of the moderation case.  | BR-L01, BRL-L12-01            | High     |
| FR-L02 | Enforce Appeal Time Window       | The System shall reject appeal if current_time − moderation_action_timestamp > 168 hours.            | BR-L01, BRL-L12-02,03         | High     |
| FR-L03 | Validate Appeal Content Length   | The System shall reject appeal if content length <20 or >1000 characters.                            | BR-L02, BRL-L12-04,05         | High     |
| FR-L04 | Enforce Single Appeal per Case   | The System shall enforce UNIQUE(case_id, user_id) to prevent multiple appeals for the same case.     | BR-L02, BRL-L13-01,02         | High     |
| FR-L05 | Limit Appeals per User           | The System shall block appeal submission if appeal_count_30d ≥ 3.                                    | BR-L02, BRL-L13-03,04         | Medium   |
| FR-L06 | Define Appeal Status Enum        | The System shall assign appeal status as one of {SUBMITTED, IN_REVIEW, APPROVED, REJECTED}.          | BR-L03, BRL-L14-01            | High     |
| FR-L07 | Enforce Initial Response SLA     | The System shall flag SLA_BREACH_LEVEL_1 if no response within 24 hours of SUBMITTED.                | BR-L03, BRL-L14-02,03         | Medium   |
| FR-L08 | Enforce Resolution SLA           | The System shall auto-escalate appeal to SENIOR_MODERATOR if unresolved after 72 hours.              | BR-L03, BR-L04, BRL-L14-04,05 | High     |
| FR-L09 | Flag Critical SLA Breach         | The System shall flag CRITICAL_SLA_BREACH and apply PRIORITY_OVERRIDE if unresolved after 120 hours. | BR-L03, BRL-L14-06            | Medium   |
| FR-L10 | Prevent Self-Review              | The System shall prevent reviewer_id = original_moderator_id for appeal review.                      | BR-L04, BRL-L15-01            | High     |
| FR-L11 | Auto Assign on Conflict          | The System shall auto-assign appeal to SENIOR_MODERATOR if conflict detected.                        | BR-L04, BRL-L15-02            | Medium   |
| FR-L12 | Validate Reviewer Privilege      | The System shall allow review only if role ∈ {MODERATOR, SENIOR_MODERATOR}.                          | BR-L04, BRL-L15-03            | High     |
| FR-L13 | Revert Moderation on Approval    | The System shall restore content/status if appeal_status = APPROVED.                                 | BR-L05, BRL-L16-01            | High     |
| FR-L14 | Preserve Moderation on Rejection | The System shall keep moderation effect unchanged if appeal_status = REJECTED.                       | BR-L05, BRL-L16-02            | High     |
| FR-L15 | Enforce Final Decision           | The System shall prevent re-appeal for the same case after final decision.                           | BR-L05, BRL-L16-03            | High     |
| FR-L16 | Detect Appeal Abuse              | The System shall detect abuse if invalid_appeal_count ≥ 3 within 24 hours.                           | BR-L07, BRL-L17-01            | High     |
| FR-L17 | Apply Abuse Penalty              | The System shall deduct −20 reputation if abuse_detected = TRUE.                                     | BR-L07, BRL-L17-02            | Medium   |
| FR-L18 | Apply Appeal Cooldown            | The System shall set APPEAL_COOLDOWN for 168 hours if abuse_detected = TRUE.                         | BR-L07, BRL-L17-03            | High     |
| FR-L19 | Reject Appeal During Cooldown    | The System shall auto-reject appeal if user status = APPEAL_COOLDOWN.                                | BR-L07, BRL-L17-04            | High     |
| FR-L20 | Log Appeal Activity              | The System shall log {user_id, case_id, decision, reviewer_id, timestamps} for every appeal.         | BR-L06, BRL-L18-01            | Medium   |
| FR-L21 | Enforce Log Retention            | The System shall retain appeal logs for minimum 365 days.                                            | BR-L06, BRL-L18-02            | Low      |
| FR-L22 | Mask User Identity               | The System shall pseudonymize user identity in appeal records.                                       | BR-L08, BRL-L19-01            | High     |
| FR-L23 | Encrypt Sensitive Data           | The System shall encrypt appeal data using AES-256 encryption.                                       | BR-L08, BRL-L19-02            | High     |
| FR-L24 | Send Decision Notification       | The System shall send appeal result notification ≤300 seconds after decision.                        | BR-L09, BRL-L20-01            | Medium   |
| FR-L25 | Include Reasoning Summary        | The System shall include reasoning_summary ≤500 characters in notification.                          | BR-L09, BRL-L20-02            | Medium   |
| FR-L26 | Compute Appeal KPI               | The System shall compute {avg_response_time, avg_resolution_time, appeal_success_rate}.              | BR-L10, BRL-L21-01            | Low      |
| FR-L27 | Schedule KPI Evaluation          | The System shall execute KPI evaluation every 30 days via batch job.                                 | BR-L10, BRL-L21-02            | Low      |
| FR-L28 | Restrict Appeal Data Access      | The System shall restrict appeal data access to role ∈ {ADMIN, SENIOR_MODERATOR}.                    | BR-L11, BRL-L22-01            | High     |
| FR-L29 | Enforce Secure Access Token      | The System shall require valid JWT with token expiry ≤1 hour for appeal access.                      | BR-L11, BRL-L22-02            | High     |
| FR-L30 |                                  | The System shall to appeal tracking system (immutable log).                                          |                               |          |

## **System Logic Flow & Constraints**

1. **Strict Eligibility Gate** — Hanya user terdampak yang bisa banding, maksimal 7 hari sejak tindakan moderasi.
2. **Submission Integrity** — Panjang konten divalidasi, 1 appeal per case, dan dibatasi 3 appeal/30 hari.
3. **Appeal Lifecycle Governance** — Status terstruktur: SUBMITTED → IN_REVIEW → APPROVED/REJECTED.
4. **SLA Enforcement Engine** — 24 jam respon awal, 72 jam resolusi, 120 jam critical breach + prioritas override.
5. **Conflict-Free Review** — Sistem menjamin tidak ada self-review dan hanya role berwenang yang dapat menilai.
6. **Finality Principle** — Keputusan banding bersifat final, tidak ada re-appeal.
7. **Abuse Protection** — Deteksi abuse otomatis, penalti reputasi, dan cooldown 7 hari.
8. **Security & Privacy First** — Pseudonymization, AES-256 encryption, dan RBAC ketat dengan JWT.
9. **Automated Outcome Execution** — Jika APPROVED maka sistem otomatis mengembalikan status konten.
10. **Transparency & Communication** — Notifikasi ≤5 menit dengan ringkasan alasan keputusan.
11. **Audit & Continuous Improvement** — Log lengkap disimpan 365 hari dan KPI dihitung tiap 30 hari.

---

## 6. Non-Functional Requirements

### 6.1 Global Architecture

| NFR-ID      | Attribute | Requirement Description                                                                                                                     | Traceability   |
| :---------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------- |
| NFR-GEN-01  |  General  | **Identity Vault Architecture**: AccountID disimpan di service terpisah (isolated VPC + KMS). PersonaID digunakan di seluruh domain publik. |                |
| NFR-GEN-02  |  General  | **One-way Mapping**: Mapping AccountID ↔ PersonaID menggunakan **HMAC with rotating salt** (no reversible mapping).                         |                |
| NFR-GEN-03  |  General  | **Strict Service Boundary**: Tidak ada join database lintas domain (Identity, Discussion, Moderation, Analytics).                           |                |
| NFR-GEN-04  |  General  | **Zero Trust Internal API**: Semua service komunikasi via mTLS + signed request.                                                            |                |
| NFR-GEN-05  |  General  | **Opaque Token Policy**: Semua session/admin access menggunakan opaque token (bukan raw JWT exposure).                                      |                |
| NFR-GEN-06  |  General  | **Audit Log = Persona-only**: Tidak boleh menyimpan RealID.                                                                                 |                |
| NFR-GEN-07  |  General  | **Cryptographic Isolation**: Key management terpisah per domain.                                                                            |                |

### 6.2 Performance

| NFR-ID      | Attribute   | Requirement Description                                                                                              | Traceability   |
| :---------- | :---------- | :------------------------------------------------------------------------------------------------------------------- | :------------- |
| NFR-PERF-01 | Performance | The System Shall ensure API **read operations** respond in **< 200 ms** under normal load (≤5,000 concurrent users). | BR-H13, BR-B19 |
| NFR-PERF-02 | Performance | The System Shall ensure API **write operations** respond in **< 500 ms** under normal load.                          | BR-B01, BR-C01 |
| NFR-PERF-03 | Performance | The System Shall complete **Full-Text Search queries** in **< 800 ms** for datasets up to 5 million records.         | BR-H01, BR-H02 |
| NFR-PERF-04 | Performance | The System Shall complete **AI Similarity Check (≥80% threshold)** in **< 2 seconds** per submission.                | BR-F01, BR-F08 |
| NFR-PERF-05 | Performance | The System Shall support **≥ 5,000 concurrent active users** without performance degradation.                        | BR-I01         |
| NFR-PERF-06 | Performance | The System Shall process **vote/reputation transactions** in **< 300 ms** to maintain real-time feedback.            | BR-D04         |
| NFR-PERF-07 | Performance | The System Shall deliver notification events in **≤ 3 seconds** after trigger.                                       | BR-G01         |

### 6.2 Security & Privacy

| NFR-ID     | Attribute | Requirement Description                                                                                                            | Traceability       |
| :--------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| NFR-SEC-01 | Security  | The System Shall enforce **TLS 1.3** for all data in transit.                                                                      | BRL-J01-01         |
| NFR-SEC-02 | Security  | The System Shall encrypt all sensitive data at rest using **AES-256**.                                                             | BRL-J05-01         |
| NFR-SEC-03 | Security  | The System Shall hash passwords using **bcrypt cost ≥ 12**.                                                                        | BRL-J02-01         |
| NFR-SEC-04 | Security  | The System Shall sign JWT tokens using **RS256** with expiry ≤ 1 hour.                                                             | BRL-J02-03         |
| NFR-SEC-05 | Privacy   | The System Shall ensure **no email, phone, or IP address** appears in public logs or UI.                                           | BR-A06, BRL-J05-02 |
| NFR-SEC-06 | Security  | The System Shall implement **RBAC enforcement** across all modules.                                                                | BR-A11, BRL-J03-01 |
| NFR-SEC-07 | Security  | The System Shall implement protection against **OWASP Top 10** vulnerabilities.                                                    | BRL-J12-01         |
| NFR-SEC-08 | Security  | The System Shall automatically lock accounts after **5 failed login attempts** for **15 minutes**.                                 | BRL-J11-01         |
| NFR-SEC-09 | Security  | The System Shall mask sensitive fields when displayed (e.g., email masking).                                                       | BRL-J05-02         |
| NFR-SEC-10 | Privacy   | The System Shall pseudonymize user identity in moderation and appeal processes.                                                    | BR-L08             |
| NFR-SEC-11 | Security  | Identity Vault terenkripsi (AES-256 + KMS split-key).                                                                              |                    |
| NFR-SEC-12 | Security  | Atomic transaction (ACID enforced for voting race condition).                                                                      |                    |
| NFR-SEC-13 | Security  | Transparency Report (aggregated anonymized).                                                                                       |                    |
| NFR-SEC-14 | Security  | Data minimization policy (AI input sanitization).                                                                                  |                    |
| NFR-SEC-15 | Security  | Email/push tidak boleh mengandung isi sensitif.                                                                                    |                    |
| NFR-SEC-16 | Security  | Tidak boleh link ke AccountID.                                                                                                     |                    |
| NFR-SEC-17 | Security  | Differential privacy (noise injection).                                                                                            |                    |
| NFR-SEC-18 | Security  | Semua log → hashed + salted.                                                                                                       |                    |
| NFR-SEC-19 | Security  | Secure enclave untuk Identity Vault.                                                                                               |                    |
| NFR-SEC-20 | Security  | Key isolation per service.                                                                                                         |                    |
| NFR-SEC-21 | Security  | Zero-Knowledge Architecture.                                                                                                       |                    |
| NFR-SEC-22 | Security  | Dokumen expert terenkripsi (KMS).                                                                                                  |                    |
| NFR-SEC-23 | Security  | Transparency reporting.                                                                                                            |                    |
| NFR-SEC-24 | Security  | Relasi antara identitas asli dan anonim wajib menggunakan HMAC dengan kunci yang disimpan dalam Hardware Security Module (HSM).    |                    |
| NFR-SEC-25 | Security  | Dashboard Moderator tidak diperbolehkan memiliki path data atau tombol yang dapat mengekspos mapping identitas asli pengguna.      |                    |

### 6.3 Availability & Reliability

| NFR-ID     | Attribute    | Requirement Description                                                                | Traceability |
| :--------- | :----------- | :------------------------------------------------------------------------------------- | :----------- |
| NFR-AVR-01 | Availability | The System Shall maintain **≥ 99.9% uptime** measured monthly.                         | BRL-J10-01   |
| NFR-AVR-02 | Reliability  | The System Shall achieve **RPO ≤ 1 hour** (max data loss).                             | BR-J13       |
| NFR-AVR-03 | Reliability  | The System Shall achieve **RTO ≤ 4 hours** after critical failure.                     | BR-J09       |
| NFR-AVR-04 | Reliability  | The System Shall run automated **health checks every 30 seconds**.                     | BRL-J10-02   |
| NFR-AVR-05 | Reliability  | The System Shall guarantee **ACID compliance** for reputation and voting transactions. | BR-D04       |
| NFR-AVR-06 | Reliability  | The System Shall retain security and appeal logs for **≥ 365 days**.                   | BRL-L18-02   |

### 6.4 Scalability

| NFR-ID      | Attribute   | Requirement Description                                                                                    | Traceability |
| :---------- | :---------- | :--------------------------------------------------------------------------------------------------------- | :----------- |
| NFR-SCAL-01 | Scalability | The System Shall implement **stateless API services** to support horizontal scaling.                       | BR-I01       |
| NFR-SCAL-02 | Scalability | The System Shall use **Redis caching** for frequently accessed metadata.                                   | BR-H13       |
| NFR-SCAL-03 | Scalability | The System Shall support **database read replicas** for search and analytics workloads.                    | BR-H14       |
| NFR-SCAL-04 | Scalability | The System Shall support **database sharding** for discussion and answer tables exceeding 10 million rows. | BR-B20       |
| NFR-SCAL-05 | Scalability | The System Shall isolate AI processing workloads from core transaction services.                           | BR-F11       |

### 6.5 Maintainability

| NFR-ID      | Attribute       | Requirement Description                                                              | Traceability |
| :---------- | :-------------- | :----------------------------------------------------------------------------------- | :----------- |
| NFR-MAIN-01 | Maintainability | The System Shall maintain **≥ 80% unit test coverage** for business logic layers.    | BR-I02       |
| NFR-MAIN-02 | Maintainability | The System Shall provide **auto-generated API documentation** using OpenAPI/Swagger. | BR-I03       |
| NFR-MAIN-03 | Maintainability | The System Shall implement **centralized logging** using ELK/Prometheus stack.       | BR-J08       |
| NFR-MAIN-04 | Maintainability | The System Shall enforce **code versioning and CI/CD pipeline** for all deployments. | BR-I04       |
| NFR-MAIN-05 | Maintainability | The System Shall record configuration changes with full audit trail.                 | BRL-J15-02   |

---

## 7. External Interface Requirements

### 7.1 User Interfaces

### 7.2 Software Interfaces

### 7.3 Communication Interfaces

---

## 8. System Modeling

### 8.1 Use Case Diagram

### 8.2 Entity Relationship Diagram

### 8.3 State Machine Diagrams

---

## 9. Traceability Matrix

### 9.1 Mapping BRD to SRS

---

## 10. Acceptance Criteria

### 10.1 Functional Acceptance Criteria

### 10.2 Quality & Performance Acceptance Criteria

---

## 11. Deliverables & Deployment

### 11.1 Software Deliverables

### 11.2 Deployment Environment

---

## 12. Approval & Sign-off

Pernyataan persetujuan resmi terhadap isi Specific Software Requirements (SRS) OLION. Dengan menandatangani bagian ini, pihak terkait menyatakan bahwa seluruh kebutuhan bisnis, ruang lingkup, asumsi, dan batasan yang tertuang dalam dokumen ini telah dipahami, disetujui, dan akan menjadi acuan utama dalam pengembangan proyek.

| Name | Role | Signature | Date |
|------|:----:|:---------:|------|
| beel | Project Owner / Developer | __________ | 03-02-2026 |

**Approved By: beel**
**Role: Project Owner**
**Date: 03-02-2026**