

import { useEffect, useRef } from 'react'
interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    // Fade in content immediately
    inner.style.transition = 'opacity 200ms ease'
    inner.style.opacity = '1'

    // Exit after 800ms — fast, clean
    const exit = setTimeout(() => {
      container.style.transition = 'opacity 400ms ease'
      container.style.opacity = '0'
      setTimeout(onComplete, 400)
    }, 800)

    return () => clearTimeout(exit)
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
        opacity: 1,
      }}
    >
      <div
        ref={innerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          opacity: 0,
        }}
      >
        <img
          src="/brand/sg-winged-s-transparent.png"
          alt="Swift Goods"
          width={72}
          height={72}
          style={{ objectFit: 'contain' }}
        />
        <p
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: '1rem',
            letterSpacing: '0.5em',
            color: '#c9a84c',
            margin: 0,
            paddingRight: '0.5em',
          }}
        >
          SWIFT GOODS
        </p>
      </div>

      {/* Bottom progress bar — pure CSS, no JS */}
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
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, #c9a84c, #e6c870)',
            animation: 'sg-progress 0.8s ease-out forwards',
          }}
        />
      </div>
    </div>
  )
}
