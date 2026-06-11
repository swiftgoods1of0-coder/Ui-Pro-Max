'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import LuxuryButton from '@/components/ui/LuxuryButton'

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

interface FeaturedProductsProps {
  products: ShopifyProduct[]
}

interface ProductCardProps {
  product: ShopifyProduct
  index: number
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="product"
      className="group relative flex flex-col cursor-pointer"
      style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Image Area */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3/4', background: '#0a0a0a' }}
      >
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          width={600}
          height={800}
        />

        {/* Dark hover overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ background: 'rgba(5,5,5,0.55)' }}
        />

        {/* Quick Add Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-4 group-hover:translate-y-0">
          <button
            className="px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all duration-300"
            style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.6)',
              color: '#c9a84c',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Quick Add
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span
              className="px-3 py-1 text-[10px] tracking-[0.2em] uppercase"
              style={{
                background: 'rgba(201,168,76,0.9)',
                color: '#050505',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 600,
              }}
            >
              New
            </span>
          )}
          {product.isFeatured && (
            <span
              className="px-3 py-1 text-[10px] tracking-[0.2em] uppercase"
              style={{
                background: 'rgba(224,224,224,0.15)',
                border: '1px solid rgba(224,224,224,0.3)',
                color: '#e0e0e0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col gap-2 flex-1">
        {/* Category */}
        {product.category && (
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: '#888888', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
          >
            {product.category}
          </span>
        )}

        {/* Title */}
        <h3
          className="leading-snug"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: '#f5f5f5',
          }}
        >
          {product.title}
        </h3>

        {/* Price Row */}
        <div className="flex items-center gap-3 mt-1">
          <span
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '1.375rem',
              letterSpacing: '0.05em',
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
              className="line-through"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.875rem',
                color: '#555555',
              }}
            >
              ${product.compareAtPrice}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          <span
            className="text-xs tracking-[0.2em] uppercase transition-all duration-300 group-hover:tracking-[0.3em]"
            style={{ color: '#888888', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
          >
            View Product
          </span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: '#c9a84c' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </div>
      </div>
    </motion.article>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative py-32 overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <span
            className="inline-flex items-center gap-4 text-xs tracking-[0.4em] uppercase mb-6 block"
            style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
          >
            <span
              className="inline-block w-12 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            The Collection
          </span>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2
              className="leading-none tracking-widest"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                color: '#f5f5f5',
              }}
            >
              Latest Drops
            </h2>
            <p
              className="max-w-xs"
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.9375rem',
                color: '#888888',
                lineHeight: 1.7,
              }}
            >
              Each piece in our latest collection is a study in quiet luxury — where comfort and presence converge.
            </p>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <LuxuryButton variant="secondary" href="/collections">
            VIEW ENTIRE COLLECTION
          </LuxuryButton>
        </motion.div>
      </div>

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }}
      />
    </section>
  )
}
