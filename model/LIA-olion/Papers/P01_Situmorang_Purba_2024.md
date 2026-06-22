---
tags:
  - paper
  - NLP
  - deep-learning
  - depresi
  - IndoBERT
Paper_id: P01
Tahun: 2024
---
# P01 — Deteksi Potensi Depresi dari Unggahan Media Sosial X Menggunakan Teknik NLP dan Model IndoBERT

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **Judul**     | Deteksi Potensi Depresi dari Unggahan Media Sosial X Menggunakan Teknik NLP dan Model IndoBERT |
| **Penulis**   | Gilbert Fernando Situmorang, Ronsen Purba                                                      |
| **Institusi** | Universitas Mikroskil, Medan                                                                   |
| **Publikasi** | _Building of Informatics, Technology and Science (BITS)_, Vol. 6 No. 2 (2024), hal. 649–661    |
| **DOI**       | [10.47065/bits.v6i2.5496](https://doi.org/10.47065/bits.v6i2.5496)                             |
| **Akses**     | https://ejurnal.seminar-id.com/index.php/bits/article/view/5496                                |
| **Lisensi**   | CC BY 4.0                                                                                      |

## 2. Sub-bidang Computer Science

**Natural Language Processing (NLP) — Deep Learning berbasis Transformer**, beririsan dengan **Affective Computing/Computational Mental Health**. Termasuk kategori _text classification_ menggunakan model bahasa pra-latih (pretrained language model).

## 3. Metode yang Digunakan

- Fine-tuning model **IndoBERT** (adaptasi BERT yang dilatih pada korpus Bahasa Indonesia) untuk klasifikasi biner teks (berpotensi depresi vs. tidak).
- Data: 37.554 teks/unggahan dari platform X, dikumpulkan menggunakan **kata kunci yang disetujui psikiater** (psychiatrist-approved keywords) sebagai proxy indikasi gejala depresi.
- Pipeline: pengumpulan data (scraping) → preprocessing teks → tokenisasi BERT → fine-tuning → evaluasi.

## 4. Metrik Evaluasi

Accuracy, Precision, Recall, dan F1-score — keempatnya tercatat **94,91%** (nilai yang relatif seragam pada keempat metrik mengindikasikan performa yang seimbang antar kelas).

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Penelitian ini adalah riset **kuantitatif eksperimental** (applied experimental research dalam computer science): variabel berupa representasi teks diproses melalui model statistik/neural, dan hasil dilaporkan murni dalam bentuk skor numerik (accuracy/precision/recall/F1) yang diperoleh dari pengujian pada data uji (test set) yang terukur. Tidak ada elemen wawancara, observasi naturalistik, atau analisis tematik kualitatif — seluruh klaim dibuktikan melalui pengukuran performa model pada data berlabel.

## 6. Future Work / Limitations

Penulis menyatakan keterbatasan utama penelitian terletak pada **ketergantungan terhadap data unggahan media sosial**, yang berpotensi tidak sepenuhnya mencerminkan kondisi emosional pengguna yang sesungguhnya — sebuah unggahan publik bisa jadi tidak merepresentasikan keadaan psikologis riil seseorang (bias presentasi diri/self-report bias di ruang publik). Arah penelitian lanjutan yang tersirat dari pembahasan meliputi perluasan dan peningkatan kualitas dataset, serta penguatan recall agar tidak ada teks berpotensi depresi yang terlewat (false negative diminimalkan) demi mendukung deteksi dini yang lebih andal.

## 7. Research Gap

Model hanya diuji pada **klasifikasi biner** (depresi/bukan) dan **satu platform (X)** tanpa pengujian validitas-silang ke platform lain (Instagram, TikTok, forum kesehatan). Selain itu, **tidak ada analisis interpretability/explainable AI (XAI)** — model bersifat _black box_ sehingga sulit diketahui kata/fitur linguistik spesifik apa yang mendorong prediksi, padahal aspek ini krusial untuk kepercayaan klinis dan etika penggunaan di ranah kesehatan mental.  _**BAB - 4. KESIMPULAN**_

## 8. Parafrase

Penelitian ini mengembangkan model deteksi dini potensi depresi dari unggahan media sosial X berbahasa Indonesia dengan memanfaatkan IndoBERT, varian BERT yang telah dilatih khusus pada korpus Bahasa Indonesia. Sebanyak 37 ribuan unggahan dikumpulkan menggunakan kata kunci yang divalidasi oleh psikiater untuk merepresentasikan ekspresi terkait depresi di ruang digital. Setelah proses fine-tuning, model berhasil mencapai performa klasifikasi yang tinggi dan seimbang pada keempat metrik utama. Studi ini menegaskan potensi pendekatan berbasis transformer untuk mendukung skrining kesehatan mental berskala besar, meski tetap mengingatkan bahwa data media sosial memiliki keterbatasan dalam merepresentasikan kondisi psikologis pengguna secara utuh.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]