'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'

// ─── Data ────────────────────────────────────────────────────────────────────

interface CampaignPanel {
  num: string
  title: string
  desc: string
  image: string
}

const CAMPAIGN_PANELS: CampaignPanel[] = [
  {
    num: '01',
    title: 'THE SILHOUETTE',
    desc: 'Cut for movement. Built for stillness.',
    image: '/brand/sg-campaign-02.jpeg',
  },
  {
    num: '02',
    title: 'THE CULTURE',
    desc: 'Where heritage meets the present moment.',
    image: '/brand/sg-campaign-03.jpeg',
  },
  {
    num: '03',
    title: 'THE ENERGY',
    desc: 'Worn by those who don\'t need to announce themselves.',
    image: '/brand/sg-campaign-05.jpeg',
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function Lookbook() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const dotsRef     = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      // ── Main horizontal scroll tween ──────────────────────────────────────
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Progress bar fill
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`
          }
          // Active dot — 4 panels, so divide progress into quarters
          const active = Math.min(3, Math.floor(self.progress * 4))
          dotsRef.current.forEach((dot, i) => {
            if (!dot) return
            dot.style.background = i === active
              ? '#c9a84c'
              : 'rgba(201,168,76,0.2)'
            dot.style.transform = i === active ? 'scale(1.4)' : 'scale(1)'
          })
        },
      })

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: st,
      })
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <>
      {/* ── Pinned horizontal-scroll section ───────────────────────────────── */}
      <section
        ref={sectionRef}
        id="lookbook"
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'relative',
          background: '#050505',
        }}
      >
        {/* ── Track — 400vw flex strip ──────────────────────────────────────── */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            height: '100vh',
            width: '400vw',
            willChange: 'transform',
          }}
        >

          {/* ── Panel 0 — Editorial intro ─────────────────────────────────── */}
          <div
            style={{
              width: '100vw',
              height: '100vh',
              flexShrink: 0,
              position: 'relative',
              background: '#050505',
              overflow: 'hidden',
            }}
          >
            {/* Vertical decorative "LOOKBOOK" text */}
            <div
              style={{
                position: 'absolute',
                left: '-2vw',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'center center',
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(5rem, 14vw, 13rem)',
                color: '#1a1a1a',
                letterSpacing: '0.14em',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              LOOKBOOK
            </div>

            {/* Right gold divider line */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'rgba(201,168,76,0.15)',
              }}
            />

            {/* Subtle column grid */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                pointerEvents: 'none',
              }}
            >
              {[0,1,2,3,4,5].map((i) => (
                <div
                  key={i}
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.025)' }}
                />
              ))}
            </div>

            {/* Center content */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                transform: 'translateY(-50%)',
                maxWidth: '520px',
              }}
            >
              {/* Campaign label */}
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '11px',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#c9a84c',
                  fontWeight: 500,
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '48px',
                    height: '1px',
                    background: 'linear-gradient(to right, #c9a84c, transparent)',
                    flexShrink: 0,
                  }}
                />
                CAMPAIGN SS24
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(4rem, 9vw, 8rem)',
                  color: '#f5f5f5',
                  lineHeight: 1,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '2rem',
                }}
              >
                THE VOID
                <br />
                COLLECTION
              </h2>

              {/* Body italic */}
              <p
                style={{
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  color: '#666666',
                  maxWidth: '380px',
                  lineHeight: 1.6,
                  marginBottom: '2.5rem',
                }}
              >
                A collection born from silence. Refined by obsession.
                Designed to make absence feel like presence.
              </p>

              {/* CTA button */}
              <LuxuryButton variant="outline" href="/collections/void">
                VIEW FULL CAMPAIGN
              </LuxuryButton>

              {/* Scroll hint */}
              <div
                style={{
                  marginTop: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#c9a84c',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    fontSize: '10px',
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                  }}
                >
                  → SCROLL TO EXPLORE
                </span>
              </div>
            </div>
          </div>

          {/* ── Panels 1-3 — Campaign photo panels ──────────────────────────── */}
          {CAMPAIGN_PANELS.map((panel) => (
            <div
              key={panel.num}
              style={{
                width: '100vw',
                height: '100vh',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Full-bleed background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.image}
                alt={panel.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />

              {/* Dark gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to right, rgba(5,5,5,0.6) 0%, transparent 40%, transparent 60%, rgba(5,5,5,0.4) 100%)',
                }}
              />

              {/* Bottom gradient to ensure text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(5,5,5,0.85) 0%, transparent 50%)',
                }}
              />

              {/* Bottom-left info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2.5rem',
                  left: '2.5rem',
                }}
              >
                {/* Large ghost number */}
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '5rem',
                    color: 'rgba(201,168,76,0.15)',
                    lineHeight: 1,
                    letterSpacing: '0.06em',
                    marginBottom: '0.25rem',
                  }}
                >
                  {panel.num}
                </span>

                {/* Panel title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '1.8rem',
                    color: '#f5f5f5',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    lineHeight: 1,
                  }}
                >
                  {panel.title}
                </h3>

                {/* Short description */}
                <p
                  style={{
                    fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    color: '#888888',
                    maxWidth: '280px',
                    lineHeight: 1.5,
                  }}
                >
                  {panel.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress indicator — fixed to bottom of pinned section ─────── */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 10,
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              width: '120px',
              height: '1px',
              background: 'rgba(201,168,76,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '0%',
                background: '#c9a84c',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* 4 dots */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                ref={(el) => { dotsRef.current[i] = el }}
                style={{
                  display: 'block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === 0 ? '#c9a84c' : 'rgba(201,168,76,0.2)',
                  transform: i === 0 ? 'scale(1.4)' : 'scale(1)',
                  transition: 'background 0.3s ease, transform 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee brand quote banner — lives OUTSIDE the pinned section ──── */}
      <div
        style={{
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
          padding: '3.5rem 0',
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
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222222',
                }}
              >
                COMFORT IS LUXURY
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>✦</span>
              <span
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: '#222222',
                }}
              >
                SWIFT GOODS
              </span>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '1rem' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

    </>
  )
}
