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

export default function ProductDrop() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

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

      if (glowRef.current) {
        gsap.fromTo(glowRef.current,
          { opacity: 0.4 },
          { opacity: 0.7, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true }
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
      { threshold: 0.2 }
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
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src="/brand/sg-shorts-drop.mp4"
          poster="/brand/sg-shorts-drop-poster.jpeg"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 30%, rgba(5,5,5,0.3) 55%, rgba(5,5,5,0.1) 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 25%, transparent 75%, rgba(5,5,5,0.5) 100%)',
        }}
      />

      {/* Gold glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          left: '-5%',
          top: '25%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
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

      {/* Gold accent line — left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{
          left: '3rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 20%, rgba(201,168,76,0.4) 80%, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center" style={{ minHeight: '100vh' }}>
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-28">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8">
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
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                  boxShadow: '0 0 12px rgba(201,168,76,0.7)',
                  animation: 'pulse-gold 2s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Label */}
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="block w-14 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
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
            </div>

            {/* Heading */}
            <SplitTextReveal
              text="THE SHORTS"
              tag="h2"
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

            {/* Gold rule */}
            <div
              className="mb-10"
              style={{
                width: 120,
                height: 2,
                background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.15))',
              }}
            />

            {/* Description */}
            <div className="mb-10" style={{ maxWidth: 460 }}>
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

            {/* Features */}
            <div className="flex flex-wrap gap-8 mb-12">
              {FEATURES.map((f) => (
                <div key={f.label} className="flex items-start gap-3">
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
                      }}
                    >
                      {f.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticElement strength={0.3} radius={180}>
                <LuxuryButton variant="primary" size="lg" href="/collections/shorts" data-cursor="cta">
                  SHOP THE SHORTS
                </LuxuryButton>
              </MagneticElement>
              <MagneticElement strength={0.25} radius={150}>
                <LuxuryButton variant="ghost" href="/collections/new-arrivals">
                  ALL NEW ARRIVALS
                </LuxuryButton>
              </MagneticElement>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom gold accent */}
      <div
        className="absolute bottom-12 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}
      />
    </section>
  )
}
