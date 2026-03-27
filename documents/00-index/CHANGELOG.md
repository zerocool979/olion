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

## Added

- Domain Model inti sistem OLION  
  (`03-analysis-design/01-domain-model.md`)

- Diagram Konteks (DFD Level 0) awal  
  (`03-analysis-design/01-diagram-konteks-dfd-level-0/diagram.png`)

- Dokumentasi penjelasan Diagram Konteks  
  (`03-analysis-design/01-diagram-konteks-dfd-level-0/notes.md`)

## Changed

[2026-03-27] Updated Context Diagram — Modified Data Flow: Notification Message.

Perubahan dilakukan untuk menyederhanakan aliran data notifikasi pada Diagram Konteks (DFD Level 0).  
Alur lama yang memisahkan beberapa jalur pesan notifikasi disederhanakan menjadi satu aliran terpadu untuk meningkatkan konsistensi model dan mengurangi redundansi antar proses eksternal.

Detail perubahan:

- Penyederhanaan alur **Notification Message**
- Penggabungan jalur notifikasi serupa menjadi satu aliran utama
- Penyesuaian label data flow agar konsisten dengan Domain Model
- Penyelarasan terminologi antara entitas eksternal dan sistem inti
- Revisi visual diagram untuk meningkatkan keterbacaan model

Perubahan ini tidak mengubah struktur aktor eksternal, namun mempengaruhi representasi aliran data yang berkaitan dengan notifikasi sistem.

## Fixed

- Penyesuaian minor pada label data flow untuk menjaga konsistensi penamaan antar artefak analisis
- Perbaikan inkonsistensi terminologi antara Domain Model dan Context Diagram

---

# [v0.1.2] - 2026-02-16

## Added

- `01-initiation/02-proposal-proyek.docx`  
  Dokumen proposal proyek OLION untuk kebutuhan akademik.

## Changed

- Tidak ada perubahan struktur signifikan.

## Fixed

- Tidak ada.

---

# [v0.1.1] - 2026-02-03

## Added

- `02-requirements/01-brd-business-requirement-document.md`  
  Dokumen Business Requirement.

- `02-requirements/02-srs-software-requirement-specification.md`  
  Dokumen Software Requirement.

## Changed

- Revisi minor pada `01-initiation/01-project-charter.md`.

## Fixed

- Tidak ada.

---

# [v0.1.0] - 2026-01-29

## Added

- `01-initiation/01-project-charter.md`  
  Dokumen Project Charter sebagai fondasi awal proyek OLION.

## Changed

- Tidak ada.

## Fixed

- Tidak ada.

---

# [v0.1.0] - 2026-01-28

## Added

- `00-index/README.md`
- `00-index/DOCUMENT_MAP.md`
- `00-index/CHANGELOG.md`

- Struktur awal repository dokumentasi OLION.

## Changed

- Tidak ada.

## Fixed

- Tidak ada.

---

# Closing Note

CHANGELOG ini berfungsi sebagai rekam jejak evolusi dokumentasi proyek.  
Setiap pembaruan model analisis, diagram sistem, maupun struktur artefak wajib dicatat untuk menjaga integritas dokumentasi dan mendukung proses audit maupun implementasi teknis di fase berikutnya.
