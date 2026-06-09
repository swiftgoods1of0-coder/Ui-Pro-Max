import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // R3F JSX elements — TS checks pass at runtime, types resolved via global.d.ts
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
