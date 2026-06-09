'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TRUTHS = [
  {
    num: '01',
    headline: 'You Have 3 Seconds.',
    body: 'That\'s how long a visitor takes to form a first impression of your business. A mediocre website doesn\'t just fail to impress — it actively destroys trust. You never get that second chance.',
    stat: '94%',
    statLabel: 'of first impressions are design-related',
  },
  {
    num: '02',
    headline: 'Design Signals Price.',
    body: 'When your website looks premium, visitors assume you charge premium prices. When it looks average, you compete on price alone. Your website is the first negotiation you\'ll ever have.',
    stat: '200%',
    statLabel: 'more revenue from trust-optimized design',
  },
  {
    num: '03',
    headline: 'Performance Is Revenue.',
    body: 'Every additional second of load time costs you 7% in conversions. A slow, clunky experience doesn\'t just frustrate — it sends your customers directly to your competitor.',
    stat: '7%',
    statLabel: 'conversion loss per second of delay',
  },
  {
    num: '04',
    headline: 'Your Site Works 24/7.',
    body: 'Your website is your best salesperson. It never sleeps, never misses a lead, never has a bad day. The question is: is it working FOR you or AGAINST you right now?',
    stat: '24/7',
    statLabel: 'Your most tireless employee',
  },
]

function TruthCard({ truth, index }: { truth: typeof TRUTHS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 1, 1])
  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -40 : 40, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-16 border-b border-[var(--color-border)] last:border-0"
    >
      <div className={index % 2 === 1 ? 'md:order-2' : ''}>
        <div className="text-[10px] font-mono tracking-[0.4em] text-[var(--color-muted)] mb-4">{truth.num}</div>
        <h3 className="font-heading font-bold text-gradient leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          {truth.headline}
        </h3>
        <p className="text-[var(--color-muted)] text-sm md:text-base leading-relaxed max-w-sm">
          {truth.body}
        </p>
      </div>

      <div className={`flex ${index % 2 === 1 ? 'md:order-1 md:justify-start' : 'md:justify-end'}`}>
        <div className="glass-card rounded-2xl px-10 py-10 text-center relative overflow-hidden min-w-[200px]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,102,255,0.12)_0%,transparent_70%)]" />
          <div className="font-heading font-bold text-gradient leading-none mb-2"
            style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}>
            {truth.stat}
          </div>
          <div className="text-[var(--color-muted)] text-xs tracking-wide leading-snug max-w-[140px] mx-auto">
            {truth.statLabel}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function WhyAcrux() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const starScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.4])
  const starOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 1])

  return (
    <section className="section relative overflow-hidden" id="why-acrux" ref={sectionRef}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_80%_50%,rgba(0,102,255,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">The Hard Truth</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-gradient leading-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          >
            Your Website Is Either<br />Making You Money Or<br />Losing It.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-muted)] text-base md:text-lg leading-relaxed"
          >
            There is no neutral. Every second a potential customer spends on a mediocre website
            is a second they&apos;re reconsidering. Premium design isn&apos;t an expense.
            It&apos;s your highest-ROI investment.
          </motion.p>
        </div>

        {/* Truth cards */}
        <div>
          {TRUTHS.map((truth, i) => (
            <TruthCard key={truth.num} truth={truth} index={i} />
          ))}
        </div>

        {/* Bottom CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,102,255,0.12)_0%,transparent_65%)]" />
          <div className="relative">
            <div className="text-[#0099ff] text-xs font-semibold tracking-[0.4em] uppercase mb-5">
              The Obvious Choice
            </div>
            <h3 className="font-heading font-bold text-gradient leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Stop Losing Business To<br />A Better-Looking Competitor.
            </h3>
            <p className="text-[var(--color-muted)] text-base leading-relaxed max-w-xl mx-auto mb-10">
              Join 100+ businesses that chose to compete at the highest level. One conversation
              could be the inflection point for your entire business.
            </p>
            <motion.a
              href="#contact"
              className="btn-primary inline-flex px-10 py-4 rounded-full font-semibold text-base tracking-wide relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              data-magnetic
            >
              <span className="relative z-10">Start Your Project Today</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
