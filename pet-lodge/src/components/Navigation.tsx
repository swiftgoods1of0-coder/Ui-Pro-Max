'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#facility', label: 'Facility' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

function PawLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#2d6035"/>
      <ellipse cx="14" cy="13" rx="3" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="22" cy="13" rx="3" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="10" cy="18" rx="2.5" ry="3.5" fill="white" opacity="0.9"/>
      <ellipse cx="26" cy="18" rx="2.5" ry="3.5" fill="white" opacity="0.9"/>
      <path d="M18 14c-5 0-8 3-8 6s2 5 8 5 8-2 8-5-3-6-8-6z" fill="white" opacity="0.9"/>
    </svg>
  )
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-sage-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <PawLogo />
            <div>
              <span className={`font-display font-bold text-lg leading-none block transition-colors ${scrolled ? 'text-forest-800' : 'text-white'}`}>
                The Pet Lodge
              </span>
              <span className={`text-[10px] font-medium tracking-[0.18em] uppercase transition-colors ${scrolled ? 'text-sage-600' : 'text-white/70'}`}>
                Leonardtown, MD
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-sage-500 ${scrolled ? 'text-forest-700' : 'text-white/90 hover:text-white'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+13014752142"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${scrolled ? 'text-forest-700 hover:text-sage-600' : 'text-white/80 hover:text-white'}`}
            >
              <Phone size={14} />
              (301) 475-2142
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:shadow-lodge hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #2d6035, #5a9a65)' }}
            >
              Book A Stay
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-forest-800 hover:bg-sage-50' : 'text-white'}`}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed inset-0 z-50 bg-forest-900 flex flex-col pt-20 px-6 pb-10 lg:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
            <div className="flex items-center gap-3 mb-10">
              <PawLogo />
              <span className="font-display font-bold text-xl text-white">The Pet Lodge</span>
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-2xl font-display font-semibold text-white/90 hover:text-sage-300 transition-colors border-b border-forest-700 pb-4"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <a
                href="tel:+13014752142"
                className="flex items-center justify-center gap-2 py-4 border border-sage-600 text-sage-300 font-semibold rounded-2xl"
                onClick={() => setOpen(false)}
              >
                <Phone size={18} />
                (301) 475-2142
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-4 font-semibold text-white rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #2d6035, #5a9a65)' }}
              >
                Book A Stay
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
