'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, MessageSquare, Clock, MapPin } from 'lucide-react'

export default function BookCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg,#1a0810 0%,#3d0f20 50%,#6b1535 100%)' }}>
      {/* Floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #d4607e, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #b02456, transparent)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-rose-300 text-xs font-semibold tracking-[0.2em] uppercase mb-6 border border-white/10">
            Ready to Book?
          </span>
          <h2 className="font-display text-display text-white mb-5">
            Give Your Pet the{' '}
            <span style={{ background: 'linear-gradient(135deg,#e090a8,#d4607e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Glow-Up
            </span>{' '}
            They Deserve
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto font-light">
            Call or text to book your appointment today. We&apos;re here Monday through Friday
            and always happy to answer questions about your pet&apos;s needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="tel:+17042678982"
              className="flex items-center justify-center gap-2.5 px-10 py-4 font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)', boxShadow: '0 8px 32px rgba(176,36,86,0.4)' }}>
              <Phone size={18} />
              Call (704) 267-8982
            </a>
            <a href="sms:+17042678982"
              className="flex items-center justify-center gap-2.5 px-10 py-4 font-semibold text-white rounded-full border-2 border-white/25 hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              <MessageSquare size={18} />
              Text To Book
            </a>
          </div>

          {/* Info chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-rose-300" />
              <span>Mon–Fri · 7:30 AM – 5:30 PM</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-rose-300" />
              <span>Charlotte Area</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-rose-300 text-base">✂️</span>
              <span>Dogs & Cats Welcome</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
