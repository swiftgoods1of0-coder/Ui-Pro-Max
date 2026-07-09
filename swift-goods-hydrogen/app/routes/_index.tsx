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

const CampaignEditorial = lazy(() => import('@/components/sections/CampaignEditorial'))
const BrandStatement    = lazy(() => import('@/components/sections/BrandStatement'))
const AnimatedDivider   = lazy(() => import('@/components/ui/AnimatedDivider'))
const CollectionGrid    = lazy(() => import('@/components/sections/CollectionGrid'))
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

const ALLOWED_HANDLES = new Set([
  'new-arrivals', 'hoodies', 'sweatsuits', '1-of-0',
  'sweatshirts', 'sweatpants', 't-shirts',
])

export const meta: MetaFunction = () => [
  { title: 'Swift Goods | Comfort Is Luxury.' },
  { name: 'description', content: 'Ultra-premium luxury streetwear. Designed for movement. Built for presence. Swift Goods Clothing Brand.' },
  { property: 'og:title', content: 'Swift Goods | Comfort Is Luxury.' },
  { property: 'og:description', content: 'Ultra-premium luxury streetwear.' },
  { property: 'og:image', content: '/brand/sg-campaign-04.jpeg' },
]

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context
  const [allProducts, shopifyCollections] = await Promise.all([
    getProducts(storefront, 20),
    getCollections(storefront, 30),
  ])

  const adaptedProducts = allProducts.map(adaptProduct).filter((p: SectionProduct) => {
    return parseFloat(p.price) > 0
  })

  const featured = adaptedProducts.slice(0, 6)

  const lookbookCollections: LookbookCollection[] = shopifyCollections
    .filter((c: any) => ALLOWED_HANDLES.has(c.handle.toLowerCase()))
    .slice(0, 5)
    .map((c: any) => ({
      handle: c.handle,
      title: c.title,
      image: c.image?.url ?? null,
    }))

  return json({ adaptedProducts, featured, lookbookCollections })
}

export default function Index() {
  const { adaptedProducts, featured, lookbookCollections } = useLoaderData<typeof loader>()

  return (
    <main className="bg-sg-black min-h-screen overflow-x-hidden">
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
