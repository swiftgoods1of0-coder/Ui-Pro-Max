

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

interface MouseSpotlightProps {
  children: ReactNode
  className?: string
  color?: string
  size?: number
  style?: React.CSSProperties
}

export default function MouseSpotlight({
  children,
  className,
  color = 'rgba(201,168,76,0.06)',
  size = 600,
  style,
}: MouseSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current
      const spotlight = spotlightRef.current
      if (!container || !spotlight) return

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left - size
        const y = e.clientY - rect.top - size
        spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    },
    [size],
  )

  const handleMouseEnter = useCallback(() => {
    setVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave])

  const diameter = size * 2

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
