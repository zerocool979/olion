---
tags:
  - paper
  - computer-vision
  - CNN
  - BiLSTM
  - facial-emotion
  - affective-computing
Paper_id: P10
Tahun: 2025
---
# P10 — Klasifikasi dan Pengenalan Emosi dari Ekspresi Wajah Menggunakan CNN-BiLSTM dengan Teknik Data Augmentation

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Judul**     | Klasifikasi dan Pengenalan Emosi dari Ekspresi Wajah Menggunakan CNN-BiLSTM dengan Teknik Data Augmentation |
| **Penulis**   | Sutarti, Fariza Syaqialloh                                                                                  |
| **Institusi** | Universitas Serang Raya                                                                                     |
| **Publikasi** | _DECODE: Jurnal Pendidikan Teknologi Informasi_, Vol. 5 No. 1 (Maret 2025), hal. 79–91                      |
| **DOI**       | [10.51454/decode.v5i1.1038](https://doi.org/10.51454/decode.v5i1.1038)                                      |
| **Akses**     | https://journal.umkendari.ac.id/decode/article/view/1038                                                    |
| **Lisensi**   | CC BY 4.0                                                                                                   |

## 2. Sub-bidang Computer Science

**Computer Vision / Affective Computing** — klasifikasi citra menggunakan arsitektur **Deep Learning hibrida (CNN + BiLSTM)**, berbeda dari paper P01–P09 yang berbasis teks; paper ini merepresentasikan modalitas **visual** dalam riset psikologi komputasional.

## 3. Metode yang Digunakan

- Arsitektur hibrida **CNN-BiLSTM** (Convolutional Neural Network untuk ekstraksi fitur spasial + Bidirectional LSTM untuk menangkap dependensi sekuensial/kontekstual).
- **Teknik Data Augmentation** untuk mengatasi ketidakseimbangan kelas pada dataset.
- Dataset benchmark: **FER2013** (35.887 gambar wajah, 7 kelas emosi), dataset yang dikenal tidak seimbang antar kelas.
- Perbandingan terhadap baseline **CNN murni** (tanpa BiLSTM).

## 4. Metrik Evaluasi

**Akurasi validasi**: CNN-BiLSTM = **95%** vs CNN baseline = **70%**; **validation loss** (stabilitas model); **Confusion Matrix** per kelas emosi (Angry, Happy, Sad, Surprise, dll.) dengan rincian peningkatan akurasi per kelas setelah augmentasi data.

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Riset eksperimental kuantitatif murni di ranah computer vision: performa model diukur melalui akurasi validasi, validation loss, dan confusion matrix numerik pada dataset benchmark standar (FER2013). Tidak ada elemen kualitatif.

## 6. Future Work / Limitations

Pembahasan penelitian menyoroti perbandingan antara **ensemble learning** dan **transfer learning** sebagai arah pengembangan lanjutan: _ensemble learning_ dinilai lebih efektif meningkatkan akurasi, sedangkan _transfer learning_ lebih efektif meningkatkan efisiensi dan generalisasi model — keduanya berpotensi **digabungkan untuk hasil yang lebih optimal**, terutama **transfer learning untuk meningkatkan akurasi deteksi emosi ketika data pelatihan terbatas**. Keterbatasan tersirat lainnya: dataset FER2013 yang digunakan diketahui tidak seimbang antar kelas emosi (memerlukan augmentasi tambahan) dan merupakan dataset benchmark umum, bukan data wajah yang representatif terhadap populasi Indonesia. _**BAB - KESIMPULAN**_

## 7. Research Gap

Model **belum diuji pada data wajah populasi Indonesia/Asia Tenggara** — FER2013 didominasi oleh data wajah dari konteks Barat sehingga berpotensi mengandung _demographic bias_ (perbedaan ekspresi wajah lintas budaya). Selain itu, penelitian ini **belum diintegrasikan dengan konteks aplikasi kesehatan mental** (misalnya aplikasi _mood-tracking_ berbasis kamera) meskipun secara konseptual sangat relevan untuk pengembangan affective computing di ranah kesehatan mental digital Indonesia.

## 8. Parafrase

Penelitian ini mengusulkan arsitektur hibrida CNN-BiLSTM untuk klasifikasi emosi dari ekspresi wajah, menggabungkan kemampuan CNN mengekstraksi fitur spasial dengan BiLSTM yang menangkap pola kontekstual secara dua arah. Dengan menerapkan teknik augmentasi data pada dataset benchmark FER2013 yang dikenal tidak seimbang antar kelas, model CNN-BiLSTM mencapai akurasi validasi 95%, jauh mengungguli CNN konvensional yang hanya mencapai 70%, sekaligus menunjukkan validation loss yang lebih stabil dan minim overfitting. Confusion matrix mengonfirmasi peningkatan akurasi signifikan pada hampir semua kelas emosi, menegaskan keunggulan pendekatan hibrida ini dalam menghadapi tantangan variasi pencahayaan, posisi wajah, dan kompleksitas ekspresi manusia.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]