'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const SplineScene = dynamic(
  () => import('./SplineScene').then((m) => m.SplineScene),
  { ssr: false, loading: () => null }
)

// Letter-scramble text animation
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·∙◦○●'

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
  }, [text, delay, CHARS])

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
  hidden: { opacity: 0, y: 80 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" id="hero">

      {/* ── Spline 3D scene — fullscreen behind all text ── */}
      <div className="absolute inset-0 z-[1]">
        <SplineScene />
      </div>

      {/* Gradient overlay — keeps text readable over the 3D scene */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(2,5,8,0.45) 100%),
            linear-gradient(to bottom, rgba(2,5,8,0.3) 0%, transparent 30%, transparent 60%, rgba(2,5,8,0.7) 100%)
          `,
        }}
      />

      <div className="relative z-[10] flex flex-col items-center text-center px-6 pt-20">
        {/* Studio tag */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
          <span className="text-[#0099ff] text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase font-body">
            The North Star For Modern Business
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
        </motion.div>

        {/* Main headline */}
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="overflow-hidden">
            <motion.h1
              variants={itemVariant}
              className="font-heading font-bold leading-[0.9] tracking-[-0.02em] text-gradient"
              style={{ fontSize: 'clamp(3.8rem, 11vw, 9.5rem)' }}
            >
              BUILT TO BE
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={itemVariant}
              className="font-heading font-bold leading-[0.9] tracking-[-0.02em] shimmer-text"
              style={{ fontSize: 'clamp(3.8rem, 11vw, 9.5rem)' }}
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
          className="w-64 h-px mt-6 bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.7)] to-transparent origin-left"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-[var(--color-muted)] text-lg md:text-xl max-w-lg leading-relaxed font-body"
        >
          We craft digital experiences so exceptional, your competition
          won&apos;t know what hit them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#contact"
            className="btn-primary px-9 py-4 rounded-full font-semibold text-base tracking-wide relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            data-magnetic
          >
            <span className="relative z-10">Start Your Project</span>
            <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </motion.a>
          <motion.a
            href="#portfolio"
            className="btn-ghost px-9 py-4 rounded-full font-semibold text-base tracking-wide"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            data-magnetic
          >
            View Our Work
          </motion.a>
        </motion.div>

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-14"
        >
          {[
            { val: '100+',  label: 'Projects Delivered'      },
            { val: '98%',   label: 'Client Satisfaction'     },
            { val: '$50M+', label: 'Revenue Generated'       },
            { val: '4.9★',  label: 'Average Client Rating'   },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-heading font-bold text-2xl text-gradient-blue">{val}</span>
              <span className="text-[var(--color-muted)] text-xs tracking-wider mt-0.5">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[var(--color-muted)] text-[10px] tracking-[0.35em] uppercase font-body">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[rgba(0,102,255,0.7)] to-transparent animate-float" />
      </motion.div>

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
