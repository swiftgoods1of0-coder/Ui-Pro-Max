'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
  Star,
  FileText,
  Briefcase,
  Shield,
  Loader2,
  AlertCircle,
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

const fleetSizes = ['1–5 vehicles', '6–15 vehicles', '16–50 vehicles', '51–100 vehicles', '100+ vehicles']
const serviceTypes = [
  'General Fleet Repair',
  'DOT Inspection',
  'Preventative Maintenance',
  'Mobile Service',
  'Trailer Service',
  'Fleet Program Inquiry',
  'Snow Equipment',
  'Vehicle Graphics / Fleet Graphix',
  'Emergency Service',
  'Other',
]
const locationOptions = ['Lancaster', 'Berks County', 'Mobile Service']

const quickLinks = [
  {
    icon: ExternalLink,
    label: 'Contact Us',
    href: 'https://www.otcfleet.com/contact-us',
    description: 'Official contact page',
  },
  {
    icon: Briefcase,
    label: 'Employment / Careers',
    href: 'https://www.otcfleet.com/careers',
    description: 'View open positions',
  },
  {
    icon: FileText,
    label: 'New Account Application',
    href: 'https://forms.wix.com/f/7032341824161186218',
    description: 'Apply for a fleet account',
  },
  {
    icon: Shield,
    label: 'Parts & Service Warranty',
    href: 'https://www.otcfleet.com/warranty',
    description: 'Warranty information',
  },
  {
    icon: Star,
    label: 'Review Us – Lancaster',
    href: 'https://g.page/r/CTQw_n9829lZEAE/review',
    description: 'Leave a Google review',
  },
  {
    icon: Star,
    label: 'Review Us – Berks',
    href: 'https://g.page/r/CQNtD81aJROfEAE/review',
    description: 'Leave a Google review',
  },
]

interface FormData {
  name: string
  company: string
  email: string
  phone: string
  fleetSize: string
  service: string
  location: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    fleetSize: '',
    service: '',
    location: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or call us directly.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 bg-charcoal-800" aria-label="Contact OTC Fleet Services">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <div className="section-eyebrow mb-3">Get In Touch</div>
            <div className="brand-line-lg mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              Contact OTC Fleet Services
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Ready to get your fleet on a program, schedule a repair, or just have questions? Reach out
              to our team in Lancaster or Berks County today.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left: Location cards + quick links */}
          <div className="space-y-5">
            {/* Lancaster */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-brand to-brand-dark" />
              <div className="p-5">
                <div className="text-brand text-xs font-bold uppercase tracking-widest mb-3">
                  Lancaster Location
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">480 Running Pump Road</div>
                      <div className="text-slate-400 text-xs">Lancaster, PA 17601</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="tel:7172083600" className="text-white text-sm font-semibold hover:text-brand transition-colors">
                      717-208-3600
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="mailto:info@otcfleet.com" className="text-white text-sm hover:text-brand transition-colors">
                      info@otcfleet.com
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <div className="text-slate-400 text-xs leading-relaxed">
                      Mon–Fri: 7:00 AM – 4:30 PM<br />
                      Saturday: By appointment only
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Berks */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-charcoal-900 border border-charcoal-700 rounded-xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-brand to-brand-dark" />
              <div className="p-5">
                <div className="text-brand text-xs font-bold uppercase tracking-widest mb-3">
                  Berks County Location
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="tel:6103744077" className="text-white text-sm font-semibold hover:text-brand transition-colors">
                      610-374-4077
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="mailto:info@otcfleet.com" className="text-white text-sm hover:text-brand transition-colors">
                      info@otcfleet.com
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <div className="text-slate-400 text-xs leading-relaxed">
                      Mon–Fri: 7:00 AM – 4:30 PM<br />
                      Saturday: By appointment only
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-5"
            >
              <div className="text-white font-bold text-sm mb-4">Quick Links</div>
              <div className="space-y-1">
                {quickLinks.map(({ icon: Icon, label, href, description }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-brand/70 group-hover:text-brand flex-shrink-0 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-300 text-xs font-medium group-hover:text-white transition-colors truncate">
                        {label}
                      </div>
                      <div className="text-slate-600 text-xs">{description}</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Center: Form + Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-charcoal-900 border border-charcoal-700 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
            >
              {/* Form header */}
              <div className="px-6 py-5 border-b border-charcoal-700">
                <h3 className="text-white text-xl font-bold">Send Us a Message</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Fill out the form and a member of our team will respond within one business day.
                </p>
              </div>

              <div className="p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="form-label">
                          Full Name <span className="text-brand">*</span>
                        </label>
                        <input
                          id="contact-name"
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
                        <label htmlFor="contact-company" className="form-label">
                          Company Name
                        </label>
                        <input
                          id="contact-company"
                          name="company"
                          type="text"
                          placeholder="ABC Trucking Co."
                          value={formData.company}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-email" className="form-label">
                          Email Address <span className="text-brand">*</span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="717-555-0100"
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-fleet-size" className="form-label">
                          Fleet Size
                        </label>
                        <select
                          id="contact-fleet-size"
                          name="fleetSize"
                          value={formData.fleetSize}
                          onChange={handleChange}
                          className="form-input"
                        >
                          <option value="">Select size...</option>
                          {fleetSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="contact-service" className="form-label">
                          Service Needed
                        </label>
                        <select
                          id="contact-service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="form-input"
                        >
                          <option value="">Select service...</option>
                          {serviceTypes.map((svc) => (
                            <option key={svc} value={svc}>{svc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-location" className="form-label">
                        Preferred Location / Service Type
                      </label>
                      <select
                        id="contact-location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select location or service type...</option>
                        {locationOptions.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="form-label">
                        Message <span className="text-brand">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us about your fleet, the service you need, or any questions you have..."
                        value={formData.message}
                        onChange={handleChange}
                        className="form-input resize-none"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button type="submit" className="btn-brand w-full justify-center" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-slate-600 text-xs text-center">
                      By submitting this form, you agree to be contacted by OTC Fleet Services regarding your inquiry.
                    </p>
                  </form>
                ) : (
                  <div className="py-16 text-center space-y-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-9 h-9 text-brand" />
                    </motion.div>
                    <div>
                      <div className="text-white font-bold text-2xl mb-2">Message Sent!</div>
                      <div className="text-slate-400 text-base leading-relaxed max-w-md mx-auto">
                        Thank you, {formData.name}! We&rsquo;ve received your message and will get back to
                        you within one business day.
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      <div className="text-slate-500 text-sm">Need immediate assistance? Call us:</div>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <a href="tel:7172083600" className="btn-brand text-sm py-2 px-4">
                          <Phone className="w-3.5 h-3.5" />
                          Lancaster: 717-208-3600
                        </a>
                        <a href="tel:6103744077" className="btn-outline-white text-sm py-2 px-4">
                          <Phone className="w-3.5 h-3.5" />
                          Berks: 610-374-4077
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Google Maps embed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 rounded-xl overflow-hidden border border-charcoal-700"
              style={{ height: '220px' }}
            >
              <iframe
                src="https://maps.google.com/maps?q=480+Running+Pump+Road,+Lancaster,+PA+17601&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="220"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) saturate(0.8) contrast(0.85)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OTC Fleet Services - Lancaster Location"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
