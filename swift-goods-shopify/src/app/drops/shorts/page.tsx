'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'
import TextScramble from '@/components/ui/TextScramble'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ─── */
const FEATURES = [
  {
    num: '01',
    title: 'ULTRA-SOFT',
    subtitle: 'Premium Stretch Fabric',
    body: 'Every thread is selected for its hand-feel. The moment you put them on, you know.',
    stat: '300+',
    statLabel: 'GSM WEIGHT',
  },
  {
    num: '02',
    title: '4-WAY STRETCH',
    subtitle: 'Unrestricted Movement',
    body: 'Engineered to move with your body, not against it. From the gym to the streets.',
    stat: '360°',
    statLabel: 'FLEXIBILITY',
  },
  {
    num: '03',
    title: 'QUICK-DRY',
    subtitle: 'All-Day Performance',
    body: 'Advanced moisture-wicking fabric keeps you dry and comfortable wherever the day takes you.',
    stat: '2×',
    statLabel: 'FASTER DRY',
  },
]

const GALLERY_IMAGES = [
  { src: '/brand/sg-campaign-01.jpeg', alt: 'Campaign — Street', aspect: '3/4' },
  { src: '/brand/sg-solo-black.jpeg', alt: 'Campaign — Solo', aspect: '4/5' },
  { src: '/brand/sg-campaign-03.jpeg', alt: 'Campaign — Movement', aspect: '3/4' },
  { src: '/brand/sg-supra-brown-black.jpeg', alt: 'Campaign — Supra', aspect: '4/5' },
  { src: '/brand/sg-campaign-02.jpeg', alt: 'Campaign — Duo', aspect: '3/4' },
  { src: '/brand/sg-night-supra.jpeg', alt: 'Campaign — Night', aspect: '4/5' },
]

const MARQUEE_TEXT = 'COMFORT IS LUXURY  •  SWIFT GOODS  •  THE SHORTS THAT MOVE  •  '

/* ─── Marquee ─── */
function InfiniteMarquee({ speed = 35 }: { speed?: number }) {
  return (
    <div className="relative overflow-hidden py-6 select-none" style={{ background: '#080808' }}>
      <div className="absolute inset-y-0 left-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #080808, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #080808, transparent)' }} />
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
              letterSpacing: '0.2em',
              color: 'rgba(201,168,76,0.15)',
              paddingRight: '2rem',
              flexShrink: 0,
            }}
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const numericPart = value.replace(/[^0-9]/g, '')
    const prefix = value.replace(/[0-9]+.*/, '')
    const postfix = value.replace(/.*[0-9]/, '')

    if (!numericPart) {
      setDisplay(value)
      return
    }

    const target = parseInt(numericPart, 10)
    const obj = { val: 0 }

    const tween = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        setDisplay(`${prefix}${Math.round(obj.val)}${postfix}${suffix}`)
      },
    })

    return () => { tween.kill() }
  }, [value, suffix])

  return <span ref={ref}>{display}</span>
}

/* ─── Main ─── */
export default function ShortsExperience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const featureSectionRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<HTMLDivElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const gallerySectionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [heroProgress, setHeroProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── HERO: pin + zoom + text reveal ── */
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => setHeroProgress(self.progress),
        },
      })

      heroTl
        .fromTo(videoRef.current, { scale: 1 }, { scale: 1.4, ease: 'none', duration: 1 }, 0)
        .to('.hero-vignette', { opacity: 0.92, duration: 1, ease: 'none' }, 0)
        .fromTo('.hero-title-line-1', {
          y: 120, opacity: 0, rotateX: 30,
        }, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.25, ease: 'power3.out',
        }, 0.05)
        .fromTo('.hero-title-line-2', {
          y: 120, opacity: 0, rotateX: 30,
        }, {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.25, ease: 'power3.out',
        }, 0.12)
        .fromTo('.hero-subtitle', {
          y: 40, opacity: 0,
        }, {
          y: 0, opacity: 1,
          duration: 0.15, ease: 'power2.out',
        }, 0.22)
        .fromTo('.hero-badge', {
          scale: 0, opacity: 0,
        }, {
          scale: 1, opacity: 1,
          duration: 0.15, ease: 'back.out(1.7)',
        }, 0.28)
        .fromTo('.hero-scroll-cue', {
          opacity: 0.6,
        }, {
          opacity: 0, y: -30,
          duration: 0.1,
        }, 0.05)
        .to('.hero-title-line-1', { y: -100, opacity: 0, duration: 0.3 }, 0.6)
        .to('.hero-title-line-2', { y: -80, opacity: 0, duration: 0.3 }, 0.62)
        .to('.hero-subtitle', { y: -60, opacity: 0, duration: 0.25 }, 0.65)
        .to('.hero-badge', { y: -40, opacity: 0, duration: 0.2 }, 0.68)

      /* ── Scroll-driven video ── */
      if (videoRef.current) {
        const video = videoRef.current
        video.pause()
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.5,
          onUpdate: (self) => {
            if (video.duration) {
              video.currentTime = self.progress * video.duration
            }
          },
        })
      }

      /* ── FEATURES: staggered pin ── */
      const featureTl = gsap.timeline({
        scrollTrigger: {
          trigger: featureSectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 0.8,
        },
      })

      FEATURES.forEach((_, i) => {
        const off = i / FEATURES.length
        const dur = 1 / FEATURES.length

        featureTl
          .fromTo(`.feat-card-${i}`, {
            y: 100, opacity: 0, scale: 0.92,
          }, {
            y: 0, opacity: 1, scale: 1,
            duration: dur * 0.45, ease: 'power3.out',
          }, off)
          .fromTo(`.feat-line-${i}`, {
            scaleX: 0,
          }, {
            scaleX: 1,
            duration: dur * 0.35, ease: 'power2.inOut',
            transformOrigin: 'left center',
          }, off + dur * 0.08)
          .fromTo(`.feat-stat-${i}`, {
            scale: 0.5, opacity: 0,
          }, {
            scale: 1, opacity: 1,
            duration: dur * 0.3, ease: 'back.out(1.7)',
          }, off + dur * 0.15)
          .fromTo(`.feat-ghost-${i}`, {
            x: 60, opacity: 0,
          }, {
            x: 0, opacity: 1,
            duration: dur * 0.4, ease: 'power2.out',
          }, off + dur * 0.05)

        if (i < FEATURES.length - 1) {
          featureTl.to(`.feat-card-${i}`, {
            y: -60, opacity: 0, scale: 0.95,
            duration: dur * 0.3,
          }, off + dur * 0.7)
          featureTl.to(`.feat-ghost-${i}`, {
            opacity: 0,
            duration: dur * 0.2,
          }, off + dur * 0.7)
        }
      })

      /* ── SPLIT PANEL ── */
      gsap.fromTo('.split-image-wrap', {
        clipPath: 'inset(0 100% 0 0)',
      }, {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: splitRef.current,
          start: 'top 65%',
          end: 'top 15%',
          scrub: 0.6,
        },
      })

      gsap.fromTo('.split-image-inner', {
        scale: 1.3,
      }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: splitRef.current,
          start: 'top 65%',
          end: 'bottom top',
          scrub: 0.4,
        },
      })

      gsap.fromTo('.split-text-block', {
        x: 80, opacity: 0,
      }, {
        x: 0, opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: splitRef.current,
          start: 'top 45%',
          end: 'top 10%',
          scrub: 0.6,
        },
      })

      gsap.utils.toArray<HTMLElement>('.split-stat').forEach((el, i) => {
        gsap.fromTo(el, {
          y: 30, opacity: 0,
        }, {
          y: 0, opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: splitRef.current,
            start: `top ${35 - i * 5}%`,
            end: `top ${10 - i * 5}%`,
            scrub: 0.5,
          },
        })
      })

      /* ── HORIZONTAL GALLERY ── */
      if (gallerySectionRef.current && galleryTrackRef.current) {
        const track = galleryTrackRef.current
        const scrollWidth = track.scrollWidth - window.innerWidth

        gsap.to(track, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: gallerySectionRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      /* ── CTA section ── */
      gsap.fromTo('.cta-inner', {
        scale: 0.8, opacity: 0,
      }, {
        scale: 1, opacity: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 65%',
          end: 'top 25%',
          scrub: 0.6,
        },
      })

      gsap.fromTo('.cta-line', {
        scaleX: 0,
      }, {
        scaleX: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 50%',
          end: 'top 20%',
          scrub: 0.5,
        },
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen overflow-x-hidden">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <div ref={heroRef} className="relative w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          src="/brand/sg-shorts-drop.mp4"
          poster="/brand/sg-shorts-drop-poster.jpeg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />

        {/* Multi-layer vignette */}
        <div
          className="hero-vignette absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, transparent 30%, transparent 50%, rgba(5,5,5,0.7) 80%, rgba(5,5,5,0.95) 100%),
              radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.4) 100%)
            `,
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            opacity: 0.025,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
            backgroundSize: '100% 4px',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Corner marks */}
        {[
          'top-6 left-6 border-l border-t',
          'top-6 right-6 border-r border-t',
          'bottom-24 left-6 border-l border-b',
          'bottom-24 right-6 border-r border-b',
        ].map((pos) => (
          <div key={pos} className={`absolute ${pos} w-6 h-6 border-[rgba(201,168,76,0.25)] z-10`} />
        ))}

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4" style={{ perspective: '800px' }}>
          {/* Badge */}
          <div
            className="hero-badge mb-8 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <span
              className="px-4 py-1.5"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                border: '1px solid rgba(201,168,76,0.3)',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.5rem',
                fontWeight: 600,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#c9a84c',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TextScramble speed={25} revealDelay={40}>EXCLUSIVE DROP</TextScramble>
            </span>
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
                boxShadow: '0 0 12px rgba(201,168,76,0.6)',
                animation: 'pulse-gold 2s ease-in-out infinite',
              }}
            />
          </div>

          <div
            className="hero-title-line-1"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(4.5rem, 16vw, 16rem)',
              letterSpacing: '0.06em',
              lineHeight: 0.85,
              color: '#f5f5f5',
              textAlign: 'center',
              textShadow: '0 4px 80px rgba(0,0,0,0.6)',
              willChange: 'transform, opacity',
              opacity: 0,
            }}
          >
            THE SHORTS
          </div>

          <div
            className="hero-title-line-2"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(3rem, 10vw, 10rem)',
              letterSpacing: '0.12em',
              lineHeight: 0.9,
              color: '#c9a84c',
              textAlign: 'center',
              textShadow: '0 0 60px rgba(201,168,76,0.2)',
              willChange: 'transform, opacity',
              opacity: 0,
            }}
          >
            THAT MOVE.
          </div>

          <p
            className="hero-subtitle mt-6 max-w-md text-center"
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              lineHeight: 1.7,
              color: 'rgba(245,245,245,0.4)',
              opacity: 0,
            }}
          >
            Crafted from premium ultra-soft stretch fabric for effortless movement and refined luxury.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll-cue absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.45rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.4)',
            }}
          >
            SCROLL TO EXPLORE
          </span>
          <div style={{
            width: 1, height: 36,
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)',
            animation: 'sg-scroll-line 2.5s ease-in-out infinite',
          }} />
        </div>

        {/* Progress */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20" style={{ background: 'rgba(201,168,76,0.08)' }}>
          <div style={{
            height: '100%',
            width: `${heroProgress * 100}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e6c870)',
            boxShadow: '0 0 12px rgba(201,168,76,0.5)',
            transition: 'width 80ms linear',
          }} />
        </div>

        {/* Side label */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center gap-3"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}
        >
          <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.45rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.25)',
          }}>
            SG ESSENTIALS — 2024
          </span>
        </div>
      </div>

      {/* ═══ MARQUEE ═══ */}
      <InfiniteMarquee />

      {/* ═══ FEATURES ═══ */}
      <div
        ref={featureSectionRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#050505' }}
      >
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          top: '25%', left: '15%', width: '70%', height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 55%)',
          filter: 'blur(100px)',
        }} />

        {/* Gold accent line — left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-px hidden lg:block" style={{
          left: '2.5rem',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.25) 20%, rgba(201,168,76,0.25) 80%, transparent)',
        }} />

        {/* Section label */}
        <div className="absolute top-10 left-8 lg:top-12 lg:left-20 z-10">
          <div className="flex items-center gap-3">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', animation: 'pulse-gold 2s ease-in-out infinite' }} />
            <span className="block w-10 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.5rem',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c9a84c',
            }}>
              ENGINEERED DETAILS
            </span>
          </div>
        </div>

        {/* Feature progress indicator */}
        <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                border: '1px solid rgba(201,168,76,0.3)',
                background: 'rgba(201,168,76,0.08)',
                transition: 'all 0.4s ease',
              }} />
              <span style={{
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.4rem',
                letterSpacing: '0.15em',
                color: 'rgba(201,168,76,0.25)',
              }}>
                {f.num}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 lg:px-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className={`feat-card-${i} absolute inset-0 flex items-center px-8 lg:px-16`}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 lg:gap-16 w-full items-center">
                <div>
                  {/* Ghost number */}
                  <span
                    className={`feat-ghost-${i} absolute pointer-events-none select-none hidden lg:block`}
                    style={{
                      fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                      fontSize: 'clamp(8rem, 22vw, 16rem)',
                      lineHeight: 0.8,
                      color: 'transparent',
                      WebkitTextStroke: '1px rgba(201,168,76,0.08)',
                      right: '5%', top: '10%',
                      opacity: 0,
                    }}
                  >
                    {f.num}
                  </span>

                  <div
                    className={`feat-line-${i} mb-6`}
                    style={{
                      width: 50, height: 2,
                      background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.15))',
                      transformOrigin: 'left center',
                    }}
                  />

                  <h3 style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                    letterSpacing: '0.04em',
                    color: '#f5f5f5',
                    lineHeight: 0.95,
                    margin: 0, marginBottom: '0.75rem',
                    textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                  }}>
                    {f.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.575rem',
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#c9a84c',
                    marginBottom: '1.75rem',
                  }}>
                    {f.subtitle}
                  </p>

                  <p style={{
                    fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    lineHeight: 1.8,
                    color: 'rgba(245,245,245,0.4)',
                    maxWidth: 400,
                  }}>
                    {f.body}
                  </p>
                </div>

                {/* Stat circle */}
                <div
                  className={`feat-stat-${i} hidden lg:flex flex-col items-center justify-center`}
                  style={{
                    width: 140, height: 140,
                    borderRadius: '50%',
                    border: '1px solid rgba(201,168,76,0.2)',
                    background: 'radial-gradient(circle at center, rgba(201,168,76,0.04) 0%, transparent 70%)',
                    opacity: 0,
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '2.2rem',
                    color: '#c9a84c',
                    lineHeight: 1,
                  }}>
                    {f.stat}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.4rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(245,245,245,0.3)',
                    marginTop: 4,
                  }}>
                    {f.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SPLIT PANEL ═══ */}
      <div ref={splitRef} className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{ background: '#070707' }}>
        {/* Image side with clip-path reveal */}
        <div
          className="split-image-wrap relative overflow-hidden"
          style={{ minHeight: 'clamp(350px, 55vh, 650px)', clipPath: 'inset(0 100% 0 0)' }}
        >
          <Image
            src="/brand/sg-shorts-detail.jpeg"
            alt="Swift Goods Shorts Detail"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="split-image-inner object-cover"
            quality={90}
          />
          {/* Edge blend */}
          <div className="absolute inset-0 hidden lg:block" style={{
            background: 'linear-gradient(to right, transparent 55%, #070707 100%)',
          }} />
          <div className="absolute inset-0 lg:hidden" style={{
            background: 'linear-gradient(to bottom, transparent 50%, #070707 100%)',
          }} />
          {/* Subtle gold overlay on hover */}
          <div className="absolute inset-0 pointer-events-none" style={{
            border: '1px solid rgba(201,168,76,0.12)',
          }} />
        </div>

        {/* Text side */}
        <div className="split-text-block flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 lg:py-0" style={{ opacity: 0 }}>
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', animation: 'pulse-gold 2s ease-in-out infinite' }} />
            <span className="block w-10 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.5rem',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c9a84c',
            }}>
              DESIGN PHILOSOPHY
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
            letterSpacing: '0.04em',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: 0, marginBottom: '1.5rem',
            whiteSpace: 'pre-line',
          }}>
            {'EVERY STITCH.\nINTENTIONAL.'}
          </h2>

          <div className="mb-8" style={{ width: 80, height: 2, background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.1))' }} />

          <p style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            lineHeight: 1.8,
            color: 'rgba(245,245,245,0.4)',
            maxWidth: 420,
            marginBottom: '2.5rem',
          }}>
            We obsessed over every detail — the weight of the fabric, the fall of the hem,
            the placement of every seam. Because comfort isn&apos;t a feature. It&apos;s the foundation.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8">
            {[
              { value: '4', label: 'WAY STRETCH' },
              { value: '0', label: 'COMPROMISES' },
              { value: '1', label: 'OF A KIND' },
            ].map((s, i) => (
              <div key={s.label} className={`split-stat flex items-center gap-${i > 0 ? '8' : '0'}`}>
                {i > 0 && <div style={{ width: 1, height: 40, background: 'rgba(201,168,76,0.15)', marginRight: '2rem' }} />}
                <div className="text-center">
                  <span style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '2.8rem',
                    color: '#c9a84c',
                    lineHeight: 1,
                  }}>
                    <AnimatedCounter value={s.value} />
                  </span>
                  <span className="block mt-1" style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '0.45rem',
                    fontWeight: 500,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.3)',
                  }}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MARQUEE 2 ═══ */}
      <div className="relative overflow-hidden py-4" style={{ background: '#050505' }}>
        <div className="absolute inset-y-0 left-0 w-20 z-10" style={{ background: 'linear-gradient(to right, #050505, transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-20 z-10" style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />
        <div className="flex whitespace-nowrap select-none" style={{ animation: 'marquee-scroll 45s linear infinite reverse' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.9rem, 2vw, 1.4rem)',
              letterSpacing: '0.15em',
              color: 'rgba(201,168,76,0.1)',
              paddingRight: '3rem',
              flexShrink: 0,
            }}>
              Performance &nbsp;&middot;&nbsp; Comfort &nbsp;&middot;&nbsp; Style &nbsp;&middot;&nbsp; Perfected &nbsp;&middot;&nbsp; Swift Goods &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ═══ HORIZONTAL GALLERY ═══ */}
      <div ref={gallerySectionRef} className="relative h-screen overflow-hidden" style={{ background: '#050505' }}>
        {/* Section header (fixed while scrolling) */}
        <div className="absolute top-10 left-8 lg:left-16 z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-10 h-px" style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />
            <span style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.5rem',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)',
            }}>
              CAMPAIGN
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
            letterSpacing: '0.04em',
            color: '#f5f5f5',
            margin: 0,
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>
            IN THE WILD
          </h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={galleryTrackRef}
          className="flex items-center gap-4 lg:gap-6 h-full pl-8 lg:pl-16 pr-[40vw]"
          style={{ width: 'max-content', paddingTop: '5rem' }}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="gallery-h-item group relative overflow-hidden flex-shrink-0"
              style={{
                width: 'clamp(260px, 28vw, 400px)',
                aspectRatio: img.aspect,
                background: '#111',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 70vw, 28vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-40 group-hover:opacity-10"
                style={{ background: 'rgba(5,5,5,0.5)' }}
              />
              {/* Gold border on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ border: '1px solid rgba(201,168,76,0.3)' }} />
              {/* Index label */}
              <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.45rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(201,168,76,0.5)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 lg:right-16 flex items-center gap-3 z-10">
          <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.45rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.3)',
          }}>
            SCROLL
          </span>
          <div style={{
            width: 40, height: 1,
            background: 'linear-gradient(to right, rgba(201,168,76,0.3), transparent)',
          }} />
        </div>
      </div>

      {/* ═══ SPECS STRIP ═══ */}
      <div className="relative py-16 lg:py-20" style={{ background: '#080808', borderTop: '1px solid rgba(201,168,76,0.08)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="max-w-6xl mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '300+', label: 'GSM WEIGHT', desc: 'Premium density' },
              { value: '4', label: 'WAY STRETCH', desc: 'Full mobility', suffix: '-Way' },
              { value: '100', label: 'QUALITY TESTED', desc: 'Every pair inspected', suffix: '%' },
              { value: '0', label: 'SHORTCUTS', desc: 'No compromises' },
            ].map((spec, i) => (
              <div key={spec.label} className="text-center lg:text-left">
                <span style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  color: '#c9a84c',
                  lineHeight: 1,
                }}>
                  <AnimatedCounter value={spec.value} suffix={spec.suffix} />
                </span>
                <span className="block mt-2" style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.5rem',
                  fontWeight: 600,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.5)',
                }}>
                  {spec.label}
                </span>
                <span className="block mt-1" style={{
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontStyle: 'italic',
                  fontSize: '0.8rem',
                  color: 'rgba(245,245,245,0.2)',
                }}>
                  {spec.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div ref={ctaRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#050505' }}>
        {/* Radial glow */}
        <div className="absolute pointer-events-none" style={{
          width: '80%', height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 50%)',
          filter: 'blur(100px)',
        }} />

        {/* Film grain */}
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.02,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 4px',
        }} />

        <div className="cta-inner relative z-10 text-center px-8" style={{ opacity: 0 }}>
          <span style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.5rem',
            fontWeight: 500,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.4)',
          }}>
            SWIFT GOODS — COMFORT IS LUXURY
          </span>

          <h2 className="mt-8" style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(3.5rem, 12vw, 12rem)',
            letterSpacing: '0.06em',
            lineHeight: 0.85,
            color: '#f5f5f5',
            margin: 0, marginTop: '2rem',
            textShadow: '0 4px 60px rgba(0,0,0,0.4)',
          }}>
            OWN THE
          </h2>
          <h2 style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(3.5rem, 12vw, 12rem)',
            letterSpacing: '0.06em',
            lineHeight: 0.85,
            color: '#c9a84c',
            margin: 0, marginBottom: '2.5rem',
            textShadow: '0 0 80px rgba(201,168,76,0.15)',
          }}>
            MOMENT.
          </h2>

          {/* Gold rule */}
          <div className="cta-line flex justify-center mb-10" style={{ transformOrigin: 'center center' }}>
            <div style={{
              width: 120, height: 2,
              background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
            }} />
          </div>

          <p className="max-w-md mx-auto mb-14" style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
            lineHeight: 1.7,
            color: 'rgba(245,245,245,0.35)',
          }}>
            Limited drop. Premium quality. No restocks.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <MagneticElement strength={0.3} radius={200}>
              <LuxuryButton variant="primary" size="lg" href="/collections/shorts" data-cursor="cta">
                SHOP THE SHORTS
              </LuxuryButton>
            </MagneticElement>
            <MagneticElement strength={0.25} radius={160}>
              <LuxuryButton variant="ghost" href="/">
                BACK TO SWIFT GOODS
              </LuxuryButton>
            </MagneticElement>
          </div>
        </div>

        {/* Corner marks */}
        {[
          'top-8 left-8 border-l border-t',
          'top-8 right-8 border-r border-t',
          'bottom-8 left-8 border-l border-b',
          'bottom-8 right-8 border-r border-b',
        ].map((pos) => (
          <div key={pos} className={`absolute ${pos} w-5 h-5 border-[rgba(201,168,76,0.15)]`} />
        ))}
      </div>

      <Footer />

      {/* ═══ KEYFRAMES ═══ */}
      <style jsx global>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
