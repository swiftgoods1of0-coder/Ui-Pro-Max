'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ShoppingCart,
  Wrench,
  Tag,
  Box,
  ArrowRight,
} from 'lucide-react'

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

const repairServices = [
  'Trailer brake jobs & adjustments',
  'Air system diagnostics & repair',
  'Landing gear service & replacement',
  'Lighting & electrical systems',
  'Suspension & axle work',
  'Structural welding & fabrication',
  'Floor & deck board replacement',
  'Roof & sidewall repairs',
  'Custom fabrication & upfits',
  'DOT inspection & compliance repairs',
  'Trailer refurbishment & restoration',
  'Hydraulic system service',
  'Fleet graphics & lettering',
]

const brands = [
  { name: 'BWise', type: 'Utility & Dump' },
  { name: 'Homesteader', type: 'Cargo & Enclosed' },
  { name: 'High Country', type: 'Heavy-Duty' },
  { name: 'Xpress', type: 'Aluminum & Tilt' },
]

export default function TrailerDepartment() {
  return (
    <section id="trailer-department" className="py-24 bg-navy-900" aria-label="Trailer department">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">
                A Division of OTC Fleet Services
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-orange-500/40" />
              <span className="text-slate-400 text-sm font-medium">Keystone Trailers</span>
              <div className="h-px w-12 bg-orange-500/40" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Trailer Sales, Service & Parts
            </h2>
            <p className="text-orange-400 text-xl font-semibold mb-6">Lancaster, PA</p>

            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              In early 2021, OTC Fleet Services acquired Keystone Trailers — a trusted name in trailer
              sales and service in Lancaster, PA. Now offering new and used trailer sales, expert repair,
              maintenance, customization, graphics, and fleet support all under one roof.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
          {/* Left: Repair services list */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-white text-2xl font-bold">Repair & Service</h3>
            </div>

            <div className="space-y-2.5">
              {repairServices.map((service, i) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-navy-800/50 border border-navy-700/50
                    hover:border-orange-500/30 hover:bg-navy-800/80 transition-all duration-200 group"
                >
                  <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                    {service}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Brands + Contact Info */}
          <div className="space-y-6">
            {/* Brands */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-navy-800 border border-navy-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-white font-bold text-lg">Brands We Carry</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {brands.map(({ name, type }) => (
                  <div
                    key={name}
                    className="p-3 rounded-lg bg-navy-900/60 border border-navy-700 hover:border-orange-500/40 transition-colors group"
                  >
                    <div className="text-white font-bold text-sm group-hover:text-orange-400 transition-colors">
                      {name}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">{type}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-navy-700">
                <a
                  href="https://keystonetrailers.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors group"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Browse Trailer Inventory at KeystoneTrailers.com
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden"
            >
              {/* Card top border accent */}
              <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Box className="w-4 h-4 text-orange-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Keystone Trailers</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">480 Running Pump Road</div>
                      <div className="text-slate-400 text-sm">Lancaster, PA 17601</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <div>
                        <span className="text-slate-400 text-xs uppercase tracking-wide">Sales</span>
                        <a
                          href="tel:7175819020"
                          className="block text-white text-sm font-semibold hover:text-orange-400 transition-colors"
                        >
                          717-581-9020
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs uppercase tracking-wide">Service</span>
                        <a
                          href="tel:7172083600"
                          className="block text-white text-sm font-semibold hover:text-orange-400 transition-colors"
                        >
                          717-208-3600 ext. 2
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Hours</div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400 text-sm">Sales:</span>
                          <span className="text-white text-sm">Mon–Fri 8AM–5PM, Sat by appt</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400 text-sm">Service:</span>
                          <span className="text-white text-sm">Mon–Fri 7AM–4:30PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden border border-navy-700"
              style={{ height: '180px' }}
              data-placeholder="LancasterMap.jpg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-steel" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <MapPin className="w-8 h-8 text-orange-400 opacity-60" />
                <div className="text-center">
                  <div className="text-white text-sm font-medium">480 Running Pump Road</div>
                  <div className="text-slate-400 text-xs">Lancaster, PA 17601</div>
                </div>
                <a
                  href="https://maps.google.com/?q=480+Running+Pump+Road+Lancaster+PA+17601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 text-xs hover:text-orange-300 transition-colors flex items-center gap-1 mt-1"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <FadeUp delay={0.3}>
          <div className="text-center">
            <a
              href="https://keystonetrailers.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange inline-flex"
            >
              Explore Trailer Inventory
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
