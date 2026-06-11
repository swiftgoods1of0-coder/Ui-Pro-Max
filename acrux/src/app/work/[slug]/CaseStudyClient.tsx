'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PROJECTS } from '@/lib/projects'

type Project = typeof PROJECTS[number]

export function CaseStudyClient({
  project,
  nextProject,
}: {
  project: Project
  nextProject: Project
}) {
  return (
    <main
      className="min-h-screen"
      style={{ background: '#020508', color: 'var(--color-text)' }}
    >
      {/* ── Back nav ── */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,102,255,0.08)]"
        style={{ background: 'rgba(2,5,8,0.88)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-muted)] hover:text-white transition-colors text-sm font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            <span>ACRUX</span>
          </Link>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--color-muted)] uppercase">
            {project.id} / Case Study
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${project.accent}18 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.028] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(100,160,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent})` }} />
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase" style={{ color: project.accent }}>
              {project.industry}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', letterSpacing: '-0.02em' }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[var(--color-muted)] text-lg leading-relaxed max-w-2xl mb-10"
          >
            {project.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6 text-sm"
          >
            {[
              { label: 'Client',   value: project.client   },
              { label: 'Industry', value: project.industry },
              { label: 'Year',     value: project.year     },
              { label: 'Duration', value: project.duration },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10px] tracking-[0.3em] text-[var(--color-muted)] uppercase mb-1">{label}</div>
                <div className="text-white font-medium">{value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="py-16 border-y border-[rgba(0,102,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {project.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div
                  className="font-heading font-bold leading-none mb-2"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    background: `linear-gradient(130deg, #ffffff, ${project.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {m.value}
                </div>
                <div className="text-[var(--color-muted)] text-xs tracking-[0.2em] uppercase">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Narrative ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
            {/* Labels */}
            <div className="space-y-16 lg:sticky lg:top-24 self-start">
              {(['The Challenge', 'The Solution', 'The Outcome'] as const).map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="text-[10px] font-semibold tracking-[0.35em] uppercase mb-2" style={{ color: project.accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-heading font-bold text-white text-xl">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-16">
              {[project.challenge, project.solution, project.outcome].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[var(--color-text)] text-base sm:text-lg leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tags ── */}
      <section className="py-12 border-t border-[rgba(0,102,255,0.08)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-wrap gap-3">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Next project ── */}
      <section className="py-24 border-t border-[rgba(0,102,255,0.08)] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 80% at 50% 100%, ${nextProject.accent}10 0%, transparent 70%)`,
          }}
        />
        <div className="max-w-5xl mx-auto px-6 sm:px-10 relative">
          <div className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[var(--color-muted)] mb-4">
            Next Project
          </div>
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-end justify-between gap-8"
          >
            <h2
              className="font-heading font-bold text-white leading-none group-hover:opacity-80 transition-opacity"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
            >
              {nextProject.title}
            </h2>
            <span
              className="shrink-0 w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center text-xl group-hover:border-[var(--color-border-hover)] group-hover:bg-[rgba(0,102,255,0.1)] transition-all duration-300"
              style={{ color: 'rgba(140,170,200,0.7)' }}
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <div className="border-t border-[rgba(0,102,255,0.07)] py-5">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          <Link href="/" className="text-[var(--color-muted)] text-xs hover:text-white transition-colors">
            ← Back to ACRUX
          </Link>
          <Link href="/#contact" className="btn-primary text-xs px-5 py-2 rounded-full font-semibold">
            Start a Project
          </Link>
        </div>
      </div>
    </main>
  )
}
