'use client'
import { motion } from 'framer-motion'
import { Phone, MessageSquare, CheckCircle } from 'lucide-react'

const trust = [
  'Women-Owned Business',
  'Military Discounts',
  'Professional Grooming',
  'Personalized Care',
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Split layout: left text, right photo */}
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        {/* Left — gradient bg */}
        <div style={{ background: 'linear-gradient(160deg,#1a0810 0%,#3d0f20 40%,#6b1535 100%)' }} />
        {/* Right — photo */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-pom.jpg')" }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #1a0810 0%, transparent 30%)' }} />
        </div>
      </div>

      {/* Mobile photo behind text */}
      <div className="absolute inset-0 lg:hidden bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-pom.jpg')" }} />
      <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(160deg, rgba(26,8,16,0.92) 0%, rgba(61,15,32,0.88) 50%, rgba(107,21,53,0.80) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-28 lg:py-0 w-full">
        <div className="lg:max-w-[54%]">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-rose-300 animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">Dog & Cat Grooming · Charlotte Area</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-hero text-white mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            Professional Grooming
            <br />
            <span style={{ background: 'linear-gradient(135deg,#e090a8,#d4607e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              That Keeps Pets
            </span>
            <br />
            Looking Their Best
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg font-light"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Experienced grooming, personalized care, and a stress-free experience
            for your furry family members. We are a top of the line grooming facility.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <a href="tel:+17042678982"
              className="flex items-center justify-center gap-2.5 px-8 py-4 font-semibold text-white rounded-full transition-all duration-300 hover:shadow-rose hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
              <Phone size={18} />
              Call Now
            </a>
            <a href="sms:+17042678982"
              className="flex items-center justify-center gap-2.5 px-8 py-4 font-semibold text-white rounded-full border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm">
              <MessageSquare size={18} />
              Text To Book
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            {trust.map(t => (
              <div key={t} className="flex items-center gap-2 text-white/80">
                <CheckCircle size={15} className="text-rose-300" />
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
