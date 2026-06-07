'use client'

import { motion } from 'framer-motion'
import {
  Layers,
  FileText,
  Truck,
  Star,
  AlertTriangle,
  Printer,
  ExternalLink,
  ArrowRight,
  CheckCircle,
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

const graphixServices = [
  { icon: Layers, label: 'Full vehicle wraps' },
  { icon: FileText, label: 'DOT-compliant lettering' },
  { icon: Truck, label: 'Custom trailer wraps and decals' },
  { icon: Star, label: 'Vehicle branding' },
  { icon: AlertTriangle, label: 'Reflective safety markings' },
  { icon: Printer, label: 'Large format printing' },
]

export default function FleetGraphix() {
  return (
    <section
      id="fleet-graphix"
      className="py-24 relative overflow-hidden bg-navy-950"
      aria-label="Fleet Graphix vehicle wraps and branding"
    >
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Large background "FG" text */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[300px] font-black text-white/[0.02] select-none pointer-events-none leading-none"
        aria-hidden="true"
      >
        FG
      </div>

      {/* Diamond pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(249,115,22,0.06) 0, rgba(249,115,22,0.06) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">
                  A Division of OTC Fleet Services
                </span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-none">
                Fleet
                <span className="gradient-text block">Graphix</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Fleet Graphix gives OTC fleet clients a faster, more cost-effective way to brand vehicles
                without needing a separate vendor. Because OTC is already servicing the fleet, wraps,
                lettering, and branding can be handled in-house while the vehicle is already off the road
                — saving time and money.
              </p>
            </FadeUp>

            {/* Services Two-Column */}
            <FadeUp delay={0.3}>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {graphixServices.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/60 border border-navy-700/60 hover:border-orange-500/40 hover:bg-navy-800/80 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <Icon className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                      {label}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-orange-500/50 ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <a
                href="https://www.fleetgraphixpa.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange inline-flex"
              >
                Learn More at FleetGraphixPA.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </FadeUp>
          </div>

          {/* Right: Vehicle wrap placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Main wrap preview card */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10"
                style={{ minHeight: '400px' }}
                data-placeholder="VehicleWrap.jpg"
              >
                {/* Gradient background simulating a wrapped vehicle */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-steel" />

                {/* Color band - simulating a vehicle wrap design */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-transparent to-navy-900/90" />

                  {/* Orange accent stripes */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-orange-500" />
                  <div
                    className="absolute top-1/3 left-0 right-0 h-16 opacity-20"
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(249,115,22,0.4) 50%, transparent 100%)',
                    }}
                  />

                  {/* Side stripes */}
                  <div className="absolute top-0 bottom-0 left-8 w-1 bg-orange-500/30" />
                  <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-orange-500/15" />
                  <div className="absolute top-0 bottom-0 right-8 w-1 bg-orange-500/30" />
                  <div className="absolute top-0 bottom-0 right-12 w-0.5 bg-orange-500/15" />

                  {/* Diagonal pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(135deg, rgba(249,115,22,0.3) 0, rgba(249,115,22,0.3) 2px, transparent 0, transparent 20px)',
                    }}
                  />
                </div>

                {/* Placeholder center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-4">
                    <Truck className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="text-white font-bold text-xl mb-1">Fleet Graphix</div>
                  <div className="text-slate-400 text-sm">VehicleWrap.jpg</div>
                  <div className="text-slate-600 text-xs mt-1">Vehicle Wrap & Branding Preview</div>
                </div>

                {/* Corner badge */}
                <div className="absolute top-4 right-4 glass-orange rounded-lg px-3 py-1.5 border border-orange-500/30">
                  <div className="text-orange-400 text-xs font-bold uppercase tracking-wide">In-House</div>
                </div>
              </div>

              {/* Stats below card */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: 'In-House', label: 'Production' },
                  { value: 'DOT', label: 'Compliant' },
                  { value: 'Faster', label: 'Turnaround' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-navy-800 border border-navy-700 rounded-xl p-3 text-center">
                    <div className="text-orange-400 font-bold text-sm">{value}</div>
                    <div className="text-slate-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom value prop */}
        <FadeUp delay={0.4}>
          <div className="mt-16 p-6 lg:p-8 rounded-2xl bg-navy-800/40 border border-navy-700 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-l-2xl" />
            <div className="grid md:grid-cols-3 gap-6 pl-4">
              <div>
                <div className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-2">
                  Save Time
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Vehicle graphics handled while your truck is already in the shop — no extra trips, no
                  additional downtime.
                </p>
              </div>
              <div>
                <div className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-2">
                  Save Money
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Bundling service and graphics eliminates the vendor management overhead and often
                  reduces overall costs.
                </p>
              </div>
              <div>
                <div className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-2">
                  Stay Compliant
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  DOT-compliant lettering and reflective safety markings installed correctly by professionals
                  who know commercial vehicles.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
