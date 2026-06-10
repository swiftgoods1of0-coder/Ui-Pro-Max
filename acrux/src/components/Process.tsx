'use client'

import { motion } from 'framer-motion'
import { SplitHeading } from './SplitHeading'

const STEPS = [
  {
    num: '01',
    title: 'Discovery',
    timeline: 'Week 1',
    color: '#0066ff',
    sub: 'We dig into your world.',
    desc: 'Deep strategy sessions, competitor audits, user persona mapping, and business objective alignment. We learn your market before we touch a pixel.',
    tags: ['Strategy', 'Research', 'Brand Audit', 'Competitor Analysis'],
  },
  {
    num: '02',
    title: 'Architecture',
    timeline: 'Week 1–2',
    color: '#0088ff',
    sub: 'We blueprint the system.',
    desc: 'Information architecture, conversion flow mapping, tech stack selection, and detailed wireframes. Every page has a job — we design those jobs first.',
    tags: ['Wireframes', 'IA', 'Tech Stack', 'CRO Planning'],
  },
  {
    num: '03',
    title: 'Design',
    timeline: 'Week 2–4',
    color: '#00aaff',
    sub: 'We craft the experience.',
    desc: 'High-fidelity visual design, motion design, interaction specification, and design system creation. We build everything before engineering touches code.',
    tags: ['UI Design', 'Motion', 'Design System', 'Prototyping'],
  },
  {
    num: '04',
    title: 'Build',
    timeline: 'Week 4–6',
    color: '#00bbff',
    sub: 'We engineer the vision.',
    desc: 'Next.js development, custom animations, GSAP and Framer Motion, 90+ Lighthouse scores, and rigorous cross-device testing. Performance is not optional.',
    tags: ['Next.js', 'Animations', 'Performance', 'QA Testing'],
  },
  {
    num: '05',
    title: 'Launch',
    timeline: 'Week 6+',
    color: '#00ccff',
    sub: 'We ship and support.',
    desc: 'Zero-downtime deployment, analytics setup, SEO indexing, and a 30-day post-launch support window. We don\'t disappear after handoff.',
    tags: ['Deployment', 'Analytics', 'SEO', '30-Day Support'],
  },
]

export function Process() {
  return (
    <section className="section relative overflow-hidden" id="process">
      {/* Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(0,80,200,0.07)_0%,transparent_70%)]" />
        <div className="divider absolute top-0 left-0 right-0" />
        <div className="divider absolute bottom-0 left-0 right-0" />
        <div className="absolute top-0 right-0 rounded-full" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,60,220,0.1) 0%, transparent 70%)', filter: 'blur(90px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
              <span className="label-tag">How We Work</span>
            </motion.div>
            <SplitHeading
              text="From Brief To Launch."
              className="font-heading font-bold text-gradient leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
              stagger={0.1}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[var(--color-muted)] text-base max-w-xs md:text-right"
          >
            A battle-tested process refined across 100+ projects. Predictable, fast, and built around your goals.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-[3.25rem] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[rgba(0,102,255,0.25)] to-transparent" />

          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card-border-glow glass-card rounded-2xl relative overflow-hidden group"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 0% 50%, ${step.color}12 0%, transparent 70%)` }} />

                <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6 sm:p-8">
                  {/* Number + dot */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 rounded-full transition-all duration-500"
                        style={{ background: `${step.color}18`, border: `1px solid ${step.color}35` }} />
                      <div className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        style={{ background: step.color, boxShadow: `0 0 10px ${step.color}80` }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.35em] text-[var(--color-muted)] uppercase">{step.num}</div>
                      <div className="font-heading font-bold text-white text-xl leading-tight">{step.title}</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block w-px h-12 shrink-0" style={{ background: 'rgba(0,102,255,0.15)' }} />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="text-[var(--color-text)] text-sm font-medium">{step.sub}</p>
                      <span className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-full border tracking-[0.15em]"
                        style={{ borderColor: `${step.color}40`, color: step.color, background: `${step.color}0f` }}>
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[rgba(0,102,255,0.25)] transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <a href="#contact" className="inline-flex items-center gap-3 btn-ghost px-8 py-4 rounded-full font-semibold text-sm tracking-wide" data-magnetic>
            Ready to start your project? <span style={{ color: '#0099ff' }}>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
