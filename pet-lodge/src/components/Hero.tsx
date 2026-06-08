'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Heart } from 'lucide-react'

function FloatingPaw({ x, y, delay, size = 24 }: { x: number; y: number; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.35, 0.2, 0],
        y: [0, -60, -120],
        x: [0, 15, 30],
        rotate: [0, 15, 30],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <ellipse cx="9" cy="7" rx="2.5" ry="3.2"/>
        <ellipse cx="15" cy="7" rx="2.5" ry="3.2"/>
        <ellipse cx="5.5" cy="12" rx="2" ry="2.8"/>
        <ellipse cx="18.5" cy="12" rx="2" ry="2.8"/>
        <path d="M12 10c-4.5 0-7 2.5-7 5.5s2 4.5 7 4.5 7-1.5 7-4.5-2.5-5.5-7-5.5z"/>
      </svg>
    </motion.div>
  )
}

const paws = [
  { x: 8, y: 20, delay: 0, size: 20 },
  { x: 15, y: 60, delay: 1.5, size: 28 },
  { x: 25, y: 35, delay: 3, size: 16 },
  { x: 70, y: 25, delay: 0.8, size: 22 },
  { x: 80, y: 55, delay: 2.5, size: 18 },
  { x: 88, y: 40, delay: 4, size: 26 },
  { x: 55, y: 70, delay: 1.2, size: 20 },
  { x: 40, y: 15, delay: 3.5, size: 24 },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image - real dogs playing */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/dogs-playing.jpg')" }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-900/88 via-forest-800/60 to-forest-900/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent" />

      {/* Floating paw prints */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {paws.map((p, i) => (
          <FloatingPaw key={i} {...p} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center py-24">

        {/* Top pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-tan-400 fill-tan-400" />
            ))}
          </div>
          <span className="text-white/90 text-sm font-medium">Leonardtown&apos;s Most Trusted Pet Resort</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="font-display text-hero text-white mb-6 leading-[1.05]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          A Vacation Your{' '}
          <br className="hidden sm:block" />
          <span
            style={{
              background: 'linear-gradient(135deg, #82bb8a, #e0b848)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Pet Will Love
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Leave your furry family members in caring hands. Boarding, daycare, grooming,
          and walks designed to keep tails wagging.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lodge-lg hover:scale-[1.03] flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #2d6035, #5a9a65)' }}
          >
            Book A Stay
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight size={18} />
            </motion.span>
          </a>
          <a
            href="#services"
            className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
          >
            View Services
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {[
            { icon: Shield, label: 'Licensed & Insured' },
            { icon: Heart, label: 'Family Owned' },
            { icon: Star, label: '5-Star Rated' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/80">
              <Icon size={16} className="text-sage-300" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent pointer-events-none" />
    </section>
  )
}
