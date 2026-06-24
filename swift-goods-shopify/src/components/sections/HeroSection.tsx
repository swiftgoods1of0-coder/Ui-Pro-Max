'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ken Burns slow zoom on background
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { scale: 1.0 },
          { scale: 1.12, duration: 20, ease: 'none', repeat: -1, yoyo: true }
        )
      }

      const tl = gsap.timeline({ delay: 0.4 })

      // Label: clip-path reveal from left
      tl.fromTo(
        labelRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.9, ease: 'power3.out' },
        0
      )

      // Heading: clip-path reveal from left with delay
      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut' },
        0.2
      )

      // Subtitle: clip-path reveal from bottom
      tl.fromTo(
        subtitleRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.85, ease: 'power2.out' },
        0.65
      )

      // CTAs: clip-path reveal from bottom
      tl.fromTo(
        ctasRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.75, ease: 'power2.out' },
        0.9
      )

      // Scroll indicator: fade in
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        1.3
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '100vh', background: '#050505' }}
    >
      {/* ── Background: Night Supra photograph ── */}
      <div ref={bgImageRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
        <Image
          src="/brand/sg-night-supra.jpeg"
          alt="Swift Goods night scene with Supra"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          style={{
            filter: 'brightness(0.7) contrast(1.15) saturate(1.1)',
          }}
        />
      </div>

      {/* ── Radial dark vignette ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 0%, rgba(5,5,5,0.25) 30%, rgba(5,5,5,0.6) 55%, rgba(5,5,5,0.92) 85%, #050505 100%)',
        }}
      />

      {/* ── Top edge gradient ── */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: '25vh',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.6), transparent)',
        }}
      />

      {/* ── Bottom fade to page background ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: '35vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.6) 40%, #050505 100%)',
        }}
      />

      {/* ── Subtle film grain texture ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── Cinematic letterbox bars (subtle) ── */}
      <div
        className="absolute top-0 left-0 right-0 z-[4] pointer-events-none"
        style={{
          height: '4vh',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none"
        style={{
          height: '4vh',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        }}
      />

      {/* ── Content layer ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-5xl mx-auto w-full">

          {/* Brand label */}
          <div
            ref={labelRef}
            className="opacity-0 mb-10 flex items-center justify-center gap-5"
          >
            <span
              className="block h-px flex-shrink-0"
              style={{
                width: '3rem',
                background: 'linear-gradient(to right, transparent, #c9a84c)',
              }}
            />
            <span
              className="text-[10px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.42em] uppercase whitespace-nowrap"
              style={{
                color: '#c9a84c',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
                letterSpacing: '0.35em',
              }}
            >
              Swift Goods Clothing Brand&nbsp;&nbsp;&middot;&nbsp;&nbsp;Est. 2025
            </span>
            <span
              className="block h-px flex-shrink-0"
              style={{
                width: '3rem',
                background: 'linear-gradient(to left, transparent, #c9a84c)',
              }}
            />
          </div>

          {/* Headline */}
          <h1
            ref={headingRef}
            className="opacity-0 leading-none tracking-widest uppercase select-none mb-8"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3.5rem, 12vw, 10rem)',
              color: '#ffffff',
              textShadow: '0 4px 60px rgba(0,0,0,0.5), 0 0 120px rgba(0,0,0,0.3)',
            }}
          >
            COMFORT IS LUXURY.
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="opacity-0 mb-14 max-w-lg mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
              fontStyle: 'italic',
              color: '#888888',
              letterSpacing: '0.04em',
            }}
          >
            Designed for movement. Built for presence.
          </p>

          {/* CTA buttons */}
          <div
            ref={ctasRef}
            className="opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <LuxuryButton variant="primary" href="/collections">
              SHOP COLLECTION
            </LuxuryButton>
            <LuxuryButton variant="ghost" href="#experience">
              EXPLORE THE EXPERIENCE
            </LuxuryButton>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span
          className="text-[10px] tracking-[0.42em] uppercase"
          style={{
            color: '#555555',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          SCROLL
        </span>
        <div
          className="relative w-px overflow-hidden"
          style={{
            height: '4rem',
            background: 'rgba(201,168,76,0.12)',
          }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '50%',
              background: 'linear-gradient(to bottom, #c9a84c, transparent)',
              animation: 'sg-scroll-line 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
