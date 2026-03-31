# Data Flow Diagram (DFD) Level 2 — OLION System

Dokumen ini merupakan dekomposisi detail dari setiap proses pada DFD Level 1.
Setiap proses dipecah menjadi sub-proses operasional untuk mendukung desain teknis, API, dan database.

---

# 1.0 — Manajemen Autentikasi

## Sub-Proses

1.1 Validasi Input  
1.2 Registrasi User  
1.3 Login Authentication  
1.4 Session Management  
1.5 Update Status User  

## Flow

Pengguna → (Data Registrasi/Login) → 1.1  
1.1 → 1.2 / 1.3  
1.2 → Simpan → D1  
1.3 → Verifikasi → D1  
1.3 → Status Login → Pengguna  
1.4 → Session Token  
1.5 → Update Status → D1  

---

# 2.0 — Manajemen Diskusi

## Sub-Proses

2.1 Validasi Konten  
2.2 Create Diskusi  
2.3 Create Jawaban  
2.4 Fetch Diskusi  
2.5 Kategori Mapping  
2.6 Trigger Notifikasi  
2.7 Publish Event → Recommendation Engine  

## Flow

Pengguna → Konten → 2.1  
2.1 → 2.2 / 2.3  
2.2 / 2.3 → Simpan → D2  
2.4 ← Ambil → D2  
2.5 ↔ D7  
2.6 → 7.0  
2.7 → 8.0  

---

# 3.0 — Sistem Reputasi

## Sub-Proses

3.1 Validasi Vote  
3.2 Hitung Reputasi  
3.3 Update Reputasi  
3.4 Generate Reputation Signal  

## Flow

Pengguna → Vote → 3.1  
3.1 → 3.2  
3.2 → 3.3 → D3  
3.4 → 8.0  

---

# 4.0 — Moderasi Konten

## Sub-Proses

4.1 Terima Laporan  
4.2 AI Detection Processing  
4.3 Prioritas Moderasi  
4.4 Tindakan Moderator  
4.5 Simpan Hasil Moderasi  
4.6 Generate Moderation Signal  
4.7 Trigger Notifikasi  

## Flow

Pengguna → Laporan → 4.1  
4.1 → 4.2 (AI Service)  
4.2 → 4.3  
4.3 → Moderator → 4.4  
4.4 → 4.5 → D4  
4.6 → 8.0  
4.7 → 7.0  

---

# 5.0 — Manajemen Pakar

## Sub-Proses

5.1 Submit Verifikasi  
5.2 Validasi Dokumen  
5.3 Review Admin  
5.4 Update Status Pakar  
5.5 Generate Expert Metadata  

## Flow

Pakar → 5.1  
5.1 → 5.2  
5.2 → 5.3  
5.3 → 5.4 → D5 / D1  
5.5 → 8.0  

---

# 6.0 — Administrasi Sistem

## Sub-Proses

6.1 Kelola Konfigurasi  
6.2 Backup Data  
6.3 Generate Report  
6.4 Monitoring Metrics  
6.5 Manage Kategori  

## Flow

Admin → 6.1 → D7  
6.2 → Backup D2/D6  
6.3 ← D6 → Report  
6.4 ← 8.0 (Recommendation Metrics)  
6.5 ↔ D7  

---

# 7.0 — Notifikasi Real-Time

## Sub-Proses

7.1 Receive Trigger  
7.2 Build Notification Payload  
7.3 Dispatch Notification  
7.4 Update Delivery Status  

## Flow

Semua proses → 7.1  
7.1 → 7.2  
7.2 → 7.3 → Pengguna / Moderator / Pakar  
7.4 → D6  

---

# 8.0 — Recommendation Engine

## Sub-Proses

8.1 Collect Behavior Data  
8.2 Collect Content Data  
8.3 Collect Signal Data (Reputation & Moderation)  
8.4 User Profiling  
8.5 Candidate Generation  
8.6 Ranking & Scoring  
8.7 Generate Feed  
8.8 Generate Expert Recommendation  
8.9 Trigger Notification  
8.10 Log Recommendation Activity  

---

## Flow Detail

### Data Ingestion

D6 → 8.1  
D2 → 8.2  
D3 / 4.0 → 8.3  
D1 → 8.4  
D7 → 8.6 (weight/config)

---

### Processing Pipeline

8.1 + 8.2 + 8.3 + 8.4 → 8.5  
8.5 → 8.6  
8.6 → 8.7 & 8.8  

---

### Output

8.7 → Personalized Feed → Pengguna  
8.8 → Expert Feed → Pakar  
8.9 → 7.0  
8.10 → D6  

---

# Cross-Process Interaction Summary

- 2.0 → 8.0 (content event)
- 3.0 → 8.0 (reputation signal)
- 4.0 → 8.0 (moderation signal)
- 5.0 → 8.0 (expert metadata)
- 8.0 → 7.0 (notification trigger)
- 8.0 → 6.0 (metrics)

---

# Design Notes

- Semua sub-proses memiliki satu tanggung jawab (SRP)
- Recommendation Engine bersifat asynchronous & event-driven
- Tidak ada write ke core data store oleh 8.0
- Semua output bersifat derived / computed data

---

# Closing Statement

DFD Level 2 ini memberikan granularitas operasional yang cukup untuk langsung diturunkan ke:

- API Endpoint Design
- Event Streaming Architecture
- Database Schema
- Machine Learning Pipeline

Model ini sudah berada pada level **production-ready system design**.
