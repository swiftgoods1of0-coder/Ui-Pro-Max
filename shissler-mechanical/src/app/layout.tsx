import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shissler Mechanical LLC | 24/7 HVAC, Plumbing & Electrical Services',
  description: 'Shissler Mechanical LLC provides professional HVAC, heating, air conditioning, plumbing, electrical, water conditioning, and mechanical contracting services 24 hours a day, 7 days a week for residential and commercial customers.',
  keywords: ['HVAC', 'plumbing', 'electrical', 'water conditioning', 'mechanical contractor', '24/7 emergency service', 'heating', 'air conditioning', 'Shissler Mechanical LLC'],
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Shissler Mechanical LLC',
  description: 'Professional HVAC, heating, air conditioning, plumbing, electrical, water conditioning, and mechanical contracting services available 24/7.',
  openingHours: 'Mo-Su 00:00-23:59',
  serviceType: ['HVAC', 'Heating', 'Air Conditioning', 'Plumbing', 'Electrical', 'Water Conditioning', 'Mechanical Contracting'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-navy-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
