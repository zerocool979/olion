---
tags:
  - paper
  - NLP
  - sentiment-analysis
  - IndoBERT
  - CRISP-DM
  - kesehatan-mental
Paper_id: P05
Tahun: 2025
---
# P05 — Perbandingan Kinerja Model Machine Learning untuk Sentimen Analisis Isu Kesehatan Mental di Forum Kesehatan Online

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Judul**     | Perbandingan Kinerja Model Machine Learning untuk Sentimen Analisis Isu Kesehatan Mental di Forum Kesehatan Online |
| **Penulis**   | Lady Agustin Fitriana, Deni Risdiansyah                                                                            |
| **Institusi** | Universitas Bina Sarana Informatika                                                                                |
| **Publikasi** | _Jurnal Khatulistiwa Informatika_, Vol. 13 No. 2 (Desember 2025), hal. 80–88                                       |
| **DOI**       | [10.31294/jki.v13i2.11051](https://doi.org/10.31294/jki.v13i2.11051)                                               |
| **Akses**     | https://jurnal.bsi.ac.id/index.php/khatulistiwa/article/view/11051                                                 |
| **Lisensi**   | CC-BY-SA 4.0                                                                                                       |

## 2. Sub-bidang Computer Science

**NLP — Sentiment Analysis komparatif** (Machine Learning klasik vs Deep Learning/Transformer), menggunakan metodologi _data mining_ **CRISP-DM** (Cross Industry Standard Process for Data Mining).

## 3. Metode yang Digunakan

- Kerangka kerja **CRISP-DM** untuk seluruh siklus penelitian (business understanding → data understanding → preparation → modeling → evaluation).
- Data: 2.000 ulasan/postingan terkait isu kesehatan mental dari forum **Quora dan Reddit**.
- Pelabelan sentimen berbasis **leksikon InSet** (leksikon sentimen Bahasa Indonesia).
- **5 algoritma dibandingkan**: Bernoulli Naive Bayes, Decision Tree, Logistic Regression, XGBoost, dan **IndoBERT**.

## 4. Metrik Evaluasi

**Accuracy** (Logistic Regression tertinggi = 72%), **weighted F1-score** (XGBoost paling stabil), serta evaluasi kualitatif kemampuan IndoBERT dalam mendeteksi sentimen positif secara lebih kontekstual.

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Riset komparatif kuantitatif lima model klasifikasi dengan metrik performa numerik standar (accuracy, F1-score). Tahap pelabelan menggunakan leksikon otomatis (InSet) bersifat prosedural, bukan analisis kualitatif manual, sehingga keseluruhan desain tetap kuantitatif murni.

## 6. Future Work / Limitations

Akurasi tertinggi yang dicapai (72%) tergolong moderat dibandingkan studi sejenis pada platform lain, mengindikasikan **ruang perbaikan yang signifikan**, baik dari sisi kualitas leksikon sentimen, ukuran data latih, maupun representasi konteks lintas-bahasa (forum Quora/Reddit didominasi konten berbahasa Inggris sehingga adaptasi ke leksikon Bahasa Indonesia perlu dicermati). Penulis menyebut penelitian ini sebagai **"langkah awal menuju sistem pemantauan kesehatan mental yang lebih empatik dan responsif"** — mengisyaratkan arah lanjutan berupa pengembangan sistem pemantauan (monitoring) real-time dan penyempurnaan model. _**BAB - IV. KESIMPULAN**_

## 7. Research Gap

**IndoBERT justru tidak mengungguli model klasik (Logistic Regression/XGBoost) dari sisi akurasi keseluruhan** — kontras dengan temuan P01 di mana IndoBERT mencapai >94%. Hal ini menunjukkan adanya **gap riset sistematis terkait transferability dan ukuran data minimum** yang dibutuhkan model transformer seperti IndoBERT agar unggul dibanding model klasik, khususnya pada dataset berskala kecil (2.000) dan domain konten campuran/lintas bahasa seperti forum kesehatan global.

## 8. Parafrase

Penelitian ini membandingkan performa lima model machine learning—mulai dari pendekatan klasik (Naive Bayes, Decision Tree, Logistic Regression, XGBoost) hingga model transformer IndoBERT—dalam menganalisis sentimen 2.000 ulasan terkait kesehatan mental dari forum daring Quora dan Reddit, menggunakan kerangka kerja CRISP-DM dan pelabelan berbasis leksikon InSet. Hasil menunjukkan percakapan daring didominasi sentimen negatif seperti depresi dan kecemasan. Logistic Regression mencatat akurasi tertinggi (72%), XGBoost paling stabil dari sisi F1-score, sementara IndoBERT unggul khusus dalam mengenali sentimen positif berkat pemahaman konteks bahasa alami yang lebih mendalam, meski belum mendominasi secara keseluruhan.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]