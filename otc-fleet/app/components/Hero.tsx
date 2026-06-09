'use client'

import { motion } from 'framer-motion'
import { Phone, Calendar, CheckCircle, ArrowRight, Shield, Truck, BarChart2, Clock } from 'lucide-react'

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const trustBadges = [
  { icon: Shield, label: 'DOT Certified' },
  { icon: Truck, label: 'Mobile Service' },
  { icon: BarChart2, label: 'Digital Fleet Reporting' },
  { icon: Clock, label: 'Priority Scheduling' },
]

const floatingCardServices = [
  { icon: '🔧', label: 'Fleet Repairs' },
  { icon: '📋', label: 'DOT Inspections' },
  { icon: '📅', label: 'PM Programs' },
  { icon: '🚛', label: 'Mobile Units' },
  { icon: '🚌', label: 'Trailer Service' },
  { icon: '❄️', label: 'Snow Equipment' },
]

export default function Hero() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }


  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-charcoal-900"
      aria-label="Hero section"
    >
      {/* Real shop photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/shop-bay.jpg')" }}
        role="img"
        aria-label="OTC Fleet Services shop bay with vehicles on lifts"
      />
      {/* Gradient tint — deep left for text, lighter right to show the shop */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,12,16,0.92) 0%, rgba(10,12,16,0.80) 45%, rgba(10,12,16,0.55) 70%, rgba(10,12,16,0.35) 100%)' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diamond plate texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,212,0,0.05) 0, rgba(255,212,0,0.05) 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Radial glow bottom right */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-charcoal-800/20 blur-[100px] pointer-events-none" />

      {/* Orange accent line top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <FadeUp delay={0}>
              <div className="inline-flex items-center gap-2">
                <span className="w-8 h-0.5 bg-brand" />
                <span className="text-brand text-xs font-bold tracking-[0.25em] uppercase">
                  Lancaster • Berks County • Central PA
                </span>
              </div>
            </FadeUp>

            {/* Headline */}
            <div className="space-y-2">
              {['Keeping', 'Fleets', 'Moving.'].map((word, i) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.12 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1
                    className={`font-bold tracking-tight leading-[0.9] ${
                      i === 2 ? 'text-brand' : 'text-white'
                    }`}
                    style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
                  >
                    {word}
                  </h1>
                </motion.div>
              ))}
            </div>

            {/* Subtext */}
            <FadeUp delay={0.45}>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                Professional fleet repair, DOT inspections, preventative maintenance, mobile service,
                trailer repair, fleet reporting, vehicle graphics, and snow equipment support for
                businesses across Lancaster, Berks, and Central Pennsylvania.
              </p>
            </FadeUp>

            {/* CTAs */}
            <FadeUp delay={0.55}>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="btn-brand"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Service
                </a>
                <a
                  href="tel:7172083600"
                  className="btn-outline-white"
                >
                  <Phone className="w-4 h-4" />
                  Lancaster: 717-208-3600
                </a>
                <a
                  href="tel:6103744077"
                  className="btn-outline-steel"
                >
                  <Phone className="w-4 h-4" />
                  Berks: 610-374-4077
                </a>
              </div>
            </FadeUp>

            {/* Trust Badges */}
            <FadeUp delay={0.65}>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-brand flex-shrink-0" />
                    <span className="text-slate-300 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Right Column - Floating Service Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Main card */}
              <div className="glass rounded-2xl p-6 border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-brand font-bold tracking-wider uppercase mb-1">
                      Full-Service Fleet Support
                    </div>
                    <div className="text-white font-bold text-lg">What We Handle</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-brand" />
                  </div>
                </div>

                {/* Service grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {floatingCardServices.map(({ icon, label }) => (
                    <div
                      key={label}
                      className="bg-charcoal-800/80 rounded-lg p-3 text-center hover:bg-charcoal-800/80 transition-colors group"
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-slate-400 text-xs font-medium group-hover:text-slate-300 transition-colors">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-4" />

                {/* Locations */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-charcoal-800/50 rounded-lg p-3">
                    <div className="text-brand text-xs font-bold uppercase tracking-wide mb-0.5">Lancaster</div>
                    <div className="text-white text-sm font-semibold">717-208-3600</div>
                    <div className="text-slate-500 text-xs mt-0.5">480 Running Pump Rd</div>
                  </div>
                  <div className="flex-1 bg-charcoal-800/50 rounded-lg p-3">
                    <div className="text-brand text-xs font-bold uppercase tracking-wide mb-0.5">Berks County</div>
                    <div className="text-white text-sm font-semibold">610-374-4077</div>
                    <div className="text-slate-500 text-xs mt-0.5">Central PA Region</div>
                  </div>
                </div>

                {/* CTA Row */}
                <a
                  href="#contact"
                  onClick={scrollToContact}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Request Fleet Service
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Floating badge top right */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 glass-brand rounded-xl px-4 py-2.5 border border-brand/30 shadow-lg"
              >
                <div className="text-brand text-xs font-bold uppercase tracking-wide">20+ Years</div>
                <div className="text-white text-sm font-semibold">Experience</div>
              </motion.div>

              {/* Floating badge bottom left */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-2.5 border border-white/15 shadow-lg"
              >
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wide">2 Locations</div>
                <div className="text-white text-sm font-semibold">Lancaster & Berks</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
