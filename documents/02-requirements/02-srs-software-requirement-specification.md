# Software Requirements Specification (SRS)

**Project Name:** OLION
**Document Type:** Software Requirements Specification (SRS)
**Owner/Developer:** beel (Solo Fullstack)
**Version:** 1.0
**Last Update:** 2026-01-28

## 1) Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan kebutuhan perangkat lunak untuk proyek **OLION** dalam bentuk:

* Functional Requirements (FR)
* Non-Functional Requirements (NFR)

SRS digunakan sebagai acuan implementasi backend, frontend, database, serta pengujian sistem.

### 1.2 Ruang Lingkup Sistem (Ringkas)

OLION adalah platform diskusi berbasis web yang mengusung **pseudonimitas (anonimitas terkontrol)** untuk menciptakan ruang diskusi yang aman, terstruktur, dan kolaboratif. Sistem dilengkapi voting, reputasi, report, moderasi, dan Verified Expert.

### 1.3 Definisi, Akronim, dan Istilah

* **FR:** Functional Requirement
* **NFR:** Non-Functional Requirement
* **RBAC:** Role-Based Access Control
* **Pseudonym:** Identitas publik samaran pengguna
* **Verified Expert:** Pakar terverifikasi oleh Admin
* **Moderation Queue:** Antrian laporan untuk diproses Moderator/Admin

## 2) Deskripsi Umum Sistem

### 2.1 Perspektif Produk

OLION adalah aplikasi web yang terdiri dari:

* Frontend Web Application (role-based UI)
* Backend REST API
* Database (schema + migration/seed)

### 2.2 Kelas Pengguna (User Classes)

* **User:** pengguna umum
* **Expert:** user dengan label Verified Expert (setelah verifikasi)
* **Moderator:** memproses laporan dan moderasi konten
* **Admin:** manajemen user, kategori, verifikasi expert, kontrol sistem dasar

### 2.3 Asumsi dan Ketergantungan

* Pengguna wajib login untuk membuat konten.
* Konten MVP berbasis teks (link diperbolehkan).
* Deployment mengikuti resource (local/VPS/Docker).

## 3) Business Rules (Aturan Bisnis)

Aturan bisnis berikut menjadi batasan implementasi sistem:

### 3.1 Identitas & Pseudonym

* Pseudonym adalah identitas publik utama.
* Pseudonym dibuat otomatis saat registrasi.
* Pseudonym dapat diubah dengan cooldown minimal **7 hari**.
* Pseudonym harus **unik**.
* Format pseudonym hanya: huruf, angka, underscore (`_`).

### 3.2 Akun & Autentikasi

* Login menggunakan **email + password**.
* Akun suspended/banned bersifat **read-only** (hanya bisa melihat konten).

### 3.3 Konten

* Edit konten maksimal **24 jam** setelah dibuat.
* Delete konten oleh user adalah **soft delete**.
* Hard delete hanya oleh Admin.
* Konten MVP adalah **text-only**, link diperbolehkan.

### 3.4 Voting & Reputasi

* Voting berlaku untuk diskusi, jawaban, komentar.
* 1 user hanya dapat memberikan 1 vote per konten.
* Vote dapat dibatalkan (undo).
* Downvote diaktifkan pada MVP.

### 3.5 Report & Moderasi

* Report wajib memilih reason: Spam, Harassment/Bullying, Hate Speech, Misinformation, Other.
* Aksi moderasi minimal: hide content, resolve report, warn user.

### 3.6 Verified Expert

* Status expert: pending → approved/rejected → revoked.
* Admin dapat mencabut status Verified Expert (revoked).

## 4) Functional Requirements (FR)

### A. Autentikasi & Akun

* **FR-01** Sistem harus menyediakan fitur register menggunakan email dan password.
* **FR-02** Sistem harus menyediakan fitur login menggunakan email dan password.
* **FR-03** Sistem harus menyediakan fitur logout untuk mengakhiri sesi pengguna.
* **FR-04** Sistem harus menghasilkan pseudonym default secara otomatis saat registrasi.
* **FR-05** Sistem harus mengizinkan user mengubah pseudonym dengan aturan: unik + format valid + cooldown 7 hari.
* **FR-06** Sistem harus menerapkan RBAC untuk role: User, Expert, Moderator, Admin.
* **FR-07** Sistem harus membatasi akun suspended/banned menjadi read-only (hanya bisa melihat konten).

### B. Forum Diskusi

* **FR-08** Sistem harus memungkinkan user membuat diskusi baru (text-only, link diperbolehkan).
* **FR-09** Sistem harus menampilkan daftar diskusi dengan pagination.
* **FR-10** Sistem harus menampilkan detail diskusi beserta jawaban dan komentar.
* **FR-11** Sistem harus memungkinkan user mengedit diskusi miliknya dalam waktu maksimal 24 jam.
* **FR-12** Sistem harus memungkinkan user melakukan soft delete diskusi miliknya.
* **FR-13** Sistem harus memungkinkan user membuat jawaban pada diskusi.
* **FR-14** Sistem harus memungkinkan user membuat komentar pada diskusi atau jawaban.
* **FR-15** Sistem harus memungkinkan user mengedit jawaban/komentar miliknya dalam waktu maksimal 24 jam.
* **FR-16** Sistem harus memungkinkan user melakukan soft delete jawaban/komentar miliknya.
* **FR-17** Sistem harus menyediakan fitur search diskusi berdasarkan keyword.
* **FR-18** Sistem harus mendukung kategori diskusi (jika modul kategori aktif).

### C. Voting & Reputasi

* **FR-19** Sistem harus menyediakan fitur upvote/downvote untuk diskusi, jawaban, dan komentar.
* **FR-20** Sistem harus memastikan 1 user hanya dapat memberikan 1 vote per konten.
* **FR-21** Sistem harus mengizinkan user melakukan undo vote.
* **FR-22** Sistem harus menghitung score vote untuk setiap konten.
* **FR-23** Sistem harus menerapkan reputasi basic berdasarkan kontribusi dan voting.

### D. Report & Moderasi

* **FR-24** Sistem harus menyediakan fitur report konten (diskusi/jawaban/komentar).
* **FR-25** Sistem harus mewajibkan user memilih reason report: Spam, Harassment/Bullying, Hate Speech, Misinformation, Other.
* **FR-26** Sistem harus menyimpan report dalam status antrian untuk diproses (moderation queue).
* **FR-27** Sistem harus memungkinkan Moderator/Admin melihat daftar report yang masuk.
* **FR-28** Sistem harus memungkinkan Moderator/Admin melakukan tindakan: hide content.
* **FR-29** Sistem harus memungkinkan Moderator/Admin melakukan tindakan: resolve report.
* **FR-30** Sistem harus memungkinkan Moderator/Admin melakukan tindakan: warn user.

### E. Verified Expert

* **FR-31** Sistem harus memungkinkan user mengajukan Expert Verification Request.
* **FR-32** Sistem harus menerima data pengajuan expert berupa dokumen/sertifikat/CV/link portofolio.
* **FR-33** Sistem harus memungkinkan Admin melakukan approve/reject pengajuan expert.
* **FR-34** Sistem harus memungkinkan Admin melakukan revoke status expert jika diperlukan.
* **FR-35** Sistem harus menampilkan label Verified Expert pada profil dan kontribusi user yang berstatus expert.

### F. Admin & Moderator Panel

* **FR-36** Sistem harus menyediakan halaman panel untuk Admin/Moderator sesuai hak akses.
* **FR-37** Sistem harus memungkinkan Admin melakukan manajemen user (lihat user + role).
* **FR-38** Sistem harus memungkinkan Admin mengubah role user sesuai kebijakan.
* **FR-39** Sistem harus memungkinkan Admin melakukan manajemen kategori (jika modul kategori aktif).

### G. Dokumentasi, Testing, Deployment

* **FR-40** Sistem harus menyediakan API Documentation (Swagger atau Postman Collection).
* **FR-41** Sistem harus menyediakan Test Plan dan Test Cases untuk fitur inti.
* **FR-42** Sistem harus menyediakan Testing Evidence (screenshot/log) untuk pembuktian pengujian.
* **FR-43** Sistem harus menyediakan Deployment Guide dasar untuk menjalankan sistem.

## 5) Non-Functional Requirements (NFR)

* **NFR-01 (Security - RBAC)** Sistem harus menerapkan proteksi endpoint berbasis role (RBAC).
* **NFR-02 (Privacy - Pseudonymity)** Sistem harus memastikan identitas publik menggunakan pseudonym dan tidak membocorkan identitas asli.
* **NFR-03 (Performance)** Endpoint utama harus memiliki performa stabil untuk penggunaan normal.
* **NFR-04 (Reliability)** Sistem harus berjalan stabil pada alur utama end-to-end tanpa crash.
* **NFR-05 (Data Integrity)** Sistem harus menjaga konsistensi data melalui relasi database dan validasi input.
* **NFR-06 (Usability)** UI harus mudah digunakan dan navigasi diskusi jelas.
* **NFR-07 (Maintainability)** Struktur kode harus modular dan mudah dikembangkan.
* **NFR-08 (Auditability)** Aktivitas moderasi harus dapat dilacak untuk evaluasi dan akuntabilitas.
* **NFR-09 (Compatibility)** Sistem harus berjalan pada browser modern dan responsif untuk mobile.
* **NFR-10 (Documentation Quality)** Dokumentasi harus sinkron dengan implementasi (API, DB schema, role permission).

## 6) Traceability (Opsional tapi Direkomendasikan)

Bagian ini digunakan untuk mapping:

* BRD → SRS (FR/NFR)
* SRS → Test Cases
* SRS → Endpoint API

