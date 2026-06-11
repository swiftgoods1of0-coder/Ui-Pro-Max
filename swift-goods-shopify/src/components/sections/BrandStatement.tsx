'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BRAND_PILLARS = [
  {
    title: 'PRECISION',
    body:
      'Every stitch, every seam, every silhouette is engineered with obsessive attention to detail. Nothing is accidental. Everything is intentional.',
  },
  {
    title: 'COMFORT',
    body:
      'We believe true luxury lives in how a garment feels in motion. Not just how it photographs — how it moves with you through every hour of your day.',
  },
  {
    title: 'PRESENCE',
    body:
      'What you wear shapes how you enter a room before you speak. Swift Goods dresses the version of you that commands attention without demanding it.',
  },
]

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Label animation
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Quote word-by-word stagger
      if (quoteRef.current) {
        const words = quoteRef.current.querySelectorAll('.quote-word')
        gsap.fromTo(
          words,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Pillars stagger animation
      if (pillarsRef.current) {
        const pillars = pillarsRef.current.querySelectorAll('.pillar-item')
        gsap.fromTo(
          pillars,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 80%',
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

  const quoteText = "We don't make clothes. We engineer comfort into an art form."
  const quoteWords = quoteText.split(' ')

  return (
    <section
      ref={sectionRef}
      id="brand-statement"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(201,168,76,0.8) 0px, rgba(201,168,76,0.8) 1px, transparent 1px, transparent 60px)',
        }}
      />

      {/* Left golden accent line */}
      <div
        className="absolute left-0 top-0 w-px h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.6) 40%, rgba(201,168,76,0.6) 60%, transparent 100%)',
        }}
      />

      {/* Right subtle line */}
      <div
        className="absolute right-0 top-0 w-px h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-32 w-full">
        {/* Label */}
        <div className="mb-16">
          <span
            ref={labelRef}
            className="inline-flex items-center gap-4 text-xs tracking-[0.4em] uppercase opacity-0"
            style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
          >
            <span
              className="inline-block w-12 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            The Philosophy
          </span>
        </div>

        {/* Large Quote */}
        <div className="mb-24 max-w-5xl" ref={quoteRef}>
          <blockquote
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontStyle: 'italic',
              color: '#f5f5f5',
              lineHeight: 1.15,
            }}
          >
            {quoteWords.map((word, i) => (
              <span key={i} className="quote-word inline-block opacity-0" style={{ marginRight: '0.28em' }}>
                {word}
              </span>
            ))}
          </blockquote>
          <div
            className="mt-8 h-px w-24"
            style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
          />
        </div>

        {/* Brand Pillars */}
        <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {BRAND_PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="pillar-item opacity-0 group">
              {/* Number */}
              <span
                className="block mb-4 text-xs tracking-[0.3em]"
                style={{ color: 'rgba(201,168,76,0.4)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
              >
                0{index + 1}
              </span>

              {/* Pillar Title */}
              <h3
                className="mb-6 leading-none tracking-wider"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {pillar.title}
              </h3>

              {/* Divider */}
              <div
                className="mb-6 h-px w-12 transition-all duration-500 group-hover:w-24"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />

              {/* Body Text */}
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.9375rem',
                  color: '#888888',
                  lineHeight: 1.75,
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
