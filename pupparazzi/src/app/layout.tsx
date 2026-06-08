import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pupparazzi Dog & Cat Grooming | Professional Pet Grooming',
  description: 'Professional dog and cat grooming services. Full grooming, pet haircuts, and personalized care. Call or text (704) 267-8982 to schedule your appointment.',
  keywords: 'dog grooming, cat grooming, pet grooming, full groom, pet haircut, bath and groom, professional grooming',
  openGraph: {
    title: 'Pupparazzi Dog & Cat Grooming | Professional Pet Grooming',
    description: 'Top of the line grooming facility. Call or text to book today.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Pupparazzi Dog & Cat Grooming',
          description: 'Top of the line professional dog and cat grooming.',
          telephone: '(704) 267-8982',
          openingHours: 'Mo-Fr 07:30-17:30',
          priceRange: '$$',
        }) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
