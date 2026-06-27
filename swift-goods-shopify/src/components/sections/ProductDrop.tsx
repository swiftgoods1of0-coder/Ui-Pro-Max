'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

const FEATURES = [
  { label: 'ULTRA-SOFT', detail: 'Premium Stretch Fabric' },
  { label: '4-WAY STRETCH', detail: 'Unrestricted Movement' },
  { label: 'QUICK-DRY', detail: 'All-Day Performance' },
]

const MARQUEE_TEXT = 'SWIFT GOODS — COMFORT IS LUXURY — DESIGNED FOR MOVEMENT — BUILT FOR PRESENCE — '

export default function ProductDrop() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const editionRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Video parallax zoom
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { scale: 1.18 },
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

      // Ambient glow pulse
      if (glowRef.current) {
        gsap.fromTo(glowRef.current,
          { opacity: 0.4 },
          { opacity: 0.7, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true }
        )
      }

      // Edition number parallax
      if (editionRef.current) {
        gsap.to(editionRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Video play/pause on visibility
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
      {/* Video background */}
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

      {/* Layered overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,5,0.93) 0%, rgba(5,5,5,0.78) 28%, rgba(5,5,5,0.4) 52%, rgba(5,5,5,0.12) 78%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 22%, transparent 78%, rgba(5,5,5,0.55) 100%)',
        }}
      />

      {/* Gold radial glow behind text */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          left: '-5%',
          top: '25%',
          width: '55%',
          height: '55%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Gold accent line — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{
          left: '3rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.45) 15%, rgba(201,168,76,0.45) 85%, transparent)',
        }}
      />

      {/* Corner brackets */}
      <div
        className="absolute hidden lg:block pointer-events-none"
        style={{ top: '2rem', left: '4.5rem' }}
      >
        <div style={{ width: 50, height: 50, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 28, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </div>
      <div
        className="absolute hidden lg:block pointer-events-none"
        style={{ bottom: '4.5rem', right: '3rem' }}
      >
        <div style={{ width: 50, height: 50, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 1, background: 'rgba(201,168,76,0.5)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 28, background: 'rgba(201,168,76,0.5)' }} />
        </div>
      </div>

      {/* Giant floating edition number */}
      <div
        ref={editionRef}
        className="absolute hidden lg:block pointer-events-none select-none"
        style={{
          right: '6%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(10rem, 18vw, 20rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.12)',
          }}
        >
          01
        </span>
        <span
          className="block"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.5rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.2)',
            textAlign: 'right',
            marginTop: '-1rem',
          }}
        >
          EDITION
        </span>
      </div>

      {/* Vertical side text */}
      <div
        className="absolute hidden lg:flex items-center justify-center pointer-events-none"
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
            fontSize: '0.5rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          SWIFT GOODS &mdash; SS25 COLLECTION &mdash; LIMITED EDITION
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-28">
          <div className="max-w-2xl">

            {/* "NEW DROP" badge */}
            <div
              className="inline-flex items-center gap-3 mb-8"
            >
              <span
                className="px-5 py-2"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  color: '#050505',
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.22em',
                  fontWeight: 600,
                }}
              >
                NEW DROP
              </span>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  boxShadow: '0 0 12px rgba(201,168,76,0.7), 0 0 24px rgba(201,168,76,0.3)',
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
              className="inline-flex items-center gap-3 mb-8"
            >
              <span
                className="block w-14 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                }}
              >
                SWIFT GOODS ESSENTIALS
              </span>
              <span
                className="block w-14 h-px"
                style={{ background: 'linear-gradient(to left, #c9a84c, transparent)' }}
              />
            </div>

            {/* Heading */}
            <SplitTextReveal
              text="THE SHORTS"
              tag="h2"
              stagger={0.04}
              duration={0.8}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                color: '#f5f5f5',
                letterSpacing: '0.06em',
                lineHeight: 0.9,
                margin: 0,
                marginBottom: '0.1rem',
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
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
                fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                color: '#c9a84c',
                letterSpacing: '0.06em',
                lineHeight: 0.9,
                margin: 0,
                marginBottom: '2.5rem',
                textShadow: '0 0 60px rgba(201,168,76,0.15)',
              }}
            />

            {/* Gold horizontal rule */}
            <div
              className="mb-10"
              style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.15))',
              }}
            />

            {/* Description */}
            <div
              className="mb-10"
              style={{ maxWidth: '460px' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                  marginBottom: '1.25rem',
                }}
              >
                Performance &nbsp;&middot;&nbsp; Comfort &nbsp;&middot;&nbsp; Style &nbsp;&middot;&nbsp; Perfected
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(245,245,245,0.5)',
                }}
              >
                Crafted from premium ultra-soft stretch fabric for effortless movement, all-day comfort, and a refined luxury feel wherever the day takes you.
              </p>
            </div>

            {/* Product features */}
            <div
              className="flex flex-wrap gap-8 mb-12"
            >
              {FEATURES.map((f, i) => (
                <div key={f.label} className="feature-item flex items-start gap-3">
                  {/* Vertical gold line */}
                  <div
                    className="mt-0.5 flex-shrink-0"
                    style={{
                      width: 1,
                      height: 28,
                      background: 'linear-gradient(to bottom, #c9a84c, rgba(201,168,76,0.15))',
                    }}
                  />
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body, Inter, sans-serif)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: '#f5f5f5',
                        marginBottom: 3,
                      }}
                    >
                      {f.label}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                        fontStyle: 'italic',
                        fontSize: '0.75rem',
                        color: 'rgba(201,168,76,0.5)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {f.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complimentary shipping note */}
            <div
              className="mb-12"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-px flex-shrink-0"
                  style={{ width: 24, background: 'rgba(201,168,76,0.3)' }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,168,76,0.5)',
                  }}
                >
                  COMPLIMENTARY SHIPPING WORLDWIDE
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
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

          </div>
        </div>
      </div>

      {/* Bottom marquee ticker */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
        style={{
          height: '3rem',
          borderTop: '1px solid rgba(201,168,76,0.08)',
          background: 'linear-gradient(to top, rgba(5,5,5,0.95), rgba(5,5,5,0.6))',
        }}
      >
        <div
          className="flex items-center h-full whitespace-nowrap"
          style={{ animation: 'sg-marquee 25s linear infinite' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: '0.9rem',
                letterSpacing: '0.25em',
                color: 'rgba(201,168,76,0.12)',
                paddingRight: '2rem',
              }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        className="absolute bottom-12 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
        }}
      />
    </section>
  )
}
