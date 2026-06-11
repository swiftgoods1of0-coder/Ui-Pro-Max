'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ShopifyProduct } from '@/lib/shopify'

interface CollectionGridProps {
  products: ShopifyProduct[]
}

const FILTERS = ['ALL', 'HOODIES', 'SETS', 'TEES', 'BOTTOMS']

export default function CollectionGrid({ products }: CollectionGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.fromTo(
          '.grid-header-el',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(
          '.grid-item',
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.grid-container',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="py-28 md:py-36 bg-[#0a0a0a]"
    >
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-8">
          <div>
            <p className="grid-header-el label-luxury text-[#c9a84c] mb-3 opacity-0">ALL PRODUCTS</p>
            <h2
              className="grid-header-el opacity-0"
              style={{ fontFamily: 'var(--font-impact)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '0.1em', color: '#f5f5f5', lineHeight: 1 }}
            >
              THE FULL EDIT
            </h2>
          </div>

          {/* Filter chips */}
          <div className="grid-header-el opacity-0 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-5 py-2 text-xs tracking-[0.2em] transition-all duration-300 border"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: activeFilter === f ? '#c9a84c' : 'transparent',
                  borderColor: activeFilter === f ? '#c9a84c' : '#2a2a2a',
                  color: activeFilter === f ? '#0a0a0a' : '#888888',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid-container grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, index) => {
            const isLarge = index === 0 || index === 5
            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className={`grid-item group relative overflow-hidden opacity-0 cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : 'col-span-1'
                }`}
                style={{ minHeight: isLarge ? '520px' : '280px' }}
                data-cursor="product"
              >
                {/* Image */}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-400" />

                {/* Badge */}
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-[#c9a84c] px-3 py-1">
                    <span className="text-[#0a0a0a] text-[10px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)' }}>NEW</span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  {product.category && (
                    <p className="label-luxury text-[#c9a84c]/60 mb-1 text-[10px]">{product.category}</p>
                  )}
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`font-medium text-[#f5f5f5] mb-1 leading-tight ${isLarge ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'}`}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      style={{ fontFamily: 'var(--font-impact)' }}
                      className="text-[#c9a84c] text-lg tracking-widest"
                    >
                      {product.price}
                    </span>
                    <div className="flex items-center gap-2 text-[#c9a84c] translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                        <path d="M0 4H14M14 4L11 1M14 4L11 7" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover border */}
                <div className="absolute inset-0 border border-[#c9a84c]/0 group-hover:border-[#c9a84c]/20 transition-all duration-400 pointer-events-none" />
              </Link>
            )
          })}
        </div>

        {/* Load more */}
        <div className="text-center mt-16">
          <button
            className="px-16 py-4 border border-[#2a2a2a] text-[#888888] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-400 tracking-[0.25em] text-sm"
            style={{ fontFamily: 'var(--font-impact)' }}
          >
            LOAD MORE
          </button>
        </div>

      </div>
    </section>
  )
}
