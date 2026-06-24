'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

const FEATURES = [
  { label: 'MESH-LINED', detail: 'Breathable Interior' },
  { label: '4-WAY STRETCH', detail: 'Unrestricted Movement' },
  { label: 'QUICK-DRY', detail: 'All-Day Performance' },
]

export default function ProductDrop() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const cornerTLRef = useRef<HTMLDivElement>(null)
  const cornerBRRef = useRef<HTMLDivElement>(null)
  const verticalTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        )
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      if (cornerTLRef.current && cornerBRRef.current) {
        tl.fromTo([cornerTLRef.current, cornerBRRef.current],
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
          0
        )
      }

      if (badgeRef.current) {
        tl.fromTo(badgeRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left center' },
          0.1
        )
      }

      if (labelRef.current) {
        tl.fromTo(labelRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power3.inOut' },
          0.25
        )
      }

      if (stripRef.current) {
        tl.fromTo(stripRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' },
          0.4
        )
      }

      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.7
        )
      }

      if (featuresRef.current) {
        const items = featuresRef.current.querySelectorAll<HTMLElement>('.feature-item')
        tl.fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
          0.85
        )
      }

      if (priceRef.current) {
        tl.fromTo(priceRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          1.0
        )
      }

      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          1.1
        )
      }

      if (counterRef.current) {
        tl.fromTo(counterRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          1.3
        )
      }

      if (verticalTextRef.current) {
        tl.fromTo(verticalTextRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          0.5
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', background: '#050505' }}
    >
      {/* Video background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/brand/sg-shorts-drop.mp4"
          poster="/brand/sg-shorts-drop-poster.jpeg"
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Layered overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 30%, rgba(5,5,5,0.35) 55%, rgba(5,5,5,0.1) 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 25%, transparent 75%, rgba(5,5,5,0.5) 100%)',
        }}
      />
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Gold accent line — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{
          left: '3rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent)',
        }}
      />

      {/* Decorative corner brackets — luxury lookbook style */}
      <div
        ref={cornerTLRef}
        className="absolute hidden lg:block pointer-events-none"
        style={{ top: '2.5rem', left: '4.5rem', opacity: 0 }}
      >
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 20, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </div>
      <div
        ref={cornerBRRef}
        className="absolute hidden lg:block pointer-events-none"
        style={{ bottom: '2.5rem', right: '3rem', opacity: 0 }}
      >
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 20, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </div>

      {/* Vertical side text — right edge */}
      <div
        ref={verticalTextRef}
        className="absolute hidden lg:flex items-center justify-center pointer-events-none"
        style={{
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.5rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          SWIFT GOODS &mdash; SS25 COLLECTION &mdash; LIMITED EDITION
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24">
          <div className="max-w-2xl">

            {/* "NEW DROP" badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-3 mb-8"
              style={{ opacity: 0 }}
            >
              <span
                className="px-4 py-1.5"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  color: '#050505',
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                }}
              >
                NEW DROP
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  boxShadow: '0 0 8px rgba(201,168,76,0.6)',
                  animation: 'pulse-gold 2s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  color: '#c9a84c',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                JUST DROPPED
              </span>
            </div>

            {/* Gold label */}
            <div
              ref={labelRef}
              className="inline-flex items-center gap-3 mb-6"
              style={{ opacity: 0 }}
            >
              <span
                className="block w-12 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                }}
              >
                SWIFT GOODS ESSENTIALS
              </span>
              <span
                className="block w-12 h-px"
                style={{ background: 'linear-gradient(to left, #c9a84c, transparent)' }}
              />
            </div>

            {/* Heading — split text reveal */}
            <SplitTextReveal
              text="THE SHORTS"
              tag="h2"
              stagger={0.04}
              duration={0.8}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                color: '#f5f5f5',
                letterSpacing: '0.06em',
                lineHeight: 0.92,
                margin: 0,
                marginBottom: '0.15rem',
              }}
            />
            <SplitTextReveal
              text="THAT MOVE."
              tag="h2"
              stagger={0.04}
              duration={0.8}
              delay={0.15}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                color: '#c9a84c',
                letterSpacing: '0.06em',
                lineHeight: 0.92,
                margin: 0,
                marginBottom: '2rem',
              }}
            />

            {/* Gold horizontal rule */}
            <div
              ref={stripRef}
              className="mb-8"
              style={{
                width: '100px',
                height: '2px',
                background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.2))',
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
              }}
            />

            {/* Description block */}
            <div
              ref={subtitleRef}
              className="mb-8"
              style={{
                maxWidth: '440px',
                opacity: 0,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                  marginBottom: '1rem',
                }}
              >
                Performance &nbsp;&middot;&nbsp; Comfort &nbsp;&middot;&nbsp; Style &nbsp;&middot;&nbsp; Perfected
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: 'rgba(245,245,245,0.55)',
                }}
              >
                Crafted from premium ultra-soft stretch fabric for effortless movement, all-day comfort, and a refined luxury feel wherever the day takes you.
              </p>
            </div>

            {/* Product features strip */}
            <div
              ref={featuresRef}
              className="flex flex-wrap gap-6 mb-10"
            >
              {FEATURES.map((f) => (
                <div key={f.label} className="feature-item" style={{ opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        background: '#c9a84c',
                        transform: 'rotate(45deg)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#f5f5f5',
                      }}
                    >
                      {f.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-body, Inter, sans-serif)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.08em',
                      color: 'rgba(245,245,245,0.35)',
                      paddingLeft: 12,
                    }}
                  >
                    {f.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div
              ref={priceRef}
              className="flex items-baseline gap-4 mb-10"
              style={{ opacity: 0 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                $65.00
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.3)',
                }}
              >
                FREE SHIPPING ON ALL ORDERS
              </span>
            </div>

            {/* CTA buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
              <MagneticElement strength={0.3} radius={180}>
                <LuxuryButton
                  variant="primary"
                  size="lg"
                  href="/collections/shorts"
                  data-cursor="cta"
                >
                  SHOP THE SHORTS
                </LuxuryButton>
              </MagneticElement>
              <MagneticElement strength={0.25} radius={150}>
                <LuxuryButton
                  variant="ghost"
                  href="/collections/new-arrivals"
                >
                  ALL NEW ARRIVALS
                </LuxuryButton>
              </MagneticElement>
            </div>

            {/* Stock counter */}
            <div
              ref={counterRef}
              className="mt-8 flex items-center gap-3"
              style={{ opacity: 0 }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  boxShadow: '0 0 10px rgba(201,168,76,0.5)',
                  animation: 'pulse-gold 1.5s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.6875rem',
                  color: 'rgba(201,168,76,0.7)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Limited run &mdash; selling fast
              </span>
              <span
                className="block h-px flex-1 max-w-[60px]"
                style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)',
        }}
      />
    </section>
  )
}
