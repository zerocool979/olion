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
}



