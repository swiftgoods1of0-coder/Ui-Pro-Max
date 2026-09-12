
import { useEffect, useRef } from 'react'
import { Link } from '@remix-run/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const GOLD = '#c9a84c'
const GOLD_LIGHT = '#e6c870'

interface SectionProduct {
  id: string
  title: string
  handle: string
  price: string
  compareAtPrice?: string
  image: string
  category?: string
  isNew?: boolean
}

interface WomensSectionProps {
  products?: SectionProduct[]
}

export default function WomensSection({ products = [] }: WomensSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.ws-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: '.ws-label', start: 'top 85%', once: true } }
      )
      gsap.fromTo('.ws-headline',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.1,
          scrollTrigger: { trigger: '.ws-headline', start: 'top 82%', once: true } }
      )
      gsap.fromTo('.ws-body',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: '.ws-body', start: 'top 82%', once: true } }
      )
      gsap.fromTo('.ws-img-left',
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.ws-img-left', start: 'top 88%', once: true } }
      )
      gsap.fromTo('.ws-img-right',
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out', delay: 0.15,
          scrollTrigger: { trigger: '.ws-img-right', start: 'top 88%', once: true } }
      )
      gsap.fromTo('.ws-card',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.ws-cards', start: 'top 82%', once: true } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="womens"
      style={{ background: '#060606', position: 'relative', overflow: 'hidden', paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      {/* Subtle gold ambient top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div>
            <div className="ws-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', opacity: 0 }}>
              <span style={{ display: 'block', width: 40, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
              <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.75rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
                FOR HER
              </span>
            </div>
            <h2 className="ws-headline" style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.92, letterSpacing: '0.04em', color: '#f5f5f5', margin: 0, opacity: 0 }}>
              WOMEN'S
              <br />
              <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT}, #c8aa8a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                COLLECTION
              </span>
            </h2>
          </div>

          <div className="ws-body" style={{ maxWidth: 340, opacity: 0 }}>
            <p style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(245,245,245,0.45)', lineHeight: 1.75, margin: '0 0 1.5rem 0' }}>
              Designed for movement. Built for presence. Pieces that carry the same luxury DNA — now crafted for women.
            </p>
            <Link
              to="/collections/womens"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: GOLD,
                textDecoration: 'none',
                borderBottom: `1px solid rgba(201,168,76,0.35)`,
                paddingBottom: '0.25rem',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = GOLD_LIGHT
                ;(e.currentTarget as HTMLElement).style.borderColor = GOLD_LIGHT
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = GOLD
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'
              }}
            >
              SHOP ALL WOMEN'S
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none" aria-hidden="true">
                <path d="M0 4H16M16 4L13 1M16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Editorial photo split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '3rem' }}>
          <div className="ws-img-left" style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', opacity: 0 }}>
            <img
              src="/brand/sg-solo-cream.jpeg"
              alt="Women's Collection"
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.75) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.5rem', right: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.5rem', letterSpacing: '0.1em', color: '#f5f5f5', margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
                SIGNATURE FIT
              </p>
              <p style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.75rem', letterSpacing: '0.2em', color: `rgba(201,168,76,0.7)`, textTransform: 'uppercase', margin: '0.3rem 0 0 0' }}>
                Everyday Luxury
              </p>
            </div>
            {/* Gold border on hover */}
            <div style={{ position: 'absolute', inset: 0, border: `1px solid rgba(201,168,76,0)`, transition: 'border-color 0.4s ease', pointerEvents: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="ws-img-right" style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: 200, opacity: 0 }}>
              <img
                src="/brand/sg-wall-duo.jpeg"
                alt="Women's Editorial"
                loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.65) 0%, transparent 55%)' }} />
            </div>
            <div style={{ position: 'relative', padding: '2rem', background: '#0d0d0d', border: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 180 }}>
              <div style={{ position: 'absolute', top: 16, left: 16, width: 20, height: 20, borderTop: `1px solid rgba(201,168,76,0.3)`, borderLeft: `1px solid rgba(201,168,76,0.3)` }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 20, height: 20, borderBottom: `1px solid rgba(201,168,76,0.3)`, borderRight: `1px solid rgba(201,168,76,0.3)` }} />
              <p style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '0.75rem', letterSpacing: '0.4em', color: GOLD, textTransform: 'uppercase', margin: '0 0 0.75rem 0' }}>
                Swift Goods Women's
              </p>
              <p style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#f5f5f5', lineHeight: 1.4, margin: 0 }}>
                "Comfort is a luxury — and you deserve both."
              </p>
            </div>
          </div>
        </div>

        {/* Product cards or CTA when no products */}
        {products.length > 0 ? (
          <div className="ws-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="ws-card group"
                style={{ display: 'block', textDecoration: 'none', opacity: 0 }}
              >
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111', marginBottom: '1rem' }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '4rem', color: 'rgba(201,168,76,0.07)' }}>SG</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,6,0.7) 0%, transparent 50%)', transition: 'opacity 0.4s ease' }} />
                  {product.isNew && (
                    <span style={{ position: 'absolute', top: 12, left: 12, padding: '0.3rem 0.7rem', background: GOLD, color: '#050505', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.65rem', letterSpacing: '0.22em', fontWeight: 700, textTransform: 'uppercase' }}>
                      NEW
                    </span>
                  )}
                  <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0)', transition: 'border-color 0.4s ease', pointerEvents: 'none' }}
                    className="group-hover:border-gold"
                  />
                </div>
                {product.category && (
                  <p style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', margin: '0 0 0.35rem 0' }}>
                    {product.category}
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: '1.2rem', color: '#f5f5f5', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
                  {product.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.2rem', letterSpacing: '0.05em', background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ${product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.875rem', color: '#444', textDecoration: 'line-through' }}>
                      ${product.compareAtPrice}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* CTA when no women's products tagged yet */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', border: '1px solid rgba(201,168,76,0.1)', background: '#0d0d0d', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, position: 'relative', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 18, height: 1, background: `rgba(201,168,76,0.4)` }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 18, background: `rgba(201,168,76,0.4)` }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 1, background: `rgba(201,168,76,0.4)` }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 18, background: `rgba(201,168,76,0.4)` }} />
            </div>
            <p style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '0.75rem', letterSpacing: '0.4em', color: GOLD, textTransform: 'uppercase', margin: '0 0 0.75rem 0' }}>
              Coming Soon
            </p>
            <p style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: '#f5f5f5', margin: '0 0 2rem 0', maxWidth: 460, lineHeight: 1.5 }}>
              The Women's Collection is dropping soon. Be the first to know.
            </p>
            <Link
              to="/collections/womens"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.9rem 2.5rem',
                background: 'transparent',
                border: `1px solid rgba(201,168,76,0.5)`,
                color: GOLD,
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.8rem',
                letterSpacing: '0.25em',
                fontWeight: 600,
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'
                ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'
              }}
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        )}
      </div>

      {/* Bottom gold accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)', pointerEvents: 'none' }} />
    </section>
  )
}
