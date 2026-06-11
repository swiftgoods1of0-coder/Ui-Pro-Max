// @ts-nocheck
'use client'

import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Particle Shader Material ─────────────────────────────────────────────────

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  },
  // Vertex shader
  /* glsl */ `
    attribute float aSize;
    attribute vec3 aColor;
    attribute float aPhase;

    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPixelRatio;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;

      vec3 pos = position;

      // Organic drift animation
      pos.x += sin(uTime * 0.4 + aPhase * 6.28) * 0.08;
      pos.y += cos(uTime * 0.3 + aPhase * 6.28 + 1.0) * 0.08;
      pos.z += sin(uTime * 0.35 + aPhase * 6.28 + 2.0) * 0.06;

      // Mouse repulsion
      vec2 toMouse = uMouse * 3.0 - pos.xy;
      float mouseDist = length(toMouse);
      float mouseInfluence = 1.0 / (mouseDist * mouseDist + 0.5);
      pos.xy -= normalize(toMouse) * mouseInfluence * 0.4;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Breathing alpha
      vAlpha = 0.6 + sin(uTime * 0.5 + aPhase * 6.28) * 0.2;

      gl_PointSize = aSize * uPixelRatio * (250.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  /* glsl */ `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 xy = gl_PointCoord * 2.0 - 1.0;
      float r = dot(xy, xy);
      if (r > 1.0) discard;
      float alpha = (1.0 - smoothstep(0.3, 1.0, r)) * vAlpha;
      gl_FragColor = vec4(vColor, alpha);
    }
  `
)

// Register with R3F
extend({ ParticleMaterial })

// TypeScript declaration for custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: React.PropsWithRef<{
      uTime?: number
      uMouse?: THREE.Vector2
      uPixelRatio?: number
      transparent?: boolean
      depthWrite?: boolean
      blending?: THREE.Blending
      vertexColors?: boolean
      key?: string
    }>
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticleSystemProps {
  mouse: { x: number; y: number }
}

// ─── Color palette (weighted toward silver/platinum) ─────────────────────────

const PALETTE = [
  // Silver variants (high weight)
  { r: 0.722, g: 0.722, b: 0.722 }, // #b8b8b8 silver
  { r: 0.722, g: 0.722, b: 0.722 }, // duplicate for weight
  { r: 0.878, g: 0.878, b: 0.878 }, // #e0e0e0 platinum
  { r: 0.878, g: 0.878, b: 0.878 }, // duplicate for weight
  { r: 0.820, g: 0.820, b: 0.840 }, // cool silver
  { r: 0.820, g: 0.820, b: 0.840 }, // duplicate for weight
  // White (high weight)
  { r: 1.000, g: 1.000, b: 1.000 }, // pure white
  { r: 1.000, g: 1.000, b: 1.000 }, // duplicate for weight
  { r: 0.960, g: 0.960, b: 0.980 }, // near white with blue tint
  // Gold variants (lower weight)
  { r: 0.788, g: 0.659, b: 0.298 }, // #c9a84c gold
  { r: 0.860, g: 0.740, b: 0.380 }, // lighter gold
  { r: 0.620, g: 0.500, b: 0.180 }, // darker gold
]

// ─── Main ParticleSystem Component ───────────────────────────────────────────

export default function ParticleSystem({ mouse }: ParticleSystemProps) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
    uPixelRatio: number
  }>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const COUNT = 2000

  // ── Generate particle geometry data ────────────────────────────────────────
  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3

      // Hollow sphere distribution: radius between 2 and 5
      // Use rejection sampling for uniform sphere surface distribution
      let x: number, y: number, z: number, len: number
      do {
        x = (Math.random() * 2 - 1)
        y = (Math.random() * 2 - 1)
        z = (Math.random() * 2 - 1)
        len = Math.sqrt(x * x + y * y + z * z)
      } while (len === 0)

      // Normalize then scale to random radius in [2, 5]
      const norm = 1 / len

      // Bias some particles toward the equatorial ring (y near 0)
      // ~30% of particles get equatorial clustering
      let radius: number
      if (Math.random() < 0.3) {
        // Equatorial ring cluster: small radius range, flat y
        radius = 1.8 + Math.random() * 0.8
        const angle = Math.random() * Math.PI * 2
        const ringY = (Math.random() * 2 - 1) * 0.3 // flat band
        positions[i3]     = Math.cos(angle) * radius
        positions[i3 + 1] = ringY
        positions[i3 + 2] = Math.sin(angle) * radius
      } else {
        // Full hollow sphere
        radius = 2.0 + Math.random() * 3.0
        positions[i3]     = x * norm * radius
        positions[i3 + 1] = y * norm * radius
        positions[i3 + 2] = z * norm * radius
      }

      // Assign color from weighted palette
      const colorEntry = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      // Slight per-particle brightness variation
      const brightness = 0.75 + Math.random() * 0.35
      colors[i3]     = colorEntry.r * brightness
      colors[i3 + 1] = colorEntry.g * brightness
      colors[i3 + 2] = colorEntry.b * brightness

      // Random size 1.5 → 4.0, skewed toward smaller
      sizes[i] = 1.5 + Math.pow(Math.random(), 2) * 2.5

      // Random phase 0 → 1
      phases[i] = Math.random()
    }

    return { positions, colors, sizes, phases }
  }, [])

  // Build the BufferGeometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return geo
  }, [positions, colors, sizes, phases])

  // ── Animation loop ──────────────────────────────────────────────────────────
  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uTime = state.clock.elapsedTime
    matRef.current.uMouse.set(mouse.x, mouse.y)
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <particleMaterial
        ref={matRef as any}
        key={ParticleMaterial.key}
        uPixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
      />
    </points>
  )
}
