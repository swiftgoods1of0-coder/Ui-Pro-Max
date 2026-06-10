'use client'

import { motion } from 'framer-motion'

const LOGOS = [
  { name: 'Lumière Co',       style: { fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase' as const } },
  { name: 'Meridian Capital', style: { fontWeight: 700, letterSpacing: '0.05em' } },
  { name: 'Apex Ventures',    style: { fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const } },
  { name: 'Novastride',       style: { fontWeight: 800, letterSpacing: '-0.02em' } },
  { name: 'Velocity Capital', style: { fontWeight: 300, letterSpacing: '0.08em' } },
  { name: 'Aurum Collective', style: { fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const } },
  { name: 'Quantum Labs',     style: { fontWeight: 700, letterSpacing: '0.04em' } },
  { name: 'Neon Protocol',    style: { fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase' as const } },
  { name: 'Atlas Group',      style: { fontWeight: 700, letterSpacing: '-0.01em' } },
  { name: 'Cipher Studio',    style: { fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase' as const } },
]

const DUPED = [...LOGOS, ...LOGOS]

export function LogoStrip() {
  return (
    <div className="relative py-10 overflow-hidden border-y border-[rgba(0,102,255,0.08)]">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--color-bg), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(-90deg, var(--color-bg), transparent)' }} />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex items-center"
      >
        {/* Label */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-3 z-20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[rgba(0,102,255,0.5)]" />
            <span className="font-body text-[9px] tracking-[0.35em] uppercase bg-[var(--color-bg)] px-2"
              style={{ color: 'rgba(100,140,180,0.6)' }}>
              Trusted by ambitious teams
            </span>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[rgba(0,102,255,0.5)]" />
          </div>
        </div>

        {/* Marquee track */}
        <div className="flex gap-14 items-center" style={{ animation: 'marquee 28s linear infinite', whiteSpace: 'nowrap' }}>
          {DUPED.map((logo, i) => (
            <span
              key={i}
              className="font-heading shrink-0"
              style={{
                ...logo.style,
                fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                color: `rgba(140,175,210,${0.35 + (i % 3) * 0.12})`,
              }}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
