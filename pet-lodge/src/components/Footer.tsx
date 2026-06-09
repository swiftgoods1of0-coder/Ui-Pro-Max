'use client'

import { MapPin, Phone, Mail, Facebook, Instagram, Heart } from 'lucide-react'

function PawLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#3d7848"/>
      <ellipse cx="14" cy="13" rx="3" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="22" cy="13" rx="3" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="10" cy="18" rx="2.5" ry="3.5" fill="white" opacity="0.9"/>
      <ellipse cx="26" cy="18" rx="2.5" ry="3.5" fill="white" opacity="0.9"/>
      <path d="M18 14c-5 0-8 3-8 6s2 5 8 5 8-2 8-5-3-6-8-6z" fill="white" opacity="0.9"/>
    </svg>
  )
}

const services = ['Pet Boarding', 'Doggy Daycare', 'Pet Grooming', 'Dog Walking']


export default function Footer() {
  return (
    <footer className="bg-forest-900 text-sage-200 overflow-hidden">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <PawLogo />
              <div>
                <p className="font-display font-bold text-xl text-white">The Pet Lodge</p>
                <p className="text-xs text-sage-400 tracking-widest uppercase">Leonardtown, MD</p>
              </div>
            </div>
            <p className="text-sage-300 leading-relaxed mb-6 max-w-xs">
              Southern Maryland&apos;s most trusted pet resort. Boarding, daycare, grooming,
              and walks — all under one roof with one standard of care.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-forest-700 hover:bg-sage-600 flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-forest-700 hover:bg-sage-600 flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sage-300 hover:text-sage-100 transition-colors text-sm">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-sage-500 shrink-0 mt-0.5" />
                <span className="text-sage-300 text-sm">Leonardtown, Maryland</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-sage-500 shrink-0" />
                <a href="tel:+13014752142" className="text-sage-300 hover:text-white transition-colors text-sm">
                  (301) 475-2142
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-sage-500 shrink-0" />
                <a href="mailto:info@thepetlodge.com" className="text-sage-300 hover:text-white transition-colors text-sm">
                  info@thepetlodge.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-sage-500 uppercase tracking-wider mb-2">Hours</p>
              <p className="text-sage-300 text-sm">Mon–Fri: 7am – 6pm</p>
              <p className="text-sage-300 text-sm">Sat: 8am – 5pm</p>
              <p className="text-sage-400 text-xs mt-1">Closed Sunday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sage-500 text-xs">
            © {new Date().getFullYear()} The Pet Lodge · Leonardtown, MD · All Rights Reserved
          </p>
          <p className="text-sage-500 text-xs flex items-center gap-1.5">
            Made with <Heart size={11} className="text-tan-500 fill-tan-500" /> for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
