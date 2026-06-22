---
tags:
  - desain-eksperimen
  - metodologi
  - cross-validation
  - stress-testing
---
# 04 — Desain Eksperimen Lengkap

## 1. Jenis Penelitian & Alasan

**Jenis:** Penelitian **eksperimental kuantitatif komparatif** (_computational/benchmark experimental research_).

**Alasan:**

- Terdapat **manipulasi variabel independen secara terkontrol** — jenis model (RF/SVM/XGBoost/IndoBERT) dan teknik balancing (SMOTE on/off) sengaja divariasikan sebagai "perlakuan" (_treatment_), sebagaimana riset eksperimental klasik memanipulasi variabel bebas untuk mengamati efeknya pada variabel terikat.
- **Subjek penelitian adalah data dan model** (bukan partisipan manusia), namun logika desainnya tetap eksperimental: kondisi non-perlakuan (preprocessing, data split, random seed) **dikontrol identik** di seluruh kelompok perlakuan agar perbedaan hasil dapat diatribusikan secara valid pada variabel independen yang diuji — bukan pada perbedaan kondisi eksperimen yang tidak terkontrol.
- Desain ini memungkinkan **pengujian hipotesis statistik formal** (uji-t berpasangan, uji korelasi) sebagaimana dirumuskan pada [[03_Proposal_Penelitian#9. Hipotesis Statistik (H0 dan H1)|§9 Proposal]], sesuatu yang tidak dimungkinkan oleh desain deskriptif/observasional semata.
- Selaras dengan kelemahan metodologis yang teridentifikasi pada [[02_Matriks_SOTA_dan_Sintesis|matriks SOTA]] — sebagian besar studi sebelumnya (P01, P03, P04, P06) tidak menggunakan desain eksperimen terkontrol dengan validasi silang, sehingga klaim performanya rentan bias desain (_single split bias_).

## 2. Variabel Penelitian

_(Identik dengan [[03_Proposal_Penelitian#6. Identifikasi Variabel|§6 Proposal]], dioperasionalkan untuk eksperimen)_

|Variabel|Level/Treatment dalam Eksperimen|
|---|---|
|**Independen — Model**|4 level: `RandomForest`, `SVM`, `XGBoost`, `IndoBERT`|
|**Independen — Balancing**|2 level: `SMOTE`, `No-SMOTE`|
|**Independen — Fitur**|2 level (khusus ML klasik): `TF-IDF Unigram`, `TF-IDF Uni+Bigram`; IndoBERT menggunakan _contextual embedding_ bawaan|
|**Dependen**|Accuracy, Precision (macro), Recall (macro), F1-score (macro), Training time (detik), Inference time (ms/sampel), Skor SHAP (mean \|nilai SHAP\| top-10 fitur)|
|**Kontrol**|`random_state=42` di seluruh komponen stokastik; pipeline preprocessing identik; rasio split & skema CV identik; perangkat keras & versi pustaka identik antar run|

Desain faktorial untuk ML klasik: **4 model klasik/IndoBERT × 2 balancing × (2 fitur khusus ML klasik)**, dievaluasi pada skema validasi yang sama di §3.

## 3. Skenario Pembagian Dataset & Validasi

```
Dataset Lengkap (N unggahan berlabel 4 kelas keparahan)
│
├── Stratified Hold-out Split (80:20, random_state=42)
│   │
│   ├── 80% — Development Set ──────────────────┐
│   │         (tuning + cross-validation)        │
│   │                                             ▼
│   │                          Stratified K-Fold Cross-Validation (k=5)
│   │                          • Fold digunakan bergantian sebagai validation
│   │                          • SMOTE/oversampling HANYA diterapkan pada
│   │                            bagian training tiap fold (no data leakage)
│   │                          • Hyperparameter tuning via GridSearchCV
│   │                            (di dalam training fold, nested)
│   │                          → Hasil 5-fold dipakai untuk UJI HIPOTESIS
│   │                            STATISTIK (paired t-test antar model)
│   │
│   └── 20% — Held-out Test Set (TIDAK disentuh sampai evaluasi akhir)
│             → Model final (hyperparameter terbaik, dilatih ulang
│               pada keseluruhan 80%) dievaluasi SEKALI di sini
│             → Dipakai untuk laporan metrik akhir & analisis SHAP
```

**Justifikasi:** Skema _nested_ (hold-out + k-fold di dalamnya) mencegah dua bias yang teridentifikasi pada studi sebelumnya: (1) **data leakage** akibat balancing/tuning yang "mengintip" data uji (P02 tidak menjelaskan secara eksplisit kapan SMOTE diterapkan), dan (2) **overfitting akibat single-split evaluation** tanpa validasi ulang (P03 melaporkan akurasi 97% dari split tunggal pada data kecil tanpa CV).

## 4. Spesifikasi Instrumen

### Hardware

|Komponen|Spesifikasi|
|---|---|
|GPU|NVIDIA Tesla **T4, 16 GB VRAM** (Google Colab)|
|RAM Sistem|±12–25 GB (Colab standard/High-RAM runtime)|
|CPU|vCPU yang disediakan Colab (≥2 core)|
|Storage|Google Drive (mount) untuk persistensi dataset & checkpoint model|

### Software

|Pustaka|Versi (minimum)|Fungsi|
|---|---|---|
|Python|3.10+|Bahasa pemrograman utama|
|`torch`|≥2.1 (cu121)|Backend deep learning, fine-tuning IndoBERT|
|`transformers`|≥4.40|Model & tokenizer IndoBERT (Hugging Face)|
|`datasets`|≥2.18|Manajemen dataset untuk Trainer API|
|`accelerate`|≥0.28|Optimasi training GPU (mixed precision)|
|`scikit-learn`|≥1.3|RF, SVM, TF-IDF, metrik, GridSearchCV, StratifiedKFold|
|`xgboost`|≥2.0|Model XGBoost|
|`imbalanced-learn`|≥0.12|SMOTE|
|`shap`|≥0.45|Explainable AI|
|`Sastrawi`|≥1.0.1|Stemming & stopword Bahasa Indonesia|
|`pandas`, `numpy`, `matplotlib`, `seaborn`|terbaru|Manipulasi data & visualisasi|

### Dataset

|Atribut|Spesifikasi|
|---|---|
|Sumber|Unggahan publik platform X (Twitter) berbahasa Indonesia|
|Metode pengumpulan|Web scraping dengan kata kunci turunan indikator PHQ-9 (selaras [[Papers/P03_Siswandi_Susilo_2026\|P03]])|
|Target ukuran|±5.000–10.000 unggahan pasca-filtering (mengatasi keterbatasan ukuran data kecil pada [[Papers/P02_Santoso_dkk_2025\|P02]] dan [[Papers/P03_Siswandi_Susilo_2026\|P03]])|
|Label|4 kelas ordinal: `Tidak Ada`, `Ringan`, `Sedang`, `Berat`|
|Anotasi|Manual oleh ≥2 annotator terlatih + pengukuran _inter-annotator agreement_ (Cohen's Kappa ≥0.6 sebagai syarat kelayakan data)|

## 5. Tabel Parameter Konfigurasi

### Random Forest

|Hyperparameter|Rentang Nilai (Grid Search)|
|---|---|
|`n_estimators`|[100, 200, 300]|
|`max_depth`|[None, 10, 20, 30]|
|`min_samples_split`|[2, 5, 10]|
|`min_samples_leaf`|[1, 2, 4]|
|`random_state`|42 (tetap)|

### SVM

|Hyperparameter|Rentang Nilai|
|---|---|
|`kernel`|['linear', 'rbf']|
|`C`|[0.1, 1, 10, 100]|
|`gamma`|['scale', 'auto']|
|`random_state`|42 (tetap)|

### XGBoost

|Hyperparameter|Rentang Nilai|
|---|---|
|`n_estimators`|[100, 200, 300]|
|`max_depth`|[3, 4, 5, 6]|
|`learning_rate`|[0.01, 0.1, 0.3]|
|`subsample`|[0.8, 0.9, 1.0]|
|`colsample_bytree`|[0.8, 0.9, 1.0]|
|`random_state`|42 (tetap)|

### IndoBERT (Fine-Tuning)

|Hyperparameter|Nilai (disesuaikan VRAM T4 16GB)|
|---|---|
|Model dasar|`indobenchmark/indobert-base-p1`|
|`max_seq_length`|128 token|
|`per_device_train_batch_size`|16|
|`per_device_eval_batch_size`|32|
|`learning_rate`|2e-5|
|`num_train_epochs`|4|
|`weight_decay`|0.01|
|`warmup_ratio`|0.1|
|`fp16` (mixed precision)|True|
|`gradient_accumulation_steps`|2|
|`random_state`/`seed`|42 (tetap)|

### SMOTE

|Parameter|Nilai|
|---|---|
|`k_neighbors`|5|
|`sampling_strategy`|`'auto'` (menyamakan semua kelas minoritas terhadap mayoritas)|
|Diterapkan pada|Fitur TF-IDF (ML klasik); _weighted random oversampling_ setara untuk IndoBERT (lihat catatan metodologis di notebook)|

## 6. Flowchart Desain Eksperimen

```mermaid
flowchart TD
    A[Mulai: Data Mentah X/Twitter] --> B[Web Scraping + Filtering]
    B --> C[Anotasi Manual 4 Kelas Keparahan + Cek Cohen's Kappa]
    C --> D[Preprocessing NLP: Cleaning, Normalisasi Slang,\nStopword Removal, Stemming Sastrawi]
    D --> E[Stratified Hold-out Split 80:20]
    E --> F[80% Development Set]
    E --> G[20% Held-out Test Set\n(disimpan, tidak disentuh)]

    F --> H[Stratified 5-Fold Cross-Validation]
    H --> I{Tipe Model?}

    I -->|ML Klasik| J[Ekstraksi Fitur TF-IDF\nUnigram / Uni+Bigram]
    J --> K[SMOTE pada Training Fold Saja]
    K --> L[GridSearchCV: RF / SVM / XGBoost]

    I -->|Deep Learning| M[Tokenisasi IndoBERT\nmax_len=128]
    M --> N[Weighted Oversampling Training Fold]
    N --> O[Fine-Tuning IndoBERT\nHuggingFace Trainer, fp16]

    L --> P[Evaluasi per Fold:\nAccuracy/Precision/Recall/F1/Waktu]
    O --> P

    P --> Q[Uji Hipotesis Statistik:\nPaired t-test, Korelasi]
    Q --> R[Model Final: Retrain pada 80% Penuh\ndengan Hyperparameter Terbaik]
    R --> S[Evaluasi Tunggal pada 20% Held-out Test Set]
    S --> T[Analisis SHAP: Interpretabilitas Model]
    T --> U[Stress Testing & Analisis Skalabilitas]
    U --> V[Laporan Akhir: Matriks Hasil + Visualisasi]
```

## 7. Rencana Stress Testing & Analisis Skalabilitas

|Jenis Uji|Skenario|Metrik yang Diukur|
|---|---|---|
|**Uji Skala Volume Data**|Jalankan pipeline penuh pada N = {500, 1.000, 5.000, 10.000, 50.000} sampel|Waktu preprocessing, waktu training per model, penggunaan RAM/VRAM puncak|
|**Uji Throughput Inferensi**|Inferensi batch dengan ukuran batch = {1, 8, 16, 32, 64}|Throughput (sampel/detik), latensi p50/p95/p99 (ms)|
|**Uji Batas Memori (OOM Boundary)**|Naikkan `max_seq_length` (64→512) dan `batch_size` (8→128) pada IndoBERT hingga _Out-of-Memory_ pada VRAM 16 GB|Titik kegagalan (breaking point) VRAM, untuk menentukan konfigurasi produksi yang aman|
|**Uji Ketahanan Input (Robustness)**|Input edge-case: teks kosong, teks >512 token (truncation), teks campur bahasa (code-mixed), teks dominan emoji/singkatan alay|Tingkat kegagalan sistem (crash rate), konsistensi output|
|**Analisis Kompleksitas Skalabilitas**|Plot waktu training vs ukuran data (log-log) untuk tiap model|Identifikasi apakah pertumbuhan waktu linier (ML klasik umumnya) atau superlinier (IndoBERT pada VRAM terbatas akibat gradient accumulation)|

**Tujuan keseluruhan:** memastikan bahwa model dengan performa statistik terbaik (hasil §6 hipotesis) **juga layak secara operasional** (waktu, memori, ketahanan) bila diintegrasikan ke sistem skrining nyata — menjawab manfaat praktis pada [[03_Proposal_Penelitian#4. Manfaat Penelitian|§4 Proposal]].

---

🔗 Kode implementasi: [[Code/Eksperimen_Komparasi_ML_IndoBERT_Depresi.ipynb| Eksperimen_Komparasi_ML_IndoBERT_Depresi.ipynb]] 🔗 Terkait: [[03_Proposal_Penelitian]] · [[02_Matriks_SOTA_dan_Sintesis]] · [[00_README]]