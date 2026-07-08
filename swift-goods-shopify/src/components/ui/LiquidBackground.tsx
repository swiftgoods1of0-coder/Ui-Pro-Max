'use client'

import { useEffect, useRef } from 'react'

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let time = 0
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth
      mouse.ty = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Work at very low resolution — the noise is stretched to fill viewport
    const W = 96
    const H = 64
    canvas.width = W
    canvas.height = H

    // Pre-compute a static noise texture (256x256 tileable)
    const NOISE_SIZE = 256
    const noiseData = new Float32Array(NOISE_SIZE * NOISE_SIZE)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random()
    }

    function sampleNoise(x: number, y: number): number {
      const ix = ((Math.floor(x) % NOISE_SIZE) + NOISE_SIZE) % NOISE_SIZE
      const iy = ((Math.floor(y) % NOISE_SIZE) + NOISE_SIZE) % NOISE_SIZE
      const fx = x - Math.floor(x)
      const fy = y - Math.floor(y)
      const ux = fx * fx * (3 - 2 * fx)
      const uy = fy * fy * (3 - 2 * fy)

      const ix1 = (ix + 1) % NOISE_SIZE
      const iy1 = (iy + 1) % NOISE_SIZE

      return (
        noiseData[iy * NOISE_SIZE + ix] * (1 - ux) * (1 - uy) +
        noiseData[iy * NOISE_SIZE + ix1] * ux * (1 - uy) +
        noiseData[iy1 * NOISE_SIZE + ix] * (1 - ux) * uy +
        noiseData[iy1 * NOISE_SIZE + ix1] * ux * uy
      )
    }

    function fbm(x: number, y: number): number {
      return sampleNoise(x, y) * 0.5 + sampleNoise(x * 2.1, y * 2.1) * 0.3 + sampleNoise(x * 4.3, y * 4.3) * 0.2
    }

    const imageData = ctx.createImageData(W, H)
    const data = imageData.data

    let lastFrame = 0

    function draw(ts: number) {
      animId = requestAnimationFrame(draw)

      // Cap at ~24fps
      if (ts - lastFrame < 42) return
      lastFrame = ts

      time += 0.004

      // Smooth mouse interpolation
      mouse.x += (mouse.tx - mouse.x) * 0.03
      mouse.y += (mouse.ty - mouse.y) * 0.03

      const mx = mouse.x * 0.4
      const my = mouse.y * 0.4

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x * 0.08 + time + mx
          const ny = y * 0.08 + time * 0.6 + my
          const n = fbm(nx, ny)
          // Map to dark range: 5–14 (#050505 to #0e0e0e)
          const v = 5 + (n * 9) | 0
          const i = (y * W + x) << 2
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = 255
        }
      }

      ctx!.putImageData(imageData, 0, 0)

      // Gold shimmer — 3 faint horizontal bezier curves
      ctx!.lineWidth = 0.5
      ctx!.strokeStyle = 'rgba(201,168,76,0.04)'
      for (let l = 0; l < 3; l++) {
        const yOff = ((time * 6 + l * (H / 3)) % H)
        const amp = Math.sin(time * 1.5 + l * 2.1) * 2
        ctx!.beginPath()
        ctx!.moveTo(0, yOff + amp)
        ctx!.bezierCurveTo(W * 0.33, yOff + amp * 1.5, W * 0.66, yOff - amp, W, yOff + amp * 0.5)
        ctx!.stroke()
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
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
