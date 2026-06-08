'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Do you offer free estimates?',
    a: 'Yes — always. Every project starts with a free, no-obligation in-home consultation. We assess your project, answer your questions, and provide a detailed written estimate at no cost.',
  },
  {
    q: 'Are you licensed and insured in Pennsylvania?',
    a: 'Absolutely. Powell Renovations holds a valid Pennsylvania Home Improvement Contractor (HIC) license and carries full general liability and workers\' compensation insurance. Copies available upon request.',
  },
  {
    q: 'How long does a typical renovation take?',
    a: 'It depends on scope. A bathroom remodel typically takes 1–2 weeks; a kitchen 3–5 weeks; a basement finish 4–6 weeks. We provide a firm timeline in every contract and stick to it.',
  },
  {
    q: 'Do you handle permits?',
    a: 'Yes. We pull all necessary permits for your project, schedule inspections, and handle all required paperwork with York County and local municipalities. You don\'t have to lift a finger.',
  },
  {
    q: 'What is your service area?',
    a: 'We primarily serve York County, PA, and regularly work in Adams, Lancaster, and Dauphin counties. Call us for anywhere outside this area — if we can get there, we\'ll make it work.',
  },
  {
    q: 'Do you offer financing?',
    a: 'We can connect you with financing partners that offer 0% promotional financing for qualified projects. Ask us during your consultation and we\'ll walk you through the options.',
  },
  {
    q: 'Can I supply my own materials?',
    a: 'Yes, with some conditions. We\'re happy to install owner-supplied materials, but we can\'t warrant them against defects. We\'ll always let you know if we think a different product would serve you better.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="faq" className="py-24 bg-dark-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">FAQ</p>
          <h2 className="font-display text-display text-white mb-4">Common Questions</h2>
          <p className="text-dark-300 text-pretty">
            Everything you need to know before we get started.
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`border rounded-sm overflow-hidden transition-colors duration-250 ${
                open === i ? 'border-gold-500/40 bg-dark-900' : 'border-dark-800 bg-dark-900'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className={`font-medium transition-colors ${open === i ? 'text-gold-300' : 'text-white'}`}>
                  {faq.q}
                </span>
                <span className="shrink-0 text-gold-500">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-dark-300 leading-relaxed text-pretty">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
