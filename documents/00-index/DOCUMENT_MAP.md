# DOCUMENT MAP — OLION

Dokumen ini berfungsi sebagai **peta navigasi utama seluruh artefak dokumentasi proyek OLION**. Seluruh tim (atau kontributor individu) diharapkan merujuk dokumen ini sebelum membuat, memperbarui, atau meninjau dokumen lain.

Fungsi utama dokumen ini bukan hanya daftar file, tetapi juga:

* memastikan konsistensi struktur dokumentasi
* memantau progres pengembangan artefak
* menjaga traceability antar fase proyek
* menghindari duplikasi dokumen
* menjadi referensi audit internal

Dokumen ini harus selalu diperbarui setiap kali ada perubahan status signifikan.

---

# Legend Status

| Status   | Makna                                                             |
| -------- | ----------------------------------------------------------------- |
| 🟩 DONE  | Dokumen selesai dan siap digunakan sebagai referensi implementasi |
| 🟨 DRAFT | Dokumen sudah tersedia namun masih dapat direvisi                 |
| 🟥 TODO  | Dokumen belum dibuat                                              |

---

# Snapshot Progres Saat Ini

**Phase Status:** Requirements → Analysis Transition
**Overall Documentation Readiness:** ± 45%
**Risk Level:** Low — struktur stabil, detail lanjutan masih berjalan

Fokus fase saat ini:

* Penyelesaian artefak Analysis & Design
* Penyusunan diagram inti sistem
* Persiapan desain database

---

# Paket Dokumen Inti

Artefak berikut merupakan tulang punggung dokumentasi proyek.

| No | Dokumen                                  | File / Folder                                                  |  Status | Catatan Implementasi                                |
| -: | ---------------------------------------- | -------------------------------------------------------------- | :-----: | --------------------------------------------------- |
| 01 | Project Charter                          | `01-initiation/01-project-charter.md`                          | 🟩 DONE | Scope awal dan visi proyek telah ditetapkan         |
| 02 | Proposal Proyek                          | `01-initiation/02-proposal-proyek.docx`                        | 🟩 DONE | Digunakan untuk kebutuhan akademik/formal           |
| 03 | BRD — Business Requirement Document      | `02-requirements/01-brd-business-requirement-document.md`      | 🟩 DONE | Fokus pada kebutuhan bisnis                         |
| 04 | SRS — Software Requirement Specification | `02-requirements/02-srs-software-requirement-specification.md` | 🟩 DONE | Berisi Functional dan Non-Functional Requirement    |
| 05 | Feature Breakdown — MVP                  | `02-requirements/03-feature-breakdown-mvp.md`                  | 🟩 DONE | Modul dan ruang lingkup MVP telah jelas             |
| 06 | NFR Detail                               | `02-requirements/04-nfr-detail.md`                             | 🟩 DONE | Security, performance, reliability sudah ditetapkan |
| 07 | FR → Module → Endpoint Mapping           | `02-requirements/05-mapping-fr-module-endpoint.md`             | 🟩 DONE | Digunakan sebagai referensi implementasi backend    |

---

# Paket Analysis & Design

Fase ini menerjemahkan requirement menjadi model sistem teknis.

| No | Dokumen                           | File / Folder                                        |  Status | Catatan Implementasi                   |
| -: | --------------------------------- | ---------------------------------------------------- | :-----: | -------------------------------------- |
| 08 | Domain Model                      | `03-analysis-design/01-domain-model.md`              | 🟩 DONE | Entitas inti sistem telah ditentukan   |
| 09 | Diagram Konteks (DFD Level 0)     | `03-analysis-design/01-diagram-konteks-dfd-level-0/` | 🟨 DRAFT | Representasi hubungan eksternal sistem |
| 10 | DFD Level 1                       | `03-analysis-design/02-dfd-level-1/`                 | 🟥 TODO | Detail proses utama sistem             |
| 11 | Use Case Diagram & Spec           | `03-analysis-design/03-usecase/`                     | 🟥 TODO | Menjelaskan interaksi aktor            |
| 12 | Activity Diagram                  | `03-analysis-design/04-activity-diagram/`            | 🟥 TODO | Menggambarkan workflow utama           |
| 13 | ERD — Entity Relationship Diagram | `03-analysis-design/05-erd/`                         | 🟥 TODO | Fondasi desain database                |
| 14 | Database Design                   | `03-analysis-design/06-database-design/`             | 🟥 TODO | Schema, dictionary, normalization      |
| 15 | Sequence Diagram                  | `03-analysis-design/07-sequence-diagram/`            | 🟥 TODO | Flow komunikasi antar komponen         |

---

# Paket Arsitektur Sistem

Fase ini menentukan bagaimana sistem akan dibangun secara teknis.

| No | Dokumen                   | File / Folder                                   |  Status | Catatan Implementasi        |
| -: | ------------------------- | ----------------------------------------------- | :-----: | --------------------------- |
| 16 | System Architecture       | `04-architecture/01-system-architecture.md`     | 🟥 TODO | High-level component design |
| 17 | Deployment Architecture   | `04-architecture/02-deployment-architecture.md` | 🟥 TODO | Infrastruktur runtime       |
| 18 | Security Architecture     | `04-architecture/03-security-architecture.md`   | 🟥 TODO | Model keamanan sistem       |
| 19 | Logging & Monitoring Plan | `04-architecture/04-logging-monitoring-plan.md` | 🟥 TODO | Observability dan audit     |
| 20 | Backup Architecture       | `04-architecture/05-backup-architecture.md`     | 🟥 TODO | Recovery strategy           |

---

# Paket UI / UX

Fokus pada pengalaman pengguna dan navigasi sistem.

| No | Dokumen              | File / Folder                        |  Status | Catatan Implementasi          |
| -: | -------------------- | ------------------------------------ | :-----: | ----------------------------- |
| 21 | Sitemap              | `05-uiux/01-sitemap.md`              | 🟥 TODO | Struktur navigasi halaman     |
| 22 | User Flow            | `05-uiux/02-user-flow.md`            | 🟥 TODO | Alur interaksi pengguna       |
| 23 | Wireframe            | `05-uiux/03-wireframe/`              | 🟥 TODO | Representasi visual layout    |
| 24 | Design System        | `05-uiux/04-design-system.md`        | 🟥 TODO | Standar UI reusable           |
| 25 | Responsive Guideline | `05-uiux/05-responsive-guideline.md` | 🟥 TODO | Standar tampilan multi-device |

---

# Paket API & Integrasi

Digunakan sebagai kontrak komunikasi antara client dan server.

| No | Dokumen                 | File / Folder                          |  Status | Catatan Implementasi          |
| -: | ----------------------- | -------------------------------------- | :-----: | ----------------------------- |
| 26 | API Specification       | `06-api/01-api-specification.md`       | 🟥 TODO | Referensi endpoint utama      |
| 27 | OpenAPI Definition      | `06-api/02-openapi.yaml`               | 🟥 TODO | Dokumentasi formal API        |
| 28 | Postman Collection      | `06-api/03-postman-collection.json`    | 🟥 TODO | Digunakan untuk pengujian API |
| 29 | Error Response Standard | `06-api/04-error-response-standard.md` | 🟥 TODO | Standarisasi error handling   |
| 30 | Auth Strategy JWT       | `06-api/05-auth-strategy-jwt.md`       | 🟥 TODO | Strategi autentikasi          |
| 31 | Rate Limit Policy       | `06-api/06-rate-limit-policy.md`       | 🟥 TODO | Perlindungan terhadap abuse   |

---

# Paket Testing

Berfungsi memastikan kualitas dan stabilitas sistem.

| No | Dokumen                    | File / Folder                                 |  Status | Catatan Implementasi     |
| -: | -------------------------- | --------------------------------------------- | :-----: | ------------------------ |
| 32 | Test Plan                  | `07-testing/01-test-plan.md`                  | 🟥 TODO | Strategi pengujian utama |
| 33 | Test Cases                 | `07-testing/02-test-cases.md`                 | 🟥 TODO | Daftar skenario uji      |
| 34 | Test Report                | `07-testing/03-test-report.md`                | 🟥 TODO | Hasil pengujian sistem   |
| 35 | Security Testing Checklist | `07-testing/04-security-testing-checklist.md` | 🟥 TODO | Checklist keamanan       |

---

# Paket Release & Operasional

Digunakan untuk deployment dan pemeliharaan sistem.

| No | Dokumen                       | File / Folder                                      |  Status | Catatan Implementasi           |
| -: | ----------------------------- | -------------------------------------------------- | :-----: | ------------------------------ |
| 36 | Deployment Guide              | `08-release-ops/01-deployment-guide.md`            | 🟥 TODO | Prosedur deploy sistem         |
| 37 | User Manual                   | `08-release-ops/02-user-manual.md`                 | 🟥 TODO | Panduan penggunaan pengguna    |
| 38 | Admin Manual                  | `08-release-ops/03-admin-manual.md`                | 🟥 TODO | Panduan admin sistem           |
| 39 | Backup & Restore Guide        | `08-release-ops/04-backup-restore-guide.md`        | 🟥 TODO | Recovery data                  |
| 40 | Maintenance & Troubleshooting | `08-release-ops/05-maintenance-troubleshooting.md` | 🟥 TODO | Penanganan masalah operasional |
| 41 | Release Notes                 | `08-release-ops/06-release-notes.md`               | 🟥 TODO | Riwayat rilis sistem           |

---

# Governance Notes

Untuk menjaga kualitas dokumentasi, aturan berikut harus dipatuhi:

1. Setiap perubahan besar wajib dicatat di:

```
00-index/CHANGELOG.md
```

2. Setiap versi dokumentasi harus mengikuti aturan:

```
00-index/VERSIONING.md
```

3. Kontributor baru wajib membaca:

```
00-index/CONTRIBUTING.md
```

4. Dokumen yang berstatus **DONE** tidak boleh diubah tanpa pencatatan revisi.

---

# Closing Statement

DOCUMENT MAP ini bukan sekadar daftar file, tetapi merupakan **alat pengendali konsistensi dokumentasi proyek**. Ketepatan pembaruan status dalam dokumen ini akan menentukan kemudahan tracking, debugging dokumentasi, serta kesiapan proyek untuk fase implementasi berikutnya.
