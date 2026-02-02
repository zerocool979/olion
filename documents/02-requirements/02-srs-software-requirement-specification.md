# Software Requirements Specification (SRS)

**Project Name: olion**
**Document Type: Software Requirements Specification (SRS)**
**Document Version: v1.0**
**Date: 03-02-2026**
**Document History**

| Version |    Date    | Author |       Description       |
|--------:|------------|:------:|-------------------------|
|   v1.0  | 03-02-2026 |  beel  | Initial SRS draft based on BRD & MVP scope |
|   v2.0  | XX-XX-XXXX |        |                         |

---

## Table of Contents

1. Introduction
2. Overall Description
3. Business Rules
4. Stakeholders & Users
5. Functional Requirements
6. Non-Functional Requirements
7. Requirement, Use Case, & Scenario
8. TRACEABILITY MATRIX — MVP OLION
9. Deliverables
10. External Interface Requirements
11. Out of Scope
12. Acceptance Criteria (MVP)
13. Approval

---

## 1) Introduction

### 1.1 Purpose

Dokumen ini mendefinisikan kebutuhan perangkat lunak untuk sistem OLION. Dokumen ini menjadi acuan utama bagi proses desain teknis, pengembangan, pengujian, dan validasi sistem.

### 1.2 System Scope

OLION adalah platform diskusi berbasis web dengan konsep pseudonimitas (anonimitas terkontrol) yang memungkinkan pengguna berdiskusi secara aman, terstruktur, dan berkualitas. Sistem mendukung diskusi, voting, reputasi, pelaporan, moderasi, serta fitur Verified Expert.

### 1.3 Definitions, Acronyms, and Terms

* **FR:** Functional Requirement
* **NFR:** Non-Functional Requirement
* **RBAC:** Role-Based Access Control
* **Pseudonym:** Identitas publik samaran pengguna
* **Verified Expert:** Pakar terverifikasi oleh Admin
* **Moderation Queue:** Antrian laporan untuk diproses Moderator/Admin

---

## 2) Overall Description

### 2.1 Product Perspective

OLION adalah aplikasi web yang terdiri dari:

* Frontend Web Application (role-based UI)
* Backend REST API
* Database (schema + migration/seed)

### 2.2 User Classes

* **User:** pengguna umum
* **Expert:** user dengan label Verified Expert (setelah verifikasi)
* **Moderator:** memproses laporan dan moderasi konten
* **Admin:** manajemen user, kategori, verifikasi expert, kontrol sistem dasar

### 2.3 Assumptions and Dependencies

* Pengguna wajib login untuk membuat konten.
* Konten MVP berbasis teks (link diperbolehkan).
* Sistem berjalan pada environment web modern.

---

## 3) Business Rules

Aturan bisnis berikut menjadi batasan implementasi sistem:

### 3.1 Identity & Pseudonym

* Pseudonym adalah identitas publik utama.
* Pseudonym dibuat otomatis saat registrasi.
* Pseudonym dapat diubah dengan cooldown minimal **7 hari**.
* Pseudonym harus **unik**.
* Format pseudonym hanya: huruf, angka, underscore (`_`).

### 3.2 Accounts & Authentication

* Login menggunakan **email + password**.
* Akun suspended/banned bersifat **read-only** (hanya bisa melihat konten).

### 3.3 Content

* Edit konten maksimal **24 jam** setelah dibuat.
* Delete konten oleh user adalah **soft delete**.
* Hard delete hanya oleh Admin.
* Konten MVP adalah **text-only**, link diperbolehkan.

### 3.4 Voting & Reputation

* Voting berlaku untuk diskusi, jawaban, komentar.
* 1 user hanya dapat memberikan 1 vote per konten.
* Vote dapat dibatalkan (undo).
* Downvote diaktifkan pada MVP.

### 3.5 Report & Moderation

* Report wajib memilih reason: Spam, Harassment/Bullying, Hate Speech, Misinformation, Other.
* Aksi moderasi minimal: hide content, resolve report, warn user.

### 3.6 Verified Expert

* Status expert: pending → approved/rejected → revoked.
* Admin dapat mencabut status Verified Expert (revoked).

---

## 4) Stakeholders & Users

### 4.1 Stakeholders

* **End User (Pengguna Umum)**: pengguna yang memanfaatkan OLION untuk berdiskusi, bertanya, dan berinteraksi di forum.
* **Expert (Pakar Terverifikasi)**: pengguna yang telah melalui proses verifikasi dan berperan memberikan jawaban/insight dengan kredibilitas lebih tinggi.
* **Moderator**: pihak yang bertugas menjaga kualitas dan etika diskusi melalui proses review laporan dan tindakan moderasi.
* **Admin**: pihak yang memiliki kontrol sistem tertinggi untuk mengelola user, kategori, verifikasi pakar, serta konfigurasi dasar sistem.
* **Owner**: pengembang utama yang merancang, membangun, menguji, dan melakukan deployment sistem OLION.

### 4.2 Roles & Hak Akses

**User**
**Hak Akses:**
* Membuat diskusi, jawaban, dan komentar
* Melakukan voting (upvote & downvote) pada diskusi, jawaban, komentar
* Melaporkan konten (report) dan memberikan alasan singkat
* Menyunting konten sendiri dalam batas waktu tertentu
* Menghapus konten sendiri (soft delete)
* Menandai favorit / subscribe diskusi untuk notifikasi
* Melihat reputasi & level badge sendiri
* Menandai user lain dalam komentar (mention/tag)
* Mengakses draft otomatis untuk jawaban panjang
* Menyaring pencarian diskusi berdasarkan keyword/kategori
* Membuat komentar nested (reply to comment)
* Mengikuti user atau topik untuk membangun “feed personal”

**Hak Akses Tambahan (Future):**
* Mode “anonymous super-safe” untuk topik sensitif (konten tidak tercatat ke reputasi)
* Custom notifications granular (email/web/mobile)
* Ekspor aktivitas sendiri (riwayat vote, komentar, diskusi)

**Expert**
**Hak Akses:**
* Semua hak User
* Label Verified Expert di profil, jawaban, diskusi, komentar
* Menambahkan bio, keahlian, portofolio, publikasi
* Menandai jawaban/komentar penting sebagai insight/highlight
* Mengajukan topik rekomendasi untuk niche discussion
* Dapat vote dengan “weight” lebih tinggi (opsional)
* Melihat statistik kontribusi sendiri & feedback dari user
* Menyediakan endorsement atau referensi internal (Admin bisa approve)
* Bisa ikut mentoring user tertentu atau forum khusus Expert-User

**Hak Akses Tambahan (Future):**
* Analytics mini untuk melihat engagement jawaban/komentar
* Mode “draft expert” untuk diskusi sensitif sebelum publish
* Badge/level tambahan untuk kontribusi konten berkualitas

**Moderator**
**Hak Akses:**
* Melihat semua report queue
* Meninjau laporan (hide/delete/resolve)
* Membatasi tindakan sesuai hak: soft/hard delete
* Memberikan warning atau suspend sementara user yang melanggar
* Menandai konten untuk review admin
* Menyaring laporan berdasarkan severity/type pelanggaran
* Melihat log tindakan moderator lain (audit)
* Menyediakan komentar internal untuk koordinasi tim moderasi

**Hak Akses Tambahan (Future):**
* Fitur bulk moderation (hide/delete multi-konten)
* AI-assisted flagging (saran konten berisiko)
* Temporary admin rights untuk kasus tertentu

**Admin**
**Hak Akses:**
* Semua hak Moderator + Expert + User
* Manajemen user (lihat, ubah role, suspend, ban)
* Manajemen kategori (CRUD kategori, subkategori)
* Memverifikasi pakar (approve/reject)
* Menetapkan aturan voting/reputasi/reward
* Mengatur konfigurasi sistem dasar (RBAC, rate limit, token expiry)
* Generate report & export log (CSV/JSON)
* Monitoring realtime sistem (dashboard vote, report, aktivitas)
* Revoke device login atau session user
* Mengatur keamanan & akses API
* Audit seluruh aktivitas (user, moderator, expert)

**Hak Akses Tambahan (Future):**
* Konfigurasi multi-level RBAC
* Analytics lanjutan (growth, partisipasi, reputasi, engagement)
* Integrasi external system (OAuth, storage, AI moderation)
* Backup / restore DB & sistem

> _"Catatan:
> 1. Hak akses di atas dibayangkan maksimal, tapi untuk MVP bisa diprioritaskan:
>    - **User:** diskusi, jawaban, komentar, voting, report
>    - **Expert:** User + label verified, jawaban pakar
>    - **Moderator:** report queue + tindakan moderasi
>    - **Admin:** user management, verifikasi expert, kategori, sistem dasar
> 2. Semua hak akses terkait audit dan keamanan, agar setiap aksi dapat ditelusuri (misal voting, report, moderasi).
> 3. Level granular ini memungkinkan scaling fitur: misal nanti expert bisa memoderasi niche topic, atau admin bisa memberikan temporary moderator rights."_

---

## 5) Functional Requirements (FR)

### 5.1 Autentikasi & Akun

- FR-A01 Sistem menyediakan fitur registrasi akun pengguna menggunakan email dan password.
- FR-A02 Sistem menyediakan fitur login menggunakan kredensial yang valid.
- FR-A03 Sistem menyediakan fitur logout untuk mengakhiri sesi pengguna.
- FR-A04 Sistem harus menghasilkan pseudonym default secara otomatis saat registrasi.
- FR-A05 Sistem harus mengizinkan user mengubah pseudonym dengan aturan: unik + format valid + cooldown 7 hari.
- FR-A06 Sistem menerapkan role management (RBAC) untuk role: User, Expert, Moderator, Admin.
- FR-A07 Sistem membatasi akses fitur berdasarkan role-based access control (RBAC).
- FR-A08 Sistem menghasilkan dan menampilkan pseudonym sebagai identitas publik pengguna.
- FR-A09 Sistem menyembunyikan identitas asli pengguna dari tampilan publik (anonimitas terkontrol).
- FR-A10 Sistem memberikan opsi login social OAuth (Google/Apple) untuk kemudahan.
- FR-A11 Sistem mengizinkan pseudonym dapat dikustomisasi dengan template unik agar personal tapi tetap anonim.
- FR-A12 Sistem mendukung multi-session device, tapi admin dapat melihat & revoke device aktif.
- FR-A13 Sistem menampilkan status online/offline pseudonym secara opsional untuk interaksi real-time.
- FR-A14 Sistem menyertakan password strength meter & saran untuk memandu user.
- FR-A15 Sistem harus membatasi akun suspended/banned menjadi read-only (hanya bisa melihat konten).

### 5.2 Forum Diskusi

- FR-B01 Sistem memungkinkan pengguna membuat diskusi baru.
- FR-B02 Sistem harus menampilkan daftar diskusi dengan pagination.
- FR-B03 Sistem harus menampilkan detail diskusi beserta jawaban dan komentar.
- FR-B04 Sistem harus memungkinkan user mengedit diskusi miliknya dalam waktu maksimal 24 jam.
- FR-B05 Sistem memungkinkan pengguna melakukan hapus diskusi sesuai otorisasi (soft delete diskusi miliknya).
- FR-B06 Sistem harus memungkinkan user mengedit jawaban/komentar miliknya dalam waktu maksimal 24 jam.
- FR-B07 Sistem harus memungkinkan user melakukan soft delete jawaban/komentar miliknya.
- FR-B08 Sistem harus memungkinkan pengguna membuat jawaban pada diskusi.
- FR-B09 Sistem harus memungkinkan pengguna membuat komentar pada diskusi dan jawaban.
- FR-B10 Sistem memungkinkan pengguna membuat komentar pada komentar yang sudah ada (reply/hirarki).
- FR-B11 Sistem menyediakan fitur pencarian diskusi berdasarkan keyword.
- FR-B12 Sistem mendukung filter/penelusuran berdasarkan kategori (jika kategori tersedia).
- FR-B13 Sistem menampilkan metadata diskusi (tanggal, author pseudonym, jumlah vote, jumlah jawaban).
- FR-B14 Sistem mendukung tagging user & mention, tapi tetap anonimitas dikontrol.
- FR-B15 Sistem menampilkan thread diskusi nested untuk komentar agar percakapan lebih jelas.
- FR-B16 Sistem memungkinkan draft otomatis ketika user mengetik jawaban panjang.
- FR-B17 Sistem menyediakan highlight keyword di hasil pencarian.
- FR-B18 Sistem memungkinkan favorit/subscribe diskusi untuk notifikasi update.

### 5.3 Kontrol Kualitas (Report, Voting & Reputasi)

- FR-C01 Sistem memungkinkan pengguna melakukan voting (upvote/downvote) pada diskusi.
- FR-C02 Sistem memungkinkan pengguna melakukan voting (upvote/downvote) pada jawaban.
- FR-C03 Sistem memungkinkan pengguna melakukan voting (upvote/downvote) pada komentar.
- FR-C04 Sistem menerapkan aturan 1 user hanya dapat vote 1 kali per konten.
- FR-C05 Sistem harus mengizinkan user melakukan undo vote.
- FR-C06 Sistem menghitung dan menampilkan total vote pada setiap konten.
- FR-C07 Sistem memungkinkan upvote/downvote dengan alasan singkat untuk kualitas feedback.
- FR-C08 Sistem menyediakan reputasi user (basic) berdasarkan aktivitas/voting.
- FR-C09 Sistem menampilkan level/reputation badge secara visual untuk mendorong kontribusi.
- FR-C10 Sistem menambahkan trust score untuk user yang konsisten berkualitas.
- FR-C11 Sistem memberi daily/weekly summary reputasi & aktivitas ke user.
- FR-C12 Sistem harus menyediakan fitur report konten (diskusi/jawaban/komentar).
- FR-C13 Sistem harus mewajibkan user memilih reason report: Spam, Harassment/Bullying, Hate Speech, Misinformation, Other.
- FR-C14 Sistem mencatat report dengan status pending/reviewed/resolved.
- FR-C15 Sistem menyediakan fitur moderasi berdasarkan laporan yang masuk.
- FR-C16 Sistem mencatat tindakan moderasi (misal: hide/delete/resolve) pada konten yang dilaporkan.
- FR-C17 Sistem harus menyimpan report dalam status antrian untuk diproses (moderation queue).
- FR-C18 Sistem harus memungkinkan Moderator/Admin melihat daftar report yang masuk.
- FR-C19 Sistem memungkinkan report anonim agar user merasa aman melaporkan pelanggaran.
- FR-C20 Sistem harus memungkinkan Moderator/Admin melakukan tindakan: hide content, warn user.
- FR-C21 Sistem harus memungkinkan Moderator/Admin melakukan tindakan: resolve report.

### 5.4 Expert Verification

- FR-D01 Sistem harus memungkinkan user mengajukan Expert Verification Request.
- FR-D02 Sistem harus menerima dan menyimpan data pengajuan expert berupa dokumen/sertifikat/CV/link portofolio (identitas, bidang, bukti).
- FR-D03 Sistem harus memungkinkan Admin melakukan approve/reject pengajuan expert.
- FR-D04 Sistem menampilkan status verifikasi pakar (pending/approved/rejected).
- FR-D05 Sistem menampilkan label Verified Expert pada profil pengguna yang telah disetujui.
- FR-D06 Sistem harus menampilkan label Verified Expert pada jawaban dan komentar pakar.
- FR-D07 Sistem harus memungkinkan Admin melakukan revoke status expert jika diperlukan.
- FR-D08 Expert dapat menambahkan bio, keahlian spesifik, portofolio, dan link publikasi.
- FR-D09 Admin dapat menambahkan endorsement internal untuk memperkuat verifikasi expert.
- FR-D10 Sistem memungkinkan expert highlight jawaban atau komentar untuk menandai insight penting.
- FR-D11 Sistem mengizinkan expert mengajukan topik rekomendasi untuk diskusi niche.

### 5.5 Admin & Moderator Panel

- FR-E01 Sistem harus menyediakan halaman panel untuk Admin dan Moderator sesuai hak akses.
- FR-E02 Admin dapat melakukan manajemen user (lihat, ubah role, tindakan tertentu).
- FR-E03 Admin dapat melakukan manajemen kategori (CRUD kategori).
- FR-E04 Moderator dapat melihat daftar laporan masuk (report queue).
- FR-E05 Moderator dapat melakukan tindakan moderasi terhadap laporan (hide/delete/resolve).
- FR-E06 Sistem menampilkan detail laporan (pelapor, alasan, waktu, konten terkait).
- FR-E07 Sistem membatasi tindakan admin/moderator sesuai hak aksesnya.
- FR-E08 Admin dapat generate report aktivitas sistem (mis. jumlah vote, diskusi, report per kategori).
- FR-E09 Moderator dapat filter report berdasarkan severity atau tipe pelanggaran.
- FR-E10 Sistem menyediakan dashboard realtime untuk status moderasi.
- FR-E11 Admin dapat mengatur aturan voting/reputasi/reward secara konfiguratif.
- FR-E12 Panel mendukung export log atau report dalam CSV/JSON untuk audit eksternal.

### 5.6 Dokumentasi & Testing

- FR-F01 Sistem menyediakan dokumentasi API dalam format Swagger/OpenAPI atau Postman.
- FR-F02 Sistem memiliki Test Plan untuk pengujian fitur utama.
- FR-F03 Sistem memiliki Test Cases untuk skenario user/expert/moderator/admin (untuk fitur inti).
- FR-F04 Sistem memiliki Test Evidence (screenshot/log hasil uji).
- FR-F05 Sistem menyediakan Deployment Guide dasar untuk menjalankan aplikasi.
- FR-F06 Sistem menyediakan sandbox API untuk tester/expert tanpa mengganggu data produksi.
- FR-F07 Sistem memiliki mock data generator untuk testing skala besar.
- FR-F08 Test evidence otomatis tersimpan di CI/CD pipeline.
- FR-F09 Dokumentasi menyediakan contoh request/response dan scenario untuk semua role.
- FR-F10 Deployment guide menyertakan docker-compose + environment variable templates.

---

## 6) Non-Functional Requirements (NFR)

- NFR-0.01 (Security) Sistem harus menerapkan proteksi endpoint berbasis role (RBAC).
- NFR-0.02 (Privacy - Pseudonymity) Sistem harus memastikan identitas publik menggunakan pseudonym dan tidak membocorkan identitas asli.
- NFR-0.03 (Performance) Endpoint utama harus memiliki performa stabil untuk penggunaan normal.
- NFR-0.04 (Reliability) Sistem harus berjalan stabil pada alur utama end-to-end tanpa crash.
- NFR-0.05 (Data Integrity) Sistem harus menjaga konsistensi data melalui relasi database dan validasi input.
- NFR-0.06 (Usability) UI harus mudah digunakan dan navigasi jelas.
NFR-0.07 (Maintainability) Struktur kode harus modular dan mudah dikembangkan.

### 6.1 Autentikasi & Akun

- NFR-A01 (Security) Password harus disimpan dalam bentuk hashing (bukan plain text).
- NFR-A02 (Security) Sistem autentikasi harus menggunakan token/session yang aman (JWT).
- NFR-A03 (Security) Brute-force attack harus dicegah melalui rate-limit & lockout sementara.
- NFR-A04 (Usability) Proses register/login harus mudah digunakan dan jelas validasinya.
- NFR-A05 (Usability) User flow register/login harus mobile-first, jelas, dengan inline validation.
- NFR-A06 (Reliability) Sistem harus menolak login dengan kredensial salah secara konsisten.
- NFR-A07 (Performance) Proses register/login tidak boleh lebih dari 2 detik pada server MVP.

### 6.2 Forum Diskusi

- NFR-B01 (Performance) Daftar diskusi harus menggunakan pagination agar tetap responsif.
- NFR-B02 (Performance) List & search diskusi mendukung lazy loading untuk skala ribuan diskusi.
- NFR-B03 (Usability) Pencarian harus memberikan hasil yang relevan dan mudah dipahami pengguna.
- NFR-B04 (Usability) User dapat dengan mudah menavigasi diskusi melalui breadcrumb + filter kategori/tag.
- NFR-B05 (Reliability) Sistem harus menjaga konsistensi relasi Diskusi–Jawaban–Komentar.
- NFR-B06 (Maintainability) Struktur modul diskusi harus terpisah dan mudah dikembangkan.
- NFR-B07 (Scalability) Struktur database diskusi siap untuk sharding / partitioning jika jumlah konten bertumbuh.

### 6.3 Kontrol Kualitas

- NFR-C01 (Security) Sistem harus mencegah manipulasi vote (double vote / spam voting).
- NFR-C02 (Auditability) Semua tindakan moderasi harus memiliki jejak audit/log.
- NFR-C03 (Auditability) Semua vote/report/reputasi memiliki timestamp & reference agar bisa di-review.
- NFR-C04 (Integrity) Report tidak boleh menghapus data otomatis tanpa proses moderasi.
- NFR-C05 (Integrity) Sistem menolak manipulasi reputasi atau vote otomatis.
- NFR-C06 (Reliability) Perhitungan reputasi harus konsisten dan tidak menghasilkan nilai ganda.
- NFR-C07 (Scalability) Perhitungan reputasi real-time atau batch update tanpa menghambat performa.

### 6.4 Expert Verification

- NFR-D01 (Security) Proses verifikasi pakar harus hanya dapat diputuskan oleh Admin.
- NFR-D02 (Security) Expert documents terenkripsi & hanya dapat diakses oleh sistem dan admin. 
- NFR-D03 (Auditability) Approval/Reject harus tersimpan sebagai riwayat keputusan admin.
- NFR-D04 (Auditability) Semua perubahan status expert tercatat dan dapat di-query dalam laporan.
- NFR-D05 (Usability) Label Verified Expert harus terlihat jelas namun tidak mengganggu tampilan.
- NFR-D06 (Usability) Label Verified Expert tidak mengganggu UI mobile atau desktop.
- NFR-D07 (Integrity) Status verifikasi pakar tidak boleh dapat diubah oleh user biasa.

### 6.5 Admin & Moderator Panel

- NFR-E01 (Security) Panel admin/moderator harus terlindungi oleh RBAC + auth guard.
- NFR-E02 (Auditability) Aktivitas admin/moderator harus tercatat (log tindakan).
- NFR-E03 (Usability) Panel harus mudah dipakai untuk review laporan dengan cepat.
- NFR-E04 (Reliability) Aksi moderasi tidak boleh menyebabkan data “rusak” (gunakan soft-delete bila perlu).
- NFR-E05 (Maintainability) Panel menggunakan modular UI & API endpoints sehingga mudah diperluas.
- NFR-E06 (Observability) Semua aksi panel tercatat dalam structured log & request id.
- NFR-E07 (Usability) Panel harus responsive & keyboard-navigable agar cepat digunakan moderator.
- NFR-E08 (Auditability) Aktivitas moderasi harus dapat dilacak untuk evaluasi dan akuntabilitas.

### 6.6 Dokumentasi & Testing

- NFR-F01 (Maintainability) Dokumentasi API harus selalu sinkron dengan endpoint implementasi.
- NFR-F02 (Quality Assurance) Test case harus mencakup validasi normal & error handling.
- NFR-F03 (Reproducibility) Deployment guide harus memungkinkan sistem dijalankan ulang tanpa trial-error.
- NFR-F04 (Clarity) Dokumentasi harus rapi, konsisten, dan mudah dipahami reviewer/pengembang.
- NFR-F05 (Maintainability) Dokumentasi harus terversioning & otomatis sinkron dengan update API.
- NFR-F06 (Reproducibility) Test harus bisa dijalankan lokal & di CI/CD tanpa konfigurasi rumit.
- NFR-F07 (Clarity) Dokumentasi menggunakan format visual + text untuk semua jenis user (developer, moderator, expert).
- NFR-F08 (Compatibility) Sistem harus berjalan pada browser modern dan responsif untuk mobile.
- NFR-F09 (Documentation Quality) Dokumentasi harus sinkron dengan implementasi (API, DB schema, role permission).

---

## 7) Requirement + Use Case + Scenario

### MODULE: Authentication & Account

#### Requirement R-A01: User Registration

|           RequirementID | R-A01                                                                                                                                                                               |
| ----------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to register user account                                                                                                                                                    |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk melakukan registrasi akun baru menggunakan kredensial yang valid dan menyimpan akun tersebut sebagai identitas sistem yang aman. |
|   Impacted Stakeholders | User / Admin                                                                                                                                                                        |
|      Business Objective | BR-01                                                                                                                                                                               |

##### Use Case UC-A01: Register User

|          UsecaseID | UC-A01                                                               |
| -----------------: | -------------------------------------------------------------------- |
|       Usecase Name | Ability to register user account                                     |
|             Actors | Primary: User; Secondary: System                                     |
|     Pre Conditions | 1) User belum login  2) User belum memiliki akun terdaftar           |
|      Primary Steps | 1. User membuka halaman registrasi                                   |
|                    | 2. User mengisi data registrasi                                      |
|                    | 3. User mengirim permintaan registrasi                               |
|                    | 4. Sistem memvalidasi data registrasi                                |
|                    | 5. Sistem membuat akun baru                                          |
|                    | 6. Sistem mengembalikan respons sukses                               |
|    Alternate Steps | A1. Data tidak valid → sistem menolak dan menampilkan error validasi |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server     |
| Business Objective | BR-01                                                                |

###### Scenario SC-A01: Successful Registration

|         ScenarioID | SC-A01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Successful registration                                   |
|              GIVEN | User belum memiliki akun dan belum login                  |
|               WHEN | User mengirim registrasi dengan data valid                |
|               THEN | Sistem membuat akun baru dan mengembalikan respons sukses |
| Business Objective | BR-01                                                     |

###### Scenario SC-A02: Registration Failed (Duplicate Email)

|         ScenarioID | SC-A02                                                                 |
| -----------------: | ---------------------------------------------------------------------- |
|      Scenario Name | Registration failed due to duplicate email                             |
|              GIVEN | Email sudah terdaftar pada sistem                                      |
|               WHEN | User mengirim registrasi menggunakan email yang sama                   |
|               THEN | Sistem menolak registrasi dan mengembalikan pesan error email duplikat |
| Business Objective | BR-01                                                                  |

---

#### Requirement R-A02: Login Session

|           RequirementID | R-A02                                                                                                                                                                       |
| ----------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to authenticate user session                                                                                                                                        |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk login menggunakan kredensial yang valid dan membentuk sesi autentikasi yang aman untuk mengakses fitur sesuai hak akses. |
|   Impacted Stakeholders | User / Admin                                                                                                                                                                |
|      Business Objective | BR-01                                                                                                                                                                       |

##### Use Case UC-A02: Login

|          UsecaseID | UC-A02                                                                    |
| -----------------: | ------------------------------------------------------------------------- |
|       Usecase Name | Ability to login and start session                                        |
|             Actors | Primary: User; Secondary: System                                          |
|     Pre Conditions | 1) User memiliki akun terdaftar  2) User belum login                      |
|      Primary Steps | 1. User membuka halaman login                                             |
|                    | 2. User memasukkan email dan password                                     |
|                    | 3. User mengirim permintaan login                                         |
|                    | 4. Sistem memvalidasi kredensial                                          |
|                    | 5. Sistem membuat sesi autentikasi                                        |
|                    | 6. Sistem mengembalikan respons sukses                                    |
|    Alternate Steps | A1. Kredensial salah → sistem menolak dan mengembalikan error autentikasi |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server          |
| Business Objective | BR-01                                                                     |

###### Scenario SC-A03: Login Success

|         ScenarioID | SC-A03                                               |
| -----------------: | ---------------------------------------------------- |
|      Scenario Name | Login success                                        |
|              GIVEN | User memiliki akun terdaftar dan belum login         |
|               WHEN | User mengirim login dengan kredensial benar          |
|               THEN | Sistem mengautentikasi user dan membentuk sesi login |
| Business Objective | BR-01                                                |

###### Scenario SC-A04: Invalid Login

|         ScenarioID | SC-A04                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Login failed due to invalid credentials                  |
|              GIVEN | User memiliki akun terdaftar                             |
|               WHEN | User mengirim login dengan password salah                |
|               THEN | Sistem menolak login dan mengembalikan error autentikasi |
| Business Objective | BR-01                                                    |

---

#### Requirement R-A03: Logout

|           RequirementID | R-A03                                                                                                                                               |
| ----------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to logout user session                                                                                                                      |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk logout agar sesi autentikasi berakhir dan akses terhadap fitur yang memerlukan login dihentikan. |
|   Impacted Stakeholders | User / Admin                                                                                                                                        |
|      Business Objective | BR-01                                                                                                                                               |

##### Use Case UC-A03: Logout

|          UsecaseID | UC-A03                                                                                                   |
| -----------------: | -------------------------------------------------------------------------------------------------------- |
|       Usecase Name | Ability to logout user session                                                                           |
|             Actors | Primary: User; Secondary: System                                                                         |
|     Pre Conditions | 1) User sedang login                                                                                     |
|      Primary Steps | 1. User memilih aksi logout                                                                              |
|                    | 2. Sistem mengakhiri sesi autentikasi                                                                    |
|                    | 3. Sistem mengembalikan respons sukses                                                                   |
|    Alternate Steps | A1. Token/sesi tidak valid → sistem tetap mengakhiri sesi di sisi client dan mengembalikan status logout |
| Business Objective | BR-01                                                                                                    |

###### Scenario SC-A05: Logout Success

|         ScenarioID | SC-A05                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Logout success                                     |
|              GIVEN | User sedang login                                  |
|               WHEN | User melakukan logout                              |
|               THEN | Sistem mengakhiri sesi dan user keluar dari sistem |
| Business Objective | BR-01                                              |

---

### MODULE: Discussion & Content

#### Requirement R-B01: Create Discussion

|           RequirementID | R-B01                                                                                                                             |
| ----------------------: | --------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to create discussion                                                                                                      |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk membuat diskusi baru agar dapat memulai percakapan dan kolaborasi pengetahuan. |
|   Impacted Stakeholders | User / Moderator / Admin                                                                                                          |
|      Business Objective | BR-02                                                                                                                             |

##### Use Case UC-B01: Create

|          UsecaseID | UC-B01                                                   |
| -----------------: | -------------------------------------------------------- |
|       Usecase Name | Ability to create discussion                             |
|             Actors | Primary: User; Secondary: System                         |
|     Pre Conditions | 1) User login                                            |
|      Primary Steps | 1. User membuka form buat diskusi                        |
|                    | 2. User mengisi judul dan isi diskusi                    |
|                    | 3. User mengirim diskusi                                 |
|                    | 4. Sistem memvalidasi data                               |
|                    | 5. Sistem menyimpan diskusi                              |
|                    | 6. Sistem mengembalikan respons sukses                   |
|    Alternate Steps | A1. Validasi gagal → sistem mengembalikan error validasi |
|                    | A2. Terjadi error server → sistem mengembalikan error    |
| Business Objective | BR-02                                                    |

###### Scenario SC-B01: Created

|         ScenarioID | SC-B01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Discussion created successfully                           |
|              GIVEN | User login                                                |
|               WHEN | User mengirim diskusi dengan data valid                   |
|               THEN | Sistem menyimpan diskusi dan mengembalikan respons sukses |
| Business Objective | BR-02                                                     |

###### Scenario SC-B02: Validation Error

|         ScenarioID | SC-B02                                                     |
| -----------------: | ---------------------------------------------------------- |
|      Scenario Name | Discussion creation failed due to validation error         |
|              GIVEN | User login                                                 |
|               WHEN | User mengirim diskusi dengan data tidak valid              |
|               THEN | Sistem menolak permintaan dan mengembalikan error validasi |
| Business Objective | BR-02                                                      |

---

#### Requirement R-B02: Edit Discussion

|           RequirementID | R-B02                                                                                                                                           |
| ----------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to edit discussion                                                                                                                      |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk mengubah konten diskusi yang telah dibuat agar kualitas dan kejelasan diskusi tetap terjaga. |
|   Impacted Stakeholders | User / Moderator / Admin                                                                                                                        |
|      Business Objective | BR-02                                                                                                                                           |

##### Use Case UC-B02: Edit

|          UsecaseID | UC-B02                                          |
| -----------------: | ----------------------------------------------- |
|       Usecase Name | Ability to edit discussion                      |
|             Actors | Primary: User; Secondary: System                |
|     Pre Conditions | 1) User login  2) User adalah pemilik diskusi   |
|      Primary Steps | 1. User membuka diskusi miliknya                |
|                    | 2. User memilih aksi edit                       |
|                    | 3. User mengubah konten diskusi                 |
|                    | 4. User mengirim perubahan                      |
|                    | 5. Sistem memvalidasi perubahan                 |
|                    | 6. Sistem menyimpan perubahan                   |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak akses   |
|                    | A2. Validasi gagal → sistem mengembalikan error |
| Business Objective | BR-02                                           |

###### Scenario SC-B03: Edit Success

|         ScenarioID | SC-B03                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Discussion edited successfully                           |
|              GIVEN | User login dan memiliki diskusi                          |
|               WHEN | User mengirim perubahan diskusi valid                    |
|               THEN | Sistem menyimpan perubahan dan menampilkan versi terbaru |
| Business Objective | BR-02                                                    |

---

#### Requirement R-B03: Delete Discussion

|           RequirementID | R-B03                                                                                                                                                                    |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        Requirement Name | Ability to delete discussion                                                                                                                                             |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk menghapus diskusi miliknya dengan mekanisme soft delete agar data tetap dapat diaudit dan dipulihkan jika diperlukan. |
|   Impacted Stakeholders | User / Moderator / Admin                                                                                                                                                 |
|      Business Objective | BR-02                                                                                                                                                                    |

##### Use Case UC-B03: Delete

|          UsecaseID | UC-B03                                        |
| -----------------: | --------------------------------------------- |
|       Usecase Name | Ability to delete discussion                  |
|             Actors | Primary: User; Secondary: System              |
|     Pre Conditions | 1) User login  2) User adalah pemilik diskusi |
|      Primary Steps | 1. User membuka diskusi miliknya              |
|                    | 2. User memilih aksi delete                   |
|                    | 3. Sistem melakukan soft delete               |
|                    | 4. Sistem mengembalikan respons sukses        |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak akses |
| Business Objective | BR-02                                         |

###### Scenario SC-B04: Soft Delete

|         ScenarioID | SC-B04                                                                                        |
| -----------------: | --------------------------------------------------------------------------------------------- |
|      Scenario Name | Discussion soft deleted successfully                                                          |
|              GIVEN | User login dan memiliki diskusi                                                               |
|               WHEN | User menghapus diskusi miliknya                                                               |
|               THEN | Sistem menandai diskusi sebagai terhapus (soft delete) dan tidak menampilkan di daftar publik |
| Business Objective | BR-02                                                                                         |

---

#### Requirement R-B04: View Discussion

|           RequirementID | R-B04                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to view discussion detail                                                                                                      |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk melihat detail diskusi agar dapat membaca konteks dan berpartisipasi dalam diskusi. |
|   Impacted Stakeholders | User / Expert / Moderator / Admin                                                                                                      |
|      Business Objective | BR-02                                                                                                                                  |

##### Use Case UC-B04: View

|          UsecaseID | UC-B04                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to view discussion detail                            |
|             Actors | Primary: User; Secondary: System                             |
|     Pre Conditions | Diskusi tersedia dan tidak dihapus                           |
|      Primary Steps | 1. User membuka daftar diskusi                               |
|                    | 2. User memilih salah satu diskusi                           |
|                    | 3. Sistem menampilkan detail diskusi                         |
|    Alternate Steps | A1. Diskusi tidak ditemukan → sistem mengembalikan not found |
| Business Objective | BR-02                                                        |

###### Scenario SC-B05: View Detail

|         ScenarioID | SC-B05                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | View discussion detail                    |
|              GIVEN | Diskusi tersedia                          |
|               WHEN | User membuka detail diskusi               |
|               THEN | Sistem menampilkan detail diskusi lengkap |
| Business Objective | BR-02                                     |

---

### MODULE: Answer & Comment

#### Requirement R-C01: Answer Discussion

|           RequirementID | R-C01                                                                                                                       |
| ----------------------: | --------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to answer discussion                                                                                                |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk menambahkan jawaban pada diskusi agar terjadi pertukaran ide dan solusi. |
|   Impacted Stakeholders | User / Expert / Moderator                                                                                                   |
|      Business Objective | BR-03                                                                                                                       |

##### Use Case UC-C01: Answer

|          UsecaseID | UC-C01                                          |
| -----------------: | ----------------------------------------------- |
|       Usecase Name | Ability to answer discussion                    |
|             Actors | Primary: User; Secondary: System                |
|     Pre Conditions | 1) User login  2) Diskusi tersedia              |
|      Primary Steps | 1. User membuka detail diskusi                  |
|                    | 2. User menulis jawaban                         |
|                    | 3. User mengirim jawaban                        |
|                    | 4. Sistem memvalidasi jawaban                   |
|                    | 5. Sistem menyimpan jawaban                     |
|    Alternate Steps | A1. Validasi gagal → sistem mengembalikan error |
| Business Objective | BR-03                                           |

###### Scenario SC-C01: Answer Added

|         ScenarioID | SC-C01                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Answer added successfully                                |
|              GIVEN | User login dan diskusi tersedia                          |
|               WHEN | User mengirim jawaban valid                              |
|               THEN | Sistem menyimpan jawaban dan menampilkannya pada diskusi |
| Business Objective | BR-03                                                    |

---

#### Requirement R-C02: Comment Content

|           RequirementID | R-C02                                                                                                                                                                |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to comment on content                                                                                                                                        |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk menambahkan komentar pada diskusi atau jawaban agar interaksi dan klarifikasi dapat dilakukan secara terstruktur. |
|   Impacted Stakeholders | User / Expert / Moderator                                                                                                                                            |
|      Business Objective | BR-03                                                                                                                                                                |

##### Use Case UC-C02: Comment

|          UsecaseID | UC-C02                                                      |
| -----------------: | ----------------------------------------------------------- |
|       Usecase Name | Ability to comment on content                               |
|             Actors | Primary: User; Secondary: System                            |
|     Pre Conditions | 1) User login  2) Konten tersedia                           |
|      Primary Steps | 1. User membuka konten target                               |
|                    | 2. User menulis komentar                                    |
|                    | 3. User mengirim komentar                                   |
|                    | 4. Sistem memvalidasi komentar                              |
|                    | 5. Sistem menyimpan komentar                                |
|    Alternate Steps | A1. Konten tidak ditemukan → sistem mengembalikan not found |
| Business Objective | BR-03                                                       |

###### Scenario SC-C02: Comment Added

|         ScenarioID | SC-C02                                       |
| -----------------: | -------------------------------------------- |
|      Scenario Name | Comment added successfully                   |
|              GIVEN | User login dan konten tersedia               |
|               WHEN | User mengirim komentar valid                 |
|               THEN | Sistem menyimpan komentar dan menampilkannya |
| Business Objective | BR-03                                        |

---

#### Requirement R-C03: Edit Answer

|           RequirementID | R-C03                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to edit answer                                                                                                                 |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk mengubah jawaban yang telah dibuat agar kualitas dan akurasi jawaban tetap terjaga. |
|   Impacted Stakeholders | User / Expert / Moderator                                                                                                              |
|      Business Objective | BR-03                                                                                                                                  |

##### Use Case UC-C03: Edit

|          UsecaseID | UC-C03                                        |
| -----------------: | --------------------------------------------- |
|       Usecase Name | Ability to edit answer                        |
|             Actors | Primary: User; Secondary: System              |
|     Pre Conditions | 1) User login  2) User adalah pemilik jawaban |
|      Primary Steps | 1. User membuka jawaban miliknya              |
|                    | 2. User memilih aksi edit                     |
|                    | 3. User mengubah isi jawaban                  |
|                    | 4. User mengirim perubahan                    |
|                    | 5. Sistem memvalidasi perubahan               |
|                    | 6. Sistem menyimpan perubahan                 |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak akses |
| Business Objective | BR-03                                         |

###### Scenario SC-C03: Edit Success

|         ScenarioID | SC-C03                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Answer edited successfully                               |
|              GIVEN | User login dan memiliki jawaban                          |
|               WHEN | User mengirim perubahan jawaban valid                    |
|               THEN | Sistem menyimpan perubahan dan menampilkan versi terbaru |
| Business Objective | BR-03                                                    |

---

#### Requirement R-C04: Delete Answer

|           RequirementID | R-C04                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to delete answer                                                                                                               |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk menghapus jawaban miliknya dengan mekanisme soft delete agar histori dapat diaudit. |
|   Impacted Stakeholders | User / Expert / Moderator                                                                                                              |
|      Business Objective | BR-03                                                                                                                                  |

##### Use Case UC-C04: Delete

|          UsecaseID | UC-C04                                        |
| -----------------: | --------------------------------------------- |
|       Usecase Name | Ability to delete answer                      |
|             Actors | Primary: User; Secondary: System              |
|     Pre Conditions | 1) User login  2) User adalah pemilik jawaban |
|      Primary Steps | 1. User membuka jawaban miliknya              |
|                    | 2. User memilih aksi delete                   |
|                    | 3. Sistem melakukan soft delete               |
|                    | 4. Sistem mengembalikan respons sukses        |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak akses |
| Business Objective | BR-03                                         |

###### Scenario SC-C04: Soft Delete

|         ScenarioID | SC-C04                                                                      |
| -----------------: | --------------------------------------------------------------------------- |
|      Scenario Name | Answer soft deleted successfully                                            |
|              GIVEN | User login dan memiliki jawaban                                             |
|               WHEN | User menghapus jawaban miliknya                                             |
|               THEN | Sistem menandai jawaban sebagai terhapus dan tidak menampilkan pada diskusi |
| Business Objective | BR-03                                                                       |

---

### MODULE: Voting & Reputation

#### Requirement R-D01: Vote Content

|           RequirementID | R-D01                                                                                                                                                              |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        Requirement Name | Ability to vote on content                                                                                                                                         |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk melakukan upvote atau downvote pada konten diskusi/jawaban/komentar sebagai sinyal kualitas berbasis komunitas. |
|   Impacted Stakeholders | User / Expert / Moderator / Admin                                                                                                                                  |
|      Business Objective | BR-04                                                                                                                                                              |

##### Use Case UC-D01: Vote

|          UsecaseID | UC-D01                                                      |
| -----------------: | ----------------------------------------------------------- |
|       Usecase Name | Ability to vote on content                                  |
|             Actors | Primary: User; Secondary: System                            |
|     Pre Conditions | 1) User login  2) Konten tersedia                           |
|      Primary Steps | 1. User memilih konten target                               |
|                    | 2. User memilih upvote/downvote                             |
|                    | 3. Sistem memvalidasi hak vote                              |
|                    | 4. Sistem menyimpan vote                                    |
|                    | 5. Sistem memperbarui skor konten                           |
|    Alternate Steps | A1. Konten tidak ditemukan → sistem mengembalikan not found |
|                    | A2. Vote tidak valid → sistem menolak permintaan            |
| Business Objective | BR-04                                                       |

###### Scenario SC-D01: Upvote

|         ScenarioID | SC-D01                                          |
| -----------------: | ----------------------------------------------- |
|      Scenario Name | Upvote content successfully                     |
|              GIVEN | User login dan konten tersedia                  |
|               WHEN | User melakukan upvote pada konten               |
|               THEN | Sistem menyimpan vote dan menaikkan skor konten |
| Business Objective | BR-04                                           |

###### Scenario SC-D02: Downvote

|         ScenarioID | SC-D02                                           |
| -----------------: | ------------------------------------------------ |
|      Scenario Name | Downvote content successfully                    |
|              GIVEN | User login dan konten tersedia                   |
|               WHEN | User melakukan downvote pada konten              |
|               THEN | Sistem menyimpan vote dan menurunkan skor konten |
| Business Objective | BR-04                                            |

---

#### Requirement R-D02: Undo Vote

|           RequirementID | R-D02                                                                                                                                      |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
|        Requirement Name | Ability to undo vote                                                                                                                       |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk membatalkan vote yang telah diberikan pada konten agar user dapat mengoreksi penilaian. |
|   Impacted Stakeholders | User / Expert                                                                                                                              |
|      Business Objective | BR-04                                                                                                                                      |

##### Use Case UC-D02: Undo

|          UsecaseID | UC-D02                                                    |
| -----------------: | --------------------------------------------------------- |
|       Usecase Name | Ability to undo vote                                      |
|             Actors | Primary: User; Secondary: System                          |
|     Pre Conditions | 1) User login  2) Vote sebelumnya ada                     |
|      Primary Steps | 1. User membuka konten yang sudah divote                  |
|                    | 2. User memilih undo vote                                 |
|                    | 3. Sistem menghapus vote                                  |
|                    | 4. Sistem memperbarui skor konten                         |
|    Alternate Steps | A1. Vote tidak ditemukan → sistem mengembalikan not found |
| Business Objective | BR-04                                                     |

###### Scenario SC-D03: Undo Vote

|         ScenarioID | SC-D03                                            |
| -----------------: | ------------------------------------------------- |
|      Scenario Name | Undo vote successfully                            |
|              GIVEN | User login dan vote sebelumnya ada                |
|               WHEN | User melakukan undo vote                          |
|               THEN | Sistem menghapus vote dan memperbarui skor konten |
| Business Objective | BR-04                                             |

---

#### Requirement R-D03: Reputation Calc

|           RequirementID | R-D03                                                                                                                        |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to calculate reputation                                                                                              |
| Requirement Description | Sistem harus menghitung reputasi berdasarkan aktivitas dan voting untuk memberikan indikator kontribusi user secara terukur. |
|   Impacted Stakeholders | User / Admin / System                                                                                                        |
|      Business Objective | BR-04                                                                                                                        |

##### Use Case UC-D03: Calculate

|          UsecaseID | UC-D03                                                           |
| -----------------: | ---------------------------------------------------------------- |
|       Usecase Name | Ability to calculate reputation                                  |
|             Actors | Primary: System; Secondary: User                                 |
|     Pre Conditions | 1) Terdapat data aktivitas dan voting                            |
|      Primary Steps | 1. Sistem memicu proses kalkulasi                                |
|                    | 2. Sistem menghitung reputasi user                               |
|                    | 3. Sistem menyimpan hasil reputasi                               |
|    Alternate Steps | A1. Data tidak lengkap → sistem menghitung dengan aturan default |
| Business Objective | BR-04                                                            |

###### Scenario SC-D04: Recalc

|         ScenarioID | SC-D04                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | Reputation recalculated                   |
|              GIVEN | Sistem memiliki data voting dan aktivitas |
|               WHEN | Sistem menjalankan job kalkulasi reputasi |
|               THEN | Sistem memperbarui nilai reputasi user    |
| Business Objective | BR-04                                     |

---

### MODULE: Report & Moderation

#### Requirement R-E01: Report Content

|           RequirementID | R-E01                                                                                                                                     |
| ----------------------: | ----------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to report content                                                                                                                 |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk melaporkan konten yang melanggar aturan agar keamanan dan etika diskusi tetap terjaga. |
|   Impacted Stakeholders | User / Moderator / Admin                                                                                                                  |
|      Business Objective | BR-05                                                                                                                                     |

##### Use Case UC-E01: Report

|          UsecaseID | UC-E01                                              |
| -----------------: | --------------------------------------------------- |
|       Usecase Name | Ability to report content                           |
|             Actors | Primary: User; Secondary: System                    |
|     Pre Conditions | 1) User login  2) Konten tersedia                   |
|      Primary Steps | 1. User memilih konten target                       |
|                    | 2. User memilih aksi report                         |
|                    | 3. User mengisi alasan laporan                      |
|                    | 4. User mengirim laporan                            |
|                    | 5. Sistem menyimpan laporan                         |
|    Alternate Steps | A1. Konten tidak ditemukan → sistem menolak laporan |
| Business Objective | BR-05                                               |

###### Scenario SC-E01: Report Submitted

|         ScenarioID | SC-E01                                                      |
| -----------------: | ----------------------------------------------------------- |
|      Scenario Name | Report submitted successfully                               |
|              GIVEN | User login dan konten tersedia                              |
|               WHEN | User mengirim laporan dengan alasan valid                   |
|               THEN | Sistem menyimpan laporan dan memasukkan ke antrian moderasi |
| Business Objective | BR-05                                                       |

---

#### Requirement R-E02: View Reports

|           RequirementID | R-E02                                                                                                                               |
| ----------------------: | ----------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to view report queue                                                                                                        |
| Requirement Description | Sistem harus menyediakan kemampuan bagi Moderator untuk melihat daftar laporan konten agar dapat diproses sesuai prosedur moderasi. |
|   Impacted Stakeholders | Moderator / Admin                                                                                                                   |
|      Business Objective | BR-05                                                                                                                               |

##### Use Case UC-E02: View

|          UsecaseID | UC-E02                                                 |
| -----------------: | ------------------------------------------------------ |
|       Usecase Name | Ability to view report queue                           |
|             Actors | Primary: Moderator; Secondary: System                  |
|     Pre Conditions | 1) Moderator login                                     |
|      Primary Steps | 1. Moderator membuka panel laporan                     |
|                    | 2. Sistem menampilkan daftar laporan                   |
|                    | 3. Moderator memilih laporan untuk detail              |
|    Alternate Steps | A1. Tidak ada laporan → sistem menampilkan empty state |
| Business Objective | BR-05                                                  |

###### Scenario SC-E02: View Queue

|         ScenarioID | SC-E02                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Moderator views report queue                             |
|              GIVEN | Moderator login                                          |
|               WHEN | Moderator membuka daftar laporan                         |
|               THEN | Sistem menampilkan daftar laporan yang menunggu diproses |
| Business Objective | BR-05                                                    |

---

#### Requirement R-E03: Process Report

|           RequirementID | R-E03                                                                                                                                                        |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        Requirement Name | Ability to resolve reported content                                                                                                                          |
| Requirement Description | Sistem harus menyediakan kemampuan bagi Moderator untuk memproses laporan dan mengambil tindakan moderasi (mis. hide konten) untuk menjaga keamanan diskusi. |
|   Impacted Stakeholders | Moderator / Admin / User                                                                                                                                     |
|      Business Objective | BR-05                                                                                                                                                        |

##### Use Case UC-E03: Process

|          UsecaseID | UC-E03                                                 |
| -----------------: | ------------------------------------------------------ |
|       Usecase Name | Ability to process report resolution                   |
|             Actors | Primary: Moderator; Secondary: System                  |
|     Pre Conditions | 1) Moderator login  2) Ada laporan pending             |
|      Primary Steps | 1. Moderator membuka detail laporan                    |
|                    | 2. Moderator memilih tindakan resolve                  |
|                    | 3. Sistem menandai laporan sebagai resolved            |
|                    | 4. Sistem melakukan tindakan (hide content)            |
|    Alternate Steps | A1. Laporan sudah diproses → sistem menolak aksi ganda |
| Business Objective | BR-05                                                  |

###### Scenario SC-E03: Hide Content

|         ScenarioID | SC-E03                                                                  |
| -----------------: | ----------------------------------------------------------------------- |
|      Scenario Name | Moderator hides reported content                                        |
|              GIVEN | Moderator login dan laporan pending tersedia                            |
|               WHEN | Moderator menyelesaikan laporan dengan tindakan hide content            |
|               THEN | Sistem menyembunyikan konten dari publik dan memperbarui status laporan |
| Business Objective | BR-05                                                                   |

---

#### Requirement R-E04: Escalate Report

|           RequirementID | R-E04                                                                                                                                        |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to escalate report to admin                                                                                                          |
| Requirement Description | Sistem harus menyediakan kemampuan bagi Moderator untuk melakukan eskalasi laporan ke Admin ketika kasus membutuhkan keputusan lebih lanjut. |
|   Impacted Stakeholders | Moderator / Admin                                                                                                                            |
|      Business Objective | BR-05                                                                                                                                        |

##### Use Case UC-E04: Escalate

|          UsecaseID | UC-E04                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to escalate report                                   |
|             Actors | Primary: Moderator; Secondary: System                        |
|     Pre Conditions | 1) Moderator login  2) Laporan pending tersedia              |
|      Primary Steps | 1. Moderator membuka detail laporan                          |
|                    | 2. Moderator memilih aksi escalate                           |
|                    | 3. Sistem menandai laporan sebagai escalated                 |
|                    | 4. Sistem mengirim laporan ke admin queue                    |
|    Alternate Steps | A1. Laporan tidak ditemukan → sistem mengembalikan not found |
| Business Objective | BR-05                                                        |

###### Scenario SC-E04: Escalated

|         ScenarioID | SC-E04                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Report escalated to admin                                          |
|              GIVEN | Moderator login dan laporan pending tersedia                       |
|               WHEN | Moderator melakukan eskalasi laporan                               |
|               THEN | Sistem menandai laporan sebagai escalated dan tersedia untuk admin |
| Business Objective | BR-05                                                              |

---

### MODULE: Verified Expert

#### Requirement R-F01: Apply Expert

|           RequirementID | R-F01                                                                                                                                              |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to apply for verified expert                                                                                                               |
| Requirement Description | Sistem harus menyediakan kemampuan bagi User untuk mengajukan verifikasi pakar dengan mengirim data pendukung agar kredibilitas jawaban meningkat. |
|   Impacted Stakeholders | User / Admin                                                                                                                                       |
|      Business Objective | BR-06                                                                                                                                              |

##### Use Case UC-F01: Apply

|          UsecaseID | UC-F01                                               |
| -----------------: | ---------------------------------------------------- |
|       Usecase Name | Ability to apply for verified expert                 |
|             Actors | Primary: User; Secondary: System                     |
|     Pre Conditions | 1) User login                                        |
|      Primary Steps | 1. User membuka form apply expert                    |
|                    | 2. User mengisi data bidang keahlian                 |
|                    | 3. User mengunggah dokumen pendukung                 |
|                    | 4. User mengirim permohonan                          |
|                    | 5. Sistem menyimpan permohonan dengan status pending |
|    Alternate Steps | A1. Dokumen tidak valid → sistem menolak permohonan  |
| Business Objective | BR-06                                                |

###### Scenario SC-F01: Submitted

|         ScenarioID | SC-F01                                            |
| -----------------: | ------------------------------------------------- |
|      Scenario Name | Expert verification request submitted             |
|              GIVEN | User login                                        |
|               WHEN | User mengirim permohonan verifikasi lengkap       |
|               THEN | Sistem menyimpan permohonan dengan status pending |
| Business Objective | BR-06                                             |

---

#### Requirement R-F02: Review Expert

|           RequirementID | R-F02                                                                                                                                 |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to review expert application                                                                                                  |
| Requirement Description | Sistem harus menyediakan kemampuan bagi Admin untuk meninjau permohonan verifikasi pakar dan mengambil keputusan approve atau reject. |
|   Impacted Stakeholders | Admin / User                                                                                                                          |
|      Business Objective | BR-06                                                                                                                                 |

##### Use Case UC-F02: Review

|          UsecaseID | UC-F02                                               |
| -----------------: | ---------------------------------------------------- |
|       Usecase Name | Ability to review expert application                 |
|             Actors | Primary: Admin; Secondary: System                    |
|     Pre Conditions | 1) Admin login  2) Ada permohonan pending            |
|      Primary Steps | 1. Admin membuka daftar permohonan                   |
|                    | 2. Admin memilih permohonan untuk ditinjau           |
|                    | 3. Admin memeriksa dokumen pendukung                 |
|                    | 4. Admin memilih approve/reject                      |
|                    | 5. Sistem memperbarui status permohonan              |
|    Alternate Steps | A1. Dokumen tidak cukup → Admin reject dengan alasan |
| Business Objective | BR-06                                                |

###### Scenario SC-F02: Approved

|         ScenarioID | SC-F02                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | Expert application approved                                              |
|              GIVEN | Admin login dan permohonan pending tersedia                              |
|               WHEN | Admin menyetujui permohonan verifikasi                                   |
|               THEN | Sistem mengubah status menjadi approved dan user menjadi verified expert |
| Business Objective | BR-06                                                                    |

###### Scenario SC-F03: Rejected

|         ScenarioID | SC-F03                                                                 |
| -----------------: | ---------------------------------------------------------------------- |
|      Scenario Name | Expert application rejected                                            |
|              GIVEN | Admin login dan permohonan pending tersedia                            |
|               WHEN | Admin menolak permohonan verifikasi                                    |
|               THEN | Sistem mengubah status menjadi rejected dan menyimpan alasan penolakan |
| Business Objective | BR-06                                                                  |

---

### MODULE: Admin & System

#### Requirement R-G01: RBAC

|           RequirementID | R-G01                                                                                                                                                        |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        Requirement Name | Ability to enforce role-based access                                                                                                                         |
| Requirement Description | Sistem harus menegakkan kontrol akses berbasis role pada setiap endpoint dan fitur untuk memastikan hanya role yang berwenang dapat melakukan aksi tertentu. |
|   Impacted Stakeholders | User / Expert / Moderator / Admin / System                                                                                                                   |
|      Business Objective | BR-07                                                                                                                                                        |

##### Use Case UC-G01: Enforce Role

|          UsecaseID | UC-G01                                   |
| -----------------: | ---------------------------------------- |
|       Usecase Name | Ability to enforce role-based access     |
|             Actors | Primary: System; Secondary: User         |
|     Pre Conditions | Endpoint dilindungi oleh middleware      |
|      Primary Steps | 1. User mengakses endpoint               |
|                    | 2. Sistem memvalidasi token              |
|                    | 3. Sistem memeriksa role user            |
|                    | 4. Sistem mengizinkan atau menolak akses |
|    Alternate Steps | A1. Token invalid → sistem menolak akses |
| Business Objective | BR-07                                    |

###### Scenario SC-G01: Unauthorized

|         ScenarioID | SC-G01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Unauthorized access blocked                               |
|              GIVEN | User login namun tidak memiliki role yang sesuai          |
|               WHEN | User mencoba mengakses endpoint terproteksi               |
|               THEN | Sistem menolak akses dengan status unauthorized/forbidden |
| Business Objective | BR-07                                                     |

---

#### Requirement R-G02: Audit Log

|           RequirementID | R-G02                                                                                                                                        |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to log system actions                                                                                                                |
| Requirement Description | Sistem harus mencatat aktivitas penting (auth, moderasi, approval) sebagai audit log untuk kebutuhan akuntabilitas dan penelusuran kejadian. |
|   Impacted Stakeholders | Moderator / Admin / System                                                                                                                   |
|      Business Objective | BR-07                                                                                                                                        |

##### Use Case UC-G02: Log Action

|          UsecaseID | UC-G02                                                                                      |
| -----------------: | ------------------------------------------------------------------------------------------- |
|       Usecase Name | Ability to log system actions                                                               |
|             Actors | Primary: System; Secondary: Admin                                                           |
|     Pre Conditions | Ada aksi yang perlu dicatat                                                                 |
|      Primary Steps | 1. Sistem menangkap event aksi                                                              |
|                    | 2. Sistem menyimpan audit log                                                               |
|                    | 3. Sistem mengaitkan log ke actor dan resource                                              |
|    Alternate Steps | A1. Penyimpanan log gagal → sistem tetap menjalankan aksi utama dan mencatat error internal |
| Business Objective | BR-07                                                                                       |

###### Scenario SC-G02: Logged

|         ScenarioID | SC-G02                                           |
| -----------------: | ------------------------------------------------ |
|      Scenario Name | System action logged successfully                |
|              GIVEN | Sistem menerima aksi penting                     |
|               WHEN | Sistem menyimpan audit log                       |
|               THEN | Audit log tercatat dengan actor, waktu, dan aksi |
| Business Objective | BR-07                                            |

---

#### Requirement R-G03: Dashboard

|           RequirementID | R-G03                                                                                                            |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to view admin dashboard                                                                                  |
| Requirement Description | Sistem harus menyediakan dashboard admin untuk menampilkan ringkasan aktivitas dan indikator operasional sistem. |
|   Impacted Stakeholders | Admin / System                                                                                                   |
|      Business Objective | BR-07                                                                                                            |

##### Use Case UC-G03: View

|          UsecaseID | UC-G03                                                                 |
| -----------------: | ---------------------------------------------------------------------- |
|       Usecase Name | Ability to view admin dashboard                                        |
|             Actors | Primary: Admin; Secondary: System                                      |
|     Pre Conditions | 1) Admin login                                                         |
|      Primary Steps | 1. Admin membuka halaman dashboard                                     |
|                    | 2. Sistem mengambil data ringkasan                                     |
|                    | 3. Sistem menampilkan dashboard                                        |
|    Alternate Steps | A1. Data tidak tersedia → sistem menampilkan nilai default/empty state |
| Business Objective | BR-07                                                                  |

###### Scenario SC-G03: Dashboard

|         ScenarioID | SC-G03                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Admin dashboard displayed                          |
|              GIVEN | Admin login                                        |
|               WHEN | Admin membuka dashboard admin                      |
|               THEN | Sistem menampilkan ringkasan indikator operasional |
| Business Objective | BR-07                                              |

---

## 8) TRACEABILITY MATRIX — MVP OLION

Setiap entri SIAP dipetakan, Legend:

* **BRD-ID** → Business Objective / Requirement di BRD
* **REQ-ID** → Requirement (SRS)
* **UC-ID** → Use Case
* **SC-ID** → Scenario (BDD)
* **TC-ID** → Test Case
* **API** → Endpoint utama
* **ROLE** → Role yang terlibat

### A. AUTHENTICATION & ACCOUNT

| BRD-ID | Business Objective                               |
| ------ | ------------------------------------------------ |
| BR-01  | Menyediakan akses aman dan anonimitas terkontrol |

| REQ-ID                  | UC-ID           | SC-ID                  | TC-ID  | API                 | ROLE |
| ----------------------- | --------------- | ---------------------- | ------ | ------------------- | ---- |
| R-A01 User Registration | UC-A01 Register | SC-A01 Success         | TC-A01 | POST /auth/register | User |
|                         |                 | SC-A02 Email Duplicate | TC-A02 | POST /auth/register | User |
| R-A02 Login Session     | UC-A02 Login    | SC-A03 Login Success   | TC-A03 | POST /auth/login    | User |
|                         |                 | SC-A04 Invalid Login   | TC-A04 | POST /auth/login    | User |
| R-A03 Logout            | UC-A03 Logout   | SC-A05 Logout Success  | TC-A05 | POST /auth/logout   | User |

### B. DISCUSSION & CONTENT

| BRD-ID | Business Objective                        |
| ------ | ----------------------------------------- |
| BR-02  | Mendorong diskusi terbuka dan kolaboratif |

| REQ-ID                  | UC-ID         | SC-ID                   | TC-ID  | API                      | ROLE |
| ----------------------- | ------------- | ----------------------- | ------ | ------------------------ | ---- |
| R-B01 Create Discussion | UC-B01 Create | SC-B01 Created          | TC-B01 | POST /discussions        | User |
|                         |               | SC-B02 Validation Error | TC-B02 | POST /discussions        | User |
| R-B02 Edit Discussion   | UC-B02 Edit   | SC-B03 Edit Success     | TC-B03 | PUT /discussions/{id}    | User |
| R-B03 Delete Discussion | UC-B03 Delete | SC-B04 Soft Delete      | TC-B04 | DELETE /discussions/{id} | User |
| R-B04 View Discussion   | UC-B04 View   | SC-B05 View Detail      | TC-B05 | GET /discussions/{id}    | User |

### C. ANSWER & COMMENT

| BRD-ID | Business Objective                        |
| ------ | ----------------------------------------- |
| BR-03  | Memfasilitasi kolaborasi & pertukaran ide |

| REQ-ID                  | UC-ID          | SC-ID                | TC-ID  | API                  | ROLE |
| ----------------------- | -------------- | -------------------- | ------ | -------------------- | ---- |
| R-C01 Answer Discussion | UC-C01 Answer  | SC-C01 Answer Added  | TC-C01 | POST /answers        | User |
| R-C02 Comment Content   | UC-C02 Comment | SC-C02 Comment Added | TC-C02 | POST /comments       | User |
| R-C03 Edit Answer       | UC-C03 Edit    | SC-C03 Edit Success  | TC-C03 | PUT /answers/{id}    | User |
| R-C04 Delete Answer     | UC-C04 Delete  | SC-C04 Soft Delete   | TC-C04 | DELETE /answers/{id} | User |

### D. VOTING & REPUTATION

| BRD-ID | Business Objective                         |
| ------ | ------------------------------------------ |
| BR-04  | Menjaga kualitas konten berbasis komunitas |

| REQ-ID                | UC-ID            | SC-ID            | TC-ID  | API                | ROLE   |
| --------------------- | ---------------- | ---------------- | ------ | ------------------ | ------ |
| R-D01 Vote Content    | UC-D01 Vote      | SC-D01 Upvote    | TC-D01 | POST /votes        | User   |
|                       |                  | SC-D02 Downvote  | TC-D02 | POST /votes        | User   |
| R-D02 Undo Vote       | UC-D02 Undo      | SC-D03 Undo Vote | TC-D03 | DELETE /votes/{id} | User   |
| R-D03 Reputation Calc | UC-D03 Calculate | SC-D04 Recalc    | TC-D04 | INTERNAL JOB       | System |

### E. REPORT & MODERATION

| BRD-ID | Business Objective                 |
| ------ | ---------------------------------- |
| BR-05  | Menjaga keamanan dan etika diskusi |

| REQ-ID                | UC-ID           | SC-ID                   | TC-ID  | API                               | ROLE      |
| --------------------- | --------------- | ----------------------- | ------ | --------------------------------- | --------- |
| R-E01 Report Content  | UC-E01 Report   | SC-E01 Report Submitted | TC-E01 | POST /reports                     | User      |
| R-E02 View Reports    | UC-E02 View     | SC-E02 View Queue       | TC-E02 | GET /admin/reports                | Moderator |
| R-E03 Process Report  | UC-E03 Process  | SC-E03 Hide Content     | TC-E03 | POST /admin/reports/{id}/resolve  | Moderator |
| R-E04 Escalate Report | UC-E04 Escalate | SC-E04 Escalated        | TC-E04 | POST /admin/reports/{id}/escalate | Moderator |

### F. VERIFIED EXPERT

| BRD-ID | Business Objective                |
| ------ | --------------------------------- |
| BR-06  | Meningkatkan kredibilitas jawaban |

| REQ-ID              | UC-ID         | SC-ID            | TC-ID  | API                        | ROLE  |
| ------------------- | ------------- | ---------------- | ------ | -------------------------- | ----- |
| R-F01 Apply Expert  | UC-F01 Apply  | SC-F01 Submitted | TC-F01 | POST /expert/apply         | User  |
| R-F02 Review Expert | UC-F02 Review | SC-F02 Approved  | TC-F02 | POST /admin/expert/approve | Admin |
|                     |               | SC-F03 Rejected  | TC-F03 | POST /admin/expert/reject  | Admin |

### G. ADMIN & SYSTEM

| BRD-ID | Business Objective                 |
| ------ | ---------------------------------- |
| BR-07  | Operasional dan pengelolaan sistem |

| REQ-ID          | UC-ID               | SC-ID               | TC-ID  | API                  | ROLE   |
| --------------- | ------------------- | ------------------- | ------ | -------------------- | ------ |
| R-G01 RBAC      | UC-G01 Enforce Role | SC-G01 Unauthorized | TC-G01 | Middleware           | System |
| R-G02 Audit Log | UC-G02 Log Action   | SC-G02 Logged       | TC-G02 | INTERNAL             | System |
| R-G03 Dashboard | UC-G03 View         | SC-G03 Dashboard    | TC-G03 | GET /admin/dashboard | Admin  |

### H. NON-FUNCTIONAL TRACEABILITY (NFR)

| NFR-ID                  | Category                         | Covered By |
| ----------------------- | -------------------------------- | ---------- |
| NFR-A01 Security        | Auth, RBAC, JWT, Hashing         |            |
| NFR-A02 Privacy         | Pseudonym, No real-name exposure |            |
| NFR-B01 Performance     | Pagination, Lazy Load            |            |
| NFR-C02 Auditability    | Audit Log, Moderation History    |            |
| NFR-D01 Reliability     | Soft Delete, Transaction         |            |
| NFR-F01 Maintainability | Modular Service                  |            |
| NFR-F06 Reproducibility | CI/CD & Docker                   |            |

---

## 9) Deliverables

Deliverables utama proyek **OLION**:

1. **Frontend Web Application (Role-Based UI)**
   Aplikasi web untuk pengguna (User/Expert/Moderator/Admin) dengan tampilan dan akses fitur sesuai role, mencakup halaman autentikasi, forum diskusi, detail diskusi, serta panel admin/moderator.

2. **Backend REST API**
   Layanan API yang menangani autentikasi, manajemen user & role, forum diskusi (diskusi/jawaban/komentar), voting, reputasi, report, moderasi, serta verifikasi pakar.

3. **Database Schema + Migration/Seed**
   Struktur database final (tabel & relasi) beserta migration untuk pembentukan schema dan seed data untuk kebutuhan pengujian awal (contoh: kategori default, akun admin).

4. **Dokumentasi Proyek**
   Paket dokumentasi final OLION yang mencakup Project Charter, Proposal, BRD, SRS, diagram (DFD, Use Case, Activity, ERD), desain database, arsitektur sistem, UI/UX, serta dokumentasi API.

5. **Testing Report + Evidence**
   Dokumen pengujian yang berisi Test Plan, Test Cases, hasil pengujian (PASS/FAIL), serta bukti pengujian berupa screenshot/log untuk mendukung validasi sistem.

6. **Deployment Package**
   Paket rilis siap deploy yang mencakup konfigurasi environment (`.env.example`), panduan deployment, serta langkah menjalankan frontend dan backend pada environment staging/production.

---

## 10) External Interface Requirements

Bagian ini mendefinisikan kebutuhan antarmuka eksternal yang digunakan oleh sistem OLION untuk berinteraksi dengan pengguna, sistem lain, dan lingkungan teknis.

### 10.1 User Interface (UI)

- Sistem harus menyediakan antarmuka berbasis web yang dapat diakses melalui browser modern (Chrome, Firefox, Edge, Safari).
- UI harus responsif dan dapat digunakan pada perangkat desktop dan mobile.
- Tampilan UI harus menyesuaikan role pengguna (User, Expert, Moderator, Admin).
- Informasi identitas publik pengguna harus ditampilkan dalam bentuk pseudonym.
- Panel Admin dan Moderator harus terpisah dari UI pengguna umum.

### 10.2 Software Interface

- Backend sistem harus menyediakan RESTful API sebagai antarmuka komunikasi antara frontend dan backend.
- API harus menggunakan format data JSON.
- API harus dilindungi oleh mekanisme autentikasi dan otorisasi berbasis token (JWT).
- Dokumentasi API harus tersedia melalui Swagger/OpenAPI atau Postman Collection.

### 10.3 Database Interface

- Sistem menggunakan database relasional untuk menyimpan data pengguna, diskusi, jawaban, komentar, voting, report, dan reputasi.
- Akses database hanya diperbolehkan melalui backend service (tidak ada akses langsung dari frontend).
- Perubahan struktur database harus dilakukan melalui mekanisme migration.

### 10.4 Communication Interface

- Sistem berkomunikasi melalui protokol HTTP/HTTPS.
- Semua komunikasi data sensitif harus menggunakan HTTPS.
- Tidak ada komunikasi real-time (socket) pada tahap MVP.

---

## 11) Out of Scope

Fitur dan kemampuan berikut tidak termasuk dalam ruang lingkup pengembangan sistem OLION pada tahap MVP, dan dapat dipertimbangkan pada fase pengembangan selanjutnya:

- Chat real-time (socket)
- Video call / voice room
- AI moderation penuh otomatis
- Monetisasi (premium/subscription)
- Sistem rekomendasi ML yang kompleks
- Aplikasi mobile native (Android/iOS)
- Integrasi dengan sistem pihak ketiga non-esensial

---

## 12) Acceptance Criteria (MVP)

Sistem OLION dinyatakan diterima pada tahap MVP apabila memenuhi kriteria berikut:

### 12.1 Functional Acceptance Criteria

- Pengguna dapat melakukan registrasi, login, dan logout dengan sukses.
- Pengguna dapat membuat diskusi, jawaban, dan komentar.
- Sistem menampilkan pseudonym sebagai identitas publik pengguna.
- Pengguna dapat melakukan voting dan report terhadap konten.
- Moderator/Admin dapat melihat dan memproses laporan.
- Admin dapat melakukan verifikasi dan pencabutan status Verified Expert.
- Hak akses berjalan sesuai dengan role (RBAC).

### 12.2 Non-Functional Acceptance Criteria

- Sistem berjalan stabil tanpa crash pada alur utama (end-to-end flow).
- Akses tidak sah ke endpoint dilindungi oleh autentikasi dan otorisasi.
- Data tersimpan dengan konsisten dan tidak terjadi inkonsistensi relasi.
- UI dapat digunakan dengan baik pada browser desktop dan mobile.
- Dokumentasi API dan deployment tersedia dan dapat digunakan.

### 12.3 Deliverable Acceptance Criteria

- Source code tersusun rapi dan modular.
- Dokumentasi (BRD, SRS, diagram, API docs) tersedia dan sinkron dengan implementasi.
- Test Plan, Test Cases, dan Test Evidence tersedia untuk fitur inti.
- Sistem dapat dijalankan kembali menggunakan Deployment Guide yang disediakan.

---

## 13) Approval

Bagian ini berfungsi sebagai pernyataan persetujuan resmi terhadap isi Business Requirement Document (BRD) OLION. Dengan menandatangani bagian ini, pihak terkait menyatakan bahwa seluruh kebutuhan bisnis, ruang lingkup, asumsi, dan batasan yang tertuang dalam dokumen ini telah dipahami, disetujui, dan akan menjadi acuan utama dalam pengembangan proyek.

### 13.1 Sign-off

| Name | Role | Signature | Date |
|------|:----:|:---------:|------|
| beel | Project Owner / Developer | __________ | 03-02-2026 |

**Approved By: beel**
**Role: Project Owner**
**Date: 03-02-2026**