
import { useEffect, useRef } from 'react'

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLParagraphElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = {
      container: containerRef.current,
      logo: logoRef.current,
      name: nameRef.current,
      rule: ruleRef.current,
      tag: tagRef.current,
    }
    if (!el.container) return

    // Staggered entrance
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => {
      if (el.logo) {
        el.logo.style.transition = 'opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1), filter 700ms ease'
        el.logo.style.opacity = '1'
        el.logo.style.transform = 'translateY(0) scale(1)'
        el.logo.style.filter = 'drop-shadow(0 0 40px rgba(201,168,76,0.5))'
      }
    }, 80))

    timers.push(setTimeout(() => {
      if (el.name) {
        el.name.style.transition = 'opacity 600ms ease, letter-spacing 800ms cubic-bezier(0.16,1,0.3,1)'
        el.name.style.opacity = '1'
        el.name.style.letterSpacing = '0.65em'
      }
    }, 350))

    timers.push(setTimeout(() => {
      if (el.rule) {
        el.rule.style.transition = 'opacity 400ms ease, width 600ms cubic-bezier(0.16,1,0.3,1)'
        el.rule.style.opacity = '1'
        el.rule.style.width = '60px'
      }
    }, 550))

    timers.push(setTimeout(() => {
      if (el.tag) {
        el.tag.style.transition = 'opacity 500ms ease'
        el.tag.style.opacity = '1'
      }
    }, 700))

    // Exit
    timers.push(setTimeout(() => {
      if (el.container) {
        el.container.style.transition = 'opacity 700ms ease'
        el.container.style.opacity = '0'
        el.container.style.pointerEvents = 'none'
        setTimeout(() => onComplete?.(), 700)
      }
    }, 1800))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

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
      }}
    >
      {/* Ambient gold glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 400,
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 65%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Corner brackets */}
      {[
        { top: '12%', left: '8%', borderTop: '1px solid rgba(201,168,76,0.25)', borderLeft: '1px solid rgba(201,168,76,0.25)' },
        { top: '12%', right: '8%', borderTop: '1px solid rgba(201,168,76,0.25)', borderRight: '1px solid rgba(201,168,76,0.25)' },
        { bottom: '12%', left: '8%', borderBottom: '1px solid rgba(201,168,76,0.25)', borderLeft: '1px solid rgba(201,168,76,0.25)' },
        { bottom: '12%', right: '8%', borderBottom: '1px solid rgba(201,168,76,0.25)', borderRight: '1px solid rgba(201,168,76,0.25)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 32, height: 32, ...s }} />
      ))}

      {/* Logo + text stack */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
        <img
          ref={logoRef}
          src="/brand/sg-winged-s-transparent.png"
          alt="Swift Goods"
          width={110}
          height={110}
          style={{
            objectFit: 'contain',
            opacity: 0,
            transform: 'translateY(18px) scale(0.9)',
            filter: 'drop-shadow(0 0 0px rgba(201,168,76,0))',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <p
            ref={nameRef}
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '1.625rem',
              letterSpacing: '0.3em',
              color: '#f5f5f5',
              margin: 0,
              paddingRight: '0.3em',
              opacity: 0,
            }}
          >
            SWIFT GOODS
          </p>

          <div
            ref={ruleRef}
            style={{
              width: 0,
              height: '1px',
              background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
              opacity: 0,
            }}
          />

          <p
            ref={tagRef}
            style={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.5rem',
              letterSpacing: '0.42em',
              color: 'rgba(201,168,76,0.6)',
              margin: 0,
              textTransform: 'uppercase',
              paddingRight: '0.42em',
              opacity: 0,
            }}
          >
            Comfort Is Luxury
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: 'rgba(201,168,76,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, #c9a84c, #e6c870)',
          animation: 'sg-progress 1.8s ease-out forwards',
        }} />
      </div>
    </div>
  )
}
