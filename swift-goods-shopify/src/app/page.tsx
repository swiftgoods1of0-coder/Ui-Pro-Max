import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import HeroSection from '@/components/sections/HeroSection'
import BrandStatement from '@/components/sections/BrandStatement'
import CampaignEditorial from '@/components/sections/CampaignEditorial'
import SignatureMoment from '@/components/sections/SignatureMoment'
import Lookbook from '@/components/sections/Lookbook'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import CollectionGrid from '@/components/sections/CollectionGrid'
import { MOCK_PRODUCTS, type ShopifyProduct as FullShopifyProduct } from '@/lib/shopify'

// The section components (FeaturedProducts, CollectionGrid) use a simplified
// product shape with a flat `image` string. We adapt the full Shopify type here
// on the server — zero runtime cost.
interface SectionProduct {
  id: string
  title: string
  handle: string
  price: string
  compareAtPrice?: string
  image: string
  images?: string[]
  category?: string
  isNew?: boolean
  isFeatured?: boolean
}

function adaptProduct(p: FullShopifyProduct): SectionProduct {
  const firstVariant = p.variants.nodes[0]
  const compareAt = firstVariant?.compareAtPrice?.amount ?? undefined
  const isNew      = p.tags.some((t) => ['new-arrival', 'new'].includes(t))
  const isFeatured = p.tags.some((t) => ['featured', 'bestseller', 'limited'].includes(t))

  return {
    id:             p.id,
    title:          p.title,
    handle:         p.handle,
    price:          p.priceRange.minVariantPrice.amount,
    compareAtPrice: compareAt,
    image:          p.featuredImage?.url ?? '',
    images:         p.images.nodes.map((img) => img.url),
    category:       p.productType || undefined,
    isNew,
    isFeatured,
  }
}

const adaptedProducts: SectionProduct[] = MOCK_PRODUCTS.map(adaptProduct)

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
  const featured = adaptedProducts.slice(0, 6)

  return (
    <main className="bg-sg-black min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <BrandStatement />
      <CampaignEditorial />
      <FeaturedProducts products={featured} />
      <SignatureMoment />
      <Lookbook />
      <CollectionGrid products={adaptedProducts} />
      <Footer />
    </main>
  )
}
