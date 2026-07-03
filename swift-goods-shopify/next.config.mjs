/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei'],
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
