'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X } from 'lucide-react'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const scroll = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-navy-900/98 backdrop-blur-md border-b border-navy-700/60 shadow-dark' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-blue-sm overflow-hidden shrink-0">
              <img src="/logo.jpg" alt="Shissler Mechanical LLC" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-none block text-white">
                Shissler <span className="text-electric-400">Mechanical LLC</span>
              </span>
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-steel-400">Licensed & Insured · 24/7</span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); scroll(l.href) }}
                className="px-4 py-2 text-sm font-medium text-steel-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+1" className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
              <Phone size={15} className="text-electric-400" />
              Call 24/7
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scroll('#contact') }}
              className="btn-primary text-sm py-2.5 px-5">
              Request Service
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy-900/80 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-navy-800 border-l border-navy-700 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-navy-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img src="/logo.jpg" alt="Shissler Mechanical LLC" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-white">Shissler Mechanical LLC</span>
                </div>
                <button onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {links.map((l, i) => (
                  <motion.a key={l.href} href={l.href}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={(e) => { e.preventDefault(); scroll(l.href) }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-steel-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-500/60" />
                    {l.label}
                  </motion.a>
                ))}
              </nav>
              <div className="px-4 pb-8 space-y-3">
                <a href="tel:+1" className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-electric-600/40 text-electric-300 font-semibold text-sm">
                  <Phone size={16} /> Call 24/7 — We Answer
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scroll('#contact') }}
                  className="btn-primary w-full justify-center">
                  Request Service
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
