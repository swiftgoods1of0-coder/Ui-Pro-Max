import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import FloatingCTA from './components/FloatingCTA'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'OTC Fleet Services | Fleet Repair, Maintenance & Trailer Service in Lancaster & Berks County PA',
  description:
    'OTC Fleet Services provides professional fleet repair, DOT inspections, preventative maintenance, mobile service, trailer repair, fleet reporting, vehicle graphics, and snow equipment support for businesses across Lancaster, Berks, and Central Pennsylvania.',
  keywords: [
    'fleet repair Lancaster PA',
    'fleet maintenance Berks County',
    'DOT inspection Lancaster',
    'trailer repair Lancaster',
    'mobile fleet service Central PA',
    'fleet programs Pennsylvania',
    'diesel repair Lancaster',
    'commercial truck repair PA',
    'fleet management Lancaster',
    'OTC Fleet Services',
    'preventative maintenance fleet',
    'Fisher snow plow installation Lancaster',
  ],
  authors: [{ name: 'OTC Fleet Services' }],
  creator: 'OTC Fleet Services',
  publisher: 'Mobiltech Companies LLC',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.otcfleet.com',
    siteName: 'OTC Fleet Services',
    title: 'OTC Fleet Services | Fleet Repair, Maintenance & Trailer Service in Lancaster & Berks County PA',
    description:
      'Professional fleet repair, DOT inspections, preventative maintenance, mobile service, trailer repair, and snow equipment support across Lancaster, Berks, and Central Pennsylvania.',
    images: [
      {
        url: 'https://www.otcfleet.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OTC Fleet Services - Keeping Fleets Moving Across Central PA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTC Fleet Services | Fleet Repair & Maintenance in Central PA',
    description:
      'Professional fleet repair, DOT inspections, preventative maintenance, mobile service, and trailer repair across Lancaster & Berks County PA.',
    images: ['https://www.otcfleet.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.otcfleet.com',
  },
  metadataBase: new URL('https://www.otcfleet.com'),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.otcfleet.com/#business',
      name: 'OTC Fleet Services',
      description:
        'Professional fleet repair, DOT inspections, preventative maintenance, mobile service, trailer repair, fleet reporting, vehicle graphics, and snow equipment support for businesses across Lancaster, Berks, and Central Pennsylvania.',
      url: 'https://www.otcfleet.com',
      telephone: '+17172083600',
      email: 'info@otcfleet.com',
      priceRange: '$$',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.otcfleet.com/logo.png',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '480 Running Pump Road',
        addressLocality: 'Lancaster',
        addressRegion: 'PA',
        postalCode: '17601',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 40.0342,
        longitude: -76.3322,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '07:00',
          closes: '16:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '08:00',
          closes: '12:00',
          description: 'By appointment only',
        },
      ],
      sameAs: [
        'https://www.facebook.com/otcfleet',
        'https://www.instagram.com/otcfleet',
      ],
      hasMap: 'https://maps.google.com/?q=480+Running+Pump+Road+Lancaster+PA+17601',
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 40.0342,
          longitude: -76.3322,
        },
        geoRadius: '100000',
      },
      serviceType: [
        'Fleet Repair',
        'DOT Inspections',
        'Preventative Maintenance',
        'Mobile Service',
        'Trailer Repair',
        'Fleet Reporting',
        'Snow Equipment',
        'Vehicle Graphics',
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.otcfleet.com/#business-berks',
      name: 'OTC Fleet Services - Berks County',
      parentOrganization: { '@id': 'https://www.otcfleet.com/#business' },
      telephone: '+16103744077',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Reading',
        addressRegion: 'PA',
        addressCountry: 'US',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-charcoal-800 text-white font-sans antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}
