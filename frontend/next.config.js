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
        source:      '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
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


