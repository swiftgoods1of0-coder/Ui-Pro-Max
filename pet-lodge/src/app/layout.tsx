import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Pet Lodge | Premium Pet Boarding, Daycare & Grooming — Leonardtown, MD',
  description: 'The Pet Lodge offers luxury pet boarding, doggy daycare, professional grooming, and dog walking in Leonardtown, Maryland. Give your pet the vacation they deserve.',
  keywords: 'pet boarding Leonardtown MD, doggy daycare Maryland, dog grooming Leonardtown, pet lodge, dog boarding Southern Maryland, pet care Maryland',
  authors: [{ name: 'The Pet Lodge' }],
  openGraph: {
    title: 'The Pet Lodge — A Vacation Your Pet Will Love',
    description: 'Premium pet boarding, daycare, grooming, and walks in Leonardtown, Maryland.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'The Pet Lodge',
              description: 'Premium pet boarding, daycare, grooming, and dog walking in Leonardtown, Maryland.',
              address: { '@type': 'PostalAddress', addressLocality: 'Leonardtown', addressRegion: 'MD', addressCountry: 'US' },
              telephone: '',
              openingHours: 'Mo-Fr 07:00-18:00 Sa 08:00-17:00',
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
