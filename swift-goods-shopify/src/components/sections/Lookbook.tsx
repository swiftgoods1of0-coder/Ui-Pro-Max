'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import SplitTextReveal from '@/components/ui/SplitTextReveal'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'

interface LookbookSlide {
  id: string
  src: string
  alt: string
  collection: string
  href: string
}

const SLIDES: LookbookSlide[] = [
  {
    id: '01',
    src: '/brand/sg-supra-brown-black.jpeg',
    alt: 'Two guys in Swift Goods sets leaning on red Supra at night',
    collection: 'SUPRA SESSIONS',
    href: '/collections/supra-sessions',
  },
  {
    id: '02',
    src: '/brand/sg-solo-black.jpeg',
    alt: 'Solo portrait, black hoodie stepping out of car',
    collection: 'NOIR ESSENTIALS',
    href: '/collections/noir-essentials',
  },
  {
    id: '03',
    src: '/brand/sg-folded-crewnecks.jpeg',
    alt: 'Folded cream crewnecks with blue SG branding',
    collection: 'CREAM COLLECTION',
    href: '/collections/cream',
  },
  {
    id: '04',
    src: '/brand/sg-fountain-night.jpeg',
    alt: 'Night scene by fountain wearing Swift Goods',
    collection: 'NIGHT MOVES',
    href: '/collections/night-moves',
  },
  {
    id: '05',
    src: '/brand/sg-parking-lot-night.jpeg',
    alt: 'Parking lot night session with dramatic backlighting',
    collection: 'AFTER DARK',
    href: '/collections/after-dark',
  },
]

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null)
  const velocity = useScrollVelocity()

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.lb-card-img')
    if (cards) {
      const skew = velocity * 2
      cards.forEach((img) => {
        img.style.transition = 'transform 200ms ease-out'
        img.style.transform = `skewY(${skew}deg) scale(${1 + Math.abs(velocity) * 0.03})`
      })
    }
  }, [velocity])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.lb-card')
      if (!cards) return

      cards.forEach((card) => {
        const img = card.querySelector('.lb-card-img')
        const overlay = card.querySelector('.lb-card-overlay')

        if (img) {
          gsap.from(img, {
            scale: 1.15,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
          // Parallax drift
          gsap.fromTo(img,
            { y: -15 },
            {
              y: 15, ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.3 },
            }
          )
        }

        if (overlay) {
          gsap.from(overlay, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="lookbook"
      style={{ background: '#050505' }}
      className="relative py-28 overflow-hidden"
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.015,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '15%',
          left: '-8%',
          width: '35%',
          height: '35%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <span
              className="block w-12 h-px"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '11px',
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: '#c9a84c',
                fontWeight: 500,
              }}
            >
              THE LOOKBOOK
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SplitTextReveal
              text="CAMPAIGN 2025"
              tag="h2"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                color: '#f5f5f5',
                lineHeight: 0.95,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: '0 4px 40px rgba(0,0,0,0.3)',
              }}
            />
            <p
              className="max-w-xs lg:text-right"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: '#666',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Five frames. One story. Explore the world of Swift Goods.
            </p>
          </div>
        </div>

        {/* Masonry grid — alternating large/small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SLIDES.map((slide, idx) => {
            const isWide = idx === 0 || idx === 4
            return (
              <div
                key={slide.id}
                className={`lb-card group relative overflow-hidden cursor-pointer ${
                  isWide ? 'md:col-span-2' : ''
                }`}
                style={{
                  height: isWide ? 'clamp(220px, 45vw, 600px)' : 'clamp(200px, 40vw, 520px)',
                  transition: 'box-shadow 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 50px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.05)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div className="lb-card-img absolute inset-0">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes={isWide ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    opacity: 0.6,
                    background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 40%, transparent 70%)',
                  }}
                />

                {/* Gold border on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ border: '1px solid rgba(201,168,76,0.3)' }}
                />

                {/* Content */}
                <div className="lb-card-overlay absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                  <span
                    className="block mb-2"
                    style={{
                      fontFamily: 'var(--font-body, Inter, sans-serif)',
                      fontSize: '10px',
                      letterSpacing: '0.35em',
                      color: 'rgba(201,168,76,0.6)',
                    }}
                  >
                    {slide.id}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                      fontSize: isWide ? 'clamp(2rem, 3.5vw, 3rem)' : 'clamp(1.5rem, 2.5vw, 2.2rem)',
                      color: '#f5f5f5',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      margin: 0,
                      marginBottom: '0.75rem',
                      lineHeight: 1.2,
                      textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    {slide.collection}
                  </h3>
                  <LuxuryButton variant="ghost" size="sm" href={slide.href}>
                    VIEW COLLECTION
                  </LuxuryButton>
                </div>
              </div>
            )
          })}
        </div>

        {/* Section CTA */}
        <div className="mt-16 flex justify-center">
          <MagneticElement strength={0.25} radius={160}>
            <LuxuryButton variant="secondary" href="/lookbook">
              VIEW FULL LOOKBOOK
            </LuxuryButton>
          </MagneticElement>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="mt-20 overflow-hidden"
        style={{
          borderTop: '1px solid rgba(201,168,76,0.08)',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          padding: '1.25rem 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4rem',
            whiteSpace: 'nowrap',
            animation: 'sg-marquee 22s linear infinite',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4rem',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222',
                }}
              >
                COMFORT IS LUXURY
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>
                &#x2726;
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222',
                }}
              >
                SWIFT GOODS
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>
                &#x2726;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
