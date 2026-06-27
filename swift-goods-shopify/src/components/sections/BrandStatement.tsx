'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface BrandPillar {
  number: string
  title: string
  body: string
}

const BRAND_PILLARS: BrandPillar[] = [
  {
    number: '01',
    title: 'QUALITY',
    body: 'Every stitch, every seam, every silhouette — engineered with obsessive precision. We source the finest fabrics because you feel the difference the moment you put it on.',
  },
  {
    number: '02',
    title: 'PRESENCE',
    body: 'What you wear shapes how you enter a room before you speak. Swift Goods dresses the version of you that commands attention without demanding it.',
  },
  {
    number: '03',
    title: 'MOVEMENT',
    body: 'True luxury lives in motion — not just in photographs. We engineer comfort that moves with you through every hour, every scene, every moment.',
  },
]

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const monogramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (monogramRef.current) {
        gsap.to(monogramRef.current, {
          y: 30, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        })
      }
    }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  const quoteWords = "We don’t follow trends. We set the standard.".split(' ')

  return (
    <section
      ref={sectionRef}
      id="brand"
      className="relative overflow-hidden"
      style={{ background: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      {/* SG monogram watermark */}
      <div
        ref={monogramRef}
        className="absolute pointer-events-none select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(20rem, 40vw, 45rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.04)',
          opacity: 1,
          whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        SG
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.018,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.018,
          backgroundImage: 'repeating-linear-gradient(135deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 56px)',
        }}
      />

      {/* Left golden accent line */}
      <div
        className="absolute left-0 top-0 w-px h-full pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.5) 35%, rgba(201,168,76,0.5) 65%, transparent 100%)' }}
      />

      {/* Ambient gold glow */}
      <div className="absolute pointer-events-none" style={{ top: '20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', left: '-5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      {/* Corner brackets */}
      <div className="absolute hidden lg:block pointer-events-none" style={{ top: '5%', left: '3%' }}>
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 1, background: 'rgba(201,168,76,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, background: 'rgba(201,168,76,0.3)' }} />
        </div>
      </div>
      <div className="absolute hidden lg:block pointer-events-none" style={{ bottom: '5%', right: '3%' }}>
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 1, background: 'rgba(201,168,76,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 24, background: 'rgba(201,168,76,0.3)' }} />
        </div>
      </div>

      {/* Vertical side text */}
      <div className="absolute z-[6] hidden lg:flex items-center justify-center pointer-events-none" style={{ right: '1.5rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'center center' }}>
        <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.45rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.15)', whiteSpace: 'nowrap' }}>
          SWIFT GOODS &mdash; EST. 2025 &mdash; THE STANDARD
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-32 w-full">

        {/* Label */}
        <div className="mb-16">
          <div className="bs-label inline-flex items-center gap-4">
            <span className="block w-14 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span
              className="text-[11px] tracking-[0.42em] uppercase"
              style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}
            >
              THE BRAND
            </span>
          </div>
        </div>

        {/* Large manifesto quote */}
        <div className="mb-10 max-w-5xl">
          <blockquote
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
              fontStyle: 'italic',
              color: '#f5f5f5',
              lineHeight: 1.12,
              textShadow: '0 4px 40px rgba(0,0,0,0.3)',
            }}
          >
            {quoteWords.map((word, i) => (
              <span
                key={i}
                className="bs-quote-word inline-block"
                style={{ marginRight: '0.26em' }}
              >
                {word}
              </span>
            ))}
          </blockquote>
        </div>

        {/* Manifesto subline */}
        <p
          className="mb-6 max-w-lg"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.9375rem',
            color: '#888',
            lineHeight: 1.75,
          }}
        >
          Swift Goods is more than a brand — it&apos;s a statement. Premium streetwear built for those who move with purpose and dress with intention.
        </p>

        {/* Gold rule */}
        <div
          className="bs-rule mb-28 origin-left"
          style={{
            width: '100%',
            maxWidth: '180px',
            height: '1px',
            background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.2), transparent)',
          }}
        />

        {/* Brand pillars — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-20">
          {BRAND_PILLARS.map((pillar) => (
            <div key={pillar.title} className="bs-pillar group cursor-default">
              <span
                className="block mb-4 text-[11px] tracking-[0.35em]"
                style={{ color: 'rgba(201,168,76,0.35)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
              >
                {pillar.number}
              </span>

              <h3
                className="mb-6 leading-none tracking-wide"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.8rem, 4.5vw, 4.5rem)',
                  color: '#c9a84c',
                  textShadow: '0 0 60px rgba(201,168,76,0.15)',
                }}
              >
                {pillar.title}
              </h3>

              <div
                className="mb-7 h-px transition-all duration-500 ease-out group-hover:w-20"
                style={{ width: '3rem', background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />

              <p
                className="leading-relaxed"
                style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.9375rem', color: '#888', lineHeight: 1.78 }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom brand mark */}
        <div className="bs-manifesto flex flex-col items-center text-center pt-8">
          <div className="flex items-center gap-4 mb-6">
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))' }} />
            <div style={{ width: 6, height: 6, background: '#c9a84c', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(201,168,76,0.3)' }} />
            <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))' }} />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              letterSpacing: '0.3em',
              color: 'rgba(245,245,245,0.25)',
              textTransform: 'uppercase',
            }}
          >
            COMFORT IS LUXURY.
          </p>
        </div>
      </div>
    </section>
  )
}
