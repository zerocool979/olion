# OLION Documentation

Repository ini berisi dokumentasi resmi untuk proyek **OLION**.

Dokumentasi ini dipakai sebagai:
- acuan requirement (BRD/SRS)
- acuan desain sistem (DFD, Use Case, Activity, ERD)
- acuan implementasi (API spec, arsitektur)
- acuan testing & release (test plan, deployment guide, manual)

---

## Owner / Maintainer
- Alias: **beel**
- Role: Solo Developer (Fullstack)

---

## Struktur Folder Utama

- `00-index/`  
  Index dokumentasi (peta dokumen, changelog, panduan)

- `01-initiation/`  
  Dokumen inisiasi & proposal

- `02-requirements/`  
  BRD, SRS, NFR, mapping requirement

- `03-analysis-design/`  
  DFD, Use Case, Activity Diagram, ERD, database design

- `04-architecture/`  
  Arsitektur sistem, deployment architecture, security

- `05-uiux/`  
  Sitemap, wireframe, design system

- `06-api/`  
  API spec, Postman collection, OpenAPI/Swagger

- `07-testing/`  
  Test plan, test cases, report, evidence

- `08-release-ops/`  
  Deployment guide, user/admin manual, maintenance

---

## Aturan Penamaan File
- Gunakan format: `NN-nama-dokumen.md`
- Semua dokumen utama harus punya nomor urut agar konsisten.
- Diagram/gambar disimpan di folder masing-masing (png/jpg).
- Jika ada revisi besar: update `00-index/CHANGELOG.md`

---

## Cara Menggunakan Dokumentasi Ini
1. Mulai dari `00-index/DOCUMENT_MAP.md` untuk melihat daftar dokumen & status
2. Lanjut ke `02-requirements/` untuk requirement
3. Pastikan desain sudah final di `03-analysis-design/` sebelum coding besar
4. API contract harus sinkron dengan backend/frontend di `06-api/`
5. Testing dan bukti hasil ada di `07-testing/`
6. Release dan deployment ada di `08-release-ops/`

---

## Status
Dokumentasi ini aktif digunakan dan akan terus diperbarui sesuai perkembangan OLION.
