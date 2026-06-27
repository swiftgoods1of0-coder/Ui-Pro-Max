'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.fromTo(videoRef.current,
          { scale: 1.05 },
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
      style={{ background: 'var(--sg-frost, #F7F6F3)' }}
    >
      {/* Top gold accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)' }}
      />

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">

        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span
              className="block w-10 h-px"
              style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                color: '#a08535',
              }}
            >
              NEW DROP
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                boxShadow: '0 0 10px rgba(201,168,76,0.5)',
                animation: 'pulse-gold 2s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span
              className="block w-10 h-px"
              style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }}
            />
          </div>

          <SplitTextReveal
            text="THE SHORTS THAT MOVE."
            tag="h2"
            stagger={0.04}
            duration={0.8}
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              color: '#1a1a1a',
              letterSpacing: '0.04em',
              lineHeight: 0.95,
              margin: 0,
            }}
          />

          <div className="flex justify-center mt-6 mb-8">
            <div
              style={{
                width: 80,
                height: 2,
                background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
              }}
            />
          </div>

          <p
            className="max-w-lg mx-auto"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
              lineHeight: 1.7,
              color: '#6b6560',
            }}
          >
            Crafted from premium ultra-soft stretch fabric for effortless movement,
            all-day comfort, and a refined luxury feel.
          </p>
        </div>

        {/* Two-column showcase: video + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20">

          {/* Video showcase */}
          <div className="relative group overflow-hidden" style={{ background: '#fff' }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '680px' }}>
              <video
                ref={videoRef}
                src="/brand/sg-shorts-clean.mp4"
                muted
                loop
                playsInline
                preload="metadata"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  background: '#fff',
                  willChange: 'transform',
                }}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            />
          </div>

          {/* Image showcase */}
          <div className="relative group overflow-hidden" style={{ background: '#fff' }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '680px' }}>
              <Image
                src="/brand/sg-shorts-lineup.png"
                alt="Swift Goods Shorts Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ background: '#fff' }}
                quality={90}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            />
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-12">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div
                style={{
                  width: 1,
                  height: 24,
                  background: 'linear-gradient(to bottom, #c9a84c, rgba(201,168,76,0.15))',
                  flexShrink: 0,
                }}
              />
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#1a1a1a',
                    marginBottom: 2,
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
                    color: '#a08535',
                    letterSpacing: '0.04em',
                  }}
                >
                  {f.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Specs line */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3">
            <div className="h-px" style={{ width: 20, background: 'rgba(201,168,76,0.35)' }} />
            <span
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.5625rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#a08535',
              }}
            >
              Performance &middot; Comfort &middot; Style &middot; Perfected
            </span>
            <div className="h-px" style={{ width: 20, background: 'rgba(201,168,76,0.35)' }} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
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

      {/* Bottom gold accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)' }}
      />
    </section>
  )
}
