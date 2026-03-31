# Context Diagram — DFD Level 0  
**System Name:** OLION  
**Document ID:** OLION-ANL-DFD0  
**Version:** 2.0  
**Status:** Approved for Level-1 Expansion  
**Authoring Phase:** System Analysis  
**Last Updated:** 2026-03-31  

---

# 1. Purpose

Dokumen ini mendefinisikan **Context Diagram (DFD Level 0)** untuk sistem **OLION** sebagai representasi tingkat tertinggi dari interaksi antara sistem dan entitas eksternal.

Tujuan utama dokumen ini:

- Menetapkan batas sistem (**system boundary**)  
- Mengidentifikasi seluruh entitas eksternal  
- Mendefinisikan aliran data utama  
- Menjadi referensi resmi sebelum pengembangan **DFD Level 1**  
- Menjaga konsistensi antar artefak analisis  

Dokumen ini merupakan referensi formal untuk seluruh model proses lanjutan.

---

# 2. System Overview

**OLION** merupakan platform diskusi komunitas berbasis pengetahuan yang mendukung interaksi antara pengguna umum, pakar, moderator, dan administrator dalam lingkungan digital terstruktur.

Fungsi utama sistem meliputi:

- Manajemen akun pengguna  
- Pengelolaan diskusi dan komentar  
- Sistem reputasi dan badge  
- Moderasi konten komunitas  
- Publikasi konten edukatif  
- Monitoring aktivitas sistem  
- Pengelolaan konfigurasi dan backup  
- Penyediaan analitik dan statistik sistem  

Pada **Context Level**, seluruh sistem direpresentasikan sebagai satu proses tunggal:

**[ Sistem OLION ]**

Tidak terdapat proses internal pada level ini.

---

# 3. External Entities

Diagram konteks OLION melibatkan empat entitas eksternal utama.

---

# 3.1 Pengguna Umum

Pengguna Umum merupakan entitas utama yang berinteraksi langsung dengan sistem untuk aktivitas diskusi komunitas.

## Data Flow — Pengguna Umum → Sistem OLION

**Data Email, Password, & Preferensi Minat Belajar**  
Digunakan untuk autentikasi dan personalisasi akun.

**Pertanyaan Baru, Kategori Topik, Jawaban & Komentar**  
Digunakan untuk membuat dan memperbarui diskusi.

**Upvote/Downvote, Laporan Pelanggaran, Alasan Pelanggaran**  
Digunakan untuk interaksi komunitas dan pelaporan pelanggaran.

---

## Data Flow — Sistem OLION → Pengguna Umum

**Saran Diskusi Relevan, Topik Trending**  
Digunakan untuk rekomendasi diskusi.

**Skor Reputasi, Badge Pencapaian**  
Digunakan untuk menampilkan reputasi pengguna.

**Pemberitahuan Aktivitas, Alert Diskusi Baru**  
Digunakan untuk notifikasi aktivitas komunitas.

**Konfirmasi Laporan, Status Tindakan**  
Digunakan untuk memberikan hasil tindak lanjut laporan.

---

# 3.2 Pakar

Pakar merupakan entitas yang memiliki keahlian khusus dan berkontribusi terhadap konten edukatif dalam sistem.

## Data Flow — Pakar → Sistem OLION

**Dokumen Keahlian, CV & Sertifikat**  
Digunakan untuk verifikasi kompetensi pakar.

**Jawaban Ahli, Referensi Pendukung**  
Digunakan untuk memberikan jawaban berbasis keahlian.

**Konten Edukatif, Materi Pembelajaran**  
Digunakan untuk publikasi materi pembelajaran.

---

## Data Flow — Sistem OLION → Pakar

**Dashboard Khusus, Pertanyaan Relevan**  
Digunakan untuk menampilkan pertanyaan sesuai bidang keahlian.

**Analisis Kontribusi, Impact Pembelajaran**  
Digunakan untuk memantau dampak kontribusi pakar.

---

# 3.3 Moderator

Moderator bertanggung jawab menjaga kualitas komunitas serta menegakkan aturan penggunaan sistem.

## Data Flow — Moderator → Sistem OLION

**Aksi Penghapusan, Peringatan Pengguna**  
Digunakan untuk melakukan tindakan moderasi.

**Keputusan Moderasi, Status Pelaporan**  
Digunakan untuk menetapkan hasil moderasi.

**Filter Pencapaian, Parameter Pemantauan**  
Digunakan untuk pengaturan pemantauan aktivitas.

---

## Data Flow — Sistem OLION → Moderator

**Overview Aktivitas, Statistik Pelanggaran**  
Digunakan untuk pemantauan kondisi komunitas.

**Notifikasi Urgent, Flag Konten Bermasalah**  
Digunakan untuk memberi peringatan pelanggaran prioritas.

---

# 3.4 Administrator

Administrator bertanggung jawab terhadap konfigurasi sistem dan monitoring performa operasional.

## Data Flow — Administrator → Sistem OLION

**Konfigurasi Sistem, Pengaturan Kategori**  
Digunakan untuk pengaturan parameter sistem.

**Permintaan Backup, Parameter Backup**  
Digunakan untuk memulai proses backup data.

**Kriteria Laporan, Periode Waktu**  
Digunakan untuk menghasilkan laporan analitik.

---

## Data Flow — Sistem OLION → Administrator

**Report Analitik, Data Statistik**  
Digunakan untuk evaluasi performa sistem.

**Overview Sistem, Metrics Performa**  
Digunakan untuk monitoring kondisi sistem.

---

# 4. System Boundary Rules

Context Diagram harus memenuhi aturan berikut:

- Hanya terdapat satu proses utama:  
  **Sistem OLION**

- Semua entitas eksternal berada di luar system boundary

- Semua data flow harus:

  - Memiliki nama eksplisit  
  - Memiliki arah jelas  
  - Memiliki sumber dan tujuan valid  

- Tidak diperbolehkan terdapat:

  - Data Store  
  - Sub-process  
  - Proses tambahan  

Diagram yang melanggar aturan ini dinyatakan tidak valid.

---

# 5. Interaction Principles

Semua interaksi mengikuti prinsip berikut:

1. Seluruh komunikasi harus melalui **Sistem OLION**  
2. Tidak terdapat komunikasi langsung antar entitas eksternal  
3. Semua request diproses oleh sistem  
4. Semua response berasal dari sistem  
5. Sistem bertindak sebagai pusat pengendali seluruh aktivitas  

---

# 6. Design Assumptions

Asumsi yang digunakan:

1. Semua pengguna menggunakan aplikasi resmi.  
2. Semua interaksi diproses melalui backend OLION.  
3. Sistem menggunakan Role-Based Access Control (RBAC).  
4. Semua aktivitas dicatat sebagai log sistem.  
5. Tidak terdapat komunikasi peer-to-peer antar pengguna.

---

# 7. Validation Checklist

Diagram dinyatakan valid apabila:

- Semua entitas eksternal terdefinisi  
- Semua data flow memiliki label eksplisit  
- Tidak terdapat proses tambahan selain Sistem OLION  
- Semua arah data flow benar  
- Tidak terdapat komunikasi antar external entity  
- Tidak terdapat data store pada context level  

Checklist ini wajib diverifikasi sebelum pengembangan DFD Level 1.

---

# 8. Relationship to Next Models

Context Diagram menjadi dasar pengembangan:

- DFD Level 1  
- Use Case Diagram  
- Activity Diagram  
- System Architecture  
- Security Model  

Kesalahan pada level ini akan berdampak pada seluruh model lanjutan.

---

# 9. Revision Policy

Setiap perubahan pada diagram harus dicatat dalam: `documents/00-index/CHANGELOG.md`
Dengan format: `[DATE] Updated Context Diagram — Modified Data Flow: <Flow Name>`
Semua perubahan harus memiliki alasan teknis yang jelas.

---

# Closing Statement

Context Diagram OLION mendefinisikan seluruh interaksi eksternal sistem secara eksplisit dan menjadi fondasi utama dalam pengembangan model proses selanjutnya.

Dokumen ini harus digunakan sebagai referensi resmi sebelum pengembangan **DFD Level 1** dilakukan.
