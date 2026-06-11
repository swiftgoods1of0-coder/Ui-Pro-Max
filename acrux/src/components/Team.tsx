'use client'

import { motion } from 'framer-motion'
import { SplitHeading } from './SplitHeading'

const MEMBERS = [
  {
    name:    'Alex Rivera',
    role:    'Founder · Creative Director',
    quote:   '"Design is the difference between a product and a business."',
    gradient: 'linear-gradient(135deg,#0044cc,#0099ff)',
    initials: 'AR',
    stats:   [{ v: '100+', l: 'Projects' }, { v: '8yrs', l: 'Experience' }],
  },
  {
    name:    'Jordan Kim',
    role:    'Lead Engineer',
    quote:   '"We don\'t ship code. We ship competitive advantages."',
    gradient: 'linear-gradient(135deg,#1a0066,#4455ff)',
    initials: 'JK',
    stats:   [{ v: '94+', l: 'Lighthouse' }, { v: '<2s', l: 'Load Time' }],
  },
  {
    name:    'Maya Chen',
    role:    'Brand Strategist',
    quote:   '"Clarity is the real luxury. Complexity is the enemy."',
    gradient: 'linear-gradient(135deg,#003366,#0077cc)',
    initials: 'MC',
    stats:   [{ v: '3×', l: 'Avg Revenue' }, { v: '12', l: 'Industries' }],
  },
]

export function Team() {
  return (
    <section className="section relative overflow-hidden" id="team">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,40,140,0.08)_0%,transparent_70%)]" />
        <div className="divider absolute top-0 left-0 right-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">The People</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>
          <SplitHeading
            text="Who You're Hiring."
            className="font-heading font-bold text-gradient leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            baseDelay={0.06}
            stagger={0.1}
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-muted)] text-base mt-4 max-w-lg mx-auto"
          >
            A small team that works like a studio and thinks like a consultancy.
            No juniors on your project. Ever.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="card-border-glow glass-card rounded-2xl p-8 flex flex-col gap-6 group"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-lg shrink-0"
                  style={{ background: m.gradient, boxShadow: '0 8px 32px rgba(0,80,255,0.25)' }}
                >
                  {m.initials}
                </div>
                <div>
                  <div className="text-white font-heading font-semibold text-base leading-tight">{m.name}</div>
                  <div className="text-[var(--color-muted)] text-xs tracking-wide mt-0.5">{m.role}</div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-[var(--color-text)] text-sm leading-relaxed flex-1 italic">
                {m.quote}
              </p>

              {/* Mini stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border)]">
                {m.stats.map(s => (
                  <div key={s.l}>
                    <div className="font-heading font-bold text-white text-lg leading-none">{s.v}</div>
                    <div className="text-[var(--color-muted)] text-[10px] tracking-[0.2em] uppercase mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[var(--color-muted)] text-sm mt-12"
        >
          Based globally · Remote-first · Available to travel for key meetings
        </motion.p>
      </div>
    </section>
  )
}
