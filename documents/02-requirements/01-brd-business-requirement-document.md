# Business Requirement Document (BRD)

**Project Name: olion**
**Document Type: Business Requirement Document (BRD)**
**Document Version: v2.0**
**Date: 10-04-2026**
**Document History**

| Version |    Date    | Author |       Description        |
|--------:|------------|:------:|--------------------------|
|   v1.0  | 03-02-2026 |  beel  | Initial draft of the BRD |
|   v2.0  | 10-04-2026 |  beel  | Tidy up the BRD draft    |
|   v3.0  | XX-XX-XXXX |        |                          |

---

## Table of Contents

**1. Executive Summary**
   * 1.1 Project Overview
   * 1.2 Purpose of the Document

**2. Business Background & Problem Statement**
   * 2.1 Current State
   * 2.2 Gap Analysis
   * 2.3 Proposed Vision

**3. Business Objectives & Success Criteria**
   * 3.1 Business Goals
   * 3.2 Success Metrics

**4. Project Scope**
   * 4.1 In-Scope
   * 4.2 Out-of-Scope

**5. Stakeholders & User Profiles**
   * 5.1 Stakeholder Matrix
   * 5.2 User Personas

**6. Functional Business Requirements**
   * 6.1 Module A - Authentication & Account Management
   * 6.2 Module B - Discussion System
   * 6.3 Module C - Answer & Comment Interaction
   * 6.4 Module D - Voting & Reputation Logic
   * 6.5 Module E - Reporting & Community Moderation
   * 6.6 Module F - AI-Powered Services
   * 6.7 Module G - Notification System
   * 6.8 Module H - Search & Discovery
   * 6.9 Module I - Analytics & Business Reporting
   * 6.10 Module J - System Safety & Security Standards
   * 6.11 MODULE K — Verified Expert Management
   * 6.12 Module L - Appeal & Dispute Management

**7. Business Rules & Logic**
   * 7.1 General Business Rules
   * 7.2 Module-Specific Rules

**8. Non-Functional Business Requirements**
   * 8.1 Performance & Scalability
   * 8.2 Security & Compliance
   * 8.3 Availability & Reliability

**9. Project Constraints, Assumptions, & Dependencies**
   * 9.1 Constraints
   * 9.2 Assumptions
   * 9.3 External Dependencies

**10. Risks & Mitigation Plan**
   * 10.1 Identified Business Risks
   * 10.2 Mitigation Strategies
   * 10.3 Alternative Solutions Analysis

**11. Glossary**

**12. Approval & Sign-off**

---

## 1. Executive Summary

### 1.1 Project Overview
**OLION** adalah sebuah platform diskusi berbasis web yang dirancang khusus sebagai media pembelajaran dan pengembangan berpikir kritis. Proyek ini lahir dari identifikasi masalah utama dalam forum diskusi daring konvensional, yaitu tingginya tingkat *Fear of Judgment* (ketakutan akan penilaian negatif) yang menghambat partisipasi aktif pelajar maupun masyarakat.

Sistem ini mengusung konsep utama **pseudonimitas (anonimitas terkontrol)**, di mana pengguna dapat berinteraksi menggunakan identitas samaran untuk meningkatkan rasa aman dalam berpendapat, namun tetap memiliki akuntabilitas melalui sistem moderasi yang ketat. OLION tidak hanya sekadar forum tanya-jawab, tetapi sebuah ekosistem digital yang menjaga kualitas konten melalui fitur reputasi, pelaporan, verifikasi pakar (*Verified Expert*), serta integrasi layanan berbasis kecerdasan buatan (AI) untuk mendukung moderasi dan interaksi cerdas. Proyek ini ditargetkan sebagai solusi inovatif dalam transformasi pendidikan digital dan pertukaran gagasan intelektual.

### 1.2 Purpose of the Document
Dokumen Persyaratan Bisnis (BRD) ini disusun untuk memberikan definisi yang jelas dan komprehensif mengenai kebutuhan bisnis, ruang lingkup proyek, serta tujuan strategis dari pembangunan sistem OLION. Tujuan utama dari dokumen ini adalah:

1.  **Penyamaan Visi:** Menjadi landasan utama bagi seluruh pemangku kepentingan (*stakeholders*) untuk memahami nilai bisnis dan solusi yang ditawarkan.
2.  **Panduan Pengembangan:** Menjadi acuan dasar dalam pembuatan spesifikasi teknis (SRS) dan desain sistem agar selaras dengan kebutuhan fungsional yang telah disepakati.
3.  **Kriteria Keberhasilan:** Mendefinisikan metrik dan parameter sukses yang akan digunakan untuk mengevaluasi kualitas dan efektivitas sistem OLION pada akhir tahap pengembangan MVP (*Minimum Viable Product*).
4.  **Kontrol Proyek:** Berfungsi sebagai kontrak ruang lingkup untuk mencegah *scope creep* dan memastikan efisiensi dalam penggunaan sumber daya selama siklus pembangunan proyek.

---

## 2. Business Background & Problem Statement

### 2.1 Current State (Kondisi Saat Ini)
Saat ini, perkembangan teknologi informasi telah menggeser paradigma pembelajaran dari ruang kelas fisik ke platform digital. Forum diskusi daring konvensional telah banyak digunakan oleh pelajar dan masyarakat umum untuk bertukar informasi. Namun, sebagian besar platform tersebut menggunakan sistem identitas terbuka (menampilkan nama asli dan foto secara eksplisit). Interaksi yang ada saat ini cenderung didominasi oleh segelintir pengguna yang percaya diri, sementara banyak pengguna lainnya hanya menjadi penyerap informasi pasif (*silent readers*) tanpa berkontribusi pada dialektika pemikiran.

### 2.2 Gap Analysis (Masalah Utama)
Berdasarkan observasi pada kondisi saat ini, terdapat kesenjangan (*gap*) yang signifikan antara ketersediaan teknologi diskusi dengan kualitas partisipasi intelektual, yang disebabkan oleh:
* **Fear of Judgment:** Tingginya ketakutan akan penilaian negatif atau kritik personal saat menggunakan identitas asli, sehingga menghambat pengguna untuk mengajukan pertanyaan "bodoh" atau opini alternatif.
* **Kualitas Konten yang Rendah:** Banyak forum publik yang tidak memiliki sistem kurasi atau verifikasi, sehingga informasi yang salah (*misinformation*) sering tercampur dengan diskusi akademik.
* **Kurangnya Akuntabilitas pada Anonimitas Total:** Platform yang menawarkan anonimitas total sering kali menjadi sarang perilaku toksik dan spam karena tidak adanya kendali moderasi yang efektif.
* **Hambatan Berpikir Kritis:** Tanpa ruang yang aman, proses "trial and error" dalam berpikir kritis tidak terjadi karena pengguna lebih memilih aman dengan tidak berpendapat sama sekali.

[Image of gap analysis process diagram]

### 2.3 Proposed Vision (Visi Solusi)
Visi utama dari proyek **OLION** adalah menciptakan sebuah standar baru dalam platform diskusi digital yang memprioritaskan keamanan psikologis pengguna tanpa mengorbankan kualitas konten. OLION mengusulkan solusi berupa:
* **Implementasi Pseudonimitas:** Memberikan identitas samaran (pseudonym) yang dihasilkan oleh sistem untuk mengurangi beban mental *fear of judgment*, namun tetap dapat ditelusuri secara internal demi akuntabilitas.
* **Ekosistem Moderasi Berbasis AI & Komunitas:** Mengintegrasikan kecerdasan buatan untuk mendeteksi konten toksik secara *real-time* dan memberdayakan komunitas melalui sistem laporan yang responsif.
* **Verified Expert:** Melibatkan pakar yang terverifikasi untuk memvalidasi jawaban, sehingga platform menjadi rujukan pembelajaran yang kredibel.
* **Pemberdayaan Berpikir Kritis:** Menjadikan diskusi sebagai media pembelajaran yang aktif, di mana setiap gagasan dihargai berdasarkan substansinya, bukan siapa yang menyampaikannya.

Berikut adalah isi dari bagian **3** dan **4** untuk dokumen BRD Anda, yang disusun berdasarkan referensi dari *Project Charter* dan *Proposal Proyek* yang telah Anda berikan:

---

## 3. Business Objectives & Success Criteria

### 3.1 Business Goals
Tujuan utama dari pengembangan platform OLION adalah:
1.  **Meningkatkan Partisipasi Aktif:** Menyediakan ruang diskusi yang aman guna meminimalkan hambatan psikologis (*fear of judgment*) sehingga pengguna lebih berani berkontribusi dalam dialektika pemikiran.
2.  **Menjaga Kualitas Intelektual:** Menciptakan ekosistem diskusi yang terkurasi melalui verifikasi pakar dan sistem reputasi, sehingga informasi yang beredar memiliki kredibilitas tinggi.
3.  **Efisiensi Moderasi Komunitas:** Mengurangi konten negatif, spam, dan perilaku toksik melalui kombinasi sistem pelaporan berbasis komunitas dan teknologi kecerdasan buatan (AI).
4.  **Literasi Digital & Berpikir Kritis:** Menjadi media pembelajaran yang mendorong pengguna untuk menganalisis gagasan berdasarkan substansi konten, bukan berdasarkan identitas personal.

### 3.2 Success Metrics (KPI)
Sistem OLION dinyatakan berhasil apabila memenuhi indikator kinerja utama (KPI) sebagai berikut:
* **Adopsi Pengguna:** Tercapainya target jumlah pengguna aktif (misalnya 30 *Weekly Active Users* pada fase MVP) yang berpartisipasi dalam diskusi.
* **Kualitas Partisipasi:** Minimal 80% dari diskusi yang dibuka mendapatkan setidaknya satu jawaban atau komentar dalam kurun waktu 48 jam.
* **Efektivitas Moderasi:** Seluruh laporan pelanggaran (*Report*) diproses oleh sistem atau moderator dalam waktu maksimal 24 jam.
* **Stabilitas Sistem:** Aplikasi dapat berjalan *end-to-end* (registrasi → diskusi → voting → moderasi) dengan tingkat kegagalan fitur inti 0% saat pengujian akhir.
* **Kredibilitas Konten:** Terwujudnya minimal 5-10 profil *Verified Expert* yang aktif memberikan validasi pada jawaban di platform.

---

Sebagai **Senior Business Analyst & System Architect**, saya telah memperbarui struktur **Bab 4.1 In-Scope** untuk memastikan sinkronisasi antara ruang lingkup strategis dengan detail fungsional baru (Module K & L).

Penambahan ini sangat penting agar tidak terjadi *scope gap* saat dokumen ini diaudit oleh tim teknis maupun tim legal di tahap SRS nanti.

Berikut adalah revisi final yang telah dirapikan:

---

## 4. Project Scope

### 4.1 In-Scope (Fitur yang akan dibangun)
Ruang lingkup pengembangan MVP (*Minimum Viable Product*) OLION kini mencakup **12 modul utama** untuk menjamin fungsionalitas, kredibilitas, dan keadilan sistem:

1.  **Authentication & Account:** Registrasi, login (JWT), dan pembuatan profil dengan sistem pseudonim otomatis.
2.  **Discussion Module:** Pembuatan thread diskusi baru, kategori topik, dan pencarian diskusi.
3.  **Interaction Module:** Fitur menjawab pertanyaan dan memberikan komentar pada jawaban.
4.  **Voting & Reputation:** Mekanisme upvote/downvote serta kalkulasi skor reputasi pengguna.
5.  **Moderation System:** Fitur pelaporan konten (*report*) dan *dashboard* aksi untuk moderator.
6.  **AI Services:** Integrasi chatbot OLION untuk bantuan diskusi dan pendeteksian dini konten sensitif.
7.  **Notification:** Notifikasi dalam sistem untuk aktivitas diskusi (jawaban baru, vote, atau laporan).
8.  **Search & Discovery:** Fitur pencarian diskusi berdasarkan kata kunci dan filter kategori.
9.  **Analytics:** *Dashboard* sederhana untuk memantau statistik diskusi dan pengguna bagi Admin.
10. **System Security:** Penerapan *rate limiting*, validasi input, dan enkripsi data sensitif (password).
11. **Verified Expert Lifecycle Management:** Sistem pengajuan verifikasi pakar, pengunggahan dokumen kompetensi, pemberian badge khusus, dan hak prioritas jawaban pakar.
12. **User Dispute Resolution System:** Mekanisme banding (*appeal*) bagi pengguna terhadap tindakan moderasi untuk menjamin keadilan dan transparansi platform.

---

### 4.2 Out-of-Scope (Fitur yang tidak dibangun/ditunda)
Fitur-fitur berikut tidak termasuk dalam fase pengembangan saat ini dan akan dipertimbangkan untuk pengembangan di masa depan:
* **Mobile Application (Native):** Pengembangan aplikasi khusus Android/iOS (fokus saat ini hanya pada Web Responsive).
* **Real-time Video/Audio Chat:** Diskusi dilakukan sepenuhnya melalui teks dan media gambar.
* **Monetisasi/Payment Gateway:** Tidak ada fitur transaksi keuangan atau langganan berbayar dalam MVP.
* **Integrasi Media Sosial Lanjutan:** Seperti otomatisasi posting ke platform sosial media eksternal (Instagram/Twitter).
* **Sistem Badge & Gamifikasi Kompleks:** Penghargaan pengguna baru sebatas skor reputasi numerik dan status *Verified Expert*.

---

## 5. Stakeholders & User Profiles

### 5.1 Stakeholder Matrix
Matriks ini memetakan pihak-pihak yang memiliki kepentingan terhadap keberhasilan proyek OLION, baik yang berinteraksi langsung maupun tidak langsung dengan sistem.

| Stakeholder | Peran | Kepentingan Utama | Tingkat Pengaruh |
| :--- | :--- | :--- | :--- |
| **Project Owner (beel)** | Pemilik & Pengembang | Menjamin kualitas teknis, keamanan data, dan ketercapaian target MVP tepat waktu. | **High** |
| **Dosen Pengampu** | Mentor Intelektual | Memastikan metodologi perancangan sistem (Analisis & Desain) memenuhi standar akademik. | **High** |
| **Target Pengguna** | Subjek Riset/User | Membutuhkan platform diskusi yang menjamin keamanan psikologis (pseudonimitas). | **Medium** |
| **Pihak Institusi** | Fasilitator | Memantau apakah platform dapat digunakan sebagai media pembelajaran yang valid. | **Low** |

---

### 5.2 User Personas
Berikut adalah profil aktor (manusia dan sistem) yang akan berinteraksi dan memiliki hak akses di dalam aplikasi OLION:

#### **1. Regular User (Pengguna Umum)**
* **Karakteristik:** Pelajar atau individu yang ingin bertanya/berdiskusi tanpa terbebani identitas asli.
* **Tujuan:** Mencari informasi, bertanya, menjawab, dan membangun reputasi melalui kontribusi positif.
* **Aksi Utama:** Registrasi, mengelola profil pseudonim, membuat diskusi, memberikan vote (upvote/downvote), dan melaporkan konten negatif.

#### **2. Verified Expert (Pakar Terverifikasi)**
* **Karakteristik:** Individu dengan keahlian yang telah divalidasi oleh dokumen resmi (ijazah/sertifikat).
* **Tujuan:** Memberikan jawaban berbasis data/ilmu pengetahuan dan memvalidasi kebenaran diskusi.
* **Aksi Utama:** Semua aksi Regular User + memberikan label "Verified Answer" pada jawaban yang akurat untuk meningkatkan kredibilitas thread.

#### **3. Moderator**
* **Karakteristik:** Pengguna dengan tingkat kepercayaan tinggi yang bertugas menjaga etika komunitas.
* **Tujuan:** Memastikan diskusi bebas dari spam, ujaran kebencian, dan konten toksik.
* **Aksi Utama:** Memantau *report queue*, menyetujui/menolak laporan, menghapus konten melanggar, dan memberikan peringatan kepada pengguna.

#### **4. Administrator & Data Analyst**
* **Karakteristik:** Pengelola sistem tertinggi yang berfokus pada operasional dan data.
* **Tujuan:** Menjaga stabilitas sistem, memverifikasi akun Expert, dan menganalisis tren pertumbuhan platform.
* **Aksi Utama:** Manajemen user (ban/unban), verifikasi dokumen Expert, melihat dashboard statistik penggunaan (Modul I), dan mengaudit log keamanan (Modul J).

#### **5. System AI (Autonomous Actor)**
* **Karakteristik:** Entitas kecerdasan buatan yang terintegrasi di dalam sistem (Modul F).
* **Tujuan:** Memberikan asistensi instan kepada pengguna dan melakukan moderasi otomatis tingkat awal.
* **Aksi Utama:** Memberikan jawaban otomatis (Chatbot), melakukan *sentiment analysis* pada postingan baru, dan secara otomatis menandai (flagging) konten yang terdeteksi mengandung risiko tinggi (bullying/spam).

---

## 6. Functional Business Requirements

---

### 6.1 MODULE A — AUTHENTICATION & ACCOUNT MANAGEMENT

---

| BR-ID  | Business Requirement Statement                                                                                                                                                           | Rationale (Alasan Bisnis)                                             | Status |
| ------ | -------------------------------------------------------------------------------------------------------------------/-------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ |
| BR-A01 | Sistem harus mampu memungkinkan pengguna untuk membuat akun terverifikasi untuk memperoleh akses resmi ke sistem.                                                                        | Memastikan hanya pengguna valid yang dapat masuk ke ekosistem sistem. | FROZEN |
| BR-A02 | Sistem harus mampu mengautentikasi identitas pengguna untuk memastikan akses hanya diberikan kepada pihak yang sah.                                                                      | Melindungi sistem dari akses tidak sah.                               | FROZEN |
| BR-A03 | Sistem harus mampu memastikan autentikasi pengguna sebelum mengizinkan aktivitas yang memerlukan akuntabilitas (hanya pada AccountID (private domain), tidak pernah terekspos publik)    | Menjamin setiap aktivitas dapat ditelusuri ke identitas pengguna.     | FROZEN |
| BR-A04 | Sistem harus mampu memungkinkan pemulihan akses akun untuk menjaga keberlanjutan penggunaan sistem.                                                                                      | Mengurangi kehilangan akses oleh pengguna sah.                        | FROZEN |
| BR-A05 | Sistem harus mampu menerapkan kebijakan kredensial yang aman untuk melindungi akun pengguna.                                                                                             | Mengurangi risiko kompromi akun.                                      | FROZEN |
| BR-A06 | Sistem harus mampu menyediakan identitas publik alternatif untuk melindungi identitas pribadi pengguna (PersonaID adalah satu-satunya identitas publik).                                 | Menjaga privasi pengguna.                                             | FROZEN |
| BR-A07 | Sistem harus mampu memungkinkan pengelolaan identitas publik dalam batas kebijakan sistem.                                                                                               | Memberikan fleksibilitas tanpa mengorbankan kontrol.                  | FROZEN |
| BR-A08 | Sistem harus mampu mengelola sesi akses pengguna untuk mendukung penggunaan multi-perangkat.                                                                                             | Meningkatkan kenyamanan penggunaan.                                   | FROZEN |
| BR-A09 | Sistem harus mampu memungkinkan penghentian sesi aktif oleh pengguna untuk meningkatkan kontrol keamanan.                                                                                | Memberikan kontrol langsung kepada pengguna.                          | FROZEN |
| BR-A10 | Sistem harus mampu mengelola status akun untuk mengontrol akses pengguna.                                                                                                                | Mendukung pengelolaan siklus hidup akun.                              | FROZEN |
| BR-A11 | Sistem harus mampu menerapkan kontrol akses berbasis peran untuk membatasi akses fitur.                                                                                                  | Menjamin prinsip least privilege.                                     | FROZEN |
| BR-A12 | Sistem harus mampu mengelola masa berlaku sesi untuk meminimalkan risiko akses tidak sah.                                                                                                | Mengurangi risiko session hijacking.                                  | FROZEN |
| BR-A13 | Sistem harus mampu mendeteksi dan merespons aktivitas autentikasi mencurigakan.                                                                                                          | Meningkatkan keamanan sistem secara proaktif.                         | FROZEN |
| BR-A14 | Sistem harus mampu mencatat aktivitas autentikasi untuk kebutuhan audit.                                                                                                                 | Mendukung investigasi dan compliance.                                 | FROZEN |
| BR-A15 | Sistem harus mampu memastikan keunikan identitas akun.                                                                                                                                   | Mencegah duplikasi akun.                                              | FROZEN |
| BR-A16 | Sistem harus mampu menyediakan mekanisme autentikasi tambahan untuk meningkatkan keamanan akun.                                                                                          | Menambah lapisan keamanan (defense in depth).                         | FROZEN |
| BR-A17 | Sistem harus mampu mengunci akun sementara setelah aktivitas berisiko.                                                                                                                   | Mencegah brute-force dan abuse.                                       | FROZEN |
| BR-A18 | Sistem harus mampu mendeteksi penggunaan akun yang tidak wajar.                                                                                                                          | Mengurangi risiko kompromi akun.                                      | FROZEN |
| BR-A19 | Sistem harus mampu mengelola pembaruan kredensial secara berkala.                                                                                                                        | Menjaga keamanan jangka panjang.                                      | FROZEN |
| BR-A20 | Sistem harus mampu menyimpan riwayat aktivitas akses pengguna.                                                                                                                           | Mendukung audit keamanan.                                             | FROZEN |
| BR-A21 | Sistem harus mampu memungkinkan pengguna meminta penghapusan akun.                                                                                                                       | Memenuhi hak kontrol data pengguna.                                   | FROZEN |
| BR-A22 | Sistem harus mampu menyimpan catatan penghapusan akun.                                                                                                                                   | Mendukung audit dan kepatuhan regulasi.                               | FROZEN |
| BR-A23 | Sistem harus mampu mencatat persetujuan pengguna terhadap kebijakan.                                                                                                                     | Memenuhi persyaratan legal dan compliance.                            | FROZEN |
| BR-A24 | Sistem harus mampu mengelola perubahan kredensial dengan memperbarui validitas sesi.                                                                                                     | Mencegah penyalahgunaan sesi lama.                                    | FROZEN |
| BR-A25 | Sistem harus mampu memungkinkan pengguna memantau sesi aktif.                                                                                                                            | Meningkatkan transparansi keamanan.                                   | FROZEN |
| BR-A26 | Sistem harus mampu memungkinkan pencabutan sesi aktif oleh pengguna atau administrator.                                                                                                  | Mengendalikan akses secara cepat.                                     | FROZEN |
| BR-A27 | Sistem harus mampu memberi notifikasi aktivitas autentikasi berisiko kepada pengguna.                                                                                                    | Meningkatkan awareness keamanan.                                      | FROZEN |
| BR-A28 | Sistem harus mampu memungkinkan administrator mengelola sesi pengguna.                                                                                                                   | Mendukung kontrol operasional sistem.                                 | FROZEN |

---

### 6.2 MODULE B — DISCUSSION SYSTEM

---

| BR-ID  | Business Requirement Statement                                                                                            | Rationale (Alasan Bisnis)                      | Status |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------ |
| BR-B01 | Sistem harus mampu memungkinkan pengguna untuk membuat diskusi untuk memfasilitasi pertukaran pengetahuan.                | Mendukung kolaborasi dan knowledge sharing.    | FROZEN |
| BR-B02 | Sistem harus mampu mengelola struktur diskusi berutas untuk menjaga keterkaitan antar kontribusi.                         | Menjaga konteks percakapan tetap jelas.        | FROZEN |
| BR-B03 | Sistem harus mampu memungkinkan pengguna untuk memperbarui konten diskusi miliknya untuk menjaga akurasi informasi.       | Memastikan informasi tetap relevan dan benar.  | FROZEN |
| BR-B04 | Sistem harus mampu memungkinkan pengguna untuk menghapus diskusi miliknya sesuai kebijakan kepemilikan.                   | Memberikan kontrol terhadap konten pribadi.    | FROZEN |
| BR-B05 | Sistem harus mampu mengklasifikasikan diskusi menggunakan kategori untuk meningkatkan pengelolaan konten.                 | Mempermudah navigasi dan pengelolaan konten.   | FROZEN |
| BR-B06 | Sistem harus mampu mengklasifikasikan diskusi menggunakan label untuk meningkatkan pencarian dan pengelompokan.           | Meningkatkan discoverability konten.           | FROZEN |
| BR-B07 | Sistem harus mampu mengelola visibilitas diskusi untuk mengontrol akses konten.                                           | Menjamin kontrol akses terhadap informasi.     | FROZEN |
| BR-B08 | Sistem harus mampu mengelola siklus hidup diskusi untuk memastikan pengendalian status konten.                            | Menjaga keteraturan dan validitas konten.      | FROZEN |
| BR-B09 | Sistem harus mampu memungkinkan penyimpanan diskusi sebagai draf sebelum publikasi.                                       | Mendukung proses penyusunan konten.            | FROZEN |
| BR-B10 | Sistem harus mampu memulihkan draf diskusi untuk mencegah kehilangan konten.                                              | Menjaga produktivitas pengguna.                | FROZEN |
| BR-B11 | Sistem harus mampu mengarsipkan diskusi tidak aktif untuk menjaga keteraturan konten aktif.                               | Mengurangi clutter pada konten aktif.          | FROZEN |
| BR-B12 | Sistem harus mampu menerapkan kebijakan retensi diskusi untuk memenuhi kepatuhan dan pengelolaan data.                    | Mendukung compliance dan governance data.      | FROZEN |
| BR-B13 | Sistem harus mampu menjaga kepemilikan dan atribusi diskusi untuk memastikan akuntabilitas (Ownership = PersonaID ONLY).  | Menjamin setiap konten memiliki pemilik jelas. | FROZEN |
| BR-B14 | Sistem harus mampu menyimpan riwayat perubahan diskusi untuk transparansi dan audit.                                      | Mendukung audit trail.                         | FROZEN |
| BR-B15 | Sistem harus mampu memungkinkan pemulihan versi diskusi sebelumnya.                                                       | Memperbaiki kesalahan tanpa kehilangan data.   | FROZEN |
| BR-B16 | Sistem harus mampu memungkinkan penguncian diskusi untuk mencegah perubahan lebih lanjut.                                 | Mendukung moderasi konten.                     | FROZEN |
| BR-B17 | Sistem harus mampu memungkinkan transfer kepemilikan diskusi secara terkontrol.                                           | Menjamin keberlanjutan pengelolaan konten.     | FROZEN |
| BR-B18 | Sistem harus mampu mencegah duplikasi diskusi untuk menjaga kualitas konten.                                              | Menghindari redundansi informasi.              | FROZEN |
| BR-B19 | Sistem harus mampu memungkinkan pengguna menelusuri daftar diskusi untuk menemukan konten relevan.                        | Meningkatkan aksesibilitas informasi.          | FROZEN |
| BR-B20 | Sistem harus mampu mengumpulkan metrik keterlibatan diskusi untuk analisis penggunaan.                                    | Mendukung pengambilan keputusan berbasis data. | FROZEN |

---

### 6.3 MODULE C — ANSWER & COMMENT INTERACTION

---

| BR-ID  | Business Requirement Statement                                                                                                          | Rationale (Alasan Bisnis)                              | Status |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| BR-C01 | Sistem harus mampu memungkinkan pengguna untuk memberikan jawaban pada diskusi untuk mendukung penyelesaian pertanyaan.                 | Memfasilitasi penyelesaian masalah berbasis komunitas. | FROZEN |
| BR-C02 | Sistem harus mampu memungkinkan pengguna untuk memberikan komentar pada diskusi atau jawaban untuk mendukung klarifikasi.               | Mendukung diskusi tambahan dan elaborasi.              | FROZEN |
| BR-C03 | Sistem harus mampu mengelola struktur komentar berutas untuk menjaga keterkaitan antar kontribusi.                                      | Menjaga konteks percakapan.                            | FROZEN |
| BR-C04 | Sistem harus mampu memungkinkan pengguna untuk memperbarui jawaban dan komentar miliknya untuk menjaga akurasi konten.                  | Menjamin kualitas informasi.                           | FROZEN |
| BR-C05 | Sistem harus mampu memungkinkan pengguna untuk menghapus jawaban dan komentar miliknya sesuai kebijakan.                                | Memberikan kontrol atas kontribusi.                    | FROZEN |
| BR-C06 | Sistem harus mampu menjaga kepemilikan dan atribusi jawaban dan komentar untuk memastikan akuntabilitas (Ownership = PersonaID ONLY).   | Menjamin setiap kontribusi dapat ditelusuri.           | FROZEN |
| BR-C07 | Sistem harus mampu mengelola visibilitas jawaban dan komentar untuk mengontrol akses konten.                                            | Mendukung kontrol akses dan privasi.                   | FROZEN |
| BR-C08 | Sistem harus mampu menjaga urutan jawaban dan komentar untuk mempertahankan alur diskusi yang logis.                                    | Meningkatkan keterbacaan diskusi.                      | FROZEN |
| BR-C09 | Sistem harus mampu memvalidasi konten sebelum dipublikasikan untuk menjaga kualitas dan kepatuhan.                                      | Mencegah konten tidak layak.                           | FROZEN |
| BR-C10 | Sistem harus mampu menyimpan riwayat perubahan jawaban dan komentar untuk transparansi dan audit.                                       | Mendukung audit trail.                                 | FROZEN |
| BR-C11 | Sistem harus mampu memungkinkan pemulihan versi sebelumnya dari jawaban dan komentar.                                                   | Mengurangi risiko kehilangan informasi.                | FROZEN |
| BR-C12 | Sistem harus mampu mendeteksi kontribusi yang tidak wajar untuk mencegah penyalahgunaan sistem.                                         | Menjaga integritas platform.                           | FROZEN |
| BR-C13 | Sistem harus mampu mengelola frekuensi kontribusi untuk menjaga stabilitas sistem.                                                      | Mencegah spam dan abuse.                               | FROZEN |
| BR-C14 | Sistem harus mampu membatasi kedalaman struktur komentar untuk menjaga keterbacaan.                                                     | Menghindari struktur diskusi yang kompleks.            | FROZEN |
| BR-C15 | Sistem harus mampu memungkinkan penandaan jawaban sebagai jawaban yang diterima untuk menandai solusi utama.                            | Mempermudah identifikasi solusi.                       | FROZEN |
| BR-C16 | Sistem harus mampu membatasi perubahan pada jawaban yang telah diterima untuk menjaga stabilitas solusi.                                | Menjaga konsistensi solusi utama.                      | FROZEN |
| BR-C17 | Sistem harus mampu memungkinkan moderator mengelola interaksi komentar untuk menjaga kualitas diskusi.                                  | Mendukung moderasi konten.                             | FROZEN |

---

### 6.4 MODULE D — VOTING & REPUTATION LOGIC

---

| BR-ID  | Business Requirement Statement                                                                                 | Rationale (Alasan Bisnis)                              | Status |
| ------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| BR-D01 | Sistem harus mampu memungkinkan pengguna untuk memberikan suara pada konten untuk menilai kualitas kontribusi. | Mendukung evaluasi kualitas berbasis komunitas.        | FROZEN |
| BR-D02 | Sistem harus mampu memastikan setiap pengguna hanya memberikan satu suara per konten untuk menjaga keadilan.   | Mencegah manipulasi voting.                            | FROZEN |
| BR-D03 | Sistem harus mampu memungkinkan pengguna untuk mengubah atau menarik suara yang telah diberikan.               | Memberikan fleksibilitas penilaian.                    | FROZEN |
| BR-D04 | Sistem harus mampu menghitung reputasi pengguna berdasarkan kontribusi dan interaksi komunitas.                | Mencerminkan tingkat kepercayaan pengguna.             | FROZEN |
| BR-D05 | Sistem harus mampu menampilkan reputasi pengguna untuk meningkatkan transparansi kontribusi.                   | Memberikan visibilitas terhadap kredibilitas pengguna. | FROZEN |
| BR-D06 | Sistem harus mampu mengelola hak istimewa pengguna berdasarkan tingkat reputasi.                               | Mendukung governance berbasis reputasi.                | FROZEN |
| BR-D07 | Sistem harus mampu mencegah penyalahgunaan mekanisme voting untuk menjaga integritas sistem.                   | Menjaga kualitas sistem penilaian.                     | FROZEN |
| BR-D08 | Sistem harus mampu mendeteksi aktivitas voting yang tidak wajar untuk mengurangi manipulasi.                   | Mencegah fraud reputasi.                               | FROZEN |
| BR-D09 | Sistem harus mampu menjaga transparansi hasil voting sesuai kebijakan keterbukaan.                             | Meningkatkan kepercayaan komunitas.                    | FROZEN |
| BR-D10 | Sistem harus mampu mencatat aktivitas voting untuk mendukung audit dan investigasi.                            | Mendukung forensic analysis.                           | FROZEN |
| BR-D11 | Sistem harus mampu membatasi hak voting berdasarkan status pengguna.                                           | Mengontrol akses fitur voting.                         | FROZEN |
| BR-D12 | Sistem harus mampu mengelola penalti reputasi berdasarkan pelanggaran kebijakan.                               | Menjaga kualitas komunitas.                            | FROZEN |
| BR-D13 | Sistem harus mampu memungkinkan pemulihan reputasi berdasarkan pemenuhan kriteria tertentu.                    | Mendukung rehabilitasi pengguna.                       | FROZEN |
| BR-D14 | Sistem harus mampu menyimpan riwayat perubahan reputasi untuk transparansi dan audit.                          | Menjamin akuntabilitas sistem reputasi.                | FROZEN |

---

### 6.5 MODULE E — REPORTING & COMMUNITY MODERATION

---

| BR-ID  | Business Requirement Statement                                                                                                     | Rationale (Alasan Bisnis)                                 | Status |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------ |
| BR-E01 | Sistem harus mampu memungkinkan pengguna untuk melaporkan konten yang diduga melanggar kebijakan untuk menjaga kualitas komunitas. | Memberikan mekanisme kontrol kualitas berbasis komunitas. | FROZEN |
| BR-E02 | Sistem harus mampu mengklasifikasikan laporan berdasarkan jenis pelanggaran untuk mempermudah penanganan.                          | Mempercepat proses triase kasus.                          | FROZEN |
| BR-E03 | Sistem harus mampu memprioritaskan laporan berdasarkan tingkat risiko untuk mempercepat penanganan kasus kritis.                   | Mengoptimalkan respon terhadap pelanggaran berat.         | FROZEN |
| BR-E04 | Sistem harus mampu mengelola antrian moderasi untuk memastikan penanganan laporan secara sistematis.                               | Menjamin proses moderasi terstruktur.                     | FROZEN |
| BR-E05 | Sistem harus mampu memungkinkan moderator meninjau laporan dan menentukan tindakan terhadap konten, Dual-Control (Two-man rule).   | Mendukung pengambilan keputusan moderasi.                 | FROZEN |
| BR-E06 | Sistem harus mampu menerapkan tindakan terhadap konten yang melanggar kebijakan.                                                   | Menjaga kepatuhan terhadap aturan komunitas.              | FROZEN |
| BR-E07 | Sistem harus mampu mengelola status laporan untuk menjaga keterlacakan proses moderasi.                                            | Mendukung tracking proses penanganan.                     | FROZEN |
| BR-E08 | Sistem harus mampu mencatat seluruh tindakan moderasi untuk memastikan akuntabilitas.                                              | Mendukung audit dan transparansi.                         | FROZEN |
| BR-E09 | Sistem harus mampu memberi notifikasi kepada pengguna terkait hasil moderasi.                                                      | Meningkatkan transparansi kepada pengguna.                | FROZEN |
| BR-E10 | Sistem harus mampu mendukung eskalasi kasus moderasi untuk penanganan pelanggaran kompleks.                                        | Menjamin kasus kritis ditangani dengan tepat.             | FROZEN |
| BR-E11 | Sistem harus mampu mencegah penyalahgunaan mekanisme pelaporan.                                                                    | Menjaga integritas sistem pelaporan.                      | FROZEN |
| BR-E12 | Sistem harus mampu menyimpan riwayat pelanggaran pengguna.                                                                         | Mendukung enforcement kebijakan berkelanjutan.            | FROZEN |
| BR-E13 | Sistem harus mampu menerapkan tindakan disiplin progresif berdasarkan riwayat pelanggaran.                                         | Mendorong kepatuhan pengguna.                             | FROZEN |
| BR-E14 | Sistem harus mampu memungkinkan pengguna mengajukan banding atas keputusan moderasi.                                               | Menjamin fairness dalam sistem.                           | FROZEN |
| BR-E15 | Sistem harus mampu mendukung peninjauan ulang keputusan moderasi.                                                                  | Menjamin kualitas keputusan moderasi.                     | FROZEN |
| BR-E16 | Sistem harus mampu memantau kinerja moderasi untuk peningkatan operasional.                                                        | Mendukung evaluasi performa moderator.                    | FROZEN |
| BR-E17 | Sistem harus mampu mengelola penugasan kasus moderasi kepada moderator.                                                            | Menjaga distribusi beban kerja.                           | FROZEN |
| BR-E18 | Sistem harus mampu menyediakan analitik moderasi untuk mendukung pengambilan keputusan manajemen.                                  | Mendukung strategi berbasis data.                         | FROZEN |

---

### 6.6 MODULE F — AI-POWERED SERVICES

---

| BR-ID  | Business Requirement Statement                                                                                      | Rationale (Alasan Bisnis)                 | Status |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------ |
| BR-F01 | Sistem harus mampu menyediakan analisis konten otomatis untuk mendeteksi potensi pelanggaran kebijakan.             | Meningkatkan efisiensi moderasi.          | FROZEN |
| BR-F02 | Sistem harus mampu mengklasifikasikan konten berdasarkan kategori atau tingkat risiko untuk mendukung moderasi.     | Mempercepat proses triase konten.         | FROZEN |
| BR-F03 | Sistem harus mampu mendeteksi pola konten bermasalah untuk mencegah pelanggaran berulang.                           | Meningkatkan pencegahan abuse.            | FROZEN |
| BR-F04 | Sistem harus mampu menghasilkan rekomendasi tindakan terhadap konten untuk membantu pengambilan keputusan moderasi. | Mendukung decision support system.        | FROZEN |
| BR-F05 | Sistem harus mampu menghasilkan laporan otomatis berbasis analisis AI untuk mempercepat proses pelaporan.           | Mengurangi beban manual reporting.        | FROZEN |
| BR-F06 | Sistem harus mampu menyediakan layanan chatbot berbasis AI untuk membantu pengguna mendapatkan informasi.           | Meningkatkan pengalaman pengguna.         | FROZEN |
| BR-F07 | Sistem harus mampu memahami konteks percakapan untuk memberikan respons yang relevan.                               | Meningkatkan kualitas interaksi AI.       | FROZEN |
| BR-F08 | Sistem harus mampu menyediakan pencarian berbasis AI untuk meningkatkan efisiensi penemuan informasi.               | Mempercepat akses informasi.              | FROZEN |
| BR-F09 | Sistem harus mampu meningkatkan kualitas respons AI berdasarkan pola interaksi pengguna.                            | Mendukung continuous improvement AI.      | FROZEN |
| BR-F10 | Sistem harus mampu memantau kinerja layanan AI untuk memastikan kualitas layanan.                                   | Menjamin performa AI tetap optimal.       | FROZEN |
| BR-F11 | Sistem harus mampu mendeteksi kegagalan layanan AI untuk menjaga kontinuitas sistem.                                | Mengurangi downtime layanan.              | FROZEN |
| BR-F12 | Sistem harus mampu menyediakan mekanisme fallback ketika layanan AI tidak tersedia.                                 | Menjamin sistem tetap berjalan tanpa AI.  | FROZEN |
| BR-F13 | Sistem harus mampu mencatat aktivitas layanan AI untuk audit dan evaluasi.                                          | Mendukung transparansi penggunaan AI.     | FROZEN |
| BR-F14 | Sistem harus mampu menyediakan transparansi hasil analisis AI kepada pihak terkait.                                 | Meningkatkan trust terhadap AI.           | FROZEN |
| BR-F15 | Sistem harus mampu mendukung pembaruan model AI untuk peningkatan kemampuan layanan.                                | Menjamin AI tetap relevan dan up-to-date. | FROZEN |
| BR-F16 | Sistem harus mampu membatasi penggunaan layanan AI untuk menjaga stabilitas sumber daya.                            | Mengontrol konsumsi resource.             | FROZEN |
| BR-F17 | Sistem harus mampu mengevaluasi kualitas respons AI untuk memastikan akurasi dan relevansi.                         | Menjamin kualitas output AI.              | FROZEN |
| BR-F18 | Sistem harus mampu mengintegrasikan layanan AI dengan modul lain secara konsisten (AI hanya boleh akses PersonaID). | Mendukung interoperabilitas sistem.       | FROZEN |
| BR-F19 | Sistem harus mampu mengelola pengetahuan AI untuk meningkatkan kualitas layanan informasi.                          | Mendukung knowledge-driven AI.            | FROZEN |
| BR-F20 | Sistem harus mampu memastikan penggunaan AI sesuai kebijakan etika dan tata kelola.                                 | Menjamin compliance dan responsible AI.   | FROZEN |

---

### 6.7 MODULE G — NOTIFICATION SYSTEM

---

| BR-ID  | Business Requirement Statement                                                                                                   | Rationale (Alasan Bisnis)                       | Status |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| BR-G01 | Sistem harus mampu menghasilkan notifikasi berdasarkan peristiwa sistem untuk memberikan informasi yang relevan kepada pengguna. | Menjamin pengguna mendapatkan update penting.   | FROZEN |
| BR-G02 | Sistem harus mampu mengirimkan notifikasi melalui berbagai saluran komunikasi untuk memastikan penyampaian pesan (generic only). | Meningkatkan tingkat keterjangkauan notifikasi. | FROZEN |
| BR-G03 | Sistem harus mampu mendukung berbagai jenis notifikasi untuk memenuhi kebutuhan komunikasi sistem.                               | Mendukung variasi use case notifikasi.          | FROZEN |
| BR-G04 | Sistem harus mampu memungkinkan pengguna mengatur preferensi notifikasi untuk menyesuaikan kebutuhan informasi.                  | Memberikan kontrol kepada pengguna.             | FROZEN |
| BR-G05 | Sistem harus mampu menghormati preferensi notifikasi pengguna dalam pengiriman pesan.                                            | Menghindari notifikasi yang tidak diinginkan.   | FROZEN |
| BR-G06 | Sistem harus mampu mengelompokkan notifikasi berdasarkan konteks untuk meningkatkan keterbacaan.                                 | Mempermudah pemahaman informasi.                | FROZEN |
| BR-G07 | Sistem harus mampu menyediakan riwayat notifikasi untuk peninjauan oleh pengguna.                                                | Mendukung tracking informasi.                   | FROZEN |
| BR-G08 | Sistem harus mampu mengelola status notifikasi untuk menunjukkan kondisi baca pengguna.                                          | Meningkatkan user awareness.                    | FROZEN |
| BR-G09 | Sistem harus mampu mengelola prioritas notifikasi untuk memastikan pesan penting didahulukan.                                    | Menjamin urgensi informasi tersampaikan.        | FROZEN |
| BR-G10 | Sistem harus mampu membatasi frekuensi notifikasi untuk menjaga kenyamanan pengguna.                                             | Mencegah notifikasi berlebihan.                 | FROZEN |
| BR-G11 | Sistem harus mampu memastikan keandalan pengiriman notifikasi.                                                                   | Menjaga konsistensi komunikasi sistem.          | FROZEN |
| BR-G12 | Sistem harus mampu mencatat aktivitas pengiriman notifikasi untuk audit dan pemantauan.                                          | Mendukung observability dan audit.              | FROZEN |
| BR-G13 | Sistem harus mampu mengirim ulang notifikasi yang gagal untuk meningkatkan keberhasilan pengiriman.                              | Mengurangi kehilangan pesan.                    | FROZEN |
| BR-G14 | Sistem harus mampu menyaring notifikasi untuk memastikan relevansi informasi bagi pengguna.                                      | Meningkatkan kualitas pengalaman pengguna.      | FROZEN |

---

### 6.8 MODULE H — SEARCH & DISCOVERY

---

| BR-ID  | Business Requirement Statement                                                                                             | Rationale (Alasan Bisnis)             | Status |
| ------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------ |
| BR-H01 | Sistem harus mampu memungkinkan pengguna mencari konten berdasarkan kata kunci untuk memudahkan akses informasi.           | Mempercepat akses informasi.          | FROZEN |
| BR-H02 | Sistem harus mampu menampilkan hasil pencarian yang relevan untuk meningkatkan efisiensi pencarian informasi.              | Meningkatkan akurasi hasil pencarian. | FROZEN |
| BR-H03 | Sistem harus mampu memungkinkan pengguna menyaring hasil pencarian berdasarkan kriteria tertentu untuk mempersempit hasil. | Memberikan kontrol pencarian.         | FROZEN |
| BR-H04 | Sistem harus mampu memungkinkan pengguna mengurutkan hasil pencarian untuk mempermudah penemuan informasi.                 | Meningkatkan usability pencarian.     | FROZEN |
| BR-H05 | Sistem harus mampu menyediakan saran pencarian untuk membantu pengguna menyempurnakan kueri.                               | Mengurangi kesalahan pencarian.       | FROZEN |
| BR-H06 | Sistem harus mampu menampilkan pratinjau konten dalam hasil pencarian untuk membantu pemahaman awal.                       | Meningkatkan efisiensi eksplorasi.    | FROZEN |
| BR-H07 | Sistem harus mampu menyimpan riwayat pencarian pengguna untuk memudahkan penggunaan ulang.                                 | Meningkatkan user convenience.        | FROZEN |
| BR-H08 | Sistem harus mampu menampilkan konten rekomendasi untuk meningkatkan eksplorasi konten.                                    | Meningkatkan engagement pengguna.     | FROZEN |
| BR-H09 | Sistem harus mampu menampilkan konten populer untuk membantu pengguna menemukan tren.                                      | Meningkatkan discoverability.         | FROZEN |
| BR-H10 | Sistem harus mampu menampilkan konten terbaru untuk menyediakan informasi terkini.                                         | Mendukung freshness konten.           | FROZEN |
| BR-H11 | Sistem harus mampu mengelompokkan konten berdasarkan kategori untuk mempermudah navigasi.                                  | Meningkatkan struktur informasi.      | FROZEN |
| BR-H12 | Sistem harus mampu menampilkan konten terkait untuk meningkatkan eksplorasi informasi.                                     | Meningkatkan kedalaman interaksi.     | FROZEN |
| BR-H13 | Sistem harus mampu memastikan performa pencarian tetap responsif untuk menjaga pengalaman pengguna.                        | Menjamin UX yang baik.                | FROZEN |
| BR-H14 | Sistem harus mampu mencatat aktivitas pencarian untuk analisis penggunaan.                                                 | Mendukung data-driven improvement.    | FROZEN |
| BR-H15 | Sistem harus mampu menyesuaikan hasil pencarian berdasarkan konteks pengguna untuk meningkatkan relevansi.                 | Personalisasi pengalaman pengguna.    | FROZEN |
| BR-H16 | Sistem harus mampu mendukung berbagai jalur penemuan konten untuk meningkatkan aksesibilitas informasi.                    | Mendukung multi-entry discovery.      | FROZEN |

---

### 6.9 MODULE I - ANALYTICS & BUSINESS REPORTING

---

| BR-ID  | Business Requirement Statement                                                                                                                              | Rationale (Alasan Bisnis)                | Status |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------ |
| BR-I01 | Sistem harus mampu mengumpulkan data operasional dari berbagai modul untuk mendukung analisis kinerja sistem, Data harus agregat (no raw user-level join).  | Menyediakan data sebagai dasar analitik. | FROZEN |
| BR-I02 | Sistem harus mampu mengolah data menjadi metrik yang bermakna untuk mengevaluasi performa sistem.                                                           | Mengubah data menjadi insight.           | FROZEN |
| BR-I03 | Sistem harus mampu menyajikan metrik dalam bentuk visualisasi untuk memudahkan pemahaman.                                                                   | Meningkatkan interpretasi data.          | FROZEN |
| BR-I04 | Sistem harus mampu menyediakan dasbor analitik untuk menampilkan ringkasan performa sistem.                                                                 | Mendukung monitoring operasional.        | FROZEN |
| BR-I05 | Sistem harus mampu menghasilkan laporan berkala untuk mendukung evaluasi operasional.                                                                       | Mendukung reporting manajemen.           | FROZEN |
| BR-I06 | Sistem harus mampu memungkinkan pembuatan laporan khusus oleh pengguna berwenang.                                                                           | Mendukung kebutuhan analisis fleksibel.  | FROZEN |
| BR-I07 | Sistem harus mampu mendukung analisis tren untuk mengidentifikasi perubahan pola penggunaan.                                                                | Mendukung strategic insight.             | FROZEN |
| BR-I08 | Sistem harus mampu mendukung analisis aktivitas pengguna untuk memahami perilaku penggunaan sistem.                                                         | Mendukung user behavior analysis.        | FROZEN |
| BR-I09 | Sistem harus mampu mendukung analisis performa konten untuk mengevaluasi kualitas dan engagement.                                                           | Mengukur kualitas konten.                | FROZEN |
| BR-I10 | Sistem harus mampu menyediakan indikator peringatan berbasis data untuk mendeteksi masalah operasional.                                                     | Mendukung early warning system.          | FROZEN |
| BR-I11 | Sistem harus mampu membatasi akses data analitik hanya kepada pihak berwenang.                                                                              | Menjaga keamanan data.                   | FROZEN |
| BR-I12 | Sistem harus mampu menjaga konsistensi dan akurasi data analitik.                                                                                           | Menjamin kualitas informasi.             | FROZEN |
| BR-I13 | Sistem harus mampu menyimpan data historis untuk mendukung analisis jangka panjang.                                                                         | Mendukung long-term analysis.            | FROZEN |
| BR-I14 | Sistem harus mampu menyediakan ekspor laporan analitik untuk penggunaan eksternal.                                                                          | Mendukung interoperability data.         | FROZEN |
| BR-I15 | Sistem harus mampu menyediakan wawasan berbasis data untuk mendukung pengambilan keputusan.                                                                 | Mendukung decision making.               | FROZEN |
| BR-I16 | Sistem harus mampu mendukung evaluasi efektivitas kebijakan berdasarkan data analitik.                                                                      | Mendukung governance berbasis data.      | FROZEN |

---

### 6.10 MODULE J — SYSTEM SAFETY & SECURITY STANDARDS

---

| BR-ID  | Business Requirement Statement                                                                         | Rationale (Alasan Bisnis)        | Status |
| ------ | ------------------------------------------------------------------------------------------------------ | -------------------------------- | ------ |
| BR-J01 | Sistem harus mampu mengamankan komunikasi data untuk melindungi kerahasiaan informasi.                 | Melindungi data in-transit.      | FROZEN |
| BR-J02 | Sistem harus mampu mengelola autentikasi pengguna untuk memastikan akses hanya oleh entitas yang sah.  | Menjamin validitas identitas.    | FROZEN |
| BR-J03 | Sistem harus mampu mengelola otorisasi pengguna untuk memastikan akses sesuai hak yang diberikan.      | Mencegah akses tidak sah.        | FROZEN |
| BR-J04 | Sistem harus mampu mengelola sesi pengguna untuk menjaga keamanan selama penggunaan sistem.            | Mengontrol akses aktif pengguna. | FROZEN |
| BR-J05 | Sistem harus mampu melindungi data sensitif untuk menjaga kerahasiaan informasi.                       | Menjaga data privacy.            | FROZEN |
| BR-J06 | Sistem harus mampu memastikan integritas data untuk mencegah perubahan tidak sah.                      | Menjamin keakuratan data.        | FROZEN |
| BR-J07 | Sistem harus mampu mendeteksi aktivitas mencurigakan untuk mencegah ancaman keamanan.                  | Early threat detection.          | FROZEN |
| BR-J08 | Sistem harus mampu mencatat aktivitas keamanan untuk mendukung audit dan investigasi.                  | Mendukung forensik keamanan.     | FROZEN |
| BR-J09 | Sistem harus mampu memulihkan layanan setelah gangguan untuk menjaga keberlangsungan operasional.      | Business continuity.             | FROZEN |
| BR-J10 | Sistem harus mampu menjaga ketersediaan layanan untuk memastikan akses berkelanjutan.                  | High availability.               | FROZEN |
| BR-J11 | Sistem harus mampu membatasi percobaan akses yang gagal untuk mencegah penyalahgunaan.                 | Mencegah brute force attack.     | FROZEN |
| BR-J12 | Sistem harus mampu melindungi sistem dari ancaman keamanan umum untuk menjaga stabilitas.              | Mengurangi risiko serangan umum. | FROZEN |
| BR-J13 | Sistem harus mampu melakukan pencadangan data untuk mencegah kehilangan informasi.                     | Data protection.                 | FROZEN |
| BR-J14 | Sistem harus mampu memulihkan data dari cadangan untuk menjaga keberlanjutan sistem.                   | Disaster recovery.               | FROZEN |
| BR-J15 | Sistem harus mampu mengelola konfigurasi keamanan untuk memastikan penerapan kebijakan yang konsisten. | Governance keamanan.             | FROZEN |
| BR-J16 | Sistem harus mampu mengelola identitas sistem untuk memastikan kontrol akses yang konsisten.           | Identity management.             | FROZEN |
| BR-J17 | Sistem harus mampu memastikan kepatuhan terhadap kebijakan keamanan yang berlaku.                      | Compliance & trust.              | FROZEN |
| BR-J18 | Sistem harus mampu memantau kondisi keamanan secara berkelanjutan untuk mendeteksi risiko.             | Continuous security monitoring.  | FROZEN |

---

### 6.11 MODULE K — VERIFIED EXPERT MANAGEMENT

---

| BR-ID  | Business Requirement Statement                                                                                           | Rationale (Alasan Bisnis)                    | Status |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------ |
| BR-K01 | Sistem harus mampu menyediakan mekanisme pengajuan status Expert untuk mengidentifikasi pengguna dengan keahlian khusus. | Menyediakan jalur formal identifikasi pakar. | FROZEN |
| BR-K02 | Sistem harus mampu memvalidasi keahlian pengguna melalui proses verifikasi dokumen untuk memastikan kredibilitas.        | Menjamin keabsahan klaim keahlian.           | FROZEN |
| BR-K03 | Sistem harus mampu mengelola status verifikasi Expert untuk mendukung keterlacakan proses validasi.                      | Mendukung governance proses verifikasi.      | FROZEN |
| BR-K04 | Sistem harus mampu menampilkan identitas Expert secara visual untuk meningkatkan kepercayaan pengguna.                   | Memberikan trust signal dalam sistem.        | FROZEN |
| BR-K05 | Sistem harus mampu mengaitkan Expert dengan bidang spesialisasi untuk memastikan relevansi kontribusi.                   | Menjamin akurasi domain keahlian.            | FROZEN |
| BR-K06 | Sistem harus mampu memberikan hak istimewa kepada Expert untuk meningkatkan kualitas diskusi.                            | Mendorong kontribusi berkualitas tinggi.     | FROZEN |
| BR-K07 | Sistem harus mampu mengontrol dan mencabut status Expert untuk menjaga integritas sistem.                                | Menjaga kredibilitas ekosistem.              | FROZEN |
| BR-K08 | Sistem harus mampu menyimpan riwayat verifikasi Expert untuk mendukung audit dan transparansi.                           | Mendukung akuntabilitas sistem.              | FROZEN |
| BR-K09 | Sistem harus mampu mengelola pembaruan data keahlian Expert secara berkala untuk menjaga relevansi.                      | Menjamin data tetap up-to-date.              | FROZEN |
| BR-K10 | Sistem harus mampu mengintegrasikan status Expert dengan sistem reputasi untuk meningkatkan kredibilitas kontribusi.     | Sinkronisasi dengan gamifikasi reputasi.     | FROZEN |
| BR-K11 | Sistem harus mampu menjaga anonimitas pengguna selama proses verifikasi Expert untuk melindungi identitas asli.          | Menjaga prinsip anonimitas terkontrol.       | FROZEN |
| BR-K12 | Sistem harus mampu Verifikasi hanya di domain Account.                                                                   | Menjaga prinsip anonimitas terkontrol.       | FROZEN |

---

### 6.12 MODULE L — APPEAL & DISPUTE MANAGEMENT

---

| BR-ID  | Business Requirement Statement                                                                                      | Rationale (Alasan Bisnis)            | Status |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------ |
| BR-L01 | Sistem harus mampu menyediakan mekanisme pengajuan banding atas tindakan moderasi untuk menjamin keadilan pengguna. | Memberikan fairness dalam sistem.    | FROZEN |
| BR-L02 | Sistem harus mampu memvalidasi kelayakan pengajuan banding untuk mencegah penyalahgunaan.                           | Menjaga integritas proses banding.   | FROZEN |
| BR-L03 | Sistem harus mampu mengelola proses banding secara terstruktur untuk memastikan keterlacakan dan transparansi.      | Mendukung governance proses banding. | FROZEN |
| BR-L04 | Sistem harus mampu memastikan independensi proses review banding untuk menghindari konflik kepentingan.             | Menjamin objektivitas keputusan.     | FROZEN |
| BR-L05 | Sistem harus mampu menetapkan dan mengeksekusi keputusan banding untuk menjamin kepastian hasil.                    | Memberikan kepastian hukum sistem.   | FROZEN |
| BR-L06 | Sistem harus mampu mencatat seluruh aktivitas banding untuk mendukung audit dan investigasi.                        | Mendukung forensic audit.            | FROZEN |
| BR-L07 | Sistem harus mampu mengontrol batasan dan aturan banding untuk mencegah abuse.                                      | Menjaga stabilitas sistem.           | FROZEN |
| BR-L08 | Sistem harus mampu menjaga anonimitas pengguna dalam proses banding untuk melindungi identitas asli.                | Menjaga privasi pengguna.            | FROZEN |
| BR-L09 | Sistem harus mampu menyediakan komunikasi status banding kepada pengguna untuk meningkatkan transparansi.           | Meningkatkan trust pengguna.         | FROZEN |
| BR-L10 | Sistem harus mampu mengevaluasi performa dan pola banding untuk peningkatan kualitas moderasi.                      | Mendukung continuous improvement.    | FROZEN |
| BR-L11 | Sistem harus mampu mengamankan data banding dan membatasi akses hanya kepada pihak berwenang.                       | Menjaga keamanan informasi sensitif. | FROZEN |

---

## 7. Business Rules & Logic (BRL)

### 7.1 General Business Rules

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

---

### 7.2 Module-Specific Rules

#### 7.2.1 MODULE A — AUTHENTICATION & ACCOUNT MANAGEMENT

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

---

#### 7.2.2 MODULE B — DISCUSSION SYSTEM

---

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

---

#### 7.2.3 MODULE C — ANSWER & COMMENT INTERACTION

---

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

---

#### 7.2.4 MODULE D — VOTING & REPUTATION LOGIC

---

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

---

#### 7.2.5 MODULE E — REPORTING & COMMUNITY MODERATION

---

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

---

#### 7.2.6 MODULE F — AI-POWERED SERVICES

---

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

---

#### 7.2.7 MODULE G — NOTIFICATION SYSTEM

---

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

---

#### 7.2.8 MODULE H — SEARCH & DISCOVERY

---

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

---

#### 7.2.9 MODULE I — ANALYTICS & BUSINESS REPORTING

---

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

---

#### 7.2.10 MODULE J — SYSTEM SAFETY & SECURITY STANDARDS

---

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

---

#### 7.2.11 MODULE K — VERIFIED EXPERT MANAGEMENT

---

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

---

#### 7.2.12 MODULE L — APPEAL & DISPUTE MANAGEMENT

---

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

## 8. Non-Functional Business Requirements

### 8.1 Performance & Scalability
Kebutuhan ini memastikan sistem tetap responsif seiring dengan bertumbuhnya jumlah konten diskusi dan pengguna, terutama saat beban komputasi AI meningkat.

| ID | Parameter | Spesifikasi Kebutuhan Bisnis |
| :--- | :--- | :--- |
| **NFR-PS-01** | **Response Time** | Sistem harus mampu memuat halaman utama (*feed* diskusi) dalam waktu < 2 detik dan memberikan respons API dalam waktu < 500ms pada kondisi jaringan normal. |
| **NFR-PS-02** | **Concurrency** | Infrastruktur harus mampu menangani minimal 500 pengguna aktif secara bersamaan (*concurrent users*) pada fase awal tanpa degradasi performa yang signifikan. |
| **NFR-PS-03** | **Horizontal Scalability** | Arsitektur sistem harus mendukung *Horizontal Scaling* (penambahan *instance* server) untuk menangani lonjakan trafik mendadak selama jam operasional akademik. |
| **NFR-PS-04** | **Database Performance** | Mekanisme *indexing* dan *query optimization* harus diimplementasikan untuk memastikan pencarian kata kunci (Modul H) tetap cepat meskipun data diskusi telah mencapai > 100.000 baris. |
| **NFR-PS-05** | **AI Processing** | Analisis konten otomatis oleh AI (Modul F) tidak boleh menghambat proses publikasi postingan; sistem harus menggunakan antrean pesan (*message queue*) untuk pemrosesan asinkron. |

### 8.2 Security & Compliance
Mengingat OLION membawa nilai utama "anonimitas", aspek keamanan identitas adalah prioritas tertinggi guna mencegah kebocoran data pribadi yang dapat memicu *doxing*.

| ID | Parameter | Spesifikasi Kebutuhan Bisnis | Tujuan Arsitektur |
| :--- | :--- | :--- | :--- |
| **NFR-SC-01** | **Multi-Layer Data Encryption** | Seluruh data sensitif wajib dienkripsi *at rest* (AES-256) dan *in transit* (TLS 1.3). Kunci enkripsi (KMS) untuk *Identity Vault* wajib terpisah secara fisik dan logis dari kunci enkripsi data konten. | Mencegah kebocoran data menyeluruh (*full data breach*) jika salah satu kunci atau basis data kompromi. |
| **NFR-SC-02** | **Strict Identity Decoupling** | Sistem wajib menerapkan pemisahan logis dan fisik (Isolated VPC/Schema) antara tabel RealID (Auth) dan PersonaID (Diskusi). Relasi antara kedua domain hanya boleh melalui *One-Way Hash Mapping*. | Menghilangkan kemungkinan *Table Join* antara identitas asli dan aktivitas anonim oleh DB Admin, aplikasi internal, maupun penyerang. |
| **NFR-SC-03** | **Zero-Access Control (RBAC)** | Implementasi RBAC ketat; Moderator dilarang keras melihat identitas asli. Akses ke *Identity Vault* hanya diberikan kepada Administrator sistem tertentu dengan otorisasi *multi-party* dan audit log yang tidak dapat diubah. | Melindungi privasi pengguna dari penyalahgunaan wewenang internal dan memastikan moderasi tetap objektif. |
| **NFR-SC-04** | **Input Sanitization & Validation** | Sistem wajib menerapkan sanitasi input tingkat tinggi pada setiap *entry point* (API & UI) menggunakan pustaka terverifikasi untuk mencegah serangan XSS, SQL Injection, dan NoSQL Injection. | Menjaga integritas data dan mencegah injeksi kode yang dapat membocorkan token sesi atau data identitas. |
| **NFR-SC-05** | **Multi-Level Rate Limiting** | Mekanisme *Rate Limiting* diterapkan pada modul autentikasi, posting, dan voting untuk mencegah *Brute Force*, *Spamming*, serta serangan *Sybil* pada reputasi. | Menjamin ketersediaan sistem (*availability*) dan mencegah manipulasi opini melalui bot otomatis. |
| **NFR-SC-06** | **Zero-Knowledge Mapping** | *Mapping* antara `AccountID` dan `PersonaID` tidak boleh disimpan dalam teks terang (*plain text*). Harus menggunakan HMAC dengan *Pepper/Salt* yang disimpan di *Hardware Security Module* (HSM). | Menjamin bahwa developer, DB Admin, atau pihak ketiga tidak bisa melakukan *reverse-lookup* identitas asli pengguna meskipun memiliki akses basis data. |
| **NFR-SC-07** | **Privacy-Preserving Audit** | Log aktivitas sistem dilarang menyimpan alamat IP mentah atau *User Agent*. Data forensik harus di-anonimkan (menggunakan *Rotating Salt Hash*) sebelum disimpan ke repositori log permanen. | Mencegah de-anonimisasi melalui analisis pola trafik, korelasi waktu, dan jejak forensik digital. |
| **NFR-SC-08** | **Blind Moderation Policy** | Antarmuka (UI) dan API untuk Moderator tidak boleh menyediakan *endpoint* yang menampilkan kaitan antara `PersonaID` dengan informasi identitas asli (Email/Nama). | Menghapus risiko *doxing* oleh moderator dan menjaga integritas filosofi anonimitas platform. |
| **NFR-SC-09** | **Data Warehouse Anonymization** | Data yang dikirim ke modul Analytics wajib melalui *anonymization layer* (k-anonymity) untuk memastikan tidak ada pola yang dapat mengidentifikasi individu secara unik. | Memastikan laporan bisnis dan analitik tidak menjadi jalur belakang (*backdoor*) untuk de-anonimisasi pengguna. |

### 8.3 Availability & Reliability
Kebutuhan ini menjamin platform OLION dapat diandalkan sebagai media pembelajaran berkelanjutan dengan risiko kehilangan data yang minimal.

| ID | Parameter | Spesifikasi Kebutuhan Bisnis |
| :--- | :--- | :--- |
| **NFR-AR-01** | **System Uptime** | Sistem harus mencapai tingkat ketersediaan (Availability) minimal **99.7%** (tiga sembilan) per bulan untuk mendukung aktivitas akademik yang tidak terikat waktu. |
| **NFR-AR-02** | **Disaster Recovery** | Strategi pencadangan data (*Automated Backup*) wajib dilakukan setiap 24 jam ke lokasi penyimpanan yang berbeda (*off-site storage*) dengan retensi minimal 30 hari. |
| **NFR-AR-03** | **Fault Tolerance** | Sistem harus memiliki mekanisme penanganan kesalahan (*graceful degradation*); jika layanan AI (Modul F) mengalami gangguan, fungsi utama diskusi harus tetap dapat berjalan secara manual. |
| **NFR-AR-04** | **Recovery Time Objective** | Jika terjadi kegagalan total sistem, target waktu pemulihan (RTO) maksimal adalah 4 jam hingga layanan dapat diakses kembali oleh pengguna. |

---

## 9. Project Constraints, Assumptions, & Dependencies

### 9.1 Constraints

Proyek OLION memiliki sejumlah batasan yang harus dipahami sejak awal karena memengaruhi ruang lingkup, pendekatan teknis, serta prioritas pengembangan. Batasan-batasan ini bersifat mengikat dan menjadi acuan dalam pengambilan keputusan selama siklus pengembangan MVP.

Secara umum, proyek dikembangkan secara mandiri oleh beel dengan fokus pada penyelesaian fitur inti (MVP). Seluruh keputusan desain, implementasi, dan dokumentasi harus realistis terhadap keterbatasan sumber daya, waktu, dan kapasitas pengelolaan sistem.

#### 9.1.1 Budgetary Constraints

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

#### 9.1.2 Timeline Constraints

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

#### 9.1.3 Regulatory Constraints

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

### 9.2 Assumptions

Dokumen BRD ini disusun berdasarkan sejumlah asumsi yang dianggap benar dan stabil pada tahap perencanaan dan pengembangan MVP OLION. Apabila asumsi-asumsi ini berubah di kemudian hari, maka penyesuaian terhadap kebutuhan bisnis, desain sistem, maupun implementasi teknis dapat diperlukan.

1. Diasumsikan bahwa pengguna wajib memiliki akun dan melakukan login untuk dapat membuat diskusi, jawaban, atau komentar. Sistem tidak mendukung partisipasi tanpa akun (anonymous guest) pada tahap MVP.

2. Diasumsikan bahwa pseudonym digunakan sebagai identitas publik utama dalam seluruh aktivitas diskusi untuk mendukung konsep anonimitas terkontrol, sementara identitas asli pengguna tetap tersimpan secara internal dan tidak ditampilkan ke publik.

3. Diasumsikan bahwa perilaku pengguna secara umum mengikuti aturan komunitas, dan mekanisme moderasi (report, hide, warn, resolve) cukup untuk menangani sebagian besar pelanggaran yang terjadi.

4. Diasumsikan bahwa proses moderasi dilakukan oleh role Moderator dan/atau Admin sesuai dengan hak akses yang telah didefinisikan, tanpa melibatkan sistem moderasi otomatis berbasis AI pada tahap MVP.

5. Diasumsikan bahwa jumlah pengguna pada fase MVP masih dalam skala kecil hingga menengah, sehingga performa dan skalabilitas sistem dapat dikelola dengan arsitektur sederhana.

6. Diasumsikan bahwa fitur-fitur yang tidak termasuk dalam ruang lingkup MVP (seperti chat real-time, monetisasi, atau rekomendasi berbasis machine learning) tidak menjadi kebutuhan mendesak pada fase awal.

7. Diasumsikan bahwa sistem akan dikembangkan secara bertahap dan iteratif, sehingga kebutuhan baru dapat muncul dan disempurnakan pada versi berikutnya berdasarkan evaluasi penggunaan MVP.

8. Diasumsikan bahwa dokumen BRD, SRS, dan dokumentasi teknis lainnya akan diperbarui secara berkala untuk mencerminkan perubahan atau penyesuaian yang terjadi selama pengembangan.

### 9.3 External Dependencies

Pengembangan dan implementasi proyek OLION memiliki sejumlah ketergantungan (dependencies) yang dapat memengaruhi kelancaran pengembangan, kualitas hasil, serta ketepatan waktu rilis MVP. Dependencies ini mencakup ketergantungan teknis, sumber daya, dan faktor eksternal non-organisasi.

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

## 10. Risks & Mitigation Plan

Meskipun proyek OLION dinilai layak untuk dikembangkan, terdapat sejumlah risiko potensial yang dapat memengaruhi keberhasilan proyek apabila tidak dikelola dengan baik. Oleh karena itu, diperlukan identifikasi risiko secara sistematis beserta strategi mitigasi yang relevan untuk meminimalkan dampak negatif selama fase pengembangan dan implementasi MVP.

### 10.1 Identified Business Risks

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

### 10.2 Mitigation Strategies

Strategi mitigasi risiko pada proyek OLION dirancang dengan pendekatan preventif dan korektif, dengan fokus utama pada stabilitas sistem, kualitas diskusi, dan keberhasilan rilis MVP. Pendekatan mitigasi yang diterapkan meliputi:

1. Kontrol kualitas berbasis komunitas dan moderasi, melalui voting, report, dan moderation queue untuk menangani penyalahgunaan anonimitas.

2. Keamanan aplikasi web standar industri, termasuk validasi input, kontrol autentikasi, dan pengelolaan sesi/token.

3. Manajemen scope dan prioritas fitur, dengan menahan penambahan fitur non-esensial hingga fase pasca-MVP.

4. Pengelolaan beban kerja solo developer, dengan membagi pengembangan ke dalam milestone kecil yang terukur.

5. Disiplin dokumentasi dan implementasi, agar perubahan kebutuhan tidak menyebabkan inkonsistensi sistem.

### 10.3 Alternative Solutions Analysis

Sebelum menentukan pendekatan utama, beberapa alternatif solusi telah dipertimbangkan dan dievaluasi untuk memastikan pendekatan yang dipilih paling sesuai dengan tujuan proyek OLION.

| No | Alternatif Solusi | Kelebihan | Kekurangan |
|-------|:-----:|:------:|----------|
| 1 | Menggunakan platform forum eksisting (mis. Discourse, Reddit Clone) | Implementasi cepat, stabil, ekosistem plugin matang | Kustomisasi terbatas, anonimitas tidak fleksibel |
| 2 | Mengembangkan aplikasi mobile native (Android/iOS) | Aksesibilitas tinggi, notifikasi push | Biaya dan waktu pengembangan lebih besar |
| 3 | Mengembangkan aplikasi web kustom | Fleksibel, sesuai kebutuhan MVP, kontrol penuh anonimitas | Kustomisasi terbatas, Waktu perancangan dan pengujian lebih lama |

Berdasarkan hasil evaluasi, Alternatif 3 (aplikasi web kustom) dipilih karena memberikan fleksibilitas penuh dalam desain sistem, penerapan anonimitas terkontrol, serta pengendalian fitur diskusi sesuai kebutuhan bisnis dan akademik proyek OLION.

---

## 11. Glossary

Daftar istilah ini disusun secara alfabetis untuk memberikan definisi operasional terhadap terminologi kunci yang digunakan dalam ekosistem proyek OLION.

| Istilah | Definisi |
| :--- | :--- |
| **Accepted Answer** | Status yang diberikan oleh pembuat diskusi pada sebuah jawaban yang dianggap paling membantu atau menyelesaikan permasalahan. |
| **Administrator** | Tingkat hak akses tertinggi dalam sistem yang bertanggung jawab atas manajemen pengguna, verifikasi pakar, dan konfigurasi global aplikasi. |
| **AI (Artificial Intelligence)** | Kecerdasan buatan yang dalam sistem ini digunakan untuk moderasi konten otomatis, analisis sentimen, dan layanan bantuan pengguna melalui chatbot. |
| **Anonimitas Terkontrol** | Konsep di mana identitas asli pengguna disembunyikan dari publik, namun tetap terekam secara terenkripsi di *database* untuk kepentingan audit dan akuntabilitas hukum. |
| **BRD (Business Requirement Document)** | Dokumen yang merinci kebutuhan bisnis, tujuan strategis, dan batasan fungsional dari proyek perangkat lunak. |
| **Downvote** | Tindakan pengguna untuk memberikan penilaian negatif pada sebuah konten yang dianggap tidak relevan, salah, atau melanggar aturan, yang berdampak pada pengurangan poin reputasi penulis. |
| **Expert Verification** | Proses validasi kredibilitas pengguna melalui pemeriksaan dokumen resmi (sertifikat/ijazah) untuk memberikan label "Verified Expert". |
| **Frozen** | Status kebutuhan (*requirement*) dalam BRD yang menandakan bahwa deskripsi tersebut telah disetujui dan tidak dapat diubah tanpa prosedur kontrol perubahan resmi. |
| **MVP (Minimum Viable Product)** | Versi produk dengan fitur-fitur minimal namun fungsional yang cukup untuk memenuhi kebutuhan dasar pengguna dan mengumpulkan *feedback* awal. |
| **Moderasi** | Proses pengawasan dan peninjauan konten oleh manusia (Moderator) atau sistem (AI) untuk memastikan kepatuhan terhadap standar komunitas. |
| **Pseudonym** | Identitas publik alternatif (nama samaran) yang dihasilkan secara acak oleh sistem untuk melindungi privasi identitas asli pengguna. |
| **Rate Limiting** | Kebijakan pembatasan jumlah aksi (seperti posting atau login) yang dapat dilakukan pengguna dalam periode waktu tertentu untuk mencegah *spam* dan penyalahgunaan. |
| **Reputasi** | Skor numerik yang mencerminkan tingkat kredibilitas dan kontribusi positif seorang pengguna di dalam komunitas OLION. |
| **Sentiment Analysis** | Penggunaan pemrosesan bahasa alami (NLP) oleh AI untuk mendeteksi emosi atau intensi (positif, negatif, netral) dalam sebuah postingan. |
| **SRS (Software Requirement Specification)** | Dokumen teknis lanjutan dari BRD yang merinci spesifikasi fungsional, non-fungsional, dan teknis untuk kebutuhan pengembangan perangkat lunak. |
| **Thread (Utas)** | Kumpulan diskusi yang terdiri dari satu topik utama (pertanyaan/topik) diikuti oleh rangkaian jawaban dan komentar yang saling berkaitan. |
| **Upvote** | Tindakan pengguna untuk memberikan penilaian positif pada konten yang dianggap berkualitas, yang berkontribusi pada peningkatan poin reputasi penulis. |
| **User Persona** | Representasi fiktif dari target pengguna aplikasi (Regular User, Expert, dsb) untuk memahami kebutuhan dan perilaku mereka dalam sistem. |
| **Verified Expert** | Status akun yang telah melewati proses verifikasi kompetensi, memberikan otorisasi untuk memberikan jawaban yang memiliki bobot kredibilitas lebih tinggi. |

---

## 12. Approval & Sign-off

Pernyataan persetujuan resmi terhadap isi Business Requirement Document (BRD) OLION. Dengan menandatangani bagian ini, pihak terkait menyatakan bahwa seluruh kebutuhan bisnis, ruang lingkup, asumsi, dan batasan yang tertuang dalam dokumen ini telah dipahami, disetujui, dan akan menjadi acuan utama dalam pengembangan proyek.

| Name | Role | Signature | Date |
|------|:----:|:---------:|------|
| beel | Project Owner / Developer | __________ | 03-02-2026 |

**Approved By: beel**
**Role: Project Owner**
**Date: 03-02-2026**
























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

#### Requirement R-A04: Password Reset

|           RequirementID | R-A04                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------- |
|        Requirement Name | Password Reset                                                                         |
| Requirement Description | Sistem harus menyediakan mekanisme reset password berbasis email untuk pemulihan akun. |
|   Impacted Stakeholders | User / Expert                                                                          |
|      Business Objective | BR-01                                                                                  |

##### Use Case UC-A04: Password Reset

|          UsecaseID | UC-A04                                                                                                   |
| -----------------: | -------------------------------------------------------------------------------------------------------- |
|       Usecase Name | Password Reset                                                                                           |
|             Actors | Primary: User / Expert                                                                                   |
|     Pre Conditions | 1) Email terdaftar                                                                                       |
|      Primary Steps | 1. User meminta reset password                                                                           |
|                    | 2. Sistem kirim email token                                                                              |
|                    | 3. User submit password baru                                                                             |
|                    | 4. Sistem update password                                                                                |
|    Alternate Steps | A1. Token invalid                                                                                        |
| Business Objective | BR-01                                                                                                    |

###### Scenario SC-A06: Password Reset Success

|         ScenarioID | SC-A06                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Password Reset success                             |
|              GIVEN | user memiliki email valid                          |
|               WHEN | user reset password                                |
|               THEN | sistem memperbarui password                        |
| Business Objective | BR-01                                              |

###### Scenario SC-A09: Password Reset Failed (Invalid Token)

|         ScenarioID | SC-A06                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Password Reset Failed (Invalid Token)                              |
|              GIVEN | user memiliki token reset                                          |
|               WHEN | user memasukkan token yang tidak valid                             |
|               THEN | sistem menolak reset password dan menampilkan error token invalid  |
| Business Objective | BR-01                                                              |

---

#### Requirement R-A05: Email Verification

|           RequirementID | R-A05                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------- |
|        Requirement Name | Email Verification                                                                     |
| Requirement Description | Sistem harus memverifikasi email pengguna untuk memastikan validitas akun.             |
|   Impacted Stakeholders | User / Expert                                                                          |
|      Business Objective | BR-01                                                                                  |

##### Use Case UC-A05: Verify Email

|          UsecaseID | UC-A05                                                                                                   |
| -----------------: | -------------------------------------------------------------------------------------------------------- |
|       Usecase Name | Ability to Verify Email                                                                                  |
|             Actors | Primary: User; Secondary: System                                                                         |
|     Pre Conditions | 1) User telah registrasi                                                                                 |
|      Primary Steps | 1. User membuka link verifikasi                                                                          |
|                    | 2. Sistem validasi token                                                                                 |
|                    | 3. Sistem mengaktifkan akun                                                                              |
|    Alternate Steps | A1. Sistem menolak                                                                                       |
|                    | A2. Token expired                                                                                        |
|        Error Steps | E1. Token invalid                                                                                        |
|                    | E2. Error server                                                                                         |
| Business Objective | BR-01                                                                                                    |

###### Scenario SC-A07: Email Verified

|         ScenarioID | SC-A07                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Email Verified Successfully                        |
|              GIVEN | User membuka link verifikasi                       |
|               WHEN | Sistem validasi token                              |
|               THEN | Sistem mengaktifkan akun                           |
| Business Objective | BR-01                                              |

###### Scenario SC-A10: Email Verification Failed (Expired Token)

|         ScenarioID | SC-A10                                                         |
| -----------------: | -------------------------------------------------------------- |
|      Scenario Name | Email Verification Failed (Expired Token)                      |
|              GIVEN | Token verifikasi telah expired                                 |
|               WHEN | User membuka link verifikasi                                   |
|               THEN | Sistem menolak aktivasi akun dan meminta verifikasi ulang      |
| Business Objective | BR-01                                              |

---

#### Requirement R-A06: Session Management

|           RequirementID | R-A06                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------- |
|        Requirement Name | Manage Active Sessions                                                                 |
| Requirement Description | System mengelola sesi login aktif                                                      |
|   Impacted Stakeholders | System                                                                                 |
|      Business Objective | BR-01                                                                                  |

##### Use Case UC-A06: Manage Session

|          UsecaseID | UC-A06                                                                                                   |
| -----------------: | -------------------------------------------------------------------------------------------------------- |
|       Usecase Name | Ability to Manage Active Session                                                                         |
|             Actors | Primary: System                                                                                          |
|     Pre Conditions | 1) User login                                                                                            |
|      Primary Steps | 1. User memiliki sesi aktif                                                                              |
|                    | 2. Sistem mencabut sesi tertentu                                                                         |
|    Alternate Steps | A1. Sesi tidak ditemukan                                                                                 |
|        Error Steps | E1: Gagal revoke                                                                                         |
| Business Objective | BR-01                                                                                                    |

###### Scenario SC-A08: Session Revoked

|         ScenarioID | SC-A08                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Session Revoked                                    |
|              GIVEN | User memiliki sesi aktif                           |
|               WHEN | User login kembali                                 |
|               THEN | Sistem menghapus sesi                              |
| Business Objective | BR-01                                              |

###### Scenario SC-A11: Session Revoke Failed

|         ScenarioID | SC-A11                                                   |
| -----------------: | -------------------------------------------------------- |
|      Scenario Name | Session Revoke Failed                                    |
|              GIVEN | Sistem mencoba revoke session                            |
|               WHEN | Session tidak ditemukan                                  |
|               THEN | Sistem mencatat error dan tetap menjaga sesi aktif lain  |
| Business Objective | BR-01                                                    |

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

#### Requirement R-B05: Draft Management

|           RequirementID | R-B05                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Save & Load Draft                                                                                                           |
| Requirement Description | Sistem harus menyimpan dan memuat draft diskusi/jawaban.                                                                               |
|   Impacted Stakeholders | User / Expert                                                                                                                          |
|      Business Objective | BR-02                                                                                                                                  |

##### Use Case UC-B05: Save Draft

|          UsecaseID | UC-B05                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to Save & Load Draft                                 |
|             Actors | Primary: User; Secondary: System                             |
|     Pre Conditions | User login                                                   |
|      Primary Steps | 1. User mengetik konten                                      |
|                    | 2. Sistem auto-save draft                                    |
|                    | 3. User kembali membuka draft                                |
| Business Objective | BR-02                                                        |

###### Scenario SC-B06: Draft Saved

|         ScenarioID | SC-B06                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | Draft Saved                               |
|              GIVEN | user mengetik                             |
|               WHEN | auto-save aktif                           |
|               THEN | draft tersimpan                           |
| Business Objective | BR-02                                     |

---

#### Requirement R-B06: Hard Delete by Admin

|           RequirementID | R-B06                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Hard Delete Content                                                                                                         |
| Requirement Description | Admin dapat menghapus konten secara permanen dari sistem.                                                                              |
|   Impacted Stakeholders | Admin                                                                                                                                  |
|      Business Objective | BR-02                                                                                                                                  |

---

#### Requirement R-B07: Pagination

|           RequirementID | R-B07                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Pagination                                                                    |
| Requirement Description | Sistem membatasi data per halaman untuk performa.                                        |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-09                                                                                    |

##### Use Case UC-B07: Paginate Discussions

|          UsecaseID | UC-B07                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Paginate Discussions                                                |
|             Actors | Primary: User; Secondary: System                                               |
|     Pre Conditions | 1) User login                                                                  |
|      Primary Steps | 1. User buka halaman                                                           |
|                    | 2. Sistem simpan log                                                           |
| Business Objective | BR-09                                                                          |

###### Scenario SC-B08: Page Loaded

|         ScenarioID | SC-B08                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Page Loaded                                               |
|              GIVEN | pagination aktif                                          |
|               WHEN | halaman dibuka                                            |
|               THEN | data terbatas tampil                                      |
| Business Objective | BR-09                                                     |

---

#### Requirement R-B08: Sorting

|           RequirementID | R-B08                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Sort Discussions                                                              |
| Requirement Description | Sistem mengurutkan diskusi berdasarkan parameter tertentu.                               |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-09                                                                                    |

##### Use Case UC-B08: Sort Discussions

|          UsecaseID | UC-B08                            |
| -----------------: | --------------------------------- |
|       Usecase Name | Ability to Sort Discussions       |
|             Actors | Primary: User                     |
|     Pre Conditions | 1) List diskusi tersedia          |
|      Primary Steps | 1. User memilih parameter sorting |
|                    | 2. Sistem mengurutkan diskusi     |
|                    | 3. Sistem menampilkan hasil       |
| Business Objective | BR-09                             |

###### Scenario SC-B08: Discussions Sorted

|         ScenarioID | SC-B08                          |
| -----------------: | ------------------------------- |
|      Scenario Name | Discussions Sorted Successfully |
|              GIVEN | Diskusi tersedia                |
|               WHEN | User memilih sorting            |
|               THEN | Diskusi ditampilkan terurut     |
| Business Objective | BR-09                           |

---

#### Requirement R-B09: View Search Result

|           RequirementID | R-B08                                                                         |
| ----------------------: | ----------------------------------------------------------------------------- |
|        Requirement Name | Ability to search & discovery discussion (View Search Result)                 |
| Requirement Description | Sistem harus menampilkan hasil pencarian diskusi berdasarkan keyword.         |
|   Impacted Stakeholders | User / Expert                                                                 |
|      Business Objective | BR-10                                                                         |

##### Use Case UC-B09: View Search Result

|          UsecaseID | UC-B08                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to View Search Result                                                  |
|             Actors | Primary: User; Secondary: System                                               |
|     Pre Conditions | 1) User login 2) Keyword tersedia                                              |
|      Primary Steps | 1. User input keyword                                                          |
|                    | 2. Sistem proses                                                               |
|                    | 3. Tampilkan hasil                                                             |
| Business Objective | BR-10                                                                          |

###### Scenario SC-B10: Search Result Displayed

|         ScenarioID | SC-B09                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Search Result Displayed                                   |
|              GIVEN | keyword valid                                             |
|               WHEN | user search                                               |
|               THEN | hasil tampil                                              |
| Business Objective | BR-10                                                     |

---

#### Requirement R-B10: Validate Content Ownership

|           RequirementID | R-B10                                                                         |
| ----------------------: | ----------------------------------------------------------------------------- |
|        Requirement Name | Ability to Validate Ownership                                                 |
| Requirement Description | Sistem memastikan hanya pemilik konten yang dapat mengedit atau menghapus.    |
|   Impacted Stakeholders | User / Expert / System                                                        |
|      Business Objective | BR-07                                                                         |

##### Use Case UC-B10: Validate Ownership

|          UsecaseID | UC-B09                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Validate Ownership                                                  |
|             Actors | Primary: System;                                                               |
|     Pre Conditions | 1) User login 2) user memiliki konten                                          |
|      Primary Steps | 1. User request edit                                                           |
|                    | 2. Sistem cek ownership                                                        |
|                    | 3. Izinkan/tolak                                                               |
| Business Objective | BR-07                                                                          |

---

#### Requirement R-B11: Soft Delete Visibility Rule

|           RequirementID | R-B11                                                                         |
| ----------------------: | ----------------------------------------------------------------------------- |
|        Requirement Name | Ability to Soft Delete Visibility                                             |
| Requirement Description | Sistem mengatur visibilitas konten yang dihapus secara soft delete            |
|   Impacted Stakeholders | User / Expert / Moderator                                                     |
|      Business Objective | BR-07                                                                         |

---

#### Requirement R-B12: Follow Discussion

|           RequirementID | R-B12                                                                         |
| ----------------------: | ----------------------------------------------------------------------------- |
|        Requirement Name | Ability to Follow Discussion                                                  |
| Requirement Description | User dapat mengikuti diskusi untuk menerima update aktivitas                  |
|   Impacted Stakeholders | User / Expert                                                                 |
|      Business Objective | BR-01                                                                         |

##### Use Case UC-B12: Follow Discussion

|          UsecaseID | UC-B12                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Follow Discussion                                                   |
|             Actors | Primary: User; Secondary: System                                               |
|     Pre Conditions | 1) User login                                                                  |
|      Primary Steps | 1. User klik follow                                                            |
|                    | 2. Sistem simpan subscription                                                  |
|    Alternate Steps | A1. Sudah follow → ignore                                                      |
| Business Objective | BR-01                                                                          |

###### Scenario SC-B12: Discussion Followed

|         ScenarioID | SC-B12                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name |  Discussion Followed                                      |
|              GIVEN | user login                                                |
|               WHEN | klik follow                                               |
|               THEN | sistem menyimpan                                          |
| Business Objective | BR-01                                                     |

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

#### Requirement R-C05: Delete Comment

|           RequirementID | R-C05                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to delete comment                                                                                                              |
| Requirement Description | User dapat menghapus komentar miliknya dengan soft delete.                                                                             |
|   Impacted Stakeholders | User / Expert                                                                                                                          |
|      Business Objective | BR-03                                                                                                                                  |

##### Use Case UC-C05: Delete Comment

|          UsecaseID | UC-C05                                        |
| -----------------: | --------------------------------------------- |
|       Usecase Name | Ability to delete comment                     |
|             Actors | Primary: User; Secondary: System              |
|     Pre Conditions | 1) User login  2) User adalah pemilik comment |
|      Primary Steps | 1. User membuka comment miliknya              |
|                    | 2. User memilih aksi delete                   |
|                    | 3. Sistem melakukan soft delete               |
|                    | 4. Sistem mengembalikan respons sukses        |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak akses |
| Business Objective | BR-03                                         |

###### Scenario SC-C05: Comment Deleted

|         ScenarioID | SC-C05                                                                      |
| -----------------: | --------------------------------------------------------------------------- |
|      Scenario Name | Comment soft deleted successfully                                           |
|              GIVEN | User login dan memiliki comment                                             |
|               WHEN | User menghapus comment miliknya                                             |
|               THEN | Sistem menandai comment sebagai terhapus dan tidak menampilkan pada diskusi |
| Business Objective | BR-03                                                                       |

---

#### Requirement R-C06: Edit Comment

|           RequirementID | R-C06                                                                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to edit comment                                                                                                                |
| Requirement Description | User dapat mengedit komentar dalam batas waktu tertentu.                                                                               |
|   Impacted Stakeholders | User / Expert                                                                                                                          |
|      Business Objective | BR-03                                                                                                                                  |

##### Use Case UC-C06: Edit Comment

|          UsecaseID | UC-C06                                         |
| -----------------: | ---------------------------------------------- |
|       Usecase Name | Ability to Edit Comment                        |
|             Actors | Primary: User                                  |
|     Pre Conditions | 1) User login  2) User adalah pemilik komentar |
|      Primary Steps | 1. User memilih edit                           |
|                    | 2. User memperbarui isi                        |
|                    | 3. Sistem menyimpan perubahan                  |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak        |
| Business Objective | BR-03                                          |

###### Scenario SC-C06: Comment Edited

|         ScenarioID | SC-C06                                                                      |
| -----------------: | --------------------------------------------------------------------------- |
|      Scenario Name | Comment Edited Successfully                                                 |
|              GIVEN | User memiliki komentar                                                      |
|               WHEN | User mengedit                                                               |
|               THEN | Sistem menyimpan perubahan                                                  |
| Business Objective | BR-03                                                                       |

---

#### Requirement R-C07: Accept Answer

|           RequirementID | R-C07                                                                                  |
| ----------------------: | -------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Accept Answer                                                               |
| Requirement Description | Sistem memungkinkan pembuat diskusi menandai satu jawaban sebagai jawaban terbaik.     |
|   Impacted Stakeholders | User / Expert                                                                          |
|      Business Objective | BR-12                                                                                  |

##### Use Case UC-C07: Accept Answer

|          UsecaseID | UC-C07                                        |
| -----------------: | --------------------------------------------- |
|       Usecase Name | Ability to Accept Answer                      |
|             Actors | Primary: User; Secondary: System              |
|     Pre Conditions | 1) User login  2) User adalah pemilik diskusi |
|      Primary Steps | 1. User memilih jawaban                       |
|                    | 2. Sistem validasi ownership                  |
|                    | 3. Sistem tandai sebagai accepted             |
|    Alternate Steps | A1. User bukan pemilik → sistem menolak       |
| Business Objective | BR-12                                         |

###### Scenario SC-C07: Answer Accepted

|         ScenarioID | SC-C07                                                                      |
| -----------------: | --------------------------------------------------------------------------- |
|      Scenario Name | Answer Accepted successfully                                                |
|              GIVEN | user adalah pemilik diskusi                                                 |
|               WHEN | memilih jawaban                                                             |
|               THEN | sistem tandai sebagai accepted                                              |
| Business Objective | BR-12                                                                       |

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

#### Requirement R-D04: Reputation History

|           RequirementID | R-D04                                                                                                                        |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Track Reputation History                                                                                          |
| Requirement Description | Sistem mencatat histori perubahan reputasi user.                                                                             |
|   Impacted Stakeholders | User / Expert / Admin                                                                                                        |
|      Business Objective | BR-04                                                                                                                        |

##### Use Case UC-D04: View Reputation History

|          UsecaseID | UC-D04                                                           |
| -----------------: | ---------------------------------------------------------------- |
|       Usecase Name | Ability to Track Reputation History                              |
|             Actors | Primary: System; Secondary: User                                 |
|     Pre Conditions | 1) User login                                                    |
|      Primary Steps | 1. User buka profil                                              |
|                    | 2. Sistem tampilkan histori                                      |
| Business Objective | BR-04                                                            |

###### Scenario SC-D05: Reputation History Viewed

|         ScenarioID | SC-D05                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | Reputation History Viewed                 |
|              GIVEN | user buka profil                          |
|               WHEN | request histori                           |
|               THEN | sistem tampilkan data                     |
| Business Objective | BR-04                                     |

---

#### Requirement R-D05: Vote Abuse Detection

|           RequirementID | R-D05                                                                                                                        |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Detect Vote Abuse                                                                                                 |
| Requirement Description | Sistem mendeteksi pola voting abnormal untuk mencegah manipulasi.                                                            |
|   Impacted Stakeholders | System / Admin                                                                                                               |
|      Business Objective | BR-04                                                                                                                        |

##### Use Case UC-D05: Detect Vote Abuse

|          UsecaseID | UC-D05                                                           |
| -----------------: | ---------------------------------------------------------------- |
|       Usecase Name | Ability to Detect Vote Abuse                                     |
|             Actors | Primary: System                                                  |
|     Pre Conditions | 1) Voting activity tersedia                                      |
|      Primary Steps | 1. Sistem menganalisis pola voting                               |
|                    | 2. Sistem mendeteksi anomali                                     |
|                    | 3. Sistem menandai aktivitas                                     |
| Business Objective | BR-04                                                            |

###### Scenario SC-D06: Vote Abuse Detected

|         ScenarioID | SC-D06                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | Vote Abuse Detected                       |
|              GIVEN | Pola voting abnormal                      |
|               WHEN | Sistem analisis                           |
|               THEN | Sistem menandai abuse                     |
| Business Objective | BR-04                                     |

---

#### Requirement R-D06: Change Vote

|           RequirementID | R-D06                                                                         |
| ----------------------: | ----------------------------------------------------------------------------- |
|        Requirement Name | Ability to Change Vote                                                        |
| Requirement Description | User dapat mengubah atau membatalkan vote yang telah diberikan.               |
|   Impacted Stakeholders | User / Expert                                                                 |
|      Business Objective | BR-12                                                                         |

##### Use Case UC-D06: Change Vote

|          UsecaseID | UC-D05                                                           |
| -----------------: | ---------------------------------------------------------------- |
|       Usecase Name | Ability to Change Vote                                           |
|             Actors | Primary: System; Secondary: User                                 |
|     Pre Conditions | 1) User login                                                    |
|      Primary Steps | 1. User pilih vote baru                                          |
|                    | 2. Sistem update vote                                            |
|                    | 3. Recalculate                                                   |
| Business Objective | BR-04                                                            |

###### Scenario SC-D07: Vote Changed

|         ScenarioID | SC-D06                                    |
| -----------------: | ----------------------------------------- |
|      Scenario Name | Vote Changed                              |
|              GIVEN | user sudah vote                           |
|               WHEN | vote diubah                               |
|               THEN | sistem update nilai                       |
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

#### Requirement R-E05: Assign Moderator

|           RequirementID | R-E05                                                                                                                                        |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Assign Report                                                                                                                     |
| Requirement Description | Sistem memungkinkan penugasan laporan ke moderator.                                                                                          |
|   Impacted Stakeholders | Moderator / Admin                                                                                                                            |
|      Business Objective | BR-05                                                                                                                                        |

##### Use Case UC-E05: Assign Report

|          UsecaseID | UC-E05                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to Assign Report                                     |
|             Actors | Primary: Admin; Secondary: System                            |
|     Pre Conditions | 1) Admin login                                               |
|      Primary Steps | 1. Admin membuka detail laporan                              |
|                    | 2. Admin pilih report                                        |
|                    | 3. Assign ke moderato                                        |
|                    | 4. Sistem mengirim laporan ke moderator queue                |
| Business Objective | BR-05                                                        |

###### Scenario SC-E05: Assigned

|         ScenarioID | SC-E05                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Assigned                                                           |
|              GIVEN | report tersedia                                                    |
|               WHEN | admin assign                                                       |
|               THEN | report memiliki moderator                                          |
| Business Objective | BR-05                                                              |

---

#### Requirement R-E06: Moderation Notes

|           RequirementID | R-E06                                                                                                                                        |
| ----------------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Internal Moderation Notes                                                                                                         |
| Requirement Description | Moderator dapat menambahkan catatan internal pada laporan.                                                                                   |
|   Impacted Stakeholders | Moderator                                                                                                                                    |
|      Business Objective | BR-05                                                                                                                                        |

---

#### Requirement R-E07: View Report Status

|           RequirementID | R-E07                                                              |
| ----------------------: | ------------------------------------------------------------------ |
|        Requirement Name | Ability to Track Report Status                                     |
| Requirement Description | User dapat melihat status laporan yang telah dikirim.              |
|   Impacted Stakeholders | User                                                               |
|      Business Objective | BR-15                                                              |

##### Use Case UC-E07: View Report Status

|          UsecaseID | UC-E06                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to View Report Status                                |
|             Actors | Primary: User; Secondary: System                             |
|     Pre Conditions | 1) User login                                                |
|      Primary Steps | 1. User membuka laporan                                      |
|                    | 2. Sistem tampilkan status                                   |
| Business Objective | BR-15                                                        |

###### Scenario SC-E07: Report Status Viewed

|         ScenarioID | SC-E06                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Report Status Viewed                                               |
|              GIVEN | User punya report                                                  |
|               WHEN | buka status                                                        |
|               THEN | sistem tampilkan                                                   |
| Business Objective | BR-15                                                              |

---

#### Requirement R-E08: Moderation Result Notification

|           RequirementID | R-E08                                                              |
| ----------------------: | ------------------------------------------------------------------ |
|        Requirement Name | Ability to Notify Moderation Result                                |
| Requirement Description | Sistem memberi tahu user terkait hasil moderasi.                   |
|   Impacted Stakeholders | User                                                               |
|      Business Objective | BR-17                                                              |

##### Use Case UC-E08: Receive Moderation Result

|          UsecaseID | UC-E07                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to Receive Moderation Result                         |
|             Actors | Primary: User; Secondary: System                             |
|     Pre Conditions | 1) ada proses moderasi                                       |
|      Primary Steps | 1. Moderation selesai                                        |
|                    | 2. Sistem kirim notifikasi                                   |
| Business Objective | BR-17                                                        |

###### Scenario SC-E08: Moderation Result Sent

|         ScenarioID | SC-E07                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Moderation Result Sent                                             |
|              GIVEN | Report selesai                                                     |
|               WHEN | sistem proses                                                      |
|               THEN | user mendapat notifikasi                                           |
| Business Objective | BR-17                                                              |

---

#### Requirement R-E09: View Moderation History

|           RequirementID | R-E09                                                              |
| ----------------------: | ------------------------------------------------------------------ |
|        Requirement Name | Ability to View Moderation History                                 |
| Requirement Description | Sistem menyimpan dan menampilkan riwayat keputusan moderasi        |
|   Impacted Stakeholders | Admin / Moderator                                                  |
|      Business Objective | BR-05                                                              |

##### Use Case UC-E09: View Moderation History

|          UsecaseID | UC-E09                                                       |
| -----------------: | ------------------------------------------------------------ |
|       Usecase Name | Ability to View Moderation History                           |
|             Actors | Primary: Admin / Moderator; Secondary: System                |
|     Pre Conditions | 1) Data tersedia                                             |
|      Primary Steps | 1. User buka panel                                           |
|                    | 2. Sistem load history                                       |
|                    | 3. Tampilkan                                                 |
| Business Objective | BR-05                                                        |

###### Scenario SC-E09: Activity History Displayed

|         ScenarioID | SC-E09                                                             |
| -----------------: | ------------------------------------------------------------------ |
|      Scenario Name | Activity History Displayed                                         |
|              GIVEN | user membuka profil                                                |
|               WHEN | request histori                                                    |
|               THEN | sistem menampilkan data                                            |
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

#### Requirement R-F03: Reapply Expert

|           RequirementID | R-F03                                                                                                                                 |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Reapply Expert                                                                                                             |
| Requirement Description | User dapat mengajukan ulang setelah ditolak.                                                                                          |
|   Impacted Stakeholders | Admin / User / Expert                                                                                                                 |
|      Business Objective | BR-06                                                                                                                                 |

##### Use Case UC-F03: Reapply Expert

|          UsecaseID | UC-F03                                                |
| -----------------: | ----------------------------------------------------- |
|       Usecase Name | Ability to Reapply Expert                             |
|             Actors | Primary: Expert; Secondary: Admin                     |
|     Pre Conditions | 1) User login  2) User mengajukan lagi menjadi expert |
|      Primary Steps | 1. User membuka halaman pengajuan                     |
|                    | 2. User submit ulang                                  |
|                    | 3. Sistem set pending                                 |
| Business Objective | BR-06                                                 |

###### Scenario SC-F04: Reapplied

|         ScenarioID | SC-F04                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | Reapplied                                                                |
|              GIVEN | rejected                                                                 |
|               WHEN | user apply lagi                                                          |
|               THEN | status pending                                                           |
| Business Objective | BR-06                                                                    |

---

#### Requirement R-F04: View Expert Profile

|           RequirementID | R-F04                                                                                                                                 |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to View Expert Profile                                                                                                        |
| Requirement Description | User dapat melihat profil publik expert.                                                                                              |
|   Impacted Stakeholders | User / Expert                                                                                                                         |
|      Business Objective | BR-06                                                                                                                                 |

##### Use Case UC-F04: View Expert Profile

|          UsecaseID | UC-F04                                                |
| -----------------: | ----------------------------------------------------- |
|       Usecase Name | Ability to View Expert Profile                        |
|             Actors | Primary: User                                         |
|     Pre Conditions | 1) User login  2) Expert tersedia                     |
|      Primary Steps | 1. User membuka profil                                |
|                    | 2. Sistem menampilkan data expert                     |
|    Alternate Steps | A1. Data tidak tersedia                               |
| Business Objective | BR-06                                                 |

###### Scenario SC-F05: Expert Profile Viewed

|         ScenarioID | SC-F05                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | Expert Profile Displayed                                                 |
|              GIVEN | User membuka profil expert                                               |
|               WHEN | request dilakukan                                                        |
|               THEN | sistem menampilkan profil                                                |
| Business Objective | BR-06                                                                    |

---

#### Requirement R-F05: Highlight Expert Contribution

|           RequirementID | R-F05                                                            |
| ----------------------: | -----------------------------------------------------------------|
|        Requirement Name | Ability to Highlight Expert Answer                               |
| Requirement Description | Sistem menampilkan kontribusi pakar secara lebih menonjol.       |
|   Impacted Stakeholders | User / Expert / System                                           |
|      Business Objective | BR-20                                                            |

##### Use Case UC-F05: Highlight Expert Contribution

|          UsecaseID | UC-F05                                                |
| -----------------: | ----------------------------------------------------- |
|       Usecase Name | Ability to Highlight Expert Contribution              |
|             Actors | Primary: System                                       |
|     Pre Conditions | 1) Expert memberikan jawaban                          |
|      Primary Steps | 1. Sistem mendeteksi expert                           |
|                    | 2. Sistem memberi label highlight                     |
|    Alternate Steps | A1. Bukan expert                                      |
| Business Objective | BR-06                                                 |

###### Scenario SC-F06: Expert Highlighted

|         ScenarioID | SC-F06                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | Expert Contribution Highlighted                                          |
|              GIVEN | Jawaban oleh expert                                                      |
|               WHEN | ditampilkan                                                              |
|               THEN | sistem menandai sebagai expert                                           |
| Business Objective | BR-06                                                                    |

---

#### Requirement R-F06: Expert Revocation Visibility

|           RequirementID | R-F06                                                                                                                                 |
| ----------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Show Expert Revocation Status                                                                                              |
| Requirement Description | Sistem menampilkan status pencabutan expert pada profil user                                                                          |
|   Impacted Stakeholders | User / Expert                                                                                                                         |
|      Business Objective | BR-20                                                                                                                                 |

##### Use Case UC-F06: View Expert Revocation

|          UsecaseID | UC-F06                                                |
| -----------------: | ----------------------------------------------------- |
|       Usecase Name | Ability to Show Expert Revocation Status              |
|             Actors | Primary: User;                                        |
|     Pre Conditions | 1) User login  2) ada pencabutan expert               |
|      Primary Steps | 1. User buka profile                                  |
|                    | 2. Sistem tampilkan status                            |
| Business Objective | BR-20                                                 |

###### Scenario SC-F06: Expert Revocation Visible

|         ScenarioID | SC-F06                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | Expert Revocation Visible                                                |
|              GIVEN | expert dicabut                                                           |
|               WHEN | profile dibuka                                                           |
|               THEN | status terlihat                                                          |
| Business Objective | BR-20                                                                    |

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

#### Requirement R-G04: System Configuration

|           RequirementID | R-G04                                                                                                            |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Configure System Settings                                                                             |
| Requirement Description | Admin dapat mengatur parameter sistem seperti rate limit & rules.                                                |
|   Impacted Stakeholders | Admin                                                                                                            |
|      Business Objective | BR-07                                                                                                            |

##### Use Case UC-G04: Configure System

|          UsecaseID | UC-G03                                                                 |
| -----------------: | ---------------------------------------------------------------------- |
|       Usecase Name | Ability to Configure System Settings                                   |
|             Actors | Primary: Admin; Secondary: System                                      |
|     Pre Conditions | 1) Admin login                                                         |
|      Primary Steps | 1. Admin membuka halaman dashboard                                     |
|                    | 2. Admin ubah config                                                   |
|                    | 3. Sistem simpan                                                       |
|    Alternate Steps |                                                                        |
| Business Objective | BR-07                                                                  |

###### Scenario SC-G04: Config Updated

|         ScenarioID | SC-G04                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | System Configuration Updated                       |
|              GIVEN | Admin mengubah konfigurasi                         |
|               WHEN | disimpan                                           |
|               THEN | sistem memperbarui konfigurasi                     |
| Business Objective | BR-07                                              |

---

#### Requirement R-G05: Rate Limiting

|           RequirementID | R-G05                                                                                                            |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Enforce Rate Limit                                                                                    |
| Requirement Description | Sistem membatasi request berlebih untuk keamanan.                                                                |
|   Impacted Stakeholders | System                                                                                                           |
|      Business Objective | BR-07                                                                                                            |

##### Use Case UC-G05: Enforce Rate Limiting

|          UsecaseID | UC-G05                                       |
| -----------------: | -------------------------------------------- |
|       Usecase Name | Ability to Enforce Rate Limiting             |
|             Actors | Primary: System                              |
|     Pre Conditions | Request masuk ke sistem                      |
|      Primary Steps | 1. Sistem menghitung jumlah request          |
|                    | 2. Sistem membandingkan threshold            |
|                    | 3. Sistem membatasi jika melebihi            |
|    Alternate Steps | A1. Di bawah threshold                       |
| Business Objective | BR-07                                        |

###### Scenario SC-G05: Rate Limited

|         ScenarioID | SC-G05                                             |
| -----------------: | -------------------------------------------------- |
|      Scenario Name | Rate Limited                                       |
|              GIVEN | Request berlebih                                   |
|               WHEN | Threshold tercapai                                 |
|               THEN | Sistem blok sementara                              |
| Business Objective | BR-07                                              |

----

#### Requirement R-G06: View System Health

|           RequirementID | R-G06                                                          |
| ----------------------: | -------------------------------------------------------------- |
|        Requirement Name | Ability to View System Health                                  |
| Requirement Description | Admin dapat melihat status dasar sistem (API, DB, queue).      |
|   Impacted Stakeholders | Admin                                                          |
|      Business Objective | BR-07                                                          |

##### Use Case UC-R-G06: View System Health

|          UsecaseID | UC-G06                                                |
| -----------------: | ----------------------------------------------------- |
|       Usecase Name | Ability to View System Health                         |
|             Actors | Primary: User;                                        |
|     Pre Conditions | 1) Admin login                                        |
|      Primary Steps | 1. Admin buka dashboard                               |
|                    | 2. Sistem tampilkan status                            |
| Business Objective | BR-07                                                 |

###### Scenario SC-G06: System Health Displayed

|         ScenarioID | SC-G06                                                                   |
| -----------------: | ------------------------------------------------------------------------ |
|      Scenario Name | System Health Displayed                                                  |
|              GIVEN | admin membuka dashboard                                                  |
|               WHEN | request status                                                           |
|               THEN | sistem menampilkan kondisi                                               |
| Business Objective | BR-07                                                                    |

---

### MODULE: User Profile

#### Requirement R-H01: Update User Profile

|           RequirementID | R-H01                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Update User Profile                                                           |
| Requirement Description | Sistem memungkinkan user memperbarui data profil selain pseudonym (bio, expertise, dll). |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-02                                                                                    |

##### Use Case UC-H01: Update Profile

|          UsecaseID | UC-H01                                                               |
| -----------------: | -------------------------------------------------------------------- |
|       Usecase Name | Ability to Update Profile                                            |
|             Actors | Primary: User; Secondary: System                                     |
|     Pre Conditions | 1) User login                                                        |
|      Primary Steps | 1. User membuka halaman profile                                      |
|                    | 2. User edit data                                                    |
|                    | 3. Sistem menyimpan perubahan                                        |
|                    | 4. Sistem mengembalikan respons sukses                               |
|    Alternate Steps | A1. Data tidak valid → sistem menolak dan menampilkan error          |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server     |
| Business Objective | BR-02                                                                |

###### Scenario SC-H01: Profile Updated

|         ScenarioID | SC-H01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Successful Profile Updated                                |
|              GIVEN | User login                                                |
|               WHEN | User update profile                                       |
|               THEN | Sistem menyimpan data                                     |
| Business Objective | BR-02                                                     |

---

#### Requirement R-H02: View Own Profile

|           RequirementID | R-H02                                                                                                            |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to View Own Profile                                                                                      |
| Requirement Description | Sistem menampilkan data profil lengkap milik user termasuk data private.                                         |
|   Impacted Stakeholders | User / Expert                                                                                                    |
|      Business Objective | BR-02                                                                                                            |

##### Use Case UC-H02: View Own Profile

|          UsecaseID | UC-H01                                                               |
| -----------------: | -------------------------------------------------------------------- |
|       Usecase Name | Ability to View Own Profile                                          |
|             Actors | Primary: User; Secondary: System                                     |
|     Pre Conditions | 1) User login                                                        |
|      Primary Steps | 1. User membuka halaman profile                                      |
|                    | 2. Sistem mengambil semua data                                       |
|                    | 3. Sistem menampilkan semua data                                     |
|    Alternate Steps | A1. Tidak ada data / data kosong                                     |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server     |
|                    | A3. Gagal load                                                       |
| Business Objective | BR-02                                                                |

###### Scenario SC-H02: Own Profile Viewed

|         ScenarioID | SC-H02                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Own Profile Viewed                                        |
|              GIVEN | User buka profile                                         |
|               WHEN | Sistem ambil data                                         |
|               THEN | Sistem tampilkan data                                     |
| Business Objective | BR-02                                                     |

---

#### Requirement R-H03: View Public Profile

|           RequirementID | R-H03                                                                                                            |
| ----------------------: | ---------------------------------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to View Public Profile                                                                                   |
| Requirement Description | Sistem menampilkan data profil publik user lain tanpa data sensitif                                              |
|   Impacted Stakeholders | User / Expert                                                                                                    |
|      Business Objective | BR-02                                                                                                            |

##### Use Case UC-H03: View Public Profile

|          UsecaseID | UC-H01                                                                |
| -----------------: | --------------------------------------------------------------------- |
|       Usecase Name | Ability to View Public Profile                                        |
|             Actors | Primary: User; Secondary: System                                      |
|     Pre Conditions | 1) User login                                                         |
|      Primary Steps | 1. User membuka halaman profile user lain                             |
|                    | 2. Sistem mengambil data (hanya publik: tidak termasuk yang sensitif) |
|                    | 3. Sistem menampilkan data                                            |
|    Alternate Steps | A1. User tidak ditemukan                                              |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server      |
| Business Objective | BR-02                                                                 |

###### Scenario SC-H03: Public Profile Viewed

|         ScenarioID | SC-H03                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Public Profile Viewed                                     |
|              GIVEN | User membuka profil lain                                  |
|               WHEN | Sistem ambil data publik                                  |
|               THEN | Sistem tampilkan data publik                              |
| Business Objective | BR-02                                                     |

---

#### Requirement R-H04: View User Activity History

|           RequirementID | R-H04                                                                 |
| ----------------------: | --------------------------------------------------------------------- |
|        Requirement Name | Ability to View User Activity History                                 |
| Requirement Description | Sistem menampilkan histori aktivitas user (post, vote, report)        |
|   Impacted Stakeholders | User / Expert / Admin                                                 |
|      Business Objective | BR-02                                                                 |

##### Use Case UC-H04: View Activity History

|          UsecaseID | UC-H04                                                               |
| -----------------: | -------------------------------------------------------------------- |
|       Usecase Name | Ability to View Activity History                                     |
|             Actors | Primary: User;                                                       |
|     Pre Conditions | 1) User login                                                        |
|      Primary Steps | 1. User membuka halaman profile                                      |
|                    | 2. Sistem ambil histori                                              |
|                    | 3. Tampilkan                                                         |
| Business Objective | BR-02                                                                |

###### Scenario SC-H04: Activity History Displayed

|         ScenarioID | SC-H04                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Successful Activity History Displayed                     |
|              GIVEN | User membuka profil                                       |
|               WHEN | request histori                                           |
|               THEN | Sistem menampilkan data                                   |
| Business Objective | BR-02                                                     |

---

### MODULE: Category

#### Requirement R-I01: Assign Category

|           RequirementID | R-I01                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Assign Category to Discussion                                                 |
| Requirement Description | Sistem menetapkan kategori pada diskusi saat dibuat.                                     |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-11                                                                                    |

---

#### Requirement R-I02: Filter by Category

|           RequirementID | R-I02                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Filter Discussion by Category                                                 |
| Requirement Description | Sistem memungkinkan user melihat diskusi berdasarkan kategori.                           |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-11                                                                                    |

##### Use Case UC-I02: Filter by Category

|          UsecaseID | UC-I02                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Filter Discussion by Category                                       |
|             Actors | Primary: User; Secondary: System                                               |
|     Pre Conditions | 1) User login 2) Kategori tersedia                                             |
|      Primary Steps | 1. User pilih kategori                                                         |
|                    | 2. Sistem filter kategori                                                      |
|                    | 3. Sistem tampilkan hasil                                                      |
|    Alternate Steps | A1. Data kategori tidak tersedia → sistem menolak dan menampilkan not found    |
|                    | A2. Terjadi kegagalan sistem → sistem mengembalikan error server               |
| Business Objective | BR-11                                                                          |

###### Scenario SC-I02: Category Filtered

|         ScenarioID | SC-I01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Successful Category Filtered                              |
|              GIVEN | Kategori dipilih                                          |
|               WHEN | Filter                                                    |
|               THEN | Hasil sesuai kategori                                     |
| Business Objective | BR-11                                                     |

---

#### Requirement R-I03: Manage Category (CRUD)

|           RequirementID | R-I03                                                              |
| ----------------------: | ------------------------------------------------------------------ |
|        Requirement Name | Ability to Manage Category (CRUD)                                  |
| Requirement Description | Admin dapat membuat, mengubah, dan menghapus kategori diskusi.     |
|   Impacted Stakeholders | Admin                                                              |
|      Business Objective | BR-11                                                              |

##### Use Case UC-I03: Manage Category

|          UsecaseID | UC-I03                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Manage Category                                                     |
|             Actors | Primary: Admin;                                                                |
|     Pre Conditions | 1) Admin login                                                                 |
|      Primary Steps | 1. Admin input data                                                            |
|                    | 2. Sistem validasi                                                             |
|                    | 3. Simpan                                                                      |
|    Alternate Steps | A1. Data Invalid                                                               |
| Business Objective | BR-11                                                                          |

###### Scenario SC-I03: Category Managed

|         ScenarioID | SC-I03                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Successful Category Managed                               |
|              GIVEN | Admin input data                                          |
|               WHEN | Valid                                                     |
|               THEN | Kategori tersimpan                                        |
| Business Objective | BR-11                                                     |

---

### MODULE: AI Service

#### Requirement R-J01: AI Moderation Trigger

|           RequirementID | R-J01                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to AI Moderation Trigger                                                         |
| Requirement Description | Sistem memicu AI saat konten dibuat atau diubah.                                         |
|   Impacted Stakeholders | System                                                                                   |
|      Business Objective | BR-19                                                                                    |

##### Use Case UC-J01: Analyze Content

|          UsecaseID | UC-J01                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Analyze Content                                                     |
|             Actors | Primary: System;                                                               |
|     Pre Conditions | 1) Konten dibuat                                                               |
|      Primary Steps | 1. Trigger AI                                                                  |
|                    | 2. Analisis                                                                    |
|                    | 3. Return Score                                                                |
| Business Objective | BR-19                                                                          |

###### Scenario SC-J01: Content Analyzed

|         ScenarioID | SC-J01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Content Analyzed                                          |
|              GIVEN | Konten dibuat                                             |
|               WHEN | AI Trigger                                                |
|               THEN | Skor tersedia                                             |
| Business Objective | BR-19                                                     |

---

#### Requirement R-J02: Store AI Risk Score

|           RequirementID | R-J02                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Store AI Risk Score                                                           |
| Requirement Description | Sistem menyimpan skor risiko hasil analisis AI.                                          |
|   Impacted Stakeholders | System / Moderator / Admin                                                               |
|      Business Objective | BR-19                                                                                    |

---

#### Requirement R-J03: AI Recommendation

|           RequirementID | R-J03                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Moderation Recommendation                                                     |
| Requirement Description | AI memberikan rekomendasi tindakan moderasi.                                             |
|   Impacted Stakeholders | System / Moderator / Admin                                                               |
|      Business Objective | BR-19                                                                                    |

###### Scenario SC-J03: Recommendation Generated

|         ScenarioID | SC-J03                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Recommendation Generated                                  |
|              GIVEN | Skor tinggi                                               |
|               WHEN | AI proses                                                 |
|               THEN | Skor rekomendasi muncul                                   |
| Business Objective | BR-19                                                     |

---

#### Requirement R-J04: Auto Report Generation

|           RequirementID | R-J04                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Auto Generate Report                                                          |
| Requirement Description | Sistem menghasilkan report otomatis berbasis AI.                                         |
|   Impacted Stakeholders | System / Moderator / Admin                                                               |
|      Business Objective | BR-19                                                                                    |

---

#### Requirement R-J05: Chatbot Logging

|           RequirementID | R-J04                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Log Chatbot Interaction                                                       |
| Requirement Description | Sistem mencatat interaksi user dengan AI Chatbot.                                        |
|   Impacted Stakeholders | System / Admin                                                                           |
|      Business Objective | BR-35                                                                                    |

---

#### Requirement R-J06: AI Confidence Score

|           RequirementID | R-J06                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to AI Confidence Score                                                           |
| Requirement Description | Sistem menyimpan dan menampilkan tingkat kepercayaan hasil AI.                           |
|   Impacted Stakeholders | Moderator / Admin                                                                        |
|      Business Objective | BR-29                                                                                    |

##### Use Case UC-J06: View AI Confidence

|          UsecaseID | UC-J02                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to View AI Confidence                                                  |
|             Actors | Primary: Moderator;                                                            |
|     Pre Conditions | 1) Proses Ai selesai                                                           |
|      Primary Steps | 1. Moderator buka hasil AI                                                     |
|                    | 2. Sistem tampilkan confidence                                                 |
| Business Objective | BR-29                                                                          |

###### Scenario SC-J06: AI Confidence Available

|         ScenarioID | SC-J04                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | AI Confidence Available                                   |
|              GIVEN | AI analisis selesai                                       |
|               WHEN | Moderator akses                                           |
|               THEN | confidence ditampilkan                                    |
| Business Objective | BR-29                                                     |

---

### MODULE: Notification

#### Requirement R-K01: Send Notification

|           RequirementID | R-K01                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Send Notification                                                             |
| Requirement Description | Sistem mengirim notifikasi pada aktivitas penting.                                       |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-01                                                                                    |

##### Use Case UC-K01: Send Notification

|          UsecaseID | UC-K01                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Send Notification                                                   |
|             Actors | Primary: System;                                                               |
|     Pre Conditions | 1) Aktivitas sistem terjadi                                                    |
|      Primary Steps | 1. Event terjadi                                                               |
|                    | 2. Sistem kirim notifikasi                                                     |
| Business Objective | BR-01                                                                          |

###### Scenario SC-K01: Notification Sent

|         ScenarioID | SC-K01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Notification Sent                                         |
|              GIVEN | ada interaksi                                             |
|               WHEN | event terjadi                                             |
|               THEN | notifikasi dikirim                                        |
| Business Objective | BR-01                                                     |

---

#### Requirement R-K02: Read Notification

|           RequirementID | R-K02                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Mark Notification Read                                                        |
| Requirement Description | User dapat menandai notifikasi sebagai dibaca.                                           |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-01                                                                                    |

##### Use Case UC-K02: Read Notification

|          UsecaseID | UC-K02                               |
| -----------------: | ------------------------------------ |
|       Usecase Name | Ability to Mark Notification as Read |
|             Actors | Primary: User                        |
|     Pre Conditions | 1) User login                        |
|      Primary Steps | 1. User membuka notifikasi           |
|                    | 2. User memilih mark as read         |
|                    | 3. Sistem memperbarui status         |
| Business Objective | BR-01                                |

###### Scenario SC-K02: Notification Marked As Read

|         ScenarioID | SC-K02                       |
| -----------------: | ---------------------------- |
|      Scenario Name | Notification Marked As Read  |
|              GIVEN | User memiliki notifikasi     |
|               WHEN | User menandai sebagai dibaca |
|               THEN | Status notifikasi berubah    |
| Business Objective | BR-01                        |

---

#### Requirement R-K03: Notification Preference

|           RequirementID | R-K03                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Manage Notification Preference                                                |
| Requirement Description | User dapat mengatur jenis notifikasi yang diterima.                                      |
|   Impacted Stakeholders | User / Expert                                                                            |
|      Business Objective | BR-01                                                                                    |

##### Use Case UC-K03: Manage Notification Preference

|          UsecaseID | UC-K02                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Manage Notification Preference                                      |
|             Actors | Primary: User;                                                                 |
|     Pre Conditions | 1) User login                                                                  |
|      Primary Steps | 1. User buka setting                                                           |
|                    | 2. Pilih preferensi                                                            |
|                    | 3. Simpan                                                                      |
| Business Objective | BR-01                                                                          |

###### Scenario SC-K03: Notification Preference Updated

|         ScenarioID | SC-K02                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Notification Preference Updated                           |
|              GIVEN | user ubah setting                                         |
|               WHEN | disimpan                                                  |
|               THEN | sistem update preferensi                                  |
| Business Objective | BR-01                                                     |

---

### MODULE: Security

#### Requirement R-L01: Audit Log

|           RequirementID | R-L01                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Record Audit Log                                                              |
| Requirement Description | Sistem mencatat seluruh aksi penting untuk audit.                                        |
|   Impacted Stakeholders | Admin                                                                                    |
|      Business Objective | BR-29                                                                                    |

##### Use Case UC-L01: Record Audit Log

|          UsecaseID | UC-L01                                                                         |
| -----------------: | ------------------------------------------------------------------------------ |
|       Usecase Name | Ability to Record Audit Log                                                    |
|             Actors | Primary: System;                                                               |
|     Pre Conditions | 1) Aktivitas sistem terjadi                                                    |
|      Primary Steps | 1. Event penting terjadi                                                       |
|                    | 2. Sistem simpan log                                                           |
| Business Objective | BR-29                                                                          |

###### Scenario SC-L01: Action Logged

|         ScenarioID | SC-L01                                                    |
| -----------------: | --------------------------------------------------------- |
|      Scenario Name | Action Logged                                             |
|              GIVEN | User melakukan aksi                                       |
|               WHEN | sistem memproses                                          |
|               THEN | log tersimpan                                             |
| Business Objective | BR-29                                                     |

---

#### Requirement R-L02: Access Enforcement

|           RequirementID | R-L02                                                                                    |
| ----------------------: | ---------------------------------------------------------------------------------------- |
|        Requirement Name | Ability to Enforce RBAC                                                                  |
| Requirement Description | Sistem memvalidasi akses berdasarkan role secara konsisten.                              |
|   Impacted Stakeholders | System                                                                                   |
|      Business Objective | BR-05                                                                                    |

##### Use Case UC-L02: Enforce Access Control

|          UsecaseID | UC-L02                                       |
| -----------------: | -------------------------------------------- |
|       Usecase Name | Ability to Enforce Role-Based Access Control |
|             Actors | Primary: System; Secondary: User/Admin       |
|     Pre Conditions | 1) User melakukan request                    |
|      Primary Steps | 1. Sistem menerima request                   |
|                    | 2. Sistem memverifikasi role                 |
|                    | 3. Sistem memvalidasi permission             |
|                    | 4. Sistem mengizinkan atau menolak akses     |
|    Alternate Steps | A1. Role tidak valid → sistem menolak akses  |
| Business Objective | BR-05                                        |

###### Scenario SC-L02: Unauthorized Access Blocked

|         ScenarioID | SC-L02                          |
| -----------------: | ------------------------------- |
|      Scenario Name | Unauthorized Access Blocked     |
|              GIVEN | User tidak memiliki role sesuai |
|               WHEN | User mencoba mengakses resource |
|               THEN | Sistem menolak akses            |
| Business Objective | BR-05                           |

