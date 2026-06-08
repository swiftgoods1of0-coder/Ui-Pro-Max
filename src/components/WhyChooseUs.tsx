'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ShieldCheck, BadgeCheck, DollarSign,
  MessageSquare, Microscope, MapPin,
} from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Licensed & Fully Insured',
    body: 'Every project is covered. Our Pennsylvania contractor license and comprehensive insurance protect your home and your investment from day one.',
  },
  {
    icon: BadgeCheck,
    title: 'Proven Craftsmanship',
    body: 'We don\'t cut corners. Every nail, every joint, every finish is inspected before we call the job done — because your home deserves nothing less.',
  },
  {
    icon: DollarSign,
    title: 'Honest, Transparent Pricing',
    body: 'Detailed estimates. No hidden fees. No surprise invoices. What we quote is what you pay — and we explain every line item so you always know where your money goes.',
  },
  {
    icon: MessageSquare,
    title: 'Responsive Communication',
    body: 'We answer our phones. We return calls. We show up when we say we will. In an industry full of unreliable contractors, we built our reputation on reliability.',
  },
  {
    icon: Microscope,
    title: 'Obsessive Attention to Detail',
    body: 'The difference between a good renovation and a great one lives in the details — the caulk line, the tile spacing, the paint edge. We sweat every inch.',
  },
  {
    icon: MapPin,
    title: 'Local York County Experts',
    body: 'We live and work in South-Central PA. We know local codes, local suppliers, and local weather. Hiring Powell means hiring a neighbor who has skin in the game.',
  },
]

export default function WhyChooseUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-us" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Why Powell</p>
            <h2 className="font-display text-display text-white mb-6 text-balance">
              The Standard Every Contractor Should Meet — But Few Do
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed mb-8 text-pretty">
              There are hundreds of contractors in York County. Most will give you a price.
              Fewer will show up on time. Almost none will leave your home cleaner than they
              found it. Powell Renovations is built on a different standard.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-semibold text-dark-950 rounded-sm transition-all hover:shadow-gold-lg hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
            >
              Start Your Project
            </a>
          </motion.div>

          {/* Right — grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group p-5 bg-dark-950 border border-dark-800 rounded-sm hover:border-gold-600/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-3 rounded-sm bg-gold-500/10 border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors">
                    <Icon size={18} className="text-gold-400" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-dark-400 text-xs leading-relaxed">{item.body}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
