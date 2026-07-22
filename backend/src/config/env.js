require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Client ID OAuth Google (dari Google Cloud Console → Credentials).
  // Harus SAMA dengan NEXT_PUBLIC_GOOGLE_CLIENT_ID di frontend/.env.local —
  // dipakai untuk memverifikasi bahwa ID token berasal dari aplikasi ini.
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  // API key Claude (Anthropic) — dipakai fitur chatbot LIA (RAG knowledge
  // base) untuk generation jawaban. Ambil dari https://console.anthropic.com
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  // API key Gemini (Google) — dipakai LIA sebagai model UTAMA (default).
  // Ambil dari https://aistudio.google.com/apikey. Kalau Gemini gagal
  // merespons (error/timeout) atau key ini kosong, LIA otomatis jatuh ke
  // Claude (ANTHROPIC_API_KEY) sebagai cadangan — lihat modules/lia/llm.js.
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  // Cloudinary — penyimpanan foto/file lampiran chat. WAJIB pakai storage
  // eksternal seperti ini (bukan disk lokal server) karena banyak host
  // gratis (Railway dst.) punya filesystem EPHEMERAL — file lokal hilang
  // tiap redeploy/restart. Daftar gratis di https://cloudinary.com (tanpa
  // kartu), ambil 3 nilai ini dari Dashboard.
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  // TURN server — dibutuhkan supaya panggilan audio/video tetap nyambung
  // walau salah satu pihak di jaringan NAT/firewall "rewel" (WiFi
  // kantor/kampus dsb). Daftar gratis (500MB/bulan tanpa kartu) di
  // https://www.metered.ca/tools/openrelay — ambil dari dashboard mereka.
  TURN_URL: process.env.TURN_URL,
  TURN_USERNAME: process.env.TURN_USERNAME,
  TURN_CREDENTIAL: process.env.TURN_CREDENTIAL,
}



