/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
  // Proxy Shopify checkout paths transparently so checkout works when the
  // custom domain (swiftgoodsclothingbrand.com) is also the Shopify primary
  // domain. Rewrites are server-side — no browser redirect, no redirect loop.
  async rewrites() {
    return [
      {
        source: '/cart/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/cart/:path*',
      },
      {
        source: '/checkouts/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/checkouts/:path*',
      },
      {
        source: '/payments/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/payments/:path*',
      },
      {
        source: '/services/javascripts/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/services/javascripts/:path*',
      },
    ]
  },
}

export default nextConfig
