'use client'

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Sparkles, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// ─── Shared scroll + mouse state (ref — zero React re-renders) ───
interface WorldState {
  scroll: number   // 0-1 total page
  mx: number       // -1 to 1
  my: number       // -1 to 1
}

// ─── Acrux Star ─────────────────────────────────────────────────
function AcruxStar({ ws }: { ws: React.MutableRefObject<WorldState> }) {
  const groupRef   = useRef<THREE.Group>(null)
  const coreRef    = useRef<THREE.Mesh>(null)
  const midRef     = useRef<THREE.Mesh>(null)
  const outerRef   = useRef<THREE.Mesh>(null)
  const lightRef   = useRef<THREE.PointLight>(null)
  const flaresRef  = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const { scroll, mx, my } = ws.current
    const t = state.clock.elapsedTime

    // Mouse parallax — feels alive
    groupRef.current.position.x += (mx * 0.35 - groupRef.current.position.x) * 0.04
    groupRef.current.position.y += (-my * 0.25 - groupRef.current.position.y) * 0.04

    // Grow with scroll — universe expanding
    const starScale = 1 + scroll * 1.2
    groupRef.current.scale.setScalar(starScale)

    // Core pulse
    const pulse = 1 + Math.sin(t * 1.8) * 0.07
    coreRef.current!.scale.setScalar(pulse)

    // Flare slow rotation
    if (flaresRef.current) flaresRef.current.rotation.z = t * 0.25

    // Light breathe
    lightRef.current!.intensity = 70 + Math.sin(t * 2.2) * 18

    // Subtle overall rotation
    groupRef.current.rotation.y += delta * 0.04
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <pointLight ref={lightRef} color="#4488ff" intensity={70} distance={40} decay={1.8} />
      <pointLight color="#ffffff" intensity={12} distance={6} decay={2} />

      {/* Volumetric outer aura */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          color="#001033"
          emissive="#0033aa"
          emissiveIntensity={0.18}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Mid glow */}
      <mesh ref={midRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#003399"
          emissive="#0055dd"
          emissiveIntensity={0.8}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>

      {/* Star core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#eef8ff"
          emissive="#aaddff"
          emissiveIntensity={7}
        />
      </mesh>

      {/* Cross flares */}
      <group ref={flaresRef}>
        {[0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}>
            <planeGeometry args={i < 2 ? [0.045, 7] : [0.028, 5]} />
            <meshStandardMaterial
              color={i < 2 ? '#cce8ff' : '#6699ff'}
              emissive={i < 2 ? '#cce8ff' : '#6699ff'}
              emissiveIntensity={i < 2 ? 4.5 : 2.5}
              transparent
              opacity={i < 2 ? 0.75 : 0.45}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ─── Reactive Particle Field ─────────────────────────────────────
function ParticleField({ ws }: { ws: React.MutableRefObject<WorldState> }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { geo, vel } = useMemo(() => {
    const COUNT = 6000
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)

    const blue   = new THREE.Color('#3366ff')
    const cyan   = new THREE.Color('#00aaff')
    const white  = new THREE.Color('#ffffff')

    for (let i = 0; i < COUNT; i++) {
      // Spherical spread
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r     = 6 + Math.pow(Math.random(), 0.6) * 36

      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = r * Math.cos(phi)

      const t = Math.random()
      const c = t < 0.25 ? white : t < 0.55 ? cyan : blue
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b

      vel[i*3]   = (Math.random() - 0.5) * 0.006
      vel[i*3+1] = (Math.random() - 0.5) * 0.006
      vel[i*3+2] = (Math.random() - 0.5) * 0.003
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return { geo: g, vel }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const { mx, my } = ws.current
    const t   = state.clock.elapsedTime
    const pos = geo.attributes.position.array as Float32Array
    const N   = pos.length / 3

    for (let i = 0; i < N; i++) {
      const ix = i*3, iy = i*3+1, iz = i*3+2

      pos[ix] += vel[ix] + Math.sin(t * 0.12 + i * 0.01) * 0.0015
      pos[iy] += vel[iy] + Math.cos(t * 0.09 + i * 0.02) * 0.0015
      pos[iz] += vel[iz]

      // Mouse repulsion (screen-space approx)
      const dx = pos[ix] - mx * 9
      const dy = pos[iy] + my * 7
      const d  = Math.sqrt(dx*dx + dy*dy)
      if (d < 4.5) {
        pos[ix] += (dx/d) * 0.025
        pos[iy] += (dy/d) * 0.025
      }

      // Boundary respawn
      const dist = Math.sqrt(pos[ix]**2 + pos[iy]**2 + pos[iz]**2)
      if (dist > 48) { pos[ix] *= 0.5; pos[iy] *= 0.5; pos[iz] *= 0.5 }
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Orbital Rings ───────────────────────────────────────────────
function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null)

  const rings = useMemo(() => [
    { r: 2.8,  count: 90,  speed: 0.18, tilt: 15,  col: '#3399ff', opacity: 0.55 },
    { r: 5.0,  count: 140, speed: 0.10, tilt: -35, col: '#1155cc', opacity: 0.4  },
    { r: 7.8,  count: 200, speed: 0.06, tilt: 60,  col: '#0a2d88', opacity: 0.28 },
  ].map(({ r, count, speed, tilt, col, opacity }) => {
    const pos = new Float32Array(count * 3)
    for (let j = 0; j < count; j++) {
      const a = (j / count) * Math.PI * 2
      pos[j*3]   = Math.cos(a) * r
      pos[j*3+1] = (Math.random() - 0.5) * 0.25
      pos[j*3+2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { g, speed, tilt: tilt * Math.PI / 180, col, opacity }
  }), [])

  useFrame((_, delta) => {
    groupRef.current!.children.forEach((c, i) => {
      c.rotation.y += rings[i].speed * delta
    })
  })

  return (
    <group ref={groupRef}>
      {rings.map(({ g, tilt, col, opacity }, i) => (
        <points key={i} geometry={g} rotation={[tilt, 0, 0]}>
          <pointsMaterial
            color={col}
            size={0.038}
            sizeAttenuation
            transparent
            opacity={opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      ))}
    </group>
  )
}

// ─── Floating Architecture (services area) ───────────────────────
function FloatingArchitecture({ ws }: { ws: React.MutableRefObject<WorldState> }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const { scroll } = ws.current
    const t = state.clock.elapsedTime
    // Emerge as user scrolls into services
    const show = Math.max(0, Math.min(1, (scroll - 0.1) * 8))
    groupRef.current.position.y = -3 + show * 2
    groupRef.current.children.forEach((child, i) => {
      (child as THREE.Mesh).position.y = Math.sin(t * 0.4 + i) * 0.15
    })
  })

  return (
    <group ref={groupRef} position={[0, -4, -5]}>
      {[-4, -2, 0, 2, 4, 6].map((x, i) => (
        <mesh key={i} position={[x - 1.5, 0, 0]}>
          <boxGeometry args={[0.4, 1.5 + i * 0.3, 0.4]} />
          <meshStandardMaterial
            color="#001133"
            emissive={`hsl(${210 + i * 8}, 80%, 50%)`}
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Camera Controller ───────────────────────────────────────────
function CameraController({ ws }: { ws: React.MutableRefObject<WorldState> }) {
  const { camera } = useThree()

  useFrame(() => {
    const { scroll, mx, my } = ws.current
    const z = 9 - scroll * 3.5
    const y = scroll * 1.8
    const x = Math.sin(scroll * Math.PI * 0.7) * 0.9

    camera.position.x += (x + mx * 0.18 - camera.position.x) * 0.02
    camera.position.y += (y - my * 0.12 - camera.position.y) * 0.02
    camera.position.z += (z - camera.position.z) * 0.025
    camera.lookAt(0, scroll * 0.5, 0)
  })

  return null
}

// ─── Inner scene ─────────────────────────────────────────────────
function Scene({ ws }: { ws: React.MutableRefObject<WorldState> }) {
  return (
    <>
      <ambientLight intensity={0.04} />
      <Stars radius={200} depth={80} count={8000} factor={3.5} saturation={0.4} fade speed={0.25} />
      <Sparkles count={70} scale={[18, 18, 18]} size={2.5} speed={0.35} color="#3366ff" opacity={0.55} />

      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
        <AcruxStar ws={ws} />
      </Float>

      <ParticleField ws={ws} />
      <OrbitalRings />
      <FloatingArchitecture ws={ws} />
      <CameraController ws={ws} />

      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={2.8}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.96}
          radius={0.85}
        />
      </EffectComposer>
    </>
  )
}

// ─── Exported WorldCanvas ────────────────────────────────────────
export function WorldCanvas() {
  const ws = useRef<WorldState>({ scroll: 0, mx: 0, my: 0 })

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      ws.current.scroll = max > 0 ? window.scrollY / max : 0
    }
    const onMouse = (e: MouseEvent) => {
      ws.current.mx = (e.clientX / window.innerWidth) * 2 - 1
      ws.current.my = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <color attach="background" args={['#020508']} />
        <Suspense fallback={null}>
          <Scene ws={ws} />
        </Suspense>
      </Canvas>
    </div>
  )
}
