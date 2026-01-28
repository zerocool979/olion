# Business Requirement Document (BRD)

## 1) Background
Perkembangan teknologi informasi telah mengubah cara manusia belajar dan berdiskusi. Aktivitas pertukaran ide tidak lagi terbatas pada ruang kelas fisik, tetapi dapat berlangsung melalui platform digital yang mampu menjangkau masyarakat luas, pelajar, maupun pengajar lintas lokasi dan waktu. Namun, ketersediaan teknologi tidak selalu menghasilkan interaksi intelektual yang sehat dan partisipatif.

Salah satu hambatan terbesar dalam diskusi digital adalah fenomena fear of judgment (ketakutan akan penilaian negatif). Pada banyak forum daring konvensional yang menampilkan identitas asli, pengguna cenderung menahan diri untuk bertanya atau menyampaikan argumen kritis karena khawatir dianggap “bodoh”, disalahkan, atau dipermalukan. Kondisi ini berhubungan erat dengan risiko bullying/stigma sosial, yang pada akhirnya menciptakan lingkungan belajar pasif dan tidak inklusif.

Dampak dari hambatan tersebut adalah diskusi seringkali menjadi tidak seimbang, di mana percakapan hanya didominasi oleh segelintir individu yang lebih percaya diri, sementara pengguna lain memilih diam. Akibatnya, potensi berpikir kritis dan kontribusi gagasan yang sebenarnya bernilai menjadi terhambat.

Untuk menjawab permasalahan tersebut, OLION dirancang sebagai platform diskusi berbasis web yang terstruktur dan terkurasi untuk membangun, menguji, dan menghubungkan pengetahuan lintas bidang secara rasional dan kolaboratif. OLION mengusung konsep pseudonimitas (anonimitas terkontrol), di mana identitas publik pengguna menggunakan pseudonym (default dihasilkan sistem namun dapat disesuaikan), sehingga pengguna dapat berdiskusi dengan lebih aman dari tekanan sosial tanpa menghilangkan akuntabilitas.

Selain itu, OLION menyediakan mekanisme Verified Expert, yaitu pakar yang diverifikasi melalui dokumen pendukung seperti sertifikat, CV, dan tautan portofolio. Kehadiran pakar terverifikasi ini bertujuan memperkuat kualitas diskusi dan membantu pengguna memperoleh jawaban yang lebih kredibel, terutama dalam topik-topik yang membutuhkan rujukan keahlian.

## 2) Problem Statement

Diskusi daring saat ini seringkali tidak terstruktur dan tidak aman secara sosial, sehingga proses pertukaran gagasan kehilangan kualitasnya. Pengetahuan yang seharusnya dapat dibangun secara rasional dan kolaboratif justru tenggelam oleh opini dangkal, dominasi suara tertentu, serta tekanan sosial yang membuat banyak pengguna enggan berbicara.

Permasalahan paling krusial yang perlu diselesaikan pada tahap awal (MVP) adalah fear of judgment, yaitu ketakutan pengguna untuk bertanya atau menyampaikan argumen karena risiko penghakiman, stigma, dan perundungan. Akibatnya, ruang diskusi menjadi bising, tidak inklusif, dan tidak mendorong partisipasi intelektual yang merata.

OLION ditujukan untuk mengubah kondisi tersebut dari ruang diskusi yang menghakimi dan didominasi ego menjadi ruang berpikir yang aman, terstruktur, dan saling melengkapi, sehingga setiap individu dapat berkontribusi tanpa tekanan sosial yang menghambat.

## 3) Tujuan Proyek / Business Goals

### 3.1 Tujuan Proyek
OLION dikembangkan untuk mencapai tujuan bisnis berikut:
1. Meningkatkan partisipasi diskusi yang aman dan berkelanjutan
OLION bertujuan mendorong lebih banyak pengguna untuk aktif berdiskusi tanpa tekanan sosial yang menghambat, sehingga partisipasi terjadi secara konsisten dan tidak hanya didominasi oleh kelompok tertentu.
2. Meningkatkan kualitas dan kedalaman kontribusi pengetahuan
OLION diarahkan untuk membangun budaya diskusi yang berbasis argumen rasional, relevan, dan saling melengkapi, sehingga hasil diskusi menjadi aset pengetahuan yang bernilai.
3. Menciptakan ekosistem diskusi yang tertib dan minim intimidasi
OLION berfokus pada pembentukan ruang diskusi yang aman, terkurasi, dan memiliki kontrol kualitas yang jelas untuk menekan intimidasi, perundungan, serta perilaku diskusi yang destruktif.

### 3.2 Indikator Keberhasilan
Keberhasilan tujuan proyek OLION dapat diukur melalui indikator berikut:
1. Weekly Active Users (WAU): jumlah pengguna aktif mingguan
2. Jumlah diskusi per minggu: volume aktivitas diskusi
3. Rasio diskusi terjawab: persentase diskusi yang memiliki respons bermakna
4. Upvote/Downvote Ratio pada jawaban: indikator kualitas kontribusi dan penerimaan komunitas

### 3.3 Target Minimal Keberhasilan MVP
OLION dianggap berhasil pada tahap MVP jika mencapai minimal:
1. 30 user aktif mingguan (WAU)
2. 80–100 diskusi pada fase MVP
3. 65–70% diskusi terjawab
4. Upvote/Downvote ratio jawaban > 2:1

## 4) Stakeholders & Needs

### 4.1 Stakeholders Utama
Stakeholders utama dalam proyek OLION mencakup:
1. End User (pengguna umum)
2. Expert (pakar terverifikasi)
3. Moderator
4. Admin
5. Owner/Developer: beel

### 4.2 Kebutuhan Utama per Role (Stakeholder Needs)

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

## 5) Business Requirements (BR)

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

## 6) Business Rules (BRules)

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

### Ringkasan Keputusan
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
