# Data Flow Diagram (DFD) Level 1 — OLION System

Dokumen ini menjelaskan rincian proses internal sistem OLION pada **DFD Level 1**.  
Diagram ini merupakan dekomposisi langsung dari **DFD Level 0 (Context Diagram)** dan memperlihatkan bagaimana sistem utama dipecah menjadi beberapa proses utama yang saling berinteraksi dengan data store dan entitas eksternal.

Tujuan dokumen ini adalah:

- menjelaskan struktur proses internal sistem
- mendefinisikan aliran data antar proses
- mendokumentasikan hubungan antara proses dan data store
- menyediakan referensi teknis untuk pengembangan DFD Level 2 dan desain sistem lanjutan
- memastikan konsistensi dengan Domain Model dan DFD Level 0

Dokumen ini harus digunakan sebagai referensi utama sebelum membuat diagram lanjutan seperti:

- DFD Level 2
- Activity Diagram
- Sequence Diagram
- Database Design
- API Specification

---

# Scope Sistem

DFD Level 1 mencakup seluruh proses inti dalam sistem OLION, yaitu:

1. Manajemen Autentikasi  
2. Manajemen Diskusi  
3. Sistem Reputasi  
4. Moderasi Konten  
5. Manajemen Pakar  
6. Administrasi Sistem  
7. Notifikasi Real-Time  

Seluruh proses tersebut berinteraksi dengan berbagai data store dan entitas eksternal.

---

# External Entities

Entitas eksternal adalah aktor yang berinteraksi langsung dengan sistem.

## Pengguna Umum

Pengguna utama sistem yang dapat:

- melakukan registrasi dan login
- membuat diskusi
- memberikan jawaban
- melakukan voting
- melaporkan konten
- menerima notifikasi

Interaksi utama:

Mengirim:

- Data Registrasi
- Data Login
- Diskusi / Jawaban
- Vote (Upvote / Downvote)
- Laporan Konten

Menerima:

- Notifikasi Sistem
- Status Moderasi
- Status Verifikasi
- Informasi Diskusi

---

## Moderator

Moderator bertanggung jawab terhadap pengawasan konten.

Interaksi utama:

Menerima:

- Notifikasi Moderasi

Mengirim:

- Tindakan Moderasi

---

## Pakar

Pakar adalah pengguna terverifikasi yang memberikan jawaban yang memiliki kredibilitas tinggi.

Interaksi utama:

Mengirim:

- Pengajuan Verifikasi

Menerima:

- Notifikasi Verifikasi
- Status Verifikasi

---

## Administrator

Administrator bertanggung jawab terhadap pengaturan sistem.

Interaksi utama:

Mengirim:

- Konfigurasi Sistem
- Perintah Administrasi

Menerima:

- Laporan Sistem

---

## AI Service

AI Service digunakan untuk membantu proses deteksi otomatis terhadap konten.

Interaksi utama:

Mengirim:

- Hasil Deteksi AI

---

# Data Stores

Data store menyimpan data yang digunakan oleh proses sistem.

## D1 — User & Profil Anonim

Menyimpan:

- Data pengguna
- Data login
- Status verifikasi
- Informasi profil anonim

Digunakan oleh:

- Manajemen Autentikasi
- Manajemen Pakar
- Administrasi Sistem

---

## D2 — Diskusi & Konten

Menyimpan:

- Diskusi
- Jawaban
- Konten pengguna

Digunakan oleh:

- Manajemen Diskusi
- Moderasi Konten
- Administrasi Sistem

---

## D3 — Voting & Reputasi

Menyimpan:

- Data voting
- Nilai reputasi

Digunakan oleh:

- Sistem Reputasi

---

## D4 — Laporan & Moderation

Menyimpan:

- Laporan konten
- Riwayat moderasi

Digunakan oleh:

- Moderasi Konten

---

## D5 — Pakar & Verifikasi

Menyimpan:

- Data pakar
- Status verifikasi

Digunakan oleh:

- Manajemen Pakar

---

## D6 — Log Aktivitas

Menyimpan:

- Log sistem
- Log notifikasi
- Log moderasi

Digunakan oleh:

- Seluruh proses utama
- Administrasi Sistem

---

## D7 — Kategori & Konfigurasi

Menyimpan:

- Data kategori
- Konfigurasi sistem

Digunakan oleh:

- Manajemen Diskusi
- Administrasi Sistem

---

# Process Definitions

Setiap proses merupakan bagian dari sistem utama yang menjalankan fungsi tertentu.

---

# 1.0 — Manajemen Autentikasi

Proses ini menangani autentikasi pengguna.

Fungsi utama:

- menerima data registrasi
- menerima data login
- memverifikasi kredensial
- memperbarui status pengguna
- menyimpan data pengguna

Input:

- Data Registrasi
- Data Login

Output:

- Status Login
- Update Status User

Data Store:

- D1 — User & Profil Anonim

---

# 2.0 — Manajemen Diskusi

Proses ini menangani seluruh interaksi diskusi.

Fungsi utama:

- membuat diskusi
- menyimpan jawaban
- mengambil data diskusi
- mengelola kategori
- memicu notifikasi

Input:

- Diskusi
- Jawaban

Output:

- Data Diskusi
- Trigger Notifikasi

Data Store:

- D2 — Diskusi & Konten
- D7 — Kategori & Konfigurasi

---

# 3.0 — Sistem Reputasi

Proses ini menghitung reputasi pengguna berdasarkan voting.

Fungsi utama:

- menerima vote
- menghitung reputasi
- menyimpan hasil reputasi

Input:

- Upvote
- Downvote

Output:

- Data Reputasi

Data Store:

- D3 — Voting & Reputasi

---

# 4.0 — Moderasi Konten

Proses ini menangani pelaporan dan moderasi konten.

Fungsi utama:

- menerima laporan
- memproses hasil deteksi AI
- menerima tindakan moderator
- menyimpan hasil moderasi
- mengirim notifikasi

Input:

- Laporan Konten
- Hasil AI Detection
- Tindakan Moderasi

Output:

- Status Moderasi
- Trigger Notifikasi

Data Store:

- D4 — Laporan & Moderation

External Support:

- AI Service

---

# 5.0 — Manajemen Pakar

Proses ini menangani verifikasi pakar.

Fungsi utama:

- menerima pengajuan verifikasi
- memproses status verifikasi
- menyimpan data pakar

Input:

- Data Verifikasi

Output:

- Status Verifikasi

Data Store:

- D5 — Pakar & Verifikasi
- D1 — User & Profil Anonim

---

# 6.0 — Administrasi Sistem

Proses ini mengelola konfigurasi dan administrasi sistem.

Fungsi utama:

- menerima konfigurasi
- melakukan backup data
- menghasilkan laporan
- mengelola kategori

Input:

- Konfigurasi Sistem

Output:

- Laporan Sistem
- Backup Data

Data Store:

- D2 — Diskusi & Konten
- D6 — Log Aktivitas
- D7 — Kategori & Konfigurasi

---

# 7.0 — Notifikasi Real-Time

Proses ini mengirim notifikasi kepada pengguna.

Fungsi utama:

- menerima trigger notifikasi
- mengirim notifikasi
- menyimpan log notifikasi

Input:

- Trigger Notifikasi

Output:

- Notifikasi ke Pengguna
- Notifikasi ke Moderator
- Notifikasi ke Pakar

Data Store:

- D6 — Log Aktivitas

---

# Key Data Flow Summary

Ringkasan aliran data utama dalam sistem.

## Autentikasi Flow

Pengguna Umum  
→ Manajemen Autentikasi  
→ D1 User & Profil  
→ Status Login

---

## Diskusi Flow

Pengguna Umum  
→ Manajemen Diskusi  
→ D2 Diskusi  
→ Notifikasi Real-Time

---

## Voting Flow

Pengguna Umum  
→ Sistem Reputasi  
→ D3 Voting  
→ Update Reputasi

---

## Moderation Flow

Pengguna Umum  
→ Moderasi Konten  
→ AI Service  
→ Moderator  
→ D4 Laporan

---

## Verification Flow

Pakar  
→ Manajemen Pakar  
→ D5 Pakar  
→ Status Verifikasi

---

## Notification Flow

Semua Proses  
→ Notifikasi Real-Time  
→ Pengguna

---

# Design Integrity Notes

DFD Level 1 ini memiliki karakteristik:

- seluruh proses berasal dari dekomposisi Level 0
- seluruh data store memiliki peran eksplisit
- tidak terdapat aliran data langsung antar data store
- seluruh interaksi eksternal melewati proses
- seluruh proses memiliki input dan output jelas

Model ini siap digunakan sebagai dasar:

- DFD Level 2
- Database Design
- API Design
- System Architecture

---

# Closing Statement

DFD Level 1 merupakan representasi detail dari perilaku internal sistem OLION.  
Dokumen ini berfungsi sebagai referensi teknis utama untuk memahami bagaimana data mengalir di dalam sistem serta bagaimana setiap proses saling berinteraksi.

Konsistensi dokumen ini dengan Domain Model dan DFD Level 0 sangat penting untuk menjaga integritas desain sistem pada tahap implementasi berikutnya.
