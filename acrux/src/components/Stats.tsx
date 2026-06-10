'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { SplitHeading } from './SplitHeading'

const STATS = [
  { value: 100,  suffix: '+',   label: 'Projects Delivered',       sub: 'Across 12 countries'         },
  { value: 98,   suffix: '%',   label: 'Client Satisfaction',      sub: 'Average NPS score: 74'       },
  { value: 14,   suffix: '+',   label: 'Industries Served',        sub: 'B2B, SaaS, fashion & more'   },
  { value: 4.9,  suffix: '★',   label: 'Average Rating',           sub: 'Across all platforms'        },
]

const TESTIMONIALS = [
  {
    text: '"ACRUX built us a website that instantly elevated how enterprise clients perceived us. First month: 3 new Fortune 500 conversations."',
    name: 'Sarah Chen',
    role: 'CEO, Velocity Capital',
    avatar: 'SC',
  },
  {
    text: '"The attention to detail is insane. Every micro-animation, every hover effect — it all adds up to something that feels genuinely world-class."',
    name: 'Marcus Rodriguez',
    role: 'Founder, Aurum Collective',
    avatar: 'MR',
  },
  {
    text: '"Our competitors literally asked us who built our site. That sentence alone justified the investment ten times over."',
    name: 'James Whitmore',
    role: 'Managing Partner, Apex Law',
    avatar: 'JW',
  },
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
      className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
    >
      {/* Background number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-heading font-bold text-[8rem] opacity-[0.025] text-white leading-none select-none">
          {stat.value}
        </span>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-[#0066ff] to-transparent" />

      <div className="relative">
        <div className="font-heading font-bold leading-none mb-2 text-gradient"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
          {inView ? (
            <CountUp
              start={0}
              end={stat.value}
              duration={2.5}
              decimals={stat.value % 1 !== 0 ? 1 : 0}
              prefix=""
              suffix={stat.suffix}
            />
          ) : (
            <span>0{stat.suffix}</span>
          )}
        </div>
        <div className="font-heading font-semibold text-white text-base tracking-wide mb-1">
          {stat.label}
        </div>
        <div className="text-[var(--color-muted)] text-xs tracking-wide">{stat.sub}</div>
      </div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="section relative overflow-hidden" id="stats">
      {/* Ambient */}
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

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-5 text-5xl font-heading leading-none text-[rgba(0,102,255,0.12)] select-none">
                &ldquo;
              </div>

              <p className="text-[var(--color-text)] text-sm leading-relaxed mb-6 opacity-85 italic">
                {t.text}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00aaff] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-[var(--color-muted)] text-xs">{t.role}</div>
                </div>
              </div>

              {/* Stars */}
              <div className="absolute top-4 left-6 flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
