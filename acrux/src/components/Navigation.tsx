'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Services',   href: '#services',   id: 'services'   },
  { label: 'Portfolio',  href: '#portfolio',  id: 'portfolio'  },
  { label: 'About',      href: '#why-acrux',  id: 'why-acrux'  },
  { label: 'Contact',    href: '#contact',    id: 'contact'    },
]

export function Navigation() {
  const [scrolled,    setScrolled]   = useState(false)
  const [mobileOpen,  setMobileOpen] = useState(false)
  const [activeId,    setActiveId]   = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            (a.boundingClientRect.top < b.boundingClientRect.top ? a : b)
          )
          setActiveId(top.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sections.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(2,5,8,0.85)] backdrop-blur-xl border-b border-[rgba(0,102,255,0.12)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group" data-magnetic>
            <div className="relative">
              <div className="absolute inset-0 rounded blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                   style={{ background: 'rgba(0,102,255,0.4)' }} />
              <Image src="/logo.png" alt="ACRUX" width={28} height={28} className="relative rounded" />
            </div>
            <span className="font-heading font-bold text-base tracking-[0.3em] text-white uppercase">
              Acrux
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 group ${
                    isActive ? 'text-white' : 'text-[var(--color-muted)] hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[#0066ff] to-[#00ccff] transition-all duration-300 ease-out"
                    style={{ width: isActive ? '100%' : '0%' }}
                  />
                  {!isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#0066ff] to-[#00ccff] group-hover:w-full transition-all duration-300 ease-out" />
                  )}
                </a>
              )
            })}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <motion.a
              href="#contact"
              data-magnetic
              className="hidden sm:inline-flex btn-primary px-5 py-2 rounded-full text-sm font-semibold tracking-wide relative overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="relative z-10">Start Project</span>
            </motion.a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`block h-px w-5 bg-white transition-transform duration-300 ${mobileOpen ? 'translate-y-[9px] rotate-45' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-transform duration-300 ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: 'rgba(2,5,8,0.97)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading font-bold text-4xl text-white hover:text-gradient-blue transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
