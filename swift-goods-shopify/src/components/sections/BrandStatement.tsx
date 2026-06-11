'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface BrandPillar {
  title: string
  body: string
}

const BRAND_PILLARS: BrandPillar[] = [
  {
    title: 'PRECISION',
    body: 'Every stitch, every seam, every silhouette is engineered with obsessive attention to detail. Nothing is accidental. Everything is intentional.',
  },
  {
    title: 'COMFORT',
    body: 'True luxury lives in how a garment feels in motion — not just how it photographs. We engineer comfort that moves with you through every hour of your day.',
  },
  {
    title: 'PRESENCE',
    body: 'What you wear shapes how you enter a room before you speak. Swift Goods dresses the version of you that commands attention without demanding it.',
  },
]

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Label scroll animation
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Quote: split words stagger
      if (quoteRef.current) {
        const words = quoteRef.current.querySelectorAll<HTMLElement>('.quote-word')
        gsap.fromTo(
          words,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.055,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Pillars stagger on scroll
      if (pillarsRef.current) {
        const items = pillarsRef.current.querySelectorAll<HTMLElement>('.pillar-item')
        gsap.fromTo(
          items,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.18,
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 82%',
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

  const quoteWords = "We don't make clothes. We engineer comfort into an art form.".split(' ')

  return (
    <section
      ref={sectionRef}
      id="brand-statement"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Subtle diagonal stripe pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.022,
          backgroundImage:
            'repeating-linear-gradient(135deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 56px)',
        }}
      />

      {/* Left golden accent line */}
      <div
        className="absolute left-0 top-0 w-px h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.65) 35%, rgba(201,168,76,0.65) 65%, transparent 100%)',
        }}
      />

      {/* Right subtle accent line */}
      <div
        className="absolute right-0 top-0 w-px h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.12) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-32 w-full">

        {/* "THE PHILOSOPHY" label */}
        <div className="mb-16" ref={labelRef}>
          <div
            className="opacity-0 inline-flex items-center gap-4"
            style={{ opacity: 0 }}
          >
            <span
              className="block w-14 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            <span
              className="text-[11px] tracking-[0.42em] uppercase"
              style={{
                color: '#c9a84c',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              THE PHILOSOPHY
            </span>
          </div>
        </div>

        {/* Large quote */}
        <div className="mb-28 max-w-5xl" ref={quoteRef}>
          <blockquote
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(1.9rem, 4.8vw, 4.5rem)',
              fontStyle: 'italic',
              color: '#f5f5f5',
              lineHeight: 1.14,
            }}
          >
            {quoteWords.map((word, i) => (
              <span
                key={i}
                className="quote-word inline-block opacity-0"
                style={{ marginRight: '0.26em' }}
              >
                {word}
              </span>
            ))}
          </blockquote>
          <div
            className="mt-10 h-px w-20"
            style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
          />
        </div>

        {/* Brand pillars — 3 columns */}
        <div
          ref={pillarsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20"
        >
          {BRAND_PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="pillar-item opacity-0 group cursor-default">
              {/* Index number */}
              <span
                className="block mb-4 text-[11px] tracking-[0.35em]"
                style={{
                  color: 'rgba(201,168,76,0.35)',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                }}
              >
                0{index + 1}
              </span>

              {/* Pillar heading */}
              <h3
                className="mb-6 leading-none tracking-wide"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.6rem, 4vw, 4.2rem)',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {pillar.title}
              </h3>

              {/* Expanding divider */}
              <div
                className="mb-7 h-px transition-all duration-500 ease-out group-hover:w-20"
                style={{
                  width: '3rem',
                  background: 'linear-gradient(to right, #c9a84c, transparent)',
                }}
              />

              {/* Body text */}
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.9375rem',
                  color: '#888888',
                  lineHeight: 1.78,
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
