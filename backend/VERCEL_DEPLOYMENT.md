# Deploy OLION REST API ke Vercel

Dokumen ini men-deploy Express API yang sudah ada sebagai Vercel Function terpisah dari frontend Next.js. Ini jalur migrasi paling rendah risiko untuk mempertahankan seluruh controller, middleware, endpoint, dan Prisma schema tanpa menulis ulang semua route.

## Kenapa backend menjadi project Vercel terpisah?

- Repo memiliki dua aplikasi: `frontend/` (Next.js) dan `backend/` (Express).
- Vercel mendukung Express secara langsung jika aplikasi diekspor dari entrypoint yang dikenali. `src/app.js` sudah mengekspor Express app dengan `module.exports = app`.
- `src/server.js` adalah entrypoint server lokal yang menjalankan HTTP + Socket.IO. Jangan jadikan file itu entrypoint untuk REST Function.
- Socket.IO membutuhkan proses realtime yang persisten. REST API dapat dipindahkan ke Vercel, tetapi fitur signaling panggilan tidak ikut berpindah sebagai bagian dari Function biasa.

Referensi: https://vercel.com/docs/frameworks/backend/express

## 1. Buat project backend di Vercel

1. Import repository `zerocool979/olion` sekali lagi sebagai project baru di Vercel.
2. Set **Root Directory** ke `backend`.
3. Biarkan Framework Preset mendeteksi Express/Other. Jangan gunakan root directory `frontend` untuk project API ini.
4. Jangan isi Output Directory. Gunakan build command default/kosong kecuali Vercel meminta sebaliknya.
5. Pilih Node.js 20 atau versi yang didukung Vercel.

Vercel akan mendeteksi `backend/src/app.js` sebagai Express entrypoint. File tersebut mengekspor app dan tidak memanggil `listen()`, sehingga cocok untuk Function. Jangan mengubahnya menjadi pemanggilan `app.listen()`.

## 2. Environment variables backend

Tambahkan di Vercel → Project → Settings → Environment Variables. Ambil nilai dari secret manager atau environment lama; jangan commit file `.env`.

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string. Gunakan pooled connection string Neon untuk runtime serverless. |
| `JWT_SECRET` | Gunakan nilai secret yang sama dengan backend lama agar token aktif tetap valid. Jangan generate ulang saat cutover. |
| `ALLOWED_ORIGINS` | Origin frontend, misalnya `https://olion.vercel.app` (tanpa trailing slash). |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth yang dipakai aplikasi, jika fitur Google login aktif. |
| `GOOGLE_CLIENT_SECRET` | Isi hanya jika implementasi OAuth backend memang membacanya. |
| `GEMINI_API_KEY` | API key Gemini untuk LIA, jika digunakan. |
| `ANTHROPIC_API_KEY` | API key fallback LIA, jika digunakan. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name untuk lampiran chat. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `TURN_URL` | TURN server untuk WebRTC, jika panggilan digunakan. |
| `TURN_USERNAME` | Kredensial TURN. |
| `TURN_CREDENTIAL` | Kredensial TURN. |

Set variable yang benar-benar dipakai fitur aktif. Jangan pernah menaruh secret pada variable berawalan `NEXT_PUBLIC_`.

## 3. Sambungkan frontend ke API baru

Set di Vercel → project frontend → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://<domain-api-vercel>/api
```

Gunakan domain yang diberikan project backend. Setelah menyimpan variable, redeploy frontend karena `NEXT_PUBLIC_*` dimasukkan saat build.

Kode `frontend/lib/api.js` sudah membaca variable tersebut. `frontend/next.config.js` memiliki rewrite development ke localhost; saat `NEXT_PUBLIC_API_URL` diisi URL absolut, Axios mengarah langsung ke API backend baru.

## 4. Database dan data

- Jangan menjalankan `prisma migrate reset`, `db push --force-reset`, atau seed terhadap database production.
- Jangan mengubah schema hanya untuk deployment.
- Pastikan `DATABASE_URL` menunjuk ke Neon database yang sama dengan aplikasi lama.
- Jalankan migrasi hanya jika ada migration baru yang memang belum diterapkan, setelah backup dan pemeriksaan status migration.
- Tidak perlu membuat database Neon baru jika database yang lama masih tersedia.

## 5. Smoke test setelah deployment

1. Buka `https://<domain-api-vercel>/`. Harus mengembalikan JSON health check `Olion Backend`.
2. Uji `GET https://<domain-api-vercel>/api/stats` (atau endpoint publik yang sudah ada).
3. Uji login melalui frontend menggunakan akun yang sudah ada.
4. Uji `GET /api/auth/me` dengan Bearer token.
5. Uji register hanya dengan akun test, bukan akun production.
6. Periksa Vercel Function Logs dan Neon monitoring bila terjadi 500.

Jangan cutover DNS/API frontend sebelum health check, login, dan endpoint terautentikasi lolos.

## 6. Batasan realtime yang harus ditangani terpisah

`backend/src/server.js` menginisialisasi Socket.IO untuk event panggilan audio/video. Vercel REST Function bukan server Socket.IO persisten. Selain itu `frontend/context/CallContext.js` membangun URL Socket.IO dari `NEXT_PUBLIC_API_URL`, sehingga setelah API diarahkan ke Vercel, koneksi signaling akan mencoba host API Vercel.

Sebelum memindahkan `NEXT_PUBLIC_API_URL`, tentukan endpoint Socket.IO persisten terpisah dan ubah konfigurasi frontend agar REST URL dan Socket URL menjadi dua variable berbeda. Sampai itu tersedia, jangan mengklaim fitur panggilan/realtime telah dimigrasikan. Chat REST (daftar percakapan/pesan) tetap dapat diuji secara terpisah.

## Rollback

Simpan domain backend lama dan nilai environment lama sampai REST API Vercel lolos pengujian. Rollback frontend cukup dengan mengembalikan `NEXT_PUBLIC_API_URL` ke API lama dan redeploy frontend. Jangan menghapus database atau mengubah JWT secret selama cutover.
