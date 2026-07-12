

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
  life: number
  maxLife: number
  shimmer: number
}

export default function GoldParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollVelRef = useRef(0)
  const lastScrollRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    let mouseMoveRaf = 0
    const onMouse = (e: MouseEvent) => {
      cancelAnimationFrame(mouseMoveRaf)
      mouseMoveRaf = requestAnimationFrame(() => {
        mouseRef.current.x = e.clientX
        mouseRef.current.y = e.clientY
      })
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const onScroll = () => {
      const current = window.scrollY
      scrollVelRef.current = current - lastScrollRef.current
      lastScrollRef.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const PARTICLE_COUNT = 50
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.3,
        opacity: 0,
        baseOpacity: Math.random() * 0.35 + 0.08,
        life: Math.random() * 1000,
        maxLife: 600 + Math.random() * 600,
        shimmer: Math.random() * Math.PI * 2,
      })
    }

    // Pre-cached RGB strings — avoids allocating array + string on every draw call
    const GOLD_RGB = ['201,168,76', '230,200,112', '200,170,138', '255,235,150'] as const

    const INTERACT_RADIUS = 180
    const INTERACT_RADIUS_SQ = INTERACT_RADIUS * INTERACT_RADIUS

    // Cached gradient — recreated only when mouse moves >5px
    let gradX = -1, gradY = -1, cachedGrad: CanvasGradient | null = null

    let lastTs = 0
    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw)

      // ~30fps cap — halves CPU/GPU work vs 60fps with no perceptible difference
      if (ts - lastTs < 33) return
      lastTs = ts

      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const sv = scrollVelRef.current

      scrollVelRef.current *= 0.92

      for (const p of particles) {
        p.life++
        p.shimmer += 0.03
        if (p.life > p.maxLife) {
          p.life = 0
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.opacity = 0
        }

        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.opacity = (lifeRatio / 0.1) * p.baseOpacity
        } else if (lifeRatio > 0.85) {
          p.opacity = ((1 - lifeRatio) / 0.15) * p.baseOpacity
        } else {
          p.opacity = p.baseOpacity
        }

        p.opacity *= 0.7 + 0.3 * Math.sin(p.shimmer)

        const dx = p.x - mx
        const dy = p.y - my
        const distSq = dx * dx + dy * dy

        if (distSq < INTERACT_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / INTERACT_RADIUS) * 0.6
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
          p.opacity = Math.min(p.baseOpacity + 0.35, 0.75)
        }

        p.vy += sv * 0.008
        p.vx *= 0.97
        p.vy *= 0.97
        p.vx += (Math.random() - 0.5) * 0.015
        p.vy += (Math.random() - 0.5) * 0.015

        p.x += p.vx
        p.y += p.vy

        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        const rgb = GOLD_RGB[Math.floor(p.shimmer) & 3]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${p.opacity.toFixed(2)})`
        ctx.fill()

        if (p.size > 1.5 && p.opacity > 0.15) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},${(p.opacity * 0.08).toFixed(3)})`
          ctx.fill()
        }
      }

      if (mx > 0 && my > 0) {
        // Recreate gradient only when mouse moved significantly
        if (Math.abs(mx - gradX) > 5 || Math.abs(my - gradY) > 5) {
          cachedGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 100)
          cachedGrad.addColorStop(0, 'rgba(201,168,76,0.03)')
          cachedGrad.addColorStop(1, 'rgba(201,168,76,0)')
          gradX = mx; gradY = my
        }
        if (cachedGrad) {
          ctx.fillStyle = cachedGrad
          ctx.fillRect(mx - 100, my - 100, 200, 200)
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(mouseMoveRaf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.55,
      }}
      aria-hidden="true"
    />
  )
}
