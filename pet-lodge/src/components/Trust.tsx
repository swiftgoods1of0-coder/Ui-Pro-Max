'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, TreePine, Lock, Heart, Dumbbell, Moon } from 'lucide-react'

const reasons = [
  {
    icon: Shield,
    title: 'Experienced Care Team',
    body: 'Our staff are trained pet lovers with years of hands-on experience. Your pet is watched, played with, and cared for like one of our own.',
    color: 'bg-sage-100 text-sage-600',
  },
  {
    icon: TreePine,
    title: 'Spacious Play Areas',
    body: 'Acres of outdoor play space give dogs room to run, socialize, and explore. No cramped kennels — just open space and happy tails.',
    color: 'bg-forest-100 text-forest-600',
  },
  {
    icon: Lock,
    title: 'Safe & Secure Environment',
    body: 'Double-gated entry, secure fencing, and 24/7 monitoring keep every pet protected. You&apos;ll have peace of mind from check-in to pick-up.',
    color: 'bg-tan-100 text-tan-600',
  },
  {
    icon: Heart,
    title: 'Personalized Attention',
    body: 'Every pet gets individual care tailored to their personality, needs, and routine. We learn what makes your pet feel at home.',
    color: 'bg-cream-300 text-forest-700',
  },
  {
    icon: Dumbbell,
    title: 'Daily Exercise & Enrichment',
    body: 'Structured play, mental stimulation, and regular walks keep energy levels healthy and spirits high throughout every stay.',
    color: 'bg-sage-100 text-sage-600',
  },
  {
    icon: Moon,
    title: 'Comfortable Overnight Stays',
    body: 'Climate-controlled sleeping areas with cozy bedding ensure a restful night. Dogs sleep well knowing they\'re safe and loved.',
    color: 'bg-forest-100 text-forest-600',
  },
]

export default function Trust() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="trust" className="py-24 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Why Families Choose Us
          </span>
          <h2 className="font-display text-display text-forest-900 mb-4">
            Why Families Choose{' '}
            <span className="lodge-text">The Pet Lodge</span>
          </h2>
          <p className="text-forest-600 max-w-xl mx-auto text-lg leading-relaxed">
            We built everything around one goal: making pets feel safe, loved,
            and genuinely happy while their owners are away.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white rounded-3xl p-7 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1 border border-cream-200"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-forest-900 mb-2">{item.title}</h3>
                <p className="text-forest-600 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
