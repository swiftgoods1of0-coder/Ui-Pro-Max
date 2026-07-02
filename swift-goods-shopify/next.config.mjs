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
  // If Shopify returns checkoutUrl with the custom domain, catch it server-side
  // and redirect to the native myshopify.com checkout so it doesn't 404 on Next.js.
  async redirects() {
    return [
      {
        source: '/cart/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/cart/:path*',
        permanent: false,
      },
      {
        source: '/checkouts/:path*',
        destination: 'https://swiftgoodsclothing.myshopify.com/checkouts/:path*',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
