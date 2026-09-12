import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen'
import { json } from '@shopify/remix-oxygen'
import { useLoaderData } from '@remix-run/react'
import { lazy, Suspense } from 'react'
import Navigation from '@/components/ui/Navigation'
import GiveawaySection from '@/components/sections/GiveawaySection'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Footer from '@/components/ui/Footer'
import { getProducts, getCollections } from '@/lib/shopify.server'
import type { LookbookCollection } from '@/components/sections/Lookbook'

const CampaignEditorial = lazy(() => import('@/components/sections/CampaignEditorial'))
const BrandStatement    = lazy(() => import('@/components/sections/BrandStatement'))
const AnimatedDivider   = lazy(() => import('@/components/ui/AnimatedDivider'))
const CollectionGrid    = lazy(() => import('@/components/sections/CollectionGrid'))
const WomensSection     = lazy(() => import('@/components/sections/WomensSection'))
const Craftsmanship     = lazy(() => import('@/components/sections/Craftsmanship'))
const SignatureMoment   = lazy(() => import('@/components/sections/SignatureMoment'))
const CinematicStrip    = lazy(() => import('@/components/sections/CinematicStrip'))
const Lookbook          = lazy(() => import('@/components/sections/Lookbook'))
const SocialProof       = lazy(() => import('@/components/sections/SocialProof'))
const ExclusiveAccess   = lazy(() => import('@/components/sections/ExclusiveAccess'))
const ProductDrop       = lazy(() => import('@/components/sections/ProductDrop'))
const FinalCTA          = lazy(() => import('@/components/sections/FinalCTA'))

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
    getProducts(storefront, 50),
    getProducts(storefront, 12, { query: 'tag:women OR tag:womens OR tag:women\'s' }),
    getCollections(storefront, 30),
  ])

  const adaptedProducts = allProducts
    .filter((p: any) => p.availableForSale && !isExcluded(p))
    .map(adaptProduct)
    .filter((p: SectionProduct) => parseFloat(p.price) > 0)

  const featured = adaptedProducts.slice(0, 6)

  const womensProducts = womensRaw
    .filter((p: any) => p.availableForSale)
    .map(adaptProduct)
    .filter((p: SectionProduct) => parseFloat(p.price) > 0)
    .slice(0, 4)

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c: any) => c.image?.url)
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
    <main className="bg-sg-black min-h-screen overflow-x-hidden">
      <GiveawaySection />
      <Navigation />
      <HeroSection />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      <FeaturedProducts products={featured as SectionProduct[]} />

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #0a0a0a)' }} />

      <Suspense fallback={null}>
        <CampaignEditorial />
        <BrandStatement />
        <AnimatedDivider />
        <CollectionGrid products={adaptedProducts as SectionProduct[]} />
        <WomensSection products={womensProducts as SectionProduct[]} />
        <Craftsmanship />
        <SignatureMoment />
        <CinematicStrip />
        <AnimatedDivider />
        <Lookbook collections={lookbookCollections as LookbookCollection[]} />
      </Suspense>

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, #050505, var(--sg-frost, #F7F6F3))' }} />

      <Suspense fallback={null}>
        <SocialProof />
      </Suspense>

      <div className="w-full h-24 md:h-36" style={{ background: 'linear-gradient(to bottom, var(--sg-frost, #F7F6F3), #050505)' }} />

      <Suspense fallback={null}>
        <ExclusiveAccess />
        <ProductDrop />
        <FinalCTA />
      </Suspense>

      <Footer />
    </main>
  )
}
