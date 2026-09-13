import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen'
import { json } from '@shopify/remix-oxygen'
import { useLoaderData } from '@remix-run/react'
import { lazy, Suspense } from 'react'
import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Footer from '@/components/ui/Footer'
import { getProducts, getCollections } from '@/lib/shopify.server'
import type { LookbookCollection } from '@/components/sections/Lookbook'

const CollectionGrid = lazy(() => import('@/components/sections/CollectionGrid'))
const WomensSection  = lazy(() => import('@/components/sections/WomensSection'))
const Lookbook       = lazy(() => import('@/components/sections/Lookbook'))
const SocialProof    = lazy(() => import('@/components/sections/SocialProof'))
const FinalCTA       = lazy(() => import('@/components/sections/FinalCTA'))

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

function adaptProduct(p: any): SectionProduct {
  const firstVariant = p.variants.nodes[0]
  const compareAt = firstVariant?.compareAtPrice?.amount ?? undefined
  const isNew      = p.tags.some((t: string) => ['new-arrival', 'new'].includes(t))
  const isFeatured = p.tags.some((t: string) => ['featured', 'bestseller', 'limited'].includes(t))
  return {
    id:             p.id,
    title:          p.title,
    handle:         p.handle,
    price:          p.priceRange.minVariantPrice.amount,
    compareAtPrice: compareAt,
    image:          p.featuredImage?.url ?? '',
    images:         p.images.nodes.map((img: any) => img.url),
    category:       p.productType || undefined,
    isNew,
    isFeatured,
  }
}

export const meta: MetaFunction = () => [
  { title: 'Swift Goods | Comfort Is Luxury.' },
  { name: 'description', content: 'Ultra-premium luxury streetwear. Designed for movement. Built for presence. Swift Goods Clothing Brand.' },
  { property: 'og:title', content: 'Swift Goods | Comfort Is Luxury.' },
  { property: 'og:description', content: 'Ultra-premium luxury streetwear.' },
  { property: 'og:image', content: '/brand/sg-campaign-04.jpeg' },
]

const EXCLUDED_TYPES = new Set(['sweatpants', 'sweatshirt', 'sweatshirts', 'crewneck', 'crewnecks'])

function isExcluded(p: any): boolean {
  const type = (p.productType ?? '').toLowerCase()
  const handle = (p.handle ?? '').toLowerCase()
  return (
    EXCLUDED_TYPES.has(type) ||
    handle.includes('sweatpant') ||
    handle.includes('sweatshirt') ||
    type.includes('sweatpant') ||
    type.includes('sweatshirt')
  )
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context
  const [allProducts, womensRaw, shopifyCollections] = await Promise.all([
    getProducts(storefront, 250, { sortKey: 'CREATED_AT', reverse: true }),
    getProducts(storefront, 20, { query: 'tag:women OR tag:womens OR tag:women\'s', sortKey: 'CREATED_AT', reverse: true }),
    getCollections(storefront, 50),
  ])

  const adaptedProducts = allProducts
    .filter((p: any) => p.availableForSale && !isExcluded(p))
    .map(adaptProduct)
    .filter((p: SectionProduct) => parseFloat(p.price) > 0)

  const featured = adaptedProducts.slice(0, 8)

  const womensProducts = womensRaw
    .filter((p: any) => p.availableForSale)
    .map(adaptProduct)
    .filter((p: SectionProduct) => parseFloat(p.price) > 0)
    .slice(0, 4)

  const EXCLUDED_COLLECTION_HANDLES = new Set([
    'sweatpants', 'sweatshirts', 'sweatshirt', 'sweat-pants', 'sweat-shirts',
    'crewnecks', 'crewneck',
  ])

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c: any) => {
      const h = c.handle.toLowerCase()
      return (
        c.image?.url &&
        !EXCLUDED_COLLECTION_HANDLES.has(h) &&
        !h.includes('sweatpant') &&
        !h.includes('sweatshirt')
      )
    })
    .slice(0, 6)
    .map((c: any) => ({
      handle: c.handle,
      title: c.title,
      image: c.image?.url ?? null,
    }))

  return json({ adaptedProducts, featured, womensProducts, lookbookCollections })
}

export default function Index() {
  const { adaptedProducts, featured, womensProducts, lookbookCollections } = useLoaderData<typeof loader>()

  return (
    <main style={{ background: '#F8F6F1' }} className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />

      <Suspense fallback={null}>
        <FeaturedProducts products={featured as SectionProduct[]} />
        <CollectionGrid products={adaptedProducts as SectionProduct[]} />
        <WomensSection products={womensProducts as SectionProduct[]} />
        <Lookbook collections={lookbookCollections as LookbookCollection[]} />
        <SocialProof />
        <FinalCTA />
      </Suspense>

      <Footer />
    </main>
  )
}
