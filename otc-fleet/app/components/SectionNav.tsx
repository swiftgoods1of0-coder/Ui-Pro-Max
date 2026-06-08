'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'stats', label: 'At a Glance' },
  { id: 'services', label: 'Services' },
  { id: 'why-otc', label: 'Why OTC' },
  { id: 'industries', label: 'Industries' },
  { id: 'fleet-programs', label: 'Fleet Programs' },
  { id: 'fleet-graphix', label: 'Fleet Graphix' },
  { id: 'trailer-department', label: 'Trailer Dept.' },
  { id: 'snow-equipment', label: 'Snow Equipment' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
]

export default function SectionNav() {
  const [active, setActive] = useState('hero')
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3">
      {sections.map(({ id, label }) => {
        const isActive = active === id
        return (
          <div
            key={id}
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Label */}
            <AnimatePresence>
              {hovered === id && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-semibold tracking-wide whitespace-nowrap px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: '#FFD400',
                    color: '#111111',
                  }}
                >
                  {label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot */}
            <motion.div
              animate={{
                width: isActive ? 20 : 8,
                backgroundColor: isActive ? '#FFD400' : 'rgba(255,255,255,0.25)',
              }}
              transition={{ duration: 0.25 }}
              className="h-2 rounded-full"
              style={{ minWidth: 8 }}
            />
          </div>
        )
      })}
    </div>
  )
}
