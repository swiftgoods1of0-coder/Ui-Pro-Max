import { useState } from 'react'
import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

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

interface CollectionGridProps {
  products: SectionProduct[]
}

type FilterOption = 'ALL' | 'TOPS' | 'BOTTOMS' | 'SETS'

const FILTERS: FilterOption[] = ['ALL', 'TOPS', 'BOTTOMS', 'SETS']

const CATEGORY_MAP: Record<FilterOption, string[]> = {
  ALL:     [],
  TOPS:    ['Hoodie', 'Crewneck', 'T-Shirt', 'Jacket', 'hoodie', 'crewneck', 'tee', 'jacket', 'bomber'],
  BOTTOMS: ['Pants', 'Jogger', 'pants', 'jogger', 'cargo', 'Sweatpants', 'sweatpants', 'Shorts', 'shorts'],
  SETS:    ['Set', 'set', 'Sweatsuit', 'sweatsuit'],
}

function productMatchesFilter(product: SectionProduct, filter: FilterOption): boolean {
  if (filter === 'ALL') return true
  const target = CATEGORY_MAP[filter]
  const cat = (product.category ?? '').toLowerCase()
  const title = product.title.toLowerCase()
  return target.some((t) => cat.includes(t.toLowerCase()) || title.includes(t.toLowerCase()))
}

export default function CollectionGrid({ products }: CollectionGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL')
  const filteredProducts = products.filter((p) => productMatchesFilter(p, activeFilter))

  return (
    <section id="shop" className="relative pt-28 pb-24 overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '-8%', width: '45%', height: '45%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="header-el inline-flex items-center gap-4 mb-4">
              <span className="block w-10 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
              <span className="text-[11px] tracking-[0.42em] uppercase" style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}>
                SHOP ALL
              </span>
            </div>
            <SplitTextReveal text="THE FULL EDIT" tag="h2" className="header-el leading-none tracking-widest" style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', color: '#f5f5f5', textShadow: '0 4px 40px rgba(0,0,0,0.3)' }} />
          </div>

          <div className="header-el flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className="px-5 py-2 text-[11px] tracking-[0.24em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontWeight: 500,
                    background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
                    border: isActive ? '1px solid rgba(201,168,76,0.7)' : '1px solid rgba(255,255,255,0.08)',
                    color: isActive ? '#c9a84c' : '#555555',
                    boxShadow: isActive ? '0 0 20px rgba(201,168,76,0.08)' : 'none',
                  }}
                  aria-pressed={isActive}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={`${product.id}-${activeFilter}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4', background: '#111111', transition: 'box-shadow 0.5s ease' }}
              whileHover={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 25px rgba(201,168,76,0.06)' }}
            >
              <Link to={`/products/${product.handle}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading={index < 6 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="object-contain transition-all duration-700 ease-out group-hover:scale-105"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  />
                  {product.images && product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${product.title} — alternate`}
                      loading="lazy"
                      decoding="async"
                      className="object-contain transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                    />
                  )}
                </div>

                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 35%, rgba(5,5,5,0.1) 60%, transparent 100%)' }} />

                {product.isNew && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ background: '#c9a84c', color: '#050505', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                      NEW
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ border: '1px solid rgba(201,168,76,0.22)' }} />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                  {product.category && (
                    <p className="mb-1 text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                      {product.category}
                    </p>
                  )}
                  <h3 className="text-base md:text-lg leading-tight mb-2" style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', color: '#f5f5f5', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="tracking-wider" style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.25rem', background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      ${product.price}
                    </span>
                    {product.compareAtPrice && (
                      <span className="line-through text-sm" style={{ color: '#666', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                        ${product.compareAtPrice}
                      </span>
                    )}
                    <div className="ml-auto flex items-center gap-1 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0" style={{ color: '#c9a84c' }}>
                      <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                        <path d="M0 4H14M14 4L11 1M14 4L11 7" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-[11px] tracking-[0.4em] uppercase" style={{ color: '#555555', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
              No products in this category
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
