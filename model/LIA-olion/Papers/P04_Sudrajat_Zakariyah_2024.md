---
tags:
  - paper
  - NLP
  - machine-learning
  - stres
  - siswa-SMA
Paper_id: P04
Tahun: 2024
---
# P04 — Penerapan Natural Language Processing dan Machine Learning untuk Prediksi Stres Siswa SMA Berdasarkan Analisis Teks

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Judul**     | Penerapan Natural Language Processing dan Machine Learning untuk Prediksi Stres Siswa SMA Berdasarkan Analisis Teks |
| **Penulis**   | Muhammad Rofiq Sudrajat, Muhammad Zakariyah                                                                         |
| **Institusi** | Universitas Teknologi Yogyakarta                                                                                    |
| **Publikasi** | _Building of Informatics, Technology and Science (BITS)_, Vol. 6 No. 3 (Desember 2024), hal. 1527–1536              |
| **DOI**       | [10.47065/bits.v6i3.6180](https://doi.org/10.47065/bits.v6i3.6180)                                                  |
| **Akses**     | https://ejurnal.seminar-id.com/index.php/bits/article/view/6180                                                     |
| **Lisensi**   | CC BY 4.0                                                                                                           |

## 2. Sub-bidang Computer Science

**Natural Language Processing (Feature Engineering)** + **Machine Learning Classification**, diterapkan pada konteks **psikologi pendidikan** (educational psychology informatics).

## 3. Metode yang Digunakan

- Preprocessing NLP: pembersihan data, penghapusan stopword, tokenisasi, lemmatisasi.
- Ekstraksi fitur: **Bag of Words (BOW)**, Term Frequency-Inverse Document Frequency **(TF-IDF)**, dan **N-gram** (Unigram, Bigram, Trigram).
- 4 algoritma klasifikasi dibandingkan: **Logistic Regression, Naive Bayes, Random Forest, SVM**.

## 4. Metrik Evaluasi

**Accuracy** sebagai metrik utama — kombinasi terbaik **Naive Bayes + fitur Bigram mencapai 95,6%**, model lain berkisar ~93%. Disebut pula adanya kasus _False Positive_ dan _False Negative_ sebagai indikator kualitatif tambahan dari kesalahan klasifikasi.

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Penelitian eksperimental kuantitatif yang membandingkan kombinasi 3 teknik ekstraksi fitur × 4 algoritma klasifikasi, dengan hasil dilaporkan murni sebagai skor akurasi numerik pada data uji teks siswa SMA. Tidak terdapat elemen wawancara/observasi kualitatif terhadap subjek penelitian.

## 6. Future Work / Limitations

Penulis menyatakan bahwa **meskipun performa model tergolong kuat, kesalahan klasifikasi (False Positive dan False Negative) masih ditemukan**, yang **mengindikasikan adanya ruang untuk perbaikan lebih lanjut**. Studi ini memosisikan dirinya sebagai langkah awal yang menjanjikan untuk **intervensi kesehatan mental di lingkungan pendidikan** (educational mental health interventions), mengisyaratkan arah lanjutan berupa penyempurnaan model dan kemungkinan integrasi ke sistem pendukung keputusan bagi konselor sekolah. _**BAB - 4. KESIMPULAN**_

## 7. Research Gap

Penelitian ini **hanya membandingkan model machine learning klasik** (tanpa deep learning/transformer seperti IndoBERT) dan **tidak menyebutkan teknik penyeimbangan kelas (class balancing)** maupun validasi silang (k-fold cross-validation) — sehingga generalisasi performa model pada populasi siswa SMA yang lebih luas dan beragam secara demografis/budaya masih perlu diuji lebih lanjut. Selain itu, klasifikasi tampak bersifat biner (stres/tidak stres) tanpa granularitas tingkat keparahan stres.

## 8. Parafrase

Riset ini mengeksplorasi penerapan NLP dan machine learning untuk memprediksi stres pada siswa SMA berdasarkan analisis teks, sebuah area yang penting karena stres pada remaja kerap tidak terdeteksi secara dini. Dengan menggabungkan teknik ekstraksi fitur seperti Bag of Words, TF-IDF, dan N-gram bersama empat algoritma klasifikasi populer, penelitian menemukan bahwa Naive Bayes dengan fitur Bigram memberikan akurasi tertinggi (95,6%), sementara model lain berkinerja sedikit di bawahnya (~93%). Temuan ini menegaskan potensi besar pendekatan berbasis teks untuk mendukung deteksi dini stres siswa, meskipun kesalahan klasifikasi masih perlu diminimalkan lebih lanjut sebelum diterapkan secara luas di lingkungan sekolah.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]