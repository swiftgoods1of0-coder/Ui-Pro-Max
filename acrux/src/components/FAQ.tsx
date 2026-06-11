'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplitHeading } from './SplitHeading'

const FAQS = [
  {
    q: 'How long does a project typically take?',
    a: 'Most projects run 5–10 weeks from kickoff to launch. A focused landing page takes 3–4 weeks. A full product design + engineering engagement is 8–12 weeks. We don\'t do slow — every project has a fixed timeline locked in at the start.',
  },
  {
    q: 'What\'s included in the price?',
    a: 'Strategy, design, development, QA, and launch support — everything under one roof. No hidden fees, no hourly overages. You get a fixed-scope proposal upfront. The price you agree to is the price you pay.',
  },
  {
    q: 'Do you take on small projects?',
    a: 'Our minimum engagement is $5,000. Below that, the overhead of collaboration doesn\'t produce the level of work we\'re proud to put our name on. If your budget is smaller, we\'re not the right fit — and we\'d rather tell you that now.',
  },
  {
    q: 'Who owns the code and design assets at the end?',
    a: 'You do. 100%. On final payment, full IP transfers to you — source code, design files, all assets. No retainer lock-in, no licensing games. It\'s yours to take anywhere.',
  },
  {
    q: 'How do revisions work?',
    a: 'We run a feedback-loop process: you review milestone deliverables at set checkpoints, not at the end. Each phase includes revision rounds. Scope changes outside the original brief are quoted separately — transparently and in advance.',
  },
  {
    q: 'Can you maintain the site after launch?',
    a: 'Yes. We offer optional retainer agreements for ongoing development, content updates, performance monitoring, and iteration. Clients on retainer get priority scheduling. Ask us about availability during your initial call.',
  },
]

function Item({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[var(--color-border)]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className={`font-heading font-semibold text-base sm:text-lg leading-snug transition-colors duration-200 ${open ? 'text-white' : 'text-[rgba(220,235,255,0.75)] group-hover:text-white'}`}>
          {faq.q}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? 'rgba(0,102,255,0.15)' : 'transparent',
            borderColor: open ? 'rgba(0,102,255,0.4)' : undefined,
          }}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[var(--color-muted)] text-sm leading-none select-none"
            style={{ color: open ? '#0099ff' : undefined }}
          >
            +
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed pb-6 max-w-3xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section className="section relative overflow-hidden" id="faq">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(0,60,180,0.07)_0%,transparent_70%)]" />
        <div className="divider absolute top-0 left-0 right-0" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">Before You Ask</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>
          <SplitHeading
            text="Questions Answered."
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
            className="text-[var(--color-muted)] text-base mt-4"
          >
            Everything you need to know before we talk.
          </motion.p>
        </div>

        <div className="border-t border-[var(--color-border)]">
          {FAQS.map((faq, i) => (
            <Item key={i} faq={faq} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-[var(--color-muted)] text-sm mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-[#0099ff] transition-colors group"
          >
            <span>Talk to us directly</span>
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
