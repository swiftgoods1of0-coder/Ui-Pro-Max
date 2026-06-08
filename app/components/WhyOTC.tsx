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
    <section id="why-otc" className="py-24 bg-charcoal-800" aria-label="Why choose OTC">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <div className="section-eyebrow mb-3">Why Choose OTC</div>
            <div className="brand-line-lg mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Why Fleet Managers Choose OTC
            </h2>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Premium stats feature panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ minHeight: '480px', backgroundColor: '#111111', border: '1px solid #222222' }}
            >
              {/* Top brand accent */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #FFD400, #e6bf00)' }} />

              {/* Grid texture */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {/* Diamond plate subtle texture */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,212,0,0.08) 0, rgba(255,212,0,0.08) 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px',
              }} />

              <div className="relative z-10 p-8 flex flex-col h-full" style={{ minHeight: '480px' }}>
                {/* Header */}
                <div className="mb-8">
                  <div className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#FFD400' }}>
                    Trusted Partner
                  </div>
                  <h3 className="text-white text-3xl font-bold leading-tight mb-3">
                    Your Fleet Is<br />Our Priority
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    OTC Fleet Services has been keeping commercial fleets moving across Central
                    Pennsylvania for over 20 years. Fast service, honest communication, reliable results.
                  </p>
                </div>

                {/* Big stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: '20+', label: 'Years in Business', sub: 'Since 2004' },
                    { value: '2', label: 'Shop Locations', sub: 'Lancaster & Berks' },
                    { value: 'Same Day', label: 'Response Time', sub: 'Fleet customers' },
                    { value: '100%', label: 'Digital Records', sub: 'Via Fullbay' },
                  ].map(({ value, label, sub }) => (
                    <div
                      key={label}
                      className="rounded-xl p-4"
                      style={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d' }}
                    >
                      <div className="text-2xl font-bold mb-0.5" style={{ color: '#FFD400' }}>{value}</div>
                      <div className="text-white text-xs font-semibold">{label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Two locations */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                  {[
                    { city: 'Lancaster', address: '480 Running Pump Rd', phone: '717-208-3600' },
                    { city: 'Berks County', address: 'Central PA Region', phone: '610-374-4077' },
                  ].map(({ city, address, phone }) => (
                    <div
                      key={city}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255,212,0,0.06)', border: '1px solid rgba(255,212,0,0.15)' }}
                    >
                      <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#FFD400' }}>{city}</div>
                      <div className="text-white text-sm font-semibold">{phone}</div>
                      <div className="text-slate-500 text-xs">{address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                  className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-800/60 border border-charcoal-700/60
                    hover:border-brand/30 hover:bg-charcoal-800/80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-slate-400 text-sm leading-relaxed">{item.description}</div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-brand/60 flex-shrink-0 mt-0.5 ml-auto" />
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
                  className="btn-brand w-full justify-center"
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
