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
  const sgTextRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(sgTextRef.current, { opacity: 0 })
      gsap.set(brandRef.current, {
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)',
      })
      gsap.set(taglineRef.current, { opacity: 0 })
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })

      const tl = gsap.timeline({
        onComplete: () => {
          // Give the exit animation time to complete before unmounting
          setTimeout(onComplete, 50)
        },
      })

      // Progress bar fills 0% → 100% over 2.2s (starts immediately)
      tl.to(
        progressRef.current,
        {
          scaleX: 1,
          duration: 2.2,
          ease: 'none',
        },
        0
      )

      // Counter counts 0 → 100 over 2.2s (starts immediately)
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 2.2,
          ease: 'none',
          onUpdate: function () {
            if (counterRef.current) {
              const v = Math.round(((this as unknown as gsap.core.Tween).targets()[0] as { val: number }).val)
              counterRef.current.textContent = String(v).padStart(3, '0')
            }
          },
        },
        0
      )

      // SG emblem text fades in at 0.3s
      tl.to(
        sgTextRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.3
      )

      // "SWIFT GOODS" text reveal at 0.6s
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.5,
          ease: 'power3.out',
        },
        0.6
      )

      // Tagline fades in at 0.9s
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.9
      )

      // EXIT at 2.4s — slide the container up + blur
      tl.to(
        containerRef.current,
        {
          y: '-100%',
          filter: 'blur(8px)',
          duration: 0.75,
          ease: 'power3.inOut',
        },
        2.4
      )
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
        willChange: 'transform, filter',
      }}
    >
      {/* ── Counter (top-right) ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          fontFamily: 'var(--font-impact), "Bebas Neue", sans-serif',
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          color: 'rgba(201,168,76,0.4)',
          userSelect: 'none',
        }}
      >
        <span ref={counterRef}>000</span>
      </div>

      {/* ── Signature Logo ────────────────────────────────────── */}
      <div ref={emblemRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer ring — spins CW 12s */}
        <div
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.5)',
            borderTopColor: 'rgba(201,168,76,1)',
            animation: 'sg-spin-cw 12s linear infinite',
          }}
        />

        {/* Inner ring — spins CCW 8s */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            border: '1px solid transparent',
            borderBottomColor: 'rgba(201,168,76,0.6)',
            animation: 'sg-spin-ccw 8s linear infinite',
          }}
        />

        {/* Signature logo image */}
        <div
          ref={sgTextRef}
          style={{
            width: '160px',
            height: '80px',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          <Image
            src="/brand/sg-signature-logo.jpeg"
            alt="Swift Goods"
            fill
            style={{
              objectFit: 'contain',
              filter: 'sepia(1) saturate(2) hue-rotate(15deg) brightness(0.85)',
            }}
            priority
          />
        </div>
      </div>

      {/* ── Brand name ──────────────────────────────────────────── */}
      <p
        ref={brandRef}
        style={{
          marginTop: '2.5rem',
          fontFamily: 'var(--font-impact), "Bebas Neue", sans-serif',
          fontSize: '1rem',
          letterSpacing: '0.5em',
          color: '#c9a84c',
          userSelect: 'none',
          textTransform: 'uppercase',
          paddingRight: '0.5em',
        }}
      >
        SWIFT GOODS
      </p>

      {/* ── Tagline ─────────────────────────────────────────────── */}
      <p
        ref={taglineRef}
        style={{
          marginTop: '0.75rem',
          fontFamily: 'var(--font-display), "Cormorant Garamond", serif',
          fontStyle: 'italic',
          fontSize: '0.85rem',
          letterSpacing: '0.2em',
          color: '#555555',
          userSelect: 'none',
        }}
      >
        COMFORT IS LUXURY.
      </p>

      {/* ── Progress bar (bottom) ───────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'rgba(201,168,76,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={progressRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #c9a84c, #e6c870)',
            transformOrigin: 'left center',
            boxShadow: '0 0 8px rgba(201,168,76,0.6)',
          }}
        />
      </div>
    </div>
  )
}
