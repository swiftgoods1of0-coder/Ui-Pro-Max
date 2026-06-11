'use client'

import { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// ─── Chrome Shader Material ───────────────────────────────────────────────────

const ChromeMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uBaseColor: new THREE.Vector3(1, 1, 1),
    uMetalness: 1.0,
  },
  // Vertex shader
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      vUv = uv;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uBaseColor;
    uniform float uMetalness;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 1.8);

      vec3 darkChrome = vec3(0.06, 0.06, 0.08);
      vec3 midChrome = vec3(0.40, 0.40, 0.45);
      vec3 brightChrome = vec3(0.90, 0.92, 1.00);
      vec3 goldTint = vec3(0.788, 0.659, 0.298);

      float bandY = sin(normal.y * 7.0 + uTime * 0.25) * 0.5 + 0.5;
      float bandX = sin(normal.x * 5.0 + uTime * 0.18) * 0.5 + 0.5;
      float bands = (bandY * 0.6 + bandX * 0.4);

      vec3 chrome = mix(darkChrome, midChrome, bands);
      chrome = mix(chrome, brightChrome, fresnel * 0.8 + 0.1);

      float goldAmount = pow(bands, 3.0) * 0.4 * uMetalness;
      chrome = mix(chrome, goldTint * 1.2, goldAmount);

      vec3 lightDir = normalize(vec3(uMouse.x * 3.0, uMouse.y * 3.0, 2.0));
      float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 48.0);
      chrome += spec * 1.2 * vec3(1.0, 0.96, 0.85);

      float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
      chrome += rim * goldTint * 0.35;

      gl_FragColor = vec4(uBaseColor * chrome, 1.0);
    }
  `
)

// ─── Gold Shader Material (for accent orbs) ──────────────────────────────────

const GoldMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uBaseColor: new THREE.Vector3(0.788, 0.659, 0.298),
    uMetalness: 0.6,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      vUv = uv;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uBaseColor;
    uniform float uMetalness;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);

      vec3 darkGold = vec3(0.35, 0.27, 0.05);
      vec3 midGold = vec3(0.788, 0.659, 0.298);
      vec3 brightGold = vec3(1.0, 0.92, 0.6);

      float bandY = sin(normal.y * 9.0 + uTime * 0.3) * 0.5 + 0.5;
      vec3 gold = mix(darkGold, midGold, bandY);
      gold = mix(gold, brightGold, fresnel * 0.9);

      vec3 lightDir = normalize(vec3(uMouse.x * 3.0, uMouse.y * 3.0, 2.0));
      float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 64.0);
      gold += spec * vec3(1.0, 0.98, 0.8) * 1.5;

      gl_FragColor = vec4(uBaseColor * gold * 1.1, 1.0);
    }
  `
)

// Register with R3F
extend({ ChromeMaterial, GoldMaterial })

// TypeScript declarations for custom materials
declare module '@react-three/fiber' {
  interface ThreeElements {
    chromeMaterial: React.PropsWithRef<{
      uTime?: number
      uMouse?: THREE.Vector2
      uBaseColor?: THREE.Vector3
      uMetalness?: number
      key?: string
    }>
    goldMaterial: React.PropsWithRef<{
      uTime?: number
      uMouse?: THREE.Vector2
      uBaseColor?: THREE.Vector3
      uMetalness?: number
      key?: string
    }>
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SwiftEmblemProps {
  mouse: { x: number; y: number }
}

// ─── Accent Orb Component ────────────────────────────────────────────────────

function AccentOrb({
  position,
  mouse,
  phase,
}: {
  position: [number, number, number]
  mouse: { x: number; y: number }
  phase: number
}) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
  }>(null)

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uTime = state.clock.elapsedTime + phase
    matRef.current.uMouse.set(mouse.x, mouse.y)
  })

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.055, 16, 16]} />
      {/* @ts-expect-error custom shader material */}
      <goldMaterial ref={matRef} key={GoldMaterial.key} />
    </mesh>
  )
}

// ─── Main Emblem Component ───────────────────────────────────────────────────

export default function SwiftEmblem({ mouse }: SwiftEmblemProps) {
  const groupRef = useRef<THREE.Group>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const decorRingRef = useRef<THREE.Mesh>(null)

  const outerMatRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
  }>(null)
  const innerMatRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
    uBaseColor: THREE.Vector3
    uMetalness: number
  }>(null)
  const decorMatRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
  }>(null)
  const coreMatRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uMouse: THREE.Vector2
    uBaseColor: THREE.Vector3
    uMetalness: number
  }>(null)

  // Generate the 8 accent orb positions around the outer ring
  const accentOrbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2
      const radius = 1.8
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0,
        ] as [number, number, number],
        phase: i * 0.785,
      }
    })
  }, [])

  // Target rotation for smooth mouse tracking
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const currentScale = useRef(1)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // ── Group-level animations ──────────────────────────────────────────────

    if (groupRef.current) {
      // Slow ambient Y rotation
      groupRef.current.rotation.y += 0.003

      // Float up and down
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15

      // Mouse reaction: gentle tilt toward mouse
      targetRotX.current = mouse.y * 0.3
      targetRotY.current = mouse.x * 0.3

      // Lerp current rotation toward target (mouse tilt is ADDITIVE to ambient rotation)
      groupRef.current.rotation.x += (targetRotX.current - groupRef.current.rotation.x) * 0.05

      // Breathing scale pulse: 0.98 → 1.02 over ~3 seconds
      const breathScale = 1.0 + Math.sin(t * (Math.PI * 2) / 3) * 0.02
      currentScale.current += (breathScale - currentScale.current) * 0.08
      groupRef.current.scale.setScalar(currentScale.current)
    }

    // ── Inner decorative ring counter-rotation ─────────────────────────────

    if (decorRingRef.current) {
      decorRingRef.current.rotation.z -= 0.002
      // Slight wobble on a different axis
      decorRingRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
    }

    // ── Outer ring subtle pulsing ──────────────────────────────────────────

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.001
    }

    // ── Shader uniform updates ─────────────────────────────────────────────

    if (outerMatRef.current) {
      outerMatRef.current.uTime = t
      outerMatRef.current.uMouse.set(mouse.x, mouse.y)
    }

    if (innerMatRef.current) {
      innerMatRef.current.uTime = t
      innerMatRef.current.uMouse.set(mouse.x, mouse.y)
    }

    if (decorMatRef.current) {
      decorMatRef.current.uTime = t
      decorMatRef.current.uMouse.set(mouse.x, mouse.y)
    }

    if (coreMatRef.current) {
      coreMatRef.current.uTime = t
      coreMatRef.current.uMouse.set(mouse.x, mouse.y)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Outer Ring ─────────────────────────────────────────────────── */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.8, 0.08, 16, 100]} />
        {/* @ts-expect-error custom shader material */}
        <chromeMaterial
          ref={outerMatRef}
          key={ChromeMaterial.key}
          uBaseColor={new THREE.Vector3(1.0, 1.0, 1.0)}
          uMetalness={1.0}
        />
      </mesh>

      {/* ── Inner Decorative Ring (counter-rotates) ─────────────────────── */}
      <mesh
        ref={decorRingRef}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[1.2, 0.04, 8, 60]} />
        {/* @ts-expect-error custom shader material */}
        <chromeMaterial
          ref={decorMatRef}
          key={ChromeMaterial.key + '_decor'}
          uBaseColor={new THREE.Vector3(0.95, 0.95, 1.0)}
          uMetalness={0.9}
        />
      </mesh>

      {/* ── Inner Ring (mid-size, forward-facing) ───────────────────────── */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.95, 0.05, 12, 80]} />
        {/* @ts-expect-error custom shader material */}
        <chromeMaterial
          ref={innerMatRef}
          key={ChromeMaterial.key + '_inner'}
          uBaseColor={new THREE.Vector3(0.9, 0.85, 0.75)}
          uMetalness={0.8}
        />
      </mesh>

      {/* ── Core Sphere ─────────────────────────────────────────────────── */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        {/* @ts-expect-error custom shader material */}
        <chromeMaterial
          ref={coreMatRef}
          key={ChromeMaterial.key + '_core'}
          uBaseColor={new THREE.Vector3(0.85, 0.80, 0.70)}
          uMetalness={0.7}
        />
      </mesh>

      {/* ── Gold Accent Orbs ─────────────────────────────────────────────── */}
      {accentOrbs.map((orb, i) => (
        <AccentOrb
          key={i}
          position={orb.position}
          mouse={mouse}
          phase={orb.phase}
        />
      ))}
    </group>
  )
}
