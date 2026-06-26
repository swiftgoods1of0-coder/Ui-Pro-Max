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
      style={{ minHeight: 'clamp(450px, 60vh, 85vh)' }}
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

      {/* Heavy dark gradient overlay from left — desktop directional, mobile full */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.82) 30%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.2) 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.8) 40%, rgba(5,5,5,0.5) 70%, rgba(5,5,5,0.3) 100%)',
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

      {/* Vertical side text — right edge */}
      <div className="absolute z-[6] hidden lg:flex items-center justify-center pointer-events-none" style={{ right: '1.5rem', top: '50%', transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'center center' }}>
        <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.45rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.15)', whiteSpace: 'nowrap' }}>
          SWIFT GOODS &mdash; LIMITED RELEASE &mdash; SHOP NOW
        </span>
      </div>

      {/* Gold accent line — left side */}
      <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block" style={{ left: '3rem', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.35) 20%, rgba(201,168,76,0.35) 80%, transparent)' }} />

      {/* Film grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.02, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)', backgroundSize: '100% 4px' }} />

      {/* SG monogram watermark */}
      <div
        className="absolute pointer-events-none select-none hidden lg:block"
        aria-hidden="true"
        style={{
          top: '50%',
          right: '5%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(18rem, 35vw, 35rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.03)',
          whiteSpace: 'nowrap',
        }}
      >
        SG
      </div>

      {/* Gold radial ambient glow */}
      <div className="absolute z-[3] pointer-events-none" style={{ left: '50%', top: '40%', width: '60%', height: '60%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />

      {/* Content — left-aligned */}
      <div className="relative z-10 flex items-center" style={{ minHeight: 'clamp(450px, 60vh, 85vh)' }}>
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
                  fontSize: 'clamp(2.2rem, 7vw, 7rem)',
                  color: '#f5f5f5',
                  letterSpacing: '0.04em',
                  lineHeight: 0.95,
                  margin: 0,
                  textShadow: '0 4px 40px rgba(0,0,0,0.3)',
                }}
              />
              <SplitTextReveal
                text="OWN IT."
                tag="h2"
                delay={0.3}
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                  color: '#c9a84c',
                  letterSpacing: '0.04em',
                  lineHeight: 0.95,
                  margin: 0,
                  textShadow: '0 0 80px rgba(201,168,76,0.25), 0 4px 40px rgba(0,0,0,0.3)',
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

            {/* Urgency element */}
            <div className="mt-10 flex items-center gap-3">
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'linear-gradient(135deg, #c9a84c, #e6c870)', boxShadow: '0 0 10px rgba(201,168,76,0.5), 0 0 20px rgba(201,168,76,0.2)', animation: 'pulse-gold 1.5s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.625rem', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Limited quantities &mdash; Don&apos;t miss out
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
