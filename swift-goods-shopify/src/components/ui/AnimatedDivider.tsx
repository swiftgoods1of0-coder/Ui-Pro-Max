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
  const lineRef = useRef<HTMLDivElement>(null)
  const diamondRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const line = lineRef.current
    const diamond = diamondRef.current
    if (!container || !line || !diamond) return

    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(line, { scaleX: 0 })
        gsap.set(diamond, { opacity: 0, scale: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay,
        })

        tl.to(line, {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        })

        tl.to(
          diamond,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '>',
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
      className={className}
      style={{
        position: 'relative',
        height: '1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Gold line */}
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, transparent 5%, rgba(201,168,76,0.25) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.25) 70%, transparent 95%)',
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      />

      {/* Center diamond */}
      <div
        ref={diamondRef}
        style={{
          position: 'absolute',
          width: '6px',
          height: '6px',
          backgroundColor: 'rgba(201,168,76,0.7)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 12px rgba(201,168,76,0.3)',
          animation: 'sg-diamond-spin 8s infinite linear',
          willChange: 'transform',
          zIndex: 1,
        }}
      />
    </div>
  )
}
