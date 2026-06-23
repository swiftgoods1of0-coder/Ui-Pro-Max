'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
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
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/brand/sg-solo-cream.jpeg"
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

            {/* Heading */}
            <h2
              ref={headingRef}
              className="mb-6 leading-none"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                color: '#f5f5f5',
                letterSpacing: '0.04em',
                lineHeight: 0.95,
              }}
            >
              DON&apos;T JUST WEAR IT.
              <br />
              OWN IT.
            </h2>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mb-10"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 300,
                lineHeight: 1.5,
                color: 'rgba(245,245,245,0.7)',
                maxWidth: '420px',
              }}
            >
              Premium quality. Limited quantities. Once it&apos;s gone, it&apos;s gone.
            </p>

            {/* CTA button */}
            <div ref={ctaRef}>
              <LuxuryButton
                variant="primary"
                size="lg"
                href="#shop"
                data-cursor="cta"
              >
                SHOP THE COLLECTION
              </LuxuryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
