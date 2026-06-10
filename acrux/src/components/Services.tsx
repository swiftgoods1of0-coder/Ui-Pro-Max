'use client'

import { useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { Palette, Code2, Sparkles, TrendingUp, MousePointerClick, Brain } from 'lucide-react'
import { SplitHeading } from './SplitHeading'

const SERVICES = [
  {
    num: '01', icon: Palette, title: 'Web Design',
    subtitle: 'Interfaces That Convert',
    desc: 'Award-winning visual design that commands attention. Every interaction crafted to reduce friction and drive decisions.',
    tags: ['UI/UX', 'Prototyping', 'Design Systems', 'Motion'],
    color: '#0066ff',
  },
  {
    num: '02', icon: Code2, title: 'Development',
    subtitle: 'Code That Performs',
    desc: 'Next.js, React, TypeScript. 90+ Lighthouse scores. Infrastructure that scales from launch day to Series B.',
    tags: ['Next.js', 'React', 'TypeScript', 'Edge Functions'],
    color: '#0099ff',
  },
  {
    num: '03', icon: Sparkles, title: 'Branding',
    subtitle: 'Identity That Resonates',
    desc: 'Complete brand systems that command premium pricing, instant recognition, and category authority.',
    tags: ['Logo', 'Brand Strategy', 'Visual Identity', 'Guidelines'],
    color: '#00bbff',
  },
  {
    num: '04', icon: TrendingUp, title: 'SEO',
    subtitle: 'Visibility That Compounds',
    desc: 'Technical and content SEO that turns your website into a compounding, sustainable revenue channel.',
    tags: ['Technical SEO', 'Content', 'Link Building', 'Analytics'],
    color: '#0077ee',
  },
  {
    num: '05', icon: MousePointerClick, title: 'CRO',
    subtitle: 'Revenue That Scales',
    desc: 'Data-driven A/B testing and UX improvements that systematically turn more visitors into customers.',
    tags: ['A/B Testing', 'Funnel Analysis', 'Heatmaps', 'Copywriting'],
    color: '#0055cc',
  },
  {
    num: '06', icon: Brain, title: 'AI Integration',
    subtitle: 'Intelligence That Differentiates',
    desc: 'Custom LLM features, automation, and AI-powered personalization that put you a category ahead.',
    tags: ['LLM Integration', 'AI Chatbots', 'Automation', 'Personalization'],
    color: '#3366ff',
  },
]

function ServiceCard({ s, idx }: { s: typeof SERVICES[0]; idx: number }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const rotX = useSpring(useMotionValue(0), { stiffness: 280, damping: 28 })
  const rotY = useSpring(useMotionValue(0), { stiffness: 280, damping: 28 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current!.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    rotX.set(-dy * 7)
    rotY.set(dx * 7)
    cardRef.current!.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    cardRef.current!.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const onLeave = () => { rotX.set(0); rotY.set(0) }
  const Icon = s.icon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: idx * 0.09, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="glass-card rounded-2xl p-7 relative overflow-hidden group cursor-none"
    >
      {/* Cursor-tracked glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), ${s.color}20 0%, transparent 65%)`,
        }}
      />

      <div className="text-[10px] font-mono tracking-[0.35em] text-[var(--color-muted)] group-hover:text-[#0099ff] transition-colors mb-5">
        {s.num}
      </div>

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
        style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
      >
        <Icon size={18} style={{ color: s.color }} className="group-hover:scale-110 transition-transform duration-300" />
      </div>

      <h3 className="font-heading font-bold text-[1.25rem] text-white mb-1 leading-tight">
        {s.title}
      </h3>
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[var(--color-muted)] mb-4">
        {s.subtitle}
      </p>
      <p className="text-sm text-[var(--color-text)] leading-relaxed mb-5">
        {s.desc}
      </p>

      <div className="flex flex-wrap gap-2">
        {s.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] group-hover:border-[rgba(0,102,255,0.25)] transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
      />
    </motion.div>
  )
}

export function Services() {
  return (
    <section className="section relative" id="services">
      {/* Mesh orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,102,255,0.07)_0%,transparent_70%)]" />
        <div className="absolute -top-20 -left-20 rounded-full" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,50,220,0.1) 0%, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-0 right-0 rounded-full" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,80,255,0.09) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">What We Build</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>

          <SplitHeading
            text="Every Service. One Standard."
            className="font-heading font-bold text-gradient leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
            baseDelay={0.08}
            stagger={0.09}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="text-[var(--color-muted)] text-base md:text-lg mt-4 font-body tracking-wide"
          >
            Excellence.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.num} s={s} idx={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-sm text-[var(--color-muted)] hover:text-white transition-colors group"
          >
            <span>Ready to start?</span>
            <span className="text-[#0099ff] group-hover:translate-x-1 transition-transform inline-block">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
