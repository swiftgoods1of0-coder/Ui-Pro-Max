'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HardHat, Wrench, Droplets, ChevronDown, ArrowRight } from 'lucide-react'

const services = [
  {
    id: 'contracting',
    icon: HardHat,
    title: 'General Contracting',
    tagline: 'Complete home transformations, inside and out.',
    image: '/images/contracting.jpg',
    items: [
      'Full kitchen & bathroom remodels',
      'Basement finishing & conversions',
      'Room additions & expansions',
      'Flooring installation (hardwood, tile, LVP)',
      'Interior & exterior painting',
      'Deck & porch construction',
      'Windows & door replacement',
      'Drywall & trim carpentry',
    ],
    cta: 'Plan Your Renovation',
  },
  {
    id: 'plumbing',
    icon: Wrench,
    title: 'Plumbing Services',
    tagline: 'Expert repairs, installs, and upgrades.',
    image: '/images/plumbing.jpg',
    items: [
      'Leak detection & repair',
      'Fixture installation & upgrades',
      'Water heater installation',
      'Drain cleaning & unclogging',
      'Pipe replacement & re-piping',
      'Garbage disposal install',
      'Bathroom & kitchen plumbing',
      'Emergency plumbing services',
    ],
    cta: 'Fix It Today',
  },
  {
    id: 'pressure',
    icon: Droplets,
    title: 'Pressure Washing',
    tagline: 'Restore your property's curb appeal in one day.',
    image: '/images/pressure-washing.jpg',
    items: [
      'House & siding washing',
      'Driveway & walkway cleaning',
      'Deck & patio restoration',
      'Fence cleaning & brightening',
      'Roof soft washing',
      'Gutter exterior cleaning',
      'Commercial property washing',
      'Pre-paint surface prep',
    ],
    cta: 'Get a Clean Quote',
  },
]

export default function Services() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">What We Do</p>
          <h2 className="font-display text-display text-white mb-4">Services Built Around Your Home</h2>
          <p className="text-dark-300 max-w-xl mx-auto text-pretty">
            From a single leaky faucet to a complete property transformation — one crew,
            one point of contact, one standard of quality.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            const isOpen = expanded === service.id

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-dark-900 border border-dark-800 rounded-sm overflow-hidden hover:border-gold-600/50 transition-colors duration-400"
              >
                {/* Image top */}
                <div className="relative h-48 overflow-hidden bg-dark-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${service.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 p-2.5 rounded-sm bg-gold-500/15 border border-gold-500/30">
                    <Icon size={22} className="text-gold-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-dark-400 text-sm mb-5">{service.tagline}</p>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : service.id)}
                    className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-300 transition-colors mb-4 w-full"
                    aria-expanded={isOpen}
                  >
                    <span>{isOpen ? 'Show less' : 'View all services'}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-1.5 pb-4">
                          {service.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-dark-300">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </div>
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 group/link"
                  >
                    {service.cta}
                    <ArrowRight size={15} className="transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
