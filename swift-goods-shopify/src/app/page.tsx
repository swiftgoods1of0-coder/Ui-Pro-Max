import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import GiveawaySection from '@/components/sections/GiveawaySection'
import HeroSection from '@/components/sections/HeroSection'
import CampaignEditorial from '@/components/sections/CampaignEditorial'
import SignatureMoment from '@/components/sections/SignatureMoment'
import CinematicStrip from '@/components/sections/CinematicStrip'
import Lookbook from '@/components/sections/Lookbook'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import CollectionGrid from '@/components/sections/CollectionGrid'
import FinalCTA from '@/components/sections/FinalCTA'
import SocialProof from '@/components/sections/SocialProof'
import ProductDrop from '@/components/sections/ProductDrop'
import BrandStatement from '@/components/sections/BrandStatement'
import ExclusiveAccess from '@/components/sections/ExclusiveAccess'
import Craftsmanship from '@/components/sections/Craftsmanship'
import AnimatedDivider from '@/components/ui/AnimatedDivider'
import { getProducts, getCollections, MOCK_PRODUCTS, type ShopifyProduct as FullShopifyProduct } from '@/lib/shopify'
import type { LookbookCollection } from '@/components/sections/Lookbook'

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

async function loadProducts(): Promise<SectionProduct[]> {
  const products = await getProducts(20)
  const adapted = products.map(adaptProduct)

  const seen = new Set<string>()
  return adapted.filter((p) => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    const price = parseFloat(p.price)
    if (!price || price <= 0) return false
    return true
  })
}

export const dynamic = 'force-dynamic'

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
  const [adaptedProducts, shopifyCollections] = await Promise.all([
    loadProducts(),
    getCollections(10),
  ])
  const featured = adaptedProducts.slice(0, 6)

  const HIDDEN_COLLECTIONS = new Set([
    'jackets', 'women', 'womens', "women's", 'hats',
    'swift goods athletic club', '1 of 0', '"1 of 0"',
    'sg diamond', '"sg diamond"', 'university',
  ])

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c) => !HIDDEN_COLLECTIONS.has(c.title.toLowerCase()) && !HIDDEN_COLLECTIONS.has(c.handle))
    .map((c) => ({
      handle: c.handle,
      title: c.title,
      image: c.image?.url ?? null,
    }))

  return (
    <main className="bg-sg-black min-h-screen overflow-x-hidden">
      <GiveawaySection />
      <Navigation />
      <HeroSection />

      {/* Fade: dark → frost */}
      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      {/* Products FIRST — show the goods right after the hero */}
      <FeaturedProducts products={featured} />

      {/* Fade: frost → dark into editorial */}
      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #0a0a0a)' }} />

      <CampaignEditorial />

      <BrandStatement />
      <AnimatedDivider />

      {/* Full catalog — right after the brand story */}
      <CollectionGrid products={adaptedProducts} />

      <Craftsmanship />
      <SignatureMoment />
      <CinematicStrip />
      <AnimatedDivider />

      <Lookbook collections={lookbookCollections} />

      {/* Fade: dark → frost */}
      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      <SocialProof />

      {/* Fade: frost → dark */}
      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #050505)' }} />

      <ExclusiveAccess />
      <ProductDrop />
      <FinalCTA />
      <Footer />
    </main>
  )
}
