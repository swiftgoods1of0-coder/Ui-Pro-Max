'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Parallax on background
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: -40 },
          {
            y: 40, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          }
        )
      }

      gsap.from(labelRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from(headingRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from(subtitleRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 1.0,
        delay: 0.15,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from(ctaRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 0.8,
        delay: 0.25,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '70vh' }}
    >
      {/* Corner brackets */}
      <div className="absolute hidden lg:block pointer-events-none" style={{ top: '3rem', left: '3rem' }}>
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 1, background: 'rgba(201,168,76,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 20, background: 'rgba(201,168,76,0.4)' }} />
        </div>
      </div>
      <div className="absolute hidden lg:block pointer-events-none" style={{ bottom: '3rem', right: '3rem' }}>
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 1, background: 'rgba(201,168,76,0.4)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 20, background: 'rgba(201,168,76,0.4)' }} />
        </div>
      </div>

      {/* Background image with parallax */}
      <div ref={bgRef} className="absolute inset-0" style={{ top: '-40px', bottom: '-40px', willChange: 'transform' }}>
        <Image
          src="/brand/sg-supra-brown-black.jpeg"
          alt="Swift Goods — limited release"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      {/* Heavy dark gradient overlay from left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.82) 30%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.2) 80%, transparent 100%)',
        }}
      />

      {/* Additional bottom gradient for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,5,0.6) 0%, transparent 40%)',
        }}
      />

      {/* Gold radial ambient glow */}
      <div className="absolute z-[3] pointer-events-none" style={{ left: '50%', top: '40%', width: '60%', height: '60%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />

      {/* Content — left-aligned */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '70vh' }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 py-24">
          <div className="max-w-xl">
            {/* Gold label */}
            <span
              ref={labelRef}
              className="inline-block mb-6"
              style={{
                fontFamily: 'var(--font-body, "Inter", sans-serif)',
                fontSize: '0.625rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                color: '#c9a84c',
              }}
            >
              LIMITED RELEASE
            </span>

            {/* Heading — split text reveal */}
            <div ref={headingRef} className="mb-6">
              <SplitTextReveal
                text="DON'T JUST WEAR IT."
                tag="h2"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  color: '#f5f5f5',
                  letterSpacing: '0.04em',
                  lineHeight: 0.95,
                  margin: 0,
                }}
              />
              <SplitTextReveal
                text="OWN IT."
                tag="h2"
                delay={0.3}
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  color: '#c9a84c',
                  letterSpacing: '0.04em',
                  lineHeight: 0.95,
                  margin: 0,
                  textShadow: '0 0 60px rgba(201,168,76,0.2)',
                }}
              />
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mb-10"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                fontWeight: 300,
                lineHeight: 1.5,
                color: 'rgba(245,245,245,0.7)',
                maxWidth: '420px',
              }}
            >
              Premium quality. Limited quantities. Once it&apos;s gone, it&apos;s gone.
            </p>

            {/* CTA button — magnetic */}
            <div ref={ctaRef}>
              <MagneticElement strength={0.3} radius={180}>
                <LuxuryButton
                  variant="primary"
                  size="lg"
                  href="#shop"
                  data-cursor="cta"
                >
                  SHOP THE COLLECTION
                </LuxuryButton>
              </MagneticElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
