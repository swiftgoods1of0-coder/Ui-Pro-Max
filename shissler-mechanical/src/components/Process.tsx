'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, ClipboardCheck, Wrench, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Phone,
    number: '01',
    title: 'Call or Request Online',
    desc: 'Reach us 24/7 by phone or submit a service request. We respond immediately — day or night, weekday or holiday.',
  },
  {
    icon: ClipboardCheck,
    number: '02',
    title: 'Diagnosis & Quote',
    desc: 'A licensed technician evaluates the issue and provides a clear, upfront quote. No work begins until you approve the price.',
  },
  {
    icon: Wrench,
    number: '03',
    title: 'Expert Repair or Install',
    desc: 'Our certified technicians complete the work to code, using quality parts and proven methods. We clean up after every job.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Final Walkthrough & Guarantee',
    desc: 'We walk you through the completed work and answer every question. Every job is backed by our workmanship warranty.',
  },
]

export default function Process() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="process" className="py-24 bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">How It Works</p>
          <div className="divider-blue mx-auto mb-5" />
          <h2 className="font-display text-display text-white mb-4">
            Simple, Stress-Free Process
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto text-lg leading-relaxed">
            From the moment you call to the final walkthrough, we keep the process
            simple and transparent every step of the way.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-electric-600/40 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-navy-800 border-2 border-electric-600/50 flex items-center justify-center mb-6 shadow-blue-sm">
                    <Icon size={32} className="text-electric-400" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-electric-500 flex items-center justify-center text-white text-[10px] font-black">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                  <p className="text-steel-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
