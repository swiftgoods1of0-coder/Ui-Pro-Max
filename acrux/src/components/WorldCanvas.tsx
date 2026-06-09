'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Soft circular glow sprite ────────────────────────────────────
function makeGlowSprite(): THREE.CanvasTexture {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const half = size / 2
  const g = ctx.createRadialGradient(half, half, 0, half, half, half)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(210,230,255,0.9)')
  g.addColorStop(0.45, 'rgba(100,160,255,0.45)')
  g.addColorStop(0.75, 'rgba(40,80,200,0.15)')
  g.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

// ── Star diffraction spike texture ───────────────────────────────
function makeFlareTexture(): THREE.CanvasTexture {
  const w = 8, h = 512
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0,    'rgba(0,0,0,0)')
  g.addColorStop(0.32, 'rgba(160,210,255,0.18)')
  g.addColorStop(0.5,  'rgba(255,255,255,1)')
  g.addColorStop(0.68, 'rgba(160,210,255,0.18)')
  g.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  return new THREE.CanvasTexture(c)
}

export function WorldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer setup ───────────────────────────────────────
    let W = window.innerWidth
    let H = window.innerHeight
    const mobile = W < 768

    const renderer = new THREE.WebGLRenderer({ antialias: !mobile })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020508)

    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 600)
    camera.position.set(0, 1.2, 9)

    const glowTex  = makeGlowSprite()
    const flareTex = makeFlareTexture()

    // ── Galaxy spiral (18 000 particles, 3 arms) ─────────────
    const GALAXY = mobile ? 7000 : 18000
    const gPos = new Float32Array(GALAXY * 3)
    const gCol = new Float32Array(GALAXY * 3)

    for (let i = 0; i < GALAXY; i++) {
      const arm    = i % 3
      const t      = i / GALAXY + Math.random() * 0.018
      const armOff = (arm / 3) * Math.PI * 2
      const angle  = armOff + t * Math.PI * 5 + (Math.random() - 0.5) * 0.65
      const r      = 0.3 + Math.pow(t, 0.42) * 15 + (Math.random() - 0.5) * 1.3

      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = (Math.random() - 0.5) * Math.max(0.08, r * 0.065)

      gPos[i * 3]     = x
      gPos[i * 3 + 1] = y
      gPos[i * 3 + 2] = z

      // color: center = white → cyan → deep blue outer
      const dist = Math.sqrt(x * x + z * z)
      const cf   = Math.min(1, dist / 15)
      gCol[i * 3]     = THREE.MathUtils.lerp(0.95, 0.06, cf)
      gCol[i * 3 + 1] = THREE.MathUtils.lerp(0.97, 0.10, Math.pow(cf, 0.8))
      gCol[i * 3 + 2] = THREE.MathUtils.lerp(1.0,  0.50, Math.pow(cf, 0.5))
    }

    const galaxyGeo = new THREE.BufferGeometry()
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
    galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(gCol, 3))
    const galaxy = new THREE.Points(galaxyGeo, new THREE.PointsMaterial({
      size: 0.068, map: glowTex, vertexColors: true,
      transparent: true, opacity: 0.88,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    scene.add(galaxy)

    // ── Reactive near-field particles ────────────────────────
    const REACT = mobile ? 1500 : 4000
    const rPos  = new Float32Array(REACT * 3)
    const rVel  = new Float32Array(REACT * 3)
    const rBase = new Float32Array(REACT * 3)

    for (let i = 0; i < REACT; i++) {
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r     = 1.8 + Math.pow(Math.random(), 0.5) * 9
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      rBase[i * 3] = rPos[i * 3] = x
      rBase[i * 3 + 1] = rPos[i * 3 + 1] = y
      rBase[i * 3 + 2] = rPos[i * 3 + 2] = z
    }

    const reactGeo = new THREE.BufferGeometry()
    reactGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3))
    const reactField = new THREE.Points(reactGeo, new THREE.PointsMaterial({
      size: 0.092, map: glowTex, color: 0x3366ff,
      transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    scene.add(reactField)

    // ── Background starfield ─────────────────────────────────
    const BG = 6000
    const bgPos = new Float32Array(BG * 3)
    for (let i = 0; i < BG; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * 400
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 400
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 400
    }
    const bgGeo = new THREE.BufferGeometry()
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({
      size: 0.13, color: 0xffffff, transparent: true, opacity: 0.35, sizeAttenuation: true,
    })))

    // ── Central star ─────────────────────────────────────────
    const starGroup = new THREE.Group()
    scene.add(starGroup)

    const light1 = new THREE.PointLight(0x5599ff, 130, 45, 1.6)
    const light2 = new THREE.PointLight(0xaaccff, 45,  14, 2)
    starGroup.add(light1, light2)

    // Layered glow shells — outer to inner
    const shells: [number, number, number][] = [
      [7.0, 0x000a33, 0.04],
      [4.5, 0x001266, 0.07],
      [2.4, 0x0033aa, 0.13],
      [1.3, 0x0055ee, 0.21],
      [0.65, 0x88aaff, 0.38],
    ]
    shells.forEach(([r, col, op]) => {
      starGroup.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshBasicMaterial({
          color: col, transparent: true, opacity: op,
          depthWrite: false, blending: THREE.AdditiveBlending,
        }),
      ))
    })

    // Core sphere + hot centre
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    )
    const hotCentre = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xeef5ff }),
    )
    starGroup.add(core, hotCentre)

    // 8-spike diffraction flares
    const flareGroup = new THREE.Group()
    starGroup.add(flareGroup)
    const flareMat = new THREE.MeshBasicMaterial({
      map: flareTex, transparent: true, opacity: 0.65,
      depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    })
    for (let i = 0; i < 8; i++) {
      const main  = i < 4
      const spike = new THREE.Mesh(
        new THREE.PlaneGeometry(main ? 0.055 : 0.034, main ? 10 : 6.5),
        flareMat,
      )
      spike.rotation.z = (i / 8) * Math.PI
      flareGroup.add(spike)
    }

    // Corona particle ring
    const CORONA = 800
    const coroPos = new Float32Array(CORONA * 3)
    const coroPhase = new Float32Array(CORONA) // individual speed offsets
    for (let i = 0; i < CORONA; i++) {
      const angle = (i / CORONA) * Math.PI * 2
      const rr    = 0.55 + Math.random() * 0.45
      coroPos[i * 3]     = Math.cos(angle) * rr
      coroPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      coroPos[i * 3 + 2] = Math.sin(angle) * rr
      coroPhase[i]        = Math.random() * Math.PI * 2
    }
    const coronaGeo = new THREE.BufferGeometry()
    coronaGeo.setAttribute('position', new THREE.BufferAttribute(coroPos, 3))
    const corona = new THREE.Points(coronaGeo, new THREE.PointsMaterial({
      size: 0.06, map: glowTex, color: 0x88ccff,
      transparent: true, opacity: 0.7,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    starGroup.add(corona)

    // ── State ────────────────────────────────────────────────
    let scroll = 0, mx = 0, my = 0, clickWave = 0

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll = max > 0 ? window.scrollY / max : 0
    }
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / W)  * 2 - 1
      my = -((e.clientY / H) * 2 - 1)
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      mx = (t.clientX / W)  * 2 - 1
      my = -((t.clientY / H) * 2 - 1)
    }
    const onClick = () => { clickWave = 1 }
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      camera.aspect = W / H
      camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }

    window.addEventListener('scroll',    onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse,  { passive: true })
    window.addEventListener('touchmove', onTouch,  { passive: true })
    window.addEventListener('click',     onClick,  { passive: true })
    window.addEventListener('resize',    onResize)

    // ── Animate ──────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t  = clock.elapsedTime

      // Galaxy slow rotation + gentle tilt wobble
      galaxy.rotation.y += 0.022 * dt
      galaxy.rotation.x  = Math.sin(t * 0.04) * 0.055

      // Star flare rotation
      flareGroup.rotation.z = t * 0.16

      // Corona slow spin
      corona.rotation.y = t * 0.35

      // Star pulse
      const pulse = 1 + Math.sin(t * 2.1) * 0.055
      core.scale.setScalar(pulse)
      light1.intensity = 130 + Math.sin(t * 1.85) * 32

      // Star parallax
      starGroup.position.x += (mx * 0.65 - starGroup.position.x) * 0.045
      starGroup.position.y += (my * 0.48 - starGroup.position.y) * 0.045

      // Star grows as camera approaches
      starGroup.scale.setScalar(1 + scroll * 1.9)

      // Camera: flies toward star on scroll, arcs horizontally
      camera.position.x += (mx * 0.35 + Math.sin(scroll * Math.PI) * 1.8 - camera.position.x) * 0.022
      camera.position.y += (my * 0.2  + scroll * 2.8                      - camera.position.y) * 0.025
      camera.position.z += (9   - scroll * 6.5                             - camera.position.z) * 0.025
      camera.lookAt(0, scroll * 1.4, 0)

      // Reactive particle update
      const pos = reactGeo.attributes.position.array as Float32Array
      clickWave = Math.max(0, clickWave - dt * 0.48)
      const mpx = mx * 6.5
      const mpy = my * 5.0

      for (let i = 0; i < REACT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2

        // Spring back to base
        pos[ix] += (rBase[ix] - pos[ix]) * 0.013 + rVel[ix]
        pos[iy] += (rBase[iy] - pos[iy]) * 0.013 + rVel[iy]
        pos[iz] += (rBase[iz] - pos[iz]) * 0.013 + rVel[iz]

        // Ambient wave drift
        pos[ix] += Math.sin(t * 0.14 + i * 0.007) * 0.0013
        pos[iy] += Math.cos(t * 0.11 + i * 0.013) * 0.0013

        // Mouse repulsion
        const dx = pos[ix] - mpx
        const dy = pos[iy] - mpy
        const d2 = dx * dx + dy * dy
        if (d2 < 28 && d2 > 0.001) {
          const d = Math.sqrt(d2)
          const f = (5.3 - d) * 0.026
          rVel[ix] += (dx / d) * f
          rVel[iy] += (dy / d) * f
        }

        // Click shockwave from origin
        if (clickWave > 0.01) {
          const cx = pos[ix], cy = pos[iy], cz = pos[iz]
          const cd = Math.sqrt(cx * cx + cy * cy + cz * cz)
          if (cd > 0.001) {
            const s = clickWave * 0.2
            rVel[ix] += (cx / cd) * s
            rVel[iy] += (cy / cd) * s
            rVel[iz] += (cz / cd) * s
          }
        }

        // Velocity damping
        rVel[ix] *= 0.905
        rVel[iy] *= 0.905
        rVel[iz] *= 0.905
      }
      reactGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('click',     onClick)
      window.removeEventListener('resize',    onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      glowTex.dispose()
      flareTex.dispose()
      galaxyGeo.dispose()
      reactGeo.dispose()
      bgGeo.dispose()
      coronaGeo.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} />
}
