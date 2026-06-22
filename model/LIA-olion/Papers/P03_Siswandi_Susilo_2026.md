---
tags:
  - paper
  - NLP
  - random-forest
  - depresi
  - severity-classification
Paper_id: P03
Tahun: 2026
---
# P03 — Identifikasi Indikasi Risiko Depresi pada Unggahan Media Sosial X Menggunakan Natural Language Processing dan Algoritma Random Forest

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Judul**     | Identifikasi Indikasi Risiko Depresi pada Unggahan Media Sosial X Menggunakan Natural Language Processing dan Algoritma Random Forest |
| **Penulis**   | Arif Siswandi, Arif Susilo                                                                                                            |
| **Institusi** | Universitas Pelita Bangsa, Bekasi                                                                                                     |
| **Publikasi** | _Bulletin of Computer Science Research_, Vol. 6 No. 2 (Februari 2026), hal. 813–822                                                   |
| **DOI**       | [10.47065/bulletincsr.v6i2.1026](https://doi.org/10.47065/bulletincsr.v6i2.1026)                                                      |
| **Akses**     | https://hostjournals.com/bulletincsr/article/view/1026                                                                                |
| **Lisensi**   | CC BY 4.0                                                                                                                             |

## 2. Sub-bidang Computer Science

**Natural Language Processing (Text Mining)** + **Machine Learning Classification (multi-kelas)**, dengan kerangka acuan psikometrik **PHQ-9 (Patient Health Questionnaire-9)** sebagai dasar pembentukan kata kunci dan label.

## 3. Metode yang Digunakan

- Web scraping unggahan X periode Januari–November 2024 menggunakan kata kunci yang diturunkan secara konseptual dari indikator **PHQ-9**.
- Pipeline filtering bertingkat (penghapusan duplikat, filter bahasa, eliminasi konten tidak relevan) — dari 36.081 unggahan awal tersaring menjadi **1.070 unggahan final**.
- Pelabelan manual ke **3 kategori tingkat keparahan**: ringan, sedang, berat.
- Preprocessing teks → ekstraksi fitur **TF-IDF** → klasifikasi dengan **Random Forest**.

## 4. Metrik Evaluasi

**Accuracy = 97%** — namun penulis sendiri menekankan nilai ini harus dimaknai secara hati-hati karena dipengaruhi karakteristik dataset dan proses pelabelan manual.

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Merupakan riset kuantitatif berbasis eksperimen klasifikasi multi-kelas dengan pengukuran akurasi numerik pada data uji. Pelabelan manual (3 kategori) bersifat prosedural-kategorikal, bukan analisis kualitatif tematik, sehingga keseluruhan desain tetap tergolong kuantitatif.

## 6. Future Work / Limitations

Penulis secara **eksplisit dan jujur memperingatkan** bahwa skor akurasi 97% "harus diinterpretasikan secara hati-hati karena performa model dapat dipengaruhi oleh karakteristik dataset dan proses pelabelan manual." Model yang dihasilkan **disarankan dipandang sebagai pendekatan eksplorasi** untuk mengidentifikasi pola linguistik terkait ekspresi emosional di teks media sosial, **bukan sebagai alat diagnostik klinis untuk depresi**. Tingginya tingkat penyaringan data (dari 36.081 menjadi hanya 1.070 unggahan, atau ~97% data terbuang) juga mengindikasikan tantangan ketersediaan dan kualitas data yang relevan. _**SUB-BAB - 3.2. Pembahasan**_

## 7. Research Gap

Penelitian ini adalah **studi model tunggal** (Random Forest saja) tanpa baseline pembanding (mis. SVM, Naive Bayes, atau model deep learning), serta **tidak melaporkan validasi silang (cross-validation)** atau pengukuran reliabilitas antar-annotator (mis. Cohen's Kappa) untuk pelabelan 3 kategori manual — sehingga akurasi 97% yang sangat tinggi pada dataset berukuran kecil (1.070) berisiko overfitting dan sulit diverifikasi keandalannya secara independen.

## 8. Parafrase

Penelitian ini menganalisis pola kebahasaan yang berasosiasi dengan ekspresi indikatif depresi pada unggahan platform X menggunakan pendekatan NLP dan algoritma Random Forest. Kata kunci pengumpulan data diturunkan dari indikator kuesioner PHQ-9 yang diadaptasi ke ekspresi bahasa sehari-hari di media sosial. Setelah penyaringan ketat, data final berjumlah 1.070 unggahan dilabeli ke tiga tingkat keparahan ekspresi depresif (ringan, sedang, berat) dan diklasifikasikan menggunakan Random Forest dengan fitur TF-IDF, mencapai akurasi 97%. Para penulis menekankan sikap kehati-hatian ilmiah dengan menyatakan model ini bersifat eksploratif untuk mengenali pola bahasa, bukan alat diagnosis klinis.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]