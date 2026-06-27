'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Benefit {
  number: string
  title: string
  body: string
}

const BENEFITS: Benefit[] = [
  {
    number: '01',
    title: 'EARLY ACCESS',
    body: 'First access to every drop. Before the public. Before the waitlist.',
  },
  {
    number: '02',
    title: 'PRIVATE STYLING',
    body: 'Complimentary one-on-one styling with our creative team.',
  },
  {
    number: '03',
    title: 'MEMBERS ONLY',
    body: 'Exclusive pieces. Private events. A world beyond the collection.',
  },
]

export default function ExclusiveAccess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [ctaHovered, setCtaHovered] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // SG monogram subtle parallax
      const monogram = sectionRef.current?.querySelector('.ea-monogram')
      if (monogram) {
        gsap.to(monogram, {
          y: 25, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        })
      }
    }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="inner-circle"
      className="relative overflow-hidden"
      style={{ background: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      {/* SG monogram watermark */}
      <div
        className="ea-monogram absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(18rem, 35vw, 30rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.03)',
          opacity: 1,
          whiteSpace: 'nowrap',
        }}
      >
        SG
      </div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.015,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Gold accent line on the left edge */}
      <div
        className="absolute left-0 top-0 w-px h-full pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent 100%)' }}
      />

      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          right: '-8%',
          width: '45%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '15%',
          left: '-5%',
          width: '30%',
          height: '30%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-32 w-full">

        {/* Header area */}
        <div className="mb-6">
          <div className="ea-label inline-flex items-center gap-4">
            <span className="block w-14 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span
              className="text-[11px] tracking-[0.42em] uppercase"
              style={{ color: '#c9a84c', fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}
            >
              PRIVATE CLIENT
            </span>
          </div>
        </div>

        <h2
          className="ea-heading mb-4"
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#f5f5f5',
            letterSpacing: '0.04em',
            lineHeight: 0.95,
            textShadow: '0 4px 40px rgba(0,0,0,0.3)',
          }}
        >
          THE INNER CIRCLE
        </h2>

        <p
          className="ea-subtitle mb-24 max-w-xl"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
            fontWeight: 300,
            lineHeight: 1.5,
            color: 'rgba(245,245,245,0.6)',
          }}
        >
          An exclusive world for those who demand more than fashion.
        </p>

        {/* Three benefit columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-24">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="ea-benefit group cursor-default">
              <span
                className="block mb-4 text-[11px] tracking-[0.35em]"
                style={{ color: 'rgba(201,168,76,0.35)', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
              >
                {benefit.number}
              </span>

              <h3
                className="mb-6 leading-none tracking-wide"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.4rem, 4vw, 4rem)',
                  color: '#c9a84c',
                  textShadow: '0 0 60px rgba(201,168,76,0.15)',
                }}
              >
                {benefit.title}
              </h3>

              <div
                className="mb-7 h-px transition-all duration-500 ease-out group-hover:w-20"
                style={{ width: '3rem', background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />

              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.9375rem',
                  color: '#888',
                  lineHeight: 1.78,
                }}
              >
                {benefit.body}
              </p>
            </div>
          ))}
        </div>

        {/* Ornamental diamond divider */}
        <div className="flex items-center justify-center gap-4 mb-20">
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))' }} />
          <div style={{ width: 6, height: 6, background: '#c9a84c', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(201,168,76,0.3)' }} />
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))' }} />
        </div>

        {/* CTA area */}
        <div className="ea-cta flex flex-col items-center text-center">
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.45)',
            }}
          >
            BY INVITATION ONLY
          </p>

          <a
            href="#shop"
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: 'inline-block',
              border: ctaHovered ? '1px solid rgba(201,168,76,1)' : '1px solid rgba(201,168,76,0.6)',
              background: ctaHovered ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: ctaHovered ? '#e6c870' : '#c9a84c',
              padding: '1rem 3rem',
              letterSpacing: '0.3em',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontWeight: 500,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: ctaHovered ? '0 0 30px rgba(201,168,76,0.15)' : 'none',
            }}
          >
            REQUEST ACCESS
          </a>

          <p
            className="mt-6"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: '0.75rem',
              color: 'rgba(245,245,245,0.25)',
              letterSpacing: '0.1em',
            }}
          >
            By application only.
          </p>
        </div>
      </div>
    </section>
  )
}
