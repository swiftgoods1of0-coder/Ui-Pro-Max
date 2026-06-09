'use client'
import { Phone, Mail, MapPin } from 'lucide-react'

const services = ['HVAC', 'Heating', 'Air Conditioning', 'Plumbing', 'Electrical', 'Water Conditioning', 'Mechanical Contracting', 'Emergency Service', 'Maintenance Plans']
const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Service Areas', href: '#service-areas' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const scroll = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#020810] border-t border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.jpg" alt="Shissler Mechanical LLC" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white leading-none block">
                  Shissler <span className="text-electric-400">Mechanical LLC</span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-steel-500">Licensed & Insured · 24/7</span>
              </div>
            </div>
            <p className="text-steel-500 text-sm leading-relaxed mb-6">
              Expert HVAC, plumbing, electrical, water conditioning, and mechanical contracting
              for residential and commercial customers throughout Central Pennsylvania.
            </p>
            <a href="tel:+1"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-500/10 border border-electric-500/25 hover:bg-electric-500/20 hover:border-electric-500/50 transition-all text-electric-300 font-semibold text-sm">
              <Phone size={15} />
              Call 24/7
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s}>
                  <a href="#services" onClick={(e) => { e.preventDefault(); scroll('#services') }}
                    className="text-steel-500 hover:text-steel-200 text-sm transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scroll(l.href) }}
                    className="text-steel-500 hover:text-steel-200 text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-electric-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-steel-300 text-sm font-medium">24/7 Phone</div>
                  <div className="text-steel-500 text-xs">Emergency line available</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-electric-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-steel-300 text-sm font-medium">Email</div>
                  <div className="text-steel-500 text-xs">info@shisslermechanical.com</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-electric-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-steel-300 text-sm font-medium">Lancaster County, PA</div>
                  <div className="text-steel-500 text-xs">Serving Central Pennsylvania</div>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-electric-500/8 border border-electric-500/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-electric-400 animate-pulse" />
                <span className="text-electric-300 text-xs font-bold uppercase tracking-wider">Always Available</span>
              </div>
              <p className="text-steel-400 text-xs">24 hours · 7 days · 365 days a year</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-steel-600 text-xs">
            &copy; {year} Shissler Mechanical LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-steel-600 text-xs">Licensed & Insured</span>
            <span className="text-navy-700">·</span>
            <span className="text-steel-600 text-xs">Central Pennsylvania</span>
            <span className="text-navy-700">·</span>
            <span className="text-steel-600 text-xs">All Trades</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
