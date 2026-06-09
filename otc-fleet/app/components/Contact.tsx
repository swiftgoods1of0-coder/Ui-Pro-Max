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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 bg-charcoal-800" aria-label="Contact OTC Fleet Services">
      {/* Top accent */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

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
          {/* Left: Location info cards */}
          <div className="space-y-5">
            {/* Lancaster */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-brand to-brand-dark-dark-dark" />
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
              className="bg-charcoal-800 border border-charcoal-700 rounded-xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-charcoal-900 to-charcoal-950" />
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
              className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-5"
            >
              <div className="text-white font-bold text-sm mb-4">Quick Links</div>
              <div className="space-y-2">
                {quickLinks.map(({ icon: Icon, label, href, description }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-charcoal-800 transition-colors group"
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

          {/* Center: Contact form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-charcoal-800 border border-charcoal-700 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
            >
              {/* Form header */}
              <div className="px-6 py-5 border-b border-charcoal-700 bg-charcoal-800/50">
                <h3 className="text-white text-xl font-bold">Send Us a Message</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Fill out the form and a member of our team will respond within one business day.
                </p>
              </div>

              <div className="p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
                    {/* Row 1: Name + Company */}
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

                    {/* Row 2: Email + Phone */}
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

                    {/* Row 3: Fleet size + Service */}
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
                          <option value="" disabled>
                            Select size...
                          </option>
                          {fleetSizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
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
                          <option value="" disabled>
                            Select service...
                          </option>
                          {serviceTypes.map((svc) => (
                            <option key={svc} value={svc}>
                              {svc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Location */}
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
                        <option value="" disabled>
                          Select location or service type...
                        </option>
                        {locationOptions.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Row 5: Message */}
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

                    {/* Submit */}
                    <button type="submit" className="btn-brand w-full justify-center">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>

                    <p className="text-slate-600 text-xs text-center">
                      By submitting this form, you agree to be contacted by OTC Fleet Services regarding
                      your inquiry.
                    </p>
                  </form>
                ) : (
                  <div className="py-16 text-center space-y-5">
                    <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-9 h-9 text-brand" />
                    </div>
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

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 relative rounded-xl overflow-hidden border border-charcoal-700"
              style={{ height: '200px' }}
              data-placeholder="GoogleMap-Lancaster.jpg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 to-steel" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '25px 25px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <MapPin className="w-8 h-8 text-brand opacity-70" />
                <div className="text-center">
                  <div className="text-white text-sm font-semibold">OTC Fleet Services – Lancaster</div>
                  <div className="text-slate-400 text-xs">480 Running Pump Road, Lancaster, PA 17601</div>
                </div>
                <a
                  href="https://maps.google.com/?q=480+Running+Pump+Road+Lancaster+PA+17601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand text-xs hover:text-brand-light transition-colors flex items-center gap-1 mt-1"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
