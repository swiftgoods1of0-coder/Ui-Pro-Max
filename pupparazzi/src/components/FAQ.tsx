'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'What services do you offer?',
    a: 'We offer Bath & Groom, Full Grooming (bath + full body trim + sanitary trim), and Pet Haircuts (custom styling tailored to your pet\'s breed and coat). All services include nail trim, ear cleaning, and a finishing spritz.',
  },
  {
    q: 'Do you groom cats as well as dogs?',
    a: 'Yes! We welcome dogs and cats of all breeds, sizes, and coat types. Our groomers are experienced with both and know how to keep each pet calm and comfortable throughout the process.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Simply call or text us at (704) 267-8982. We\'ll find a time that works for your schedule, Monday through Friday, 7:30 AM to 5:30 PM. Appointments are confirmed quickly — no complicated online forms needed.',
  },
  {
    q: 'What are your hours?',
    a: 'We\'re open Monday through Friday, 7:30 AM to 5:30 PM. We are closed on Saturdays and Sundays. Call or text ahead to lock in your preferred appointment time.',
  },
  {
    q: 'Do you offer military discounts?',
    a: 'Yes, we proudly offer military discounts as a small thank-you to those who serve. Please mention your military status when booking and we\'ll take care of the rest.',
  },
  {
    q: 'How long does a grooming appointment take?',
    a: 'Appointment times vary depending on the size of your pet, coat condition, and the service selected. Most appointments run between 1.5 to 3 hours. We\'ll give you an estimated pick-up time when you drop off.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="faq" className="py-24 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-display text-display text-warm-950 mb-4">
            Questions?{' '}
            <span className="rose-text">We&apos;ve Got Answers</span>
          </h2>
          <p className="text-warm-500 text-lg leading-relaxed">
            Everything you need to know before your pet&apos;s first visit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl border border-warm-100 overflow-hidden bg-warm-50 hover:border-rose-200 transition-colors">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="font-semibold text-warm-900 text-sm sm:text-base">{faq.q}</span>
                <span
                  style={{ background: open === i ? 'linear-gradient(135deg,#b02456,#d4607e)' : undefined }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${open === i ? '' : 'bg-warm-200'}`}>
                  {open === i
                    ? <Minus size={14} className="text-white" />
                    : <Plus size={14} className="text-warm-600" />
                  }
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-5 text-warm-500 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
