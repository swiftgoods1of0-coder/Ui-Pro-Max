'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Sparkles, Heart, ShieldCheck } from 'lucide-react'

const highlights = [
  { icon: Sparkles, title: 'Expert Groomers', body: 'Experienced professionals who understand breed-specific cuts, coat types, and the individual needs of every pet.' },
  { icon: Heart, title: 'Gentle Handling', body: "We treat every pet like our own — calm, patient, and caring from drop-off to pick-up." },
  { icon: ShieldCheck, title: 'Clean & Safe', body: 'A spotless, sanitized facility where your pet can relax. No shortcuts on hygiene — ever.' },
]

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Photo collage */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main photo */}
            <div className="rounded-3xl overflow-hidden h-[480px] shadow-large">
              <div className="w-full h-full bg-cover" style={{ backgroundImage: "url('/images/spaniel-xmas.jpg')", backgroundPosition: '50% 15%' }} />
            </div>
            {/* Floating inset photo */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 w-44 h-44 rounded-2xl overflow-hidden shadow-large border-4 border-white">
              <div className="w-full h-full bg-cover" style={{ backgroundImage: "url('/images/poodles-duo.jpg')", backgroundPosition: '50% 30%' }} />
            </div>
            {/* Tag */}
            <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/95 shadow-soft flex items-center gap-2">
              <span className="text-xl">✂️</span>
              <span className="text-xs font-semibold text-warm-800">Top of the Line Grooming</span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:pl-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              About Pupparazzi
            </span>
            <h2 className="font-display text-display text-warm-950 mb-5">
              Where Every Pet Gets{' '}
              <span className="rose-text">the Star Treatment</span>
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed mb-6 font-light">
              At Pupparazzi, we believe every dog and cat deserves to look and feel
              their absolute best. Our experienced groomers bring skill, patience,
              and genuine love for animals to every single appointment.
            </p>
            <p className="text-warm-500 leading-relaxed mb-10">
              From full body trims to soothing baths, we tailor every service to
              your pet&apos;s unique coat, personality, and comfort level. Our clean,
              welcoming facility is designed to keep pets calm and owners confident.
              Women-owned and proudly serving our community — including military discounts
              as a small thank-you to those who serve.
            </p>

            {/* 3 highlights */}
            <div className="space-y-4">
              {highlights.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-50">
                    <Icon size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-warm-900 text-sm mb-0.5">{title}</p>
                    <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
