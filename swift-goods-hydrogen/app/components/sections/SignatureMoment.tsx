

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'

const QUOTE_WORDS = [
  'The', 'most', 'powerful', 'thing', 'you', 'can', 'wear',
  'is', 'something', 'built', 'for', 'you.',
]

export default function SignatureMoment() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const velocity = useScrollVelocity()

  useEffect(() => {
    if (photoRef.current) {
      photoRef.current.style.transition = 'filter 200ms ease-out'
      photoRef.current.style.filter = `brightness(${1 - Math.abs(velocity) * 0.15})`
    }
  }, [velocity])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Photo: parallax on scroll
      gsap.fromTo(
        photoRef.current,
        { y: -60 },
        {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.4,
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="signature"
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(400px, 55vh, 700px)' }}
    >
      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none z-[1]"
        style={{
          bottom: '10%',
          left: '15%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* ── Desktop layout: left content (45%) | gold divider | right photo (55%) ── */}
      {/* ── Mobile: photo full-width behind content with heavy overlay ── */}

      {/* Photo — right 55% on desktop, full-width on mobile */}
      <div className="absolute inset-0 lg:left-[45%] lg:right-0">
        <div ref={photoRef} className="relative w-full h-full lg:h-[120%] lg:-top-[10%]">
          <Image
            src="/brand/sg-solo-black.jpeg"
            alt="Swift Goods — signature moment"
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>
        {/* Mobile overlay — heavy dark gradient so text reads */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 50%, rgba(10,10,10,0.55) 100%)',
          }}
        />
        {/* Desktop overlay — subtle left-edge fade for blending */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.5) 0%, transparent 40%)',
          }}
        />
      </div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.015,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Left content area — solid dark on desktop */}
      <div
        className="absolute inset-y-0 left-0 w-[45%] hidden lg:block"
        style={{ background: '#0a0a0a' }}
      >
        {/* Ghosted SG monogram watermark */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-5%',
            zIndex: 0,
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(12rem, 25vw, 20rem)',
            WebkitTextStroke: '1px rgba(201,168,76,0.06)',
            color: 'transparent',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          SG
        </div>
      </div>

      {/* Vertical gold divider — desktop only */}
      <div
        className="absolute top-0 bottom-0 left-[45%] w-px hidden lg:block z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 5%, rgba(201,168,76,0.35) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent 95%)',
        }}
      />

      {/* Vertical text — SWIFT GOODS — right edge, desktop only */}
      <div
        className="absolute z-[6] hidden lg:flex items-center justify-center pointer-events-none"
        style={{
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center center',
        }}
      >
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.45rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          SWIFT GOODS — DESIGNED FOR MOVEMENT
        </span>
      </div>

      {/* Corner bracket — top-right, desktop only */}
      <div
        className="hidden lg:block"
        style={{
          position: 'absolute',
          top: '8%',
          right: '4%',
          width: '24px',
          height: '24px',
          borderTop: '1px solid rgba(201,168,76,0.25)',
          borderRight: '1px solid rgba(201,168,76,0.25)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      {/* Content overlay — positioned left on desktop, centered on mobile */}
      <div className="relative z-10 flex items-center" style={{ minHeight: 'clamp(400px, 55vh, 700px)' }}>
        <div className="w-full lg:w-[45%] px-8 sm:px-12 lg:px-16 xl:px-24 py-24">
          {/* Gold label */}
          <span
            className="inline-block mb-8"
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.625rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: '#c9a84c',
            }}
          >
            THE SIGNATURE MOMENT
          </span>

          {/* Quote — word-by-word stagger */}
          <div className="mb-10">
            <p
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.25,
                color: '#f5f5f5',
                letterSpacing: '-0.01em',
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
              }}
            >
              &ldquo;
              {QUOTE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="sig-word inline-block"
                  style={{ marginRight: '0.3em' }}
                >
                  {word}
                </span>
              ))}
              &rdquo;
            </p>
          </div>

          {/* Thin gold horizontal rule — gradient fade */}
          <div
            className="mb-8 origin-left"
            style={{
              width: '100%',
              maxWidth: '280px',
              height: '1px',
              background:
                'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.3), transparent)',
            }}
          />

          {/* Brand credit */}
          <p
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.625rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: '#555555',
              fontVariantCaps: 'small-caps',
            }}
          >
            &mdash; SWIFT GOODS CLOTHING BRAND
          </p>
        </div>
      </div>
    </section>
  )
}
