'use client'

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { SplitHeading } from './SplitHeading'

const STATS = [
  { value: 100, suffix: '+',  label: 'Projects Delivered',  sub: 'Across 12 countries'       },
  { value: 98,  suffix: '%',  label: 'Client Satisfaction', sub: 'Average NPS score: 74'     },
  { value: 14,  suffix: '+',  label: 'Industries Served',   sub: 'B2B, SaaS, fashion & more' },
  { value: 4.9, suffix: '★',  label: 'Average Rating',      sub: 'Across all platforms'      },
]

const ROW_A = [
  { text: 'ACRUX built us a website that instantly elevated how enterprise clients perceived us. First month: 3 new Fortune 500 conversations.', name: 'Sarah Chen',      role: 'CEO, Velocity Capital' },
  { text: 'The attention to detail is insane. Every micro-animation, every hover effect — it feels genuinely world-class.', name: 'Marcus Rodriguez', role: 'Founder, Aurum Collective' },
  { text: 'Conversion rate up 340% in the first month. The ROI was almost immediate.',                                      name: 'Priya Sharma',     role: 'CMO, Quantum Labs' },
  { text: 'I showed it to our Series B investors. They said the website was one of the reasons they believed in us.',        name: 'David Kim',        role: 'Founder, Neon Protocol' },
]

const ROW_B = [
  { text: 'Our competitors literally asked us who built our site. That sentence alone justified the investment ten times over.', name: 'James Whitmore', role: 'Managing Partner, Apex Law' },
  { text: 'Every detail was considered. It\'s the kind of work you want to frame and put on a wall.',                          name: 'Elena Russo',    role: 'Creative Director, Lumière Co' },
  { text: 'We went from looking like a startup to looking like an industry leader. Overnight.',                                name: 'Tyler Brooks',   role: 'CTO, Meridian Capital' },
  { text: 'Working with ACRUX was the most painless premium investment we\'ve ever made. Zero back-and-forth, all impact.',   name: 'Leila Hassan',   role: 'CEO, Novastride' },
]

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="card-border-glow glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-heading font-bold text-[8rem] opacity-[0.025] text-white leading-none select-none">
          {stat.value}
        </span>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-[#0066ff] to-transparent" />
      <div className="relative">
        <div className="font-heading font-bold leading-none mb-2 text-gradient" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
          {inView ? (
            <CountUp start={0} end={stat.value} duration={2.5} decimals={stat.value % 1 !== 0 ? 1 : 0} prefix="" suffix={stat.suffix} />
          ) : (
            <span>0{stat.suffix}</span>
          )}
        </div>
        <div className="font-heading font-semibold text-white text-base tracking-wide mb-1">{stat.label}</div>
        <div className="text-[var(--color-muted)] text-xs tracking-wide">{stat.sub}</div>
      </div>
    </motion.div>
  )
}

function TestimonialCard({ item }: { item: typeof ROW_A[0] }) {
  return (
    <div className="shrink-0 w-[340px] sm:w-[420px] glass-card rounded-xl p-6 mx-3 relative overflow-hidden">
      <div className="absolute top-4 right-5 text-5xl font-heading leading-none text-[rgba(0,102,255,0.1)] select-none">&ldquo;</div>
      <div className="flex gap-0.5 mb-4">
        {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-xs">★</span>)}
      </div>
      <p className="text-[var(--color-text)] text-sm leading-relaxed mb-5 italic">&ldquo;{item.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00aaff] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {item.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{item.name}</div>
          <div className="text-[var(--color-muted)] text-xs">{item.role}</div>
        </div>
      </div>
    </div>
  )
}

export function Stats() {
  const dupeA = [...ROW_A, ...ROW_A]
  const dupeB = [...ROW_B, ...ROW_B]

  return (
    <section className="section relative overflow-hidden" id="stats">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(0,50,150,0.08)_0%,transparent_70%)]" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 700, height: 400, background: 'radial-gradient(circle, rgba(0,55,200,0.11) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="divider absolute top-0 left-0 right-0" />
        <div className="divider absolute bottom-0 left-0 right-0" />
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
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">By The Numbers</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>
          <SplitHeading
            text="The Results Speak."
            className="font-heading font-bold text-gradient leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            baseDelay={0.08}
            stagger={0.12}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
        </div>
      </div>

      {/* ── Testimonial marquee — full bleed ── */}
      <div className="space-y-4 pb-4">
        {/* Row A — left */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg,var(--color-bg),transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg,var(--color-bg),transparent)' }} />
          <div className="flex" style={{ animation: 'marquee 40s linear infinite' }}>
            {dupeA.map((item, i) => <TestimonialCard key={i} item={item} />)}
          </div>
        </div>

        {/* Row B — right */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg,var(--color-bg),transparent)' }} />
          <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(-90deg,var(--color-bg),transparent)' }} />
          <div className="flex" style={{ animation: 'marquee-reverse 40s linear infinite' }}>
            {dupeB.map((item, i) => <TestimonialCard key={i} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
