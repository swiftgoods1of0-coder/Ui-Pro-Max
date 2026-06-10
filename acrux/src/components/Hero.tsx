'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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
  hidden: { opacity: 0, y: 80 },
  show:   { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" id="hero">

      {/* Gradient overlay — readability over the WorldCanvas 3D scene behind */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(2,5,8,0.35) 100%),
            linear-gradient(to bottom, rgba(2,5,8,0.2) 0%, transparent 25%, transparent 65%, rgba(2,5,8,0.75) 100%)
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
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-7 text-[var(--color-muted)] text-base sm:text-lg md:text-xl max-w-sm sm:max-w-lg leading-relaxed font-body px-2"
        >
          We craft digital experiences so exceptional, your competition
          won&apos;t know what hit them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <motion.a
            href="#contact"
            className="btn-primary w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide relative overflow-hidden group text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            data-magnetic
          >
            <span className="relative z-10">Start Your Project</span>
            <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </motion.a>
          <motion.a
            href="#portfolio"
            className="btn-ghost w-full sm:w-auto px-8 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base tracking-wide text-center"
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
          className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14"
        >
          {[
            { val: '100+', label: 'Projects Delivered'    },
            { val: '98%',  label: 'Client Satisfaction'   },
            { val: '50+',  label: 'Happy Clients'         },
            { val: '4.9★', label: 'Average Client Rating' },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center min-w-[70px]">
              <span className="font-heading font-bold text-xl sm:text-2xl text-gradient-blue">{val}</span>
              <span className="text-[var(--color-muted)] text-[10px] sm:text-xs tracking-wider mt-0.5 text-center">{label}</span>
            </div>
          ))}
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
