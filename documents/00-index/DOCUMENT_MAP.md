# DOCUMENT MAP — OLION

Dokumen ini adalah peta utama (single source of truth) untuk seluruh dokumentasi proyek **OLION**.

---

## Legend Status
- 🟩 DONE  : final / siap dipakai
- 🟨 DRAFT : masih bisa berubah
- 🟥 TODO  : belum dibuat

---

## Paket Dokumen Final

| No | Dokumen | File/Folder | Status | Catatan |
|---:|--------|-------------|:------:|--------|
| 01 | Project Charter | `01-initiation/01-project-charter.md` | 🟥 TODO | Ringkas 2–5 halaman |
| 02 | Proposal Proyek | `01-initiation/02-proposal-proyek.docx` | 🟥 TODO | Format akademik |
| 03 | BRD (Business Requirement Document) | `02-requirements/01-brd-business-requirement-document.md` | 🟥 TODO | Bahasa bisnis/non-teknis |
| 04 | SRS (Software Requirement Specification) | `02-requirements/02-srs-software-requirement-specification.md` | 🟥 TODO | FR + NFR + prioritas |
| 05 | Feature Breakdown + MVP | `02-requirements/03-feature-breakdown-mvp.md` | 🟥 TODO | Modul + DoD |
| 06 | Diagram Konteks (DFD Level 0) | `03-analysis-design/01-diagram-konteks-dfd-level-0/` | 🟥 TODO | `diagram.png` + `notes.md` |
| 07 | DFD Level 1 | `03-analysis-design/02-dfd-level-1/` | 🟥 TODO | proses utama |
| 08 | Use Case Diagram + Spec | `03-analysis-design/03-usecase/` | 🟥 TODO | diagram + spesifikasi |
| 09 | Activity Diagram | `03-analysis-design/04-activity-diagram/` | 🟥 TODO | 5 activity wajib |
| 10 | ERD | `03-analysis-design/05-erd/` | 🟥 TODO | `erd.png` + notes |
| 11 | Database Design Document | `03-analysis-design/06-database-design/` | 🟥 TODO | schema + dictionary |
| 12 | System Architecture Document | `04-architecture/01-system-architecture.md` | 🟥 TODO | high level + komponen |
| 13 | UI/UX Design Document | `05-uiux/` | 🟥 TODO | sitemap + wireframe + design system |
| 14 | API Documentation | `06-api/` | 🟥 TODO | spec + postman + swagger |
| 15 | Testing Document | `07-testing/` | 🟥 TODO | plan + cases + report |
| 16 | Deployment & Manual | `08-release-ops/` | 🟥 TODO | deploy + user/admin manual |

---

## Dokumen Tambahan
| Dokumen | Lokasi | Status | Catatan |
|--------|--------|:------:|--------|
| NFR Detail | `02-requirements/04-nfr-detail.md` | 🟥 TODO | security/performance/usability |
| Mapping FR → Module → Endpoint | `02-requirements/05-mapping-fr-module-endpoint.md` | 🟥 TODO | sinkron backend/frontend |
| Deployment Architecture | `04-architecture/02-deployment-architecture.md` | 🟥 TODO | Nginx/Docker/PM2 |
| Security Architecture | `04-architecture/03-security-architecture.md` | 🟥 TODO | OWASP & JWT |
| Logging & Monitoring Plan | `04-architecture/04-logging-monitoring-plan.md` | 🟥 TODO | audit trail |
| Error Response Standard | `06-api/04-error-response-standard.md` | 🟥 TODO | standar error |
| Auth Strategy JWT | `06-api/05-auth-strategy-jwt.md` | 🟥 TODO | token, refresh, expiry |
| Security Testing Checklist | `07-testing/04-security-testing-checklist.md` | 🟥 TODO | checklist keamanan |
| Backup & Restore Guide | `08-release-ops/04-backup-restore-guide.md` | 🟥 TODO | recovery |
| Maintenance & Troubleshooting | `08-release-ops/05-maintenance-troubleshooting.md` | 🟥 TODO | ops harian |

---

## Notes
- Semua perubahan besar wajib dicatat di `00-index/CHANGELOG.md`
- Status dokumen harus selalu up-to-date agar tracking rapi.
