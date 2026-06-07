'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, MapPin, Wrench, Smartphone, BarChart2, Clock, Phone, Home, Star } from 'lucide-react'

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

const credibilityItems = [
  {
    icon: Clock,
    title: 'Fast Turnarounds',
    description: 'Priority fleet scheduling keeps your vehicles out of the shop and on the road.',
  },
  {
    icon: MapPin,
    title: 'Local Shops',
    description: 'Two convenient locations in Lancaster & Berks County serving Central PA.',
  },
  {
    icon: Wrench,
    title: 'Expert Technicians',
    description: 'Diesel, gas, trailer, and equipment specialists with deep commercial experience.',
  },
  {
    icon: Home,
    title: 'Mobile Service',
    description: 'Fully equipped mobile units that come to you across Central Pennsylvania.',
  },
  {
    icon: BarChart2,
    title: 'Digital Fleet Reporting',
    description: 'Real-time service records and fleet history through Fullbay digital reporting.',
  },
  {
    icon: Phone,
    title: 'Easy Communication',
    description: 'Reach us by phone, email, or online booking — we make it simple to schedule.',
  },
  {
    icon: Smartphone,
    title: 'In-Shop & On-Site',
    description: 'Flexible service options to fit your operation — bring it in or have us come out.',
  },
  {
    icon: Star,
    title: 'One-Stop Fleet Support',
    description: 'Repairs, maintenance, compliance, graphics, trailers, and snow equipment — all here.',
  },
]

export default function WhyOTC() {
  return (
    <section id="why-otc" className="py-24 bg-navy-900" aria-label="Why choose OTC">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <div className="section-eyebrow mb-3">Why Choose OTC</div>
            <div className="orange-line-lg mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Why Fleet Managers Choose OTC
            </h2>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Large image placeholder with overlay */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ minHeight: '480px' }}
              data-placeholder="FleetShop.jpg"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-steel" />

              {/* Industrial pattern */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(249,115,22,0.08) 0, rgba(249,115,22,0.08) 2px, transparent 0, transparent 50%)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />

              {/* Placeholder label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-slate-600 text-sm font-medium">FleetShop.jpg</span>
              </div>

              {/* Overlay content bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/90 to-transparent p-8">
                <div className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  Trusted Partner
                </div>
                <h3 className="text-white text-2xl font-bold leading-tight mb-2">
                  Your Fleet Is Our Priority
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  OTC Fleet Services has been keeping commercial fleets moving across Central
                  Pennsylvania for over 20 years. We know what fleet managers need: fast service,
                  honest communication, and reliable results.
                </p>
              </div>

              {/* Orange top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 glass rounded-xl p-4 border border-white/15 shadow-xl"
            >
              <div className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                Response Time
              </div>
              <div className="text-white text-xl font-bold">Same Day</div>
              <div className="text-slate-400 text-xs">For fleet customers</div>
            </motion.div>
          </motion.div>

          {/* Right: Credibility grid */}
          <div className="space-y-4">
            {credibilityItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-navy-800/60 border border-navy-700/60
                    hover:border-orange-500/30 hover:bg-navy-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-slate-400 text-sm leading-relaxed">{item.description}</div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-orange-500/60 flex-shrink-0 mt-0.5 ml-auto" />
                </motion.div>
              )
            })}

            {/* CTA */}
            <FadeUp delay={0.4}>
              <div className="pt-4">
                <a
                  href="#fleet-programs"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#fleet-programs')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-orange w-full justify-center"
                >
                  Get a Fleet Program Quote
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
