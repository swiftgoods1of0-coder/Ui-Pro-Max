'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Phone } from 'lucide-react'

const areas = [
  'Lancaster', 'York', 'Harrisburg', 'Lebanon', 'Reading',
  'Hershey', 'Lititz', 'Ephrata', 'Elizabethtown', 'Mount Joy',
  'Manheim', 'Palmyra', 'Hummelstown', 'Middletown', 'Columbia',
  'Marietta', 'Quarryville', 'Strasburg', 'New Holland', 'Denver',
]

export default function ServiceAreas() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="service-areas" className="py-24 bg-navy-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-3">Coverage</p>
            <div className="divider-blue mb-5" />
            <h2 className="font-display text-display text-white mb-6 leading-tight">
              Serving Central<br />
              <span className="text-gradient-blue">Pennsylvania</span>
            </h2>
            <p className="text-steel-400 text-lg leading-relaxed mb-8">
              We provide HVAC, plumbing, electrical, and mechanical contracting services
              throughout Lancaster County and the surrounding region. If your town
              isn&apos;t listed, call us — we likely cover your area.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+1"
                className="btn-emergency text-base py-3.5 px-7">
                <Phone size={18} />
                Call to Confirm Coverage
              </a>
            </div>

            {/* Coverage callout */}
            <div className="mt-8 p-5 rounded-2xl bg-electric-500/8 border border-electric-500/20">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-electric-400 mt-0.5 shrink-0" />
                <p className="text-steel-300 text-sm leading-relaxed">
                  <span className="text-white font-semibold">Based in Lancaster County.</span>{' '}
                  We serve a 30-mile radius and beyond for commercial and emergency mechanical work.
                  Call to verify availability in your specific location.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — area tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-3">
              {areas.map((area, i) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-700/60 border border-navy-600/50 hover:border-electric-600/40 hover:bg-navy-700 transition-all duration-200 cursor-default"
                >
                  <MapPin size={12} className="text-electric-400 shrink-0" />
                  <span className="text-steel-200 text-sm font-medium">{area}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.25 + areas.length * 0.04 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-500/10 border border-electric-500/30 cursor-default"
              >
                <span className="text-electric-300 text-sm font-semibold">+ Many More</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
