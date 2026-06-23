'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ParticleConfig {
  id: number
  top: string
  left: string
  size: number
  animDelay: string
  animDuration: string
}

// 20 deterministic floating gold particles
const PARTICLES: ParticleConfig[] = [
  { id: 1,  top: '7%',  left: '11%', size: 4, animDelay: '0s',    animDuration: '6.2s' },
  { id: 2,  top: '14%', left: '79%', size: 3, animDelay: '1.1s',  animDuration: '7.5s' },
  { id: 3,  top: '21%', left: '44%', size: 5, animDelay: '0.5s',  animDuration: '5.8s' },
  { id: 4,  top: '34%', left: '7%',  size: 3, animDelay: '2.1s',  animDuration: '8.0s' },
  { id: 5,  top: '41%', left: '90%', size: 4, animDelay: '0.8s',  animDuration: '6.7s' },
  { id: 6,  top: '54%', left: '23%', size: 2, animDelay: '1.8s',  animDuration: '7.2s' },
  { id: 7,  top: '61%', left: '64%', size: 3, animDelay: '0.3s',  animDuration: '5.5s' },
  { id: 8,  top: '69%', left: '39%', size: 5, animDelay: '2.5s',  animDuration: '8.3s' },
  { id: 9,  top: '77%', left: '83%', size: 2, animDelay: '1.4s',  animDuration: '6.0s' },
  { id: 10, top: '84%', left: '6%',  size: 4, animDelay: '0.9s',  animDuration: '7.8s' },
  { id: 11, top: '11%', left: '56%', size: 2, animDelay: '3.0s',  animDuration: '5.2s' },
  { id: 12, top: '27%', left: '31%', size: 3, animDelay: '1.6s',  animDuration: '8.6s' },
  { id: 13, top: '46%', left: '53%', size: 2, animDelay: '2.8s',  animDuration: '6.4s' },
  { id: 14, top: '64%', left: '16%', size: 4, animDelay: '0.7s',  animDuration: '7.0s' },
  { id: 15, top: '71%', left: '71%', size: 3, animDelay: '2.2s',  animDuration: '5.9s' },
  { id: 16, top: '5%',  left: '87%', size: 2, animDelay: '1.3s',  animDuration: '8.1s' },
  { id: 17, top: '32%', left: '61%', size: 5, animDelay: '0.4s',  animDuration: '6.8s' },
  { id: 18, top: '49%', left: '4%',  size: 3, animDelay: '3.2s',  animDuration: '7.3s' },
  { id: 19, top: '87%', left: '49%', size: 2, animDelay: '1.9s',  animDuration: '5.7s' },
  { id: 20, top: '19%', left: '19%', size: 4, animDelay: '0.6s',  animDuration: '8.4s' },
]

interface StatItem {
  value: string
  label: string
}

const STATS: StatItem[] = [
  { value: '2024', label: 'ESTABLISHED' },
  { value: '∞',    label: 'COMFORT LEVELS' },
  { value: '01',   label: 'PHILOSOPHY' },
]

export default function SignatureMoment() {
  const sectionRef    = useRef<HTMLElement>(null)
  const emblemRef     = useRef<HTMLDivElement>(null)
  const thisIsRef     = useRef<HTMLHeadingElement>(null)
  const brandNameRef  = useRef<HTMLHeadingElement>(null)
  const statsRef      = useRef<HTMLDivElement>(null)
  const quoteRef      = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Pin the section for a cinematic scroll-driven reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
      })

      // Emblem: scale 0.8 → 1.2 scrubbed on scroll
      gsap.fromTo(
        emblemRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1.2,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            end:   'top 20%',
            scrub: 1.2,
          },
        }
      )

      // "THIS IS" clip-path reveal from left on scroll
      gsap.fromTo(
        thisIsRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      )

      // "Swift Goods." clip-path reveal from right on scroll
      gsap.fromTo(
        brandNameRef.current,
        { clipPath: 'inset(0 0 0 100%)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0 0%)',
          opacity: 1,
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Stats stagger up on scroll
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll<HTMLElement>('.stat-item')
        gsap.fromTo(
          statEls,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0 0% 0)',
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Blockquote clip-path rise from below
      gsap.fromTo(
        quoteRef.current,
        { clipPath: 'inset(110% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="signature"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Radial gradient: warm gold centre → void edge */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at center, #1a1500 0%, #050505 72%)',
        }}
      />

      {/* 20 floating gold particle dots */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(201,168,76,0.55)',
            boxShadow: `0 0 ${p.size * 2}px rgba(201,168,76,0.28)`,
            animation: `sg-sig-particle ${p.animDuration} ease-in-out ${p.animDelay} infinite alternate`,
          }}
        />
      ))}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

        {/* SG Emblem — 48×48 Tailwind (w-48 h-48 = 192px) */}
        <div ref={emblemRef} className="relative mb-14 opacity-0 w-48 h-48 flex-shrink-0">
          {/* Outer border circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(201,168,76,0.2)' }}
          />
          {/* Rotating outer ring */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              border: '1px solid rgba(201,168,76,0.15)',
              borderTopColor: 'rgba(201,168,76,0.7)',
              animation: 'sg-spin-cw 20s linear infinite',
            }}
          />
          {/* Counter-rotating inner ring */}
          <div
            className="absolute inset-7 rounded-full"
            style={{
              border: '1px solid rgba(201,168,76,0.08)',
              borderBottomColor: 'rgba(201,168,76,0.4)',
              animation: 'sg-spin-ccw 14s linear infinite',
            }}
          />
          {/* SG lettering */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="leading-none select-none"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: '3.75rem',
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SG
            </span>
          </div>
        </div>

        {/* "THIS IS" — font-impact, massive, slides from left */}
        <h2
          ref={thisIsRef}
          className="opacity-0 leading-none tracking-widest select-none"
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(3rem, 9vw, 8.5rem)',
            color: '#f5f5f5',
          }}
        >
          THIS IS
        </h2>

        {/* "Swift Goods." — font-display italic, gradient gold, slides from right */}
        <h2
          ref={brandNameRef}
          className="opacity-0 leading-none mb-14 select-none"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(2.8rem, 8vw, 7.5rem)',
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Swift Goods.
        </h2>

        {/* Vertical gold separator */}
        <div
          className="w-px h-14 mb-14"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(201,168,76,0.45), transparent)',
          }}
        />

        {/* Stats row */}
        <div
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20 mb-16 w-full"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '3rem',
          }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-item opacity-0 flex flex-col items-center gap-2"
            >
              <span
                className="leading-none"
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                  letterSpacing: '0.06em',
                  background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{
                  color: '#555555',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Blockquote */}
        <blockquote
          ref={quoteRef}
          className="opacity-0 max-w-2xl mx-auto"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
            fontStyle: 'italic',
            color: '#555555',
            lineHeight: 1.74,
            letterSpacing: '0.03em',
          }}
        >
          &ldquo;The most powerful thing you can wear is something built for you.&rdquo;
        </blockquote>
      </div>

    </section>
  )
}
