'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ─── Website Mockups ─────────────────────────────────────────────

function BrowserChrome({ url }: { url: string }) {
  return (
    <div style={{ height: 28, background: '#1a1d24', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.85 }} />)}
      </div>
      <div style={{ flex: 1, margin: '0 8px', height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 7, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ height: 3, width: 80, background: 'rgba(255,255,255,0.18)', borderRadius: 2 }} />
      </div>
    </div>
  )
}

// 01 — SaaS Analytics Dashboard (Linear / Vercel style)
function MockupSaaS() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#0d1117', overflow: 'hidden' }}>
      <BrowserChrome url="app.dashboard.io" />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 44, background: '#080c14', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#00aaff)', marginBottom: 4 }} />
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: i===1 ? 'rgba(0,102,255,0.22)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: i===1 ? '#4488ff' : 'rgba(255,255,255,0.18)' }} />
            </div>
          ))}
        </div>
        {/* Main */}
        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ width: 56, height: 6, background: 'rgba(255,255,255,0.75)', borderRadius: 2, marginBottom: 4 }} />
              <div style={{ width: 88, height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 1 }} />
            </div>
            <div style={{ height: 18, width: 56, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
            </div>
          </div>
          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[['$284K','rgba(0,102,255,0.8)'],['12,849','rgba(0,170,255,0.8)'],['4.2%','rgba(34,197,94,0.8)']].map(([val, col], i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '7px 8px' }}>
                <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ width: 32, height: 8, background: 'rgba(255,255,255,0.82)', borderRadius: 2, marginBottom: 4 }} />
                <div style={{ width: 26, height: 3, background: col as string, borderRadius: 1, opacity: 0.7 }} />
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 8px', marginBottom: 8 }}>
            <div style={{ width: 64, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 1, marginBottom: 7 }} />
            <svg viewBox="0 0 200 44" style={{ width: '100%', height: 44 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0066ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0066ff" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d="M0,40 L22,34 L44,30 L66,24 L88,20 L110,16 L132,13 L154,17 L176,9 L200,5 L200,44 L0,44 Z" fill="url(#g1)" />
              <path d="M0,40 L22,34 L44,30 L66,24 L88,20 L110,16 L132,13 L154,17 L176,9 L200,5" fill="none" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              {[[22,34],[66,24],[110,16],[154,17],[200,5]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#0066ff" stroke="#0d1117" strokeWidth="1" />)}
            </svg>
          </div>
          {/* Table */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 4 }}>
              {[72,44,38].map((w,i) => <div key={i} style={{ height: 3, width: w, background: 'rgba(255,255,255,0.25)', borderRadius: 1 }} />)}
            </div>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: `hsl(${210+i*25},75%,55%)`, flexShrink: 0 }} />
                  <div style={{ height: 3, width: '70%', background: 'rgba(255,255,255,0.22)', borderRadius: 1 }} />
                </div>
                <div style={{ height: 3, width: '75%', background: 'rgba(255,255,255,0.15)', borderRadius: 1 }} />
                <div style={{ height: 12, width: 30, borderRadius: 10, background: i===1 ? 'rgba(34,197,94,0.12)' : 'rgba(0,102,255,0.12)', border: `1px solid ${i===1 ? 'rgba(34,197,94,0.35)' : 'rgba(0,102,255,0.35)'}` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 02 — Luxury E-Commerce (Loro Piana / Bottega style)
function MockupEcommerce() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#f5f2ee', overflow: 'hidden' }}>
      <BrowserChrome url="maison-lumière.co" />
      {/* Nav */}
      <div style={{ height: 36, background: '#f5f2ee', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: '#1a1a1a' }}>LUMIÈRE</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {['Collection','Maison','Ateliers'].map(t => (
            <div key={t} style={{ height: 3, width: 30, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ height: 3, width: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
          <div style={{ height: 3, width: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
        </div>
      </div>
      {/* Product layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        {/* Product image */}
        <div style={{ background: 'linear-gradient(145deg, #e8e0d8 0%, #d4c8bc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Elegant product silhouette */}
          <div style={{ width: 80, height: 120, background: 'linear-gradient(160deg,#c4b8aa,#a89880)', borderRadius: '40px 40px 20px 20px', opacity: 0.7, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, height: 1, background: 'rgba(0,0,0,0.08)' }} />
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 50, height: 3, background: 'rgba(0,0,0,0.15)', borderRadius: 1 }} />
        </div>
        {/* Product details */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f5f2ee' }}>
          <div style={{ height: 3, width: 60, background: 'rgba(0,0,0,0.25)', borderRadius: 1 }} />
          <div style={{ height: 8, width: '90%', background: 'rgba(0,0,0,0.75)', borderRadius: 1 }} />
          <div style={{ height: 4, width: '70%', background: 'rgba(0,0,0,0.3)', borderRadius: 1 }} />
          <div style={{ height: 6, width: 50, background: 'rgba(0,0,0,0.6)', borderRadius: 1, marginTop: 4 }} />
          <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 0' }} />
          {/* Size selector */}
          <div style={{ height: 3, width: 40, background: 'rgba(0,0,0,0.3)', borderRadius: 1, marginBottom: 4 }} />
          <div style={{ display: 'flex', gap: 5 }}>
            {['XS','S','M','L'].map((s,i) => (
              <div key={s} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${i===1 ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)'}`, background: i===1 ? 'rgba(0,0,0,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ height: 3, width: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 1 }} />
              </div>
            ))}
          </div>
          {/* CTA */}
          <div style={{ height: 28, borderRadius: 4, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <div style={{ height: 4, width: 70, background: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
          </div>
          <div style={{ height: 20, borderRadius: 4, border: '1px solid rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: 3, width: 60, background: 'rgba(0,0,0,0.35)', borderRadius: 1 }} />
          </div>
          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />
                <div style={{ height: 3, width: 28, background: 'rgba(0,0,0,0.18)', borderRadius: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 03 — Brand Identity System (Collins / Pentagram style)
function MockupBrand() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fafafa', overflow: 'hidden' }}>
      <BrowserChrome url="meridian.brand" />
      <div style={{ flex: 1, padding: '14px 16px', overflow: 'hidden' }}>
        {/* Large logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#0a0a0a,#2a2a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.9)', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
          </div>
          <div>
            <div style={{ height: 7, width: 70, background: '#0a0a0a', borderRadius: 1, marginBottom: 4 }} />
            <div style={{ height: 3, width: 100, background: 'rgba(0,0,0,0.22)', borderRadius: 1 }} />
          </div>
        </div>
        {/* Color palette */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 3, width: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 1, marginBottom: 6 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {['#0a0a0a','#1a1aff','#4488ff','#e8f0fe','#f5f5f5'].map(c => (
              <div key={c} style={{ flex: 1 }}>
                <div style={{ height: 28, borderRadius: 6, background: c, border: '1px solid rgba(0,0,0,0.08)' }} />
                <div style={{ height: 3, width: '80%', background: 'rgba(0,0,0,0.2)', borderRadius: 1, marginTop: 4 }} />
              </div>
            ))}
          </div>
        </div>
        {/* Typography */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ height: 3, width: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 1, marginBottom: 6 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ background: '#f0f0f0', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ height: 18, width: 55, background: '#0a0a0a', borderRadius: 1, marginBottom: 4 }} />
              <div style={{ height: 3, width: '80%', background: 'rgba(0,0,0,0.2)', borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 3, width: '60%', background: 'rgba(0,0,0,0.15)', borderRadius: 1 }} />
            </div>
            <div style={{ background: '#0a0a0a', borderRadius: 6, padding: '8px 10px' }}>
              <div style={{ height: 12, width: 44, background: 'rgba(255,255,255,0.9)', borderRadius: 1, marginBottom: 4 }} />
              <div style={{ height: 3, width: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 3, width: '60%', background: 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
            </div>
          </div>
        </div>
        {/* Logo marks grid */}
        <div>
          <div style={{ height: 3, width: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 1, marginBottom: 6 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { bg: '#0a0a0a', shape: 'circle' },
              { bg: '#1a1aff', shape: 'square' },
              { bg: '#f0f0f0', shape: 'diamond' },
              { bg: '#0a0a0a', shape: 'text' },
            ].map(({ bg, shape }, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: bg, border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {shape === 'circle' && <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.85)' }} />}
                {shape === 'square' && <div style={{ width: 14, height: 14, borderRadius: 2, background: 'rgba(255,255,255,0.85)' }} />}
                {shape === 'diamond' && <div style={{ width: 12, height: 12, background: '#1a1aff', transform: 'rotate(45deg)', borderRadius: 2 }} />}
                {shape === 'text' && <div style={{ height: 7, width: 18, background: 'rgba(255,255,255,0.85)', borderRadius: 1 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 04 — Marketing / Landing Page (Stripe / Linear style)
function MockupMarketing() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#05070f' }}>
      <BrowserChrome url="novastride.co" />
      {/* Hero section */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Gradient background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,80,255,0.18) 0%, transparent 70%)' }} />
        {/* Mesh grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(100,140,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,140,255,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ height: 5, width: 50, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 14 }}>
            {[40,36,32,38].map((w,i) => <div key={i} style={{ height: 3, width: w, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />)}
          </div>
          <div style={{ height: 18, width: 50, borderRadius: 20, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: 3, width: 32, background: 'rgba(255,255,255,0.85)', borderRadius: 1 }} />
          </div>
        </div>

        {/* Hero content */}
        <div style={{ padding: '20px 16px 16px', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 20, background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)', marginBottom: 12 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0099ff' }} />
            <div style={{ height: 3, width: 70, background: 'rgba(0,153,255,0.6)', borderRadius: 1 }} />
          </div>
          {/* Headline */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ height: 14, width: '85%', background: 'rgba(255,255,255,0.88)', borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 14, width: '70%', background: 'rgba(255,255,255,0.88)', borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 14, width: '55%', background: 'linear-gradient(90deg,#4488ff,#00ccff)', borderRadius: 2, marginBottom: 5, WebkitMaskImage: 'linear-gradient(90deg,#000 70%,transparent)', maskImage: 'linear-gradient(90deg,#000 70%,transparent)' }} />
          </div>
          {/* Sub */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 4, width: '75%', background: 'rgba(255,255,255,0.28)', borderRadius: 1, marginBottom: 4 }} />
            <div style={{ height: 4, width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
          </div>
          {/* CTAs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <div style={{ height: 26, width: 80, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: 4, width: 52, background: 'rgba(255,255,255,0.85)', borderRadius: 1 }} />
            </div>
            <div style={{ height: 26, width: 70, borderRadius: 6, border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: 4, width: 44, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
            </div>
          </div>
          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #05070f', background: `hsl(${200+i*20},70%,60%)`, marginLeft: i > 0 ? -5 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ height: 4, width: 80, background: 'rgba(255,255,255,0.35)', borderRadius: 1, marginBottom: 3 }} />
              <div style={{ height: 3, width: 60, background: 'rgba(255,255,255,0.18)', borderRadius: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MOCKUPS = [MockupSaaS, MockupEcommerce, MockupBrand, MockupMarketing]

const PROJECTS = [
  {
    id: '01',
    title: 'SaaS Platforms',
    type: 'Web Applications · Dashboards',
    desc: 'End-to-end product design and engineering for software companies. From onboarding flows to complex data dashboards — built to retain, convert, and scale.',
    tags: ['Next.js', 'TypeScript', 'Real-time Data', 'Auth Systems'],
    result: 'Rapid Iteration · Production-Ready',
    accent: '#0066ff',
    featured: true,
  },
  {
    id: '02',
    title: 'Luxury E-Commerce',
    type: 'Premium Retail · DTC Brands',
    desc: 'For brands where presentation is everything. We build shopping experiences that match the quality of the product — and significantly lift revenue per visitor.',
    tags: ['Shopify', '3D Product Views', 'Custom CMS', 'CRO'],
    result: 'Conversion-Optimized · Brand-First',
    accent: '#cc8800',
    featured: false,
  },
  {
    id: '03',
    title: 'Brand Identities',
    type: 'Visual Identity · Design Systems',
    desc: 'Complete brand systems from concept to launch. We craft identities that establish authority in competitive markets and scale across every touchpoint.',
    tags: ['Brand Strategy', 'Design System', 'Typography', 'Motion'],
    result: 'Timeless · Scalable · Ownable',
    accent: '#4488ff',
    featured: false,
  },
  {
    id: '04',
    title: 'Marketing Sites',
    type: 'Landing Pages · Lead Generation',
    desc: 'High-converting marketing sites built for growth. Engineered with conversion psychology, scroll-triggered storytelling, and sub-2s load times.',
    tags: ['Next.js', 'GSAP', 'Framer Motion', 'SEO'],
    result: 'Speed-Optimized · SEO-Ready',
    accent: '#00aaff',
    featured: false,
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  const Mockup = MOCKUPS[index]

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`grid grid-cols-1 ${
        project.featured ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'
      } gap-6 lg:gap-12 items-center ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Mockup */}
      <motion.div style={{ y }} className="relative group">
        <div
          className="relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-500 group-hover:border-white/[0.14]"
          style={{
            boxShadow: `0 0 0 1px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.55), 0 0 60px ${project.accent}18`,
          }}
        >
          <Mockup />

          {/* Subtle colour tint overlay per project */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${project.accent}0a 0%, transparent 60%)` }}
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-white text-sm font-semibold tracking-[0.2em] uppercase border border-white/25 px-6 py-2.5 rounded-full">
              View Details
            </span>
          </div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-center"
      >
        <span className="text-[10px] font-mono tracking-[0.4em] text-[var(--color-muted)] mb-4 uppercase">
          {project.id} — {project.type}
        </span>
        <h3
          className="font-heading font-bold leading-tight text-white mb-5"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
        >
          {project.title}
        </h3>
        <p className="text-[var(--color-muted)] text-sm md:text-base leading-relaxed mb-6 max-w-sm">
          {project.desc}
        </p>

        {/* Result badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 w-fit"
          style={{ borderColor: project.accent + '45', background: project.accent + '10' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
          <span className="text-xs font-semibold tracking-wider" style={{ color: project.accent }}>
            {project.result}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Portfolio() {
  return (
    <section className="section relative" id="portfolio">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,40,100,0.05)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="label-tag">Our Capabilities</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-gradient leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          >
            What We Build.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[var(--color-muted)] text-base mt-4 max-w-xl mx-auto"
          >
            From SaaS platforms to luxury brands — every engagement is engineered to outperform.
          </motion.p>
        </div>

        {/* Projects */}
        <div className="space-y-24 md:space-y-36">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <a href="#contact" className="inline-flex items-center gap-3 btn-ghost px-8 py-4 rounded-full font-semibold text-sm tracking-wide">
            Ready To Be Next? <span className="text-[#0099ff]">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
