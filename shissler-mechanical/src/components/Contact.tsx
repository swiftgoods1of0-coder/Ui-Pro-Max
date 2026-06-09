'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

const info = [
  { icon: Phone, label: 'Phone', value: 'Call 24/7 — We Answer', sub: 'Emergency line available around the clock' },
  { icon: Clock, label: 'Hours', value: '24 Hours / 7 Days', sub: 'No extra charge to call any time' },
  { icon: MapPin, label: 'Location', value: 'Lancaster County, PA', sub: 'Serving Central Pennsylvania' },
  { icon: Mail, label: 'Email', value: 'info@shisslermechanical.com', sub: 'For non-urgent inquiries' },
]

const services = ['HVAC', 'Heating', 'Air Conditioning', 'Plumbing', 'Electrical', 'Mechanical Contracting', 'Emergency Service', 'Maintenance Plan']

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="py-24 bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">Get In Touch</p>
          <div className="divider-blue mx-auto mb-5" />
          <h2 className="font-display text-display text-white mb-4">
            Request Service Today
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto text-lg leading-relaxed">
            Fill out the form and we&apos;ll respond within the hour during business hours —
            or call us directly any time, day or night.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-5"
          >
            {info.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-navy-800/60 border border-navy-600/40"
                >
                  <div className="w-10 h-10 rounded-xl bg-electric-500/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-electric-400" />
                  </div>
                  <div>
                    <div className="text-steel-400 text-xs font-bold uppercase tracking-widest mb-0.5">{item.label}</div>
                    <div className="text-white font-semibold text-sm">{item.value}</div>
                    <div className="text-steel-500 text-xs mt-0.5">{item.sub}</div>
                  </div>
                </motion.div>
              )
            })}

            {/* Emergency CTA */}
            <a href="tel:+1" className="block w-full text-center py-4 px-6 rounded-2xl bg-electric-500 hover:bg-electric-400 text-white font-bold text-lg transition-all duration-200 shadow-blue-glow hover:-translate-y-0.5">
              <span className="flex items-center justify-center gap-2">
                <Phone size={20} />
                Call 24/7 Emergency Line
              </span>
            </a>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-navy-800/60 border border-navy-600/40 rounded-3xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-electric-500/15 border border-electric-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-electric-400" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-2">Request Received</h3>
                  <p className="text-steel-400 text-sm leading-relaxed">
                    We&apos;ll be in touch shortly. For immediate service, call our 24/7 line.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-steel-400 text-xs font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full bg-navy-700/60 border border-navy-600/60 rounded-xl px-4 py-3 text-white text-sm placeholder-steel-600 focus:outline-none focus:border-electric-500/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-steel-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="(717) 555-0100"
                        className="w-full bg-navy-700/60 border border-navy-600/60 rounded-xl px-4 py-3 text-white text-sm placeholder-steel-600 focus:outline-none focus:border-electric-500/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-steel-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full bg-navy-700/60 border border-navy-600/60 rounded-xl px-4 py-3 text-white text-sm placeholder-steel-600 focus:outline-none focus:border-electric-500/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-steel-400 text-xs font-semibold uppercase tracking-wider mb-2">Service Needed</label>
                    <select
                      value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full bg-navy-700/60 border border-navy-600/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/60 transition-colors appearance-none"
                    >
                      <option value="" className="bg-navy-800">Select a service...</option>
                      {services.map(s => (
                        <option key={s} value={s} className="bg-navy-800">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-steel-400 text-xs font-semibold uppercase tracking-wider mb-2">Describe the Issue *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us what's going on and we'll get you taken care of..."
                      rows={4}
                      className="w-full bg-navy-700/60 border border-navy-600/60 rounded-xl px-4 py-3 text-white text-sm placeholder-steel-600 focus:outline-none focus:border-electric-500/60 transition-colors resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary py-4 text-base justify-center">
                    <Send size={18} />
                    Send Service Request
                  </button>

                  <p className="text-steel-600 text-xs text-center">
                    For emergencies, please call directly — form responses may take up to 1 hour.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
