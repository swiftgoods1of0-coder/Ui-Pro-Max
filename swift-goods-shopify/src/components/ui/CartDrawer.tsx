'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/shopify'

const COLORS = {
  black: '#0a0a0a',
  gold: '#c9a84c',
  text: '#f5f5f5',
} as const

function QuantityControl({
  quantity,
  onUpdate,
  onRemove,
  disabled,
}: {
  quantity: number
  onUpdate: (q: number) => void
  onRemove: () => void
  disabled: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (quantity <= 1 ? onRemove() : onUpdate(quantity - 1))}
        style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: COLORS.text,
          cursor: disabled ? 'wait' : 'pointer',
          fontSize: '0.875rem',
        }}
      >
        -
      </button>
      <span
        style={{
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.8rem',
          color: COLORS.text,
          minWidth: 20,
          textAlign: 'center',
        }}
      >
        {quantity}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onUpdate(quantity + 1)}
        style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: COLORS.text,
          cursor: disabled ? 'wait' : 'pointer',
          fontSize: '0.875rem',
        }}
      >
        +
      </button>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, loading, updateItem, removeItem } = useCart()

  useEffect(() => {
    if (!cartOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [cartOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cartOpen) closeCart()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cartOpen, closeCart])

  const lines = cart?.lines.nodes ?? []
  const subtotal = cart?.cost.subtotalAmount

  // Route checkout through our API so the server always corrects the domain
  // and redirects to swiftgoodsclothing.myshopify.com — never the custom domain.
  const checkoutUrl = cart?.id
    ? `/api/checkout?cartId=${encodeURIComponent(cart.id)}`
    : undefined

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 299,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 300,
              width: '100%',
              maxWidth: 420,
              background: '#111',
              borderLeft: '1px solid rgba(201,168,76,0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 1.5rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.15em',
                  color: COLORS.text,
                  margin: 0,
                }}
              >
                YOUR BAG
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.text,
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '0.25rem',
                }}
              >
                &times;
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {lines.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '1.5rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                      fontStyle: 'italic',
                      fontSize: '1.25rem',
                      color: 'rgba(245,245,245,0.5)',
                    }}
                  >
                    Your bag is empty
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    style={{
                      fontFamily: 'var(--font-body, Inter, sans-serif)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: COLORS.gold,
                      background: 'none',
                      border: `1px solid ${COLORS.gold}`,
                      padding: '0.75rem 2rem',
                      cursor: 'pointer',
                    }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {lines.map((line) => {
                    const { merchandise } = line
                    const imageUrl = merchandise.product.featuredImage?.url
                    const options = merchandise.selectedOptions
                      .map((o) => o.value)
                      .join(' / ')

                    return (
                      <div
                        key={line.id}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          paddingBottom: '1.5rem',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {/* Image */}
                        {imageUrl && (
                          <Link
                            href={`/products/${merchandise.product.handle}`}
                            onClick={closeCart}
                            style={{
                              width: 80,
                              height: 100,
                              position: 'relative',
                              flexShrink: 0,
                              background: '#1a1a1a',
                            }}
                          >
                            <Image
                              src={imageUrl}
                              alt={merchandise.product.title}
                              fill
                              sizes="80px"
                              style={{ objectFit: 'cover' }}
                            />
                          </Link>
                        )}

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link
                            href={`/products/${merchandise.product.handle}`}
                            onClick={closeCart}
                            style={{
                              textDecoration: 'none',
                              display: 'block',
                              marginBottom: '0.25rem',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-body, Inter, sans-serif)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                color: COLORS.text,
                                letterSpacing: '0.05em',
                              }}
                            >
                              {merchandise.product.title}
                            </span>
                          </Link>

                          {options && (
                            <p
                              style={{
                                fontFamily: 'var(--font-body, Inter, sans-serif)',
                                fontSize: '0.7rem',
                                color: 'rgba(245,245,245,0.45)',
                                letterSpacing: '0.1em',
                                margin: '0 0 0.5rem',
                                textTransform: 'uppercase',
                              }}
                            >
                              {options}
                            </p>
                          )}

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: '0.5rem',
                            }}
                          >
                            <QuantityControl
                              quantity={line.quantity}
                              onUpdate={(q) => updateItem(line.id, q)}
                              onRemove={() => removeItem(line.id)}
                              disabled={loading}
                            />
                            <span
                              style={{
                                fontFamily: 'var(--font-body, Inter, sans-serif)',
                                fontSize: '0.8rem',
                                color: COLORS.gold,
                                fontWeight: 500,
                              }}
                            >
                              {formatPrice(line.cost.totalAmount.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {lines.length > 0 && (
              <div
                style={{
                  padding: '1.25rem 1.5rem 1.5rem',
                  borderTop: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                {/* Subtotal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body, Inter, sans-serif)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(245,245,245,0.6)',
                    }}
                  >
                    SUBTOTAL
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                      fontSize: '1.25rem',
                      color: COLORS.text,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {subtotal ? formatPrice(subtotal.amount) : '$0'}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.625rem',
                    color: 'rgba(245,245,245,0.35)',
                    textAlign: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  Shipping & taxes calculated at checkout
                </p>

                {/* Checkout button */}
                <a
                  href={checkoutUrl || '#'}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '1rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: COLORS.black,
                    background: `linear-gradient(135deg, ${COLORS.gold}, #e6c870)`,
                    cursor: loading ? 'wait' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'opacity 300ms ease',
                  }}
                >
                  {loading ? 'UPDATING...' : 'CHECKOUT'}
                </a>

                {/* Continue shopping */}
                <button
                  type="button"
                  onClick={closeCart}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.5)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
