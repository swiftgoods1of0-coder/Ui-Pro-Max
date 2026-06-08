'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Shield, Star, Award } from 'lucide-react'

const badges = [
  { icon: Shield, label: 'Licensed & Insured' },
  { icon: Star,   label: '5-Star Rated' },
  { icon: Award,  label: '10+ Years Experience' },
]

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!parallaxRef.current) return
      parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background — replace src with a real hero image */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundPosition: 'center 30%',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/75 via-dark-950/55 to-dark-950/90" />
        {/* Subtle gold vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.6)_100%)]" />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
            style={{
              left: `${15 + i * 14}%`,
              height: '30%',
              top: '10%',
            }}
            animate={{ opacity: [0, 1, 0], y: ['0%', '200%'] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="w-12 h-px bg-gold-500" />
          <span className="text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
            York County, Pennsylvania
          </span>
          <span className="w-12 h-px bg-gold-500" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="font-display text-hero text-white mb-6 text-balance leading-[1.05]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Transforming Homes With{' '}
          <span className="gold-text">Quality Craftsmanship</span>{' '}
          That Lasts
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 text-pretty font-light leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Custom renovations, expert plumbing, and professional pressure washing —
          delivered by a team that treats your home like their own.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 text-dark-950 font-semibold rounded-sm overflow-hidden transition-all duration-300 hover:shadow-gold-lg hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Request Free Estimate
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </a>
          <a
            href="#projects"
            className="px-8 py-4 border border-white/20 text-white font-medium rounded-sm hover:border-gold-500 hover:text-gold-400 transition-all duration-300 backdrop-blur-sm"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-dark-300">
              <Icon size={16} className="text-gold-500" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} className="text-gold-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
