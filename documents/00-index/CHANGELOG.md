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

# [v0.1.3] — 2026-03-31

## Added

- Dokumentasi final **Diagram Konteks (DFD Level 0)**
  (`03-analysis-design/01-diagram-konteks-dfd-level-0/notes.md`)

- Validated **Context Diagram visualization**
  (`03-analysis-design/01-diagram-konteks-dfd-level-0/'DFD LEVEL 0 Olion SYSTEM.drawio.png'`)

- Standarisasi struktur dokumentasi pada folder:

```
03-analysis-design/
└── 01-diagram-konteks-dfd-level-0/
├── diagram.drawio
├── 'DFD LEVEL 0 Olion SYSTEM.drawio.png'
└── notes.md
```

## Changed

### Context Diagram (DFD Level 0) — Full Refinement

Dilakukan penyempurnaan menyeluruh terhadap artefak Diagram Konteks untuk meningkatkan:

- konsistensi model
- keterbacaan diagram
- ketepatan definisi data flow
- keselarasan dengan Domain Model
- kesiapan ekspansi menuju DFD Level 1

Perubahan utama:

- Penulisan ulang penuh **notes.md** dengan bahasa profesional dan tanpa ambiguitas
- Standarisasi terminologi data flow agar selaras dengan Domain Model
- Penyederhanaan struktur narasi deskripsi aktor eksternal
- Penambahan definisi formal untuk setiap data flow utama
- Revisi struktur dokumentasi agar siap digunakan sebagai referensi teknis lanjutan
- Penyelarasan definisi input/output antar entitas eksternal
- Penegasan batas sistem (system boundary clarity)
- Penyesuaian gaya dokumentasi agar sesuai standar dokumentasi analisis sistem

Perubahan ini meningkatkan kualitas dokumentasi tanpa mengubah aktor utama sistem.

## Fixed

- Inkonsistensi label data flow pada dokumentasi awal
- Ambiguitas pada deskripsi interaksi eksternal
- Ketidaksinkronan istilah antara Domain Model dan Context Diagram
- Struktur narasi yang sebelumnya berpotensi menimbulkan interpretasi ganda

---

# [v0.1.2] — 2026-03-27

## Changed

### Context Diagram — Notification Flow Simplification

Dilakukan penyederhanaan aliran **Notification Message** pada Diagram Konteks (DFD Level 0).

Tujuan perubahan:

- mengurangi redundansi
- meningkatkan konsistensi visual
- menyederhanakan representasi komunikasi sistem

Detail perubahan:

- Penyederhanaan alur **Notification Message**
- Penggabungan beberapa jalur notifikasi serupa
- Penyesuaian label data flow
- Penyelarasan terminologi antar entitas

Perubahan ini tidak mengubah struktur aktor eksternal sistem.

## Fixed

- Penyesuaian minor pada label data flow
- Perbaikan inkonsistensi terminologi

---

# [v0.1.2] — 2026-02-16

## Added

- `01-initiation/02-proposal-proyek.docx`  
  Dokumen proposal proyek OLION untuk kebutuhan akademik.

## Changed

- Tidak ada perubahan struktur signifikan.

## Fixed

- Tidak ada.

---

# [v0.1.1] — 2026-02-03

## Added

- `02-requirements/01-brd-business-requirement-document.md`  
  Business Requirement Document.

- `02-requirements/02-srs-software-requirement-specification.md`  
  Software Requirement Specification.

## Changed

- Revisi minor pada `01-initiation/01-project-charter.md`.

## Fixed

- Tidak ada.

---

# [v0.1.0] — 2026-01-29

## Added

- `01-initiation/01-project-charter.md`  
  Project Charter sebagai fondasi awal proyek.

---

# [v0.0.1] — 2026-01-28

## Added

- `00-index/README.md`
- `00-index/DOCUMENT_MAP.md`
- `00-index/CHANGELOG.md`

- Struktur awal repository dokumentasi OLION.

---

# Closing Note

CHANGELOG ini merupakan rekam jejak resmi evolusi dokumentasi proyek OLION.

Setiap perubahan pada:

- model sistem
- diagram analisis
- struktur data
- arsitektur
- maupun artefak desain

**wajib dicatat** dalam dokumen ini untuk menjaga integritas dokumentasi, mendukung proses audit, dan memastikan kesiapan implementasi teknis pada fase berikutnya.
