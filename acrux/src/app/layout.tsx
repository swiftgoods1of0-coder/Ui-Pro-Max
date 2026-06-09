import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ACRUX — Built To Be Remembered',
  description:
    'Premium web design & digital experience studio. We craft websites that become competitive advantages. Awwwards-level design meets world-class engineering.',
  keywords: ['web design', 'digital experience', 'premium websites', 'UI/UX design', 'luxury web design'],
  openGraph: {
    title: 'ACRUX — Built To Be Remembered',
    description: 'Websites that become competitive advantages.',
    type: 'website',
    images: [{ url: '/logo.png', width: 512, height: 512 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500,400&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise">{children}</body>
    </html>
  )
}
