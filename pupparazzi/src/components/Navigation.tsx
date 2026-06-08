'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Scissors } from 'lucide-react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled ? 'bg-white/96 backdrop-blur-md shadow-soft border-b border-warm-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
              <Scissors size={18} className="text-white" />
            </div>
            <div>
              <span className={`font-display font-bold text-base leading-none block transition-colors ${scrolled ? 'text-warm-950' : 'text-white'}`}>Pupparazzi</span>
              <span className={`text-[9px] font-medium tracking-[0.18em] uppercase transition-colors ${scrolled ? 'text-rose-400' : 'text-white/70'}`}>Dog & Cat Grooming</span>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className={`text-sm font-medium transition-colors hover:text-rose-500 ${scrolled ? 'text-warm-700' : 'text-white/90 hover:text-white'}`}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+17042678982"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${scrolled ? 'text-warm-800 hover:text-rose-600' : 'text-white/90 hover:text-white'}`}>
              <Phone size={14} />
              (704) 267-8982
            </a>
            <a href="sms:+17042678982"
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:shadow-rose hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
              Text To Book
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(true)}
            className={`lg:hidden p-2 rounded-xl ${scrolled ? 'text-warm-800' : 'text-white'}`}
            aria-label="Open menu">
            <Menu size={24} />
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
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="fixed inset-0 z-50 flex flex-col pt-20 px-6 pb-10 lg:hidden"
            style={{ background: 'linear-gradient(160deg,#1a0810,#3d0f20)' }}
          >
            <button onClick={() => setOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-white">
              <X size={26} />
            </button>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                <Scissors size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">Pupparazzi</span>
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-2xl font-display font-semibold text-white/90 hover:text-rose-300 transition-colors border-b border-white/10 pb-4">
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <a href="tel:+17042678982" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-4 border border-rose-400/40 text-rose-300 font-semibold rounded-2xl">
                <Phone size={18} /> (704) 267-8982
              </a>
              <a href="sms:+17042678982" onClick={() => setOpen(false)}
                className="flex items-center justify-center py-4 font-semibold text-white rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                Text To Book
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
