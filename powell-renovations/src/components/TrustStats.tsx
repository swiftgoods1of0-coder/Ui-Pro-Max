'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import AnimatedCounter from './ui/AnimatedCounter'

const stats = [
  { value: 10,  suffix: '+',  label: 'Years in Business',    desc: 'Serving York County since 2014' },
  { value: 350, suffix: '+',  label: 'Projects Completed',   desc: 'Homes transformed with pride' },
  { value: 98,  suffix: '%',  label: 'Customer Satisfaction', desc: 'From verified client reviews' },
  { value: 12,  suffix: '',   label: 'Counties Served',       desc: 'Across South-Central PA' },
]

export default function TrustStats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="py-20 bg-dark-900 border-y border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group"
            >
              <div className="relative inline-block">
                <p className="font-display text-4xl sm:text-5xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                {/* Gold underline */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-500" />
              </div>
              <p className="mt-4 text-sm font-semibold text-white uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 text-xs text-dark-400">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
