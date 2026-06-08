'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PhoneCall } from 'lucide-react'
import Image from 'next/image'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#why-us' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-950/95 backdrop-blur-md border-b border-dark-800 py-3'
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 relative">
              <Image
                src="/logo.jpg"
                alt="Powell Renovations"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs tracking-[0.2em] text-gold-500 uppercase font-medium">Powell</p>
              <p className="text-sm font-semibold text-white tracking-wide leading-tight">Renovations</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-dark-300 hover:text-gold-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+17178183276"
              className="flex items-center gap-2 text-sm text-dark-300 hover:text-gold-400 transition-colors"
            >
              <PhoneCall size={15} />
              (717) 818-3276
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-sm text-sm font-semibold text-dark-950 transition-all duration-300 hover:shadow-gold-lg hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
            >
              Free Estimate
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-0 z-30 bg-dark-950 flex flex-col pt-24 px-6 pb-10 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-2xl font-display font-semibold text-white hover:text-gold-400 transition-colors border-b border-dark-800 pb-4"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <a
                href="tel:+17178183276"
                className="flex items-center justify-center gap-2 py-4 border border-gold-500 text-gold-400 font-semibold rounded-sm"
                onClick={() => setOpen(false)}
              >
                <PhoneCall size={18} />
                (717) 818-3276
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="py-4 text-center font-semibold text-dark-950 rounded-sm"
                style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
              >
                Get Free Estimate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
