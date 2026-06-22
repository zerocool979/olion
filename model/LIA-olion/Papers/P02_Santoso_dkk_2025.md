---
tags:
  - paper
  - NLP
  - machine-learning
  - feature-selection
  - depresi
  - metaheuristic
Paper_id: P02
Tahun: 2025
---
# P02 — Mendeteksi Unsur Depresi pada Unggahan Media Sosial Menggunakan Metode Machine Learning dengan Optimasi Berbasis Inspirasi Alam

## 1. Judul dan Penulis

| Metadata      | Informasi                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Judul**     | Mendeteksi Unsur Depresi pada Unggahan Media Sosial Menggunakan Metode Machine Learning dengan Optimasi Berbasis Inspirasi Alam |
| **Penulis**   | Zein Rizky Santoso, Aji Hamim Wigena, Anang Kurnia                                                                              |
| **Institusi** | Sekolah Sains Data, Matematika, dan Informatika, IPB University                                                                 |
| **Publikasi** | _ESTIMASI: Journal of Statistics and Its Application_, Vol. 6 No. 2 (Juli 2025), hal. 128–143                                   |
| **DOI**       | [10.20956/ejsa.v6i2.45516](https://doi.org/10.20956/ejsa.v6i2.45516)                                                            |
| **Akses**     | https://journal.unhas.ac.id/index.php/ESTIMASI/article/view/45516                                                               |
| **Lisensi**   | Tidak dicantumkan / No explicit license specified                                                                               |

## 2. Sub-bidang Computer Science

**Machine Learning — Feature Selection & Metaheuristic/Nature-Inspired Optimization**, diterapkan pada **Text Classification (NLP)** untuk deteksi kesehatan mental.

## 3. Metode yang Digunakan

- **5 algoritma klasifikasi**: Naïve Bayes, k-Nearest Neighbors (k-NN), Decision Tree, Random Forest, XGBoost.
- **3 algoritma seleksi fitur metaheuristik (nature-inspired)**: Particle Swarm Optimization (PSO), Bat Algorithm (BA), Flamingo Search Algorithm (FSA) — diterapkan pada matriks fitur TF-IDF.
- **SMOTE** untuk menyeimbangkan kelas (data asli timpang: 74,1% "depresi" vs 25,9% "bukan depresi").
- **Grid Search** untuk hyperparameter tuning tiap model.
- Data: 1.105 unggahan X (Twitter) berbahasa Indonesia, dikumpulkan via _tweet-harvest_ dengan kata kunci "depresi", "bunuh diri", "sedih" (Agustus 2023), dilabeli manual oleh 2 annotator (termasuk satu dosen psikologi) berdasarkan kerangka DSM-V.

## 4. Metrik Evaluasi

Accuracy, Precision, Recall, F1-Score, **AUC-ROC**, jumlah fitur yang digunakan, dan jumlah iterasi konvergensi (efisiensi komputasi) — dievaluasi via Confusion Matrix.

## 5. Apakah Termasuk Riset Kuantitatif?

**Ya.** Riset eksperimental kuantitatif murni dengan desain _factorial comparison_ (5 algoritma × 3 metode seleksi fitur × variasi populasi 20/30/40/50). Seluruh kesimpulan didasarkan pada perbandingan numerik metrik performa (akurasi, AUC-ROC, F1) hasil confusion matrix — tidak ada komponen kualitatif selain pelabelan data awal yang sifatnya prosedural (bukan analisis tematik).

## 6. Future Work / Limitations

Pada bagian kesimpulan, penulis secara eksplisit merekomendasikan agar **penelitian selanjutnya mengeksplorasi kombinasi deep learning dengan teknik seleksi fitur**, serta **menguji pendekatan pada dataset yang lebih besar dan lebih beragam**. Penulis juga menyarankan eksplorasi metode seleksi/optimasi yang lebih baru dan model klasifikasi yang lebih canggih untuk lebih meningkatkan akurasi dan efisiensi. Keterbatasan tersirat lainnya: ukuran dataset relatif kecil (1.105 unggahan), ketidakseimbangan kelas signifikan pada data asli, dan proses pelabelan manual yang hanya melibatkan dua annotator sehingga berpotensi mengandung subjektivitas.

## 7. Research Gap

Akurasi terbaik yang dicapai (RF-FSA = 82,2%) masih jauh di bawah pendekatan berbasis transformer pada studi sejenis (mis. IndoBERT mencapai >90% pada P01) — namun penelitian ini **belum mengombinasikan deep learning (IndoBERT) dengan seleksi fitur metaheuristik**, sehingga trade-off antara _interpretability_ (fitur eksplisit hasil seleksi) dan _raw accuracy_ (model transformer) belum dieksplorasi secara terintegrasi.

## 8. Parafrase

Studi ini membangun model deteksi indikasi depresi dari unggahan platform X dengan menggabungkan lima algoritma klasifikasi klasik dan tiga algoritma optimasi terinspirasi alam (PSO, Bat Algorithm, Flamingo Search Algorithm) untuk seleksi fitur. Dari 1.105 unggahan berlabel manual berdasarkan kriteria DSM-V, ditemukan bahwa kombinasi Random Forest dengan Flamingo Search Algorithm memberikan hasil terbaik—akurasi 82,2% dengan jumlah fitur yang efisien dan presisi-recall yang seimbang. Penelitian ini menunjukkan bahwa pemilihan algoritma seleksi fitur yang tepat secara signifikan dapat meningkatkan kualitas model deteksi dini gejala depresi berbasis teks media sosial, sekaligus menjaga efisiensi komputasi.

---

🔗 Terkait: [[02_Matriks_SOTA_dan_Sintesis]] · [[01_Daftar_Pustaka]] · [[00_README]]