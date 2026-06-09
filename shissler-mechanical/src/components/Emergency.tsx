'use client'
import { motion } from 'framer-motion'
import { Phone, AlertTriangle } from 'lucide-react'

export default function Emergency() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-electric-500" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 50%, #3385ff 100%)' }} />
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      {/* Radial glow right */}
      <div className="absolute top-0 right-0 w-[600px] h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at right, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          <div className="flex items-center gap-5">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"
            >
              <AlertTriangle size={28} className="text-white" />
            </motion.div>
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-1">24/7 Emergency Line</p>
              <h2 className="text-white font-display text-2xl font-black leading-tight">
                System Failure? We&apos;re Dispatching Now.
              </h2>
              <p className="text-white/80 text-sm mt-1">
                No extra charge to call. A live dispatcher answers every hour of every day.
              </p>
            </div>
          </div>

          <a
            href="tel:+1"
            className="shrink-0 flex items-center gap-3 bg-white text-electric-600 font-black text-lg px-8 py-4 rounded-xl hover:bg-electric-50 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
          >
            <Phone size={22} />
            Call 24/7 Emergency
          </a>
        </div>
      </div>
    </section>
  )
}
