'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Browser Chrome ───────────────────────────────────────────────
function BrowserChrome() {
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

// 01 — SaaS Analytics Dashboard
function MockupSaaS() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#0d1117', overflow: 'hidden' }}>
      <BrowserChrome />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 44, background: '#080c14', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#00aaff)', marginBottom: 4 }} />
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: i===1 ? 'rgba(0,102,255,0.22)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: i===1 ? '#4488ff' : 'rgba(255,255,255,0.18)' }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ width: 56, height: 6, background: 'rgba(255,255,255,0.75)', borderRadius: 2, marginBottom: 4 }} />
              <div style={{ width: 88, height: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 1 }} />
            </div>
            <div style={{ height: 18, width: 56, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
            {[['$284K','rgba(0,102,255,0.8)'],['12,849','rgba(0,170,255,0.8)'],['4.2%','rgba(34,197,94,0.8)']].map(([val, col], i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '7px 8px' }}>
                <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 1, marginBottom: 5 }} />
                <div style={{ width: 32, height: 8, background: 'rgba(255,255,255,0.82)', borderRadius: 2, marginBottom: 4 }} />
                <div style={{ width: 26, height: 3, background: col as string, borderRadius: 1, opacity: 0.7 }} />
              </div>
            ))}
          </div>
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
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
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

// 02 — Luxury E-Commerce
function MockupEcommerce() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#f5f2ee', overflow: 'hidden' }}>
      <BrowserChrome />
      <div style={{ height: 36, background: '#f5f2ee', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: '#1a1a1a' }}>LUMIÈRE</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {['Collection','Maison','Ateliers'].map(t => <div key={t} style={{ height: 3, width: 30, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />)}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ height: 3, width: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
          <div style={{ height: 3, width: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(145deg,#e8e0d8 0%,#d4c8bc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 80, height: 120, background: 'linear-gradient(160deg,#c4b8aa,#a89880)', borderRadius: '40px 40px 20px 20px', opacity: 0.7, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }} />
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 50, height: 3, background: 'rgba(0,0,0,0.15)', borderRadius: 1 }} />
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f5f2ee' }}>
          <div style={{ height: 3, width: 60, background: 'rgba(0,0,0,0.25)', borderRadius: 1 }} />
          <div style={{ height: 8, width: '90%', background: 'rgba(0,0,0,0.75)', borderRadius: 1 }} />
          <div style={{ height: 4, width: '70%', background: 'rgba(0,0,0,0.3)', borderRadius: 1 }} />
          <div style={{ height: 6, width: 50, background: 'rgba(0,0,0,0.6)', borderRadius: 1, marginTop: 4 }} />
          <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', margin: '4px 0' }} />
          <div style={{ display: 'flex', gap: 5 }}>
            {['XS','S','M','L'].map((s,i) => (
              <div key={s} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${i===1 ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)'}`, background: i===1 ? 'rgba(0,0,0,0.06)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ height: 3, width: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 1 }} />
              </div>
            ))}
          </div>
          <div style={{ height: 28, borderRadius: 4, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
            <div style={{ height: 4, width: 70, background: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
          </div>
          <div style={{ height: 20, borderRadius: 4, border: '1px solid rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: 3, width: 60, background: 'rgba(0,0,0,0.35)', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 03 — Brand Identity System
function MockupBrand() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fafafa', overflow: 'hidden' }}>
      <BrowserChrome />
      <div style={{ flex: 1, padding: '14px 16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#0a0a0a,#2a2a2a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.9)', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
          </div>
          <div>
            <div style={{ height: 7, width: 70, background: '#0a0a0a', borderRadius: 1, marginBottom: 4 }} />
            <div style={{ height: 3, width: 100, background: 'rgba(0,0,0,0.22)', borderRadius: 1 }} />
          </div>
        </div>
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
        <div>
          <div style={{ height: 3, width: 50, background: 'rgba(0,0,0,0.3)', borderRadius: 1, marginBottom: 6 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ bg:'#0a0a0a',shape:'circle' },{ bg:'#1a1aff',shape:'square' },{ bg:'#f0f0f0',shape:'diamond' },{ bg:'#0a0a0a',shape:'text' }].map(({ bg, shape }, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: bg, border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {shape==='circle'  && <div style={{ width:16,height:16,borderRadius:'50%',border:'2.5px solid rgba(255,255,255,0.85)' }} />}
                {shape==='square'  && <div style={{ width:14,height:14,borderRadius:2,background:'rgba(255,255,255,0.85)' }} />}
                {shape==='diamond' && <div style={{ width:12,height:12,background:'#1a1aff',transform:'rotate(45deg)',borderRadius:2 }} />}
                {shape==='text'    && <div style={{ height:7,width:18,background:'rgba(255,255,255,0.85)',borderRadius:1 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 04 — Marketing / Landing Page
function MockupMarketing() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#05070f' }}>
      <BrowserChrome />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,80,255,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(100,140,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(100,140,255,1) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ height: 5, width: 50, background: 'rgba(255,255,255,0.8)', borderRadius: 1 }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 14 }}>
            {[40,36,32,38].map((w,i) => <div key={i} style={{ height: 3, width: w, background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />)}
          </div>
          <div style={{ height: 18, width: 50, borderRadius: 20, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: 3, width: 32, background: 'rgba(255,255,255,0.85)', borderRadius: 1 }} />
          </div>
        </div>
        <div style={{ padding: '20px 16px 16px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 20, background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)', marginBottom: 12 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0099ff' }} />
            <div style={{ height: 3, width: 70, background: 'rgba(0,153,255,0.6)', borderRadius: 1 }} />
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ height: 14, width: '85%', background: 'rgba(255,255,255,0.88)', borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 14, width: '70%', background: 'rgba(255,255,255,0.88)', borderRadius: 2, marginBottom: 5 }} />
            <div style={{ height: 14, width: '55%', background: 'linear-gradient(90deg,#4488ff,#00ccff)', borderRadius: 2, marginBottom: 5, WebkitMaskImage: 'linear-gradient(90deg,#000 70%,transparent)', maskImage: 'linear-gradient(90deg,#000 70%,transparent)' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <div style={{ height: 26, width: 80, borderRadius: 6, background: 'linear-gradient(135deg,#0055ee,#0099ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: 4, width: 52, background: 'rgba(255,255,255,0.85)', borderRadius: 1 }} />
            </div>
            <div style={{ height: 26, width: 70, borderRadius: 6, border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: 4, width: 44, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #05070f', background: `hsl(${200+i*20},70%,60%)`, marginLeft: i > 0 ? -5 : 0 }} />)}
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

// ─── Data ─────────────────────────────────────────────────────────
const MOCKUPS = [MockupSaaS, MockupEcommerce, MockupBrand, MockupMarketing]

import { PROJECTS as PROJECT_DATA } from '@/lib/projects'

const PROJECTS = PROJECT_DATA.map(p => ({ ...p }))

// ─── Horizontal card (desktop) ────────────────────────────────────
function HCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const Mockup = MOCKUPS[index]
  return (
    <div
      className="project-card relative shrink-0 flex flex-col"
      data-cursor-view
      style={{ width: '72vw', maxWidth: 820, height: 'calc(100svh - 156px)' }}
    >
      {/* Mockup window */}
      <div
        className="relative rounded-2xl overflow-hidden flex-1 min-h-0 mb-5 border border-white/[0.07] transition-all duration-500 hover:border-white/[0.14]"
        style={{
          boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 40px 100px rgba(0,0,0,0.65), 0 0 80px ${project.accent}14`,
        }}
      >
        <Mockup />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${project.accent}12 0%, transparent 65%)` }} />
      </div>

      {/* Project info */}
      <div className="flex items-end justify-between gap-6 shrink-0">
        <div>
          <span className="block font-mono text-[9px] tracking-[0.38em] uppercase mb-2" style={{ color: 'rgba(100,130,160,0.7)' }}>
            {project.id} — {project.type}
          </span>
          <h3 className="font-heading font-bold text-white leading-none mb-3" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)' }}>
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={`/work/${project.slug}`}
          className="shrink-0 w-11 h-11 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[rgba(0,102,255,0.1)]"
          style={{ color: 'rgba(140,170,200,0.7)' }}
          onClick={e => e.stopPropagation()}
        >
          <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  )
}

// ─── Mobile card (vertical fallback) ─────────────────────────────
function VCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const Mockup = MOCKUPS[index]
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <div
        className="relative h-[260px] rounded-2xl overflow-hidden border border-white/[0.07] mb-4"
        style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 40px ${project.accent}12` }}
      >
        <Mockup />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${project.accent}0e 0%, transparent 65%)` }} />
      </div>
      <span className="font-mono text-[9px] tracking-[0.35em] uppercase mb-1" style={{ color: 'rgba(100,130,160,0.7)' }}>
        {project.id} — {project.type}
      </span>
      <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)' }}>
        {project.title}
      </h3>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-3">{project.desc}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────
export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const [progress,  setProgress]  = useState(0)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isMobile,  setIsMobile]  = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const getScrollDist = () => track.scrollWidth - window.innerWidth

      const tl = gsap.to(track, { x: () => -getScrollDist(), ease: 'none' })

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDist()}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate(self) {
          setProgress(self.progress)
          setActiveIdx(Math.min(
            PROJECTS.length - 1,
            Math.round(self.progress * (PROJECTS.length - 1))
          ))
        },
      })
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  // ── Desktop: pinned horizontal scroll ────────────────────────────
  if (!isMobile) {
    return (
      <section ref={sectionRef} className="relative overflow-hidden" style={{ height: '100svh' }} id="portfolio">
        {/* Section label + title — top left */}
        <div className="absolute top-8 left-10 sm:left-14 z-20 pointer-events-none">
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-5 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="label-tag text-[9px]">Our Capabilities</span>
          </motion.div>
          <motion.h2
            className="font-heading font-bold text-white"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
          >
            What We Build.
          </motion.h2>
        </div>

        {/* Card counter — top right */}
        <div className="absolute top-9 right-10 sm:right-14 z-20 font-mono text-[10px] tracking-[0.2em] pointer-events-none" style={{ color: 'rgba(100,130,160,0.65)' }}>
          <span className="text-white">{String(activeIdx + 1).padStart(2, '0')}</span>
          {' / '}
          {String(PROJECTS.length).padStart(2, '0')}
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex items-center gap-6 will-change-transform"
          style={{ paddingLeft: 'clamp(40px,6vw,100px)', paddingRight: 'clamp(40px,6vw,100px)', width: 'max-content' }}
        >
          {PROJECTS.map((p, i) => <HCard key={p.id} project={p} index={i} />)}
        </div>

        {/* Progress bar — bottom */}
        <div className="absolute bottom-8 left-10 right-10 sm:left-14 sm:right-14 z-20 pointer-events-none">
          <div className="flex justify-between mb-2">
            {PROJECTS.map((p, i) => (
              <span
                key={p.id}
                className="font-mono text-[8px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: i === activeIdx ? 'rgba(180,210,240,0.8)' : 'rgba(80,110,140,0.45)' }}
              >
                {p.id}
              </span>
            ))}
          </div>
          <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg,#0055ee,#00ccff)',
                transformOrigin: 'left center',
                scaleX: progress,
              }}
            />
          </div>
        </div>

        {/* Divider top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.2)] to-transparent" />
        {/* Divider bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.2)] to-transparent" />
      </section>
    )
  }

  // ── Mobile: vertical stack ────────────────────────────────────────
  return (
    <section className="section relative" id="portfolio">
      <div className="max-w-lg mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="label-tag">Our Capabilities</span>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-gradient"
            style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}
          >
            What We Build.
          </motion.h2>
        </div>
        <div className="space-y-14">
          {PROJECTS.map((p, i) => <VCard key={p.id} project={p} index={i} />)}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a href="#contact" className="inline-flex items-center gap-3 btn-ghost px-8 py-4 rounded-full font-semibold text-sm tracking-wide">
            Ready To Be Next? <span style={{ color: '#0099ff' }}>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
