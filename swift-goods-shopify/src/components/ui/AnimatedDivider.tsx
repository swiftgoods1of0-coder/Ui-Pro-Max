'use client'

import { useEffect, useRef } from 'react'

interface AnimatedDividerProps {
  className?: string
  delay?: number
}

export default function AnimatedDivider({
  className,
  delay = 0,
}: AnimatedDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Select all animatable elements
        const centerDiamond = container.querySelector<HTMLElement>('[data-el="center-diamond"]')
        const centerGlow = container.querySelector<HTMLElement>('[data-el="center-glow"]')
        const lineLeft = container.querySelector<HTMLElement>('[data-el="line-left"]')
        const lineRight = container.querySelector<HTMLElement>('[data-el="line-right"]')
        const outerLeft = container.querySelector<HTMLElement>('[data-el="outer-left"]')
        const outerRight = container.querySelector<HTMLElement>('[data-el="outer-right"]')
        const dotLeft = container.querySelector<HTMLElement>('[data-el="dot-left"]')
        const dotRight = container.querySelector<HTMLElement>('[data-el="dot-right"]')
        const accentLineLeft = container.querySelector<HTMLElement>('[data-el="accent-left"]')
        const accentLineRight = container.querySelector<HTMLElement>('[data-el="accent-right"]')

        // Set initial states — everything hidden
        gsap.set(centerDiamond, { opacity: 0, scale: 0 })
        gsap.set(centerGlow, { opacity: 0, scale: 0.5 })
        gsap.set([lineLeft, lineRight], { scaleX: 0 })
        gsap.set([outerLeft, outerRight], { opacity: 0, scale: 0 })
        gsap.set([dotLeft, dotRight], { opacity: 0, scale: 0 })
        gsap.set([accentLineLeft, accentLineRight], { scaleX: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay,
        })

        // 1. Center diamond appears first
        tl.to(centerDiamond, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        })

        // 2. Center glow fades in
        tl.to(
          centerGlow,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3',
        )

        // 3. Main lines expand outward from center
        tl.to(
          lineLeft,
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '-=0.3',
        )
        tl.to(
          lineRight,
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '<',
        )

        // 4. Side dots appear (staggered)
        tl.to(
          [dotLeft, dotRight],
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'back.out(2)',
            stagger: 0.08,
          },
          '-=0.4',
        )

        // 5. Outer diamonds appear
        tl.to(
          [outerLeft, outerRight],
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            stagger: 0.1,
          },
          '-=0.2',
        )

        // 6. Accent lines extend outward from outer diamonds
        tl.to(
          accentLineLeft,
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.15',
        )
        tl.to(
          accentLineRight,
          {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          '<',
        )
      }, container)
    }

    init()

    return () => {
      ctx?.revert()
    }
  }, [delay])

  return (
    <div
      ref={containerRef}
      className={`py-8 ${className || ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Radial glow behind center area */}
      <div
        data-el="center-glow"
        style={{
          position: 'absolute',
          width: '200px',
          height: '40px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ---- Left side structure ---- */}

      {/* Outer accent line (far left) */}
      <div
        data-el="accent-left"
        style={{
          position: 'absolute',
          right: '50%',
          marginRight: '180px',
          width: '120px',
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(201,168,76,0.3))',
          transformOrigin: 'right center',
          willChange: 'transform',
        }}
      />

      {/* Outer left diamond */}
      <div
        data-el="outer-left"
        style={{
          position: 'absolute',
          right: '50%',
          marginRight: '172px',
          width: '5px',
          height: '5px',
          backgroundColor: 'rgba(201,168,76,0.55)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 8px rgba(201,168,76,0.2)',
          zIndex: 2,
        }}
      />

      {/* Main line left */}
      <div
        data-el="line-left"
        style={{
          position: 'absolute',
          right: '50%',
          marginRight: '18px',
          width: '160px',
          height: '1px',
          background:
            'linear-gradient(to left, rgba(201,168,76,0.5), rgba(201,168,76,0.2) 70%, rgba(201,168,76,0.35))',
          transformOrigin: 'right center',
          willChange: 'transform',
        }}
      />

      {/* Left dot */}
      <div
        data-el="dot-left"
        style={{
          position: 'absolute',
          right: '50%',
          marginRight: '80px',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,168,76,0.5)',
          boxShadow: '0 0 6px rgba(201,168,76,0.2)',
          zIndex: 2,
        }}
      />

      {/* ---- Right side structure (mirrored) ---- */}

      {/* Main line right */}
      <div
        data-el="line-right"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: '18px',
          width: '160px',
          height: '1px',
          background:
            'linear-gradient(to right, rgba(201,168,76,0.5), rgba(201,168,76,0.2) 70%, rgba(201,168,76,0.35))',
          transformOrigin: 'left center',
          willChange: 'transform',
        }}
      />

      {/* Right dot */}
      <div
        data-el="dot-right"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: '80px',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,168,76,0.5)',
          boxShadow: '0 0 6px rgba(201,168,76,0.2)',
          zIndex: 2,
        }}
      />

      {/* Outer right diamond */}
      <div
        data-el="outer-right"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: '172px',
          width: '5px',
          height: '5px',
          backgroundColor: 'rgba(201,168,76,0.55)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 8px rgba(201,168,76,0.2)',
          zIndex: 2,
        }}
      />

      {/* Outer accent line (far right) */}
      <div
        data-el="accent-right"
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: '180px',
          width: '120px',
          height: '1px',
          background:
            'linear-gradient(to left, transparent, rgba(201,168,76,0.3))',
          transformOrigin: 'left center',
          willChange: 'transform',
        }}
      />

      {/* ---- Center diamond with glow pulse ---- */}
      <div
        data-el="center-diamond"
        style={{
          position: 'relative',
          width: '8px',
          height: '8px',
          backgroundColor: '#c9a84c',
          transform: 'rotate(45deg)',
          boxShadow:
            '0 0 10px rgba(201,168,76,0.5), 0 0 20px rgba(201,168,76,0.25), 0 0 30px rgba(201,168,76,0.1)',
          animation: 'sg-diamond-spin 8s infinite linear, pulse-gold 3s infinite ease-in-out',
          willChange: 'transform, opacity',
          zIndex: 3,
        }}
      />
    </div>
  )
}
