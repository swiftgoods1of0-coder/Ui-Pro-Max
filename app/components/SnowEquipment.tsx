'use client'

import { motion } from 'framer-motion'
import {
  Snowflake,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Wrench,
  Package,
  Clock,
  Shield,
  Zap,
  Calendar,
  Star,
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

const snowServices = [
  { icon: Package, label: 'Fisher plows in stock', description: 'Live inventory with upfront pricing on available assemblies' },
  { icon: Star, label: 'Meyer, Truck Craft & more', description: 'Access to Meyer Products, Truck Craft, and additional brands' },
  { icon: Wrench, label: 'Snow plow installation', description: 'Professional installation by experienced technicians' },
  { icon: Shield, label: 'Preventative maintenance', description: 'Pre-season service to ensure your equipment is ready' },
  { icon: Zap, label: 'Snow equipment repair', description: 'In-season repairs and emergency turnarounds' },
  { icon: Calendar, label: 'Seasonal service', description: 'Full seasonal prep packages available for fleets' },
  { icon: Clock, label: 'Quick winter turnaround', description: 'Priority scheduling during active winter weather events' },
]

export default function SnowEquipment() {
  return (
    <section
      id="snow-equipment"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #040d1a 0%, #0a1628 40%, #0d1f3c 100%)' }}
      aria-label="Snow equipment sales and service"
    >
      {/* Background: icy geometric pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(147,210,252,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(147,210,252,0.08) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Snowflake pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(147,210,252,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Icy blue glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-blue-400/5 blur-[80px] pointer-events-none" />
      {/* Orange warm glow bottom right */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2 mb-4">
              <Snowflake className="w-5 h-5 text-blue-300" />
              <span className="text-blue-300 text-xs font-bold tracking-[0.25em] uppercase">
                Winter Service Program
              </span>
              <Snowflake className="w-5 h-5 text-blue-300" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="brand-line-lg mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              Snow Equipment Sales & Service
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              OTC Fleet Services has partnered with Keystone Trailers to offer reliable Fisher Snow Plows
              and snow removal equipment. Keystone Trailers provides live plow inventory with upfront
              pricing on available plow assemblies — so you know exactly what you&rsquo;re getting before you
              commit.
            </p>
          </FadeUp>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          {/* Left: Services list */}
          <div>
            <FadeUp>
              <h3 className="text-white text-2xl font-bold mb-6">What We Offer</h3>
            </FadeUp>

            <div className="space-y-3">
              {snowServices.map((service, i) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-charcoal-800/40 border border-charcoal-700/50
                      hover:border-blue-400/20 hover:bg-charcoal-800/60 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-400/20 transition-colors">
                      <Icon className="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5 flex items-center gap-2">
                        {service.label}
                        <CheckCircle className="w-3.5 h-3.5 text-brand/70" />
                      </div>
                      <div className="text-slate-400 text-sm leading-relaxed">{service.description}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: Visual card + CTA */}
          <div className="space-y-6">
            {/* Fisher brand card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative rounded-2xl overflow-hidden border border-charcoal-700 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                style={{ minHeight: '300px' }}
                data-placeholder="SnowPlow.jpg"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 to-charcoal-950" />

                {/* Icy texture */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at 30% 20%, rgba(147,210,252,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(147,210,252,0.1) 0%, transparent 50%)',
                  }}
                />

                {/* Diamond plate */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(147,210,252,0.1) 0, rgba(147,210,252,0.1) 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {/* Snowflakes decoration */}
                  <div className="flex gap-3 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Snowflake
                        key={i}
                        className={`text-blue-300/30 ${i === 2 ? 'w-8 h-8' : 'w-5 h-5'}`}
                      />
                    ))}
                  </div>

                  <div className="text-blue-300 text-xs font-bold tracking-[0.3em] uppercase mb-2">
                    Fisher Snow Plows
                  </div>
                  <div className="text-white text-3xl font-black mb-2">In Stock</div>
                  <div className="text-slate-400 text-sm mb-6">
                    Live inventory • Upfront pricing
                  </div>

                  <div className="text-slate-600 text-xs">SnowPlow.jpg</div>
                </div>

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/50 via-blue-300 to-blue-400/50" />
              </div>
            </motion.div>

            {/* Quick info cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'In Stock', label: 'Fisher Plows' },
                { value: 'Fast', label: 'Install Time' },
                { value: 'Expert', label: 'Technicians' },
                { value: 'Priority', label: 'Winter Service' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-charcoal-800/50 border border-charcoal-700 rounded-xl p-4 text-center hover:border-blue-400/30 transition-colors">
                  <div className="text-brand font-bold text-sm">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <FadeUp delay={0.3}>
              <a
                href="https://keystonetrailers.com/snow-removal"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand w-full justify-center"
              >
                <Snowflake className="w-4 h-4" />
                View Snow Plow Inventory
                <ExternalLink className="w-4 h-4" />
              </a>
            </FadeUp>

            {/* Contact teaser */}
            <FadeUp delay={0.35}>
              <p className="text-center text-slate-500 text-sm">
                Questions? Call{' '}
                <a href="tel:7175819020" className="text-brand hover:text-brand-light transition-colors">
                  717-581-9020
                </a>{' '}
                (Keystone Trailers Sales)
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Winter readiness callout bar */}
        <FadeUp delay={0.3}>
          <div className="p-6 lg:p-8 rounded-2xl border border-blue-400/20 bg-blue-400/5 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 10% 50%, rgba(147,210,252,0.5) 0%, transparent 40%), radial-gradient(circle at 90% 50%, rgba(147,210,252,0.3) 0%, transparent 40%)',
              }}
            />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-1">
                  Don&rsquo;t Wait for the First Snow
                </div>
                <div className="text-white text-xl font-bold">
                  Schedule Your Pre-Season Snow Equipment Service Now
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  Get your plows serviced, installed, and ready before the season hits.
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-brand whitespace-nowrap"
                >
                  Schedule Service
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
