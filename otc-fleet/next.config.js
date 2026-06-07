/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['otcfleet.com', 'keystonetrailers.com', 'fleetgraphixpa.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
