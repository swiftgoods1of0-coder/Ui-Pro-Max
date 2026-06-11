'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#050505' }} />,
})

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo(
        labelRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.8, ease: 'power3.out' },
        0
      )
        .fromTo(
          headingRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.1, ease: 'power3.inOut' },
          0.25
        )
        .fromTo(
          subtitleRef.current,
          { clipPath: 'inset(110% 0 0 0)', opacity: 0 },
          { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.85, ease: 'power2.out' },
          0.65
        )
        .fromTo(
          ctasRef.current,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
          { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.95
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          1.35
        )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen min-h-screen overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Campaign video background — plays silently behind the 3D scene */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.38, filter: 'contrast(1.1)' }}
        >
          <source src="/brand/sg-hero-video.mov" type="video/quicktime" />
        </video>
        {/* Fallback campaign photo if video doesn't play */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/brand/sg-campaign-04.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.06,
          }}
        />
      </div>

      {/* Three.js 3D emblem on top of video */}
      <div className="absolute inset-0 z-[1]">
        <HeroScene />
      </div>

      {/* Radial dark vignette overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 10%, rgba(5,5,5,0.5) 55%, rgba(5,5,5,0.93) 100%)',
        }}
      />

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #050505)' }}
      />

      {/* Subtle scanline texture */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Content layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-5xl mx-auto w-full">

          {/* Brand label */}
          <div
            ref={labelRef}
            className="opacity-0 mb-10 flex items-center justify-center gap-4"
          >
            <span
              className="block h-px w-10 flex-shrink-0"
              style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }}
            />
            <span
              className="text-[11px] tracking-[0.38em] uppercase whitespace-nowrap"
              style={{
                color: '#c9a84c',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontWeight: 500,
              }}
            >
              Swift Goods Clothing Brand&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2024
            </span>
            <span
              className="block h-px w-10 flex-shrink-0"
              style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }}
            />
          </div>

          {/* Main heading */}
          <h1
            ref={headingRef}
            className="opacity-0 mb-8 leading-none tracking-widest uppercase select-none"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3.5rem, 12vw, 10rem)',
              background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            COMFORT IS LUXURY.
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="opacity-0 mb-12 max-w-lg mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontStyle: 'italic',
              color: '#888888',
              letterSpacing: '0.04em',
            }}
          >
            Designed for movement. Built for presence.
          </p>

          {/* CTA buttons */}
          <div
            ref={ctasRef}
            className="opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <LuxuryButton variant="primary" href="/collections">
              SHOP COLLECTION
            </LuxuryButton>
            <LuxuryButton variant="ghost" href="#experience">
              EXPLORE THE EXPERIENCE
            </LuxuryButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span
          className="text-[10px] tracking-[0.42em] uppercase"
          style={{
            color: '#555555',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          SCROLL
        </span>
        <div
          className="relative w-px h-16 overflow-hidden"
          style={{ background: 'rgba(201,168,76,0.15)' }}
        >
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '50%',
              background: 'linear-gradient(to bottom, #c9a84c, transparent)',
              animation: 'sg-scroll-line 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes sg-scroll-line {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%);  opacity: 0; }
        }
      `}</style>
    </section>
  )
}
