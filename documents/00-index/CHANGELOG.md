
# CHANGELOG — OLION Documentation

Dokumen ini mencatat seluruh perubahan signifikan yang terjadi pada artefak dokumentasi proyek OLION.
Setiap perubahan yang berdampak pada model sistem, struktur data, atau alur proses wajib dicatat untuk menjaga traceability antar fase.

Format versi yang digunakan:

vMAJOR.MINOR.PATCH

Keterangan:

- MAJOR → Perubahan struktur besar atau breaking changes
- MINOR → Penambahan artefak dokumentasi baru
- PATCH → Revisi minor, klarifikasi, atau perbaikan kecil

Maintainer: **beel**

---

# [Unreleased]

---

# [v0.1.5] — 2026-04-01

## Added

### Recommendation Engine (Process 8.0)

Penambahan proses **8.0 — Recommendation Engine** pada DFD Level 1 sebagai layer intelligence untuk personalisasi sistem.

Cakupan utama:

- Personalized Discussion Feed
- Expert Recommendation Feed
- Behavior & Interaction Aggregation
- Integrasi sinyal reputasi dan moderasi
- Trigger notifikasi berbasis rekomendasi

Karakteristik:

- Read-heavy (tidak mengubah data utama)
- Berbasis agregasi multi-source data
- Mendukung future ML integration

---

### DFD Level 2 — Initial Structure

Ditambahkan folder baru untuk pengembangan **DFD Level 2** sebagai dekomposisi lanjutan dari seluruh proses Level 1.

Lokasi:

```

03-analysis-design/
└── 03-dfd-level-2/
└── notes.md

```


Tujuan:

- memecah proses 1.0–8.0 menjadi sub-process detail
- menjadi dasar desain API, event, dan database
- meningkatkan granularitas analisis sistem

Status:

🟨 DRAFT — dalam tahap penyusunan awal

---

## Changed

### DFD Level 1 — Finalization & Structural Enhancement

DFD Level 1 disempurnakan dan dinyatakan **final (DONE)** setelah integrasi penuh Recommendation Engine.

Perubahan utama:

- Penambahan proses 8.0 Recommendation Engine
- Integrasi aliran data dari:
  - 2.0 Manajemen Diskusi
  - 3.0 Sistem Reputasi
  - 4.0 Moderasi Konten
  - 5.0 Manajemen Pakar
- Penambahan output:
  - Personalized Feed → Pengguna
  - Expert Feed → Pakar
  - Recommendation Metrics → Administrasi
  - Trigger → Notifikasi Real-Time
- Optimalisasi relasi dengan data store:
  - D1, D2, D3, D6, D7

Dampak:

- peningkatan relevansi konten
- konsistensi aliran data antar proses
- kesiapan arsitektur berbasis event & analytics

---

### notes.md — Full Rewrite (DFD Level 1)

Dokumentasi DFD Level 1 ditulis ulang secara menyeluruh.

Penyempurnaan:

- definisi formal semua proses (1.0–8.0)
- struktur input/output yang eksplisit
- penambahan signal-based flow
- konsistensi terminologi lintas modul
- alignment penuh dengan diagram terbaru

Dokumen kini siap sebagai baseline:

- DFD Level 2
- API Design
- Event-driven Architecture

---

### DOCUMENT_MAP.md — Status Update

Dilakukan sinkronisasi status dokumentasi:

- DFD Level 1 → 🟩 DONE
- Penambahan DFD Level 2 → 🟨 DRAFT
- Penyesuaian struktur numbering Analysis & Design

---

## Fixed

- Missing data flow ke layer rekomendasi pada versi sebelumnya
- Ambiguitas hubungan antar proses analitik
- Inkonsistensi terminologi data flow
- Redundansi aliran notifikasi
- Ketidakterhubungan antara modul diskusi, reputasi, dan rekomendasi

---

## Impact Summary

Perubahan ini menandai evolusi sistem dari:

**Content Platform → Intelligent Knowledge Platform**

Implikasi:

- sistem lebih adaptif dan kontekstual
- peningkatan kompleksitas terkontrol
- fondasi kuat untuk ML & personalization pipeline

---

## Status

DFD Level 1:

🟩 DONE

DFD Level 2:

🟨 DRAFT

Siap untuk:

- dekomposisi proses lanjutan
- desain API granular
- implementasi event-driven system

---

# [v0.1.4] — 2026-03-31

## Added

### DFD Level 1 — Initial Decomposition

Ditambahkan artefak awal DFD Level 1 sebagai hasil dekomposisi dari Diagram Konteks.

Lokasi:

```

03-analysis-design/
└── 03-dfd-level-2/
└── notes.md

```


Status:

🟨 DRAFT

---

## Changed

### DOCUMENT_MAP.md — Status Synchronization

- Penambahan referensi DFD Level 1
- Sinkronisasi fase Requirements → Analysis

---

## Fixed

- Tidak ada

---

# [v0.1.3] — 2026-03-31

## Added

- Dokumentasi final Diagram Konteks (DFD Level 0)
- Visualisasi diagram tervalidasi

## Changed

### Context Diagram — Full Refinement

- standarisasi data flow
- penyederhanaan narasi
- peningkatan kejelasan boundary sistem

## Fixed

- inkonsistensi label dan terminologi

---

# [v0.1.2] — 2026-03-27

## Changed

### Notification Flow Simplification

- penyederhanaan alur notifikasi
- pengurangan redundansi

## Fixed

- minor inconsistency pada label

---

# [v0.1.2] — 2026-02-16

## Added

- Proposal proyek

---

# [v0.1.1] — 2026-02-03

## Added

- BRD
- SRS

---

# [v0.1.0] — 2026-01-29

## Added

- Project Charter

---

# [v0.0.1] — 2026-01-28

## Added

- Struktur awal dokumentasi
- DOCUMENT_MAP
- CHANGELOG

---

# Closing Note

CHANGELOG ini merupakan sumber kebenaran evolusi dokumentasi OLION.

Setiap perubahan pada model, arsitektur, maupun desain sistem harus dicatat untuk menjaga konsistensi, traceability, dan kesiapan implementasi.
