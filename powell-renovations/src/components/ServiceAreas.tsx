'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, CheckCircle } from 'lucide-react'

const counties = [
  { name: 'York County', primary: true, cities: ['York', 'Hanover', 'Red Lion', 'Spring Grove', 'Dallastown', 'Shrewsbury', 'Dover', 'New Freedom'] },
  { name: 'Adams County', primary: false, cities: ['Gettysburg', 'Littlestown', 'Biglerville', 'New Oxford'] },
  { name: 'Lancaster County', primary: false, cities: ['Quarryville', 'Strasburg', 'Millersville'] },
  { name: 'Dauphin County', primary: false, cities: ['Harrisburg area', 'Hershey', 'Middletown'] },
]

export default function ServiceAreas() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="areas" className="py-24 bg-dark-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Where We Work</p>
            <h2 className="font-display text-display text-white mb-5 text-balance">
              Proudly Serving South-Central Pennsylvania
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed mb-8 text-pretty">
              Based in York County, we serve homeowners across a 50-mile radius.
              Not sure if we cover your area? Call us — if we can get to you, we will.
            </p>
            <a
              href="tel:+17175550100"
              className="inline-flex items-center gap-2 text-gold-400 font-semibold border-b border-gold-500/40 pb-0.5 hover:text-gold-300 transition-colors"
            >
              <MapPin size={16} />
              (717) 555-0100 — Call to confirm your area
            </a>
          </motion.div>

          {/* Right — county grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {counties.map((county, i) => (
              <motion.div
                key={county.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={`p-5 border rounded-sm ${
                  county.primary
                    ? 'bg-gold-500/8 border-gold-500/30'
                    : 'bg-dark-900 border-dark-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={15} className={county.primary ? 'text-gold-400' : 'text-dark-400'} />
                  <h3 className={`font-semibold text-sm ${county.primary ? 'text-gold-300' : 'text-white'}`}>
                    {county.name}
                  </h3>
                  {county.primary && (
                    <span className="ml-auto text-[10px] font-semibold text-gold-500 tracking-wider uppercase">Primary</span>
                  )}
                </div>
                <ul className="space-y-1">
                  {county.cities.map((city) => (
                    <li key={city} className="flex items-center gap-2 text-xs text-dark-400">
                      <CheckCircle size={11} className="text-gold-600 shrink-0" />
                      {city}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
