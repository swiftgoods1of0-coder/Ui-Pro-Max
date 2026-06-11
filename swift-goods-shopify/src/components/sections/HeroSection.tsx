'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })

export default function HeroSection() {
  const labelRef = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        0
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          0.3
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.7
        )
        .fromTo(
          ctasRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          1.0
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          1.4
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
      className="relative w-full h-screen min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#050505' }}
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Radial Gradient Vignette Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.92) 100%)',
        }}
      />

      {/* Subtle horizontal scan lines for texture */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto w-full">
        {/* Label */}
        <span
          ref={labelRef}
          className="inline-block mb-8 text-xs tracking-[0.35em] uppercase opacity-0"
          style={{ color: '#888888', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
        >
          Swift Goods Clothing Brand&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2024
        </span>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="mb-8 leading-none tracking-widest uppercase opacity-0"
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Comfort Is Luxury.
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-12 opacity-0"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: '#e0e0e0',
            fontStyle: 'italic',
            letterSpacing: '0.05em',
          }}
        >
          Designed for movement. Built for presence.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctasRef}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center opacity-0"
        >
          <LuxuryButton variant="primary" href="/collections">
            SHOP COLLECTION
          </LuxuryButton>
          <LuxuryButton variant="ghost" href="#experience">
            EXPLORE THE EXPERIENCE
          </LuxuryButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0"
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: '#888888', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
        >
          Scroll
        </span>
        <div className="relative w-px h-16 overflow-hidden" style={{ background: 'rgba(201,168,76,0.2)' }}>
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '50%',
              background: 'linear-gradient(to bottom, #c9a84c, transparent)',
              animation: 'scrollLine 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Scroll line keyframe */}
      <style jsx>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
