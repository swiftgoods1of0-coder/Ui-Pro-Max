'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'What should I bring for boarding?',
    a: 'Bring your pet\'s regular food (portioned per meal to avoid stomach upset), any medications, a familiar blanket or toy that smells like home, and up-to-date vaccination records. We provide comfortable bedding, water, and love — you bring the personal touches.',
  },
  {
    q: 'Do you separate dogs by size?',
    a: 'Yes, always. Dogs are grouped by size and temperament during all play sessions. Small and toy breeds have their own dedicated play area, and we carefully screen each dog\'s behavior before introducing them to group activities.',
  },
  {
    q: 'Are pets supervised at all times?',
    a: 'During all play and activity times, absolutely. Our staff maintains active supervision throughout the day. Overnight, dogs are checked on regularly in their comfortable sleeping areas. We never leave your pet unattended during activities.',
  },
  {
    q: 'What vaccinations are required?',
    a: 'All dogs must be current on Rabies, Bordetella (kennel cough), and DHPP (distemper combo). We require proof of vaccinations at check-in or on file from a prior visit. This protects every pet in our care — including yours.',
  },
  {
    q: 'Can my dog receive medication during their stay?',
    a: 'Yes. We administer oral medications, topicals, and supplements at no additional charge. Just bring the medications in their original containers with clear dosing instructions. Our staff is experienced with pill pockets, syringe doses, and everything in between.',
  },
  {
    q: 'How do I book a stay?',
    a: 'Fill out our contact form or give us a call at (301) 475-2142. We\'ll confirm availability, answer any questions, and get your pet set up for their stay. First-time guests are encouraged to schedule a brief meet-and-greet visit before a full boarding stay.',
  },
  {
    q: 'What are your hours?',
    a: 'We\'re open Monday–Friday 7am–6pm and Saturday 8am–5pm for drop-off and pick-up. For boarding guests, drop-off and pick-up is available during all open hours. Please call ahead if you need special arrangements.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="faq" className="py-24 bg-cream-50 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-display text-display text-forest-900 mb-4">Common Questions</h2>
          <p className="text-forest-600 leading-relaxed">
            Everything you need to know before your pet&apos;s first stay.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i ? 'bg-white shadow-card border border-sage-200' : 'bg-white border border-cream-200'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className={`font-semibold text-sm sm:text-base transition-colors ${open === i ? 'text-forest-700' : 'text-forest-900'}`}>
                  {faq.q}
                </span>
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open === i ? 'bg-sage-500 text-white' : 'bg-cream-200 text-forest-600'}`}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
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
                    <p className="px-6 pb-5 text-forest-600 leading-relaxed text-sm">{faq.a}</p>
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
