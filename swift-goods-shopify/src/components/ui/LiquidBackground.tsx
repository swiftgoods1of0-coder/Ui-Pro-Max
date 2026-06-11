'use client'

import { useEffect, useRef } from 'react'

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let time = 0
    let mouse = { x: 0.5, y: 0.5 }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth
      mouse.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * 0.5)
      canvas.height = Math.floor(window.innerHeight * 0.5)
    }
    resize()
    window.addEventListener('resize', resize)

    // Simple value noise (hash-based, no external deps)
    function hash(x: number, y: number): number {
      let h = (x * 374761393 + y * 668265263) | 0
      h = (h ^ (h >> 13)) * 1274126177
      return ((h ^ (h >> 16)) & 0xffff) / 0xffff
    }

    function smoothNoise(x: number, y: number): number {
      const ix = Math.floor(x)
      const iy = Math.floor(y)
      const fx = x - ix
      const fy = y - iy
      const ux = fx * fx * (3 - 2 * fx)
      const uy = fy * fy * (3 - 2 * fy)
      return (
        hash(ix, iy) * (1 - ux) * (1 - uy) +
        hash(ix + 1, iy) * ux * (1 - uy) +
        hash(ix, iy + 1) * (1 - ux) * uy +
        hash(ix + 1, iy + 1) * ux * uy
      )
    }

    function fbm(x: number, y: number): number {
      return (
        smoothNoise(x, y) * 0.5 +
        smoothNoise(x * 2, y * 2) * 0.25 +
        smoothNoise(x * 4, y * 4) * 0.125
      )
    }

    // Draw at ~30fps
    let last = 0

    function draw(ts: number) {
      animId = requestAnimationFrame(draw)
      if (ts - last < 33) return // ~30fps cap
      last = ts
      time += 0.0003

      const w = canvas!.width
      const h = canvas!.height
      const imageData = ctx!.createImageData(w, h)
      const data = imageData.data

      const mx = mouse.x
      const my = mouse.y

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // Mouse displacement subtly warps the noise field (max ~30px at 0.5x scale = 15 noise-space units)
          const dx = (x / w - mx) * 0.15
          const dy = (y / h - my) * 0.15
          const nx = x / w * 3 + time + dx
          const ny = y / h * 3 + time * 0.7 + dy
          const n = fbm(nx, ny)
          // Map noise 0..1 to dark range 5..13 (#050505 to #0d0d0d)
          const v = Math.round(5 + n * 8)
          const i = (y * w + x) * 4
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = 255
        }
      }
      ctx!.putImageData(imageData, 0, 0)

      // Gold shimmer lines — 3 faint horizontal waves drifting upward
      for (let l = 0; l < 3; l++) {
        const yPos = ((time * 80 + l * (h / 3)) % h)
        const amplitude = Math.sin(time * 2 + l) * 4
        ctx!.beginPath()
        ctx!.moveTo(0, yPos + amplitude)
        ctx!.bezierCurveTo(
          w * 0.33, yPos + amplitude * 1.5,
          w * 0.66, yPos - amplitude,
          w, yPos + amplitude * 0.5
        )
        ctx!.strokeStyle = 'rgba(201,168,76,0.03)'
        ctx!.lineWidth = 1
        ctx!.stroke()
      }
    }

    animId = requestAnimationFrame(draw)

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
        zIndex: -1,
        pointerEvents: 'none',
        imageRendering: 'auto',
      }}
    />
  )
}
