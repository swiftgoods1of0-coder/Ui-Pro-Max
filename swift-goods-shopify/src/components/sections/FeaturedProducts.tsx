'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'
import { use3DTilt } from '@/hooks/use3DTilt'

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
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const hasSecondImage = product.images && product.images.length > 1

  use3DTilt(cardRef, { maxTilt: 6, scale: 1.03, glowColor: 'rgba(201,168,76,0.12)' })

  return (
    <Link href={`/products/${product.handle}`} className="block">
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.75,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      data-cursor="product"
      className="group relative flex flex-col cursor-pointer"
      style={{
        background: '#111111',
        border: '1px solid rgba(0,0,0,0.08)',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
      whileHover={{
        borderColor: 'rgba(201,168,76,0.3)',
        boxShadow: '0 12px 50px rgba(0,0,0,0.25), 0 0 30px rgba(201,168,76,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/5', background: '#0a0a0a' }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-[600ms] ease-out group-hover:scale-110"
          style={{ opacity: hovered && hasSecondImage ? 0 : 1 }}
          unoptimized
        />
        {hasSecondImage && (
          <Image
            src={product.images![1]}
            alt={`${product.title} — alternate`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-[600ms] ease-out group-hover:scale-110"
            style={{ opacity: hovered ? 1 : 0 }}
            unoptimized
          />
        )}

        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(5,5,5,0.58)' }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100
            translate-y-3 group-hover:translate-y-0
            transition-all duration-500 ease-out"
        >
          <button
            type="button"
            className="px-8 py-3 text-[11px] tracking-[0.28em] uppercase transition-all duration-300 hover:bg-[rgba(201,168,76,0.25)]"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.55)',
              color: '#c9a84c',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              backdropFilter: 'blur(10px)',
              fontWeight: 500,
            }}
            onClick={(e) => e.preventDefault()}
          >
            QUICK ADD
          </button>
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
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
          )}
          {product.isFeatured && (
            <span
              className="px-3 py-1 text-[10px] tracking-[0.22em] uppercase"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#e0e0e0',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                backdropFilter: 'blur(6px)',
              }}
            >
              EXCLUSIVE
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.5625rem',
            letterSpacing: '0.2em',
            color: 'rgba(201,168,76,0.5)',
            textTransform: 'uppercase',
          }}>
            {String(index + 1).padStart(2, '0')} / 200
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="p-6 flex flex-col gap-1 flex-1">
        {product.category && (
          <span
            className="text-[10px] tracking-[0.32em] uppercase"
            style={{
              color: '#555555',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            {product.category}
          </span>
        )}

        {product.isFeatured && (
          <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.5625rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.6)',
          }}>
            LIMITED EDITION
          </span>
        )}

        <h3
          className="mt-1 leading-snug"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: '1.3rem',
            fontStyle: 'italic',
            color: '#f5f5f5',
          }}
        >
          {product.title}
        </h3>

        <div className="flex items-baseline gap-3 mt-2">
          <span
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '1.4rem',
              letterSpacing: '0.06em',
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
                color: '#444444',
              }}
            >
              ${product.compareAtPrice}
            </span>
          )}
        </div>

        <div className="mt-auto pt-5 flex items-center gap-2 overflow-hidden">
          <span
            className="text-[10px] tracking-[0.22em] uppercase transition-all duration-300 group-hover:tracking-[0.32em]"
            style={{
              color: '#555555',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            View Product
          </span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: '#c9a84c' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
    </motion.article>
    </Link>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--sg-frost, #F7F6F3)' }}
    >
      {/* Warm ambient glow */}
      <div className="absolute pointer-events-none" style={{ top: '5%', left: '-8%', width: '45%', height: '45%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '-5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      {/* Frost texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)', backgroundSize: '100% 4px' }} />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <span
              className="block w-12 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            <span
              className="text-[11px] tracking-[0.42em] uppercase"
              style={{
                color: '#a08535',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              THE COLLECTION
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SplitTextReveal
              text="LATEST DROPS"
              tag="h2"
              className="leading-none tracking-widest"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                color: '#1a1a1a',
              }}
            />
            <div className="max-w-xs lg:text-right">
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.9375rem',
                  color: '#6b6560',
                  lineHeight: 1.72,
                  margin: 0,
                  marginBottom: '0.75rem',
                }}
              >
                Each piece is a study in quiet luxury — where comfort and presence converge at the edge of fashion.
              </p>
              <div className="flex items-center gap-2 lg:justify-end">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#c9a84c',
                    animation: 'pulse-gold 2s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.6875rem',
                    color: '#9a9590',
                    letterSpacing: '0.08em',
                  }}
                >
                  Selling fast — limited stock
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product grid — dark cards on frost bg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <MagneticElement strength={0.25} radius={160}>
            <LuxuryButton variant="secondary" href="/collections">
              VIEW ENTIRE COLLECTION
            </LuxuryButton>
          </MagneticElement>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)',
        }}
      />
    </section>
  )
}
