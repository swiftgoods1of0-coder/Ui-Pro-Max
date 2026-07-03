import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import ClientRoot from '@/components/ui/ClientRoot'

// ============================================================
// FONT CONFIGURATION
// ============================================================
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-impact',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

// ============================================================
// METADATA
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL('https://swiftgoodsclothing.com'),
  title: {
    default: 'Swift Goods | Comfort Is Luxury',
    template: '%s | Swift Goods',
  },
  description:
    'Ultra-premium luxury streetwear. Where comfort transcends expectation. Obsidian-grade fabrications, architectural silhouettes, and relentless pursuit of perfection.',
  keywords: [
    'Swift Goods',
    'luxury streetwear',
    'premium clothing',
    'ultra-luxury fashion',
    'designer hoodies',
    'luxury joggers',
    'high fashion',
    'comfort is luxury',
  ],
  authors: [{ name: 'Swift Goods', url: 'https://swiftgoodsclothing.com' }],
  creator: 'Swift Goods',
  publisher: 'Swift Goods',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://swiftgoodsclothing.com',
    siteName: 'Swift Goods',
    title: 'Swift Goods | Comfort Is Luxury',
    description:
      'Ultra-premium luxury streetwear. Where comfort transcends expectation. Obsidian-grade fabrications, architectural silhouettes, and relentless pursuit of perfection.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Swift Goods — Comfort Is Luxury',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swift Goods | Comfort Is Luxury',
    description:
      'Ultra-premium luxury streetwear. Where comfort transcends expectation.',
    images: ['/og-image.jpg'],
    creator: '@swiftgoods',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = [
    cormorantGaramond.variable,
    bebasNeue.variable,
    inter.variable,
  ].join(' ')

  return (
    <html
      lang="en"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className={`${fontVariables} antialiased bg-sg-black text-sg-text`} suppressHydrationWarning>
        <ClientRoot>
          {children}
        </ClientRoot>
      </body>
    </html>
  )
}
