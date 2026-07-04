'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  hue: number
}

const GOLD_HUES = ['#c9a84c', '#e6c870', '#d4b86a', '#c8aa8a', '#f0d080']

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []
    let mouseX = -100, mouseY = -100

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Spawn 2-3 particles
      const count = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < count; i++) {
        if (particles.length >= 250) {
          particles.shift()
        }
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 4,
          y: mouseY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 0.8 - 0.5,
          life: 1,
          size: 1.5 + Math.random() * 2,
          hue: Math.floor(Math.random() * GOLD_HUES.length),
        })
      }
      // Restart draw loop if it paused (no active particles)
      if (!animId) animId = requestAnimationFrame(draw)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      ctx!.save()
      ctx!.shadowBlur = 6
      ctx!.shadowColor = 'rgba(201,168,76,0.4)'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04  // gravity
        p.vx += (Math.random() - 0.5) * 0.08  // drift
        p.life -= 0.018

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const alpha = p.life * 0.85
        const radius = p.size * p.life

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, Math.max(0.1, radius), 0, Math.PI * 2)
        ctx!.fillStyle = GOLD_HUES[p.hue]
        ctx!.globalAlpha = alpha
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      ctx!.restore()

      // Only keep the loop alive while particles exist — stops wasting GPU when idle
      if (particles.length > 0) {
        animId = requestAnimationFrame(draw)
      } else {
        animId = 0
      }
    }
    // Don't start the loop immediately — it starts on first mouse move

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  )
}
