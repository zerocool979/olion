# Project Charter — OLION
**Project Name:** OLION  
**Document Type:** Project Charter (Initiation)  
**Version:** v1.0 
**Owner:** beel
**Status:** Approved for Development  
**Last Updated:** 2026-01-28  

---

## 1) Executive Summary

OLION adalah aplikasi web forum diskusi/tanya jawab yang dirancang untuk membantu pengguna berbagi informasi, bertanya, dan berdiskusi secara aman melalui mekanisme **anonimitas terkontrol (pseudonym)**, serta menjaga kualitas komunitas melalui fitur **moderasi, pelaporan, reputasi, dan verifikasi pakar**.

Dokumen Project Charter ini menjadi acuan resmi untuk memulai proyek OLION sebelum masuk tahap requirement detail (BRD/SRS) dan desain teknis.

---

## 2) Background

Perkembangan teknologi informasi telah merevolusi sektor pendidikan dengan menggeser paradigma belajar dari ruang kelas fisik menuju platform digital yang memungkinkan diskusi tanpa batas jarak. Namun, ketersediaan teknologi tersebut belum sepenuhnya berbanding lurus dengan peningkatan kualitas interaksi intelektual dan partisipasi aktif pengguna. Dalam praktiknya, masih terdapat hambatan psikologis dan sosial yang signifikan dalam proses pertukaran gagasan, baik di lingkungan akademik maupun masyarakat umum.

Permasalahan utama yang muncul adalah tingginya tingkat *Fear of Judgment* (ketakutan terhadap penilaian negatif). Pada forum diskusi daring konvensional yang menampilkan identitas asli secara eksplisit (nama dan foto), banyak pelajar dan masyarakat enggan menyampaikan argumen kritis atau pertanyaan yang dianggap “bodoh”. Stigma, risiko perundungan (*bullying*), serta tekanan sosial dari rekan sejawat menciptakan lingkungan belajar yang pasif. Akibatnya, diskusi hanya didominasi oleh segelintir individu yang memiliki kepercayaan diri tinggi, sementara gagasan-gagasan potensial lainnya tidak tersampaikan karena rasa takut.

Selain hambatan psikologis, akses terhadap bimbingan dari pakar (*expert*) juga sering terhambat oleh kendala finansial dan birokrasi. Kelompok masyarakat ekonomi menengah ke bawah kerap tidak memiliki kesempatan untuk berkonsultasi atau berdiskusi langsung dengan ahli di bidang tertentu secara gratis dan terbuka.

Oleh karena itu, diperlukan sebuah solusi digital berupa platform OLION. OLION dirancang sebagai media diskusi berbasis web yang mengedepankan sistem **pseudonimitas (identitas samaran) yang bertanggung jawab**. Dengan menyamarkan identitas asli namun tetap menjaga akuntabilitas melalui sistem reputasi dan moderasi, OLION bertujuan menciptakan “ruang aman” bagi setiap individu untuk berpendapat tanpa tekanan sosial. Kehadiran fitur **Verified Expert (Pakar Terverifikasi)** juga diharapkan mampu menjembatani kesenjangan akses antara masyarakat umum dengan sumber ilmu pengetahuan yang valid. Melalui pendekatan ini, kualitas interaksi akademik dapat meningkat, budaya berpikir kritis dapat tumbuh, dan inklusivitas dalam belajar dapat terwujud tanpa terkendala faktor psikologis maupun finansial.

---

## 3) Problem Statement

Berdasarkan latar belakang yang telah diuraikan, proyek OLION berfokus untuk menjawab permasalahan utama berikut:
1. Bagaimana merancang dan membangun arsitektur aplikasi berbasis web yang mampu memfasilitasi diskusi lintas entitas (masyarakat, siswa, mahasiswa) dengan menerapkan sistem pseudonimitas yang aman?
2. Bagaimana mengimplementasikan mekanisme enkripsi dan manajemen identitas samaran guna memitigasi tekanan sosial serta stigma, sehingga pengguna dapat berekspresi secara intelektual tanpa risiko perundungan?
3. Bagaimana merancang sistem yang efisien dan rendah biaya operasional agar dapat menyediakan akses konsultasi dengan pakar (Verified Expert) secara cuma-cuma bagi pengguna dengan keterbatasan finansial?
4. Bagaimana merancang fitur-fitur seperti Reputation System, Expert Verification, dan Voting untuk menumbuhkan budaya berpikir kritis sekaligus menjaga etika berargumentasi yang sehat?
5. Bagaimana membangun sistem moderasi konten dan mekanisme pelaporan yang efektif untuk memastikan platform tetap menjadi ruang aman bagi diskursus akademik maupun non-akademik?
6. Bagaimana mengukur efektivitas sistem dalam meningkatkan partisipasi, keberanian intelektual, dan kualitas interaksi akademik pengguna setelah penerapan aplikasi ini?

---

## 4) Objectives

Tujuan utama dari pembangunan aplikasi OLION adalah menyediakan platform diskusi daring yang inklusif, aman, dan bebas stigma melalui penerapan sistem identitas pseudonim. Platform ini diproyeksikan menjadi media pembelajaran terbuka yang mampu meningkatkan kualitas partisipasi intelektual dan budaya berpikir kritis tanpa hambatan psikologis maupun finansial.

Secara khusus, tujuan proyek ini meliputi:
1. Merancang sistem berbasis web yang memungkinkan pengguna berinteraksi secara pseudonim guna meningkatkan kepercayaan diri dalam menyampaikan ide tanpa rasa takut terhadap penghakiman sosial.
2. Menyediakan akses gratis dan mudah bagi masyarakat, khususnya yang memiliki keterbatasan finansial, untuk berdiskusi langsung dengan para ahli melalui fitur Verified Expert.
3. Meningkatkan keterlibatan aktif siswa, mahasiswa, dan masyarakat umum dalam membedah isu-isu akademik maupun non-akademik melalui ruang kolaborasi yang terstruktur.
4. Mengembangkan fitur reputasi dan sistem moderasi yang etis guna memastikan bahwa meskipun identitas bersifat samaran, kualitas argumen dan literasi digital tetap terjaga sesuai standar akademik.
5. Menjadi sarana alternatif bagi institusi pendidikan dalam menerapkan metode pembelajaran kolaboratif berbasis teknologi web yang adaptif terhadap perkembangan zaman.
6. Mendukung pengembangan sumber daya manusia melalui penyediaan bank pengetahuan (knowledge base) yang tumbuh dari hasil diskusi kolektif antar pengguna dan pakar.

---

## 5) Scope

### 5.1 In-Scope

Proyek OLION mencakup pengembangan sebuah aplikasi web forum diskusi dengan fokus pada anonimitas terkontrol, kualitas interaksi, serta tata kelola komunitas yang sehat. Ruang lingkup proyek pada tahap awal meliputi modul-modul utama berikut:

**A. Autentikasi & Akun**
Sistem menyediakan mekanisme pendaftaran, autentikasi, dan pengelolaan akun pengguna berbasis role (User, Expert, Moderator, Admin). Identitas publik pengguna ditampilkan dalam bentuk pseudonym, sementara identitas asli tetap terlindungi oleh sistem. Akses fitur dibatasi berdasarkan hak dan peran masing-masing pengguna.

**B. Forum Diskusi & Interaksi Konten**

Sistem menyediakan forum diskusi yang memungkinkan pengguna membuat topik, memberikan jawaban, serta berkomentar secara terstruktur. Pengguna dapat menelusuri diskusi melalui daftar, pencarian, dan pengelompokan konten. Setiap diskusi menampilkan informasi dasar seperti waktu, penulis (pseudonym), dan aktivitas interaksi.

**C. Kontrol Kualitas & Moderasi Komunitas**

Sistem mendukung mekanisme kontrol kualitas melalui voting, pelaporan konten, serta moderasi. Pengguna dapat menilai dan melaporkan konten, sementara Moderator dan Admin bertanggung jawab meninjau laporan dan mengambil tindakan sesuai kebijakan platform. Seluruh proses moderasi dicatat untuk keperluan audit dan akuntabilitas.

**D. Verifikasi Pakar (Verified Expert)**

Sistem menyediakan proses pengajuan dan pengelolaan Verified Expert, yang memungkinkan pengguna tertentu memperoleh status pakar setelah melalui proses verifikasi oleh Admin. Pengguna dengan status pakar ditandai secara visual untuk meningkatkan kredibilitas kontribusi dalam diskusi.

**E. Panel Admin & Moderator**

Sistem menyediakan panel khusus bagi Admin dan Moderator untuk melakukan pengelolaan pengguna, kategori (jika diterapkan), laporan konten, serta tindakan moderasi. Akses ke panel ini dilindungi oleh kontrol keamanan berbasis peran.

**F. Dokumentasi, Pengujian, & Deployment Dasar**

Proyek mencakup penyusunan dokumentasi sistem, dokumentasi API, rencana pengujian, serta panduan deployment dasar untuk memastikan sistem dapat diuji, dipahami, dan dijalankan kembali secara konsisten.

> _"Catatan: Rincian kebutuhan fungsional (Functional Requirements) dan non-fungsional (Non-Functional Requirements) untuk setiap modul dijabarkan lebih lanjut dalam dokumen Software Requirement Specification (SRS)."_

### 5.2 Out-Scope

Fitur dan kemampuan berikut tidak termasuk dalam ruang lingkup pengembangan OLION pada tahap MVP:
- Komunikasi real-time berbasis chat, voice, atau video
- Diskusi langsung (live discussion atau streaming)
- Moderasi konten otomatis berbasis kecerdasan buatan penuh
- Sistem monetisasi (berlangganan, iklan, atau fitur premium)
- Sistem rekomendasi berbasis machine learning yang kompleks
- Integrasi dengan platform eksternal non-esensial (misalnya media sosial atau cloud storage pihak ketiga)

---

## 6) Deliverables

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

## 7) Stakeholders

* **End User (Pengguna Umum)**: pengguna yang memanfaatkan OLION untuk berdiskusi, bertanya, dan berinteraksi di forum.
* **Expert (Pakar Terverifikasi)**: pengguna yang telah melalui proses verifikasi dan berperan memberikan jawaban/insight dengan kredibilitas lebih tinggi.
* **Moderator**: pihak yang bertugas menjaga kualitas dan etika diskusi melalui proses review laporan dan tindakan moderasi.
* **Admin**: pihak yang memiliki kontrol sistem tertinggi untuk mengelola user, kategori, verifikasi pakar, serta konfigurasi dasar sistem.
* **Owner**: pengembang utama yang merancang, membangun, menguji, dan melakukan deployment sistem OLION.

> _"Catatan: Pada tahap MVP, OLION tidak melibatkan stakeholder eksternal karena seluruh proses inti dikelola secara internal oleh sistem."_

---

## 8) Constraints

- Proyek dikembangkan oleh beel, sehingga pembagian peran (developer, QA, devops) dikelola oleh satu orang.
- Fokus rilis awal adalah fitur inti (MVP) agar sistem dapat selesai, stabil, dan siap digunakan sebelum penambahan fitur lanjutan.
- Infrastruktur deployment mengikuti resource yang tersedia, seperti local environment, VPS, atau Docker-based deployment sesuai kebutuhan.
- Seluruh dokumen proyek wajib sinkron dengan implementasi aktual, termasuk struktur database (schema), API endpoint, serta aturan hak akses (role permission).

---

## 9) Assumptions

- Pengguna wajib melakukan login untuk dapat membuat diskusi, jawaban, atau komentar (tidak mendukung anonymous tanpa akun).
- Pseudonym menjadi identitas publik utama dalam seluruh aktivitas diskusi untuk menjaga anonimitas terkontrol.
- Proses moderasi dilakukan oleh role Moderator dan/atau Admin sesuai hak akses.
- Sistem pada tahap MVP bersifat sederhana, dan dapat dikembangkan lebih lanjut pada versi berikutnya.

---

## 10) Success Criteria

OLION dinyatakan berhasil jika:
- Fitur utama berjalan end-to-end:
  register/login → buat diskusi → jawab/komentar → voting → report → moderasi
- Role-based access berjalan sesuai aturan (User/Expert/Moderator/Admin)
- API terdokumentasi dan dapat diuji
- Test case inti minimal PASS (auth, diskusi, vote, report, moderasi)
- Sistem dapat dideploy dan dijalankan stabil

---

## 11) Risks & Mitigation
| Risiko | Prob. | Impact | Mitigasi |
|-------|:-----:|:------:|----------|
| Spam/toxic karena anonimitas | High | High | report + moderation queue + rate limit |
| Auth bypass / token leak | Med | High | JWT expiry + middleware + validation |
| Scope creep (fitur melebar) | High | High | kunci MVP + backlog fase berikut |
| Data tidak konsisten | Med | High | FK + constraint + migration discipline |
| Beban kerja solo dev | High | Med | milestone mingguan + checklist DoD |

---

## 12) Timeline High-Level

Timeline fleksibel:
- Minggu 1–2: Requirement (BRD, SRS, MVP breakdown)
- Minggu 3–4: Desain (DFD, Use Case, ERD, DB design)
- Minggu 5–8: Implementasi Backend + DB
- Minggu 6–9: Implementasi Frontend + Integrasi API
- Minggu 10: Testing + Bug Fix
- Minggu 11: Dokumentasi final + evidence
- Minggu 12: Deployment + Release Candidate

---

## 13) Approval
Dokumen ini menjadi acuan resmi untuk memulai implementasi OLION.

**Approved By:** beel  
**Status:** Approved for Development

---
