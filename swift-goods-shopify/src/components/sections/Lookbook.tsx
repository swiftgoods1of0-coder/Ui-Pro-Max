'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import LuxuryButton from '@/components/ui/LuxuryButton'

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any
    ;(async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Hero text reveal on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse',
          },
        })

        tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
          .fromTo(headlineRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
          .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')

        // Parallax on hero image
        gsap.to('.lookbook-hero-img', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        // Panels stagger in
        gsap.fromTo(
          '.lookbook-panel',
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panelsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  const panels = [
    {
      img: '/brand/sg-campaign-02.jpeg',
      num: '01',
      title: 'THE SILHOUETTE',
      desc: 'Designed for movement. Crafted for presence.',
      tag: 'HOODIE COLLECTION',
    },
    {
      img: '/brand/sg-campaign-03.jpeg',
      num: '02',
      title: 'THE CULTURE',
      desc: 'Swift Goods lives where comfort meets confidence.',
      tag: 'CAMPAIGN SS25',
    },
    {
      img: '/brand/sg-campaign-05.jpeg',
      num: '03',
      title: 'THE ENERGY',
      desc: 'After dark. In motion. Undeniable.',
      tag: 'NIGHT SERIES',
    },
  ]

  return (
    <section id="lookbook" ref={sectionRef} className="relative bg-[#050505]">

      {/* ─── Hero Editorial Panel ──────────────────────────────────── */}
      <div ref={heroRef} className="relative min-h-screen overflow-hidden flex items-end">

        {/* Background image with parallax */}
        <div className="absolute inset-0">
          <Image
            src="/brand/sg-campaign-04.jpeg"
            alt="Swift Goods Campaign"
            fill
            className="lookbook-hero-img object-cover object-center scale-110"
            priority
          />
          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-transparent" />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-l border-white/[0.03] h-full" />
          ))}
        </div>

        {/* Campaign badge top-right */}
        <div className="absolute top-12 right-12 text-right">
          <p className="label-luxury text-[#c9a84c]">Campaign 2025</p>
          <p className="font-body text-xs text-[#555555] mt-1">Swift Goods × The Road</p>
        </div>

        {/* Content bottom-left */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-8 md:px-16 pb-20 md:pb-28">
            <p ref={labelRef} className="label-luxury text-[#c9a84c] mb-6 opacity-0">
              LOOKBOOK · SS25
            </p>
            <h2
              ref={headlineRef}
              style={{ fontFamily: 'var(--font-impact)' }}
              className="text-[10vw] md:text-[7vw] text-[#f5f5f5] leading-none tracking-widest mb-6 opacity-0"
            >
              THE VOID<br />COLLECTION
            </h2>
            <p
              ref={subRef}
              style={{ fontFamily: 'var(--font-display)' }}
              className="italic text-lg md:text-xl text-[#888888] max-w-md mb-10 leading-relaxed opacity-0"
            >
              A collection born from silence. Refined by obsession.
              Designed to make absence feel like presence.
            </p>
            <div ref={ctaRef} className="opacity-0">
              <LuxuryButton variant="outline" size="lg">
                VIEW FULL CAMPAIGN
              </LuxuryButton>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Three Editorial Panels ────────────────────────────────── */}
      <div ref={panelsRef} className="grid grid-cols-1 md:grid-cols-3">
        {panels.map((panel, i) => (
          <div
            key={i}
            className="lookbook-panel relative overflow-hidden group cursor-pointer"
            style={{ minHeight: '520px' }}
          >
            {/* Panel image */}
            <Image
              src={panel.img}
              alt={panel.title}
              fill
              className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

            {/* Side border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="label-luxury text-[#c9a84c]/60 mb-3">{panel.tag}</p>
              <p
                style={{ fontFamily: 'var(--font-impact)' }}
                className="text-7xl text-[#c9a84c]/20 leading-none mb-2"
              >
                {panel.num}
              </p>
              <h3
                style={{ fontFamily: 'var(--font-impact)' }}
                className="text-2xl text-[#f5f5f5] tracking-widest mb-2"
              >
                {panel.title}
              </h3>
              <p className="font-body text-sm text-[#888888] leading-relaxed max-w-xs">
                {panel.desc}
              </p>

              {/* Hover arrow */}
              <div className="mt-4 flex items-center gap-2 text-[#c9a84c] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-400">
                <span className="label-luxury text-xs">EXPLORE</span>
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                  <path d="M0 4H14M14 4L11 1M14 4L11 7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Horizontal Brand Quote Banner ────────────────────────── */}
      <div className="border-t border-[#1e1e1e] py-16 overflow-hidden">
        <div className="flex items-center gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 shrink-0">
              <span
                style={{ fontFamily: 'var(--font-impact)' }}
                className="text-2xl tracking-[0.3em] text-[#2a2a2a]"
              >
                COMFORT IS LUXURY
              </span>
              <span className="text-[#c9a84c]">✦</span>
              <span
                style={{ fontFamily: 'var(--font-impact)' }}
                className="text-2xl tracking-[0.3em] text-[#2a2a2a]"
              >
                SWIFT GOODS
              </span>
              <span className="text-[#c9a84c]">✦</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
