# Data Flow Diagram (DFD) Level 1 — OLION System

Dokumen ini menjelaskan rincian proses internal sistem OLION pada **DFD Level 1** sebagai dekomposisi langsung dari **DFD Level 0 (Context Diagram)**.

Dokumen ini menjadi referensi utama untuk desain lanjutan seperti DFD Level 2, arsitektur sistem, API, dan database.

---

# Scope Sistem

DFD Level 1 mencakup seluruh proses inti:

1. Manajemen Autentikasi  
2. Manajemen Diskusi  
3. Sistem Reputasi  
4. Moderasi Konten  
5. Manajemen Pakar  
6. Administrasi Sistem  
7. Notifikasi Real-Time  
8. Recommendation Engine  

---

# External Entities

## Pengguna Umum
Mengirim:
- Data Registrasi & Login  
- Diskusi / Jawaban  
- Vote  
- Laporan  

Menerima:
- Notifikasi  
- Status Moderasi  
- Rekomendasi Diskusi  
- Informasi Diskusi  

---

## Moderator
Mengirim:
- Tindakan Moderasi  

Menerima:
- Notifikasi Moderasi  

---

## Pakar
Mengirim:
- Pengajuan Verifikasi  

Menerima:
- Status Verifikasi  
- Rekomendasi Pertanyaan  

---

## Administrator
Mengirim:
- Konfigurasi Sistem  

Menerima:
- Laporan Sistem  
- Metrics & Analytics  

---

## AI Service
Digunakan untuk:
- klasifikasi konten
- flag konten bermasalah
- prioritas moderasi

---

# Data Stores

## D1 — User & Profil Anonim
## D2 — Diskusi & Konten
## D3 — Voting & Reputasi
## D4 — Laporan & Moderation
## D5 — Pakar & Verifikasi
## D6 — Log Aktivitas
## D7 — Kategori & Konfigurasi

---

# Process Definitions

---

# 1.0 — Manajemen Autentikasi

Input:
- Data Registrasi
- Data Login

Output:
- Status Login
- Update Status User

Data Store:
- D1

---

# 2.0 — Manajemen Diskusi

Input:
- Diskusi
- Jawaban
- Data Kategori (D7)

Output:
- Data Diskusi
- Trigger Notifikasi
- Data ke Recommendation Engine

Data Store:
- D2
- D7

---

# 3.0 — Sistem Reputasi

Input:
- Upvote / Downvote

Output:
- Data Reputasi
- Reputation Signal → Recommendation Engine

Data Store:
- D3

---

# 4.0 — Moderasi Konten

Input:
- Laporan
- AI Detection
- Tindakan Moderator

Output:
- Status Moderasi
- Moderation Signal → Recommendation Engine
- Trigger Notifikasi

Data Store:
- D4

---

# 5.0 — Manajemen Pakar

Input:
- Data Verifikasi

Output:
- Status Verifikasi
- Expert Metadata → Recommendation Engine

Data Store:
- D5
- D1

---

# 6.0 — Administrasi Sistem

Input:
- Konfigurasi Sistem

Output:
- Laporan Sistem
- Recommendation Metrics
- Backup Data

Data Store:
- D2
- D6
- D7

---

# 7.0 — Notifikasi Real-Time

Input:
- Trigger Notifikasi
- Recommendation Notification Trigger

Output:
- Notifikasi ke Pengguna
- Notifikasi ke Moderator
- Notifikasi ke Pakar

Data Store:
- D6

---

# 8.0 — Recommendation Engine

Proses ini menghasilkan rekomendasi berbasis perilaku, reputasi, dan konten.

## Fungsi Utama

- membangun personalized feed
- mengolah behavior & interaction data
- mengolah sinyal reputasi & moderasi
- menghasilkan rekomendasi diskusi & pakar
- memicu notifikasi rekomendasi

---

## Input

- Behavior Data (D6 Log Aktivitas)
- User Profile Data (D1)
- Discussion Content Data (D2)
- Reputation Signal (D3)
- Moderation Signal (4.0)
- Expert Metadata (5.0)
- Configuration / Weighting (D7)
- Request Feed (Pengguna)

---

## Output

- Personalized Discussion Feed → Pengguna
- Expert Recommendation Feed → Pakar / Diskusi
- Recommendation Metrics → Administrasi Sistem
- Recommendation Notification Trigger → Notifikasi Real-Time

---

## Data Store

- D6 — Log Aktivitas
- D2 — Diskusi & Konten
- D1 — User Profile
- D7 — Konfigurasi

---

# Key Data Flow Summary

## Recommendation Flow

Pengguna  
→ (Request Feed)  
→ Recommendation Engine  
→ Personalized Feed  
→ Pengguna  

---

## Signal Aggregation Flow

Reputasi / Moderasi / Aktivitas  
→ Recommendation Engine  
→ Ranking & Scoring  
→ Feed Output  

---

## Notification Flow (Extended)

Recommendation Engine  
→ Trigger Notifikasi  
→ Notifikasi Real-Time  
→ Pengguna  

---

# Standard Status Definition

Status Login:  
{ success, failed }

Status Moderasi:  
{ pending, approved, rejected }

Status Verifikasi:  
{ submitted, under_review, verified, rejected }

Status Notifikasi:  
{ sent, delivered, read }

---

# Design Integrity Notes

- Tidak ada data flow langsung antar data store  
- Semua proses memiliki input & output eksplisit  
- Recommendation Engine bersifat **non-authoritative (read-heavy)**  
- Tidak mengubah data utama (hanya konsumsi & output insight)  
- Seluruh interaksi eksternal tetap melalui proses  

---

# Closing Statement

Dengan penambahan **Recommendation Engine**, sistem OLION berevolusi dari sekadar platform diskusi menjadi **knowledge-driven adaptive system** yang mampu memberikan pengalaman personal berbasis data.

Model ini siap diturunkan ke:
- DFD Level 2 (Recommendation Logic)
- Machine Learning Pipeline Design
- API Personalization Layer
- Event-driven Architecture
