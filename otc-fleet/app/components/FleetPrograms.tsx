'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  BarChart2,
  ShieldCheck,
  Truck,
  DollarSign,
  FileText,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Send,
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

const programFeatures = [
  {
    icon: Calendar,
    title: 'Preventative Maintenance Schedules',
    description: 'Customized PM intervals by mileage, hours, or date — built around your fleet\'s needs.',
  },
  {
    icon: Clock,
    title: 'Priority Fleet Scheduling',
    description: 'Fleet accounts receive priority booking so vehicles spend less time waiting.',
  },
  {
    icon: FileText,
    title: 'Digital Service History',
    description: 'Complete maintenance records accessible any time through Fullbay digital reporting.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Tracking',
    description: 'Stay ahead of DOT requirements with structured inspection and compliance schedules.',
  },
  {
    icon: Truck,
    title: 'Mobile Service',
    description: 'On-site service options available for fleet customers throughout Central PA.',
  },
  {
    icon: DollarSign,
    title: 'Cost Control',
    description: 'Proactive maintenance reduces emergency repairs and unexpected downtime costs.',
  },
  {
    icon: BarChart2,
    title: 'Fleet Reporting',
    description: 'Regular reporting gives fleet managers the data they need to make smart decisions.',
  },
  {
    icon: MessageSquare,
    title: 'Dedicated Communication',
    description: 'A single point of contact for your fleet — consistent, responsive, and accountable.',
  },
]

const fleetSizes = ['1–5 vehicles', '6–15 vehicles', '16–50 vehicles', '51–100 vehicles', '100+ vehicles']

export default function FleetPrograms() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    fleetSize: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="fleet-programs" className="py-24 bg-navy-900 relative overflow-hidden" aria-label="Fleet programs">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-navy-600/20 blur-[80px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Content */}
          <div>
            <FadeUp>
              <div className="section-eyebrow mb-3">Fleet Programs</div>
              <div className="orange-line mb-6" />
              <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                Structured Fleet Programs Built for Business
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                OTC helps companies reduce downtime, control maintenance costs, stay compliant, and keep
                vehicles moving with structured fleet maintenance programs designed around your operation —
                not a generic template.
              </p>
            </FadeUp>

            {/* Feature list */}
            <div className="space-y-4">
              {programFeatures.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-navy-800/50 border border-navy-700/50
                      hover:border-orange-500/30 hover:bg-navy-800/70 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <Icon className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-0.5 flex items-center gap-2">
                        {feature.title}
                        <CheckCircle className="w-3.5 h-3.5 text-orange-500/60" />
                      </div>
                      <div className="text-slate-400 text-sm leading-relaxed">{feature.description}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: Get Started Card */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl border border-white/10 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
                <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
                  Fleet Program Inquiry
                </div>
                <h3 className="text-white text-2xl font-bold">Get Started Today</h3>
                <p className="text-white/80 text-sm mt-1">
                  Tell us about your fleet and we&rsquo;ll put together a program that fits.
                </p>
              </div>

              {/* Form */}
              <div className="p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="fp-name" className="form-label">
                        Your Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        id="fp-name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="fp-company" className="form-label">
                        Company Name <span className="text-orange-400">*</span>
                      </label>
                      <input
                        id="fp-company"
                        name="company"
                        type="text"
                        required
                        placeholder="ABC Distribution Inc."
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="fp-fleet-size" className="form-label">
                        Fleet Size <span className="text-orange-400">*</span>
                      </label>
                      <select
                        id="fp-fleet-size"
                        name="fleetSize"
                        required
                        value={formData.fleetSize}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="" disabled>
                          Select fleet size...
                        </option>
                        {fleetSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn-orange w-full justify-center mt-2"
                    >
                      <Send className="w-4 h-4" />
                      Request Fleet Program Info
                    </button>

                    <p className="text-slate-500 text-xs text-center leading-relaxed">
                      Or call us directly:{' '}
                      <a href="tel:7172083600" className="text-orange-400 hover:text-orange-300 transition-colors">
                        717-208-3600
                      </a>
                    </p>
                  </form>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg mb-1">Request Received!</div>
                      <div className="text-slate-400 text-sm leading-relaxed">
                        Thank you, {formData.name}. We&rsquo;ll be in touch with information about a fleet
                        program for {formData.company} shortly.
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs">
                      Questions? Call{' '}
                      <a href="tel:7172083600" className="text-orange-400">
                        717-208-3600
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits strip */}
              <div className="border-t border-white/10 px-6 py-4 bg-navy-800/50">
                <div className="flex items-center justify-between gap-4">
                  {[
                    { label: 'No Setup Fee', icon: '✓' },
                    { label: 'Fast Response', icon: '✓' },
                    { label: 'Custom Plans', icon: '✓' },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-orange-400 font-bold">{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Arrow CTA below card */}
            <FadeUp delay={0.3}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-4 flex items-center justify-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium group"
              >
                View full contact options
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
