

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'

const FRAMES = [
  {
    src: '/brand/sg-supra-brown-black.jpeg',
    label: '01',
    title: 'NIGHT RUNS',
  },
  {
    src: '/brand/sg-shorts-detail.jpeg',
    label: '02',
    title: 'IN THE DETAILS',
  },
  {
    src: '/brand/sg-parking-lot-night.jpeg',
    label: '03',
    title: 'AFTER HOURS',
  },
  {
    src: '/brand/sg-folded-crewnecks.jpeg',
    label: '04',
    title: 'THE PRODUCT',
  },
  {
    src: '/brand/sg-fountain-night.jpeg',
    label: '05',
    title: 'STREET SCENES',
  },
]

export default function CinematicStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const velocity = useScrollVelocity()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const skew = velocity * 3
    const imgs = track.querySelectorAll<HTMLElement>('.cs-img')
    imgs.forEach((img) => {
      img.style.transition = 'transform 200ms ease-out'
      img.style.transform = `skewY(${skew}deg) scale(${1 + Math.abs(velocity) * 0.05})`
    })
  }, [velocity])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return

      const totalScroll = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Animate each frame on scroll
      const frames = track.querySelectorAll<HTMLElement>('.cs-frame')
      frames.forEach((frame) => {
        const img = frame.querySelector('.cs-img')
        if (img) {
          gsap.fromTo(img,
            { scale: 1.2 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                containerAnimation: gsap.getById('strip-scroll') || undefined,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* SG monogram watermark */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden="true"
        style={{
          bottom: '10%',
          left: '60%',
          zIndex: 1,
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(15rem, 25vw, 25rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.025)',
          whiteSpace: 'nowrap',
        }}
      >
        SG
      </div>

      {/* Ambient gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          right: '-5%',
          width: '35%',
          height: '35%',
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Section header */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <span
            className="block w-8 h-px"
            style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.8rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              fontWeight: 500,
            }}
          >
            BEHIND THE LENS
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: '#f5f5f5',
            letterSpacing: '0.08em',
            margin: 0,
            textShadow: '0 4px 40px rgba(0,0,0,0.4)',
          }}
        >
          THE WORLD OF SWIFT GOODS
        </p>
        {/* Decorative gold corner */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-0.5rem',
            left: '2rem',
            width: '2rem',
            height: '2rem',
            borderBottom: '1px solid rgba(201,168,76,0.3)',
            borderLeft: '1px solid rgba(201,168,76,0.3)',
          }}
        />
      </div>

      {/* Scroll indicator — right side */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '2rem',
          transform: 'translateY(-50%)',
          zIndex: 20,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'rgba(201,168,76,0.4)',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)',
          }}
        />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1rem',
          height: 'clamp(300px, 50vh, 600px)',
          padding: '0 1rem',
          willChange: 'transform',
        }}
      >
        {FRAMES.map((frame, idx) => (
          <div
            key={frame.label}
            className="cs-frame group"
            style={{
              position: 'relative',
              flexShrink: 0,
              width: idx === 0 || idx === 2 ? '70vw' : '45vw',
              height: '100%',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Image */}
            <div className="cs-img absolute inset-0" style={{ willChange: 'transform' }}>
              <img
                src={frame.src}
                alt={frame.title}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Dark gradient bottom */}
            <div
              className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
              style={{
                opacity: 0.7,
                background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 35%, transparent 65%)',
              }}
            />

            {/* Gold border on hover */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ border: '1px solid rgba(201,168,76,0.3)' }}
            />

            {/* Frame label + title */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <span
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.35em',
                  color: 'rgba(201,168,76,0.5)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                {frame.label}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#f5f5f5',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.1,
                  textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}
              >
                {frame.title}
              </h3>
            </div>

            {/* Film grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.02,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
                backgroundSize: '100% 4px',
              }}
            />

            {/* Vertical gold accent line — left edge */}
            <div
              className="absolute top-0 bottom-0 left-0 w-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5), transparent)' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
