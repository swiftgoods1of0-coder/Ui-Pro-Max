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

// ── Photosphere GLSL — vertex ─────────────────────────────────────
const STAR_VERT = /* glsl */`
  varying vec3 vPos;
  varying vec3 vNorm;
  varying vec3 vViewPos;
  void main() {
    vPos  = position;
    vNorm = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

// ── Photosphere GLSL — fragment ───────────────────────────────────
// Real-time 3D Worley noise for animated granulation convection cells,
// physically-correct view-dependent limb darkening, sunspot umbrae.
function starFragGLSL(mobile: boolean): string {
  return /* glsl */`
    ${mobile ? '#define MOBILE' : ''}
    uniform float uTime;
    uniform float uPulse;
    varying vec3 vPos;
    varying vec3 vNorm;
    varying vec3 vViewPos;

    // Quality 3-D hash  → [0,1]³
    vec3 h33(vec3 p) {
      p  = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.xxy + p.yxx) * p.zyx);
    }

    // 3-D Worley (Voronoi) noise — distance to nearest feature point
    float worley(vec3 p, float sc) {
      p *= sc;
      vec3 id = floor(p);
      vec3 fd = fract(p);
      float md = 8.0;
      for (int kx = -1; kx <= 1; kx++)
      for (int ky = -1; ky <= 1; ky++)
      for (int kz = -1; kz <= 1; kz++) {
        vec3 off = vec3(float(kx), float(ky), float(kz));
        vec3 h   = h33(id + off);
        // Feature points drift slowly → animated convection
        h = 0.5 + 0.45 * sin(uTime * 0.09 + 6.28318530 * h);
        md = min(md, length(off + h - fd));
      }
      return md;
    }

    void main() {
      // ── Limb darkening (view-space, Minnaert exponent) ─────
      float cosT = max(0.0, dot(normalize(vNorm), normalize(vViewPos)));
      float limb = pow(cosT, 0.42);

      // ── Granulation on unit sphere (no UV pole distortion) ─
      vec3 np = normalize(vPos);
      float g1 = worley(np, 5.5);
      #ifndef MOBILE
        float g2  = worley(np, 16.5);
        float gran = mix(g1, g2, 0.32);
      #else
        float gran = g1;
      #endif

      // Bright convection-cell tops, dark intergranular lanes
      float cell   = 1.0 - smoothstep(0.07, 0.50, gran);
      float bright = 0.80 + cell * 0.20 + uPulse * 0.032;

      // ── Photosphere colour: white hot core → blue-white limb ─
      vec3 hot  = vec3(1.00, 1.00, 1.00);
      vec3 mid  = vec3(0.87, 0.94, 1.00);
      vec3 lb   = vec3(0.34, 0.52, 0.80);
      vec3 col  = mix(lb, mix(mid, hot, cosT * cosT), limb) * bright;

      // ── Sunspot umbrae (rotate with star in local space) ────
      float s1 = 1.0 - smoothstep(0.0, 0.175, distance(np, normalize(vec3( 0.62,  0.20,  0.75))));
      float s2 = 1.0 - smoothstep(0.0, 0.125, distance(np, normalize(vec3(-0.50, -0.38,  0.78))));
      float s3 = 1.0 - smoothstep(0.0, 0.090, distance(np, normalize(vec3( 0.28,  0.87, -0.42))));
      col = mix(col, col * 0.18, max(max(s1, s2), s3) * 0.74);

      gl_FragColor = vec4(col, 1.0);
    }
  `
}

export function WorldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ─────────────────────────────────────────────
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
      gPos[i * 3] = x; gPos[i * 3 + 1] = y; gPos[i * 3 + 2] = z
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

    // Outer corona / glow shells
    const shells: [number, number, number][] = [
      [7.0, 0x020c22, 0.055],
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

    // ── Photosphere — live GLSL shader ───────────────────────
    // Worley granulation, Minnaert limb-darkening, rotating sunspots
    const STAR_R = 0.38
    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0.0 }, uPulse: { value: 0.0 } },
      vertexShader:   STAR_VERT,
      fragmentShader: starFragGLSL(mobile),
    })
    const core = new THREE.Mesh(new THREE.SphereGeometry(STAR_R, 96, 96), starMat)
    starGroup.add(core)

    // Chromosphere — thin glowing shell above photosphere
    starGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(STAR_R * 1.10, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x66aaff, transparent: true, opacity: 0.14,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }),
    ))

    // ── Dipole magnetic field lines ───────────────────────────
    // Traced from the equation r = L·sin²θ (magnetic dipole in spherical coords).
    // Each L-value is an equatorial crossing radius; field lines loop from
    // one magnetic pole to the other through the corona.
    const fieldLineGroup = new THREE.Group()
    starGroup.add(fieldLineGroup)

    const fieldGeos: THREE.BufferGeometry[] = []
    const fieldMats: THREE.LineBasicMaterial[] = []

    // [L, hex color, opacity] — innermost tight loops → broad outer corona
    const flConf: [number, number, number][] = [
      [0.46, 0xaaeeff, 0.60],
      [0.60, 0x77ddff, 0.52],
      [0.82, 0x44bbee, 0.44],
      [1.12, 0x2299cc, 0.35],
      [1.65, 0x1166aa, 0.24],
      [2.70, 0x0a4488, 0.14],
      [4.50, 0x051a44, 0.08],
    ]
    const MERI   = mobile ? 6 : 10 // meridional planes
    const FL_STEPS = 52

    for (const [L, col, opa] of flConf) {
      const sinSqMin = STAR_R / L
      if (sinSqMin >= 1) continue
      const tMin = Math.asin(Math.sqrt(sinSqMin))
      const tMax = Math.PI - tMin

      const mat = new THREE.LineBasicMaterial({
        color: col, transparent: true, opacity: opa,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      fieldMats.push(mat)

      for (let m = 0; m < MERI; m++) {
        const phi = (m / MERI) * Math.PI * 2
        const cp = Math.cos(phi), sp = Math.sin(phi)
        const buf = new Float32Array((FL_STEPS + 1) * 3)
        for (let s = 0; s <= FL_STEPS; s++) {
          const theta = tMin + (s / FL_STEPS) * (tMax - tMin)
          const sinT  = Math.sin(theta)
          const r     = L * sinT * sinT
          buf[s * 3]     = r * sinT * cp
          buf[s * 3 + 1] = r * Math.cos(theta)
          buf[s * 3 + 2] = r * sinT * sp
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(buf, 3))
        fieldGeos.push(geo)
        fieldLineGroup.add(new THREE.Line(geo, mat))
      }
    }

    // Polar plumes — open field lines streaming from the poles
    const PLUMES  = mobile ? 7 : 13
    const plumeMat = new THREE.LineBasicMaterial({
      color: 0x2255aa, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    fieldMats.push(plumeMat)
    const plumeGeos: THREE.BufferGeometry[] = []

    for (let p = 0; p < PLUMES * 2; p++) {
      const north = p < PLUMES
      const phi   = ((p % PLUMES) / PLUMES) * Math.PI * 2
      const lat   = 0.10 + Math.random() * 0.18 // 6–16° from pole
      const nx    = Math.sin(lat) * Math.cos(phi)
      const ny    = (north ? 1 : -1) * Math.cos(lat)
      const nz    = Math.sin(lat) * Math.sin(phi)
      const len   = 6.5 + Math.random() * 3.5
      const buf   = new Float32Array([nx * STAR_R, ny * STAR_R, nz * STAR_R, nx * len, ny * len, nz * len])
      const geo   = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(buf, 3))
      plumeGeos.push(geo)
      fieldLineGroup.add(new THREE.Line(geo, plumeMat))
    }

    // ── Chromospheric spicules ────────────────────────────────
    // Thin plasma jets (10–20 Mm tall on real stars) from the photosphere
    const SPIC    = mobile ? 80 : 200
    const spicBuf = new Float32Array(SPIC * 2 * 3)
    for (let i = 0; i < SPIC; i++) {
      const phi   = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const nx = Math.sin(phi) * Math.cos(theta)
      const ny = Math.cos(phi)
      const nz = Math.sin(phi) * Math.sin(theta)
      const h  = 0.06 + Math.random() * 0.13  // jet height
      const ta = Math.random() * Math.PI * 2
      const tx = Math.cos(ta) * (Math.random() * 0.22)
      const tz = Math.sin(ta) * (Math.random() * 0.22)
      const bi = i * 6
      spicBuf[bi]     = nx * STAR_R;        spicBuf[bi + 1] = ny * STAR_R;        spicBuf[bi + 2] = nz * STAR_R
      spicBuf[bi + 3] = (nx + tx) * (STAR_R + h); spicBuf[bi + 4] = ny * (STAR_R + h); spicBuf[bi + 5] = (nz + tz) * (STAR_R + h)
    }
    const spiculeGeo = new THREE.BufferGeometry()
    spiculeGeo.setAttribute('position', new THREE.BufferAttribute(spicBuf, 3))
    const spiculeMat = new THREE.LineBasicMaterial({
      color: 0x88ddff, transparent: true, opacity: 0.32,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    starGroup.add(new THREE.LineSegments(spiculeGeo, spiculeMat))

    // ── Prominence arcs ───────────────────────────────────────
    // Thick plasma loops along closed magnetic field lines
    const arcGroup = new THREE.Group()
    starGroup.add(arcGroup)
    const arcMats: THREE.MeshBasicMaterial[] = []
    const arcPhases: number[] = []
    const arcGeos: THREE.BufferGeometry[] = []
    const arcColors = [0x55ccff, 0x44bbee, 0x77ddff, 0x3399ff, 0x88eeff, 0x4499dd, 0x66bbff]
    const NUM_ARCS = mobile ? 4 : 7

    for (let i = 0; i < NUM_ARCS; i++) {
      const peakH = 0.55 + Math.random() * 1.15
      const span  = 0.50 + Math.random() * 0.85
      const a0    = Math.random() * Math.PI * 2
      const pts: THREE.Vector3[] = []
      for (let j = 0; j <= 30; j++) {
        const frac = j / 30
        const ang  = a0 + frac * span
        const r    = STAR_R + Math.sin(frac * Math.PI) * peakH
        pts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, 0))
      }
      const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.006 + Math.random() * 0.009, 5, false)
      arcGeos.push(tube)
      const mat = new THREE.MeshBasicMaterial({
        color: arcColors[i % arcColors.length], transparent: true,
        opacity: 0.28 + Math.random() * 0.3,
        depthWrite: false, blending: THREE.AdditiveBlending,
      })
      arcMats.push(mat)
      arcPhases.push(Math.random() * Math.PI * 2)
      const mesh = new THREE.Mesh(tube, mat)
      mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
      arcGroup.add(mesh)
    }

    // ── Diffraction spike flares ──────────────────────────────
    const flareGroup = new THREE.Group()
    starGroup.add(flareGroup)
    const flareMat = new THREE.MeshBasicMaterial({
      map: flareTex, transparent: true, opacity: 0.65,
      depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    })
    for (let i = 0; i < 8; i++) {
      const main  = i < 4
      const spike = new THREE.Mesh(new THREE.PlaneGeometry(main ? 0.055 : 0.034, main ? 10 : 6.5), flareMat)
      spike.rotation.z = (i / 8) * Math.PI
      flareGroup.add(spike)
    }

    // ── Corona particle rings ─────────────────────────────────
    const CORONA  = 800
    const coroPos = new Float32Array(CORONA * 3)
    for (let i = 0; i < CORONA; i++) {
      const angle = (i / CORONA) * Math.PI * 2
      const rr    = 0.55 + Math.random() * 0.45
      coroPos[i * 3]     = Math.cos(angle) * rr
      coroPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      coroPos[i * 3 + 2] = Math.sin(angle) * rr
    }
    const coronaGeo = new THREE.BufferGeometry()
    coronaGeo.setAttribute('position', new THREE.BufferAttribute(coroPos, 3))
    const corona = new THREE.Points(coronaGeo, new THREE.PointsMaterial({
      size: 0.06, map: glowTex, color: 0x88ccff,
      transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    starGroup.add(corona)

    const coroPos2 = new Float32Array(CORONA * 3)
    for (let i = 0; i < CORONA; i++) {
      const angle = (i / CORONA) * Math.PI * 2
      const rr    = 0.68 + Math.random() * 0.52
      coroPos2[i * 3]     = Math.cos(angle) * rr
      coroPos2[i * 3 + 1] = (Math.random() - 0.5) * 0.22
      coroPos2[i * 3 + 2] = Math.sin(angle) * rr
    }
    const coronaGeo2 = new THREE.BufferGeometry()
    coronaGeo2.setAttribute('position', new THREE.BufferAttribute(coroPos2, 3))
    const corona2 = new THREE.Points(coronaGeo2, new THREE.PointsMaterial({
      size: 0.044, map: glowTex, color: 0x4488bb,
      transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending,
    }))
    corona2.rotation.x = Math.PI / 2.8
    starGroup.add(corona2)

    // ── State & events ────────────────────────────────────────
    let scroll = 0, mx = 0, my = 0, clickWave = 0

    const onScroll = () => {
      if (mobile) return                                      // no scroll-driven camera on mobile
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll = max > 0 ? window.scrollY / max : 0
    }
    const onMouse = (e: MouseEvent) => { mx = (e.clientX / W) * 2 - 1; my = -((e.clientY / H) * 2 - 1) }
    const onTouch = (_e: TouchEvent) => {
      // On mobile touch is for scrolling — don't move the star
    }
    const onClick  = () => { clickWave = 1 }
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H)
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

      // Galaxy
      galaxy.rotation.y += 0.022 * dt
      galaxy.rotation.x  = Math.sin(t * 0.04) * 0.055

      // Flares + corona rings
      flareGroup.rotation.z = t * 0.16
      corona.rotation.y     =  t * 0.35
      corona2.rotation.y    = -t * 0.22

      // Dipole field lines slowly rotate — separates from star surface rotation
      fieldLineGroup.rotation.y = t * 0.05

      // Shader uniforms — drive live granulation + pulse brightness
      const pulseSin = Math.sin(t * 2.1)
      starMat.uniforms.uTime.value  = t
      starMat.uniforms.uPulse.value = pulseSin

      // Star self-rotation (sunspots drift across the disk)
      core.rotation.y = t * 0.07

      // Physical scale pulse + light intensity
      core.scale.setScalar(1 + pulseSin * 0.045)
      light1.intensity = 130 + pulseSin * 32

      // Prominence arcs — each breathes at its own frequency
      arcMats.forEach((m, i) => {
        m.opacity = 0.14 + (Math.sin(t * (0.50 + i * 0.13) + arcPhases[i]) * 0.5 + 0.5) * 0.36
      })
      arcGroup.rotation.y = t * 0.038

      if (mobile) {
        // On mobile: keep everything perfectly still — no scroll jitter, no touch drift
        starGroup.position.set(0, 0, 0)
        starGroup.scale.setScalar(1)
        camera.position.set(0, 1.2, 9)
        camera.lookAt(0, 0, 0)
      } else {
        // Desktop: scroll-driven parallax + camera fly-in
        starGroup.position.x += (mx * 0.65 - starGroup.position.x) * 0.045
        starGroup.position.y += (my * 0.48 - starGroup.position.y) * 0.045
        starGroup.scale.setScalar(1 + scroll * 1.9)

        camera.position.x += (mx * 0.35 + Math.sin(scroll * Math.PI) * 1.8 - camera.position.x) * 0.022
        camera.position.y += (my * 0.2  + scroll * 2.8                      - camera.position.y) * 0.025
        camera.position.z += (9   - scroll * 6.5                             - camera.position.z) * 0.025
        camera.lookAt(0, scroll * 1.4, 0)
      }

      // Reactive particle update
      const pos = reactGeo.attributes.position.array as Float32Array
      clickWave = Math.max(0, clickWave - dt * 0.48)
      const mpx = mx * 6.5, mpy = my * 5.0

      for (let i = 0; i < REACT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2
        pos[ix] += (rBase[ix] - pos[ix]) * 0.013 + rVel[ix]
        pos[iy] += (rBase[iy] - pos[iy]) * 0.013 + rVel[iy]
        pos[iz] += (rBase[iz] - pos[iz]) * 0.013 + rVel[iz]
        pos[ix] += Math.sin(t * 0.14 + i * 0.007) * 0.0013
        pos[iy] += Math.cos(t * 0.11 + i * 0.013) * 0.0013

        const dx = pos[ix] - mpx, dy = pos[iy] - mpy
        const d2 = dx * dx + dy * dy
        if (d2 < 28 && d2 > 0.001) {
          const d = Math.sqrt(d2), f = (5.3 - d) * 0.026
          rVel[ix] += (dx / d) * f; rVel[iy] += (dy / d) * f
        }
        if (clickWave > 0.01) {
          const cx = pos[ix], cy = pos[iy], cz = pos[iz]
          const cd = Math.sqrt(cx * cx + cy * cy + cz * cz)
          if (cd > 0.001) {
            const s = clickWave * 0.2
            rVel[ix] += (cx / cd) * s; rVel[iy] += (cy / cd) * s; rVel[iz] += (cz / cd) * s
          }
        }
        rVel[ix] *= 0.905; rVel[iy] *= 0.905; rVel[iz] *= 0.905
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
      starMat.dispose()
      glowTex.dispose()
      flareTex.dispose()
      galaxyGeo.dispose()
      reactGeo.dispose()
      bgGeo.dispose()
      coronaGeo.dispose()
      coronaGeo2.dispose()
      fieldGeos.forEach(g => g.dispose())
      fieldMats.forEach(m => m.dispose())
      plumeGeos.forEach(g => g.dispose())
      spiculeGeo.dispose()
      spiculeMat.dispose()
      arcGeos.forEach(g => g.dispose())
      arcMats.forEach(m => m.dispose())
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} />
}
