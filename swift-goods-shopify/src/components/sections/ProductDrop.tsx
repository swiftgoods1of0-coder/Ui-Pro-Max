'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

const FEATURES = [
  { label: 'ULTRA-SOFT', detail: 'Premium Stretch Fabric' },
  { label: '4-WAY STRETCH', detail: 'Unrestricted Movement' },
  { label: 'QUICK-DRY', detail: 'All-Day Performance' },
]

export default function ProductDrop() {
  const videoRef = useRef<HTMLVideoElement>(null)

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
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--sg-frost, #F7F6F3)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="block w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }} />
            <span
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#a08535',
              }}
            >
              NEW DROP
            </span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                boxShadow: '0 0 8px rgba(201,168,76,0.5)',
                animation: 'pulse-gold 2s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span className="block w-8 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }} />
          </div>

          <SplitTextReveal
            text="THE SHORTS THAT MOVE."
            tag="h2"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
              color: '#1a1a1a',
              letterSpacing: '0.04em',
              lineHeight: 0.95,
              margin: 0,
            }}
          />

          <div className="flex justify-center mt-5 mb-6">
            <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />
          </div>

          <p
            className="max-w-md mx-auto"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              lineHeight: 1.7,
              color: '#6b6560',
            }}
          >
            Crafted from premium ultra-soft stretch fabric for effortless movement,
            all-day comfort, and a refined luxury feel.
          </p>
        </div>

        {/* Product showcase — video left, image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 mb-14">

          {/* Video */}
          <div
            className="relative group mx-auto w-full overflow-hidden"
            style={{
              background: '#fff',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            }}
          >
            <video
              ref={videoRef}
              src="/brand/sg-shorts-clean.mp4"
              poster="/brand/sg-shorts-clean-poster.jpeg"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '9/12',
                objectFit: 'cover',
                background: '#fff',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            />
          </div>

          {/* Image */}
          <div
            className="relative group mx-auto w-full overflow-hidden"
            style={{
              background: '#fff',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
              <Image
                src="/brand/sg-shorts-lineup.png"
                alt="Swift Goods Shorts Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ background: '#fff', padding: '5%' }}
                quality={90}
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-10">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div
                style={{
                  width: 1,
                  height: 22,
                  background: 'linear-gradient(to bottom, #c9a84c, rgba(201,168,76,0.15))',
                  flexShrink: 0,
                }}
              />
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.6rem',
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
                    fontSize: '0.7rem',
                    color: '#a08535',
                  }}
                >
                  {f.detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
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

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)' }}
      />
    </section>
  )
}
