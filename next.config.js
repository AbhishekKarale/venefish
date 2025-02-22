/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  experimental: {
    scrollRestoration: true, // Restore scroll position on back navigation
  },
}

module.exports = nextConfig
