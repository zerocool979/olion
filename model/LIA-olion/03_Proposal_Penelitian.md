---
tags:
  - proposal
  - rumusan-masalah
  - hipotesis
  - variabel
---
# 03 — Proposal Penelitian

## 1. Formulasi Judul Riset

_**"Komparasi Algoritma Machine Learning Klasik dan IndoBERT dengan Pendekatan Explainable AI (SHAP) untuk Klasifikasi Tingkat Keparahan Depresi pada Unggahan Media Sosial X Berbahasa Indonesia"**_

|Komponen Formula|Isi|
|---|---|
|**[Metode]**|Komparasi Algoritma Machine Learning Klasik dan IndoBERT dengan pendekatan Explainable AI (SHAP)|
|**[Tujuan/Masalah]**|untuk Klasifikasi Tingkat Keparahan Depresi|
|**[Objek/Konteks]**|pada Unggahan Media Sosial X Berbahasa Indonesia|

Judul ini secara langsung menjawab [[02_Matriks_SOTA_dan_Sintesis#C. Research Gap Utama (Dasar Proposal Penelitian)|research gap utama]]: belum ada studi yang menggabungkan perbandingan adil ML klasik vs. IndoBERT, klasifikasi multi-level keparahan, **dan** interpretability (SHAP) sekaligus.

---

## 2. Rumusan Masalah

| #       | Pola             | Rumusan Masalah                                                                                                                                                                                                                                                                                                             |
| ------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RQ1** | **Pengaruh**     | Bagaimana **pengaruh** penerapan teknik penyeimbangan data (SMOTE) dan variasi ukuran fitur (TF-IDF n-gram) terhadap performa klasifikasi tingkat keparahan depresi pada model machine learning klasik maupun IndoBERT?                                                                                                     |
| **RQ2** | **Metrik**       | Seberapa besar nilai **akurasi, precision, recall, F1-score, dan waktu komputasi** yang dicapai oleh model machine learning klasik (Random Forest, SVM, XGBoost) dan model IndoBERT dalam mengklasifikasikan tingkat keparahan depresi (tidak ada, ringan, sedang, berat) pada unggahan media sosial X berbahasa Indonesia? |
| **RQ3** | **Perbandingan** | Bagaimana **perbandingan** performa klasifikasi dan tingkat interpretabilitas (melalui analisis SHAP) antara model machine learning klasik dengan model IndoBERT dalam tugas klasifikasi tingkat keparahan depresi tersebut?                                                                                                |

## 3. Tujuan Penelitian

|#|Tujuan Penelitian|
|---|---|
|**T1** _(↔ RQ1)_|Menganalisis pengaruh penerapan SMOTE dan variasi ukuran/teknik ekstraksi fitur terhadap performa model machine learning klasik dan IndoBERT dalam klasifikasi tingkat keparahan depresi.|
|**T2** _(↔ RQ2)_|Mengukur dan membandingkan nilai akurasi, precision, recall, F1-score, serta waktu komputasi (training & inference time) dari model machine learning klasik dan IndoBERT pada tugas klasifikasi tingkat keparahan depresi.|
|**T3** _(↔ RQ3)_|Membandingkan performa prediktif dan interpretabilitas (melalui SHAP) antara model machine learning klasik dan IndoBERT untuk menentukan model yang paling optimal dan dapat dipertanggungjawabkan secara etis (explainable) dalam mendeteksi tingkat keparahan depresi.|

## 4. Manfaat Penelitian

### Teoretis

1. Memperkaya literatur ilmu komputer dan **psikologi komputasional** (computational mental health) mengenai penerapan NLP dan _explainable AI_ untuk deteksi kesehatan mental berbasis teks Bahasa Indonesia — mengisi gap yang teridentifikasi pada [[02_Matriks_SOTA_dan_Sintesis]].
2. Memberikan kontribusi metodologis berupa **kerangka komparasi yang konsisten** (preprocessing seragam, validasi k-fold, metrik terstandar, dan interpretability) antara pendekatan machine learning klasik dan deep learning/transformer — kerangka yang absen pada studi-studi sebelumnya (P01–P06).

### Praktis

1. Memberikan dasar pengembangan **sistem deteksi dini risiko depresi** yang dapat diintegrasikan oleh institusi pendidikan, layanan kesehatan mental, maupun platform digital untuk skrining awal secara non-invasif dan berskala besar.
2. Menjadi **alat bantu pengambilan keputusan (decision support tool)** bagi tenaga profesional (psikolog/konselor) dalam memprioritaskan individu berisiko tinggi berdasarkan tingkat keparahan yang terdeteksi, dengan transparansi model (explainability) yang mendukung pertimbangan etis sebelum intervensi dilakukan.

## 5. Batasan Masalah

1. **Dataset** — Data dibatasi pada unggahan publik platform X (Twitter) berbahasa Indonesia yang dikumpulkan melalui scraping dengan kata kunci turunan indikator PHQ-9, dalam rentang waktu tertentu. Hasil tidak mencerminkan seluruh populasi pengguna media sosial Indonesia maupun setara dengan diagnosis klinis resmi oleh profesional.
2. **Algoritma** — Perbandingan dibatasi pada tiga algoritma machine learning klasik (Random Forest, SVM, XGBoost) dan satu model deep learning transformer (IndoBERT); tidak mencakup model LLM generatif berskala besar (GPT-4, Llama, dsb.).
3. **Hardware** — Eksperimen dijalankan pada lingkungan komputasi GPU tunggal (NVIDIA T4 16GB via Google Colab), sehingga ukuran batch dan panjang sekuens token dibatasi oleh kapasitas VRAM yang tersedia.
4. **Software** — Implementasi dibatasi pada ekosistem Python (Scikit-learn, Hugging Face Transformers, SHAP, Sastrawi), tanpa membandingkan dengan framework lain (TensorFlow.js, ML.NET, dsb.).
5. **Parameter** — Hyperparameter tuning dibatasi pada Grid/Random Search dengan rentang nilai yang ditentukan sebelumnya (bukan Neural Architecture Search/AutoML otomatis penuh), dan validasi dibatasi pada metode **stratified k-fold cross-validation (k=5)**.
6. **Label/Anotasi** — Label tingkat keparahan (tidak ada/ringan/sedang/berat) merupakan hasil anotasi manual oleh sejumlah terbatas annotator (bukan psikolog klinis berlisensi dalam jumlah besar), sehingga berpotensi mengandung subjektivitas pelabelan yang dimitigasi melalui pengukuran _inter-annotator agreement_ (Cohen's Kappa).

## 6. Identifikasi Variabel

|Jenis Variabel|Daftar Variabel|
|---|---|
|**Variabel Independen (X)**|(1) Jenis model/algoritma klasifikasi (Random Forest, SVM, XGBoost, IndoBERT); (2) Teknik penyeimbangan data (dengan SMOTE / tanpa SMOTE); (3) Teknik ekstraksi fitur (TF-IDF unigram/bigram vs. embedding kontekstual IndoBERT)|
|**Variabel Dependen (Y)**|(1) Performa klasifikasi tingkat keparahan depresi (Accuracy, Precision, Recall, F1-score); (2) Waktu komputasi (training time & inference time); (3) Skor interpretabilitas/konsistensi nilai SHAP (fidelity)|
|**Variabel Kontrol**|(1) Ukuran dan rasio split dataset (80:20, stratified k-fold k=5 untuk semua model); (2) Pipeline preprocessing yang identik (cleaning, normalisasi slang, stopword removal, stemming Sastrawi) untuk semua model; (3) Sumber dan rentang waktu data yang sama (platform X, periode pengambilan identik); (4) Random seed (untuk reproducibility)|

## 7. Tabel Operasionalisasi Variabel

|Variabel|Definisi Operasional|Indikator|Skala|Instrumen|
|---|---|---|---|---|
|Jenis Model (X1)|Algoritma klasifikasi yang digunakan untuk memprediksi kelas keparahan depresi|RF / SVM / XGBoost / IndoBERT|Nominal|Implementasi kode (scikit-learn, HuggingFace Transformers)|
|Teknik Balancing (X2)|Ada/tidaknya penerapan SMOTE pada data latih|Dengan SMOTE / Tanpa SMOTE|Nominal (dikotomis)|Pustaka `imbalanced-learn`|
|Teknik Ekstraksi Fitur (X3)|Representasi numerik teks yang digunakan model|TF-IDF (uni/bi-gram) / Contextual Embedding|Nominal|`TfidfVectorizer`, IndoBERT tokenizer|
|Akurasi (Y1)|Proporsi prediksi benar terhadap keseluruhan data uji|% prediksi benar|Rasio (0–100%)|Confusion matrix, `sklearn.metrics`|
|Precision (Y2)|Proporsi prediksi positif yang benar-benar relevan per kelas keparahan|% per kelas|Rasio (0–100%)|`sklearn.metrics.precision_score`|
|Recall (Y3)|Proporsi kasus positif aktual yang berhasil terdeteksi per kelas|% per kelas|Rasio (0–100%)|`sklearn.metrics.recall_score`|
|F1-Score (Y4)|Rata-rata harmonik precision & recall|Skor 0–1|Rasio|`sklearn.metrics.f1_score`|
|Waktu Komputasi (Y5)|Lama waktu pelatihan & inferensi model|Detik/menit per epoch / per 1.000 sampel|Rasio|`time.perf_counter()`, logging eksperimen|
|Skor Interpretabilitas (Y6)|Konsistensi & kejelasan kontribusi fitur terhadap prediksi|Nilai rata-rata|SHAP value|per fitur top-N|
|Tingkat Keparahan Depresi (Label)|Kategori target klasifikasi|Tidak ada / Ringan / Sedang / Berat|Ordinal|Anotasi manual berbasis kriteria PHQ-9/DSM-V|

## 8. Hipotesis Penelitian

__Diduga bahwa model IndoBERT akan menghasilkan performa klasifikasi tingkat keparahan depresi yang lebih tinggi (accuracy dan F1-score) dibandingkan model machine learning klasik karena kemampuannya memahami konteks bahasa secara bidireksional dan kontekstual Namun, model machine learning klasik (khususnya Random Forest dengan SMOTE) diduga akan menunjukkan keunggulan dari sisi efisiensi komputasi dan tingkat interpretabilitas (kejelasan fitur prediktor) dibandingkan IndoBERT. Selain itu, diduga penerapan SMOTE secara konsisten akan meningkatkan performa F1-score pada kelas minoritas (tingkat keparahan "berat") pada kedua jenis model, sejalan dengan temuan konsisten pada [[Papers/P02_Santoso_dkk_2025|P02]] dan [[Papers/P05_Fitriana_Risdiansyah_2025|P05]].__

## 9. Hipotesis Statistik

### Hipotesis Statistik 1 — Pengaruh SMOTE (terkait RQ1/T1)

$$H_0: \mu_{\text{dengan SMOTE}} = \mu_{\text{tanpa SMOTE}}$$ $$H_1: \mu_{\text{dengan SMOTE}} > \mu_{\text{tanpa SMOTE}}$$ _(diukur pada F1-score kelas minoritas "berat")_

### Hipotesis Statistik 2 — Perbandingan IndoBERT vs. ML Klasik (terkait RQ2/RQ3, T2/T3)

$$H_0: \mu_{\text{IndoBERT}} = \mu_{\text{ML klasik}}$$ $$H_1: \mu_{\text{IndoBERT}} \neq \mu_{\text{ML klasik}}$$ _(diukur pada rata-rata F1-score makro hasil k-fold cross-validation)_

### Hipotesis Statistik 3 — Trade-off Interpretabilitas vs Akurasi

$$H_0: \rho_{(\text{akurasi}, \text{skor interpretabilitas})} = 0$$ $$H_1: \rho_{(\text{akurasi}, \text{skor interpretabilitas})} \neq 0$$ _(uji korelasi antara akurasi model dan skor interpretabilitas SHAP di seluruh model yang diuji)_

## 10. Arah Hipotesis: Satu Arah atau Dua Arah?

|Hipotesis|Arah|Alasan|
|---|---|---|
|**H1 (SMOTE)**|**Satu arah (one-tailed)**|Literatur pada klaster ini **secara konsisten** menunjukkan SMOTE **meningkatkan** (bukan menurunkan) performa model pada data depresi yang timpang — [[Papers/P02_Santoso_dkk_2025\|P02]] melaporkan AUC-ROC naik dari 0,53→0,7 dan F1 kelas minoritas naik dari 0,37→0,6 setelah SMOTE diterapkan secara sistematis pada lima algoritma berbeda. Karena arah pengaruh sudah dapat diprediksi secara teoretis dan empiris dari literatur, hipotesis dirumuskan **terarah (directional)**.|
|**H1 (IndoBERT vs. ML Klasik)**|**Dua arah (two-tailed)**|Temuan literatur **tidak konsisten/bertentangan**: IndoBERT unggul telak pada [[Papers/P01_Situmorang_Purba_2024\|P01]] (94,91% pada data besar-homogen), namun **gagal mendominasi** pada [[Papers/P05_Fitriana_Risdiansyah_2025\|P05]] (kalah dari Logistic Regression pada data kecil-heterogen). Karena arah perbedaan performa **belum dapat dipastikan sebelum eksperimen** dan justru menjadi pertanyaan inti riset ini, hipotesis dirumuskan **tidak terarah (non-directional)** sehingga pengujian dapat mendeteksi keunggulan pada kedua arah.|
|**H1 (Korelasi Akurasi–Interpretabilitas)**|**Dua arah (two-tailed)**|Belum ada studi sebelumnya dalam klaster yang mengukur hubungan ini secara eksplisit, sehingga arah korelasi (positif/negatif) bersifat eksploratif dan tidak dapat diasumsikan sebelumnya.|

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[04_Desain_Eksperimen]] · [[00_README]]