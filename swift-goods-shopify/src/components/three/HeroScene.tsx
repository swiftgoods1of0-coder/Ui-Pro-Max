'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import SwiftEmblem from './SwiftEmblem'
import ParticleSystem from './ParticleSystem'

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

interface HeroSceneProps {
  className?: string
}

export default function HeroScene({ className }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [dpr, setDpr] = useState(1.5)
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isWebGLAvailable()) setWebGLSupported(false)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    setMouse({ x, y })
  }, [])

  const handlePointerLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 })
  }, [])

  if (!webGLSupported || hasError) return null

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
        onCreated={() => {}}
        fallback={null}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, 2))}
        >
          <AdaptiveDpr pixelated />

          <ambientLight intensity={0.15} color="#111111" />

          <pointLight
            position={[10, 10, 10]}
            intensity={2}
            color="#e0e0e0"
            decay={2}
            distance={50}
          />

          <pointLight
            position={[-10, -5, 5]}
            intensity={1}
            color="#c9a84c"
            decay={2}
            distance={50}
          />

          <pointLight
            position={[0, -10, -10]}
            intensity={0.8}
            color="#4444cc"
            decay={2}
            distance={50}
          />

          <pointLight
            position={[5, 5, -5]}
            intensity={1.5}
            color="#ffffff"
            decay={2}
            distance={50}
          />

          <pointLight
            position={[-5, 3, -8]}
            intensity={0.6}
            color="#c9a84c"
            decay={2}
            distance={30}
          />

          <Suspense fallback={null}>
            <SwiftEmblem mouse={mouse} />
            <ParticleSystem mouse={mouse} />
            <Environment preset="studio" />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
