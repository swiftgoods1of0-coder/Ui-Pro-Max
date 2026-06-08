import Image from 'next/image'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

const services = ['General Contracting', 'Kitchen Remodels', 'Bathroom Remodels', 'Basement Finishing', 'Plumbing Services', 'Pressure Washing', 'Deck Construction', 'Interior Painting']
const areas = ['York, PA', 'Hanover, PA', 'Red Lion, PA', 'Spring Grove, PA', 'Dallastown, PA', 'Shrewsbury, PA', 'Dover, PA', 'New Freedom, PA']

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 relative">
                <Image src="/logo.png" alt="Powell Renovations" fill sizes="48px" className="object-contain" />
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] text-gold-500 uppercase font-medium">Powell</p>
                <p className="text-sm font-semibold text-white tracking-wide">Renovations</p>
              </div>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed mb-5 max-w-xs">
              Premium home renovations, expert plumbing, and professional pressure washing —
              serving York County and beyond since 2014.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center border border-dark-700 rounded-sm text-dark-400 hover:border-gold-500/50 hover:text-gold-400 transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center border border-dark-700 rounded-sm text-dark-400 hover:border-gold-500/50 hover:text-gold-400 transition-all"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-dark-400 text-sm hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-600 shrink-0" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Service Areas</h3>
            <ul className="space-y-2">
              {areas.map((area) => (
                <li key={area}>
                  <span className="text-dark-400 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-600 shrink-0" />
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact</h3>
            <div className="space-y-4">
              <a href="tel:+17175550100" className="flex items-start gap-3 text-dark-400 hover:text-gold-400 transition-colors group">
                <Phone size={16} className="mt-0.5 shrink-0 group-hover:text-gold-400" />
                <span className="text-sm">(717) 555-0100</span>
              </a>
              <a href="mailto:info@powellrenovations.com" className="flex items-start gap-3 text-dark-400 hover:text-gold-400 transition-colors group">
                <Mail size={16} className="mt-0.5 shrink-0 group-hover:text-gold-400" />
                <span className="text-sm">info@powellrenovations.com</span>
              </a>
              <div className="flex items-start gap-3 text-dark-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-600" />
                <span className="text-sm">York, PA 17401<br />Serving South-Central PA</span>
              </div>
            </div>

            <div className="mt-6 p-4 border border-dark-800 rounded-sm">
              <p className="text-xs text-dark-400 uppercase tracking-wider mb-1 font-medium">Business Hours</p>
              <p className="text-sm text-dark-300">Mon – Fri: 7:00 AM – 6:00 PM</p>
              <p className="text-sm text-dark-300">Saturday: 8:00 AM – 2:00 PM</p>
              <p className="text-sm text-gold-500 mt-1">Emergency plumbing: 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dark-500">
          <p>© {new Date().getFullYear()} Powell Renovations. All rights reserved. PA HIC License.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
