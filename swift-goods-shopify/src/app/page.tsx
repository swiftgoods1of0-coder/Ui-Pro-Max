import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BrandStatement from '@/components/sections/BrandStatement'
import SignatureMoment from '@/components/sections/SignatureMoment'
import Lookbook from '@/components/sections/Lookbook'
import { MOCK_PRODUCTS } from '@/lib/shopify'

const FeaturedProducts = dynamic(
  () => import('@/components/sections/FeaturedProducts'),
  { ssr: false }
)

const CollectionGrid = dynamic(
  () => import('@/components/sections/CollectionGrid'),
  { ssr: false }
)

export const metadata = {
  title: 'Swift Goods | Comfort Is Luxury.',
  description:
    'Ultra-premium luxury streetwear. Designed for movement. Built for presence. Swift Goods Clothing Brand.',
  openGraph: {
    title: 'Swift Goods | Comfort Is Luxury.',
    description: 'Ultra-premium luxury streetwear.',
    images: ['/brand/sg-campaign-04.jpeg'],
  },
}

export default function Home() {
  const featured = MOCK_PRODUCTS.slice(0, 6)

  return (
    <main className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <BrandStatement />
      <FeaturedProducts products={featured} />
      <SignatureMoment />
      <Lookbook />
      <CollectionGrid products={MOCK_PRODUCTS} />
      <Footer />
    </main>
  )
}
