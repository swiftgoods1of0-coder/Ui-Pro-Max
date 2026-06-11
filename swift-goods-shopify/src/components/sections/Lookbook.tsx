'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

interface EditorialPanel {
  num: string
  title: string
  desc: string
  gradientFrom: string
  gradientTo: string
}

const EDITORIAL_PANELS: EditorialPanel[] = [
  {
    num: '01',
    title: 'THE SILHOUETTE',
    desc: 'Designed for movement.',
    gradientFrom: '#111111',
    gradientTo: '#0a0a0a',
  },
  {
    num: '02',
    title: 'THE MATERIAL',
    desc: 'Premium beyond expectation.',
    gradientFrom: '#131208',
    gradientTo: '#0a0a0a',
  },
  {
    num: '03',
    title: 'THE STATEMENT',
    desc: 'Presence without words.',
    gradientFrom: '#0e0e0e',
    gradientTo: '#050505',
  },
]

export default function Lookbook() {
  const sectionRef  = useRef<HTMLElement>(null)
  const heroRef     = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const panelsRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Hero editorial content — stagger reveal on scroll
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })

      heroTl
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 55 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.45'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          '-=0.35'
        )

      // Editorial panels stagger from below
      if (panelsRef.current) {
        const panels = panelsRef.current.querySelectorAll<HTMLElement>('.editorial-panel')
        gsap.fromTo(
          panels,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.14,
            scrollTrigger: {
              trigger: panelsRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      className="relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* ── Full-screen editorial header ───────────────────────────── */}
      <div
        ref={heroRef}
        className="relative min-h-screen overflow-hidden flex items-end"
        style={{
          background:
            'linear-gradient(160deg, #111111 0%, #0d0d0d 40%, #050505 100%)',
        }}
      >
        {/* Vertical line grid overlay — 6 columns */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-full"
              style={{ borderLeft: '1px solid rgba(255,255,255,0.03)' }}
            />
          ))}
        </div>

        {/* Top-right campaign label */}
        <div className="absolute top-12 right-10 text-right z-10">
          <span
            className="block text-[10px] tracking-[0.42em] uppercase"
            style={{
              color: '#c9a84c',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            Campaign SS24
          </span>
          <span
            className="block text-[10px] tracking-[0.25em] uppercase mt-1"
            style={{
              color: '#333333',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
            }}
          >
            Swift Goods × The Void
          </span>
        </div>

        {/* Bottom-anchored editorial content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-8 md:px-16 pb-24 md:pb-32">
            <p
              ref={labelRef}
              className="opacity-0 mb-7 text-[11px] tracking-[0.44em] uppercase inline-flex items-center gap-4"
              style={{
                color: '#c9a84c',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              <span
                className="block w-12 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              CAMPAIGN SS24
            </p>

            <h2
              ref={headlineRef}
              className="opacity-0 leading-none tracking-widest mb-8 uppercase"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                color: '#f5f5f5',
              }}
            >
              THE VOID
              <br />
              COLLECTION
            </h2>

            <p
              ref={subRef}
              className="opacity-0 max-w-md mb-12 leading-relaxed"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
                fontStyle: 'italic',
                color: '#888888',
              }}
            >
              A collection born from silence. Refined by obsession.
              Designed to make absence feel like presence.
            </p>

            <div ref={ctaRef} className="opacity-0">
              <LuxuryButton variant="outline" href="/collections/void">
                VIEW FULL CAMPAIGN
              </LuxuryButton>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade into panels */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #050505)' }}
        />
      </div>

      {/* ── 3 editorial panels in horizontal grid ─────────────────── */}
      <div
        ref={panelsRef}
        className="grid grid-cols-1 md:grid-cols-3"
      >
        {EDITORIAL_PANELS.map((panel) => (
          <div
            key={panel.num}
            className="editorial-panel relative overflow-hidden group cursor-pointer opacity-0"
            style={{ minHeight: '560px' }}
          >
            {/* Gradient background (no image required — works without assets) */}
            <div
              className="absolute inset-0 transition-transform duration-[800ms] ease-out group-hover:scale-110"
              style={{
                background: `linear-gradient(160deg, ${panel.gradientFrom} 0%, ${panel.gradientTo} 100%)`,
              }}
            />

            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.04,
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                backgroundSize: '180px 180px',
              }}
            />

            {/* Overlay — lightens on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-500 opacity-80 group-hover:opacity-60"
              style={{
                background:
                  'linear-gradient(to top, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.35) 60%, transparent 100%)',
              }}
            />

            {/* Left border accent — appears on hover */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)',
              }}
            />

            {/* Panel content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
              {/* Large number in gold/20 */}
              <span
                className="block leading-none mb-3"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '5.5rem',
                  color: 'rgba(201,168,76,0.18)',
                  letterSpacing: '0.06em',
                }}
              >
                {panel.num}
              </span>

              {/* Panel title */}
              <h3
                className="mb-3 tracking-widest leading-none"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.6rem',
                  color: '#f5f5f5',
                }}
              >
                {panel.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.875rem',
                  color: '#888888',
                }}
              >
                {panel.desc}
              </p>

              {/* Hover arrow */}
              <div
                className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400"
                style={{ color: '#c9a84c' }}
              >
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-body, Inter, sans-serif)' }}
                >
                  EXPLORE
                </span>
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path
                    d="M0 4H14M14 4L11 1M14 4L11 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Marquee brand quote banner ─────────────────────────────── */}
      <div
        className="overflow-hidden py-14"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="flex items-center gap-16 whitespace-nowrap"
          style={{ animation: 'sg-marquee 22s linear infinite' }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-16 flex-shrink-0">
              <span
                className="tracking-[0.32em] uppercase"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  color: '#222222',
                }}
              >
                COMFORT IS LUXURY
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>✦</span>
              <span
                className="tracking-[0.32em] uppercase"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  color: '#222222',
                }}
              >
                SWIFT GOODS
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sg-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
