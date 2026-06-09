'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PROJECTS = [
  {
    id: 'P01',
    title: 'Velocity Capital',
    type: 'FinTech · SaaS Platform',
    desc: 'A next-generation investment platform with real-time data visualization, custom trading dashboards, and AI-driven insights.',
    tags: ['Next.js', 'Three.js', 'Real-time Data', 'AI'],
    result: '+340% Conversion Rate',
    gradient: 'from-[#0a0f2e] via-[#0033aa] to-[#001155]',
    accent: '#0066ff',
    featured: true,
  },
  {
    id: 'P02',
    title: 'Aurum Collective',
    type: 'Luxury E-Commerce',
    desc: 'Ultra-premium jewelry brand redefining online luxury. Immersive 3D product previews with AR try-on integration.',
    tags: ['Shopify', '3D Viewer', 'AR', 'Custom Checkout'],
    result: '+520% Average Order Value',
    gradient: 'from-[#1a1000] via-[#4a3000] to-[#2a1a00]',
    accent: '#cc8800',
    featured: false,
  },
  {
    id: 'P03',
    title: 'Apex Law Group',
    type: 'Professional Services',
    desc: 'Law firm that needed to command authority. Built a digital presence that positions them as the undisputed premium choice.',
    tags: ['Brand Identity', 'Next.js', 'SEO', 'CRO'],
    result: '+280% Qualified Leads',
    gradient: 'from-[#050d1a] via-[#0a1f35] to-[#051020]',
    accent: '#4488ff',
    featured: false,
  },
  {
    id: 'P04',
    title: 'NovaBuild',
    type: 'Construction · Real Estate',
    desc: 'Luxury real estate developer needed a site that matched $5M+ homes. We delivered the digital equivalent.',
    tags: ['Next.js', 'GSAP', 'Framer Motion', 'Maps'],
    result: '+195% Property Inquiries',
    gradient: 'from-[#0d0d0d] via-[#1a1f2e] to-[#0a0e1a]',
    accent: '#00aaff',
    featured: false,
  },
]

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      initial={{ opacity: 0 }}
      className={`grid grid-cols-1 ${
        project.featured ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'
      } gap-6 items-center ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Visual monolith */}
      <motion.div style={{ y }} className="relative group">
        <div
          className={`relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br ${project.gradient} border border-[rgba(255,255,255,0.06)] transition-all duration-500 group-hover:border-[rgba(255,255,255,0.12)] group-hover:shadow-2xl`}
          style={{ boxShadow: `0 0 0 1px rgba(0,0,0,0.3), 0 40px 80px rgba(0,0,0,0.5)` }}
        >
          {/* Abstract "screenshot" — premium gradient art */}
          <div className="absolute inset-0">
            {/* Simulated UI grid lines */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(${project.accent}22 1px, transparent 1px),
                  linear-gradient(90deg, ${project.accent}22 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Simulated nav bar */}
            <div className="absolute top-6 left-6 right-6 h-8 rounded-lg glass flex items-center px-3 gap-2 border border-[rgba(255,255,255,0.05)]">
              <div className="w-4 h-4 rounded-sm" style={{ background: project.accent + '40' }} />
              <div className="h-1.5 w-20 rounded bg-white/15" />
              <div className="ml-auto flex gap-2">
                {[1,2,3].map(i => <div key={i} className="h-1.5 w-8 rounded bg-white/10" />)}
              </div>
            </div>

            {/* Simulated hero text blocks */}
            <div className="absolute top-20 left-6 right-6">
              <div className="h-6 w-3/4 rounded mb-2" style={{ background: `linear-gradient(90deg, ${project.accent}70, transparent)` }} />
              <div className="h-4 w-1/2 rounded mb-4" style={{ background: `${project.accent}35` }} />
              <div className="h-8 w-28 rounded-full" style={{ background: `${project.accent}60` }} />
            </div>

            {/* Simulated cards / data */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 rounded-lg border border-[rgba(255,255,255,0.06)] bg-black/30 flex flex-col justify-center p-2 gap-1">
                  <div className="h-1.5 w-8 rounded" style={{ background: project.accent + '80' }} />
                  <div className="h-3 w-6 rounded" style={{ background: project.accent + '40' }} />
                </div>
              ))}
            </div>

            {/* Centre glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 50%, ${project.accent}18 0%, transparent 65%)` }}
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: `rgba(0,0,0,0.4)`, backdropFilter: 'blur(4px)' }}>
            <span className="text-white text-sm font-semibold tracking-widest border border-white/20 px-6 py-2 rounded-full">
              View Project
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
        <span className="text-[10px] font-mono tracking-[0.4em] text-[var(--color-muted)] mb-4">{project.id} — {project.type}</span>
        <h3 className="font-heading font-bold leading-tight text-white mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
          {project.title}
        </h3>
        <p className="text-[var(--color-muted)] text-sm md:text-base leading-relaxed mb-6 max-w-sm">
          {project.desc}
        </p>

        {/* Result callout */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 w-fit"
          style={{ borderColor: project.accent + '40', background: project.accent + '0e' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.accent }} />
          <span className="text-xs font-semibold tracking-wide" style={{ color: project.accent }}>
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
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">Selected Work</span>
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
            Proof of Capability.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[var(--color-muted)] text-base mt-4 max-w-xl mx-auto"
          >
            Every project is a competitive advantage delivered. Here&apos;s how we&apos;ve transformed businesses.
          </motion.p>
        </div>

        {/* Projects */}
        <div className="space-y-24 md:space-y-36">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 btn-ghost px-8 py-4 rounded-full font-semibold text-sm tracking-wide"
          >
            Ready To Be Next? <span className="text-[#0099ff]">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
