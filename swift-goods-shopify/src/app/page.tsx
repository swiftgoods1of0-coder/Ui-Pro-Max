import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Footer from '@/components/ui/Footer'
import { getProducts, getCollections, type ShopifyProduct as FullShopifyProduct } from '@/lib/shopify'
import type { LookbookCollection } from '@/components/sections/Lookbook'

// Below-fold sections — lazy loaded so they don't block first paint
const CampaignEditorial = dynamic(() => import('@/components/sections/CampaignEditorial'))
const BrandStatement    = dynamic(() => import('@/components/sections/BrandStatement'))
const AnimatedDivider   = dynamic(() => import('@/components/ui/AnimatedDivider'))
const CollectionGrid    = dynamic(() => import('@/components/sections/CollectionGrid'))
const Craftsmanship     = dynamic(() => import('@/components/sections/Craftsmanship'))
const SignatureMoment   = dynamic(() => import('@/components/sections/SignatureMoment'))
const CinematicStrip    = dynamic(() => import('@/components/sections/CinematicStrip'))
const Lookbook          = dynamic(() => import('@/components/sections/Lookbook'))
const SocialProof       = dynamic(() => import('@/components/sections/SocialProof'))
const ExclusiveAccess   = dynamic(() => import('@/components/sections/ExclusiveAccess'))
const ProductDrop       = dynamic(() => import('@/components/sections/ProductDrop'))
const FinalCTA          = dynamic(() => import('@/components/sections/FinalCTA'))

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

// Cache pages at the edge for 60 seconds — massive speed boost vs force-dynamic
// (which hit the Shopify API fresh on every single request)
export const revalidate = 60

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

export default async function Home() {
  const [allProducts, shopifyCollections] = await Promise.all([
    getProducts(20),
    getCollections(30),
  ])

  const adaptedProducts = allProducts.map(adaptProduct).filter((p) => {
    const price = parseFloat(p.price)
    return price > 0
  })

  const featured = adaptedProducts.slice(0, 6)

  const ALLOWED_HANDLES = new Set([
    'new-arrivals',
    'hoodies',
    'sweatsuits',
    '1-of-0',
    'sweatshirts',
    'sweatpants',
    't-shirts',
  ])

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c) => ALLOWED_HANDLES.has(c.handle.toLowerCase()))
    .slice(0, 5)
    .map((c) => ({
      handle: c.handle,
      title: c.title,
      image: c.image?.url ?? null,
    }))

  return (
    <main className="bg-sg-black min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      <FeaturedProducts products={featured} />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #0a0a0a)' }} />

      <CampaignEditorial />
      <BrandStatement />
      <AnimatedDivider />
      <CollectionGrid products={adaptedProducts} />
      <Craftsmanship />
      <SignatureMoment />
      <CinematicStrip />
      <AnimatedDivider />
      <Lookbook collections={lookbookCollections} />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      <SocialProof />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #050505)' }} />

      <ExclusiveAccess />
      <ProductDrop />
      <FinalCTA />
      <Footer />
    </main>
  )
}
