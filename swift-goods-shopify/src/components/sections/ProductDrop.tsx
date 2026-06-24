'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

export default function ProductDrop() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        )
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      if (badgeRef.current) {
        tl.fromTo(badgeRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left center' },
          0
        )
      }

      if (labelRef.current) {
        tl.fromTo(labelRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power3.inOut' },
          0.2
        )
      }

      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.6
        )
      }

      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.8
        )
      }

      if (stripRef.current) {
        tl.fromTo(stripRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' },
          0.3
        )
      }

      if (counterRef.current) {
        tl.fromTo(counterRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          1.0
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', background: '#050505' }}
    >
      {/* Video background — portrait, covers full section */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/brand/sg-shorts-drop.mp4"
          poster="/brand/sg-shorts-drop-poster.jpeg"
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Dark overlays for text readability */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.7) 25%, rgba(5,5,5,0.35) 50%, rgba(5,5,5,0.15) 75%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 30%, transparent 70%, rgba(5,5,5,0.4) 100%)',
        }}
      />

      {/* Gold accent line — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{
          left: '3rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24">
          <div className="max-w-xl">

            {/* "NEW DROP" badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-3 mb-6"
              style={{ opacity: 0 }}
            >
              <span
                className="px-4 py-1.5"
                style={{
                  background: '#c9a84c',
                  color: '#050505',
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                }}
              >
                NEW DROP
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#c9a84c',
                  animation: 'pulse-gold 2s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  color: '#c9a84c',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                JUST DROPPED
              </span>
            </div>

            {/* Gold label */}
            <div
              ref={labelRef}
              className="inline-flex items-center gap-3 mb-6"
              style={{ opacity: 0 }}
            >
              <span
                className="block w-10 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                }}
              >
                SWIFT GOODS ESSENTIALS
              </span>
            </div>

            {/* Heading — split text reveal */}
            <SplitTextReveal
              text="THE SHORTS"
              tag="h2"
              stagger={0.04}
              duration={0.8}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                color: '#f5f5f5',
                letterSpacing: '0.06em',
                lineHeight: 0.95,
                margin: 0,
                marginBottom: '0.25rem',
              }}
            />
            <SplitTextReveal
              text="THAT MOVE."
              tag="h2"
              stagger={0.04}
              duration={0.8}
              delay={0.15}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                color: '#c9a84c',
                letterSpacing: '0.06em',
                lineHeight: 0.95,
                margin: 0,
                marginBottom: '1.5rem',
              }}
            />

            {/* Gold horizontal rule */}
            <div
              ref={stripRef}
              className="mb-6"
              style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.3))',
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
              }}
            />

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="mb-10"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'rgba(245,245,245,0.7)',
                maxWidth: '400px',
                opacity: 0,
              }}
            >
              Premium mesh-lined shorts built for the streets and beyond.
              Comfort you can feel. Style they can see.
            </p>

            {/* CTA buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
              <MagneticElement strength={0.3} radius={180}>
                <LuxuryButton
                  variant="primary"
                  size="lg"
                  href="/collections/shorts"
                  data-cursor="cta"
                >
                  SHOP THE SHORTS
                </LuxuryButton>
              </MagneticElement>
              <MagneticElement strength={0.25} radius={150}>
                <LuxuryButton
                  variant="ghost"
                  href="/collections/new-arrivals"
                >
                  ALL NEW ARRIVALS
                </LuxuryButton>
              </MagneticElement>
            </div>

            {/* Stock counter */}
            <div
              ref={counterRef}
              className="mt-8 flex items-center gap-3"
              style={{ opacity: 0 }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#c9a84c',
                  animation: 'pulse-gold 1.5s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.6875rem',
                  color: 'rgba(201,168,76,0.8)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Limited run — selling fast
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)',
        }}
      />
    </section>
  )
}
