'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(emblemRef.current, { scale: 0.6, opacity: 0, rotation: -10 })
      gsap.set(glowRef.current, { scale: 0.3, opacity: 0 })
      gsap.set(logoRef.current, { scale: 1.2, opacity: 0 })
      gsap.set(lineLeftRef.current, { scaleX: 0, transformOrigin: 'right center' })
      gsap.set(lineRightRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(brandRef.current, { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' })
      gsap.set(taglineRef.current, { opacity: 0, y: 10 })
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })

      // Spawn gold particles
      if (particlesRef.current) {
        for (let i = 0; i < 15; i++) {
          const p = document.createElement('div')
          const size = Math.random() * 3 + 1
          p.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201,168,76,0.8), rgba(230,200,112,0.3));
            pointer-events: none;
            opacity: 0;
          `
          particlesRef.current.appendChild(p)

          gsap.set(p, {
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
          })

          gsap.to(p, {
            opacity: Math.random() * 0.6 + 0.2,
            x: `+=${(Math.random() - 0.5) * 100}`,
            y: `+=${(Math.random() - 0.5) * 100}`,
            duration: Math.random() * 1.5 + 1,
            delay: Math.random() * 0.3,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
          })
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 50)
        },
      })

      // Progress bar runs throughout
      tl.to(progressRef.current, { scaleX: 1, duration: 1.8, ease: 'power1.inOut' }, 0)

      // Counter
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: function () {
            if (counterRef.current) {
              const v = Math.round(((this as unknown as gsap.core.Tween).targets()[0] as { val: number }).val)
              counterRef.current.textContent = String(v).padStart(3, '0')
            }
          },
        },
        0
      )

      // Phase 1: Gold glow pulse
      tl.to(glowRef.current, {
        scale: 1.5, opacity: 0.6, duration: 0.5, ease: 'power2.out',
      }, 0.05)
      tl.to(glowRef.current, {
        scale: 1, opacity: 0.3, duration: 0.4, ease: 'power2.inOut',
      }, 0.55)

      // Phase 2: Winged S emblem scales in
      tl.to(emblemRef.current, {
        scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.4)',
      }, 0.15)

      // Phase 3: Logo image fades in
      tl.to(logoRef.current, {
        scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out',
      }, 0.3)

      // Phase 4: Gold lines extend
      tl.to(lineLeftRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out' }, 0.7)
      tl.to(lineRightRef.current, { scaleX: 1, duration: 0.4, ease: 'power3.out' }, 0.7)

      // Phase 5: Brand name reveals
      tl.to(brandRef.current, {
        opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power3.out',
      }, 0.9)

      // Phase 6: Tagline fades in
      tl.to(taglineRef.current, {
        opacity: 1, y: 0, duration: 0.3, ease: 'power2.out',
      }, 1.15)

      // Phase 7: Gold glow pulse
      tl.to(glowRef.current, {
        scale: 2, opacity: 0.5, duration: 0.3, ease: 'power2.in',
      }, 1.5)

      // Phase 8: Exit
      tl.to(glowRef.current, { opacity: 0, duration: 0.2 }, 1.8)
      tl.to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        filter: 'blur(4px)',
        duration: 0.5,
        ease: 'power3.inOut',
      }, 1.85)
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'transform, filter, clip-path',
      }}
    >
      {/* Ambient gold gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles container */}
      <div
        ref={particlesRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Counter — top right */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          color: 'rgba(201,168,76,0.35)',
          userSelect: 'none',
        }}
      >
        <span ref={counterRef}>000</span>
      </div>

      {/* Year stamp — top left */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.5625rem',
          letterSpacing: '0.3em',
          color: 'rgba(201,168,76,0.25)',
          userSelect: 'none',
          textTransform: 'uppercase',
        }}
      >
        Est. 2025
      </div>

      {/* Center emblem group */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Pulsing gold glow behind emblem */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, rgba(201,168,76,0.1) 40%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(20px)',
          }}
        />

        {/* Outer spinning ring */}
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.15)',
            borderTopColor: 'rgba(201,168,76,0.6)',
            animation: 'sg-spin-cw 10s linear infinite',
          }}
        />

        {/* Inner counter-rotating ring */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            border: '1px solid transparent',
            borderBottomColor: 'rgba(201,168,76,0.4)',
            borderLeftColor: 'rgba(201,168,76,0.15)',
            animation: 'sg-spin-ccw 7s linear infinite',
          }}
        />

        {/* Winged S emblem — the actual brand logo */}
        <div ref={emblemRef} style={{ position: 'relative', zIndex: 2 }}>
          <div ref={logoRef}>
            <Image
              src="/brand/sg-winged-s-transparent.png"
              alt="Swift Goods"
              width={90}
              height={90}
              unoptimized
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal gold lines */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem' }}>
        <div
          ref={lineLeftRef}
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to left, rgba(201,168,76,0.6), transparent)',
          }}
        />
        {/* Brand name */}
        <p
          ref={brandRef}
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: '1.1rem',
            letterSpacing: '0.5em',
            color: '#c9a84c',
            userSelect: 'none',
            textTransform: 'uppercase',
            margin: 0,
            paddingRight: '0.5em',
            whiteSpace: 'nowrap',
          }}
        >
          SWIFT GOODS
        </p>
        <div
          ref={lineRightRef}
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(to right, rgba(201,168,76,0.6), transparent)',
          }}
        />
      </div>

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          marginTop: '0.875rem',
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontStyle: 'italic',
          fontSize: '0.85rem',
          letterSpacing: '0.2em',
          color: '#555555',
          userSelect: 'none',
        }}
      >
        COMFORT IS LUXURY.
      </p>

      {/* Progress bar — bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'rgba(201,168,76,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={progressRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, #c9a84c, #e6c870, #c9a84c)',
            transformOrigin: 'left center',
            boxShadow: '0 0 12px rgba(201,168,76,0.5)',
          }}
        />
      </div>

      {/* Decorative corner marks */}
      <div style={{ position: 'absolute', top: '4rem', left: '2rem', width: '20px', height: '20px', borderLeft: '1px solid rgba(201,168,76,0.15)', borderTop: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4rem', right: '2rem', width: '20px', height: '20px', borderRight: '1px solid rgba(201,168,76,0.15)', borderTop: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: '20px', height: '20px', borderLeft: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '20px', height: '20px', borderRight: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />
    </div>
  )
}
