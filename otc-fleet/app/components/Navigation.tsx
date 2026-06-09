'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Fleet Programs', href: '#fleet-programs' },
  { label: 'Trailer Dept.', href: '#trailer-department' },
  { label: 'Fleet Graphix', href: '#fleet-graphix' },
  { label: 'Snow Equipment', href: '#snow-equipment' },
  { label: 'Industries', href: '#industries' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md bg-charcoal-800/95 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'backdrop-blur-md bg-charcoal-800/80 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); handleNavClick('#hero') }}
              className="flex items-center gap-2 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/otc-logo.png"
                alt="OTC Fleet Services"
                width={220}
                height={60}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  img.style.display = 'none'
                  const fallback = img.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div className="items-center gap-0.5" style={{ display: 'none' }}>
                <span className="text-white font-bold text-lg lg:text-xl tracking-tight">
                  OTC Fleet
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-brand ml-0.5 mt-0 inline-block"
                  aria-hidden="true"
                />
                <span className="hidden sm:block text-slate-400 text-sm font-normal border-l border-white/20 pl-2 ml-1">
                  Services
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="nav-link px-3 py-2 rounded-md hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:7172083600"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium group"
              >
                <div className="w-7 h-7 rounded-full bg-brand/15 group-hover:bg-brand/25 flex items-center justify-center transition-colors">
                  <Phone className="w-3.5 h-3.5 text-brand" />
                </div>
                <span>717-208-3600</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
                className="btn-brand text-sm py-2 px-5"
              >
                Schedule Service
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="absolute inset-0 bg-charcoal-800/60 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-charcoal-800 border-l border-white/10 lg:hidden flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/otc-logo.png"
                  alt="OTC Fleet Services"
                  width={160}
                  height={44}
                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.display = 'none'
                    const fb = img.nextElementSibling as HTMLElement
                    if (fb) fb.style.display = 'flex'
                  }}
                />
                <div className="items-center gap-1" style={{ display: 'none' }}>
                  <span className="text-white font-bold text-lg">OTC Fleet</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand ml-0.5 inline-block" />
                  <span className="text-slate-400 text-sm ml-1">Services</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
              <div className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand/50 group-hover:bg-brand transition-colors" />
                    <span className="font-medium">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* Mobile CTA */}
            <div className="px-4 py-6 border-t border-white/10 space-y-3">
              <a
                href="tel:7172083600"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700 transition-colors text-white"
              >
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Lancaster</div>
                  <div className="font-semibold text-sm">717-208-3600</div>
                </div>
              </a>
              <a
                href="tel:6103744077"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-charcoal-700/50 hover:bg-charcoal-700 transition-colors text-white"
              >
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Berks County</div>
                  <div className="font-semibold text-sm">610-374-4077</div>
                </div>
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact') }}
                className="btn-brand w-full justify-center"
              >
                Schedule Service
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
