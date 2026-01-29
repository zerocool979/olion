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

## 4) Tujuan Proyek
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

### 5.1 In-Scope (Termasuk pengerjaan awal)
**A. Autentikasi & Akun**

1. Functional Requirements (FR):

- FR-A01 Sistem menyediakan fitur registrasi akun pengguna.
- FR-A02 Sistem menyediakan fitur login menggunakan kredensial yang valid.
- FR-A03 Sistem menyediakan fitur logout untuk mengakhiri sesi pengguna.
- FR-A04 Sistem menerapkan role management untuk role: User, Expert, Moderator, Admin.
- FR-A05 Sistem membatasi akses fitur berdasarkan role-based access control (RBAC).
- FR-A06 Sistem menghasilkan dan menampilkan pseudonym sebagai identitas publik pengguna.
- FR-A07 Sistem menyembunyikan identitas asli pengguna dari tampilan publik (anonimitas terkontrol).
- FR-A08 Sistem memberikan opsi login social OAuth (Google/Apple) untuk kemudahan.
- FR-A09 Sistem mengizinkan pseudonym dapat dikustomisasi dengan template unik agar personal tapi tetap anonim.
- FR-A10 Sistem mendukung multi-session device, tapi admin dapat melihat & revoke device aktif.
- FR-A11 Sistem menampilkan status online/offline pseudonym secara opsional untuk interaksi real-time.
- FR-A12 Sistem menyertakan password strength meter & saran untuk memandu user.

2. Non-Functional Requirements (N-FR)

- NFR-A01 (Security) Password harus disimpan dalam bentuk hashing (bukan plain text).
- NFR-A02 (Security) Sistem autentikasi harus menggunakan token/session yang aman (JWT).
- NFR-A03 (Security) Brute-force attack harus dicegah melalui rate-limit & lockout sementara.
- NFR-A04 (Usability) Proses register/login harus mudah digunakan dan jelas validasinya.
- NFR-A05 (Usability) User flow register/login harus mobile-first, jelas, dengan inline validation.
- NFR-A06 (Reliability) Sistem harus menolak login dengan kredensial salah secara konsisten.
- NFR-A07 (Performance) Proses register/login tidak boleh lebih dari 2 detik pada server MVP.

**B. Forum Diskusi**

1. Functional Requirements (FR)

- FR-B01 Sistem memungkinkan pengguna membuat diskusi baru.
- FR-B02 Sistem memungkinkan pengguna melihat daftar diskusi.
- FR-B03 Sistem memungkinkan pengguna melihat detail diskusi.
- FR-B04 Sistem memungkinkan pengguna melakukan edit diskusi sesuai otorisasi.
- FR-B05 Sistem memungkinkan pengguna melakukan hapus diskusi sesuai otorisasi.
- FR-B06 Sistem memungkinkan pengguna membuat jawaban pada diskusi.
- FR-B07 Sistem memungkinkan pengguna membuat komentar pada diskusi/jawaban.
- FR-B08 Sistem memungkinkan pengguna membuat komentar pada komentar yang sudah ada (reply/hirarki).
- FR-B09 Sistem menyediakan fitur pencarian diskusi berdasarkan keyword.
- FR-B10 Sistem mendukung filter/penelusuran berdasarkan kategori (jika kategori tersedia).
- FR-B11 Sistem menampilkan metadata diskusi (tanggal, author pseudonym, jumlah vote, jumlah jawaban).
- FR-B12 Sistem mendukung tagging user & mention, tapi tetap anonimitas dikontrol.
- FR-B13 Sistem menampilkan thread diskusi nested untuk komentar agar percakapan lebih jelas.
- FR-B14 Sistem memungkinkan draft otomatis ketika user mengetik jawaban panjang.
- FR-B15 Sistem menyediakan highlight keyword di hasil pencarian.
- FR-B16 Sistem memungkinkan favorit/subscribe diskusi untuk notifikasi update.

2. Non-Functional Requirements (N-FR)

- NFR-B01 (Performance) Daftar diskusi harus menggunakan pagination agar tetap responsif.
- NFR-B02 (Performance) List & search diskusi mendukung lazy loading untuk skala ribuan diskusi.
- NFR-B03 (Usability) Pencarian harus memberikan hasil yang relevan dan mudah dipahami pengguna.
- NFR-B04 (Usability) User dapat dengan mudah menavigasi diskusi melalui breadcrumb + filter kategori/tag.
- NFR-B05 (Reliability) Sistem harus menjaga konsistensi relasi Diskusi–Jawaban–Komentar.
- NFR-B06 (Maintainability) Struktur modul diskusi harus terpisah dan mudah dikembangkan.
- NFR-B07 (Scalability) Struktur database diskusi siap untuk sharding / partitioning jika jumlah konten bertumbuh.

**C. Kontrol Kualitas**

1. Functional Requirements (FR)

- FR-C01 Sistem memungkinkan pengguna melakukan voting pada diskusi.
- FR-C02 Sistem memungkinkan pengguna melakukan voting pada jawaban.
- FR-C03 Sistem memungkinkan pengguna melakukan voting pada komentar.
- FR-C04 Sistem menerapkan aturan 1 user hanya dapat vote 1 kali per konten.
- FR-C05 Sistem menghitung dan menampilkan total vote pada setiap konten.
- FR-C06 Sistem menyediakan reputasi user (basic) berdasarkan aktivitas/voting.
- FR-C07 Sistem memungkinkan pengguna melakukan pelaporan (report) pada konten.
- FR-C08 Sistem mencatat report dengan status pending/reviewed/resolved.
- FR-C09 Sistem menyediakan fitur moderasi berdasarkan laporan yang masuk.
- FR-C10 Sistem mencatat tindakan moderasi (misal: hide/delete/resolve) pada konten yang dilaporkan.
- FR-C11 Sistem memungkinkan upvote/downvote dengan alasan singkat untuk kualitas feedback.
- FR-C12 Sistem menampilkan level/reputation badge secara visual untuk mendorong kontribusi.
- FR-C13 Sistem memungkinkan report anonim agar user merasa aman melaporkan pelanggaran.
- FR-C14 Sistem menambahkan trust score untuk user yang konsisten berkualitas.
- FR-C15 Sistem memberi daily/weekly summary reputasi & aktivitas ke user.

2. Non-Functional Requirements (N-FR)

- NFR-C01 (Security) Sistem harus mencegah manipulasi vote (double vote / spam voting).
- NFR-C02 (Auditability) Semua tindakan moderasi harus memiliki jejak audit/log.
- NFR-C03 (Auditability) Semua vote/report/reputasi memiliki timestamp & reference agar bisa di-review.
- NFR-C04 (Integrity) Report tidak boleh menghapus data otomatis tanpa proses moderasi.
- NFR-C05 (Integrity) Sistem menolak manipulasi reputasi atau vote otomatis.
- NFR-C06 (Reliability) Perhitungan reputasi harus konsisten dan tidak menghasilkan nilai ganda.
- NFR-C07 (Scalability) Perhitungan reputasi real-time atau batch update tanpa menghambat performa.

**D. Expert Verification**

1. Functional Requirements (FR)

- FR-D01 Sistem memungkinkan pengguna mengajukan permohonan menjadi Verified Expert.
- FR-D02 Sistem menyimpan data pengajuan verifikasi pakar (identitas, bidang, bukti).
- FR-D03 Sistem memungkinkan Admin melakukan approval pengajuan pakar.
- FR-D04 Sistem memungkinkan Admin melakukan reject pengajuan pakar.
- FR-D05 Sistem menampilkan status verifikasi pakar (pending/approved/rejected).
- FR-D06 Sistem menampilkan label Verified Expert pada profil pengguna yang telah disetujui.
- FR-D07 Sistem menampilkan label Verified Expert pada jawaban pakar.
- FR-D08 Sistem menampilkan label Verified Expert pada diskusi pakar.
- FR-D09 Sistem menampilkan label Verified Expert pada komentar pakar.
- FR-D10 Expert dapat menambahkan bio, keahlian spesifik, portofolio, dan link publikasi.
- FR-D11 Admin dapat menambahkan endorsement internal untuk memperkuat verifikasi expert.
- FR-D12 Sistem memungkinkan expert highlight jawaban atau komentar untuk menandai insight penting.
- FR-D13 Sistem mengizinkan expert mengajukan topik rekomendasi untuk diskusi niche.

2. Non-Functional Requirements (N-FR)

- NFR-D01 (Security) Proses verifikasi pakar harus hanya dapat diputuskan oleh Admin.
- NFR-D02 (Security) Expert documents terenkripsi & hanya dapat diakses oleh sistem dan admin. 
- NFR-D03 (Auditability) Approval/Reject harus tersimpan sebagai riwayat keputusan admin.
- NFR-D04 (Auditability) Semua perubahan status expert tercatat dan dapat di-query dalam laporan.
- NFR-D05 (Usability) Label Verified Expert harus terlihat jelas namun tidak mengganggu tampilan.
- NFR-D06 (Usability) Label Verified Expert tidak mengganggu UI mobile atau desktop.
- NFR-D07 (Integrity) Status verifikasi pakar tidak boleh dapat diubah oleh user biasa.

**E. Admin & Moderator Panel**

1. Functional Requirements (FR)

- FR-E01 Sistem menyediakan halaman/panel khusus untuk Admin.
- FR-E02 Sistem menyediakan halaman/panel khusus untuk Moderator.
- FR-E03 Admin dapat melakukan manajemen user (lihat, ubah role, tindakan tertentu).
- FR-E04 Admin dapat melakukan manajemen kategori (CRUD kategori).
- FR-E05 Moderator dapat melihat daftar laporan masuk (report queue).
- FR-E06 Moderator dapat melakukan tindakan moderasi terhadap laporan (hide/delete/resolve).
- FR-E07 Sistem menampilkan detail laporan (pelapor, alasan, waktu, konten terkait).
- FR-E08 Sistem membatasi tindakan admin/moderator sesuai hak aksesnya.
- FR-E09 Admin dapat generate report aktivitas sistem (mis. jumlah vote, diskusi, report per kategori).
- FR-E10 Moderator dapat filter report berdasarkan severity atau tipe pelanggaran.
- FR-E11 Sistem menyediakan dashboard realtime untuk status moderasi.
- FR-E12 Admin dapat mengatur aturan voting/reputasi/reward secara konfiguratif.
- FR-E13 Panel mendukung export log atau report dalam CSV/JSON untuk audit eksternal.

2. Non-Functional Requirements (N-FR)

- NFR-E01 (Security) Panel admin/moderator harus terlindungi oleh RBAC + auth guard.
- NFR-E02 (Auditability) Aktivitas admin/moderator harus tercatat (log tindakan).
- NFR-E03 (Usability) Panel harus mudah dipakai untuk review laporan dengan cepat.
- NFR-E04 (Reliability) Aksi moderasi tidak boleh menyebabkan data “rusak” (gunakan soft-delete bila perlu).
- NFR-E05 (Maintainability) Panel menggunakan modular UI & API endpoints sehingga mudah diperluas.
- NFR-E06 (Observability) Semua aksi panel tercatat dalam structured log & request id.
- NFR-E07 (Usability) Panel harus responsive & keyboard-navigable agar cepat digunakan moderator.

**F. Dokumentasi & Testing**

1. Functional Requirements FR)

- FR-F01 Sistem menyediakan dokumentasi API dalam format Swagger/OpenAPI atau Postman.
- FR-F02 Sistem memiliki Test Plan untuk pengujian fitur utama.
- FR-F03 Sistem memiliki Test Cases untuk skenario user/expert/moderator/admin.
- FR-F04 Sistem memiliki Test Evidence (screenshot/log hasil uji).
- FR-F05 Sistem menyediakan Deployment Guide dasar untuk menjalankan aplikasi.
- FR-F06 Sistem menyediakan sandbox API untuk tester/expert tanpa mengganggu data produksi.
- FR-F07 Sistem memiliki mock data generator untuk testing skala besar.
- FR-F08 Test evidence otomatis tersimpan di CI/CD pipeline.
- FR-F09 Dokumentasi menyediakan contoh request/response dan scenario untuk semua role.
- FR-F10 Deployment guide menyertakan docker-compose + environment variable templates.

2. Non-Functional Requirements (N-FR)

- NFR-F01 (Maintainability) Dokumentasi API harus selalu sinkron dengan endpoint implementasi.
- NFR-F02 (Quality Assurance) Test case harus mencakup validasi normal & error handling.
- NFR-F03 (Reproducibility) Deployment guide harus memungkinkan sistem dijalankan ulang tanpa trial-error.
- NFR-F04 (Clarity) Dokumentasi harus rapi, konsisten, dan mudah dipahami reviewer/pengembang.
- NFR-F05 (Maintainability) Dokumentasi harus terversioning & otomatis sinkron dengan update API.
- NFR-F06 (Reproducibility) Test harus bisa dijalankan lokal & di CI/CD tanpa konfigurasi rumit.
- NFR-F07 (Clarity) Dokumentasi menggunakan format visual + text untuk semua jenis user (developer, moderator, expert).

---

### 5.2 Out-Scope (Tidak termasuk versi awal)
- Chat real-time (socket)
- Video call / voice room
- AI moderation penuh otomatis
- Monetisasi (premium/subscription)
- Sistem rekomendasi ML yang kompleks

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

## 7) Stakeholders & Users

### 7.1 Stakeholders

* **End User (Pengguna Umum)**: pengguna yang memanfaatkan OLION untuk berdiskusi, bertanya, dan berinteraksi di forum.
* **Expert (Pakar Terverifikasi)**: pengguna yang telah melalui proses verifikasi dan berperan memberikan jawaban/insight dengan kredibilitas lebih tinggi.
* **Moderator**: pihak yang bertugas menjaga kualitas dan etika diskusi melalui proses review laporan dan tindakan moderasi.
* **Admin**: pihak yang memiliki kontrol sistem tertinggi untuk mengelola user, kategori, verifikasi pakar, serta konfigurasi dasar sistem.
* **Owner**: pengembang utama yang merancang, membangun, menguji, dan melakukan deployment sistem OLION.

---

### 7.2 Roles & Hak Akses

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

## 8) Constraints
- Proyek dikembangkan oleh beel, sehingga pembagian peran (developer, QA, devops) dikelola oleh satu orang.
- Fokus rilis awal adalah fitur inti (MVP) agar sistem dapat selesai, stabil, dan siap digunakan sebelum penambahan fitur lanjutan.
- Infrastruktur deployment mengikuti resource yang tersedia, seperti local environment, VPS, atau Docker-based deployment sesuai kebutuhan.
- Seluruh dokumen proyek wajib sinkron dengan implementasi aktual, termasuk struktur database (schema), API endpoint, serta aturan hak akses (role permission).

---

## 9) Asumsi
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

## 11) Risiko Utama & Mitigasi
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
