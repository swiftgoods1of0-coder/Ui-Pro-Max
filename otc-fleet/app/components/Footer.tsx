'use client'

import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'

const serviceLinks = [
  { label: 'Light, Medium & Heavy Repairs', href: '#services' },
  { label: 'DOT Inspections & Compliance', href: '#services' },
  { label: 'Preventative Maintenance Programs', href: '#services' },
  { label: 'Mobile Service Units', href: '#services' },
  { label: 'Trailer Repairs & Service', href: '#trailer-department' },
  { label: 'Fleet Reporting & Records', href: '#fleet-programs' },
  { label: 'Emergency & Priority Scheduling', href: '#services' },
  { label: 'Snow Equipment Sales & Service', href: '#snow-equipment' },
]

const companyLinks = [
  { label: 'Fleet Programs', href: '#fleet-programs' },
  { label: 'Trailer Department', href: '#trailer-department' },
  { label: 'Fleet Graphix', href: '#fleet-graphix' },
  { label: 'Snow Equipment', href: '#snow-equipment' },
  { label: 'Industries We Serve', href: '#industries' },
  { label: 'Careers', href: 'https://www.otcfleet.com/careers', external: true },
  { label: 'Contact', href: '#contact' },
  { label: 'New Account Application', href: 'https://forms.wix.com/f/7032341824161186218', external: true },
]

export default function Footer() {
  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-charcoal-800 border-t-2 border-brand" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Company info */}
          <div>
            {/* Logo */}
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/otc-logo.png"
                alt="OTC Fleet Services"
                width={220}
                height={60}
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  img.style.display = 'none'
                  const fb = img.nextElementSibling as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <div className="items-center gap-1" style={{ display: 'none' }}>
                <span className="text-white font-bold text-xl tracking-tight">OTC Fleet</span>
                <span className="w-2 h-2 rounded-full bg-brand ml-0.5 inline-block" aria-hidden="true" />
                <span className="text-slate-400 text-sm ml-1">Services</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Professional fleet repair, DOT inspections, preventative maintenance, mobile service,
              trailer service, and snow equipment support for businesses across Central Pennsylvania.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Lancaster Location</div>
                  <div className="text-slate-400">480 Running Pump Road, Lancaster, PA 17601</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                <div className="space-y-0.5">
                  <a href="tel:7172083600" className="block text-slate-300 hover:text-brand transition-colors">
                    Lancaster: 717-208-3600
                  </a>
                  <a href="tel:6103744077" className="block text-slate-300 hover:text-brand transition-colors">
                    Berks: 610-374-4077
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                <a href="mailto:info@otcfleet.com" className="text-slate-300 hover:text-brand transition-colors">
                  info@otcfleet.com
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/otcfleet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand/40 transition-all"
                aria-label="OTC Fleet on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/otcfleet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand/40 transition-all"
                aria-label="OTC Fleet on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand text-sm transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand/40 group-hover:bg-brand transition-colors flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={external ? undefined : (e) => handleAnchorClick(e, href)}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2 text-slate-400 hover:text-brand text-sm transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand/40 group-hover:bg-brand transition-colors flex-shrink-0" />
                    {label}
                    {external && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Locations + Hours */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
              Locations & Hours
            </h3>

            <div className="space-y-5">
              {/* Lancaster */}
              <div>
                <div className="text-brand text-xs font-bold uppercase tracking-widest mb-2">
                  Lancaster
                </div>
                <div className="text-slate-400 text-sm space-y-1">
                  <div>480 Running Pump Road</div>
                  <div>Lancaster, PA 17601</div>
                  <a href="tel:7172083600" className="block font-medium text-slate-300 hover:text-brand transition-colors">
                    717-208-3600
                  </a>
                </div>
              </div>

              {/* Berks */}
              <div>
                <div className="text-brand text-xs font-bold uppercase tracking-widest mb-2">
                  Berks County
                </div>
                <div className="text-slate-400 text-sm">
                  <a href="tel:6103744077" className="block font-medium text-slate-300 hover:text-brand transition-colors">
                    610-374-4077
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-brand" />
                  <div className="text-brand text-xs font-bold uppercase tracking-widest">
                    Hours
                  </div>
                </div>
                <div className="text-slate-400 text-sm space-y-1">
                  <div className="flex justify-between gap-3">
                    <span>Mon – Fri:</span>
                    <span className="text-slate-300">7:00 AM – 4:30 PM</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Saturday:</span>
                    <span className="text-slate-300">By appointment</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Sunday:</span>
                    <span className="text-slate-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Division links */}
              <div className="pt-2">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Divisions</div>
                <div className="space-y-1.5">
                  <a
                    href="https://keystonetrailers.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-brand text-xs transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Keystone Trailers
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href="https://www.fleetgraphixpa.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-brand text-xs transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Fleet Graphix PA
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs text-center sm:text-left">
              &copy; {new Date().getFullYear()} Mobiltech Companies LLC. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://www.otcfleet.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Terms of Service
              </a>
              <span className="text-charcoal-600">·</span>
              <a
                href="https://www.otcfleet.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-charcoal-600">·</span>
              <a
                href="https://www.otcfleet.com/warranty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Warranty
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
