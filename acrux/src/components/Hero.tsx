'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ShowreelModal } from './ShowreelModal'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·∙◦○●'

// Letter-scramble text animation
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const timer = setTimeout(() => {
      const id = setInterval(() => {
        el.textContent = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < Math.floor(frame / 1.8)) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
        frame++
        if (frame >= text.length * 2.2) {
          clearInterval(id)
          el.textContent = text
        }
      }, 28)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [text, delay])

  return <span ref={ref}>{text}</span>
}

const TICKER = [
  'WEB DESIGN', '·', 'NEXT.JS DEVELOPMENT', '·', 'BRANDING', '·',
  'SEO', '·', 'AI INTEGRATION', '·', 'CONVERSION OPTIMIZATION', '·',
  'REACT THREE FIBER', '·', 'MOTION DESIGN', '·',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } },
}
const itemVariant = {
  hidden: { y: '108%' },
  show:   { y: '0%', transition: { duration: 1.15, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  const [showreel, setShowreel] = useState(false)

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden" id="hero"
      style={{ minHeight: '100svh' }}>

      <ShowreelModal open={showreel} onClose={() => setShowreel(false)} />

      {/* Dot-grid texture */}
      <div className="absolute inset-0 z-[1] pointer-events-none dot-grid opacity-[0.028]" />

      {/* Gradient overlay — centre scrim + edge vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 48%, rgba(2,5,8,0.35) 0%, rgba(2,5,8,0.1) 50%, transparent 100%),
            linear-gradient(to bottom, rgba(2,5,8,0.3) 0%, transparent 20%, transparent 68%, rgba(2,5,8,0.88) 100%)
          `,
        }}
      />

      <div className="relative z-[10] w-full flex flex-col items-center text-center px-4 sm:px-6 pt-20 max-w-5xl mx-auto">
        {/* Studio tag */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10"
        >
          <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
          <span className="text-[#0099ff] text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase font-body">
            The North Star For Modern Business
          </span>
          <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
        </motion.div>

        {/* Currently available badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)]"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-400 text-[10px] font-semibold tracking-[0.22em] uppercase">
            Available · Q3 2025 · 2 Spots Remaining
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div variants={container} initial="hidden" animate="show" className="w-full">
          <div className="overflow-hidden">
            <motion.h1
              variants={itemVariant}
              className="font-heading font-bold leading-[0.9] tracking-[-0.02em] text-gradient"
              style={{ fontSize: 'clamp(2.4rem, 11vw, 8rem)' }}
            >
              BUILT TO BE
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={itemVariant}
              className="font-heading font-bold leading-[0.9] tracking-[-0.02em] shimmer-text"
              style={{ fontSize: 'clamp(2.4rem, 11vw, 8rem)' }}
            >
              REMEMBERED.
            </motion.h1>
          </div>
        </motion.div>

        {/* Gradient underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-40 sm:w-64 h-px mt-5 sm:mt-6 bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.7)] to-transparent origin-left"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 font-body text-sm sm:text-[0.95rem] leading-[1.95] tracking-[0.025em] max-w-[34ch]"
          style={{ color: 'rgba(220,238,255,0.92)', textShadow: '0 2px 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.9)' }}
        >
          We craft digital experiences so exceptional, your competition
          won&apos;t know what hit them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 sm:mt-11 flex items-center justify-center gap-5 sm:gap-8"
        >
          <motion.a
            href="#contact"
            className="btn-primary px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-[0.8rem] sm:text-sm font-semibold tracking-[0.1em] relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="relative z-10">Start Project</span>
            <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </motion.a>

          <motion.a
            href="#portfolio"
            className="flex items-center gap-2 text-[0.8rem] sm:text-sm font-medium tracking-[0.1em] transition-all duration-300 group"
            style={{ color: 'rgba(195,225,252,0.82)' }}
            whileHover={{ color: 'rgba(255,255,255,1)' } as never}
          >
            <span>See Work</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 text-xs">→</span>
          </motion.a>

          {/* Showreel button */}
          <motion.button
            onClick={() => setShowreel(true)}
            className="flex items-center gap-2 text-[0.8rem] sm:text-sm font-medium tracking-[0.1em] transition-all duration-300 group"
            style={{ color: 'rgba(195,225,252,0.82)' }}
            whileHover={{ color: 'rgba(255,255,255,1)' } as never}
            data-cursor-label="PLAY"
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center transition-all duration-300 group-hover:bg-white/10">
              <span className="text-[8px] ml-0.5">▶</span>
            </span>
            <span>Play Showreel</span>
          </motion.button>
        </motion.div>

        {/* Stats — single elegant row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.45 }}
          className="mt-14 sm:mt-16 flex items-center justify-center gap-0"
        >
          {[
            { val: '100+', label: 'Projects' },
            { val: '98%',  label: 'Satisfaction' },
            { val: '50+',  label: 'Clients' },
            { val: '4.9★', label: 'Rating' },
          ].map(({ val, label }, i, arr) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center px-5 sm:px-7">
                <span className="font-heading font-bold text-base sm:text-lg text-white tracking-tight">{val}</span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mt-0.5"
                  style={{ color: 'rgba(155,190,220,0.88)' }}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-6 self-center" style={{ background: 'rgba(0,120,255,0.35)' }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Scarcity signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.7 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: 'rgba(130,200,140,0.85)' }}>
            2 project slots remaining this quarter
          </span>
        </motion.div>
      </div>

      {/* Marquee ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-10 flex items-center border-t border-[var(--color-border)]">
        <div className="marquee-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="text-[var(--color-muted)] text-[10px] tracking-[0.3em] mx-5 font-body font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
