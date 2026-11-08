/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Aktifkan standalone output untuk Docker deployment
  output: 'standalone',

  async rewrites() {
    // Di development, proxy /api/* ke backend Express
    // Di production (Docker/VPS), Nginx yang menangani routing ini
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000'
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), payment=()' },
          // Start in Report-Only so CSP compatibility can be observed without
          // breaking Google Identity, WebRTC, Cloudinary images, or API calls.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://olion-api.vercel.app wss://olion-api.vercel.app https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com; frame-src https://accounts.google.com https://www.google.com; media-src 'self' blob:; upgrade-insecure-requests",
          },
        ],
      },
    ]
  },

  // Optimalkan image loading
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig
