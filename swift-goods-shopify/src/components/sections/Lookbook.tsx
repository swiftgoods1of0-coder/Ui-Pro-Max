'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

// ─── Data ────────────────────────────────────────────────────────────────────

interface LookbookSlide {
  id: string
  src: string
  alt: string
  collection: string
  href: string
  aspect: 'landscape' | 'portrait'
}

const SLIDES: LookbookSlide[] = [
  {
    id: '01',
    src: '/brand/sg-supra-duo.jpeg',
    alt: 'Two guys with red Supra at sunset',
    collection: 'SUPRA SESSIONS',
    href: '/collections/supra-sessions',
    aspect: 'landscape',
  },
  {
    id: '02',
    src: '/brand/sg-solo-black.jpeg',
    alt: 'Solo portrait, black hoodie stepping out of car',
    collection: 'NOIR ESSENTIALS',
    href: '/collections/noir-essentials',
    aspect: 'portrait',
  },
  {
    id: '03',
    src: '/brand/sg-solo-cream.jpeg',
    alt: 'Solo, cream hoodie stepping out of car',
    collection: 'CREAM COLLECTION',
    href: '/collections/cream',
    aspect: 'landscape',
  },
  {
    id: '04',
    src: '/brand/sg-wall-duo.jpeg',
    alt: 'Two guys against concrete brick wall',
    collection: 'CONCRETE CULTURE',
    href: '/collections/concrete-culture',
    aspect: 'portrait',
  },
  {
    id: '05',
    src: '/brand/sg-night-supra.jpeg',
    alt: 'Night shot on car with dramatic lighting',
    collection: 'AFTER DARK',
    href: '/collections/after-dark',
    aspect: 'landscape',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const totalScroll = track.scrollWidth - window.innerWidth

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`
          }
        },
      })

      gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: st,
      })
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id="lookbook"
        className="sg-lookbook-section"
      >
        {/* ── Scrolling track ──────────────────────────────────────────── */}
        <div ref={trackRef} className="sg-lookbook-track">

          {/* ── Title panel ────────────────────────────────────────────── */}
          <div className="sg-lookbook-title-panel">
            {/* Gold label with line */}
            <div className="sg-lookbook-label-row">
              <span className="sg-lookbook-label-line" />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '11px',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                  fontWeight: 500,
                }}
              >
                THE LOOKBOOK
              </span>
            </div>

            {/* Big heading */}
            <h2
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                color: '#f5f5f5',
                lineHeight: 0.95,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              CAMPAIGN
              <br />
              2025
            </h2>

            {/* Body text */}
            <p
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: '1.15rem',
                fontStyle: 'italic',
                color: '#666',
                maxWidth: '340px',
                lineHeight: 1.65,
                marginTop: '1.5rem',
              }}
            >
              Five frames. One story. Scroll to explore the world of Swift Goods.
            </p>

            {/* Scroll hint */}
            <div
              style={{
                marginTop: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '10px',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                }}
              >
                SCROLL TO EXPLORE
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '32px',
                  height: '1px',
                  background: 'linear-gradient(to right, #c9a84c, transparent)',
                }}
              />
            </div>
          </div>

          {/* ── Photo panels ───────────────────────────────────────────── */}
          {SLIDES.map((slide) => (
            <div key={slide.id} className="sg-lookbook-panel">
              {/* Panel number */}
              <span className="sg-lookbook-panel-num">{slide.id}</span>

              {/* Photo container with hover scale */}
              <div
                className="sg-lookbook-photo-wrap"
                style={{
                  aspectRatio: slide.aspect === 'portrait' ? '4 / 5' : '3 / 4',
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 70vw"
                  style={{ objectFit: 'cover' }}
                  priority={slide.id === '01'}
                />
              </div>

              {/* Caption area */}
              <div className="sg-lookbook-caption">
                <div className="sg-lookbook-caption-line" />
                <h3
                  style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '1.5rem',
                    color: '#f5f5f5',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {slide.collection}
                </h3>
                <LuxuryButton variant="ghost" size="sm" href={slide.href}>
                  VIEW COLLECTION
                </LuxuryButton>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress bar at bottom of pinned section ─────────────────── */}
        <div className="sg-lookbook-progress-bar">
          <div ref={progressRef} className="sg-lookbook-progress-fill" />
        </div>
      </section>

      {/* ── Marquee brand quote banner — outside the pinned section ───── */}
      <div className="sg-lookbook-marquee-wrap">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4rem',
            whiteSpace: 'nowrap',
            animation: 'sg-marquee 22s linear infinite',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4rem',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222',
                }}
              >
                COMFORT IS LUXURY
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>
                &#x2726;
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222',
                }}
              >
                SWIFT GOODS
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>
                &#x2726;
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
