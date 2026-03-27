# Context Diagram — DFD Level 0  
**System Name:** OLION  
**Document ID:** OLION-ANL-DFD0  
**Version:** 1.0  
**Status:** Approved for Level-1 Expansion  
**Authoring Phase:** System Analysis  
**Last Updated:** 2026-03-27

---

# 1. Document Purpose

Dokumen ini mendefinisikan **Context Diagram (DFD Level 0)** untuk sistem **OLION** sebagai representasi tertinggi dari interaksi eksternal sistem.

Tujuan utama dokumen ini adalah:

- Mendefinisikan **batas sistem (system boundary)**
- Mengidentifikasi **entitas eksternal**
- Menentukan **aliran data utama**
- Menjadi dasar validasi sebelum pengembangan **DFD Level 1**
- Menjaga konsistensi desain terhadap domain sistem

Dokumen ini harus dibaca sebagai referensi resmi untuk seluruh artefak analisis berikutnya.

---

# 2. System Overview

**OLION** adalah platform diskusi digital yang dirancang untuk memfasilitasi interaksi terstruktur antar pengguna dalam lingkungan berbasis komunitas.

Fungsi utama sistem meliputi:

- Manajemen akun pengguna
- Pembuatan dan pengelolaan diskusi
- Interaksi berbasis komentar dan voting
- Moderasi konten komunitas
- Konfigurasi sistem oleh administrator
- Publikasi konten edukatif oleh pakar
- Distribusi notifikasi kepada pengguna

Pada **Context Level**, sistem direpresentasikan sebagai: `[ OLION SYSTEM ]` Tanpa pemecahan proses internal.

---

# 3. System Boundary Definition

System boundary mendefinisikan ruang lingkup tanggung jawab sistem OLION.

## 3.1 Included in System

Komponen berikut berada dalam tanggung jawab sistem:

- Authentication Management
- User Account Management
- Discussion Management
- Comment Management
- Voting Mechanism
- Content Moderation Logic
- Role-Based Access Control (RBAC)
- Activity Logging
- Data Storage Management
- Notification Trigger Generation
- Expert Content Handling

Semua proses di atas terjadi **di dalam OLION SYSTEM**.

---

## 3.2 Excluded from System

Komponen berikut berada di luar tanggung jawab sistem:

- Email infrastructure eksternal
- Push notification provider
- Network delivery mechanism
- External infrastructure monitoring
- Hosting platform

Komponen ini direpresentasikan sebagai **external entities**.

---

# 4. External Entities Definition

Diagram konteks OLION melibatkan lima entitas eksternal utama.

Setiap entitas memiliki tanggung jawab dan pola interaksi berbeda.

---

# 4.1 User

User merupakan entitas utama yang berinteraksi langsung dengan sistem untuk menjalankan aktivitas diskusi.

User dapat berupa pengguna terdaftar yang memiliki akses sesuai peran yang diberikan.

## Responsibilities

User berinteraksi dengan sistem untuk:

- Melakukan autentikasi akun
- Membuat topik diskusi
- Mengirim komentar
- Memberikan voting
- Melaporkan pelanggaran
- Mengakses rekomendasi diskusi
- Menerima notifikasi aktivitas

## Data Flow — User → OLION

- **User Account Data**  
  Digunakan untuk autentikasi dan pengelolaan akun.

- **Discussion Data**  
  Digunakan untuk membuat atau memperbarui diskusi.

- **Interaction Data**  
  Digunakan untuk voting, komentar, dan interaksi lainnya.

- **Report Data**  
  Digunakan untuk melaporkan konten pelanggaran.

---

## Data Flow — OLION → User

- **Authentication Result**  
  Status autentikasi pengguna.

- **Discussion Information**  
  Informasi diskusi yang tersedia.

- **Recommendation Data**  
  Rekomendasi diskusi relevan.

---

# 4.2 Moderator

Moderator bertanggung jawab menjaga kualitas konten komunitas.

Moderator memiliki hak akses tambahan untuk melakukan tindakan moderasi.

## Responsibilities

Moderator bertugas untuk:

- Meninjau laporan pelanggaran
- Menghapus konten melanggar
- Mengunci diskusi
- Menegakkan aturan komunitas

---

## Data Flow — Moderator → OLION

- **Moderation Action**  
  Perintah moderasi terhadap konten atau diskusi.

---

## Data Flow — OLION → Moderator

- **Moderation Report**  
  Informasi laporan pelanggaran yang harus ditinjau.

---

# 4.3 Administrator

Administrator bertanggung jawab terhadap stabilitas dan konfigurasi sistem.

Administrator memiliki kontrol tertinggi terhadap sistem.

## Responsibilities

Administrator melakukan:

- Konfigurasi sistem
- Pengelolaan parameter operasional
- Monitoring kondisi sistem

---

## Data Flow — Administrator → OLION

- **System Configuration**  
  Parameter konfigurasi sistem.

---

## Data Flow — OLION → Administrator

- **System Report**  
  Informasi status dan kondisi sistem.

---

# 4.4 Pakar (Expert)

Pakar merupakan entitas khusus yang memiliki otoritas untuk menyediakan konten edukatif atau keahlian.

Pakar memberikan nilai tambah terhadap kualitas informasi dalam sistem.

## Responsibilities

Pakar bertugas untuk:

- Menyediakan konten berbasis keahlian
- Memberikan kontribusi edukatif
- Memperbarui materi pengetahuan

---

## Data Flow — Pakar → OLION

- **Expert Content**  
  Materi berbasis keahlian yang dikirimkan ke sistem.

---

## Data Flow — OLION → Pakar

- **Contribution Report**  
  Informasi performa dan kontribusi konten pakar.

---

# 4.5 Notification Service

Notification Service merupakan sistem eksternal yang bertugas mengirimkan notifikasi kepada pengguna.

Layanan ini bertindak sebagai media distribusi pesan sistem.

## Responsibilities

Notification Service bertanggung jawab untuk:

- Menerima pesan notifikasi dari OLION
- Mengirimkan pesan kepada pengguna
- Mengelola proses delivery

---

## Data Flow — OLION → Notification Service

- **Notification Message**  
  Pesan notifikasi yang dikirimkan sistem.

---

## Data Flow — Notification Service → User

- **Delivered Notification**  
  Notifikasi yang telah dikirim kepada pengguna.

---

# 5. Primary Interaction Model

Semua interaksi antara entitas eksternal dan sistem OLION mengikuti prinsip berikut:

1. Semua permintaan masuk melalui OLION SYSTEM
2. Tidak ada komunikasi langsung antar entitas eksternal
3. Semua notifikasi dikirim melalui Notification Service
4. Semua operasi dikontrol melalui mekanisme otorisasi

Model ini menjaga konsistensi sistem terhadap prinsip keamanan dan kontrol akses.

---

# 6. Context Diagram Structural Rules

Diagram konteks yang terkait dengan dokumen ini harus memenuhi aturan berikut:

- Hanya satu proses utama:  
  **OLION SYSTEM**

- Semua entitas eksternal harus berada di luar system boundary.

- Semua data flow harus memiliki:

  - Nama eksplisit
  - Arah jelas
  - Sumber dan tujuan valid

- Tidak boleh ada data store pada level konteks.

- Tidak boleh ada proses internal tambahan.

Diagram yang tidak memenuhi aturan ini dianggap tidak valid.

---

# 7. Design Assumptions

Beberapa asumsi yang digunakan dalam penyusunan diagram:

1. Semua pengguna menggunakan antarmuka aplikasi resmi.
2. Semua interaksi melewati backend OLION.
3. Sistem menggunakan model RBAC.
4. Tidak ada peer-to-peer communication.
5. Notification Service tersedia sebagai komponen eksternal.

Jika asumsi berubah, diagram harus diperbarui.

---

# 8. Design Constraints

Batasan desain yang mempengaruhi diagram:

- Sistem harus mendukung multi-role user
- Semua data harus tersimpan secara terpusat
- Semua request diproses melalui API layer
- Semua log aktivitas harus dicatat
- Notification delivery berada di luar sistem

Constraint ini harus konsisten dengan requirement specification.

---

# 9. Validation Checklist

Diagram dianggap valid jika seluruh kondisi berikut terpenuhi:

- Semua entitas eksternal terdefinisi
- Semua data flow memiliki label
- Tidak ada proses tambahan selain OLION
- Semua arah flow valid
- Semua flow memiliki tujuan jelas
- Tidak ada komunikasi antar external entity
- Tidak ada data store pada context level

Checklist ini harus diverifikasi sebelum lanjut ke Level 1.

---

# 10. Relationship to Next Artifacts

Context Diagram menjadi dasar untuk pengembangan:

- DFD Level 1  
- Use Case Diagram  
- Activity Diagram  
- System Architecture  
- Security Model  

Kesalahan pada tahap ini akan mempengaruhi keseluruhan desain sistem.

Validasi harus dilakukan sebelum transisi ke tahap berikutnya.

---

# 11. Revision Policy

Perubahan pada diagram harus dicatat secara formal dalam: `documents/00-index/CHANGELOG.md`
Dengan format: `[DATE] Updated Context Diagram — Modified Data Flow: Notification Message`
Semua perubahan harus memiliki alasan teknis yang jelas.

---

# Closing Statement

Context Diagram OLION mendefinisikan batas interaksi sistem secara eksplisit dan menjadi fondasi utama bagi seluruh proses analisis sistem.

Konsistensi antara diagram ini, domain model, serta requirement specification merupakan syarat mutlak sebelum pengembangan model proses yang lebih rinci dilakukan.
