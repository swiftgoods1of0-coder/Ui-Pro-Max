'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Do you really answer calls 24 hours a day, 7 days a week?',
    a: 'Yes — a live person answers every call, every hour of the day. We do not use an answering service or callback queue for emergency calls. When your system fails at 3 AM, you reach a dispatcher who immediately schedules a technician.',
  },
  {
    q: 'Is there an extra charge for after-hours or emergency service?',
    a: 'There is no extra charge to call us any time of day. Emergency dispatches during off-hours may carry a service fee depending on the nature of the call, which is disclosed upfront before any work begins. There are never hidden fees.',
  },
  {
    q: 'Are your technicians licensed and insured?',
    a: 'Every technician holds the appropriate state licenses for their trade — HVAC, plumbing, or electrical — and our company carries full liability insurance and workers\' compensation. We can provide documentation upon request.',
  },
  {
    q: 'Do you handle both residential and commercial work?',
    a: 'Yes. We serve homeowners, property managers, landlords, businesses, and industrial facilities. Our team has the equipment and certifications for projects ranging from a single-family home to a large commercial building.',
  },
  {
    q: 'How does your maintenance plan work?',
    a: 'Maintenance plans include scheduled seasonal inspections and tune-ups for your HVAC and other mechanical systems. Plan holders also receive priority scheduling, discounted rates on repairs, and reminders when service is due. Plans are available for both residential and commercial customers.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We are based in Lancaster County and serve customers throughout Central Pennsylvania, including Lancaster, York, Harrisburg, Lebanon, and surrounding communities. For commercial and emergency work, we extend our service area further — call to confirm coverage at your location.',
  },
  {
    q: 'How quickly can you respond to an emergency?',
    a: 'Response times vary by location and technician availability, but our goal is to have a technician on site within 1–2 hours for most emergency calls in our service area. We dispatch immediately upon receiving your call.',
  },
  {
    q: 'Do you provide free estimates?',
    a: 'We provide upfront quotes after a technician diagnoses the issue. The diagnostic visit is our service call fee, which is disclosed before we come out. Once on site, the quote for repair or installation is provided at no additional charge, and you approve all work before it begins.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="faq" className="py-24 bg-navy-900 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">FAQ</p>
          <div className="divider-blue mx-auto mb-5" />
          <h2 className="font-display text-display text-white mb-4">
            Common Questions
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto text-lg leading-relaxed">
            Answers to what customers ask most before booking with us.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
              className={`rounded-2xl border transition-all duration-300 ${
                open === i
                  ? 'bg-electric-500/8 border-electric-500/30'
                  : 'bg-navy-800/60 border-navy-600/40 hover:border-navy-500/60'
              }`}
            >
              <button
                className="w-full flex items-start gap-4 p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  open === i ? 'bg-electric-500' : 'bg-navy-600/80'
                }`}>
                  {open === i
                    ? <Minus size={13} className="text-white" />
                    : <Plus size={13} className="text-steel-300" />
                  }
                </span>
                <span className={`font-semibold text-base leading-snug transition-colors ${open === i ? 'text-white' : 'text-steel-200'}`}>
                  {faq.q}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pl-[60px] text-steel-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
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
