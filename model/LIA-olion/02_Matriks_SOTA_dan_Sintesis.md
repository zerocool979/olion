---
tags:
  - SOTA
  - sintesis
  - research-gap
---
# 02 — Matriks State-of-the-Art (SOTA), Sintesis, dan Research Gap Utama

## A. Matriks SOTA — Klaster Inti (Deteksi Depresi/Stres berbasis Teks)

Klaster ini (P01–P06) dipilih sebagai basis matriks SOTA karena memiliki objek riset paling sebanding (deteksi gangguan psikologis dari teks Bahasa Indonesia), sehingga memungkinkan perbandingan _apples-to-apples_.

|Penulis|Tahun|Metode|Dataset|Hasil Utama|Kelemahan / Gap|
|---|---|---|---|---|---|
|Situmorang & Purba [[Papers/P01_Situmorang_Purba_2024\|(P01)]]|2024|IndoBERT (fine-tuning transformer)|37.554 unggahan X (kata kunci psychiatrist-approved)|Akurasi/Precision/Recall/F1 = **94,91%**|Klasifikasi biner saja; satu platform; tanpa XAI/interpretability|
|Santoso dkk. [[Papers/P02_Santoso_dkk_2025\|(P02)]]|2025|NB/kNN/DT/RF/XGBoost + PSO/BA/FSA (feature selection) + SMOTE|1.105 unggahan X (label manual DSM-V)|RF-FSA terbaik: Akurasi **82,2%**, F1 seimbang (0,9/0,6)|Dataset kecil & timpang; belum dikombinasikan dengan deep learning|
|Siswandi & Susilo [[Papers/P03_Siswandi_Susilo_2026\|(P03)]]|2026|NLP (TF-IDF) + Random Forest, label 3 tingkat keparahan (PHQ-9)|1.070 unggahan X (disaring dari 36.081)|Akurasi **97%** (dengan caveat dari penulis sendiri)|Model tunggal tanpa pembanding; tanpa cross-validation; berisiko overfitting|
|Sudrajat & Zakariyah [[Papers/P04_Sudrajat_Zakariyah_2024\|(P04)]]|2024|NLP (BOW/TF-IDF/N-gram) + LR/NB/RF/SVM|Teks siswa SMA (ukuran tidak dirinci di abstrak)|NB+Bigram terbaik: Akurasi **95,6%**|Tanpa deep learning; tanpa balancing data; tanpa CV|
|Fitriana & Risdiansyah [[Papers/P05_Fitriana_Risdiansyah_2025\|(P05)]]|2025|CRISP-DM; BernoulliNB/DT/LR/XGBoost/IndoBERT|2.000 ulasan forum Quora & Reddit (leksikon InSet)|LR akurasi tertinggi **72%**; IndoBERT _tidak_ dominan|IndoBERT underperform pada data kecil/lintas-bahasa → gap transferability|
|Fadhilla dkk. [[Papers/P06_Fadhilla_dkk_2025\|(P06)]]|2025|NB/KNN/DT/LR/RF/SVM (komparatif)|Data status depresi mahasiswa (ukuran tidak dirinci)|LR terbaik: Akurasi **95,62%**|Tanpa explainability; ukuran/sumber sampel tidak transparan|

### Matriks SOTA — Klaster Pendukung (Chatbot, HCI, Computer Vision)

|Penulis|Tahun|Metode|Dataset/Basis|Hasil Utama|Kelemahan / Gap|
|---|---|---|---|---|---|
|Khairan & Habib [[Papers/P07_Khairan_Habib_2025\|(P07)]]|2025|Narrative review + analisis tematik Braun & Clarke|55 jurnal (2014–2024)|Tema: akses↑, stigma↓, tantangan privasi & empati|Tidak ada studi empiris lokal Indonesia|
|Assegaf dkk. [[Papers/P08_Assegaf_dkk_2024\|(P08)]]|2024|Pengembangan chatbot GPT-3.5 Turbo + WhatsApp|Black Box & Usability Testing|Interaksi relevan & mendalam (uji fungsional lolos)|Tanpa evaluasi penanganan krisis/keselamatan|
|Felix dkk. [[Papers/P09_Felix_dkk_2026\|(P09)]]|2026|SLR PRISMA 2020|257→16 studi (Scopus/GS/arXiv)|SUS 80,1; evolusi rule-based→ML→LLM|Basis bukti terbatas (16 studi); minim human oversight|
|Sutarti & Syaqialloh [[Papers/P10_Sutarti_Syaqialloh_2025\|(P10)]]|2025|CNN-BiLSTM + Data Augmentation|FER2013 (35.887 citra wajah)|Akurasi validasi **95%** (vs CNN 70%)|Bias demografis (data Barat); belum terhubung ke aplikasi kesehatan mental|

## B. Paragraf Sintesis

Bila keenam studi klaster inti (P01–P06) dibaca sebagai satu kesatuan alih-alih satu per satu, polanya menyingkap sebuah **paradoks akurasi–validitas**: performa tertinggi justru cenderung muncul pada studi dengan kontrol metodologis paling lemah (P03 mencapai 97% pada sampel kecil tanpa cross-validation; P06 mencapai 95,6% tanpa transparansi ukuran sampel), sementara studi dengan kontrol paling ketat justru menghasilkan akurasi paling moderat (P02 dengan tuning sistematis dan SMOTE "hanya" mencapai 82%; P05 dengan kerangka CRISP-DM yang rapi hanya mencapai 72%). Pola ini mengindikasikan bahwa **akurasi tinggi pada literatur saat ini lebih banyak menjadi artefak desain eksperimen (sampel kecil, tanpa validasi silang, potensi leakage SMOTE) ketimbang bukti keunggulan model yang sesungguhnya**. Temuan yang sama-sama konsisten justru muncul dari arah berlawanan: IndoBERT unggul telak pada P01 (37 ribu data, satu domain homogen) tetapi gagal mendominasi pada P05 (2 ribu data, domain campuran forum global) — menunjukkan bahwa **keunggulan model transformer sangat bergantung pada skala dan homogenitas data, bukan properti intrinsik arsitektur**. Lebih jauh, tidak satu pun dari keenam studi yang menggabungkan tiga elemen sekaligus: (1) validasi statistik yang kokoh (k-fold cross-validation), (2) perbandingan adil model klasik vs. transformer pada kondisi data yang setara, dan (3) interpretability/explainability — padahal ketiganya adalah prasyarat agar model dapat dipercaya untuk konteks berisiko tinggi seperti deteksi kesehatan mental. Klaster pendukung (P07–P09) memperkuat pembacaan ini dari sisi lain: tinjauan sistematis terhadap chatbot AI Indonesia (P09) maupun kajian naratif tentang chatbot kesehatan mental (P07) sama-sama menyimpulkan bahwa human oversight dan validasi keamanan/efektivitas lokal masih nihil — sehingga gap teknis pada level model (P01–P06) dan gap tata kelola pada level aplikasi (P07–P09) sesungguhnya saling memperkuat: belum ada _pipeline_ riset Indonesia yang menghubungkan model klasifikasi yang robust dan dapat dijelaskan dengan sistem aplikatif (chatbot/skrining) yang aman digunakan.

## C. Research Gap Utama (Dasar Proposal Penelitian)

**Belum ada penelitian dalam klaster yang dikaji yang secara sistematis (a) membandingkan model machine learning klasik dengan model transformer (IndoBERT) pada kondisi eksperimen yang setara (preprocessing sama, validasi k-fold yang konsisten, data split yang identik), (b) melakukan klasifikasi multi-level tingkat keparahan (bukan sekadar biner), sekaligus (c) menyertakan analisis interpretability (Explainable AI/SHAP) dan efisiensi komputasi sebagai bagian dari evaluasi.** Sebagian besar studi (P01, P04, P06) hanya melaporkan akurasi dari _single train-test split_ tanpa cross-validation; studi yang menyentuh multi-kelas (P03) tidak memiliki model pembanding; dan tidak ada satu pun studi yang mengaitkan performa model dengan transparansi pengambilan keputusan (XAI) — sebuah kebutuhan etis mendesak ketika model akan digunakan untuk konteks sensitif seperti kesehatan mental.

→ Gap inilah yang menjadi dasar perumusan topik riset baru pada [[03_Proposal_Penelitian]].

---

🔗 Terkait: [[01_Daftar_Pustaka]] · [[03_Proposal_Penelitian]] · [[00_README]]