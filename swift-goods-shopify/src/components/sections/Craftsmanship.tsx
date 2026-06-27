'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CraftPillar {
  number: string
  title: string
  body: string
}

interface CraftStat {
  value: string
  label: string
}

const CRAFT_PILLARS: CraftPillar[] = [
  {
    number: '01',
    title: 'PREMIUM FABRICS',
    body: 'Heavyweight 400gsm French terry. Brushed Italian cotton. Every thread chosen for how it feels against your skin — not just how it photographs.',
  },
  {
    number: '02',
    title: 'PRECISION FIT',
    body: 'Engineered silhouettes. No generic patterns. Every cut is intentional, every drape is deliberate.',
  },
  {
    number: '03',
    title: 'DETAIL OBSESSION',
    body: 'Reinforced seams. Custom-milled hardware. Embroidered labels. The details you feel but others can’t see — that’s where real luxury lives.',
  },
]

const CRAFT_STATS: CraftStat[] = [
  { value: '400GSM', label: 'French Terry' },
  { value: 'PRECISION', label: 'Engineered Fit' },
  { value: '3X', label: 'Quality Tested' },
  { value: 'PREMIUM', label: 'Materials Only' },
]

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const label = sectionRef.current?.querySelector('.craft-label')
      const heading = sectionRef.current?.querySelector('.craft-heading')
      const pillars = sectionRef.current?.querySelectorAll('.craft-pillar')
      const stats = sectionRef.current?.querySelectorAll('.craft-stat')
      const badge = sectionRef.current?.querySelector('.craft-badge')

      if (label) {
        gsap.fromTo(label,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: label, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      }

      if (heading) {
        gsap.fromTo(heading,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none none' },
          }
        )
      }

      if (pillars && pillars.length > 0) {
        gsap.fromTo(pillars,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.18,
            scrollTrigger: { trigger: pillars[0], start: 'top 82%', toggleActions: 'play none none none' },
          }
        )
      }

      if (stats && stats.length > 0) {
        gsap.fromTo(stats,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
            scrollTrigger: { trigger: stats[0], start: 'top 90%', toggleActions: 'play none none none' },
          }
        )
      }

      if (badge) {
        gsap.fromTo(badge,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: badge, start: 'top 92%', toggleActions: 'play none none none' },
          }
        )
      }
    }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent 100%)',
        }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent 100%)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.018,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '-8%',
          width: '45%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          right: '-5%',
          width: '35%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Corner brackets — desktop only */}
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
      <div
        className="absolute z-[6] hidden lg:flex items-center justify-center pointer-events-none"
        style={{
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.45rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          SWIFT GOODS &mdash; HANDCRAFTED QUALITY
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-32 w-full">

        {/* Header */}
        <div className="mb-20">
          {/* Gold label */}
          <div className="craft-label inline-flex items-center gap-4 mb-8 opacity-0">
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
              THE CRAFT
            </span>
          </div>

          {/* Heading */}
          <h2
            className="craft-heading opacity-0 leading-none tracking-wide"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: '#f5f5f5',
              textShadow: '0 4px 40px rgba(0,0,0,0.3)',
            }}
          >
            BUILT DIFFERENT
          </h2>
        </div>

        {/* Three craftsmanship pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-28">
          {CRAFT_PILLARS.map((pillar) => (
            <div key={pillar.title} className="craft-pillar opacity-0 group cursor-default">
              {/* Thin gold top border */}
              <div
                className="mb-8"
                style={{
                  width: '40%',
                  height: '1px',
                  background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.2), transparent)',
                }}
              />

              {/* Number */}
              <span
                className="block mb-4 text-[11px] tracking-[0.35em]"
                style={{
                  color: 'rgba(201,168,76,0.35)',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                }}
              >
                {pillar.number}
              </span>

              {/* Title */}
              <h3
                className="mb-6 leading-none tracking-wide"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  color: '#f5f5f5',
                  textShadow: '0 0 60px rgba(201,168,76,0.1)',
                }}
              >
                {pillar.title}
              </h3>

              {/* Gold divider */}
              <div
                className="mb-7 h-px transition-all duration-500 ease-out group-hover:w-20"
                style={{
                  width: '3rem',
                  background: 'linear-gradient(to right, #c9a84c, transparent)',
                }}
              />

              {/* Body */}
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.9375rem',
                  color: '#888',
                  lineHeight: 1.78,
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom detail strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-20">
          {CRAFT_STATS.map((stat) => (
            <div key={stat.label} className="craft-stat opacity-0 text-center">
              <span
                className="block mb-2"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#c9a84c',
                  lineHeight: 1,
                  textShadow: '0 0 40px rgba(201,168,76,0.15)',
                }}
              >
                {stat.value}
              </span>
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#888',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Authenticity badge */}
        <div className="craft-badge opacity-0 flex flex-col items-center text-center pt-8">
          {/* Diamond ornament */}
          <div className="flex items-center gap-4 mb-6">
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))',
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                background: '#c9a84c',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 10px rgba(201,168,76,0.3)',
              }}
            />
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))',
              }}
            />
          </div>

          {/* Authenticity text */}
          <p
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.625rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.4)',
            }}
          >
            AUTHENTICITY GUARANTEED
          </p>
        </div>
      </div>
    </section>
  )
}
