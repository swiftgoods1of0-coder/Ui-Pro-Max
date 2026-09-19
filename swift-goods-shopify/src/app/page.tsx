import dynamic from 'next/dynamic'
import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Footer from '@/components/ui/Footer'
import { getProducts, getCollections, type ShopifyProduct as FullShopifyProduct } from '@/lib/shopify'
import type { LookbookCollection } from '@/components/sections/Lookbook'

const CollectionGrid = dynamic(() => import('@/components/sections/CollectionGrid'))
const Lookbook       = dynamic(() => import('@/components/sections/Lookbook'))
const SocialProof    = dynamic(() => import('@/components/sections/SocialProof'))
const FinalCTA       = dynamic(() => import('@/components/sections/FinalCTA'))

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

export const revalidate = 60

export const metadata = {
  title: 'Swift Goods | Comfort Is Luxury.',
  description: 'Ultra-premium luxury streetwear. Designed for movement. Built for presence. Swift Goods Clothing Brand.',
  openGraph: {
    title: 'Swift Goods | Comfort Is Luxury.',
    description: 'Ultra-premium luxury streetwear.',
    images: ['/brand/sg-campaign-04.jpeg'],
  },
}

const EXCLUDED_TYPES = new Set(['sweatpants', 'sweatshirt', 'sweatshirts', 'crewneck', 'crewnecks'])

function isExcluded(p: FullShopifyProduct): boolean {
  const type   = (p.productType ?? '').toLowerCase()
  const handle = (p.handle ?? '').toLowerCase()
  const title  = (p.title ?? '').toLowerCase()
  return (
    EXCLUDED_TYPES.has(type) ||
    handle.includes('sweatpant') ||
    handle.includes('sweatshirt') ||
    type.includes('sweatpant') ||
    type.includes('sweatshirt') ||
    handle.includes('giveaway') ||
    title.includes('giveaway')
  )
}

const EXCLUDED_COLLECTION_HANDLES = new Set([
  'sweatpants', 'sweatshirts', 'sweatshirt', 'sweat-pants', 'sweat-shirts',
  'crewnecks', 'crewneck',
])

export default async function Home() {
  const [allProducts, shopifyCollections] = await Promise.all([
    getProducts(250, { sortKey: 'CREATED_AT', reverse: true }),
    getCollections(50),
  ])

  const adaptedProducts = allProducts
    .filter((p) => p.availableForSale && !isExcluded(p))
    .map(adaptProduct)
    .filter((p) => parseFloat(p.price) > 0)

  const featured = adaptedProducts.slice(0, 8)

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c) => {
      const h = c.handle.toLowerCase()
      return (
        c.image?.url &&
        !EXCLUDED_COLLECTION_HANDLES.has(h) &&
        !h.includes('sweatpant') &&
        !h.includes('sweatshirt')
      )
    })
    .slice(0, 6)
    .map((c) => ({
      handle: c.handle,
      title: c.title,
      image: c.image?.url ?? null,
    }))

  return (
    <main style={{ background: '#F8F6F1' }} className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />

      <FeaturedProducts products={featured} />
      <CollectionGrid products={adaptedProducts} />
      <Lookbook collections={lookbookCollections} />
      <SocialProof />
      <FinalCTA />

      <Footer />
    </main>
  )
}
