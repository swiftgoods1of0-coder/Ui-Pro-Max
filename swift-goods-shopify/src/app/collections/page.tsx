import { getCollections } from '@/lib/shopify'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

export const revalidate = 60

export const metadata = {
  title: 'Collections | Swift Goods',
  description: 'Explore all Swift Goods collections. Comfort is luxury.',
}

const ALLOWED_HANDLES = new Set([
  'new-arrivals',
  'hoodies',
  'sweatsuits',
  '1-of-0',
  'sweatshirts',
  'sweatpants',
  't-shirts',
])

export default async function CollectionsPage() {
  const allCollections = await getCollections(30)
  const collections = allCollections.filter((c) =>
    ALLOWED_HANDLES.has(c.handle.toLowerCase())
  )

  return (
    <main className="bg-[#050505] min-h-screen">
      <Navigation />

      <section className="relative pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <span
              className="block w-12 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            <span
              className="text-[11px] tracking-[0.42em] uppercase"
              style={{
                color: '#c9a84c',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              SHOP BY COLLECTION
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: '#f5f5f5',
              lineHeight: 0.95,
              letterSpacing: '0.04em',
              margin: 0,
              textShadow: '0 4px 40px rgba(0,0,0,0.3)',
            }}
          >
            ALL COLLECTIONS
          </h1>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <span
                className="text-[11px] tracking-[0.4em] uppercase"
                style={{ color: '#555', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
              >
                No collections yet
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((collection, idx) => {
                const isWide = idx === 0
                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.handle}`}
                    className={`group relative overflow-hidden block ${
                      isWide ? 'md:col-span-2' : ''
                    }`}
                    style={{
                      height: isWide ? 'clamp(250px, 45vw, 550px)' : 'clamp(220px, 40vw, 450px)',
                      background: '#111',
                      transition: 'box-shadow 0.5s ease',
                    }}
                  >
                    {collection.image && (
                      <Image
                        src={collection.image.url}
                        alt={collection.title}
                        fill
                        sizes={isWide ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}

                    <div
                      className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                      style={{
                        opacity: 0.6,
                        background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 40%, transparent 70%)',
                      }}
                    />

                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ border: '1px solid rgba(201,168,76,0.3)' }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                      <span
                        className="block mb-2"
                        style={{
                          fontFamily: 'var(--font-body, Inter, sans-serif)',
                          fontSize: '10px',
                          letterSpacing: '0.35em',
                          color: 'rgba(201,168,76,0.6)',
                        }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h2
                        style={{
                          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                          fontSize: isWide ? 'clamp(2rem, 3.5vw, 3rem)' : 'clamp(1.5rem, 2.5vw, 2.2rem)',
                          color: '#f5f5f5',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          margin: 0,
                          lineHeight: 1.2,
                          textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                        }}
                      >
                        {collection.title}
                      </h2>
                      {collection.description && (
                        <p
                          className="mt-2 max-w-md"
                          style={{
                            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                            fontSize: '1rem',
                            fontStyle: 'italic',
                            color: 'rgba(245,245,245,0.5)',
                            lineHeight: 1.5,
                          }}
                        >
                          {collection.description.slice(0, 120)}
                          {collection.description.length > 120 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
