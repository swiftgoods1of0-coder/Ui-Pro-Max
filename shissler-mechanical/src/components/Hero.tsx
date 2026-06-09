'use client'
import { motion } from 'framer-motion'
import { Phone, ClipboardList, CheckCircle, ShieldCheck, Clock, Building2, HardHat } from 'lucide-react'

const trust = [
  { icon: ShieldCheck, label: 'Licensed & Insured' },
  { icon: Clock, label: '24/7 Emergency Service' },
  { icon: Building2, label: 'Residential & Commercial' },
  { icon: HardHat, label: 'Experienced Technicians' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Deep navy gradient base */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #020810 0%, #040d1a 30%, #071428 60%, #0a1a38 100%)' }} />
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Diagonal rule lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,102,255,0.5) 0, rgba(0,102,255,0.5) 1px, transparent 0, transparent 40px)' }} />
        {/* Radial glow center-right */}
        <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)' }} />
        {/* Corner accent */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,66,168,0.15) 0%, transparent 70%)' }} />
        {/* Horizontal rule accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-600/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-600/20 to-transparent" />
      </div>

      {/* Floating mechanical shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 200, top: '10%', right: '5%', opacity: 0.04 },
          { size: 120, bottom: '20%', right: '15%', opacity: 0.06 },
          { size: 80, top: '60%', left: '8%', opacity: 0.04 },
        ].map((c, i) => (
          <div key={i} className="absolute rounded-full border border-electric-500"
            style={{ width: c.size, height: c.size, top: c.top, bottom: c.bottom, right: c.right, left: c.left, opacity: c.opacity }} />
        ))}
        {/* Gear-like element */}
        <svg className="absolute top-16 right-[8%] opacity-[0.05]" width="280" height="280" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="35" fill="none" stroke="#0066ff" strokeWidth="1" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#0066ff" strokeWidth="1" />
          {[0,45,90,135,180,225,270,315].map((a, i) => (
            <rect key={i} x="47" y="8" width="6" height="14" rx="2" fill="#0066ff"
              transform={`rotate(${a} 50 50)`} />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
        <div className="max-w-3xl">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-electric-600/30 bg-electric-500/8 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
            <span className="text-electric-300 text-sm font-semibold tracking-wide">Available 24 Hours · 7 Days a Week</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-display text-hero text-white mb-6 leading-[1.08]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            24/7 Mechanical,{' '}
            <span className="text-gradient-blue">HVAC, Plumbing</span>
            {' '}& Electrical Experts
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="text-steel-300 text-xl leading-relaxed mb-10 max-w-xl font-light"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Professional residential and commercial service when you need it most.
            Available 24 hours a day, 7 days a week.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-14"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <a href="tel:+1" className="btn-emergency">
              <Phone size={20} />
              Call Now — 24/7
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-outline text-lg py-4 px-8">
              <ClipboardList size={20} />
              Request Service
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap gap-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-steel-300">
                <Icon size={16} className="text-electric-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating stats card */}
      <motion.div
        className="absolute bottom-12 right-6 lg:right-12 hidden lg:block"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="bg-navy-800/90 backdrop-blur-md border border-navy-600/60 rounded-2xl p-6 shadow-dark">
          <div className="grid grid-cols-2 gap-6">
            {[
              { val: '24/7', label: 'Availability' },
              { val: '100%', label: 'Licensed' },
              { val: 'Fast', label: 'Response' },
              { val: 'All', label: 'Services' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-gradient-blue leading-none mb-1">{val}</div>
                <div className="text-steel-400 text-xs font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, #040d1a, transparent)' }} />
    </section>
  )
}
