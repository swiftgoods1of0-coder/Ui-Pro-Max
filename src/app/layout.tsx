import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Powell Renovations | Premium Contracting, Plumbing & Pressure Washing — York, PA',
  description:
    'Powell Renovations delivers premium home renovations, expert plumbing services, and professional pressure washing across York, PA and surrounding areas. Licensed, insured, and trusted by hundreds of homeowners.',
  keywords: [
    'contractor York PA', 'home renovation York Pennsylvania', 'plumbing York PA',
    'pressure washing York PA', 'general contractor York', 'kitchen remodel York PA',
    'bathroom remodel York PA', 'Powell Renovations',
  ],
  authors: [{ name: 'Powell Renovations' }],
  creator: 'Powell Renovations',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://powellrenovations.com',
    siteName: 'Powell Renovations',
    title: 'Powell Renovations — Premium Craftsmanship in York, PA',
    description:
      'Transforming homes with quality craftsmanship that lasts. General contracting, plumbing, and pressure washing across York County, PA.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Powell Renovations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powell Renovations — Premium Craftsmanship in York, PA',
    description: 'Transforming homes with quality craftsmanship that lasts.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://powellrenovations.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Powell Renovations',
              image: 'https://powellrenovations.com/logo.png',
              '@id': 'https://powellrenovations.com',
              url: 'https://powellrenovations.com',
              telephone: '+1-717-555-0100',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'York',
                addressLocality: 'York',
                addressRegion: 'PA',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 39.9626,
                longitude: -76.7277,
              },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '07:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '14:00' },
              ],
              sameAs: [],
              priceRange: '$$',
              servesCuisine: undefined,
              areaServed: ['York County PA', 'Adams County PA', 'Dauphin County PA', 'Lancaster County PA'],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Renovation & Contracting Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'General Contracting' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Plumbing Services' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pressure Washing' } },
                ],
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
