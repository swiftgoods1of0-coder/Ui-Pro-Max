'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function SignatureMoment() {
  const sectionRef = useRef<HTMLElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const headline1Ref = useRef<HTMLHeadingElement>(null)
  const headline2Ref = useRef<HTMLHeadingElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Parallax dimming on bg image
        gsap.to(bgImageRef.current, {
          opacity: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        })

        // Emblem scale breathe
        gsap.fromTo(
          emblemRef.current,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Headlines fly in from opposite sides
        gsap.fromTo(
          headline1Ref.current,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headline1Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(
          headline2Ref.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headline2Ref.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Stats stagger up
        gsap.fromTo(
          '.sig-stat',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Quote fade
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  // Floating particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 397) % 90}%`,
    top: `${5 + (i * 263) % 90}%`,
    size: 2 + (i % 3),
    delay: (i * 0.4) % 4,
    duration: 3 + (i % 3),
    opacity: 0.15 + (i % 4) * 0.08,
  }))

  return (
    <section
      id="signature"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-32"
    >

      {/* Real brand photo — very dim, acts as texture */}
      <div ref={bgImageRef} className="absolute inset-0 opacity-[0.08]">
        <Image
          src="/brand/sg-campaign-01.jpeg"
          alt="Swift Goods"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#050505]/80" />
      </div>

      {/* Radial depth glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      {/* CSS floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#c9a84c]"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto w-full">

        {/* Emblem */}
        <div ref={emblemRef} className="mb-16 flex justify-center opacity-0">
          <div className="relative">
            {/* Outer rotating ring */}
            <div
              className="absolute -inset-6 rounded-full border border-[#c9a84c]/10"
              style={{ animation: 'spin 25s linear infinite' }}
            />
            {/* Middle ring */}
            <div
              className="absolute -inset-3 rounded-full border border-[#c9a84c]/15"
              style={{ animation: 'spin 15s linear infinite reverse' }}
            />
            {/* Inner container */}
            <div className="w-36 h-36 rounded-full border border-[#c9a84c]/20 flex items-center justify-center bg-[#0a0a0a]">
              <Image
                src="/brand/sg-emblem.png"
                alt="Swift Goods Emblem"
                width={80}
                height={80}
                className="invert opacity-80"
              />
            </div>
          </div>
        </div>

        {/* THIS IS */}
        <h2
          ref={headline1Ref}
          style={{ fontFamily: 'var(--font-impact)' }}
          className="text-[12vw] md:text-[9vw] text-[#f5f5f5] leading-none tracking-widest mb-2 opacity-0"
        >
          THIS IS
        </h2>

        {/* Swift Goods. */}
        <h2
          ref={headline2Ref}
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #c9a84c, #e6c870, #c8aa8a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          className="text-[9vw] md:text-[7vw] font-light italic leading-none mb-16 opacity-0"
        >
          Swift Goods.
        </h2>

        {/* Divider */}
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#c9a84c]/40 to-transparent mx-auto mb-16" />

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-3 gap-8 border-t border-[#1e1e1e] pt-12 mb-16">
          {[
            { value: '2024', label: 'ESTABLISHED' },
            { value: '∞', label: 'COMFORT LEVELS' },
            { value: '01', label: 'PHILOSOPHY' },
          ].map((stat) => (
            <div key={stat.label} className="sig-stat opacity-0">
              <div
                style={{ fontFamily: 'var(--font-impact)' }}
                className="text-5xl md:text-6xl text-[#c9a84c] mb-2"
              >
                {stat.value}
              </div>
              <div className="label-luxury text-[#555555]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div ref={quoteRef} className="opacity-0">
          <blockquote
            style={{ fontFamily: 'var(--font-display)' }}
            className="italic text-xl md:text-2xl text-[#555555] max-w-2xl mx-auto leading-relaxed"
          >
            "The most powerful thing you can wear is something{' '}
            <span className="text-[#888888]">built for you.</span>"
          </blockquote>
        </div>

      </div>
    </section>
  )
}
