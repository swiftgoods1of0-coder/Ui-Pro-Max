'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify'
import { formatPrice } from '@/lib/shopify'
import { useCart } from '@/context/CartContext'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'

const COLORS = {
  black: '#0a0a0a',
  gold: '#c9a84c',
  goldLight: '#e6c870',
  text: '#f5f5f5',
} as const

export default function ProductPageClient({ product }: { product: ShopifyProduct }) {
  const { addItem, loading, totalQuantity } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant>(
    product.variants.nodes[0]
  )
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)

  const images = product.images.nodes
  const currentImage = images[selectedImage] || product.featuredImage
  const isAvailable = selectedVariant?.availableForSale ?? false

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return
    setAdding(true)
    await addItem(selectedVariant.id)
    setAdding(false)
  }

  const price = selectedVariant?.price || product.priceRange.minVariantPrice
  const compareAt = selectedVariant?.compareAtPrice
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount)

  return (
    <main className="bg-sg-black min-h-screen">
      <Navigation cartCount={totalQuantity} />

      <div style={{ paddingTop: '88px' }}>
        {/* Breadcrumb */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem 1.5rem',
          }}
        >
          <nav
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.7rem',
              color: 'rgba(245,245,245,0.4)',
              letterSpacing: '0.1em',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                color: 'rgba(245,245,245,0.4)',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/collections"
              style={{
                color: 'rgba(245,245,245,0.4)',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              Shop
            </Link>
            <span>/</span>
            <span style={{ color: COLORS.gold, textTransform: 'uppercase' }}>
              {product.title}
            </span>
          </nav>
        </div>

        {/* Product content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem 4rem',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
          }}
          className="product-grid"
        >
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                background: '#0a0a0a',
                marginBottom: '1rem',
                overflow: 'hidden',
              }}
            >
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'contain', padding: '1rem' }}
                  priority
                />
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                }}
              >
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: 64,
                      height: 80,
                      position: 'relative',
                      flexShrink: 0,
                      border:
                        i === selectedImage
                          ? `2px solid ${COLORS.gold}`
                          : '2px solid transparent',
                      background: '#111',
                      cursor: 'pointer',
                      padding: 0,
                      overflow: 'hidden',
                      opacity: i === selectedImage ? 1 : 0.6,
                      transition: 'opacity 300ms ease, border-color 300ms ease',
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.title} ${i + 1}`}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {/* Product type */}
            {product.productType && (
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: COLORS.gold,
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                {product.productType}
              </span>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: COLORS.text,
                letterSpacing: '0.06em',
                lineHeight: 1,
                margin: '0 0 1rem',
              }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.75rem',
                  color: onSale ? '#e55' : COLORS.text,
                  letterSpacing: '0.05em',
                }}
              >
                {formatPrice(price.amount)}
              </span>
              {onSale && compareAt && (
                <span
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '1rem',
                    color: 'rgba(245,245,245,0.4)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(compareAt.amount)}
                </span>
              )}
            </div>

            {/* Gold divider */}
            <div
              style={{
                width: '3rem',
                height: '1px',
                background: `linear-gradient(to right, ${COLORS.gold}, transparent)`,
                marginBottom: '1.5rem',
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'rgba(245,245,245,0.65)',
                marginBottom: '2rem',
                maxWidth: '500px',
              }}
            >
              {product.description}
            </p>

            {/* Size selector */}
            {product.options.map((option) => (
              <div key={option.id} style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.5)',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}
                >
                  {option.name}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {option.values.map((value) => {
                    const matchingVariant = product.variants.nodes.find((v) =>
                      v.selectedOptions.some(
                        (o) => o.name === option.name && o.value === value
                      )
                    )
                    const isSelected = selectedVariant?.selectedOptions.some(
                      (o) => o.name === option.name && o.value === value
                    )
                    const available = matchingVariant?.availableForSale ?? false

                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          if (matchingVariant) setSelectedVariant(matchingVariant)
                        }}
                        style={{
                          minWidth: 48,
                          padding: '0.6rem 1rem',
                          fontFamily: 'var(--font-body, Inter, sans-serif)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          color: !available
                            ? 'rgba(245,245,245,0.2)'
                            : isSelected
                              ? COLORS.black
                              : COLORS.text,
                          background: isSelected
                            ? COLORS.gold
                            : 'rgba(255,255,255,0.05)',
                          border: isSelected
                            ? `1px solid ${COLORS.gold}`
                            : '1px solid rgba(255,255,255,0.12)',
                          cursor: available ? 'pointer' : 'not-allowed',
                          textDecoration: !available ? 'line-through' : 'none',
                          transition: 'all 200ms ease',
                        }}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Add to cart button */}
            <button
              type="button"
              disabled={!isAvailable || adding || loading}
              onClick={handleAddToCart}
              style={{
                width: '100%',
                maxWidth: 400,
                padding: '1.1rem 2rem',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: COLORS.black,
                background: !isAvailable
                  ? 'rgba(255,255,255,0.1)'
                  : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                border: 'none',
                cursor:
                  !isAvailable || adding || loading ? 'not-allowed' : 'pointer',
                opacity: adding || loading ? 0.7 : 1,
                transition: 'opacity 300ms ease',
                marginBottom: '1rem',
              }}
            >
              {!isAvailable
                ? 'SOLD OUT'
                : adding
                  ? 'ADDING...'
                  : 'ADD TO BAG'}
            </button>

            {/* Trust signals */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {[
                'Complimentary worldwide shipping',
                'Authenticity guaranteed',
                '30-day concierge returns',
              ].map((text) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      background: COLORS.gold,
                      transform: 'rotate(45deg)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body, Inter, sans-serif)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      color: 'rgba(245,245,245,0.45)',
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
