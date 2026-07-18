# 🤖 LIA — Chatbot Knowledge Base (RAG) untuk OLION

Fitur tanya-jawab berbasis dokumen knowledge base, terintegrasi langsung ke
backend & frontend OLION yang sudah ada (bukan project terpisah).

## Arsitektur singkat

```
User bertanya → embed pertanyaan (lokal, @xenova/transformers)
             → cari chunk paling mirip (cosine similarity, brute-force di JS)
             → kirim [pertanyaan + chunk relevan] ke Claude API
             → Claude jawab HANYA dari konteks itu → jawaban + sumber
```

- **Embedding**: `@xenova/transformers`, model `Xenova/all-MiniLM-L6-v2` (384 dimensi).
  Jalan 100% lokal di server, **tidak butuh API key apa pun**, tapi model
  (~90MB) di-download otomatis dari Hugging Face saat pertama kali dipakai
  (butuh koneksi internet server saat itu saja, lalu ter-cache).
- **Generation**: Claude API lewat `@anthropic-ai/sdk`, model `claude-sonnet-5`.
  System prompt membatasi jawaban HANYA dari konteks yang di-retrieve — kalau
  info tidak ditemukan, LIA bilang jujur "belum tersedia di knowledge base",
  tidak mengarang.
- **Vector search**: brute-force cosine similarity di JavaScript (bukan
  ekstensi database khusus). Ini pilihan sadar: project ini pakai PostgreSQL
  biasa (bukan pgvector), dan untuk knowledge base skala kecil–menengah
  (ratusan–ribuan chunk) brute-force di JS cukup cepat dan jauh lebih
  sederhana dari sisi operasional (tidak perlu setup ekstensi DB tambahan).
  Kalau nanti KB tumbuh sangat besar, cukup ganti isi
  `backend/src/modules/lia/vectorStore.js` — endpoint & schema tidak perlu
  berubah.

## 1. Setup environment variable

Tambahkan ke `backend/.env` (contoh lengkap ada di `backend/.env.example`):

```bash
ANTHROPIC_API_KEY="sk-ant-..."   # dari https://console.anthropic.com/settings/keys
```

Tanpa key ini, semua endpoint tetap jalan (ingest, list, delete dokumen —
karena itu tidak butuh Claude), **kecuali** `POST /api/lia` yang akan
membalas `503` dengan pesan jelas ("LIA belum dikonfigurasi..."), bukan crash.

Tidak ada environment variable baru yang perlu ditambahkan di frontend.

## 2. Jalankan migration

Migration ini **murni menambah tabel baru** (`Document`, `Chunk`, `ChatLog`)
dan relasi opsional (nullable) ke `User` — tidak mengubah/menghapus apa pun
dari data yang sudah ada, aman dijalankan di database production sekalipun:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 3. Install dependency baru (kalau belum)

```bash
cd backend
npm install
```

Paket baru yang ditambahkan: `@anthropic-ai/sdk`, `@xenova/transformers`,
`multer`, `pdf-parse`.

> ⚠️ **Catatan jujur soal `npm audit`**: `@xenova/transformers` membawa
> dependency `onnxruntime-web` yang punya beberapa advisory (termasuk
> "critical") di rantai dependency-nya (`protobufjs`). Ini isu yang sudah
> lama dikenal di ekosistem transformers.js dan `npm audit fix --force` akan
> **menurunkan versi `@xenova/transformers` ke 2.0.1** (jauh lebih lama, API
> berbeda) — jadi TIDAK saya jalankan otomatis. Risikonya rendah untuk kasus
> pakai ini karena paket ini cuma dipakai untuk meng-embed teks dari admin
> (bukan memproses file model/protobuf dari sumber tidak terpercaya). Kalau
> tim keamanan Anda perlu ini bersih total, alternatifnya adalah pindah ke
> layanan embedding API eksternal — tapi itu melanggar syarat "tanpa API key
> eksternal" yang diminta, jadi saya pertahankan sesuai spesifikasi.

## 4. Ingest dokumen pertama kali

Login dulu sebagai admin untuk dapat token JWT (endpoint ingest butuh role
`ADMIN`):

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@olion.id","password":"password_admin_anda"}'
# salin "token" dari response
```

Lalu ingest dokumen pertama (teks langsung):

```bash
curl -X POST http://localhost:4000/api/ingest/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{
    "title": "FAQ Pendaftaran OLION",
    "content": "OLION adalah forum diskusi tempat pengguna bertanya dan berbagi wawasan. Untuk mendaftar, klik tombol Daftar di halaman utama, isi email dan password, lalu verifikasi. Username otomatis dibuatkan secara acak dan bisa diganti lewat halaman Profil."
  }'
```

Respons berhasil:
```json
{ "success": true, "document": { "id": "...", "title": "FAQ Pendaftaran OLION", "chunkCount": 1, ... } }
```

Atau lewat **panel admin** di browser: buka `/admin/knowledge-base` (link
tersedia juga dari `/admin/dashboard`), isi form, klik "Ingest Dokumen" —
tidak perlu curl sama sekali untuk pemakaian sehari-hari.

## 5. Testing manual tiap endpoint

### Ingest teks (admin only)
```bash
curl -X POST http://localhost:4000/api/ingest/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{"title":"Judul Dokumen","content":"Isi dokumen minimal beberapa kalimat..."}'
```

### Ingest file PDF/TXT (admin only)
```bash
curl -X POST http://localhost:4000/api/ingest/file \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -F "file=@/path/ke/dokumen.pdf" \
  -F "title=Judul Opsional"
```

### List dokumen (admin only)
```bash
curl http://localhost:4000/api/ingest/documents \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### Hapus dokumen (admin only)
```bash
curl -X DELETE http://localhost:4000/api/ingest/documents/DOCUMENT_ID \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### Tanya ke LIA (publik — boleh tanpa token)
```bash
curl -X POST http://localhost:4000/api/lia \
  -H "Content-Type: application/json" \
  -d '{"question":"Bagaimana cara mendaftar di OLION?"}'
```
Respons:
```json
{
  "id": "...",
  "answer": "Untuk mendaftar di OLION, klik tombol Daftar...",
  "sources": [
    { "documentId": "...", "documentTitle": "FAQ Pendaftaran OLION", "excerpt": "...", "score": 0.812 }
  ]
}
```
Kalau `ANTHROPIC_API_KEY` belum diisi → `503` dengan pesan jelas.
Kalau kirim >12 pertanyaan/menit dari IP yang sama → `429` (rate limit).

### Riwayat percakapan (opsional login)
```bash
curl http://localhost:4000/api/lia/history \
  -H "Authorization: Bearer TOKEN_USER"
```
Tanpa header Authorization → balas `{"logs": []}` (guest tidak punya riwayat
tersimpan, karena tidak ada identitas stabil untuk di-scope).

## 6. Widget di frontend

Muncul otomatis sebagai tombol mengambang di pojok kanan bawah **di semua
halaman** (guest maupun `/user/*`) — tidak perlu langkah tambahan, sudah
dipasang di `pages/_app.js`. Klik untuk buka jendela chat; kalau user sedang
login, riwayat 10 percakapan terakhirnya otomatis dimuat saat widget dibuka.

## 7. Panel admin

`/admin/knowledge-base` (hanya untuk role `ADMIN`, link ada di
`/admin/dashboard`): upload dokumen (teks langsung atau file), lihat daftar
dokumen beserta jumlah chunk-nya, dan hapus dokumen.

## ⚠️ Batasan pengujian di sandbox pengembangan ini

Saya (Claude) mengimplementasikan dan memvalidasi kode ini di lingkungan
sandbox dengan akses jaringan terbatas (hanya domain npm/pip terentu) dan
tanpa akses ke database Postgres project ini. Yang **sudah** tervalidasi:
- Sintaks seluruh file backend (`node --check`) ✅
- Build production frontend penuh (`next build`, 42 halaman) ✅
- Logika murni (chunking + overlap, cosine similarity) diuji langsung ✅

Yang **belum** bisa saya uji end-to-end di sini (butuh koneksi ke Postgres
Anda + download model dari Hugging Face + API key Claude asli): alur
ingest→embed→simpan ke DB, alur tanya-jawab penuh, dan download pertama
model embedding. Mohon jalankan alur testing manual di atas setelah deploy
untuk verifikasi end-to-end di lingkungan Anda sendiri.
