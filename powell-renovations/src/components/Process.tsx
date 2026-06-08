'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PhoneCall, Ruler, HardHat, CheckSquare } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: PhoneCall,
    title: 'Free Consultation',
    body: 'Call or submit a request and we\'ll schedule a no-pressure, in-home consultation — usually within 48 hours. We listen to your goals, assess the scope, and answer every question.',
  },
  {
    number: '02',
    icon: Ruler,
    title: 'Detailed Planning',
    body: 'We return with a written estimate that breaks down every cost line-by-line. No vague totals. No hidden fees. You approve the plan before a single tool comes out.',
  },
  {
    number: '03',
    icon: HardHat,
    title: 'Expert Execution',
    body: 'Our crew arrives on time, works efficiently, and keeps you updated throughout. We protect your home during construction and leave the work area clean every day.',
  },
  {
    number: '04',
    icon: CheckSquare,
    title: 'Final Walkthrough',
    body: 'Before we consider a job done, you walk through the finished work with us. Every punch list item gets addressed — not billed for later. You love it, or we fix it.',
  },
]

export default function Process() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="process" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">How It Works</p>
          <h2 className="font-display text-display text-white mb-4">Our Process, Your Peace of Mind</h2>
          <p className="text-dark-300 max-w-xl mx-auto text-pretty">
            Four straightforward steps from first call to finished product.
            No guesswork, no surprises — just results.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-dark-800 hidden md:block" />
          <motion.div
            className="absolute left-8 top-0 w-px bg-gradient-to-b from-gold-500 to-transparent hidden md:block"
            initial={{ height: '0%' }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
          />

          <div className="space-y-6 md:space-y-10 md:pl-24">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-6 items-start"
                >
                  {/* Step circle */}
                  <div className="absolute -left-24 top-1 hidden md:flex w-16 h-16 items-center justify-center rounded-full bg-dark-950 border-2 border-gold-500/50 shadow-gold">
                    <Icon size={22} className="text-gold-400" />
                  </div>

                  {/* Mobile icon */}
                  <div className="md:hidden flex w-12 h-12 items-center justify-center rounded-full bg-dark-950 border border-gold-500/40 shrink-0">
                    <Icon size={18} className="text-gold-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 bg-dark-950 border border-dark-800 rounded-sm hover:border-gold-600/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-display text-3xl font-bold text-dark-800 select-none">{step.number}</span>
                      <h3 className="font-semibold text-white text-lg">{step.title}</h3>
                    </div>
                    <p className="text-dark-400 leading-relaxed text-pretty">{step.body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
