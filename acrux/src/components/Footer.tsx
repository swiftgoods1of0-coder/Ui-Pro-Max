'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const links = {
  Services: ['Web Design', 'Development', 'Branding', 'SEO', 'AI Integration'],
  Company: ['About', 'Portfolio', 'Process', 'Careers', 'Blog'],
  Connect: ['hello@acrux.studio', 'Twitter / X', 'LinkedIn', 'Instagram', 'Dribbble'],
}

export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(0,102,255,0.1)] bg-[#010305]">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.5)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="ACRUX" width={36} height={36} className="rounded" />
              <span className="font-heading font-bold text-xl text-white tracking-widest">ACRUX</span>
            </div>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed max-w-xs mb-6">
              The North Star for modern businesses online. We build digital
              experiences that become competitive advantages.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Accepting new projects</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[var(--color-muted)] text-sm hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big tagline */}
        <div className="divider mb-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-heading font-bold text-2xl md:text-3xl text-gradient leading-tight"
          >
            Built To Be Remembered.
          </motion.p>
          <div className="flex flex-col items-start md:items-end gap-1">
            <p className="text-[var(--color-muted)] text-sm">
              © {new Date().getFullYear()} ACRUX Studio. All rights reserved.
            </p>
            <p className="text-[var(--color-muted)] text-xs">
              Privacy Policy · Terms of Service
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
