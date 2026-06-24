'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '@/components/ui/SplitTextReveal'
import MouseSpotlight from '@/components/ui/MouseSpotlight'

interface ShopifyProduct {
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
  products: ShopifyProduct[]
}

type FilterOption = 'ALL' | 'TOPS' | 'BOTTOMS' | 'SETS'

const FILTERS: FilterOption[] = ['ALL', 'TOPS', 'BOTTOMS', 'SETS']

const CATEGORY_MAP: Record<FilterOption, string[]> = {
  ALL:     [],
  TOPS:    ['Hoodie', 'Crewneck', 'T-Shirt', 'Jacket', 'hoodie', 'crewneck', 'tee', 'jacket', 'bomber'],
  BOTTOMS: ['Pants', 'Jogger', 'pants', 'jogger', 'cargo'],
  SETS:    ['Set', 'set'],
}

function productMatchesFilter(product: ShopifyProduct, filter: FilterOption): boolean {
  if (filter === 'ALL') return true
  const target = CATEGORY_MAP[filter]
  const cat = (product.category ?? '').toLowerCase()
  return target.some((t) => cat.includes(t.toLowerCase()))
}

export default function CollectionGrid({ products }: CollectionGridProps) {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<FilterOption>('ALL')

  const filteredProducts = products.filter((p) => productMatchesFilter(p, activeFilter))

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Header stagger animate on scroll
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll<HTMLElement>('.header-el')
        gsap.from(
          els,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <MouseSpotlight color="rgba(201,168,76,0.035)" size={550}>
    <section
      ref={sectionRef}
      id="shop"
      className="relative pt-32 pb-16 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          left: '-8%',
          width: '45%',
          height: '45%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* Asymmetric header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
          {/* Left: label + heading */}
          <div>
            <div className="header-el inline-flex items-center gap-4 mb-4">
              <span
                className="block w-10 h-px"
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
                ALL PRODUCTS
              </span>
            </div>
            <SplitTextReveal
              text="THE FULL EDIT"
              tag="h2"
              className="header-el leading-none tracking-widest"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                color: '#f5f5f5',
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Right: filter chips */}
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
                    border: isActive
                      ? '1px solid rgba(201,168,76,0.7)'
                      : '1px solid rgba(255,255,255,0.08)',
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

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => {
            // Indices 0 and 5 are large (col-span-2 row-span-2)
            const isLarge = index === 0 || index === 5
            const imageUrl = product.image

            return (
              <motion.div
                key={`${product.id}-${activeFilter}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative overflow-hidden cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : 'col-span-1'
                }`}
                style={{
                  minHeight: isLarge ? '520px' : '280px',
                  background: '#111111',
                  transition: 'box-shadow 0.5s ease',
                }}
                whileHover={{
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 25px rgba(201,168,76,0.06)',
                }}
                data-cursor="product"
              >
                <Link href={`/products/${product.handle}`} className="block w-full h-full">
                  {/* Product image with hover swap */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      sizes={isLarge ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
                      className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-110"
                      style={{ opacity: product.images && product.images.length > 1 ? undefined : 1 }}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      unoptimized
                    />
                    {product.images && product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={`${product.title} — alternate`}
                        fill
                        sizes={isLarge ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
                        className="object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
                        loading="lazy"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500 opacity-70 group-hover:opacity-90"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 55%, transparent 100%)',
                    }}
                  />

                  {/* NEW badge */}
                  {product.isNew && (
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="px-3 py-1 text-[10px] tracking-[0.22em] uppercase font-semibold"
                        style={{
                          background: '#c9a84c',
                          color: '#050505',
                          fontFamily: 'var(--font-body, Inter, sans-serif)',
                        }}
                      >
                        NEW
                      </span>
                    </div>
                  )}

                  {/* Gold hover border */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100"
                    style={{ border: '1px solid rgba(201,168,76,0.22)' }}
                  />

                  {/* Product info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                    {product.category && (
                      <p
                        className="mb-1 text-[10px] tracking-[0.3em] uppercase"
                        style={{
                          color: 'rgba(201,168,76,0.55)',
                          fontFamily: 'var(--font-body, Inter, sans-serif)',
                        }}
                      >
                        {product.category}
                      </p>
                    )}

                    <h3
                      className={`leading-tight mb-2 ${isLarge ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'}`}
                      style={{
                        fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                        fontStyle: 'italic',
                        color: '#f5f5f5',
                      }}
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-3">
                      <span
                        className="tracking-wider"
                        style={{
                          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                          fontSize: '1.25rem',
                          background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        ${product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span
                          className="line-through text-sm"
                          style={{
                            color: '#444444',
                            fontFamily: 'var(--font-body, Inter, sans-serif)',
                          }}
                        >
                          ${product.compareAtPrice}
                        </span>
                      )}

                      {/* Arrow — slides in on hover */}
                      <div
                        className="ml-auto flex items-center gap-1 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0"
                        style={{ color: '#c9a84c' }}
                      >
                        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                          <path
                            d="M0 4H14M14 4L11 1M14 4L11 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span
              className="text-[11px] tracking-[0.4em] uppercase"
              style={{ color: '#555555', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
            >
              No products in this category
            </span>
          </div>
        )}
      </div>
    </section>
    </MouseSpotlight>
  )
}
