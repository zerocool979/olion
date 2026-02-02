# Business Requirement Document (BRD)

**Project Name: olion**
**Document Type: Business Requirement Document (BRD)**
**Document Version: v1.0**
**Date: 03-02-2026**
**Document History**

| Version |    Date    | Author |       Description       |
|--------:|------------|:------:|-------------------------|
|   v1.0  | 03-02-2026 |  beel  | Initial draf of the BRD |
|   v2.0  | XX-XX-XXXX |        |                         |

---

## Table of Contents

1. Introduction
2. Business Background & Problem Statement
3. Business Objectives & Success Criteria
4. Scope of the Project
5. Stakeholders & Business Needs
6. Proposed Solution
7. Business Requirements
8. Business Rules
9. Constraints
10. Assumptions
11. Risks
12. Dependencies
13. Approval

---

## 1) Introduction

### 1.1 Purpose of the Document

This Business Requirement Document (BRD) aims to define the business needs, scope, and main expectations of the OLION system as a basis for development before entering the technical specification (SRS) stage.

### 1.2 Document Overview

This BRD explains the business background, key issues, project objectives, system scope, stakeholder needs, and high-level business requirements that must be met by the OLION system.

---

## 2) Business Background & Problem Statement

Perkembangan teknologi informasi telah mengubah cara manusia belajar dan berdiskusi. Aktivitas pertukaran ide tidak lagi terbatas pada ruang kelas fisik, tetapi dapat berlangsung melalui platform digital yang mampu menjangkau masyarakat luas, pelajar, maupun pengajar lintas lokasi dan waktu. Namun, ketersediaan teknologi tidak selalu menghasilkan interaksi intelektual yang sehat dan partisipatif.

Salah satu hambatan terbesar dalam diskusi digital adalah fenomena fear of judgment (ketakutan akan penilaian negatif). Pada banyak forum daring konvensional yang menampilkan identitas asli, pengguna cenderung menahan diri untuk bertanya atau menyampaikan argumen kritis karena khawatir dianggap “bodoh”, disalahkan, atau dipermalukan. Kondisi ini berhubungan erat dengan risiko bullying/stigma sosial, yang pada akhirnya menciptakan lingkungan belajar pasif dan tidak inklusif.

Dampak dari hambatan tersebut adalah diskusi seringkali menjadi tidak seimbang, di mana percakapan hanya didominasi oleh segelintir individu yang lebih percaya diri, sementara pengguna lain memilih diam. Akibatnya, potensi berpikir kritis dan kontribusi gagasan yang sebenarnya bernilai menjadi terhambat.

Untuk menjawab permasalahan tersebut, OLION dirancang sebagai platform diskusi berbasis web yang terstruktur dan terkurasi untuk membangun, menguji, dan menghubungkan pengetahuan lintas bidang secara rasional dan kolaboratif. OLION mengusung konsep pseudonimitas (anonimitas terkontrol), di mana identitas publik pengguna menggunakan pseudonym (default dihasilkan sistem namun dapat disesuaikan), sehingga pengguna dapat berdiskusi dengan lebih aman dari tekanan sosial tanpa menghilangkan akuntabilitas.

Selain itu, OLION menyediakan mekanisme Verified Expert, yaitu pakar yang diverifikasi melalui dokumen pendukung seperti sertifikat, CV, dan tautan portofolio. Kehadiran pakar terverifikasi ini bertujuan memperkuat kualitas diskusi dan membantu pengguna memperoleh jawaban yang lebih kredibel, terutama dalam topik-topik yang membutuhkan rujukan keahlian.

Diskusi daring saat ini seringkali tidak terstruktur dan tidak aman secara sosial, sehingga proses pertukaran gagasan kehilangan kualitasnya. Pengetahuan yang seharusnya dapat dibangun secara rasional dan kolaboratif justru tenggelam oleh opini dangkal, dominasi suara tertentu, serta tekanan sosial yang membuat banyak pengguna enggan berbicara.

Permasalahan paling krusial yang perlu diselesaikan pada tahap awal (MVP) adalah fear of judgment, yaitu ketakutan pengguna untuk bertanya atau menyampaikan argumen karena risiko penghakiman, stigma, dan perundungan. Akibatnya, ruang diskusi menjadi bising, tidak inklusif, dan tidak mendorong partisipasi intelektual yang merata.

OLION ditujukan untuk mengubah kondisi tersebut dari ruang diskusi yang menghakimi dan didominasi ego menjadi ruang berpikir yang aman, terstruktur, dan saling melengkapi, sehingga setiap individu dapat berkontribusi tanpa tekanan sosial yang menghambat.

---

## 3) Business Objectives & Success Criteria

### 3.1 Business Objectives

OLION dikembangkan untuk mencapai tujuan bisnis berikut:
1. Meningkatkan partisipasi diskusi yang aman dan berkelanjutan
OLION bertujuan mendorong lebih banyak pengguna untuk aktif berdiskusi tanpa tekanan sosial yang menghambat, sehingga partisipasi terjadi secara konsisten dan tidak hanya didominasi oleh kelompok tertentu.
2. Meningkatkan kualitas dan kedalaman kontribusi pengetahuan
OLION diarahkan untuk membangun budaya diskusi yang berbasis argumen rasional, relevan, dan saling melengkapi, sehingga hasil diskusi menjadi aset pengetahuan yang bernilai.
3. Menciptakan ekosistem diskusi yang tertib dan minim intimidasi
OLION berfokus pada pembentukan ruang diskusi yang aman, terkurasi, dan memiliki kontrol kualitas yang jelas untuk menekan intimidasi, perundungan, serta perilaku diskusi yang destruktif.

### 3.2 Success Criteria
Keberhasilan tujuan proyek OLION dapat diukur melalui indikator berikut:
1. Weekly Active Users (WAU): jumlah pengguna aktif mingguan
2. Jumlah diskusi per minggu: volume aktivitas diskusi
3. Rasio diskusi terjawab: persentase diskusi yang memiliki respons bermakna
4. Upvote/Downvote Ratio pada jawaban: indikator kualitas kontribusi dan penerimaan komunitas

### 3.3 Minimum MVP Success Target
OLION dianggap berhasil pada tahap MVP jika mencapai minimal:
1. 30 user aktif mingguan (WAU)
2. 80–100 diskusi pada fase MVP
3. 65–70% diskusi terjawab
4. Upvote/Downvote ratio jawaban > 2:1

---

## 4) Scope of the Project

### 4.1 In-Scope

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

### 4.2 Out-Scope

- Fitur dan kemampuan berikut tidak termasuk dalam ruang lingkup versi awal (MVP) OLION:
- Komunikasi real-time berbasis chat atau video
- Voice room atau live discussion
- Moderasi otomatis berbasis AI penuh
- Sistem monetisasi (subscription, iklan, premium feature)
- Sistem rekomendasi berbasis machine learning yang kompleks
- Integrasi dengan platform eksternal non-esensial

---

## 5) Stakeholders & Business Needs

### 5.1 Stakeholders

Stakeholders utama dalam proyek OLION mencakup:
1. End User (pengguna umum)
2. Expert (pakar terverifikasi)
3. Moderator
4. Admin
5. Owner/Developer: beel

### 5.2 Stakeholder Needs

1. User (Pengguna Umum)
- Ruang diskusi yang aman dari penghakiman dan perundungan agar pengguna berani bertanya dan berargumen tanpa tekanan sosial.
- Diskusi yang terarah dan mudah dipahami sesuai minat sehingga pengguna dapat menemukan topik relevan dengan cepat dan tidak tersesat dalam percakapan yang tidak terstruktur.
- Pengakuan atas kontribusi melalui mekanisme respons, voting, dan reputasi agar pengguna termotivasi untuk berpartisipasi secara positif.

2. Expert (Pakar)
- Diskusi berkualitas yang layak ditanggapi sehingga kontribusi pakar berdampak nyata terhadap peningkatan kualitas pengetahuan komunitas.
- Kredibilitas dan keahlian yang diakui secara jelas melalui status verifikasi, agar pengguna dapat membedakan jawaban pakar dari opini biasa.
- Efisiensi waktu dan energi dengan meminimalkan interaksi pada diskusi dangkal atau tidak produktif.

3. Moderator
- Alat moderasi yang jelas, cepat, dan adil untuk menindak konten bermasalah tanpa mengganggu diskusi sehat.
- Aturan diskusi yang tegas dan konsisten agar keputusan moderasi dapat dipertanggungjawabkan dan diterima komunitas.
- Beban moderasi yang terkontrol melalui mekanisme prioritas laporan agar moderator fokus pada kasus paling penting.

4. Admin
- Struktur kategori dan kualitas konten yang terjaga untuk memastikan forum tetap rapi, terkurasi, dan mudah dinavigasi.
- Visibilitas kesehatan platform melalui data aktivitas dan pelanggaran agar pengambilan keputusan administratif lebih tepat.
- Skalabilitas sistem tanpa chaos komunitas melalui kontrol akses, aturan, dan proses verifikasi yang jelas.

---

## 6) Proposed Solution

OLION diusulkan sebagai platform diskusi berbasis web dengan identitas pseudonym, sistem reputasi, verifikasi pakar, dan moderasi berbasis laporan. Solusi ini bertujuan membangun ekosistem diskusi yang aman, rasional, dan inklusif tanpa menghilangkan akuntabilitas.

---

## 7) Business Requirements

1. BR-01 — Ruang Diskusi Aman Secara Sosial
- Deskripsi: Sistem harus menyediakan ruang diskusi yang mengurangi fear of judgment dan tekanan sosial agar pengguna berani bertanya/berpendapat.
- Stakeholder: User, Expert

2. BR-02 — Pseudonimitas sebagai Identitas Publik Utama
- Deskripsi: Sistem harus menggunakan pseudonym sebagai identitas publik utama dalam seluruh aktivitas diskusi, dengan anonimitas terkontrol.
- Stakeholder: User, Admin

3. BR-03 — Pseudonym Default Generate + Editable
- Deskripsi: Sistem harus dapat menghasilkan pseudonym secara otomatis saat registrasi dan memungkinkan pengguna mengubah pseudonym sesuai aturan yang ditentukan.
- Stakeholder: User

4. BR-04 — Autentikasi Wajib untuk Membuat Konten
- Deskripsi: Sistem harus mewajibkan pengguna login untuk membuat diskusi, jawaban, dan komentar demi menjaga akuntabilitas.
- Stakeholder: User, Admin

5. BR-05 — Role-Based Access Control (RBAC)
- Deskripsi: Sistem harus menerapkan kontrol akses berbasis role (User/Expert/Moderator/Admin) agar setiap role hanya dapat melakukan aksi sesuai kewenangannya.
- Stakeholder: Admin, Moderator, User, Expert

6. BR-06 — Forum Diskusi Terstruktur
- Deskripsi: Sistem harus memfasilitasi diskusi yang terstruktur melalui entitas diskusi utama dan respons (jawaban/komentar) agar alur pembahasan mudah diikuti.
- Stakeholder: User, Expert

7. BR-07 — Manajemen Diskusi (CRUD)
- Deskripsi: Sistem harus memungkinkan pengguna membuat, melihat, mengubah, dan menghapus diskusi sesuai aturan (kepemilikan konten dan kebijakan moderasi).
- Stakeholder: User, Moderator, Admin

8. BR-08 — Jawaban dan Komentar sebagai Respons Diskusi
- Deskripsi: Sistem harus memungkinkan pengguna memberikan jawaban dan komentar sebagai bentuk kontribusi pengetahuan dan diskusi lanjutan.
- Stakeholder: User, Expert

9. BR-09 — Navigasi dan Akses Informasi yang Mudah
- Deskripsi: Sistem harus menyediakan daftar diskusi, detail diskusi, dan alur baca yang jelas agar pengguna mudah memahami konteks diskusi.
- Stakeholder: User

10. BR-10 — Pencarian Diskusi (Search)
- Deskripsi: Sistem harus menyediakan fitur pencarian berbasis kata kunci agar pengguna dapat menemukan diskusi relevan sesuai minat.
- Stakeholder: User, Expert

11. BR-11 — Kategori/Topik Diskusi (Jika Diterapkan)
- Deskripsi: Sistem harus mendukung pengelompokan diskusi (kategori) untuk membantu struktur informasi dan mempermudah eksplorasi topik.
- Stakeholder: User, Admin

12. BR-12 — Mekanisme Voting untuk Kontrol Kualitas
- Deskripsi: Sistem harus menyediakan voting pada konten (diskusi/jawaban/komentar) sebagai sinyal kualitas dan mekanisme kurasi komunitas.
- Stakeholder: User, Expert, Admin

13. BR-13 — Reputasi Pengguna (Basic)
- Deskripsi: Sistem harus menerapkan reputasi dasar untuk memberi pengakuan kontribusi dan mendorong partisipasi positif.
- Stakeholder: User, Expert

14. BR-14 — Mendorong Kontribusi Berkualitas (Quality-Driven Participation)
- Deskripsi: Sistem harus mendorong pengguna untuk menulis kontribusi yang rasional dan bermakna, bukan sekadar opini dangkal.
- Stakeholder: User, Expert, Admin

15. BR-15 — Pelaporan Konten (Report)
- Deskripsi: Sistem harus menyediakan fitur report untuk memungkinkan pengguna melaporkan konten bermasalah demi menjaga ruang diskusi tetap aman.
- Stakeholder: User, Moderator, Admin

16. BR-16 — Moderasi Berbasis Laporan (Moderation Queue)
- Deskripsi: Sistem harus menyediakan mekanisme antrian laporan agar moderator/admin dapat meninjau dan memproses pelanggaran secara sistematis.
- Stakeholder: Moderator, Admin

17. BR-17 — Tindakan Moderasi yang Jelas dan Konsisten
- Deskripsi: Sistem harus mendukung tindakan moderasi seperti hide/delete/resolve secara konsisten agar aturan diskusi dapat ditegakkan.
- Stakeholder: Moderator, Admin

18. BR-18 — Prioritas Penanganan Laporan
- Deskripsi: Sistem harus membantu moderator memprioritaskan laporan agar beban moderasi tetap terkontrol dan kasus penting ditangani lebih cepat.
- Stakeholder: Moderator

19. BR-19 — Verified Expert sebagai Sumber Kredibilitas
- Deskripsi: Sistem harus menyediakan status Verified Expert untuk meningkatkan kredibilitas jawaban dan memperkuat kualitas diskusi.
- Stakeholder: Expert, User, Admin

20. BR-20 — Pengajuan Verifikasi Pakar
- Deskripsi: Sistem harus memungkinkan pengguna mengajukan verifikasi pakar dengan bukti pendukung (dokumen/sertifikat/CV/portofolio).
- Stakeholder: Expert, Admin

21. BR-21 — Proses Approval/Reject Verifikasi oleh Admin
- Deskripsi: Sistem harus memungkinkan admin melakukan approval/reject terhadap pengajuan verifikasi pakar sesuai kriteria yang ditetapkan.
- Stakeholder: Admin

22. BR-22 — Label Pakar Ditampilkan Secara Konsisten
- Deskripsi: Sistem harus menampilkan label Verified Expert pada profil dan kontribusi pakar agar pengguna mudah mengenali otoritas keahlian.
- Stakeholder: User, Expert

23. BR-23 — Mengurangi Dominasi Suara Tertentu
- Deskripsi: Sistem harus membantu mengurangi dominasi diskusi oleh individu tertentu melalui struktur diskusi, voting, reputasi, dan moderasi.
- Stakeholder: User, Admin, Moderator

24. BR-24 — Ekosistem Diskusi yang Tertib dan Terukur
- Deskripsi: Sistem harus menjaga ekosistem diskusi tetap tertib melalui aturan, kontrol kualitas, dan penegakan moderasi.
- Stakeholder: Admin, Moderator

25. BR-25 — Panel Admin/Moderator untuk Operasional Platform
- Deskripsi: Sistem harus menyediakan panel khusus untuk admin/moderator guna menjalankan fungsi pengelolaan platform secara efisien.
- Stakeholder: Admin, Moderator

26. BR-26 — Manajemen User oleh Admin
- Deskripsi: Sistem harus memungkinkan admin melakukan pengelolaan user (melihat data user, role, dan tindakan administratif sesuai kebijakan).
- Stakeholder: Admin

27. BR-27 — Manajemen Kategori oleh Admin (Jika Ada)
- Deskripsi: Sistem harus memungkinkan admin mengelola kategori diskusi untuk menjaga struktur informasi dan navigasi pengguna.
- Stakeholder: Admin

28. BR-28 — Transparansi dan Akuntabilitas Moderasi
- Deskripsi: Sistem harus menjaga proses moderasi dapat dipertanggungjawabkan agar keputusan moderasi tidak bersifat sewenang-wenang.
- Stakeholder: Moderator, Admin, User

29. BR-29 — Dokumentasi API untuk Kemudahan Integrasi & Testing
- Deskripsi: Sistem harus menyediakan dokumentasi API agar endpoint dapat dipahami, diuji, dan dipelihara dengan baik.
- Stakeholder: beel (Developer), Admin

30. BR-30 — Test Plan, Test Cases, dan Evidence
- Deskripsi: Sistem harus memiliki dokumen pengujian yang membuktikan fitur inti berjalan sesuai kebutuhan.
- Stakeholder: beel (Developer), Admin

31. BR-31 — Deployment Guide Dasar
- Deskripsi: Sistem harus memiliki panduan deployment dasar agar aplikasi dapat dijalankan di environment yang tersedia (local/VPS/Docker).
- Stakeholder: beel (Developer)

32. BR-32 — Stabilitas Sistem untuk Rilis MVP
- Deskripsi: Sistem harus dapat berjalan stabil pada fitur inti end-to-end sebagai syarat rilis MVP.
- Stakeholder: User, Admin, beel (Developer)

33. BR-33 — Konsistensi Dokumen dengan Implementasi
- Deskripsi: Seluruh dokumentasi harus sinkron dengan implementasi aktual (API, database schema, role permission).
- Stakeholder: beel (Developer), Admin

34. BR-34 — Mendukung Evaluasi Keberhasilan MVP
- Deskripsi: Sistem harus memungkinkan evaluasi keberhasilan MVP berdasarkan metrik utama (WAU, diskusi/minggu, rasio terjawab, vote ratio).
- Stakeholder: Admin, beel (Developer)

---

## 8) Business Rules

A) Identitas & Pseudonym

1. BRules-01 — Identitas Publik Menggunakan Pseudonym
- Identitas publik yang tampil pada seluruh aktivitas diskusi adalah pseudonym, bukan identitas asli pengguna.

2. BRules-02 — Pseudonym Default Generate
- Saat registrasi, sistem harus menghasilkan pseudonym default secara otomatis.

3. BRules-03 — Perubahan Pseudonym Dibatasi Cooldown
- Pengguna dapat mengubah pseudonym, namun perubahan dibatasi dengan cooldown minimal 7 hari per perubahan.

4. BRules-04 — Pseudonym Harus Unik
- Pseudonym harus unik dan tidak boleh digunakan oleh lebih dari satu akun.

5. BRules-05 — Format Karakter Pseudonym
Pseudonym hanya boleh mengandung:
- huruf (a–z, A–Z)
- angka (0–9)
- underscore (_)
Karakter selain itu tidak diperbolehkan.

B) Akun & Autentikasi

6. BRules-06 — Login Menggunakan Email + Password
- Autentikasi OLION pada MVP menggunakan email + password.

7. BRules-07 — Akun Bermasalah Tetap Bisa Login untuk Akses Baca
- Akun yang dibanned/suspended tetap dapat login hanya untuk membaca konten.
- Akun tersebut tidak diperbolehkan melakukan aktivitas interaktif seperti membuat diskusi, menjawab, komentar, voting, dan report.

C) Konten (Diskusi, Jawaban, Komentar)

8. BRules-08 — Edit Konten Dibatasi Waktu
- Pengguna dapat mengedit konten miliknya sendiri maksimal 24 jam setelah konten dibuat.

9. BRules-09 — Penghapusan Konten Menggunakan Soft Delete
- Penghapusan konten oleh user dilakukan sebagai soft delete (konten disembunyikan dari publik).
- Hard delete hanya dapat dilakukan oleh Admin (jika diperlukan).

10. BRules-10 — Konten MVP Berbasis Teks
- Konten diskusi, jawaban, dan komentar pada MVP berbasis teks.

11. BRules-11 — Link Diperbolehkan dalam Konten
- Konten teks boleh menyertakan link/URL selama tidak melanggar aturan komunitas.

D) Voting & Reputasi

12. BRules-12 — Voting 1 User 1 Vote per Konten
- Setiap user hanya dapat memberikan 1 vote untuk setiap konten (diskusi/jawaban/komentar).

13. BRules-13 — Voting Bisa Di-Undo
- User dapat membatalkan voting (undo vote) pada konten yang sebelumnya sudah divote.

14. BRules-14 — Downvote Diaktifkan pada MVP
- Sistem mendukung upvote dan downvote pada MVP.

E) Report & Moderasi

15. BRules-15 — Report Wajib Memilih Alasan
- Saat melakukan report, user wajib memilih reason yang tersedia.

16. BRules-16 — Daftar Reason Report Minimum
Reason report minimal yang tersedia:
- Spam
- Harassment/Bullying
- Hate Speech
- Misinformation
- Other

17. BRules-17 — Aksi Moderasi Minimal
Moderator/Admin dapat melakukan tindakan berikut pada konten yang dilaporkan:
- Hide content (menyembunyikan konten dari publik)
- Resolve report (menyelesaikan laporan)
- Warn user (memberi peringatan kepada pemilik konten)

F) Verified Expert

18. BRules-18 — Expert Verification Memiliki Status Revoked
Status verifikasi pakar mengikuti alur:
- pending → approved/rejected → revoked

19. BRules-19 — Status Expert Dapat Dicabut
- Admin dapat mencabut status Verified Expert (revoked) jika terjadi pelanggaran atau ketidaksesuaian.

**Summary of Decision**

1. Pseudonym: unik + underscore allowed + cooldown 7 hari
2. Login: email + password
3. Suspended/banned: login boleh, tapi read-only
4. Edit konten: max 24 jam
5. Delete: soft delete user, hard delete admin
6. Konten: text-only + link boleh
7. Voting: 1 user 1 vote + undo + downvote aktif
8. Report: reason wajib + 5 reason utama
9. Moderasi: hide + resolve + warn
10. Expert: bisa revoked

---

## 9) Constraints

Proyek OLION memiliki sejumlah batasan yang harus dipahami sejak awal karena memengaruhi ruang lingkup, pendekatan teknis, serta prioritas pengembangan. Batasan-batasan ini bersifat mengikat dan menjadi acuan dalam pengambilan keputusan selama siklus pengembangan MVP.

Secara umum, proyek dikembangkan secara mandiri oleh beel dengan fokus pada penyelesaian fitur inti (MVP). Seluruh keputusan desain, implementasi, dan dokumentasi harus realistis terhadap keterbatasan sumber daya, waktu, dan kapasitas pengelolaan sistem.

### 9.1 Budgetary Constraints

1. Proyek dikembangkan tanpa pendanaan eksternal atau tim khusus, sehingga seluruh aktivitas pengembangan dilakukan oleh satu individu (beel).

2. Tidak tersedia anggaran khusus untuk:
- Infrastruktur skala besar
- Layanan cloud berbayar tingkat enterprise
- Tools berlisensi mahal (commercial SaaS)

3. Pemilihan teknologi, framework, dan tools diprioritaskan yang bersifat open-source atau free-tier.

4. Infrastruktur deployment dibatasi pada resource yang tersedia, seperti:
- Local environment
- VPS dengan spesifikasi terbatas
- Docker-based deployment sederhana

5. Optimalisasi biaya menjadi pertimbangan utama dalam setiap keputusan teknis, termasuk arsitektur sistem dan strategi deployment.

### 9.2 Timeline Constraints

1. Fokus rilis awal adalah Minimum Viable Product (MVP), sehingga:
- Hanya fitur inti yang langsung mendukung tujuan bisnis yang diprioritaskan
- Fitur tambahan dan lanjutan ditunda ke fase pengembangan berikutnya

2. Pengembangan dilakukan secara bertahap dan iteratif, menyesuaikan dengan:
- Kapasitas waktu pengembang tunggal
- Kompleksitas teknis fitur

3. Tidak terdapat tanggal rilis publik yang kaku, namun stabilitas fitur inti dan kesiapan sistem end-to-end menjadi syarat utama sebelum MVP dianggap selesai.

4. Penambahan fitur di luar ruang lingkup MVP hanya dapat dilakukan setelah:
- Fitur inti berjalan stabil
- Dokumentasi dan pengujian dasar terpenuhi

### 9.3 Regulatory Constraints

1. Sistem OLION harus mematuhi prinsip dasar perlindungan data pengguna, khususnya:
- Perlindungan identitas asli pengguna (anonimitas terkontrol)
- Pengelolaan data akun secara aman

2. Penggunaan pseudonym sebagai identitas publik merupakan bagian dari kebijakan internal sistem untuk:
- Mengurangi risiko sosial
- Menjaga akuntabilitas tanpa mengekspos identitas asli

3. Sistem tidak diperbolehkan:
- Menampilkan data sensitif pengguna secara publik
- Mengungkap dokumen verifikasi pakar ke pihak lain selain Admin

4. Seluruh dokumen proyek (BRD, SRS, dokumentasi API) wajib sinkron dengan implementasi aktual, meliputi:
- Struktur database (schema)
- API endpoint
- Aturan hak akses (role & permission)

5. Perubahan aturan bisnis atau teknis harus tercermin secara konsisten pada dokumentasi dan implementasi untuk menjaga akuntabilitas sistem.

---

## 10) Assumptions

### 10.1 List of Assumptions

Dokumen BRD ini disusun berdasarkan sejumlah asumsi yang dianggap benar dan stabil pada tahap perencanaan dan pengembangan MVP OLION. Apabila asumsi-asumsi ini berubah di kemudian hari, maka penyesuaian terhadap kebutuhan bisnis, desain sistem, maupun implementasi teknis dapat diperlukan.

1. Diasumsikan bahwa pengguna wajib memiliki akun dan melakukan login untuk dapat membuat diskusi, jawaban, atau komentar. Sistem tidak mendukung partisipasi tanpa akun (anonymous guest) pada tahap MVP.

2. Diasumsikan bahwa pseudonym digunakan sebagai identitas publik utama dalam seluruh aktivitas diskusi untuk mendukung konsep anonimitas terkontrol, sementara identitas asli pengguna tetap tersimpan secara internal dan tidak ditampilkan ke publik.

3. Diasumsikan bahwa perilaku pengguna secara umum mengikuti aturan komunitas, dan mekanisme moderasi (report, hide, warn, resolve) cukup untuk menangani sebagian besar pelanggaran yang terjadi.

4. Diasumsikan bahwa proses moderasi dilakukan oleh role Moderator dan/atau Admin sesuai dengan hak akses yang telah didefinisikan, tanpa melibatkan sistem moderasi otomatis berbasis AI pada tahap MVP.

5. Diasumsikan bahwa jumlah pengguna pada fase MVP masih dalam skala kecil hingga menengah, sehingga performa dan skalabilitas sistem dapat dikelola dengan arsitektur sederhana.

6. Diasumsikan bahwa fitur-fitur yang tidak termasuk dalam ruang lingkup MVP (seperti chat real-time, monetisasi, atau rekomendasi berbasis machine learning) tidak menjadi kebutuhan mendesak pada fase awal.

7. Diasumsikan bahwa sistem akan dikembangkan secara bertahap dan iteratif, sehingga kebutuhan baru dapat muncul dan disempurnakan pada versi berikutnya berdasarkan evaluasi penggunaan MVP.

8. Diasumsikan bahwa dokumen BRD, SRS, dan dokumentasi teknis lainnya akan diperbarui secara berkala untuk mencerminkan perubahan atau penyesuaian yang terjadi selama pengembangan.

---

## 11) Risks

Meskipun proyek OLION dinilai layak untuk dikembangkan, terdapat sejumlah risiko potensial yang dapat memengaruhi keberhasilan proyek apabila tidak dikelola dengan baik. Oleh karena itu, diperlukan identifikasi risiko secara sistematis beserta strategi mitigasi yang relevan untuk meminimalkan dampak negatif selama fase pengembangan dan implementasi MVP.

### 11.1 List of Risks

Tabel berikut merangkum risiko utama yang diidentifikasi pada proyek OLION, beserta tingkat kemungkinan, dampak, dan strategi mitigasinya.

| Risiko | Prob. | Impact | Mitigasi |
|-------|:-----:|:------:|----------|
| Penyalahgunaan anonimitas (spam, toxic content, ujaran tidak pantas) | High | High | Mekanisme report, moderation queue, rate limiting, serta peran Moderator/Admin |
| Serangan keamanan (SQL Injection, XSS, auth bypass) | Med | High | Sanitasi input, validasi data, middleware keamanan, JWT expiry |
| Beban server meningkat seiring pertumbuhan user | Med | High | Optimasi query, caching, dan deployment fleksibel (VPS/Docker) |
| Scope creep (penambahan fitur di luar MVP) | High | High | Penguncian scope MVP, backlog fitur untuk fase berikutnya |
| Keterlambatan pengembangan (solo developer) | High | Med | Timeline realistis, milestone mingguan, checklist Definition of Done |
| Kurangnya partisipasi pengguna awal | Med | Med | Uji coba beta terbatas, validasi awal dengan komunitas sasaran |
| Kesalahan keputusan moderasi oleh Admin/Moderator | Med | Med | Logging aktivitas moderasi, aturan yang jelas, dan audit keputusan |
| Inkonsistensi data sistem | Med | High | Database constraint, foreign key, dan disiplin migrasi schema |

### 11.2 Risk Migitation Strategies

Strategi mitigasi risiko pada proyek OLION dirancang dengan pendekatan preventif dan korektif, dengan fokus utama pada stabilitas sistem, kualitas diskusi, dan keberhasilan rilis MVP. Pendekatan mitigasi yang diterapkan meliputi:

1. Kontrol kualitas berbasis komunitas dan moderasi, melalui voting, report, dan moderation queue untuk menangani penyalahgunaan anonimitas.

2. Keamanan aplikasi web standar industri, termasuk validasi input, kontrol autentikasi, dan pengelolaan sesi/token.

3. Manajemen scope dan prioritas fitur, dengan menahan penambahan fitur non-esensial hingga fase pasca-MVP.

4. Pengelolaan beban kerja solo developer, dengan membagi pengembangan ke dalam milestone kecil yang terukur.

5. Disiplin dokumentasi dan implementasi, agar perubahan kebutuhan tidak menyebabkan inkonsistensi sistem.

### 11.3 Alternative Solutions Analysis

Sebelum menentukan pendekatan utama, beberapa alternatif solusi telah dipertimbangkan dan dievaluasi untuk memastikan pendekatan yang dipilih paling sesuai dengan tujuan proyek OLION.

| No | Alternatif Solusi | Kelebihan | Kekurangan |
|-------|:-----:|:------:|----------|
| 1 | Menggunakan platform forum eksisting (mis. Discourse, Reddit Clone) | Implementasi cepat, stabil, ekosistem plugin matang | Kustomisasi terbatas, anonimitas tidak fleksibel |
| 2 | Mengembangkan aplikasi mobile native (Android/iOS) | Aksesibilitas tinggi, notifikasi push | Biaya dan waktu pengembangan lebih besar |
| 3 | Mengembangkan aplikasi web kustom | Fleksibel, sesuai kebutuhan MVP, kontrol penuh anonimitas | Kustomisasi terbatas, Waktu perancangan dan pengujian lebih lama |

Berdasarkan hasil evaluasi, Alternatif 3 (aplikasi web kustom) dipilih karena memberikan fleksibilitas penuh dalam desain sistem, penerapan anonimitas terkontrol, serta pengendalian fitur diskusi sesuai kebutuhan bisnis dan akademik proyek OLION.

---

## 12) Dependencies

Pengembangan dan implementasi proyek OLION memiliki sejumlah ketergantungan (dependencies) yang dapat memengaruhi kelancaran pengembangan, kualitas hasil, serta ketepatan waktu rilis MVP. Dependencies ini mencakup ketergantungan teknis, sumber daya, dan faktor eksternal non-organisasi.

### 12.1 List of Dependencies

1. Ketersediaan Waktu dan Kapasitas Developer
Proyek OLION dikembangkan oleh satu orang (beel) sehingga seluruh aktivitas perancangan, pengembangan, pengujian, dan deployment bergantung pada ketersediaan waktu dan kapasitas individu tersebut.

2. Stabilitas dan Ketersediaan Lingkungan Pengembangan
Proyek bergantung pada lingkungan pengembangan yang stabil, baik lokal maupun berbasis VPS/Docker, agar proses development, testing, dan deployment dapat berjalan tanpa hambatan teknis.

3. Kesiapan Infrastruktur Deployment
Ketersediaan server (VPS atau environment Docker) menjadi ketergantungan penting untuk memastikan aplikasi dapat dijalankan, diuji, dan dirilis sebagai MVP.

4. Tools dan Teknologi Pendukung
Pengembangan sistem bergantung pada tools dan teknologi pendukung seperti framework backend/frontend, database management system, serta tools dokumentasi dan pengujian yang digunakan selama proyek berlangsung.

5. Konsistensi Dokumen dan Implementasi
Proyek bergantung pada keselarasan antara dokumen perencanaan (BRD, SRS, diagram, dan dokumentasi teknis) dengan implementasi aktual agar tidak terjadi miskomunikasi atau rework.

6. Ketersediaan Pengguna Uji Coba (Beta User)
Evaluasi kualitas MVP bergantung pada partisipasi pengguna awal (beta user) untuk memberikan umpan balik terkait usability, kualitas diskusi, dan stabilitas sistem.

7. Koneksi Internet dan Akses Jaringan
Proses development, deployment, dan pengujian bergantung pada koneksi internet yang stabil, terutama untuk pengelolaan repository, dokumentasi, dan server.

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
