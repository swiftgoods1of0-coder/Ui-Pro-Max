import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen'
import { json } from '@shopify/remix-oxygen'
import { useLoaderData } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { getCollection } from '@/lib/shopify.server'
import { formatPrice } from '@/lib/shopify'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.collection) return [{ title: 'Collection Not Found' }]
  const c = data.collection
  return [
    { title: `${c.title} | Swift Goods` },
    { name: 'description', content: c.seo?.description || c.description?.slice(0, 160) || '' },
    { property: 'og:title', content: c.title },
    { property: 'og:description', content: c.description?.slice(0, 160) || '' },
    ...(c.image ? [{ property: 'og:image', content: c.image.url }] : []),
  ]
}

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params
  if (!handle) throw new Response('Not Found', { status: 404 })
  const collection = await getCollection(context.storefront, handle, 50)
  if (!collection) throw new Response('Not Found', { status: 404 })

  const seen = new Set<string>()
  const products = collection.products.nodes.filter((p: any) => {
    if (seen.has(p.handle)) return false
    seen.add(p.handle)
    const price = parseFloat(p.priceRange.minVariantPrice.amount)
    return price > 0
  })

  return json({ collection, products })
}

export default function CollectionPage() {
  const { collection, products } = useLoaderData<typeof loader>() as { collection: any; products: any[] }

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {collection.image && (
          <div className="absolute inset-0">
            <img
              src={collection.image.url}
              alt={collection.title}
              fetchPriority="high"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.6) 70%, rgba(5,5,5,0.4) 100%)' }} />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <Link to="/" className="text-[11px] tracking-[0.3em] uppercase transition-colors hover:text-[#c9a84c]" style={{ color: '#666', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
              HOME
            </Link>
            <span style={{ color: '#333' }}>/</span>
            <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
              {collection.title}
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3rem, 8vw, 7rem)', color: '#f5f5f5', lineHeight: 0.95, letterSpacing: '0.04em', margin: 0, textShadow: '0 4px 40px rgba(0,0,0,0.3)' }}>
            {collection.title}
          </h1>

          {collection.description && (
            <p className="mt-6 max-w-lg" style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontStyle: 'italic', color: 'rgba(245,245,245,0.6)', lineHeight: 1.6 }}>
              {collection.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="block w-10 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span className="text-[11px] tracking-[0.35em] uppercase" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
              {products.length} {products.length === 1 ? 'PIECE' : 'PIECES'}
            </span>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="relative pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <span className="text-[11px] tracking-[0.4em] uppercase" style={{ color: '#555', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                No products in this collection yet
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product: any, index: number) => (
                <Link
                  key={product.id}
                  to={`/products/${product.handle}`}
                  className="group relative overflow-hidden block"
                  style={{ minHeight: 'clamp(250px, 50vw, 420px)', background: '#111', transition: 'box-shadow 0.5s ease' }}
                >
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.title}
                      loading={index < 6 ? 'eager' : 'lazy'}
                      className="object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )}

                  <div className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-80" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.2) 55%, transparent 100%)' }} />
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{ border: '1px solid rgba(201,168,76,0.22)' }} />

                  {product.tags.some((t: string) => ['new-arrival', 'new'].includes(t)) && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ background: '#c9a84c', color: '#050505', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                        NEW
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                    {product.productType && (
                      <p className="mb-1 text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(201,168,76,0.55)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                        {product.productType}
                      </p>
                    )}
                    <h3 className="text-base md:text-lg leading-tight mb-2" style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', color: '#f5f5f5' }}>
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="tracking-wider" style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.25rem', background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {formatPrice(product.priceRange.minVariantPrice.amount)}
                      </span>
                      <div className="ml-auto flex items-center gap-1 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0" style={{ color: '#c9a84c' }}>
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                          <path d="M0 4H14M14 4L11 1M14 4L11 7" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
