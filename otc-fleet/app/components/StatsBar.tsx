'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  number: string
  suffix: string
  label: string
  prefix?: string
}

const stats: StatItem[] = [
  { number: '20', suffix: '+', label: 'Years of Experience', prefix: '' },
  { number: '2', suffix: '', label: 'Locations Serving Central PA', prefix: '' },
  { number: '500', suffix: '+', label: 'Fleet Vehicles Served', prefix: '' },
  { number: '24', suffix: '/7', label: 'Emergency Support Available', prefix: '' },
]

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(target * eased)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function StatsBar() {
  return (
    <section
      id="stats"
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#1e293b',
        borderTop: '1px solid #FFD400',
        borderBottom: '1px solid rgba(255,212,0,0.5)',
      }}
      aria-label="Company statistics"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg, #FFD400 0, #FFD400 1px, transparent 0, transparent 50%)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center lg:px-8 flex flex-col items-center justify-center"
            >
              <div
                className="text-4xl lg:text-5xl font-bold tracking-tight mb-1"
                style={{ color: '#FFD400' }}
              >
                <AnimatedCounter
                  target={parseInt(stat.number)}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ''}
                />
              </div>
              <div className="text-slate-300 text-sm font-medium tracking-wide leading-tight text-center">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
