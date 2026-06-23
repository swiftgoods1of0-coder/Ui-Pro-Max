'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const QUOTE_WORDS = [
  'The', 'most', 'powerful', 'thing', 'you', 'can', 'wear',
  'is', 'something', 'built', 'for', 'you.',
]

export default function SignatureMoment() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const creditRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Photo: slight parallax on scroll
      gsap.fromTo(
        photoRef.current,
        { y: -40 },
        {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )

      // Label: clip-path reveal from left
      gsap.fromTo(
        labelRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Quote: word-by-word stagger reveal
      if (quoteRef.current) {
        const words = quoteRef.current.querySelectorAll<HTMLSpanElement>('.sig-word')
        gsap.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none none',
            },
          },
        )
      }

      // Rule: scaleX from 0 to 1
      gsap.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 45%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Credit: fade in
      gsap.fromTo(
        creditRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            toggleActions: 'play none none none',
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
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* ── Desktop layout: left content (45%) | gold divider | right photo (55%) ── */}
      {/* ── Mobile: photo full-width behind content with heavy overlay ── */}

      {/* Photo — right 55% on desktop, full-width on mobile */}
      <div className="absolute inset-0 lg:left-[45%] lg:right-0">
        <div ref={photoRef} className="relative w-full h-[120%] -top-[10%]">
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

      {/* Left content area — solid dark on desktop */}
      <div
        className="absolute inset-y-0 left-0 w-[45%] hidden lg:block"
        style={{ background: '#0a0a0a' }}
      />

      {/* Vertical gold divider — desktop only */}
      <div
        className="absolute top-0 bottom-0 left-[45%] w-px hidden lg:block z-10"
        style={{
          background:
            'linear-gradient(to bottom, transparent 5%, rgba(201,168,76,0.35) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.35) 70%, transparent 95%)',
        }}
      />

      {/* Content overlay — positioned left on desktop, centered on mobile */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full lg:w-[45%] px-8 sm:px-12 lg:px-16 xl:px-24 py-24">
          {/* Gold label */}
          <span
            ref={labelRef}
            className="inline-block opacity-0 mb-8"
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
          <div ref={quoteRef} className="mb-10">
            <p
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.25,
                color: '#f5f5f5',
                letterSpacing: '-0.01em',
              }}
            >
              &ldquo;
              {QUOTE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="sig-word inline-block opacity-0"
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
            ref={ruleRef}
            className="mb-8 origin-left"
            style={{
              width: '100%',
              maxWidth: '280px',
              height: '1px',
              background:
                'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.3), transparent)',
              transform: 'scaleX(0)',
            }}
          />

          {/* Brand credit */}
          <p
            ref={creditRef}
            className="opacity-0"
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
            &mdash; SWIFT GOODS, EST. 2024
          </p>
        </div>
      </div>
    </section>
  )
}
