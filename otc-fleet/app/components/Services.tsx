'use client'

import { motion } from 'framer-motion'
import {
  Wrench,
  ClipboardCheck,
  Calendar,
  Truck,
  Box,
  BarChart2,
  Zap,
  Snowflake,
  ArrowRight,
} from 'lucide-react'

interface Service {
  icon: React.ElementType
  name: string
  description: string
}

const services: Service[] = [
  {
    icon: Wrench,
    name: 'Light, Medium & Heavy-Duty Repairs',
    description:
      'From oil changes to engine diagnostics, suspension work, diesel repairs, gas repairs, and equipment service. We handle it all with expert technicians and fast turnarounds.',
  },
  {
    icon: ClipboardCheck,
    name: 'DOT Inspections & Compliance',
    description:
      'Certified DOT inspections and compliance repairs to keep fleets road-legal and audit-ready. Stay ahead of regulations with trusted, thorough inspection services.',
  },
  {
    icon: Calendar,
    name: 'Preventative Maintenance Programs',
    description:
      "PM tracking by mileage, engine hours, or date to keep fleets proactive and avoid expensive breakdowns. Structured programs tailored to your fleet's schedule.",
  },
  {
    icon: Truck,
    name: 'Mobile Service Units',
    description:
      "Fully equipped mobile service trucks for on-site repairs and maintenance across Central PA. When your fleet can't come to us, we come to you.",
  },
  {
    icon: Box,
    name: 'Trailer Repairs & Service',
    description:
      'Brake jobs, lighting, suspension, welding, fabrication, refurb work, and custom upfits. Complete trailer support from our specialized Keystone Trailers division.',
  },
  {
    icon: BarChart2,
    name: 'Fleet Reporting & Records',
    description:
      "Digital service history through Fullbay with transparent access to records and maintenance history. Know what's been done, what's due, and what's coming.",
  },
  {
    icon: Zap,
    name: 'Emergency & Priority Scheduling',
    description:
      'Fast turnarounds and priority scheduling for commercial fleet customers. When downtime costs money, OTC gets you back on the road faster.',
  },
  {
    icon: Snowflake,
    name: 'Snow Equipment Sales & Service',
    description:
      'Fisher snow plows in stock, installation, service, repairs, and seasonal prep. Keep your snow equipment ready for whatever winter brings.',
  },
]

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

export default function Services() {
  return (
    <section
      id="services"
      className="py-24"
      style={{ backgroundColor: '#0a0a0a' }}
      aria-label="Our services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <div className="section-eyebrow mb-3">What We Do</div>
            <div className="brand-line-lg mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              Complete Fleet Services
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Everything your fleet needs under one roof — or at your door. OTC Fleet Services is
              built to keep commercial fleets running efficiently across Central Pennsylvania.
            </p>
          </div>
        </FadeUp>

        {/* Shop Photo Feature */}
        <FadeUp delay={0.2}>
          <div className="relative rounded-2xl overflow-hidden mb-14" style={{ height: '360px' }}>
            <img
              src="/shop-clean.jpg"
              alt="OTC Fleet Services shop bay — professional service facility in Lancaster, PA"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.92) 30%, rgba(10,10,10,0.4) 70%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, #FFD400, #e6bf00, transparent)' }} />
            <div className="absolute inset-0 flex items-center px-10 lg:px-16">
              <div className="max-w-md">
                <div className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#FFD400' }}>Our Facility</div>
                <h3 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-3">
                  State-of-the-Art<br />Service Bays
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Heavy-duty lifts, diagnostic equipment, and a fully equipped team — built to handle every vehicle in your fleet, fast.
                </p>
                <div className="flex gap-6">
                  {[['8+', 'Service Bays'], ['2', 'Locations'], ['20+', 'Years Experience']].map(([val, label]) => (
                    <div key={label}>
                      <div className="text-white text-xl font-bold" style={{ color: '#FFD400' }}>{val}</div>
                      <div className="text-slate-400 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-xl p-6 cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #222222',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,212,0,0.4)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222222'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Brand left border accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#FFD400' }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255,212,0,0.08)',
                    border: '1px solid rgba(255,212,0,0.15)',
                  }}
                >
                  <Icon className="w-6 h-6 transition-colors" style={{ color: '#FFD400' }} />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-base mb-2 leading-tight">
                  {service.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <FadeUp delay={0.3}>
          <div className="text-center mt-12">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-brand inline-flex"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
